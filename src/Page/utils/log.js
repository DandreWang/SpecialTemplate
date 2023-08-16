import { callFuturesService, mobileEnv } from './hybird'
// 埋点计数
export const logger = (pageId, khPageId) => {
  // 测试环境不打点
  if (process.env.NODE_ENV !== 'production') return
  // 页面ID
  if (pageId) {
    // 大数据计数
    window.emtj_pageId = pageId
    try {
      // 计数
      typeof window.emtjLaunch === 'function' && window.emtjLaunch()
    } catch (e) {
    }
  }
  // 开户埋点
  mobileEnv.isFutures && khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'openLuodiye' })
}
