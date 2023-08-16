import http from '@/Page/api'
import hybird from './hybird'

// 打点（归因）
const trackUrl = {
  development: 'http://10.228.131.7:8080/futures-management/template/save,post',
  production: 'https://qhdd.eastmoney.com/futures-management/template/save,post'
}
const { NODE_ENV } = process.env
const { mobileEnv: { ios }} = hybird

/**
 * @method pageTracker 主包归因打点
 * @param {Number} clickType 点击类型：0-页面访问 1-下载按钮点击 2-点击下载弹窗确认按钮 3-跳转至应用商店
 * @param {Number} templatepageId 专题编号
 * @param {String} commonDeviceId 设备id：euid-adr idfv-ios
 */
// const timer = false
export const pageTracker = (clickType, templatepageId, commonDeviceId) => {
  if (clickType === undefined || null || '') return Promise.resolve()
  console.log('clickType：', clickType)
  console.log('templateid:', templatepageId)
  console.log('common:', commonDeviceId)
  // // 节流
  // if (timer) return Promise.resolve()
  // timer = true
  // setTimeout(() => {
  //   timer = false
  // }, 300)
  return http.request(trackUrl[NODE_ENV], { platform: ios ? 1 : 2, clickType, templatepageId, commonDeviceId }, { hideMsg: true, noLoading: true })
}
