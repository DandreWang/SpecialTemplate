import Request from '../utils/request'

export const tracker = new Request({
  apis: {
    getTracker: ''
  },
  sucCode: 0,
  withCredentials: false,
  // needToken: false,
  sucCodeKey: 'status'
})

