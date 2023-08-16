import Request from '../utils/request'

export const seeReq = new Request({
  apis: {
    // 主力
    mainForce: 'list/trans/block/mk0830',
    // 自定义品种查询
    customSSE: 'sse/custom/',
    // 列表查询
    customList: 'list/custom/'
  },
  // sucCode: 0,
  withCredentials: false,
  sucCodeKey: 'isNull',
  needToken: false,
  baseURL: ''
})

