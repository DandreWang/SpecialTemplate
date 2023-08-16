import http from '@/CMS/api'
import { format } from 'date-fns'

const { NODE_ENV } = process.env
const pageUrl = NODE_ENV === 'production' ? 'https://qhrs.eastmoney.com/ztmb' : NODE_ENV === 'test'
  ? `${location.href.replace(/CMS.*/, '')}Page/#`
  : `${location.href.replace(/CMS.*/, '')}Page.html#`

// 链接表格配置
export const linkTableOptions = {
  http,
  url: 'linkManage_list',
  columns: [
    { prop: 'id', label: '链接编号', width: '100' },
    { prop: 'name', label: '链接名称', width: '100' },
    { prop: 'templateManageId', label: '模板编号', width: '100' },
    { prop: 'templateManageName', label: '模板名称', width: '100' },
    { prop: 'creator', label: '创建人' },
    { prop: 'creatdate', label: '创建时间', className: 'dateCell', width: '130' },
    { prop: 'updatedate', label: '更新时间', className: 'dateCell', width: '130' },
    { prop: 'publishdate', label: '发布时间', className: 'dateCell', width: '130' }
    // { prop: 'url', label: '链接地址', width: '250' }
  ],
  listField: 'data',
  totalField: 'totalSize',
  pageIndexKey: 'page',
  pageSizeKey: 'size',
  pageSizes: [15, 20, 50, 100],
  dataHandler: item => {
    const { creatdate, updatedate, publishdate, url } = item
    return {
      ...item,
      creatdate: format(creatdate, 'YYYY-MM-DD HH:mm:ss'),
      publishdate: publishdate ? format(publishdate, 'YYYY-MM-DD HH:mm:ss') : '',
      updatedate: updatedate ? format(updatedate, 'YYYY-MM-DD HH:mm:ss') : '暂无修改',
      url: url && `${pageUrl}/index?id=${url}`
    }
  },
  border: true,
  height: document.body.clientHeight - 250
}
