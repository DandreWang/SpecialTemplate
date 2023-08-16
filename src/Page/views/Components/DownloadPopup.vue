<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <van-popup v-model="showFlg" class="downloadPopup" @click-overlay="clickOverlay">
    <div class="txtBox">
      <div v-for="(item, idx) in txtArr[popType]" :key="idx" class="txt">
        {{ item }}
      </div>
    </div>
    <div class="btnBox">
      <div class="btn cancelBtn" @click="hide">取消</div>
      <div class="btn confirmBtn" @click="handleClick">确认</div>
    </div>
  </van-popup>
</template>

<script>
  import Vue from 'vue'
  import { Popup } from 'vant'
  import utils from '../../utils/hybird'
  import { tracker } from '@/Page/api/track'
  import { mainTracker } from './utils'
  const { callHybridMethod, mobileEnv: { ios, adr, isMoney, isFund }, callAppService, androidDownload, fmtUrl, bsOpenApp, getAppVsn, openApp } = utils

  const { NODE_ENV } = process.env
  const mainTrackUrl = {
    development: 'http://10.228.131.7:8080/futures-management/main/downloadSave,post',
    production: 'https://qhdd.eastmoney.com/futures-management/main/downloadSave,post'
  }
  Vue.use(Popup)

  // import Vconsole from 'vconsole'
  // const vConsole = new Vconsole()
  // Vue.use(vConsole)

  export default {
    name: 'DownloadPopup',
    props: {
      // 下载地址
      downloadUrl: String,
      opt: {
        type: Object,
        default: _ => null
      },
      confirmClick: {
        type: Function,
        default: _ => null
      },
      // 文字类型
      popType: {
        type: String,
        default: 'one'
      },
      // 主包归因统计打点
      attributeTrack: {
        type: Function,
        default: _ => null
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
        preTrackUrl: ''
        // downloadYes: '', // 确认
        // downloadNo: '' // 取消
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 显示
      show(popupTrackUrl = {}) {
        this.showFlg = true
        this.popupTrackUrl = popupTrackUrl
        // this.downloadNo = downloadNo
      },
      // 关闭（取消）
      async hide() {
        const { popupTrackUrl: { downloadNo }, btnTracker } = this
        btnTracker(downloadNo, this.showFlg = false)
        // try {
        //   btnTracker(downloadNo)
        // } catch (e) {
        //   console.log('err:', e)
        // } finally {
        //   this.showFlg = false
        // }
      },
      // 点击遮罩
      async clickOverlay() {
        const { popupTrackUrl: { downloadNo }, btnTracker } = this
        btnTracker(downloadNo)
        // try {
        //   btnTracker(downloadNo)
        // } catch (e) {
        //   console.log(e)
        // }
      },
      // 按钮计数
      async btnTracker(trackUrl, finalleyFun) {
        const { timer, preTrackUrl } = this
        console.log(trackUrl)
        if (!trackUrl || timer && trackUrl === preTrackUrl) return Promise.resolve()
        Object.assign(this, {
          timer: setTimeout(_ => {
            Object.assign(this, { timer: 0, preTrackUrl: '' })
          }, 1000),
          preTrackUrl: trackUrl
        })
        try {
          await tracker.request(trackUrl, {}, { hideMsg: true, noLoading: true })
        } catch (e) {
          console.log(e)
        } finally {
          typeof finalleyFun === 'function' && finalleyFun()
        }
      },

      // 跳转应用商店计数
      downloadTracker() {
        return new Promise(async resolve => {
          callAppService('h5GetModuleInfo', {
            type: 'passport,deviceInfo'
          }, async res => {
            const { data: { deviceInfo: { idfv, euid, deviceBrand, phoneModle } = {}, passport: { uid } = {}}} = JSON.parse(res)
            const trackBody = {
              userId: uid,
              platform: ios ? 'ios' : (adr ? 'android' : '其他'),
              idfv, euid,
              device: deviceBrand || phoneModle,
              url: window.location.href
            }
            await mainTracker.request(mainTrackUrl[NODE_ENV], trackBody, { hideMsg: true, noLoading: true }).catch(console.log)
            resolve()
          })
        })
      },

      // 确认
      async handleClick() {
        const { downloadUrl, opt, confirmClick, attributeTrack, popType, popupTrackUrl: { downloadYes, downloadTotal, downloadFuture }, btnTracker, downloadTracker } = this
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
        await btnTracker(downloadTotal)

        // 归因统计打点（确认按钮）
        if (typeof attributeTrack === 'function' && attributeTrack) {
          await attributeTrack(2)
        }

        // // 跳应用商店打点（通用）
        // await downloadTracker()

        // 判断跳转期货打点
        const gotoFuturesTimer = setTimeout(async() => {
          await btnTracker(downloadFuture)
        }, 500)

        isMoney ? callAppService(adr ? 'emH5toOpenApp' : 'emh5toopenapp', {
          appname,
          isLocal: true,
          scheme: `eastmoneyqh://${adr ? android : ios}`,
          ...opt
        }, async res => {
          if (res.code === 0 || !downApp) return
          clearTimeout(gotoFuturesTimer)
          // 确认按钮计数(未安装)
          await btnTracker(downloadYes)
          // 归因统计打点（跳转至应用商店或直接下载）
          if (typeof attributeTrack === 'function' && attributeTrack) {
            await attributeTrack(3)
          }
          // 跳转应用商店
          if (popType === 'two') {
            // 跳应用商店打点（通用）
            await downloadTracker()
            // 9.7.0之后直接跳转应用商店
            if (getAppVsn('9.7.0') >= 0) {
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
          // 天天基金
        }) : isFund ? openApp(undefined, opt)
          // 如果目标地址为下载，调用兼容方法
          : !InApp && downApp ? bsOpenApp(href, { ios, android }, prefix) : (location.href = href)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@common/style/common';

  $imageUrl: './images/';
  .downloadPopup {
    $color: #333;
    width: 6.88rem;
    height: 5.38rem;
    color: $color;
    font-family: SourceHanSansSC-Normal;
    -webkit-transform: translate3d(-50%,-50%,11px);
    transform: translate3d(-50%,-50%,11px);
    background-color: transparent;
    @include bg-image($imageUrl + 'download-popup-bg');
    @include flex-center(column);
    padding-top: 1.42rem;
    &:before {
      content: '';
      width: 1.2rem;
      height: .13rem;
      background: url($imageUrl + "points-1.gif") no-repeat center/contain;
      position: absolute;
      background-position: 0 0;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .txtBox{
      @include flex-center(column);
      .txt {
        font-size: .28rem;
        color: #666;
        line-height: .4rem;
        &:nth-of-type(1) {
          font-family: SourceHanSansSC-Bold;
          font-weight: bold;
          font-size: .4rem;
          line-height: .58rem;
          color: #333;
          margin-bottom: .02rem;
        }
      }
    }

    .btnBox {
      @include flex-center();
      margin-top: .38rem;
      .btn{
        width: 2.22rem;
        height: .72rem;
        border: 1px solid #EB6231;
        border-radius: .36rem;
        font-size: .36rem;
        color: #EB6231;
        @include flex-center();
        &.confirmBtn{
          border: none;
          background-image: linear-gradient(-180deg, #FF9F59 0%, #EA6231 100%);
          box-shadow: 0 5px 7px 0 rgba(147,6,0,0.12), inset 0 1px 0 0 #FFAF69;
          color: #FFF;
          margin-left: .32rem;
        }
      }
    }
  }
</style>
