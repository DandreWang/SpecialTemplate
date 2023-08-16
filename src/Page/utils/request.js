import axios from 'axios/index'
import tools from '@common/utils/tools'
import { Toast } from 'vant'

const { bsEnv: { isIE, isIE11 }} = tools
// queryString
const qs = require('qs')

// 修改全局默认值
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

const { isCancel, CancelToken } = axios
// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const pending = []
// 移除请求队列中的请求
const removePending = ever => pending.forEach(p => {
  const { url, cancelMsg } = ever
  // 当当前请求在数组中存在时执行函数体
  if (p.u === url) {
    // 执行取消操作
    p.f(cancelMsg)
    // 把这条记录从数组中移除
    pending.splice(p, 1)
  }
})

// 请求拦截器
const interceptors_request = config => {
  // 获取配置
  const { data, url, params: { axiosConf: { noLoading, dataFmt, cancelMsg }}} = config
  // 数据格式化
  dataFmt && (config.data = qs.stringify(data))
  // 加载
  !isIE && !isIE11 && !noLoading && Toast.loading({
    mask: true,
    forbidClick: true,
    // loadingType: 'spinner',
    duration: 0,
    message: typeof noLoading === 'string' ? noLoading : ''
  })
  // 在一个ajax发送前执行一下取消操作
  removePending({ cancelMsg, url })
  config.cancelToken = new CancelToken(c => {
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    pending.push({ u: url, f: c })
  })
  return config
}

const interceptors_response = options => response => {
  // 获取配置
  const { sucCode = 10000, sucCodeKey = 'code', msgKey = 'msg' } = options
  // 获取响应及配置项
  const {
    data, data: { [sucCodeKey]: code, [msgKey]: msg },
    config: { params: { axiosConf: { cancelMsg, hideMsg, noLoading }}, url }
  } = response
  // 重置Loading
  !noLoading && Toast.clear()
  // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
  removePending({ cancelMsg, url })
  // 正常返回
  if (code === sucCode || sucCodeKey === 'isNull') return data
  // 是否提示消息
  !hideMsg ? Toast(msg) : typeof hideMsg === 'function' && hideMsg(data)
  // 弹出错误
  return Promise.reject(code)
}

export default class Request {
  constructor(options) {
    const { apis } = options
    this.apis = apis
    this.service = {}
    this.options = options
    // 初始化
    this.reqInit(options)
  }

  reqInit(options) {
    // 初始化请求实例
    const service = axios.create({
      // baseURL: "http://192.168.0.106:8094/boluo-crm/",
      timeout: 20000, // 请求超时时间
      withCredentials: true,
      ...options
    })
    // request拦截器
    service.interceptors.request.use(interceptors_request, error => Promise.reject(error))

    // response 拦截器
    service.interceptors.response.use(interceptors_response(options), error => {
      // 取消
      if (isCancel(error)) return
      // 加载
      Toast.clear(true)
      // 弹出错误
      return Promise.reject(error)
    })
    // 全局赋值
    this.service = service
    // return async(api, data, axiosConf, headers) => request(`${module}_${api}`, data, axiosConf, headers)
  }

  // 请求
  async request(api, data, axiosConf = {}, headers = {}) {
    let url = /^http/.test(api) ? api : this.getApi(api)
    // 如果是对象 对应url
    typeof url === 'object' && (url = url[process.env.NODE_ENV === 'production' ? 'production' : 'development'])
    // 获取请求方式
    const [path, reqType = 'get', dataFmt] = url.split(',')
    // 调用对应方法
    return this[reqType](path, data, { dataFmt, ...axiosConf }, headers, true)
  }

  async get(api, params, axiosConf = {}, headers = {}, flg) {
    return await this.service({
      url: flg ? api : this.getApi(api),
      params: { ...params, axiosConf },
      headers
    })
  }

  async post(api, data, axiosConf = {}, headers = {}, flg) {
    return await this.service({
      url: flg ? api : this.getApi(api),
      method: 'post',
      data,
      params: { axiosConf },
      headers,
      ...axiosConf
    })
  }

  /*
  * 获取请求接口
  * @Params key
  * @Typeof String
  * */
  getApi(key) {
    const { apis } = this
    if (key.indexOf('_') === -1) {
      return apis[key]
    } else {
      let api = apis
      key.split('_').forEach(k => (api = api[k]))
      return api
    }
  }
}

