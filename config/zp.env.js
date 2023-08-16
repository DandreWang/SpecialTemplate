'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"zhoupu"',
  BASE_API: '""',
  BASE_PATH: '"/20190410/"'
})
