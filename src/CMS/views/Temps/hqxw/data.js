export const formConf = {
  labelWidth: '100px',
  size: 'small',
  rules: {
    tit: [
      { required: true, message: '请输入行情标题', trigger: 'blur' },
      { max: 15, message: '最多输入15个字', trigger: 'blur' }
    ],
    subTit: [
      { required: true, message: '请输入行情内容', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'tit',
    itemType: 'inp',
    cls: 'txt',
    label: '行情标题'
  }, {
    prop: 'subTit',
    type: 'textarea',
    itemType: 'inp',
    cls: 'txt',
    label: '行情内容',
    rows: '4'
  }, {
    prop: 'itemDbId',
    itemType: 'inp',
    cls: 'isinline',
    label: '行情埋点'
  }, {
    prop: 'btnDbId',
    itemType: 'inp',
    cls: 'isinline',
    label: '按钮埋点'
  }
]
