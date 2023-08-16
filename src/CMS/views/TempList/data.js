import http from '@/CMS/api'
import validate from '@common/utils/validate'
import { format } from 'date-fns'

export const tableOptions = {
  http,
  url: 'tempList_getTemp',
  columns: [
    { prop: 'id', label: '编号' },
    { prop: 'type', label: '模板类型' },
    { prop: 'name', label: '模板名称' }
  ],
  listField: 'data',
  totalField: 'totalSize',
  pageIndexKey: 'page',
  pageSizeKey: 'size',
  pageSizes: [15, 20, 50, 100],
  border: false,
  height: document.body.clientHeight - 230
}
export const formConf = {
  rules: {
    type: [
      { required: true, message: '请输入模板类型', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入模板名称', trigger: 'blur' }
    ]
  }
}

export const formItems = [
  {
    prop: 'type',
    itemType: 'inp',
    label: '模板类型'
  },
  {
    prop: 'name',
    itemType: 'inp',
    label: '模板名称'
  }
]
