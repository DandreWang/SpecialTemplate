export const formConf = {
  labelWidth: '100px',
  size: 'small',
  rules: {
    tit: [
      { required: true, message: '请输入标题内容', trigger: 'blur' },
      { max: 7, message: '最多输入7个字', trigger: 'blur' }
    ],
    subTit: [
      { required: true, message: '请输入行情标题', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'tit',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题内容'
  }, {
    prop: 'subTit',
    itemType: 'inp',
    cls: 'isinline',
    label: '行情标题'
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
