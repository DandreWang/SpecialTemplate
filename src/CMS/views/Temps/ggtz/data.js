export const formConf = {
  labelWidth: '100px',
  size: 'small',
  rules: {
    tit: [
      { required: true, message: '请输入公告标题', trigger: 'blur' }
    ],
    cont: [
      { required: true, message: '请输入公告内容', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'tit',
    itemType: 'inp',
    label: '公告标题'
  }, {
    prop: 'cont',
    type: 'textarea',
    itemType: 'inp',
    label: '公告内容',
    rows: '20'
  }
]
