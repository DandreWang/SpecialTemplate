/**
 * 汇总接口地址数据、
 * @TypeOf Object or String
 * @Formatter 'module,key'(key 命名时不可使用_)
 */
const { NODE_ENV } = process.env
const uploadImage = {
  development: '/templatePage/uploadImage,post',
  test: '/templatePage/uploadImage,post',
  production: 'http://10.224.105.71:8081/template/templatePage/uploadImage,post'
}
const imgBaseUrl = {
  development: 'http://10.228.131.10:8011/',
  test: 'http://10.228.131.10:8011/',
  production: 'https://qhrs.eastmoney.com/zhuanti/'
}
const apis = {
  // 已创建列表
  getPageList: '/templatePage/getPageList,post,1',
  // 添加页面
  addNewPage: '/templatePage/addNewPage,post,1',
  // 修改页面
  updatePage: '/templatePage/updatePage,post,1',
  // 上传文件
  uploadFile: '/templatePage/uploadStaticFile,post',
  // 发布
  publishPage: '/templatePage/publishPage,post,1',
  // 发布
  // uploadImg: 'http://10.224.105.71:8081/template/templatePage/uploadImage,post',
  // uploadImg: '/templatePage/uploadImage,post',
  uploadImg: uploadImage[NODE_ENV],
  // 图片地址
  // imgBaseUrl: 'https://qhrs.eastmoney.com/zhuanti/',
  // imgBaseUrl: 'http://10.228.131.10:8011/',
  imgBaseUrl: imgBaseUrl[NODE_ENV],
  // 删除专题
  deleteModule: '/templatePage/deletePage,post,1',
  // 复制专题
  copyModule: '/templatePage/copyPage,post,1',
  // 锁定专题
  lockModule: '/templatePage/lockPage,post,1',
  // 全部投放位置选项（zbgg）
  listAdPosition: '/adPosition/list',
  // 新增投放位置选项
  addAdPosition: '/adPosition/save,post',
  // 修改投放位置选项
  updateAdPosition: '/adPosition/update,post'

}
export default apis
