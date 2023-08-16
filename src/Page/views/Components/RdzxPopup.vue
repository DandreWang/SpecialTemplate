<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <van-popup v-model="showFlg" class="downloadPopup">
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
  const { callHybridMethod, mobileEnv: { adr, isMoney }, callAppService, androidDownload, fmtUrl, bsOpenApp, getAppVsn } = utils
  Vue.use(Popup)

  export default {
    name: 'RdzxPopup',
    props: {
      // 下载地址
      downloadUrl: String,
      opt: {
        type: Object,
        default: _ => null
      },
      // 文字类型
      popType: {
        type: String,
        default: 'one'
      }
    },
    data() {
      return {
        showFlg: false,
        txtArr: {
          one: ['即将前往期货APP', '如您尚未安装，将进行下载'],
          two: ['即将前往期货APP', '如您尚未安装，将跳转至应用商店下载']
        },
      }
    },
    methods: {
      // 显示
      // show(popupTrackUrl = {}) {
      show() {
        this.showFlg = true
      },
      // 关闭（取消）
      async hide() {
        this.showFlg = false
      },
      // 确认
      async handleClick() {
        const { downloadUrl, opt, popType } = this
        // 隐藏弹窗
        this.showFlg = false
        // 包名
        const appname = 'com.eastmoney.app.qhsjkh'
        const { downApp, android, ios } = opt
        // 目标地址
        const href = fmtUrl(downloadUrl)
        // 前缀
        const prefix = undefined
        const InApp = window.AG
        isMoney ? callAppService(adr ? 'emH5toOpenApp' : 'emh5toopenapp', {
          appname,
          isLocal: true,
          scheme: `eastmoneyqh://${adr ? android : ios}`,
          ...opt
        }, async res => {
          if (res.code === 0 || !downApp) return
          // 确认按钮计数(未安装)
          // await btnTracker(downloadYes)
          // 跳转应用商店
          if (popType === 'two') {
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
      height: .9rem;
      background: url($imageUrl + "download-points.gif") no-repeat center/cover;
      position: absolute;
      top: .6rem;
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
