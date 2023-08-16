import http from '@/CMS/api'

export const tableOptions = {
  http,
  url: 'zbggManage_list',
  columns: [
    { prop: 'id', label: '模板编号', align: 'center' },
    { prop: 'name', label: '模板名称', align: 'center' },
    { prop: 'creator', label: '创建人', align: 'center' }
  ],
  listField: 'data',
  totalField: 'totalSize',
  pageIndexKey: 'page',
  pageSizeKey: 'size',
  pageSizes: [15, 20, 50, 100],
  dataHandler: item => {
    const { linkManageIdList } = item
    return {
      ...item,
      linkNumber: linkManageIdList.length
    }
  },
  highlightCurrentRow: true,
  border: false,
  height: document.body.clientHeight - 550
}
