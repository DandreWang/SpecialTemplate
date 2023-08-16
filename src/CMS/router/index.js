import Vue from 'vue'
import Router from 'vue-router'
import { MessageBox } from 'element-ui'
import http from '@/CMS/api'
import utils from '@common/utils/crypto'
const { nodeEncrypt } = utils
const { NODE_ENV } = process.env
const jumpUrl = {
  development: 'http://10.228.131.27:8080/futuresAuthority/#/Login',
  test: 'http://10.228.131.27:8080/futuresAuthority/#/Login',
  production: 'https://qhgzz2.eastmoney.com/futuresAuthority/#/Login'
}
const isLogin = {
  development: 'http://10.228.131.8:8080/qhgzz/authority/isLogin,post',
  test: 'http://10.228.131.8:8080/qhgzz/authority/isLogin,post',
  production: 'https://qhgzz2.eastmoney.com/qhgzz/authority/isLogin,post'
}
// rsa公钥
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAK2IaLMengXdADXKwf469axbR+irOW3CwsfuyCwn8SO/iVpvFL498XAvcGLQB1qQtlmEN2Llv2zzq5qa8gNf7HEDPJJgzVaFV+RMdDn9PDBiV2jrY9UEuj5vh87I5u5hWcKLa9lwnO/H1gnaimIQdqVOG432B6i9qIsVx26N4sQIDAQAB'
Vue.use(Router)
export const routes = [{
  path: '/list',
  name: 'list',
  title: '专题列表',
  component: () => import('@/CMS/views/List/index')
}, {
  path: '/TempList',
  name: 'tempList',
  title: '模板列表',
  component: () => import('@/CMS/views/TempList/index')
}, {
  path: '/Upload',
  name: 'upload',
  title: '上传文件',
  component: () => import('@/CMS/views/Upload/index')
// }, {
//   path: '/ZbggList',
//   name: 'ZbggList',
//   title: '模板管理',
//   component: () => import('@/CMS/views/ZbggList/index')
// }, {
//   path: '/LinkManage',
//   name: 'LinkManage',
//   title: '链接管理',
//   component: () => import('@/CMS/views/LinkManage/index')
}]

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/CMS/views/Main/index'),
      children: routes
    }
  ]
})

// 后端未加token验证，每次切换页面都要验证
router.beforeEach(async(to, from, next) => {
  return next()
  // const tokenTmp = to.query.token ? to.query.token : localStorage.getItem('token')
  // const urlid = to.query.urlid ? to.query.urlid : localStorage.getItem('urlid')
  // localStorage.setItem('urlid', urlid)
  // const token = localStorage.getItem('token')
  // if (token || token !== tokenTmp) {
  //   http.request(isLogin[NODE_ENV], {
  //     token: nodeEncrypt(tokenTmp, publicKey),
  //     urlId: Number(urlid)
  //   }).then(res => {
  //     if (res.status === 0) {
  //       localStorage.setItem('token', tokenTmp)
  //       localStorage.setItem('urlid', Number(urlid))
  //       next()
  //     }
  //     if (res.status === -100) {
  //       return MessageBox.confirm('登录状态已失效，请重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '我不',
  //         type: 'warning'
  //       }).then(() => {
  //         localStorage.removeItem('token')
  //         localStorage.removeItem('urlid')
  //         // window.location.href = 'https://qhgzz2.eastmoney.com/futuresAuthority/#/Login'
  //         window.location.href = jumpUrl[NODE_ENV]
  //       })
  //     }
  //   })
  //   // localStorage.setItem('token', token)
  // } else if (!token) {
  //   return MessageBox.confirm('你还未登录，快去登录', '确认登录', {
  //     confirmButtonText: '收到',
  //     cancelButtonText: '我不',
  //     type: 'warning'
  //   }).then(() => {
  //     // window.location.href = 'https://qhgzz2.eastmoney.com/futuresAuthority/#/Login'
  //     window.location.href = jumpUrl[NODE_ENV]
  //   })
  // } else {
  //   next()
  // }
})

export default router
