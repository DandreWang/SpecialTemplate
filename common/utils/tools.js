const ua = navigator.userAgent
const bsEnv = {
  // 判断是否IE<11浏览器
  isIE: ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1,
  // 判断是否IE的Edge浏览器
  isEdge: ua.indexOf('Edge') > -1 && !(ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1),
  // 判断是否是IE11浏览器
  isIE11: ua.indexOf('Trident') > -1 && ua.indexOf('rv:11.0') > -1
}

/** 原生实现委托
 * @param {String} eventType 事件类型
 * @param {String} childSelector 子元素选择器
 * @param {Function} func 时间处理函数
 * @returns {Function} 返回注销事件函数
 * */
const eventDelegation = function(eventType, childSelector, func) {
  const cb = ev => {
    ev = ev || window.event
    const { srcElement } = ev
    this.querySelectorAll(childSelector).forEach(dom => {
      dom === srcElement && typeof func === 'function' && func(ev)
    })
  }
  this.addEventListener(eventType, cb)
  return () => this.removeEventListener(eventType, cb)
}

function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = () => {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/*
* 数组转树
* @Params list 数组数据源
* @Params key 对应父节点id字符串
* */
const array2Tree = (list, parentKey) => {
  return list.filter(parent => {
    parent.children = list.filter(child => {
      return parent.id === child[parentKey]
    })
    return !parent[parentKey]
  })
}

// 获取参数
const QueryString = name => {
  const result = location.href.match(new RegExp(`[\?\&]${name}=([^&]+)`, 'i'))
  return result == null || result.length < 1 ? '' : result[1]
}

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345, a:b}
 * */
function urlParse() {
  const obj = {}
  const reg = /[?&][^?&]+=[^?&]+/g
  const arr = window.location.search.match(reg)
  // ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substr(1).split('=')
      obj[decodeURIComponent(tempArr[0])] = decodeURIComponent(tempArr[1])
    })
  }
  return obj
}

/** 随机生成固定位数或者一定范围内的字符串数字组合
 * @param {Number} min 范围最小值
 * @param {Number} max 范围最大值，当不传递时表示生成指定位数的组合
 * @param {String} charStr 指定的字符串中生成组合
 * @returns {String} 返回字符串结果
 * */
const randomRange = (min, max, charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let returnStr = ''
  typeof min === 'undefined' && (min = 10)
  typeof max === 'string' && (charStr = max)
  const range = ((max && typeof max === 'number') ? Math.round(Math.random() * (max - min)) + min : min)
  for (let i = 0; i < range; i++) {
    const index = Math.round(Math.random() * (charStr.length - 1))
    returnStr += charStr.substring(index, index + 1)
  }
  return returnStr
}

// 获取文件
const getFiles = (requireModule, suffix, unDefault) => {
  const files = {}
  requireModule.keys().forEach(fileName => {
    const moduleName = fileName.replace(new RegExp((`\\.\/|\\.(${suffix})`), 'g'), '')
    files[moduleName] = unDefault ? requireModule(fileName) : requireModule(fileName).default
  })
  return files
}

const getImgs = requireModule => getFiles(requireModule, 'png|jpg|gif', true)

export default {
  getImgs, getFiles, randomRange, array2Tree, isExternal, debounce, QueryString, urlParse, bsEnv, eventDelegation
}
