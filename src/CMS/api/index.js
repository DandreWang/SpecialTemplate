import Request from './authRequest'
import utils from '@common/utils/tools'

/**
 * 汇总接口地址数据、
 * @TypeOf Object or String
 * @Formatter 'module,key'(key 命名时不可使用_)
 */
const conf = {
  development: {
    baseURL: ' ',
    loginID: 35
  },
  test: {
    baseURL: ' ',
    loginID: 35
  },
  production: {
    baseURL: ' ',
    loginID: 43
  }
}

const req = new Request({
  apis: utils.getFiles(require.context('.', false, /^((?!index).)+\.js$/), 'js'),
  sucCode: 0,
  sucCodeKey: 'status',
  ...conf[process.env.NODE_ENV],
  withCredentials: true
})

export default req
