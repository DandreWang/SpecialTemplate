/**
 * 生成打点短链
 * @TypeOf Object or String
 * @Formatter 'module,key'(key 命名时不可使用_)
 */
const { NODE_ENV } = process.env
const trackApi = {
  development: 'http://10.228.131.7:8080/qs/shorturl/addShortUrl2,post',
  test: 'http://10.228.131.7:8080/qs/shorturl/addShortUrl2,post',
  production: 'http://10.224.110.68:8080/qs/shorturl/addShortUrl2,post'
}
const apis = {
  getTracker: trackApi[NODE_ENV]
}
export default apis
