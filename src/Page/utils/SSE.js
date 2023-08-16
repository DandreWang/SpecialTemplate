'use strict'

class SSE {
  constructor(options) {
    // sse对象
    this.es = null
    // 定时器
    this.timer = 0
    // 重连次数
    this.resetCount = 0
    // 配置
    this.options = options
    // 初始化
    this.init()
  }

  // 初始化
  init() {
    // 先关闭再重连
    this.close()
    try {
      // sse
      const es = new EventSource(this.options.url)
      // 赋值
      this.es = es
      // 监听
      this.eventInit(es)
    } catch (e) {
      console.log(e)
      // 错误重连
      this.errorReset()
    }
  }

  // 绑定监听
  eventInit(es) {
    const { onMsg, onOpen, onErr } = this.options
    // 监听
    es.addEventListener('message', event => {
      // 重连机制
      this.keepalive()
      // 执行
      typeof onMsg === 'function' && onMsg(event, es)
    })
    es.addEventListener('open', event => {
      // 重连机制
      this.keepalive()
      // 执行
      typeof onOpen === 'function' && onOpen(event, es)
    })
    es.addEventListener('error', event => {
      // 重连机制
      typeof onErr === 'function' ? onErr(event, es) : this.errorReset()
    })
  }

  // 重连
  keepalive() {
    const { timer, options: { getStaticData }} = this
    // 清理
    timer && clearTimeout(timer)
    // 重置
    this.timer = setTimeout(_ => {
      // 更新静态数据
      typeof getStaticData === 'function' && getStaticData()
      // 重置计数
      this.resetCount = 0
      // 重连
      // this.init()
    }, 60 * 1000)
  }

  // 断开
  close() {
    const { es, timer } = this
    // 断开链接
    es && es.close()
    // 清理定时器
    timer && clearTimeout(timer)
  }

  // 出错重连
  errorReset() {
    const { timer } = this
    // 清理定时器
    timer && clearTimeout(timer)
    // 超出则断开
    if (this.resetCount > 5) return
    // 重置
    this.timer = setTimeout(_ => {
      // 重连
      this.init()
      // 计数
      this.resetCount++
    }, navigator.onLine ? 20000 : 2000)
  }
}

export default SSE
