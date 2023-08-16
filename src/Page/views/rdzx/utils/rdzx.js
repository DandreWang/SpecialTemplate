import axios from 'axios'
import { getBaseParams, getBriefInfo } from './dataStore'
const baseParams = getBaseParams()
// 域名
const baseURL = {
  // development: 'http://10.228.131.7:8080/futures-management', // 测试
  development: 'http://gbapi-test.eastmoney.com', // 新的测试
  development: 'https://gbapi.eastmoney.com',
  production: 'https://gbapi.eastmoney.com', // 正式
}
  
const apis = {
  // 文章
  article: '/content/api/Post/ArticleContent',
  // article: 'https://gbapi.eastmoney.com/content/api/Post/ArticleContent',
  // article: 'http://newsinfo-uat.eastmoney.com/kuaixun/v2/api/content/getnews?newsid=202112152214457585&source=future_android&version=7023800&newstype=1',
  // 帖子互动数据
  briefInfo: '/abstract/api/PostShort/ArticleBriefInfo',
  // 评论
  replyList: '/reply/JSONP/ArticleNewReplyList',
  // 热门评论
  hotReplyList: '/reply/JSONP/ArticleHotReply',
  // 广告配置 post
  newsShareConfig: {
    development: 'http://10.228.131.104/commonConfig/api/appconfig/newsShare',
    production: 'https://qhclicfg.eastmoney.com/commonConfig/api/appconfig/newsShare',
  }
}

const formatUrl = (url, params) => {
  // {a: 1} => a=1
  const formatString = Object.keys(params).map(t=> [t, params[t]].join('=')).join('&')
  // 完整url
  if (/http/.test(url)) {
    if (params) return `${url}?${formatString}`
    return url;
  }
  // key拼接参数
  if (/\?/.test(url)) {
    const entries = url.split('?')
    return `${apis[entries[0]]}?${entries[1]}`
  }
  const base = baseURL[process.env.NODE_ENV]
  return `${base}${apis[url]}?${formatString}`
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
  const src = url
  const scripts = [...new Set(document.getElementsByTagName('script'))]
  // 如果有正在调用 则直接返回
  scripts.every(item => !item.src || item.src.indexOf(src) === -1) && require('jsonp')(src, opts, fn)
}

export const jsonp = async (url, params, opts) => {
  // 默认值
  params.h = '1f138c53de0f2bfa460b5f45e5a5703f'
  if (!baseParams.postid && !url.match(/briefInfo/i)) {
    await getBriefInfo(jsonp)
  }
  // 请求指定默认参数的key
  let defaultParams = {}
  if (opts && opts.defaultParams) {
    opts.defaultParams.map(t => defaultParams[t] = baseParams[t])
  } else {
    // 默认全部参数
    defaultParams = baseParams
  }
  defaultParams._ = Date.now()
  return new Promise((resolve, reject) => {
    reqJsonp(formatUrl(url, { ...defaultParams, ...params }), null, (error, body)=> {
      if (error) return reject(error);
      resolve(body)
    })
  })
}

// get请求
export const req = async (url, params) => {
  if (!/http/.test(url)) {
    const base = baseURL[process.env.NODE_ENV]
    url = `${base}${apis[url]}`
  }
  if (!baseParams.postid) {
    await getBriefInfo(jsonp)
  }
  return axios.get(url, {
    timeout: 20000, // 请求超时时间
    // withCredentials: true,
    params: { ...params, ...baseParams},
  })
}

// 获取广告配置需要post方法
export const reqPost = async (url, data, config) => {
  url = apis[url][process.env.NODE_ENV]
  return axios.post(url, {...data}, {
    timeout: 20000, // 请求超时时间
    ...config,
    // withCredentials: true,
  })
}