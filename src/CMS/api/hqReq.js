import Request from './request'

export const staticReq = new Request({
  apis: {},
  // sucCode: 0,
  needToken: false,
  sucCodeKey: 'isNull',
  baseURL: ''
})
export const seeReq = new Request({
  apis: {
    // 主力
    mainForce: 'list/trans/block/mk0830'
  },
  // sucCode: 0,
  sucCodeKey: 'isNull',
  needToken: false,
  // baseURL: ' '
  baseURL: ' '
  // baseURL: ' '
})

