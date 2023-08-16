/**
 * 汇总接口地址数据、
 * @TypeOf Object or String
 * @Formatter 'module,key'(key 命名时不可使用_)
 */
const apis = {
  // 已创建模板
  getTemp: '/templatePage/getTemplateList,post,1',
  // 添加模板
  addTemp: '/templatePage/addNewTemplate,post,1',
  // 修改模板
  updateTemp: '/templatePage/updateTemplate,post,1'
}
export default apis
