import { format } from 'date-fns'

const fmTime = (fm) => {
  return (row, column, cellValue) => {
    return cellValue ? parseTime(cellValue, fm) : ''
  }
}

function parseTime(time, cFormat = 'YYYY-MM-DD HH:mm:ss') {
  if (arguments.length === 0) {
    return null
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  return format(date, cFormat)
}

function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
}

export default {
  fmTime, parseTime, formatTime
}
