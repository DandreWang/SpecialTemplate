<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <van-popup v-model="showFlg" class="phonePopup" @click-overlay="clickOverlay">
    <div class="txtBox">
      <div class="tit">客服热线</div>
      <div class="phone">400-980-1818</div>
    </div>
    <div class="btnBox">
      <div class="btn cancelBtn" @click="hide">取消</div>
      <div class="btn confirmBtn" @click="handleClick">呼叫</div>
    </div>
  </van-popup>
</template>

<script>
  import Vue from 'vue'
  import { Popup } from 'vant'
  import { tracker } from '@/Page/api/track'
  Vue.use(Popup)
  export default {
    name: 'PhonePopup',
    data() {
      return {
        showFlg: false,
        phone: '400-980-1818',
        // 打点url
        popupTrackUrl: {}
      }
    },
    methods: {
      // 显示
      show(popupTrackUrl = {}) {
        this.showFlg = true
        this.popupTrackUrl = popupTrackUrl
      },
      // 取消
      async hide() {
        const { popupTrackUrl: { telNo }} = this
        await this.btnTracker(telNo)
        this.showFlg = false
      },
      // 点击遮罩
      async clickOverlay() {
        const { popupTrackUrl: { telNo }} = this
        await this.btnTracker(telNo)
      },
      // 确认
      async handleClick() {
        const { phone, popupTrackUrl: { telYes }} = this
        await this.btnTracker(telYes)
        window.location.href = `tel:${phone}`
        // 隐藏弹窗
        this.showFlg = false
      },

      // 按钮计数
      async btnTracker(trackUrl) {
        if (!trackUrl) return
        // 节流
        if (this.timer) return Promise.resolve()
        this.timer = true
        setTimeout(() => this.timer = false, 1000)

        if (!trackUrl) return Promise.resolve()
        try {
          await tracker.request(trackUrl, {}, { hideMsg: true, noLoading: true })
        } catch (e) {
          console.log('err: ', e)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '~@common/style/common';

.phonePopup {
  color: #333;
  font-family: SourceHanSansSC-Normal;
  background-color: white;
  padding: .3rem .2rem;
  border-radius: .3rem;
  width: 5.6rem;
  text-align: center;
  -webkit-transform: translate3d(-50%,-50%,11px);
  transform: translate3d(-50%,-50%,11px);
  .tit {
    font-size: .36rem;
    font-weight: bold;
  }
  .phone {
    font-size: .32rem;
    margin-top: .28rem;
  }
  .btnBox {
    @include flex-center();
    margin-top: .38rem;
    .btn{
      width: 2rem;
      height: .6rem;
      border: 1px solid #EB6231;
      border-radius: .36rem;
      font-size: .3rem;
      color: #EB6231;
      line-height: .6rem;
      @include flex-center();
      &.confirmBtn{
        border: none;
        background-image: linear-gradient(-180deg, #FF9F59 0%, #EA6231 100%);
        box-shadow: 0 5px 7px 0 rgba(147,6,0,0.12), inset 0 1px 0 0 #FFAF69;
        color: #FFF;
        margin-left: .36rem;
      }
    }
  }
}
</style>
