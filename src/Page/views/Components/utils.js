import Request from '../../utils/request'

const conf = {
  development: {
    baseURL: 'http://10.228.131.7:8080/futures-management/'
  },
  production: {
    baseURL: 'http://10.228.131.7:8080/futures-management/'
  }
}

export const mainTracker = new Request({
  apis: {
    downloadTrack: 'main/downloadSave,post'
  },
  sucCode: 0,
  withCredentials: false,
  sucCodeKey: 'status',
  ...conf
})
