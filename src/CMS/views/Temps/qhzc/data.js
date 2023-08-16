export const formConf = {
  labelWidth: '100px',
  size: 'small',
  rules: {
    tit: [
      { required: true, message: '请输入页面标题', trigger: 'blur' }
    ],
    subStr: [
      { max: 20, message: '次级描述不得多于20个字', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'theme',
    itemType: 'select',
    options: [
      { value: 1, label: '蓝色' },
      { value: 2, label: '棕色' },
      { value: 3, label: '黄色' },
      { value: 4, label: '粉色' }
    ],
    val: 1,
    label: '主题风格'
  }, {
    prop: 'date',
    itemType: 'date',
    type: 'date',
    label: '显示日期'
  }, {
    prop: 'tit',
    itemType: 'inp',
    cls: 'isinline',
    label: '页面标题'
  }, {
    prop: 'subStr',
    itemType: 'inp',
    cls: 'isinline',
    label: '次级描述'
  }
]
