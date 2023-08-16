'use strict'
const path = require('path')
const fs = require('fs')
// const projectName = ''
const rootPath = fs.realpathSync(process.cwd()) // 项目根目录 fs.realpathSync表示获取真实路径
const resolve = relativePath => path.resolve(rootPath, relativePath) // 自定义一个resolve函数，拼接出需要的路径地址

module.exports = {
  entry: {
    CMS: 'main',
    Page: 'main',
    // integration: 'main',
  },
  rootPath, // 项目根目录
  commonPath: resolve('common'), // 公共目录
//  projectPath: resolve(`src/${projectName}`), // 子项目根目录
  config: resolve('config'), // 项目配置
  static: resolve('static') // 公共静态资源目录
}
