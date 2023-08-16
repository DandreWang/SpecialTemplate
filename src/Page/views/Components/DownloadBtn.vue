<template>
  <!--<div v-show="state !== 2 || futuresCode">-->
  <div>
    <slot :state="state" :defClick="defClick" :txt="btnTxts[state] || txts[state]"/>
  </div>
</template>

<script>
  import { mobileEnv, getAppVsn, jumpQuotation, callFuturesService } from '../../utils/hybird'

  const { isFutures, isMoney } = mobileEnv

  export default {
    name: 'DownloadBtn',
    props: {
      // 按钮文字
      btnTxts: {
        type: Array,
        default: _ => ([])
      },
      // 合约代码
      futuresCode: [String, Number],
      // 禁用开户云
      disCloud: {
        type: Boolean,
        default: true
      },
      // 特殊点击
      onClick: Function,
      // 下载地址
      downloadUrl: String
    },
    data() {
      const { $route: { query: { trade } } } = this
      return {
        // 0-浏览器 1-未登录交易账号 2-已登录交易账号 3-主包
        state: 2,
        txts: ['下载期货APP', '立即开户', '立即交易', '下载期货APP'],
        trade,
        // 开户计数地址
        // openAccQsUrl: 'https://qs.dfcfw.com/2141'
        // openAccQsUrl: getAppVsn('3.4.0') > 0 ? 'dfcfqh://trade/kaihuv2' : 'dfcfqh://trade/kaihu'
      }
    },
    mounted() {
      const { trade } = this
      // 是否登录(如果trade为true，则不判断登录状态)
      isMoney ? (this.state = 3) : isFutures ? trade ? (this.state = 2) : callFuturesService(1005, {}, res => {
        try {
          // 登录则为2，未登录为1
          this.state = res && JSON.parse(res).loginStatus === 1 ? 2 : 1
        } catch (e) {
          this.state = 1
        }
      }) : (this.state = 0)
    },
    methods: {
      defClick() {
        // 配置
        const { state, futuresCode, disCloud, onClick, downloadUrl, openAccQsUrl } = this
        // 有配置则返回
        if (typeof onClick === 'function' && onClick(state)) return
        // 未登录则开户
        if (state === 1) {
          // 开户
          // jumpOpenAccounting({ disCloud })
          window.location.href = `dfcfqh://trade/kaihu${getAppVsn('3.4.0') > 0 ? 'v2' : ''}`
        } else {
          // 跳行情
          jumpQuotation({ futuresCode, downloadUrl })
        }
      }
    }
  }
</script>
