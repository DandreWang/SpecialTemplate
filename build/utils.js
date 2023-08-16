'use strict'
const path = require('path')
const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.assetsPath = function (_path) {
  const env = process.env.NODE_ENV === 'production' ? 'build' : 'dev'
  return path.posix.join(config[env].assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const minicssLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../../',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = []

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      loaders.push(minicssLoader)
    } else {
      loaders.push('vue-style-loader')
    }

    loaders.push(cssLoader)

    if (options.usePostCSS) {
      loaders.push(postcssLoader)
    }

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: {
          ...loaderOptions,
          sourceMap: options.sourceMap
        }
      })
    }

    return loaders
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

/*
获取本机IP
*/
exports.getIPAdress = () => {
  let localIPAddress = '';
  const interfaces = require('os').networkInterfaces();
  for (let devName in interfaces) {
    interfaces[devName].forEach(item => {
      const { family, address, internal } = item
      family === 'IPv4' && address !== '127.0.0.1' && !internal && (localIPAddress = address)
    })
  }
  return localIPAddress;
}

// 入口
exports.getEntry = entry => {
  const entryObj = {}
  Object.keys(entry).forEach(proName => {
    entryObj[proName] = path.resolve(__dirname, `../src/${proName}/${entry[proName]}.js`)
  })
  return entryObj
}

exports.getHtmlWebpackPlugin = entry => {
  const HtmlWebpackPluginList = []
  const entryNames = Object.keys(entry)
  entryNames.forEach(proName => {
    HtmlWebpackPluginList.push(
      new HtmlWebpackPlugin({
        filename: `${proName}.html`,
        template: path.resolve(__dirname, `../src/${proName}/index.html`),
        inject: true,
        title: proName,
        // excludeChunks: entryNames.filter(n => n !== proName)
        chunks: [proName]
      })
    )
  })
  return HtmlWebpackPluginList
}
