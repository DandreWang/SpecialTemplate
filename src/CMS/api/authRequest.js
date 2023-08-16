import axios from 'axios/index'
import utils from '@common/utils/crypto'
import { Message, MessageBox } from 'element-ui'

const { nodeEncrypt } = utils
// queryString
const qs = require('qs')
const { NODE_ENV } = process.env

// 修改全局默认值
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

const jumpUrl = {
  development: 'http://10.228.131.27:8080/futuresAuthority/#/Login',
  test: 'http://10.228.131.27:8080/futuresAuthority/#/Login',
  production: 'https://qhgzz2.eastmoney.com/futuresAuthority/#/Login'
}

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
    const { tokenKey = 'token', logoutCode = 30000, sucCode = 10000, sucCodeKey = 'code', needToken = true } = options
    // 初始化请求实例
    const service = axios.create({
      // baseURL: "http://192.168.0.106:8094/boluo-crm/",
      timeout: 20000, // 请求超时时间
      // withCredentials: true,
      ...options
    })
    // request拦截器
    service.interceptors.request.use(config => {
      // 后端未加token验证，header中不设置token
      if (needToken) {
        // 获取token
        const urlid = localStorage.getItem('urlid')
        const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAK2IaLMengXdADXKwf469axbR+irOW3CwsfuyCwn8SO/iVpvFL498XAvcGLQB1qQtlmEN2Llv2zzq5qa8gNf7HEDPJJgzVaFV+RMdDn9PDBiV2jrY9UEuj5vh87I5u5hWcKLa9lwnO/H1gnaimIQdqVOG432B6i9qIsVx26N4sQIDAQAB'
        const tokenTmp = localStorage.getItem('token')
        // 设置token
        config.headers[tokenKey] = tokenTmp ? nodeEncrypt(tokenTmp, publicKey) : ''
        config.headers.urlid = Number(urlid) || null
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
        // 新工作证状态码 status：0-成功 -100 -失败
        data, data: { [sucCodeKey]: code, msg, status },
        config: { params: { axiosConf: { cancelMsg, hideMsg }}, url }
      } = response
      // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
      removePending({ cancelMsg, url })
      // 正常返回
      if (code === sucCode || sucCodeKey === 'isNull' || status === 0) return data
      // 3000:Token 过期了;//1001:未登录或已超时; 50012:其他客户端登录了;
      if (code === logoutCode || status === -100) {
        return MessageBox.confirm('你已被登出，请重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          // cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // window.location.href = 'https://qhgzz2.eastmoney.com/futuresAuthority/#/Login'
          console.log(NODE_ENV)
          window.location.href = jumpUrl[NODE_ENV]
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

