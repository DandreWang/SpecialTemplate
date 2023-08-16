// import store from '@common/store'
// import { logRequest } from './request'
// tz路径
const tzUrl = window.hdconfig.openwithtzUrl().replace(/http:/, 'https:')
const dfUrl = 'https://qs.dfcfw.com/'

const NU = navigator.userAgent

const { InApp, ISAndroid, ISIOS, setTitle: hySetTitle } = window.AG

// 移动端环境
const mobileEnv = {
  ios: !!NU.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  adr: !!NU.match(/(Android)|(Adr)/i),
  // 微信
  wx: !!NU.match(/micromessenger/i),
  // safari浏览器
  safari: !!NU.match(/Safari/i),
  // 是否是主包
  isMoney: !!NU.match(/(eastmoney\_(android|ios))/i) && !NU.match(/(qihuokaihu)|(qhsjkh)/i),
  // 是否是期货app
  isFutures: InApp && !!NU.match(/(qihuokaihu)|(qhsjkh)/i),
  // 是否是天天基金
  isFund: InApp && !!NU.match(/ttjj/i),
  // 是否为wap页面
  isWap: !InApp && !!window.location.href.match(/iswap/ig)
}

// 下载地址
const DOWNLOAD_URL = (opt = {}) => {
  const { isFund, isWap } = { ...mobileEnv, ...opt }
  const url = encodeURIComponent(window.location.href.replace(/(.*)\?.*/, '$1'))
  return `https://qhh5app.eastmoney.com/Qihuo${isFund ? 'Qudao' : isWap ? 'Wap' : ''}Download.aspx${isFund ? '' : `?url=${url}`}`
}

// app内touchstart，阻止click
const tss = (e, cb) => {
  if (!InApp) return
  e.preventDefault()
  e.stopPropagation()
  typeof cb === 'function' && cb()
}

/* *
 * 获取app版本号
 * @param {String} num 欲比较版本
 * @result {String} 未传参直接返回版本号
 * @result {Number} 当前版本 小于 欲比较 版本时为-1，等于为0，大于为1
 * */
const getAppVsn = num => {
  // 非APP环境直接返回
  if (!InApp) return null
  // 当前版本号
  const vsn = NU.replace(/(.*)appVersion[=_]([\d.]*)[\s,;](.*)/ig, '$2')
  // 未传参直接返回版本号
  if (typeof num === 'undefined') return vsn
  // 当前版本号
  const vsnAr = vsn.split('.')
  const numAr = num.split('.')
  // 标记位
  let flg = 0
  // 比较
  for (let i = 0; i < 4; i++) {
    let vi = vsnAr[i]
    typeof vi === 'undefined' && (vi = 0)
    let ni = numAr[i]
    typeof ni === 'undefined' && (ni = 0)
    // 差值
    const c = vi - ni
    // 相等则下一轮
    if (c === 0) continue
    // 不相等则更改flg
    flg = c > 0 ? 1 : -1
    break
  }
  return flg
}

// 格式化id地址
const fmtUrl = url => /^(http|eastmoney(qh|):\/\/|dfcf(t|qh):\/\/)/.test(url) ? url : /\d{4}/.test(url) ? `${dfUrl}${url}` : `${tzUrl}${url}`

/* *
 * 分享配置
 * @param {Object} opt 配置集合
 * - @param {String} imgUrl 分享图标路径
 * - @param {String} pageUrl 页面路径
 * - @param {String} title 分享标题
 * - @param {String} desc 分享描述
 * @param {Function | String} cb 回调函数/回调函数名称
 * */
const shareFun = (opt = {}, cb = _ => null) => {
  const { eventShare, emH5ShareNeed } = window.AG
  // https://qhh5.eastmoney.com/app/static/share.png
  const { pageUrl, title, desc, imgUrl = 'https://qhemrs.eastmoney.com/h5/resources/images/share.png' } = opt
  // 格式化地址
  const shareUrl = !pageUrl || pageUrl === 'null' || pageUrl === 'undefined' ? window.location.href : fmtUrl(pageUrl)
  // 回调函数
  const callbackname = typeof cb === 'string' ? cb : `cb_share_${new Date().getTime()}`
  // 赋值
  typeof cb === 'function' && (window[callbackname] = cb)
  // 环境
  const { isFund, isFutures } = mobileEnv
  // 判断环境
  if (isFund) {
    callFundService('wx_shareinfo', {
      HasWx: true,
      NeedLogin: false,
      WxTitle: title,
      WxContent: desc,
      WxUrl: shareUrl,
      WxImage: imgUrl,
      shareTypes: [0, 1]
    })
  } else if (InApp) {
    // 点击分享时调用
    window.emH5ShareInfo = _ => eventShare({
      callbackname,
      type: isFutures && getAppVsn('2.8.10') > 0 ? 'all' : 'weixin,pengyouquan,weibo,qq',
      img: imgUrl,
      url: shareUrl,
      ...opt
    })
    emH5ShareNeed(1)
  } else {
    window.emH5.Share({
      link: shareUrl,
      app: true,
      success: window[callbackname] || (_ => null),
      ...opt,
      // 分享图片(防止覆盖)
      imgUrl
    })
  }
}

const setTitle = title => {
  InApp ? hySetTitle(title) : document.querySelector('title').innerText = title
}

// 安卓下载
const androidDownload = src => {
  const iframe = document.createElement('iframe')
  // 隐藏
  iframe.style.display = 'none'
  // 生成iframe
  document.body.appendChild(Object.assign(iframe, {
    src,
    width: 1,
    border: 1
  }))
  setTimeout(_ => {
    iframe.remove()
  }, 5000)
}

// app内页面跳转
const appJump = (url = DOWNLOAD_URL()) => {
  // 格式化地址
  const href = fmtUrl(url)
  // 安卓环境兼容
  ISAndroid ? androidDownload(href) : (window.location.href = href)
}

/*
* 调用app内服务
* @Params {String} api 服务名称
* @Params {Object} options 配置项
* @Params {String/Func} cb 回调函数
* */
const callAppService = (api = '', options = {}, cb = _ => null) => {
  if (!mobileEnv.isMoney && !mobileEnv.isFutures) return
  // 回调函数
  const callbackname = typeof cb === 'string' ? cb : `cb_callAppService_${new Date().getTime()}`
  // 赋值
  typeof cb === 'function' && (window[callbackname] = cb)
  // 合并配置
  const opt = JSON.stringify({ callbackname, ...options })
  // 兼容
  ISIOS ? window.location.href = `${api}:${opt}` : prompt(api, opt)
}

/*
* 调用期货app内服务
* @Params {String} api 服务名称
* @Params {Object} options 配置项
* @Params {String/Func} cb 回调函数
* */
const callFuturesService = (code, options = {}, cb = _ => null) => {
  if (!mobileEnv.isFutures) return
  // 回调函数名称
  const jsback = typeof cb === 'string' ? cb : `cb_callFuturesService_${new Date().getTime()}_${code}`
  // 赋值
  typeof cb === 'function' && (window[jsback] = cb)
  // 合并配置
  const opt = JSON.stringify({ code, jsback, ...options })
  // 新版ios
  if (ISIOS && window.webkit && window.webkit.messageHandlers) {
    const { futures } = window.webkit.messageHandlers
    futures && futures.postMessage(opt)
  } else {
    window.futures && window.futures.callback(code, opt)
  }
}

/*
* 调用天天基金内服务
* @Params {String} method 服务名称
* @Params {Object} options 配置项
* @Params {String/Func} cb 回调函数
* */
const callFundService = (method = '', options = {}, cb = _ => null) => {
  if (!mobileEnv.isFund) return
  // 回调函数名称
  const callbackname = typeof cb === 'string' ? cb : `cb_callFundService_${new Date().getTime()}`
  // 赋值
  const opt = JSON.stringify({ callbackname, ...options })
  // 合并配置
  typeof cb === 'function' && (window[callbackname] = cb)
  // 兼容
  window.location.href = `emfundapp:${method}(${opt})`
}

/*
* 唤起APP
* @Params {String} downloadUrl 目标路径
* @Params {Object} opt 配置参数
* @Desc 其中ios/android属性值对应目标地址
* */
const openApp = (downloadUrl = DOWNLOAD_URL(), opt = {}) => {
  const {
    // 是否跳转下载
    downApp = false,
    // ios目标链接
    ios = 'wireless/txtrade/jumpOriginalViewController?view=EMHomepageViewController',
    // android目标链接
    android = 'home/kh',
    // 广告位ID
    adSerial,
    // 前缀
    prefix = undefined
  } = opt
  // 环境
  const { isFund, isMoney, adr } = mobileEnv
  // 目标地址
  const href = fmtUrl(downloadUrl)
  // 包名
  const appname = 'com.eastmoney.app.qhsjkh'
  // 调用基金app跳转
  // isFund ? logOfPackage({ adSerial }, _ => callFundService('open-other-app', {
  //   packagename: adr ? appname : `eastmoneyqh://${ios}`,
  //   downloadurl: adr ? href : 1214214120
  isFund ? logOfPackage({ adSerial }, _ => callFundService('appstore-detail', {
    appid: adr ? appname : 1214214120
    // 调用主包app跳转
  })) : isMoney ? callAppService(adr ? 'emH5toOpenApp' : 'emh5toopenapp', {
    appname,
    isLocal: true,
    scheme: `eastmoneyqh://${adr ? android : ios}`,
    ...opt
  }, async res => {
    if (res.code === 0 || !downApp) return
    // 下载时记录package来源
    await logOfPackage({ adSerial }, _ => {
      // 如果目标地址为下载，则使用iframe，否则直接跳转
      adr ? androidDownload(href) : (location.href = href)
      // typeof appCb === 'function' ? appCb(res) : ''
    })
    // 如果目标地址为下载，调用兼容方法
  }) : !InApp && downApp ? bsOpenApp(href, { ios, android }, prefix) : (location.href = href)
}

/*
* browser唤起APP
* @Params {Func} appCb APP内回调
* @Params {Object} opt 配置参数
* */
const bsOpenApp = (downloadUrl = DOWNLOAD_URL(), targetUrls = {
  ios: 'wireless/txtrade/jumpOriginalViewController?view=EMHomepageViewController',
  android: 'home/kh'
}, prefix = 'eastmoneyqh://') => {
  // 在app内 不执行
  if (InApp) return
  // 格式化地址
  const href = fmtUrl(downloadUrl)
  const { ios, adr, wx } = mobileEnv
  // 浏览器信息
  const iaFlg = wx ? false : ios ? 'ios' : adr ? 'android' : ''
  // 若为微信则直接跳转目标路径,为移动端浏览器则先访问短链，都不是也直接跳转目标路径
  window.location.href = iaFlg ? `${prefix}${targetUrls[iaFlg]}` : href
  // 设置访问下载链接的时间间隔
  iaFlg && setTimeout(_ => {
    // android下载地址
    window.location.href = href
  }, iaFlg === 'ios' ? 25 : 1000)
}


// 混合接口
const callHybridMethod = (moduleName, methodName, requestJson, cb) => {
  // 文本
  const callbackName = !cb ? 'futures_default' : typeof cb === 'string' ? cb : 'cb_' + moduleName + '_' + methodName
  // 赋值
  typeof cb === 'function' && (window[callbackName] = cb)
  // 合并配置
  const jsonStr = JSON.stringify({ moduleName, methodName, requestJson, callbackName })
  try {
    ISAndroid ? prompt('callHybridMethod', jsonStr)// 安卓
      : window.webkit.messageHandlers.callHybridMethod.postMessage(jsonStr)
  } catch (e) {
    throw new Error(`Failed of HybridMethod`)
    // window.location.href = 'callHybridMethod:' + jsonStr;
  }
}

/*
* browser唤起APP并跳转指定h5页面
* @Params {String} url h5页面链接
* @Params {Object} opt 配置参数
* @Params {Boolean} payFlg 支付
* */
const jumpH5Fmt = (payFlg, url = window.location.href, opt = {}) => {
  // 在app内 不执行
  if (mobileEnv.isFutures) return
  const search = require('qs').stringify(opt)
  const fmt = fmtUrl(url)
  // 格式化地址
  const href = encodeURIComponent(`${fmt}${fmt.indexOf('?') !== -1 ? '&' : '?'}${search}`)
  return {
    ios: `wireless/h5?url=${href}`,
    android: `home?jumpappurl=${encodeURIComponent(`${payFlg ? 'dfcft://webpayh5' : 'futures://newWebView'}?url=${href}`)}`
  }
}

/*
* @method 跳转开户
* @Params {Boolean} disCloud 禁用开户云
* @Params {Boolean} disLog 禁用日志
* */
const jumpOpenAccounting = async options => {
  // 配置参数
  const { disCloud, disLog } = options || {}
  // 环境
  const { ios, isFutures } = mobileEnv
  // 不在期货包则下载
  if (!isFutures) return bsOpenApp()
  // try {
  //   // 计数
  //   !disLog && await reqModule.request('log_submit', {
  //     url: encodeURIComponent(location.href),
  //     originalPackage: 'accounting',
  //     os: ios ? 'ios' : 'android'
  //   })
  // } finally {
  // 2.8.11起 跳转期货开户云
  const link = getAppVsn('2.8.10') > 0
    ? `dfcfqh://trade/kaihu${disCloud || getAppVsn('2.8.16') === 0 && ios ? '' : '?isDirect=1'}`
    : ios
      ? 'eastmoney://wireless/txtrade/jumpOriginalViewController?view=EMHomepageViewController'
      : 'dfcft://futureskaihu'
  // 跳转
  ios ? (window.location.href = link) : androidDownload(link)
  // }
}

/*
* @method 跳转行情
* @Params {Boolean} download 下载渠道包
* @Params {Boolean} futuresCode 合约代码 -1时 跳转至行情列表
* */
const jumpQuotation = async options => {
  // 配置参数
  const { download, futuresCode } = options || {}
  // 环境
  const { ios, isFutures } = mobileEnv
  // 期货包跳行情
  if (isFutures) {
    // 无具体合约不操作
    if (!futuresCode) return
    // 是否跳行情首页
    const toListFlag = Number(futuresCode) === -1
    // 跳行情
    const link = toListFlag ? {
      ios: `eastmoney://wireless/stocklist/switchSegment?index=0`,
      adr: `dfcft://homepage/hq`
    } : {
      ios: `eastmoney://page/stockpage?code=${encodeURIComponent(futuresCode)}&content=11`,
      adr: `dfcft://stock?stockcode=${futuresCode}&anchor=4`
    }
    // 已登录并且有合约号
    window.location.href = link[ios ? 'ios' : 'adr']
    // 跳行情列表ios需要关闭h5(2.9.6开始不调用)
    toListFlag && ios && getAppVsn('2.9.6') < 0 && callFuturesService('1000', {})
  } else {
    // 主包下载及跳行情
    openApp(download, Object.assign({ downApp: true }, futuresCode && {
      ios: `page/stockpage?code=${encodeURIComponent(encodeURIComponent(futuresCode))}&content=11`,
      android: `home?jumpappurl=dfcft://stock?stockcode=${futuresCode}&anchor=4`
    }))
  }
}

// 下载区分package
const logOfPackage = async (opt = {}, cb = _ => null) => {
  // const { adSerial } = opt
  // // 获取store里的信息
  // const { baseInfo } = store.getters
  // // 设备信息
  // const { isFund, isMoney, adr } = mobileEnv
  // 无来源时不记
  // const result = await logRequest({
  //   ...baseInfo,
  //   url: encodeURIComponent(location.href),
  //   originalPackage: isFund ? 'fundPackage' : isMoney ? 'mainPackage' : '',
  //   os: adr ? 'android' : 'ios',
  //   adSerial,
  //   ...opt
  // })
  // typeof cb === 'function' && cb(result)
  typeof cb === 'function' && cb()
}

// jsonp
const reqJsonp = (url, opts, fn) => {
  const o = { name: 'jsonpdata' }
  if (typeof opts === 'function') {
    fn = opts
    opts = o
  }
  if (!opts) opts = o
  // 请求路径
  const src = fmtUrl(url)
  const scripts = [...new Set(document.getElementsByTagName('script'))]
  // 如果有正在调用 则直接返回
  scripts.every(item => !item.src || item.src.indexOf(src) === -1) && require('jsonp')(src, opts, fn)
}

export default {
  androidDownload, tzUrl, appJump, callAppService, shareFun,
  openApp, bsOpenApp, fmtUrl, DOWNLOAD_URL, reqJsonp, jumpOpenAccounting, jumpQuotation,
  getAppVsn, callFuturesService, jumpH5Fmt, tss, mobileEnv, callFundService, logOfPackage, setTitle
}
