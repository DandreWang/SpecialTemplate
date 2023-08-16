// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 360、ie不兼容问题
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@common/style/index.scss' // global css

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.use(ElementUI)

Vue.config.productionTip = false
// Vue.prototype.$ajax = axios
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
