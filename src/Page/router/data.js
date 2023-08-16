/*
* meta 存放页面相关配置
* - title 页面title（false时不进行操作，undefined/''/0时清空）
* - nologs 不做埋点统计
* - reloadEvt 重载页面（反复刷新的页面）
* - shareOpt 页面分享配置 false时隐藏分享按钮
*/

export default [
  { path: '/404', nologs: true },
  // { path: '/hqrd', nologs: true },
  { path: '/index', nologs: true }
  // { path: '/20190418',
  //   shareOpt: {
  //     title: '做一手期货需要多少钱？',
  //     desc: '闲钱不够炒期货？期货品种每手保证金全知道~',
  //     pageUrl: 'app_ht_qhtjwz_jysyjdt_03_01_01_0'
  //   }
  // },
]
