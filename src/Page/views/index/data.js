// 路径
const paths = ['hqbb', 'hqxw', 'ggtz', 'fwb', 'qhzc', 'hqrd', 'rmhq', 'zbgg', 'rdzx']
// 组件
const components = {
  Temp_hqbb_n: _ => import('../hqbb/index_n')
}
// 遍历
paths.forEach(path => components[`Temp_${path}`] = _ => import(`../${path}/index.vue`))
// 返回
export default components
