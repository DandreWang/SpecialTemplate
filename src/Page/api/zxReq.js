import Request from '../utils/request'

export const zxReq = new Request({
  apis: {
    getZx: 'comm/future/advertisement,post'
  },
  sucCode: '1',
  withCredentials: false,
  msgKey: 'message',
  needToken: false,
  baseURL: ''
})

