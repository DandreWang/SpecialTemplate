<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <van-popup v-model="showFlg" class="downloadPopup" :close-on-click-overlay="false" get-container="#box">
    <img v-if="popupBg.url" :src="popupBg.url" :style="`width:${popupBg.width+'rem'};height:${popupBg.height+'rem'}`" class="bg">
    <div class="close" @click="hide" />
    <div v-for="(item, idx) in popupBtnItems" :key="idx" class="btns" @click="handleJump(item)">
      <img :src="item.popupBgObj.url" :style="item.imgStyle">
    </div>
  </van-popup>
</template>

<script>
  import Vue from 'vue'
  import { Popup } from 'vant'
  import utils from '../../utils/hybird'
  import { tracker } from '@/Page/api/track'
  import { format } from 'date-fns'
  const { callHybridMethod, mobileEnv: { ios, adr, isMoney, isFutures }, callAppService, jumpOpenAccounting, androidDownload, fmtUrl, bsOpenApp, getAppVsn, callFuturesService } = utils
  Vue.use(Popup)

  // 上次打开日期
  const DATE_STORAGE_KEY = 'qh_last_date'
  // 是否初次打开
  const INIT_KEY = 'qh_init_key'

  export default {
    name: 'StayPopup',
    props: {
      // 下载地址
      downloadUrl: String,
      // 弹窗背景
      popupBg: Object,
      // 弹窗按钮
      popupBtnItems: Array,
      // 挽留弹窗配置
      popupConf: Object,
      // 页面id
      pageId: Number,
      // 开户页面id
      khPageId: String,
      opt: {
        type: Object,
        default: _ => null
      },
      confirmClick: {
        type: Function,
        default: _ => null
      },
      // 获取到的用户类型
      userTag: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showFlg: false,
        txtArr: {
          one: ['即将前往期货APP', '如您尚未安装，将进行下载'],
          two: ['即将前往期货APP', '如您尚未安装，将跳转至应用商店下载']
        },
        // 打点url
        popupTrackUrl: {},
        timer: 0,
        preTrackUrl: '',
        // 打开天数间隔
        gap: 0,
        // pc
        pc: !ios && !adr
        // downloadYes: '', // 确认
        // downloadNo: '' // 取消
      }
    },
    // watch: {
    //   popupBg(a, b) {
    //     console.log('弹窗背景')
    //     console.log(a)
    //   },
    //   popupBtnItems(a, b) {
    //     console.log('弹窗按钮')
    //     console.log(a)
    //   },
    //   popupConf(a) {
    //     console.log(a)
    //   }
    // },
    mounted() {
      const { getDateGap, popupBtnItems, pageId } = this
      const td = format(new Date(), 'YYYY-MM-DD') // 当前日期
      const ld = localStorage.getItem(`${DATE_STORAGE_KEY}_${pageId}`)
      const gap = getDateGap(ld, td)

      // 期货包内
      if (isFutures) {
        callFuturesService('1014', {}, _ => {
          const { popupConf: { frequency }, show } = this
          const ifInit = JSON.parse(localStorage.getItem(`${INIT_KEY}_${pageId}`))
          const ld = localStorage.getItem(`${DATE_STORAGE_KEY}_${pageId}`)
          if (frequency === 'day') {
            if (td !== ld || ifInit) {
              console.log('show')
              show(td)
            } else {
              callFuturesService('1000', {})
              console.log('关闭')
            }
          } else if (frequency === 'week') {
            if (td !== ld && gap >= 7 || ifInit) {
              console.log('show')
              show(td)
            } else {
              callFuturesService('1000', {})
              console.log('关闭')
            }
          } else {
            callFuturesService('1000', {})
            console.log('关闭')
          }
        })
      } else {
        // 主包
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 显示
      async show(td) {
        const { btnTracker, popupConf: { popup_yes, userType }, userTag, pageId } = this
        // v-if="userType === userTag || userType === 'all'"
        if (userType === 'traded' && userTag === 'trade' || userType === 'all' || userType === 'trade' && userTag === '1') {
          this.showFlg = true
          localStorage.setItem(`${DATE_STORAGE_KEY}_${pageId}`, td)
          localStorage.setItem(`${INIT_KEY}_${pageId}`, false)
          await btnTracker(popup_yes)
        } else {
          callFuturesService('1000', {})
          console.log('关闭')
        }
      },
      // 关闭（取消）
      async hide() {
        const { btnTracker, popupConf: { popup_no }} = this
        console.log(popup_no)
        try {
          btnTracker(popup_no)
        } catch (e) {
          console.log('err: ', e)
        } finally {
          this.showFlg = false
        }
      },
      // 日期间隔
      getDateGap(ld, td) {
        // const ifInit = localStorage.getItem(INIT_KEY)
        if (ld) {
          const last = Date.parse(ld)
          const current = Date.parse(td)
          // 计算两个日期之间相差的毫秒数的绝对值
          const distance = Math.abs(current - last)
          // 毫秒数除以一天的毫秒数得到天数
          const days = Math.floor(distance / (24 * 3600 * 1000))
          console.log(days)
          return days
        } else {
          const { pageId } = this
          localStorage.setItem(`${DATE_STORAGE_KEY}_${pageId}`, td)
          localStorage.setItem(`${INIT_KEY}_${pageId}`, true)
          return 0
        }
      },
      // 按钮跳转
      async handleJump(item) {
        const { iosLink, adrLink, link, popup_account, popup_others, popup_trade, popup_cloud = '', skipTo, linkType = 'h5' } = item
        const { btnTracker, khPageId } = this
        // 链接
        const url = (ios ? iosLink : adr ? adrLink : link) || link

        // 当前只考虑期货包内 20220517-v1
        if (skipTo === 'others') { // 其他
          try {
            btnTracker(popup_others)
          } catch (e) {
            console.log('err:', e)
          } finally {
            this.showFlg = false
            window.location.href = adr
              ? linkType === 'short' ? url : encodeURI(`dfcfqh://h5?url=${encodeURIComponent(url)}`)
              : ios ? linkType === 'short' ? url : `dfcfqh://h5?url=${encodeURIComponent(url)}`
                : url
          }
        } else if (skipTo === 'trade') { // 交易
          try {
            await btnTracker(popup_trade)
          } catch (e) {
            console.log('err: ', e)
          } finally {
            this.showFlg = false
            window.location.href = ios
              ? 'eastmoney://wireless/txtrade/switchSegment?index=0' : 'dfcft://homepage/jy'
          }
        } else if (skipTo === 'account') { // 开户
          try {
            btnTracker(popup_account)
          } catch (e) {
            console.log('err: ', e)
          } finally {
            this.showFlg = false
            // 开户埋点
            khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
            // 开户跳转
            window.location.href = `dfcfqh://trade/kaihu${getAppVsn('3.4.0') > 0 ? 'v2' : ''}`
          }
        } else if (skipTo === 'cloud') {
          try {
            btnTracker(popup_cloud)
          } catch (e) {
            console.log('err: ', e)
          } finally {
            this.showFlg = false
            // 开户埋点
            khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
            // 开户云
            jumpOpenAccounting({ isPopup: true })
          }
        }

        // if(isMoney) {
        //   this.handleMainClick(item)
        // }
      },
      // 按钮计数
      async btnTracker(trackUrl) {
        const { timer, preTrackUrl, pc } = this
        console.log(trackUrl)
        if (!trackUrl || timer && trackUrl === preTrackUrl || pc) return Promise.resolve()
        Object.assign(this, {
          timer: setTimeout(_ => {
            Object.assign(this, { timer: 0, preTrackUrl: '' })
          }, 1000),
          preTrackUrl: trackUrl
        })
        await tracker.request(trackUrl, {}, { hideMsg: true, noLoading: true })
      },
      // 主包按钮点击
      async handleMainClick(item) {
        const { popup_appStore, popup_futures, popup_total, download } = item
        const { downloadUrl, opt, confirmClick, btnTracker } = this
        // 隐藏弹窗
        this.showFlg = false
        // 有配置则返回
        if (typeof confirmClick === 'function' && confirmClick()) return

        // 包名
        const appname = 'com.eastmoney.app.qhsjkh'
        const { downApp, android, ios } = opt
        // 目标地址
        const href = fmtUrl(downloadUrl)
        // 前缀
        const prefix = undefined
        const InApp = window.AG

        // 确认按钮计数(总确认)
        await btnTracker(popup_total)

        // 判断跳转期货打点
        const gotoFuturesTimer = setTimeout(async() => {
          await btnTracker(popup_futures)
        }, 500)

        isMoney ? callAppService(adr ? 'emH5toOpenApp' : 'emh5toopenapp', {
          appname,
          isLocal: true,
          scheme: `eastmoneyqh://${adr ? android : ios}`,
          ...opt
        }, async res => {
          if (res.code === 0 || !downApp) return
          clearTimeout(gotoFuturesTimer)
          // // 确认按钮计数(未安装)
          // await btnTracker(popup_appStore)
          // 跳转应用商店
          if (download === 'two') {
            // 9.7.0之后直接跳转应用商店
            if (getAppVsn('9.7.0') >= 0) {
              // 确认按钮计数(跳应用商店)
              await btnTracker(popup_appStore)
              if (adr) {
                callHybridMethod('Router', 'openAppStoreWithId', {
                  packageName: 'com.eastmoney.app.qhsjkh', scheme: 'eastmoneyqh://home'
                })
              } else {
                window.location.href = 'https://qhh5app.eastmoney.com/QihuoDownload.aspx'
              }
            } else {
              // 9.7.0之前跳下载承接页
              window.location.href = 'https://qhemrs.eastmoney.com/h5/Download/index.html'
            }
          } else {
            // 如果目标地址为下载，则使用iframe，否则直接跳转
            adr ? androidDownload(href) : (location.href = href)
          }
          // 如果目标地址为下载，调用兼容方法
        }) : !InApp && downApp ? bsOpenApp(href, { ios, android }, prefix) : (location.href = href)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@common/style/common';

  $imageUrl: './images/';
  .downloadPopup {
    width: 6.8rem;
    // height: 7rem;
    -webkit-transform: translate3d(-50%,-50%,11px);
    transform: translate3d(-50%,-50%,11px);
    background-color: transparent;
    padding-top: .5rem;
    overflow: hidden;
    top: 48vh;
    left: 53vw;
    .close {
      width: .5rem;
      height: .5rem;
      @include bg-image($imageUrl + 'close-btn');
      position: absolute;
      top: 0;
      right: .3rem;
    }
    .btns {
      position: absolute;
      bottom: 0;
    }
  }
</style>
