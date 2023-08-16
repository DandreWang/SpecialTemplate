import http from '@/CMS/api'
import validate from '@common/utils/validate'
import { format } from 'date-fns'

const { NODE_ENV } = process.env
const pageUrl = NODE_ENV === 'production' ? '' : NODE_ENV === 'test'
  ? `${location.href.replace(/CMS.*/, '')}Page/#`
  : `${location.href.replace(/CMS.*/, '')}Page.html#`

export const tableOptions = {
  http,
  url: 'list_getPageList',
  columns: [
    { prop: 'id', label: '专题编号', width: '100' },
    { prop: 'name', label: '专题名称', width: '100' },
    { prop: 'isPublished', label: '是否发布', width: '100' },
    { prop: 'tempName', label: '模板名称', width: '100' },
    { prop: 'creatdate', label: '创建时间', className: 'dateCell', width: '130' },
    { prop: 'updatedate', label: '更新时间', className: 'dateCell', width: '130' },
    { prop: 'publishdate', label: '发布时间', className: 'dateCell', width: '130' },
    { prop: 'creator', label: '创建人' },
    { prop: 'url', label: '链接', width: '250' }
  ],
  listField: 'data',
  totalField: 'totalSize',
  pageIndexKey: 'page',
  pageSizeKey: 'size',
  pageSizes: [15, 20, 50, 100],
  dataHandler: item => {
    const { published, creatdate, updatedate, publishdate, url, template: { type, name }} = item
    return {
      ...item,
      isPublished: published === 1 ? '已发布' : '未发布',
      creatdate: format(creatdate, 'YYYY-MM-DD HH:mm:ss'),
      publishdate: publishdate ? format(publishdate, 'YYYY-MM-DD HH:mm:ss') : '',
      updatedate: updatedate ? format(updatedate, 'YYYY-MM-DD HH:mm:ss') : '暂无修改',
      url: url && `${pageUrl}/index?id=${url}`,
      tempName: name,
      type
    }
  },
  border: false,
  height: document.body.clientHeight - 230
}
const colorRule = [
  { required: true, message: '请设置颜色', trigger: 'blur' },
  { validator: validate.creatValidator(['color-请输入正确颜色格式']), trigger: 'blur' }
]

export const formConf = {
  rules: {
    title: [
      { required: true, message: '请输入投票话题', trigger: 'blur' },
      { max: 16, message: '最多输入16个字', trigger: 'blur' }
    ],
    optionOne: [
      { required: true, message: '请输入选项1', trigger: 'blur' },
      { max: 5, message: '最多输入5个字', trigger: 'blur' }
    ],
    optionTwo: [
      { required: true, message: '请输入选项2', trigger: 'blur' },
      { max: 5, message: '最多输入5个字', trigger: 'blur' }
    ],
    titleColor: colorRule,
    optionOneColor: colorRule,
    optionTwoColor: colorRule,
    optionOneBgColor: colorRule,
    optionTwoBgColor: colorRule
  }
}

export const formItems = [
  {
    prop: 'title',
    itemType: 'inp',
    label: '投票话题',
    placeholder: '请输入投票话题，最多16个字'
  }, {
    prop: 'titleColor',
    itemType: 'colorInp',
    label: '文字颜色',
    cls: 'subItem'
  }, {
    prop: 'tit',
    itemType: 'tit',
    cls: 'istit',
    label: '投票选项'
  }, {
    prop: 'optionOne',
    itemType: 'inp',
    label: '选项左',
    cls: 'subItem isinline',
    placeholder: '最多5个字'
  }, {
    prop: 'optionTwo',
    itemType: 'inp',
    label: '选项右',
    cls: 'subItem isinline',
    placeholder: '最多5个字'
  }, {
    prop: 'optionOneColor',
    itemType: 'colorInp',
    label: '文字颜色',
    cls: 'subItem'
  }, {
    prop: 'optionTwoColor',
    itemType: 'colorInp',
    label: '文字颜色',
    cls: 'subItem'
  }, {
    prop: 'optionOneBgColor',
    itemType: 'colorInp',
    label: '按钮颜色',
    cls: 'subItem'
  }, {
    prop: 'optionTwoBgColor',
    itemType: 'colorInp',
    label: '按钮颜色',
    cls: 'subItem'
  }, {
    prop: 'jumpUrl',
    itemType: 'inp',
    label: '跳转链接',
    placeholder: '请输入跳转链接'
  }, {
    prop: 'bgImageUrl',
    itemType: 'upload',
    label: '背景图片'
  }
]
