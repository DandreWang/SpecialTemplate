import Request from '../utils/request'

export const prodUrl = ''
// export const prodUrl = `${location.origin}/zhuanti/`
// // 测试代理请求 yanyangyang
// // http://172.16.20.71:3000/charles/*.js -> http://10.228.131.10:8011/*.js
// const devUrl = 'http://172.16.20.71:3000/charles'

const { NODE_ENV } = process.env
// // WAY1：charles可代理qhrestest https协议
// const pageUrl = `${location.origin}/${NODE_ENV === 'production' ? 'zhuanti' : 'charles'}/`

// WAY2：本地和测试环境代理
const devUrl = ''

// 日志请求对象
export default new Request({
  // // WAY1
  // baseURL: pageUrl,
  // WAY2
  baseURL: NODE_ENV === 'production' ? `${location.origin}/zhuanti/` : devUrl,
  sucCodeKey: 'isNull',
  withCredentials: false
})
