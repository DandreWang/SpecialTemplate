// 路径
const paths = ['hqbb', 'hqbb_n', 'hqxw', 'ggtz', 'fwb', 'qhzc', 'hqrd', 'rmhq', 'zbgg', 'rdzx']
// 组件
const components = {}
// 遍历
paths.forEach(path => components[`TempForm_${path}`] = _ => import(`./${path}/index.vue`))
// 返回
export default components
