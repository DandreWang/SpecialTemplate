import md5 from './md5'

// jsonp 请求的基础参数
let baseParams = {
  postid:'',
  // 默认用户名的md5
  // deviceid: '3af2f71c2bf9ee385ff62d88671ed277',
  deviceid: '',
  version: 1,
  product: 'Futures',
  // Android,Iphone,PadAir,Web,Ipad,WP,Wap,PC默认Web
  plat: 'Wap',
  _: 1640585326852
}
export const getBaseParams = ()=> baseParams
// briefInfo
let briefInfo = {}

// 解析url参数状态
let _URL_ERROR = false
let _NEWS_ID = ''

// vm实例
let vm = null
export const sendThis = (_this) => {
  vm = _this
}

// newsId
export const getNewsId = () => {
  if (_NEWS_ID)   return _NEWS_ID;
  // const articleid = '202203152308558163'
  const articleid = vm.zxid
  Object.assign(baseParams, {
    postid: articleid,
    deviceid: md5.hex_md5(''),
    // 网页用
    plat: 'wap',
    version: '3.9.0',
  })
  _NEWS_ID = articleid
  return baseParams.postid
}

// 获取文章id
const setPostId = async jsonp => {
  const postid = getNewsId()
  // 获取互动数据，NewsId换取postid
  let base= await jsonp('briefInfo', {
    postid,
    type: 1,
  })
  if (!(base && base.re && base.re[0] && base.re[0].post_uid)) return Promise.resolve(baseParams);

  Object.assign(baseParams, { postid: base.re[0].post_id, })
  const { post_comment_count, post_forward_count } = base.re[0]
  const formatNum = num => num <10000? num: `${(num/10000).toFixed(1)}万`
  Object.assign(briefInfo, { 
    ...base.re[0],
    post_comment_count: formatNum(post_comment_count),
    post_forward_count: formatNum(post_forward_count),
  })
  return Promise.resolve(baseParams)
}

export const getBriefInfo = async jsonp => {
  if (!baseParams.postid) {
    await setPostId(jsonp)
  }
  return Promise.resolve(briefInfo)
}