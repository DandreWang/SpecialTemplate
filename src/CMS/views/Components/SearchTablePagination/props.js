const props = {
  // Element UI Table attributes
  height: [String, Number],
  maxHeight: [String, Number],
  size: String,
  stripe: Boolean,
  border: {
    type: Boolean,
    default: true
  },
  fit: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  highlightCurrentRow: Boolean,
  currentRowKey: [String, Number],
  rowClassName: [String, Function],
  rowStyle: [String, Function],
  rowKey: [String, Function],
  emptyText: String,
  defaultExpandAll: Boolean,
  expandRowKeys: Array,
  defaultSort: Object,
  tooltipEffect: String,
  showSummary: Boolean,
  sumText: String,
  summaryMethod: Function,
  // custom attributes
  tableStyle: {
    type: String,
    default: 'width:100%;'
  },
  http: Object,
  url: {
    type: [String, Array]
  },
  listField: {
    type: String,
    default: 'data.list'
  },
  totalField: {
    type: String,
    default: 'data.total'
  },
  baseParams: {
    type: Object,
    default: _ => ({})
  },
  formOptions: {
    type: Object
  },
  autoLoad: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'remote',
    validator(value) {
      const types = ['remote', 'local']
      const validType = types.indexOf(value) !== -1
      if (!validType) {
        throw new Error(`Invalid type of '${value}', please set one type of 'remote' or 'local'.`)
      }
      return validType
    }
  },
  data: {
    type: Array
  },
  dataHandler: {
    type: Function
  },
  columns: {
    type: Array,
    required: true
    // // Element UI table-column attribute
    // columnKey: String,
    // label: {
    //   type: String,
    //   required: true
    // },
    // prop: {
    //   type: String,
    //   required: true
    // },
    // width: Number,
    // minWidth: Number,
    // fixed: [Boolean, String],
    // renderHeader: Function,
    // sortable: [Boolean, String],
    // sortMethod: Function,
    // resizable: {
    //   type: Boolean,
    //   default: true
    // },
    // formatter: Function,
    // showOverflowTooltip: Boolean,
    // align: {
    //   type: String,
    //   default: 'left'
    // },
    // headerAlign: String,
    // className: {
    //   type: String,
    //   default: ''
    // },
    // labelClassName: {
    //   type: String,
    //   default: ''
    // },
    // selectable: Function,
    // reserveSelection: Boolean,
    // filters: Array,
    // filterPlacement: String,
    // filterMultiple: {
    //   type: Boolean,
    //   default: true
    // },
    // filterMethod: Function,
    // filteredValue: Array,
    // // custom table-column attribute
    // filter: {
    //   type: String
    // },
    // render: {
    //   type: Function
    // },
    // slotName: {
    //   type: String
    // }
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  pageSizes: {
    type: Array,
    default: () => ([20, 50, 100])
  },
  paginationLayout: {
    type: String,
    default: 'total, prev, pager, next, jumper, sizes'
  },
  pageIndexKey: {
    type: String,
    default: 'pageNum'
  },
  pageSizeKey: {
    type: String,
    default: 'pageSize'
  },
  editableTable: {
    type: Boolean,
    default: false
  },
  editableTableInfo: Object
}

export default props
