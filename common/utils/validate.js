import { Toast } from 'vant'
// 小于256
const n256 = '25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?'

// 验证规则
const VALIDATE_REGS = {
  /* 不可为空（不可为undefined，null） */
  notNull: /^[\s\S]*.*[^\s][\s\S]*$/,
  /* 必填(字符串) */
  req: /^[\s\S]*.*[^\s][\s\S]*$/,
  /* 小于256 */
  /* url */
  url: new RegExp(`^(https?|ftp):\\/\\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((${n256})(\\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\\.)*[a-zA-Z0-9-]+\\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\\/($|[a-zA-Z0-9.,?'\\\+&%$#=~_-]+))*$`),
  /* 手机号 */
  phone: /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|16[56]|17[0135678]|18[0-9]|19[0-9])[0-9]{8}$/,
  /* 颜色 */
  color: /^#[0-9a-fA-F]{3,6}$/,
  /* rgba */
  rgbaColor: new RegExp(`/^[rR][gG][Bb][Aa]?[\\(]([\\s]*(${n256}),){2}[\\s]*(${n256}),?[\\s]*(0\\.\\d{1,2}|1|0)?[\\)]{1}$/g`),
  // 国内市场
  domesticMarketCodes: /^(SHFE|CFFEX|DCE|CZCE|GFEX|8|INE|113|114|115|142|220|225)\|/
}
/*
* 统一验证
* @Params {String/Array}
* @Demo regType-msg
* */
const validation = (rules) => {
  // 规则
  const Rs = typeof rules === 'string' ? [rules] : [].concat(rules)
  return val => {
    let res = false
    for (let i = 0, len = Rs.length; i < len; i++) {
      const [type, msg] = Rs[i].split('-')
      if (type && !VALIDATE_REGS[type].test(val)) {
        res = type
        // 弹出提醒
        msg && Toast(msg)
        break
      }
    }
    return res
  }
}
// 生成
const creatValidator = rules => {
// 规则
  const Rs = typeof rules === 'string' ? [rules] : [].concat(rules)
  return (rule, val, callback) => {
    let res = ''
    for (let i = 0, len = Rs.length; i < len; i++) {
      const [type, msg] = Rs[i].split('-')
      if (type && !VALIDATE_REGS[type].test(val)) {
        res = msg || '请输入正确格式数据！'
        break
      }
    }
    callback(res && new Error(res))
  }
}

// 验证form的值
const propsTypeValidator = (item, Setting) => {
  try {
    const resData = { ...item }
    Object.keys(Setting).forEach(key => {
      let { [key]: propVal } = item
      const { [key]: propSetting } = Setting
      if (Object.prototype.toString.call(propSetting) !== '[object Object]') {
        return contrastType(key, propVal, propSetting)
      }
      const { required, default: def, validator } = propSetting

      const absent = Object.prototype.hasOwnProperty.call(item, key)

      if (required && !absent) {
        throw new Error(`Missing required prop:"${key}`)
      }

      if (!absent && Object.prototype.hasOwnProperty.call(propSetting, 'default')) {
        propVal = def
      }

      if (required && (propVal == null || propVal == '')) {
        throw new Error(`Invalid prop: null for required prop "${key}".`)
      }

      if (validator && !validator(propVal)) {
        throw new Error(`Invalid prop: custom validator check failed for prop "${key}".`)
      }
      resData[key] = propVal
    })
    return resData
  } catch (e) {
    console.log(e)
    return false
  }
}

const contrastType = (key, val, type) => {
  let valid = !type || type === true
  const expectedTypes = []

  if (type) {
    if (!Array.isArray(type)) {
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const { expectedType, valid: vRes } = assertType(val, type[i])
      expectedTypes.push(expectedType || '')
      valid = vRes
    }
  }

  if (!valid) {
    throw new Error(`
        Invalid prop: type check failed for prop "${key}".
        Expected ${expectedTypes.join(', ')}
      `)
  }
}

// 验证类型
const assertType = (value, type) => {
  let valid
  const expectedType = getType(type)
  if ('String|Number|Boolean|Function'.indexOf(expectedType) !== -1) {
    valid = typeof value === (expectedType.toLowerCase())
  } else if (expectedType === 'Object') {
    valid = String.toString.call(value) === '[object Object]'
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}

// 获取构造函数类型
const getType = fn => {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match && match[1]
}

export default {
  getType, propsTypeValidator, assertType, contrastType, VALIDATE_REGS, validation, creatValidator
}
