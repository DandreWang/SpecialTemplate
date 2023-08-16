
export const formConf = {
  labelWidth: '100px',
  rules: {
    tit1: [
      { required: true, message: '请上传文件', trigger: 'blur' }
      // { max: 5, message: '最多输入5个字', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'btnTxt',
    itemType: 'upload',
    label: '上传文件'
    // itemConf: { size: 'small' }
  }
]
