import axios from 'axios/index'
import { Message, MessageBox } from 'element-ui'
// queryString
const qs = require('qs')

// 修改全局默认值
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

const { isCancel, CancelToken } = axios
// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const pending = []
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
    // 获取配置
    const { tokenKey = 'token', logoutCode = 30000, sucCode = 10000, sucCodeKey = 'code', loginID, needToken = true } = options
    // 初始化请求实例
    const service = axios.create({
      // baseURL: " ",
      timeout: 20000, // 请求超时时间
      // withCredentials: true,
      ...options
    })
    // request拦截器
    service.interceptors.request.use(config => {
      if (needToken) {
        // 获取token
        const { k } = qs.parse(location.href.split('?')[1])
        // 设置token
        config.headers[tokenKey] = k || ''
      }
      // 获取配置
      const { data, url, params: { axiosConf: { dataFmt, cancelMsg, cantCancel }}} = config
      // 数据格式化
      dataFmt && (config.data = qs.stringify(data))
      // 在一个ajax发送前执行一下取消操作
      removePending({ cancelMsg, url })
      // 记录请求
      !cantCancel && (config.cancelToken = new CancelToken(c => pending.push({ u: url, f: c })))
      return config
    }, error => Promise.reject(error))

    // response 拦截器
    service.interceptors.response.use(response => {
      // 获取响应及配置项
      const {
        data, data: { [sucCodeKey]: code, msg },
        config: { params: { axiosConf: { cancelMsg, hideMsg }}, url }
      } = response
      // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
      removePending({ cancelMsg, url })
      // 正常返回
      if (code === sucCode || sucCodeKey === 'isNull') return data
      // 3000:Token 过期了;//1001:未登录或已超时; 50012:其他客户端登录了;
      if (code === logoutCode) {
        return MessageBox.confirm('你已被登出，请重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          // cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = /^http/.test(loginID) ? loginID : `  `
        })
      }
      // 是否提示消息
      if (hideMsg) {
        typeof hideMsg === 'function' && hideMsg(data)
      } else {
        Message({ message: msg, type: 'error', duration: 3 * 1000 })
        // 弹出错误
        return Promise.reject(code)
      }
    }, error => {
      // 取消
      if (isCancel(error)) return
      // 加载
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
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
      return apis[key] || key
    } else {
      let api = apis
      key.split('_').forEach(k => (api = api[k]))
      return api
    }
  }
}

