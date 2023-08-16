import utils from '../utils'
import tools from '@common/utils/tools'

const { callAppService, callFuturesService, getAppVsn, isFund,
  mobileEnv, setTitle, shareFun } = utils

const { urlParse } = tools

// 默认方法
const { InApp } = window.AG
const { ios, adr, isFutures, isMoney } = mobileEnv

export const routerBeforeEachFunc = (to, from, next) => {
  // const { meta: { nologs, title } = {}} = to
  // window.history.replaceState(null, null, `${hybird.tzUrl}${name}`)
  // try {
    // 添加依赖
    // loadExternalDep(deps)
    // 不记录日志则直接返回
    // !nologs && logReq()
  // } catch (e) {
    // console.log(e)
  // } finally {
    next()
  // }
}

export const routerAfterEachFunc = (to, from) => {
  // const { meta: { shareOpt } = {}, fullPath } = to
  // ios reload event
  // ios切换不重新计算字号
  iosResize()
}

// 格式化路由数组
export const fmtRoutesList = list => list.map(opt => {
  const { path, folderPath, children } = opt
  return {
    path,
    component: () => import(`@/Page/views${folderPath || `${path}/index.vue`}`),
    meta: {
      ...opt,
      children: undefined
    },
    children: children ? fmtRoutesList(children) : undefined
  }
})

// ios切换页面重新计算fontSize
const iosResize = _ => {
  // 未设置字体
  if (document.querySelector('html').getAttribute('style')) return
  // 创建事件对象
  const e = document.createEvent('Event')
  // 事件初始化
  e.initEvent('resize', true, true)
  // 触发
  window.dispatchEvent(e)
}


