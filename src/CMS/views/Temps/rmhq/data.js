export const formConf = {
  labelWidth: '110px',
  size: 'small',
  rules: {
    tit: [
      { required: true, message: '请输入主标题内容', trigger: 'blur' },
      { max: 10, message: '最多输入10个字', trigger: 'blur' }
    ],
    subTit: [
      { required: true, message: '请输入副标题内容', trigger: 'blur' },
      { max: 10, message: '最多输入10个字', trigger: 'blur' }
    ],
    hqTit: [
      { required: true, message: '请输入行情标题', trigger: 'blur' }
    ],
    zxTit: [
      { required: true, message: '请输入资讯标题', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'tit',
    itemType: 'inp',
    cls: 'isinline',
    label: '主标题内容'
  },{
    prop: 'subTit',
    itemType: 'inp',
    cls: 'isinline',
    label: '副标题内容'
  }, {
    prop: 'hqTit',
    itemType: 'inp',
    cls: 'isinline',
    label: '行情标题'
  }, {
    prop: 'zxTit',
    itemType: 'inp',
    cls: 'isinline',
    label: '资讯标题'
  }, {
    prop: 'fwbTit',
    itemType: 'inp',
    cls: 'isinline',
    label: '富文本标题'
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
  }, 
]
