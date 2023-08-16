export const formConf = {
  labelWidth: '100px',
  size: 'small',
  rules: {
    tit1: [
      { required: true, message: '请输入标题内容', trigger: 'blur' },
      { max: 7, message: '最多输入7个字', trigger: 'blur' }
    ],
    tit2: [
      { required: true, message: '请输入标题内容', trigger: 'blur' },
      { max: 2, message: '最多输入2个字', trigger: 'blur' }
    ],
    tit3: [
      { required: true, message: '请输入标题内容', trigger: 'blur' },
      { max: 10, message: '最多输入10个字', trigger: 'blur' }
    ],
    tit4: [
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
    prop: 'tit1',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题1'
  }, {
    prop: 'tit2',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题2'
  }, {
    prop: 'tit3',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题3'
  }, {
    prop: 'tit4',
    itemType: 'inp',
    cls: 'isinline',
    label: '标题4'
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
