export const formConf = {
  labelWidth: '100px',
  size: 'small',
  rules: {
    theme: [
      { required: true, message: '请选择主题', trigger: 'blur' }
    ],
    title: [
      { required: true, message: '请输入页面标题', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'theme',
    itemType: 'select',
    options: [
      { value: 1, label: '黄色' },
      { value: 2, label: '蓝色' },
      { value: 3, label: '黄白' },
      { value: 4, label: '黄金' }
    ],
    label: '主题风格',
    val: 1
  }, {
    prop: 'title',
    itemType: 'inp',
    cls: 'isinline',
    label: '页面标题',
    val: '期货'
  }, {
    prop: 'titSup',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题上方',
    val: '投资黄金选择正规期货平台——'
  }, {
    prop: 'titSub',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题下方',
    val: '开户可获取上海期货交易所黄金期货交易权限'
  }
]
