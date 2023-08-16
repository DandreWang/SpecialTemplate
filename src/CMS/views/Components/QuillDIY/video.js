import { Quill } from "vue-quill-editor";
// 源码中是import直接倒入，这里要用Quill.import引入
const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')

const ATTRIBUTES = ['height', 'width']

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

class Video extends BlockEmbed {
  static create(value) {
    const node = super.create(value)
    const src = this.sanitize(value)
    const id = randomRange(16)
    // 添加video标签所需的属性
    node.setAttribute('id', `video_${id}`)
    node.setAttribute('class', 'emav ql-video')
    node.setAttribute('playsinline', true)
    node.setAttribute('webkit-playsinline', true)
    node.setAttribute('x5-playsinline', true)
    node.setAttribute('controls', 'controls')
    // node.setAttribute('type', 'video/mp4')
    node.setAttribute('src', src)
    return node
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  static sanitize(url) {
    return Link.sanitize(url) // eslint-disable-line import/no-named-as-default-member
  }

  static value(domNode) {
    return domNode.getAttribute('src')
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }

  html() {
    const { video } = this.value()
    return `<a href="${video}">${video}</a>`
  }
}
Video.blotName = 'video' // 这里不用改，不用iframe，直接替换掉原来，如果需要也可以保留原来的，这里用个新的blot
Video.className = 'ql-video'
Video.tagName = 'video' // 用video标签替换iframe

export default Video
