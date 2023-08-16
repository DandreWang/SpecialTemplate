export const formConf = {
  // labelWidth: '100px',
  // size: 'small',
  // rules: {
  //   bg: [
  //     { required: true, message: '请选择背景图', trigger: 'blur' }
  //   ]
  // }
}

export const formItems = [
  // {
  //   prop: 'bg',
  //   itemType: 'upload',
  //   label: '背景图片'
  // }
]

// 按钮位置
export const btnOpt = [{
  label: '固定在顶部',
  value: 'position:fixed;top:0;'
}, {
  label: '固定在底部',
  value: 'position:fixed;bottom:0;'
}, {
  label: '任意位置',
  value: ''
}]

// 任意位置按钮对齐方式
export const positionOpt = [{
  label: '左对齐',
  value: 'left:0;right:unset;'
}, {
  label: '右对齐',
  value: 'right:0;left:unset;'
}, {
  label: '居中',
  value: 'left:50%;transform:translateX(-50%);'
}, {
  label: '顶部对齐',
  value: 'top:0;'
}, {
  label: '底部对齐',
  value: 'bottom:0;top:unset;'
}, {
  label: '取消对齐',
  value: ''
}]

// 是否显示弹框
export const popOpt = [{
  label: '不显示',
  value: false
}, {
  label: '显示',
  value: true
}]

// 弹框类型
export const popTypeOpt = [{
  label: '直接下载',
  value: 'one'
}, {
  label: '跳应用商店',
  value: 'two'
}]

// 按钮类型
export const linkTypeOpt = [{
  label: 'h5链接',
  value: 'h5'
}, {
  label: '原生短链',
  value: 'short'
}]

// 期货是否显示按钮
export const showBtnOpt = [{
  label: '显示',
  value: true
}, {
  label: '不显示',
  value: false
}]

// 主包是否显示按钮
export const moneyBtnOpt = [{
  label: '显示',
  value: true
}, {
  label: '不显示',
  value: false
}]

// 用户类型
export const futureBtnTypeOpt = [{
  label: '未开户',
  value: '1'
}, {
  label: '已开户',
  value: 'trade'
}, {
  label: '全量',
  value: 'all'
}]

// 跳转页面类型
export const jumpTypeOpt = [{
  label: '交易首页',
  value: 'trade'
}, {
  label: '开户页面',
  value: 'open'
}, {
  label: '开户云',
  value: 'cloud'
}, {
  label: '其他',
  value: 'other'
}]

// ------------------------ 挽留弹窗 ------------------------
// 链接用于
export const linkForOpt = [{
  label: '主包',
  value: '1'
}, {
  label: '期货App',
  value: '2'
}]

// 用户类型
export const userTypeOpt = [{
  label: '全量',
  value: 'all'
}, {
  label: '已开户',
  value: 'traded'
}, {
  label: '未开户',
  value: 'trade'
}]

// 展示次数
export const frequencyOpt = [{
  label: '每日一次',
  value: 'day'
}, {
  label: '每周一次',
  value: 'week'
}]

// 挽留弹窗按钮
export const popupBtnOpts = {
  downloadMethod: [{
    label: '下载apk',
    value: 'one'
  }, {
    label: '跳应用商店',
    value: 'two'
  }],

  alignMethod: [{
    label: '居中',
    value: 'center'
  }],

  skipTo: [{
    label: '交易首页',
    value: 'trade'
  }, {
    label: '开户页面',
    value: 'account'
  }, {
    label: '开户云',
    value: 'cloud'
  }, {
    label: '其他',
    value: 'others'
  }]
}
