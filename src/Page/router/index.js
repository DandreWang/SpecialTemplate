import Vue from 'vue'
import Router from 'vue-router'
import { fmtRoutesList, routerBeforeEachFunc, routerAfterEachFunc } from './tools'

Vue.use(Router)

let routes = []
// 读取所有js文件
const requireModule = require.context('.', false, /^((?!(index|tools)).)+\.js$/)
requireModule.keys().forEach(fileName => {
  routes = routes.concat(requireModule(fileName).default)
})

const router = new Router(Object.assign({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '*', redirect: '/404' }
  ].concat(fmtRoutesList(routes))
}, process.env.NODE_ENV === 'production' && {
  mode: 'history', // 后端支持可开
  base: '/ztmb/'
}))

// router.beforeEach(routerBeforeEachFunc)
router.afterEach(routerAfterEachFunc)

export default router
