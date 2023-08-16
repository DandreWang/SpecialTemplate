import Vue from 'vue'
import Vuex from 'vuex'
import tools from '@common/utils/tools'

Vue.use(Vuex)
const store = new Vuex.Store({
  namespaced: true,
  modules: tools.getFiles(require.context('.', false, /^((?!index).)+\.js$/), 'js')
})

export default store

