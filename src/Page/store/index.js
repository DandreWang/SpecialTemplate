import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

const modules = {}
// 读取所有js文件
const requireModule = require.context('./modules', false, /\.js$/)
requireModule.keys().forEach(fileName => {
  const moduleName = fileName.replace(/(\.\/|\.js)/g, '')
  modules[moduleName] = requireModule(fileName).default
})
Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  getters
})

export default store

