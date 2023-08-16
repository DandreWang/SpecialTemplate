'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const paths = require('../config/paths')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// 配置
const {
  index, assetsRoot,
  staticSubDirectory, productionSourceMap, devtool, productionGzip, productionGzipExtensions, bundleAnalyzerReport, generateAnalyzerReport
} = config.build
// 方法
const { getEntry, assetsPath, styleLoaders } = utils

const { env_config, project } = process.env
const env = require(`../config/${env_config}.env`)

// For NamedChunksPlugin
const seen = new Set()
const nameLength = 4

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: styleLoaders({
      sourceMap: productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: productionSourceMap ? devtool : false,
  entry: getEntry({
    [project]: paths.entry[project]
  }),
  output: {
    path: assetsRoot,
    // path: config.build.assetsRoot,
    filename: assetsPath('js/[name].[chunkhash:8].js'),
    chunkFilename: assetsPath('js/[name].[chunkhash:8].js')
  },
  plugins: [
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash:8].css'),
      chunkFilename: assetsPath('css/[name].[contenthash:8].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // filename: config.build.index,
      filename: index,
      // template: 'index.html',
      template: resolve(`src/${project}/index.html`),
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'qhh5',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
      // default sort mode uses toposort which cannot handle cyclic deps
      // in certain cases, and in webpack 4, chunk order in HTML doesn't
      // matter anyway
    }),
    new ScriptExtHtmlWebpackPlugin({
      //`runtime` must same as runtimeChunk name. default is `runtime`
      inline: /runtime\..*\.js$/
    }),
    // keep chunk.id stable when chunk has no name
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name
      }
      const modules = Array.from(chunk.modulesIterable)
      if (modules.length > 1) {
        const hash = require('hash-sum')
        const joinedHash = hash(modules.map(m => m.id).join('_'))
        let len = nameLength
        while (seen.has(joinedHash.substr(0, len))) len++
        seen.add(joinedHash.substr(0, len))
        const chunkName = joinedHash.substr(0, len)
        const { context } = modules.filter(({ context }) => context)[0]
        // return `chunk-${joinedHash.substr(0, len)}`
        return `${
          context && !/node_modules|common|utils/.test(context)
            ? context.replace(/.*views\\(.*)/, '$1')
              .replace(/.*views\/(.*)/, '$1')
              .replace(/.*src\\(.*)/, '$1')
              .replace(/.*src\/(.*)/, '$1')
              .replace(/(.*)\\images$/, '$1')
              .replace(/\\/g, '_')
              .replace(/(.*)\/images$/, '$1')
              .replace(/\//g, '_')
            : 'libs'
          }_${chunkName}`
      } else {
        return `libs/${modules[0].id.replace(/\//, '')}`
      }
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        // from: path.resolve(__dirname, '../static'),
        from: resolve(staticSubDirectory),
        to: staticSubDirectory,
        ignore: ['.*']
      },
      {
        // from: path.resolve(__dirname, '../static'),
        from: resolve(`src/${project}/${staticSubDirectory}`),
        to: staticSubDirectory,
        ignore: ['.*']
      }
    ]),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    },
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            safari10: true
          },
          compress: {
            warnings: false,
            // 以下两行配置，关闭 debug 和 console
            drop_debugger: true,
            drop_console: false
          }
        },
        sourceMap: productionSourceMap,
        cache: true,
        parallel: true
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSAssetsPlugin()
    ]
  }
})
if (productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + productionGzipExtensions.join('|') + ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (generateAnalyzerReport || bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin

  if (bundleAnalyzerReport) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8080,
        generateStatsFile: false
      })
    )
  }

  if (generateAnalyzerReport) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false
      })
    )
  }
}

module.exports = webpackConfig
