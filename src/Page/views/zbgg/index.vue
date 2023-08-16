<template>
  <section id="box" class="zbgg-html" @dragenter="handleEnter" @dragleave="handleLeave" @dragover="handleOver">
    <img
      v-if="bgObj.url"
      :src="bgObj.url"
      :style="`width:${bgObj.width+'rem'};height:${bgObj.height+'rem'}`"
      class="bg"
    >
    <div
      v-for="({ btnStyle, imgStyle, bgStyle, style, bgObj, btnBgObj, hasBg, ...item}, idx) in btnItemsFilter"
      :id="`btn${idx}`"
      :key="idx"
      :class="`btn ${!isPage && style.includes('bottom') ? 'pcBottom' : ''}`"
      :style="btnStyle"
      @mousedown="handleMove"
      @click="handleJump(item)"
    >
      <!--      v-if="!isPage || (!isFutures && item.moneyShow ) || (isFutures && item.futureShow) && (item.btnType === userTag || item.btnType === 'all')"-->
      <img
        :src="bgObj.url"
        :style="imgStyle"
        :class="hasBg ? 'hasBg' : ''"
      >
      <img
        :src="btnBgObj.url"
        :style="bgStyle"
      >
    </div>
    <!--  && (item.btnType === userTag || item.btnType === 'all') -->
    <DownloadPopup ref="popup" :opt="opt" :download-url="downloadUrl" :pop-type="popType" :attribute-track="popupTrack" />
    <StayPopup
      v-if="ifPopup"
      ref="stayPopup"
      :opt="opt"
      :user-tag="userTag"
      :page-id="id"
      :kh-page-id="khPageId"
      :download-url="downloadUrl"
      :popup-bg="popupBgObj"
      :popup-btn-items="popupBtnItemsFilter"
      :popup-conf="popupConf"
    />
    <PhonePopup ref="phone" />
  </section>
</template>

<script>
  import utils from '../../utils'
  import DownloadPopup from '../Components/DownloadPopup.vue'
  import PhonePopup from '../Components/PhonePopup.vue'
  import StayPopup from '../Components/StayPopup.vue'
  import tools from '@common/utils/tools'
  import { tracker } from '@/Page/api/track'
  import { pageTracker } from '@/Page/utils/attributeTrack'

  const { jumpH5Fmt, mobileEnv: { isMoney, isFund, isFutures, adr, ios }, setTitle, shareFun, callFuturesService, getAppVsn, handleBsJumpBtn, callAppService, jumpOpenAccounting } = utils
  const opt = { ...jumpH5Fmt(), downApp: true }
  const { QueryString } = tools

  // import Vue from 'vue'
  // import Vconsole from 'vconsole'

  // const vConsole = new Vconsole()
  // Vue.use(vConsole)

  export default {
    name: 'TempZbggHtml',
    components: { DownloadPopup, PhonePopup, StayPopup },
    props: {
      html: {
        type: Object,
        default: _ => ({})
      },
      isPage: Boolean,
      // 是否是预览抽屉
      isDrawer: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        InApp: window.AG,
        isFutures,
        pc: !adr && !ios,
        // 背景
        bgObj: {},
        // 按钮
        btnItems: [],
        // 是否显示挽留弹窗
        ifPopup: false,
        // 挽留弹窗配置
        popupConf: {},
        // 挽留弹窗背景
        popupBgObj: {},
        // 挽留弹窗按钮
        popupBtnItems: [],
        // 挽留弹窗显示频率
        frequency: '',
        // 挽留弹窗显示于
        linkFor: '',
        // 挽留弹窗用户类型
        userType: '',
        // 分享配置
        shareConf: {},
        // 打点id
        id: '',
        khPageId: '',
        // x轴
        positionX: 0,
        // y轴
        positionY: 0,
        // 是否拖拽
        isDrag: false,
        opt,
        jumpUrl: null,
        // 弹框类型
        popType: '',
        // 下载地址
        downloadUrl: 'https://acttg.eastmoney.com/pub/xxlout_qhtgkh_random_0003079a',
        // 用户状态
        userTag: 'all',
        timer: 0,
        // 设备信息
        deviceId: '',
        // 链接id（用于主包归因统计）
        linkId: ''
      }
    },
    computed: {
      // 页面按钮
      btnItemsFilter() {
        // 声明
        const { bgObj: { isShort } = {}, btnItems, isPage, userTag } = this
        // 过滤
        return btnItems.reduce((list, item) => {
          const { moneyShow, futureShow, btnType, style: iStyle, align, positionY, posYVal, positionX, bgObj, btnBgObj, btnBg } = item
          if (!isPage || (!isFutures && moneyShow) || (isFutures && futureShow) && (btnType === userTag || btnType === 'all')) {
            // 样式
            const alignStyle = (!iStyle && align)
              ? `${align};${/top|bottom/.test(align) ? `left:${positionX};` : ''}`
              : ''
            const y = isShort && !/top|bottom/.test(align) ? `${posYVal * 0.02}rem` : positionY
            // 图片
            const { width = 0, height = 0 } = bgObj
            // 背景图片
            const { width: bgWidth = 0, height: bgHeight = 0 } = btnBgObj
            list.push({
              ...item,
              btnStyle: `${iStyle || `top:${y};left:${positionX}`};${alignStyle};width:${width}rem;`,
              hasBg: btnBg && btnBg.length > 0,
              // ${btnBg.length ? 'margin-bottom:.2rem;' : ''}
              imgStyle: `z-index:1;width:${width}rem;height:${height}rem;${iStyle && (/bottom/.test(iStyle) ? 'margin-top:-100%' : /top/.test(iStyle) ? 'margin-bottom:-100%' : '')}`,
              bgStyle: `position:absolute;z-index:0;width:${bgWidth}rem;height:${bgHeight}rem;${iStyle && (/bottom/.test(iStyle) ? 'bottom:0' : /top/.test(iStyle) ? 'margin-bottom:-100%' : '')}`
            })
          }
          return list
        }, [])
      },
      // 挽留弹窗按钮
      popupBtnItemsFilter() {
        // 声明
        const { popupBtnItems } = this
        // 过滤
        return popupBtnItems.reduce((list, item) => {
          const { popupBgObj } = item
          // 图片
          const { width = 0, height = 0 } = popupBgObj
          list.push({
            ...item,
            btnStyle: `width:${width}rem;`,
            imgStyle: `width:${width}rem;height:${height}rem;`
          })
          return list
        }, [])
      }
    },
    watch: {
      html: {
        handler(n, o) {
          this.fmtHtml(n)
        },
        deep: true
      }
    },
    mounted() {
      // 清空标题和分享
      if (this.isPage) {
        const { shareTitle, shareDesc } = this.shareConf
        ios ? window.addEventListener('pageshow', function(event) {
          setTitle('期货')
          shareTitle && shareFun({ title: encodeURIComponent(shareTitle), desc: shareDesc })
        }) : shareTitle && shareFun({ title: encodeURIComponent(shareTitle), desc: shareDesc })
        setTitle('期货')
      }
      // setTitle('期货')
      const { isPage, html, fmtHtml, isDrawer } = this
      // ;(isPage || isDrawer) && this.$nextTick(_ => {
      //   fmtHtml(html)
      // })
      if (isPage || isDrawer) {
        this.$nextTick(_ => {
          fmtHtml(html)
        })
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 格式化页面信息
      async fmtHtml(n) {
        console.log('页面初始化')
        console.log(n)
        const { bg, btnItems, shareConf, khPageId, id, frequency = '', linkFor = '', popupBg = [], popupBtnItems = [], userType = '', popup_yes = '', popup_no = '', ifPopup = false } = n
        const confTmp = { id, popup_yes, popup_no, frequency, userType }
        // 更新
        Object.assign(this, {
          shareConf, id, frequency, linkFor, userType, ifPopup, khPageId,
          bgObj: bg.length ? bg[0] : {},
          btnItems: btnItems.map(item => {
            // 格式化
            const { bg = [], btnBg = [] } = item || {}
            // 更新
            return {
              ...item,
              bgObj: bg.length ? bg[0] : {},
              btnBgObj: btnBg.length ? btnBg[0] : {}
            }
          }),
          popupBgObj: popupBg.length ? popupBg[0] : {},
          popupBtnItems: popupBtnItems.map(item => {
            // 格式化
            const { popupBg = [] } = item || {}
            // 更新
            return { ...item, popupBgObj: popupBg.length ? popupBg[0] : {}}
          }),
          popupConf: confTmp
        })
        console.log('btnItems Page:')
        console.log(this.btnItems)
        // 获取用户状态
        if (isFutures) {
          callFuturesService('1006', undefined, res => {
            const baseInfo = JSON.parse(res)
            const userTag = baseInfo ? baseInfo.userTag : 0
            // 更新 获取token
            userTag && (this.userTag = userTag === '1' ? '1' : 'trade')
          })
        }
        this.getLinkId()
        this.getDeviceInfo()
      },
      // 获取设备信息
      getDeviceInfo() {
        callAppService('h5GetModuleInfo', {
          type: 'passport,deviceInfo'
        }, async res => {
          const { data: { deviceInfo: { deviceID, euid } = {}}} = JSON.parse(res)
          // 缓存
          this.deviceId = ios ? deviceID : euid
          try {
            if (!this.linkId) {
              console.log('getId again')
              this.getLinkId()
            }
            pageTracker(0, this.linkId, this.deviceId)
          } catch (e) {
            console.log('err: ', e)
          }
        })
      },
      // 获取链接id（原专题模板模板id即链接id）
      getLinkId() {
        const { id } = this
        const urlId = QueryString('id')
        const tmp = urlId.split('_')
        if (tmp[2]) {
          this.linkId = tmp[2] - 0
        } else {
          this.linkId = id
        }
      },
      // 按钮计数
      async btnTracker(trackUrl) {
        if (this.timer) return
        this.timer = setTimeout(_ => {
          this.timer = 0
        }, 1000)
        return await tracker.request(trackUrl, {}, { hideMsg: true, noLoading: true })
      },
      // 下载弹窗主包归因打点
      async popupTrack(clickType) {
        const { deviceId, linkId } = this
        try {
          pageTracker(clickType, linkId, deviceId)
        } catch (e) {
          console.log('err: ', e)
        }
        // pageTracker(clickType, id, deviceId)
      },
      // 跳转
      async handleJump(item) {
        const { link, iosLink, adrLink, showPop, popType, btnType, jumpType, trackUrl, downloadYes, downloadNo, downloadTotal, telYes, telNo, linkType = 'h5' } = item
        const { handleFuturesJump, btnTracker } = this
        // return
        // 链接
        const url = (ios ? iosLink : adr ? adrLink : link) || link
        // 显示下载弹窗 && 不内嵌在配置后台（不可拖拽）
        if (showPop && !this.isDrag) {
          this.jumpUrl = url
          this.popType = popType
          // 期货内
          if (isFutures) {
            btnTracker(trackUrl)
            window.location.href = adr
              ? linkType === 'short' ? url : encodeURI(`dfcfqh://h5?url=${encodeURIComponent(url)}`)
              : ios ? linkType === 'short' ? url : `dfcfqh://h5?url=${encodeURIComponent(url)}`
                : url
          } else {
            // 主包和天天基金
            if (isMoney || isFund) {
              this.opt = {
                ...jumpH5Fmt(), // 期货app打开当前页面
                downApp: true
              }
              // 弹窗
              btnTracker(trackUrl)
              const popupTrackUrl = { downloadYes, downloadNo, downloadTotal }
              const { linkId, deviceId } = this
              // 主包归因打点（下载按钮点击）
              try {
                pageTracker(1, linkId, deviceId)
              } catch (e) {
                console.log('err:', e)
              } finally {
                this.$refs.popup.show(popupTrackUrl)
              }
            } else {
              // 浏览器内
              btnTracker(trackUrl)
              // const { status } = await btnTracker(trackUrl) || {}
              const url = window.location.href
              // if (status === 0) {
              // 新中转页逻辑
              handleBsJumpBtn(url) // openApp(undefined, opt)
              // }
            }
          }
        } else {
          // 配置了跳转链接 && 不内嵌在配置后台（不可拖拽）
          if (url && !this.isDrag) {
            // 客服电话
            if (url === 'tel') {
              const popupTrackUrl = { telYes, telNo }
              try {
                btnTracker(trackUrl)
              } catch (e) {
                console.log('err: ', e)
              } finally {
                this.$refs.phone.show(popupTrackUrl)
              }
            } else {
              // 其他链接
              const { shareTitle, shareDesc } = this.shareConf
              const { emH5ShareNeed, InApp } = window.AG
              // 标题和分享
              setTitle('期货')
              // this.isPage ? emH5ShareNeed(0) : undefined
              this.isPage ? emH5ShareNeed(0) : undefined
              shareTitle ? shareFun({ title: shareTitle, desc: shareDesc }) : undefined
              // return
              window.location.href = InApp
                ? isMoney || isFund ? url
                  : adr ? linkType === 'short' ? url : encodeURI(`dfcfqh://h5?url=${encodeURIComponent(url)}`)
                    : ios ? linkType === 'short' ? url : `dfcfqh://h5?url=${encodeURIComponent(url)}`
                      : url
                : url
            }
          } else {
            // 未配置链接（开户云、开户页、交易页）
            this.isDrag = false
            if (isFutures) {
              handleFuturesJump(btnType, jumpType, url, trackUrl, telYes, telNo, linkType)
            }
          }
        }
      },
      /**
       * @method handleFuturesJump 期货内跳转
       * @param {String} btnType 用户类型：1-未开户 trade-已开户 all-全量
       * @param {String} jumpType 跳转页面类型：trade-交易首页 open-开户页面 cloud-开户云 other-其他(自定义跳转链接)
       * @param {String} url 跳转链接
       * @param {String} trackUrl 打点链接
       * @param {String} telYes 客服电话弹窗-确认拨打 打点
       * @param {String} telNo 客服电话弹窗-取消 打点
       * @param {String} linkType 跳转链接类型：h5-h5链接 short-原生锻炼
       * */
      async handleFuturesJump(btnType, jumpType, url, trackUrl, telYes, telNo, linkType) {
        const { btnTracker, khPageId } = this
        try {
          btnTracker(trackUrl)
        } catch (e) {
          console.log('err: ', e)
        } finally {
          // 客服电话弹窗
          if (btnType === 'phone') {
            const popupTrackUrl = { telYes, telNo }
            this.$refs.phone.show(popupTrackUrl)
          } else {
            // return
            // 原逻辑：btnType-期货按钮类型：开户跳开户页，交易跳交易首页，全量跳自定义链接
            if (!jumpType) {
              // 兼容
              if (btnType === '1') {
                // 开户埋点
                khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
                // 开户跳转
                window.location.href = `dfcfqh://trade/kaihu${getAppVsn('3.4.0') > 0 ? 'v2' : ''}`
              } else if (btnType === 'trade') {
                window.location.href = ios
                  ? 'eastmoney://wireless/txtrade/switchSegment?index=0' : 'dfcft://homepage/jy'
              } else {
                // 兼容旧版本更改类型未清空链接的情况
                window.location.href = adr
                  ? encodeURI(`dfcfqh://h5?url=${encodeURIComponent(url)}`)
                  : ios ? linkType === 'short' ? url : `dfcfqh://h5?url=${encodeURIComponent(url)}`
                    : url
              }
              // return
            } else {
              // 20230104新逻辑：根据跳转页面类型进行跳转，开户打点包括跳转开户页及开户云
              if (jumpType === 'trade') {
                // 跳交易首页
                window.location.href = ios ? 'eastmoney://wireless/txtrade/switchSegment?index=0'
                  : 'dfcft://homepage/jy'
              } else if (jumpType === 'open') {
                // 跳开户页
                // 开户埋点
                khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
                // 开户跳转
                window.location.href = `dfcfqh://trade/kaihu${getAppVsn('3.4.0') > 0 ? 'v2' : ''}`
              } else if (jumpType === 'cloud') {
                // 开户埋点
                khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
                // 开户云
                jumpOpenAccounting({ isPopup: true })
              } else {
                // 其他，自定义链接 // 兼容旧版本更改类型未清空链接的情况
                window.location.href = adr ? linkType === 'short' ? url : encodeURI(`dfcfqh://h5?url=${encodeURIComponent(url)}`)
                  : ios ? linkType === 'short' ? url : `dfcfqh://h5?url=${encodeURIComponent(url)}`
                    : url
              }
            }
          }
        }
      },
      handleEnter(e) {
        e.preventDefault()
      },
      handleLeave(e) {
        e.preventDefault()
      },
      handleOver(e) {
        e.preventDefault()
      },
      handleMove(el) {
        // fix：ios下app内长按按钮会出现边框，偶现按钮移动
        if (isMoney || isFund || isFutures) return

        el.preventDefault()
        this.isDrag = false
        // 获取当前元素
        const imgMakeBox = document.getElementById('box') // 获取父元素
        const dragBox = el.currentTarget // 获取当前元素
        const idx = dragBox.getAttribute('id').slice(-1) // 获取当前元素id
        // const moveFlg = !el.style
        let moveW = 0// 移动元素的width
        let moveH = 0 // 移动元素的height
        let parentW = 0// 父盒子的width
        let parentH = 0// 父盒子的height
        moveW = dragBox.offsetWidth
        moveH = dragBox.offsetHeight
        parentW = imgMakeBox.offsetWidth// 父盒子的width
        parentH = imgMakeBox.offsetHeight// 父盒子的height
        dragBox.style.border = '1px solid red'
        // 算出鼠标相对元素的位置
        const disX = el.clientX - dragBox.offsetLeft
        const disY = el.clientY - dragBox.offsetTop
        // 添加鼠标移动事件
        document.addEventListener('mousemove', handleMove)
        const that = this

        function handleMove(e) {
          let left = e.clientX - disX
          let top = e.clientY - disY
          const resW = parentW - moveW // 父盒子宽减去移动盒子的宽 = 最大可移动的区域
          const resH = parentH - moveH // 父盒子高减去移动盒子的高 = 可最大移动的区域
          left = left >= resW ? resW : left <= 0 ? 0 : left
          top = top >= resH ? resH : top <= 0 ? 0 : top
          const positionX = left / parentW * 100 + '%' // left * 2 / 100 + 'rem'
          const positionY = top / parentH * 100 + '%' // top * 2 / 100 + 'rem'
          // 移动当前元素
          // if (moveFlg) {
          dragBox.style.left = positionX
          dragBox.style.top = positionY
          dragBox.style.bottom = 'unset'
          dragBox.style.right = 'unset'
          dragBox.style.border = '1px solid red'
          that.isDrag = true
          that.$emit('leftChange', idx, positionX)
          that.$emit('topChange', idx, positionY, top)
          // }
        }

        // 添加鼠标抬起事件，鼠标抬起，将事件移除
        dragBox.addEventListener('mouseup', function() {
          this.isDrag = false
          dragBox.style.border = 'none'
          document.removeEventListener('mousemove', handleMove)
        })
        // 鼠标离开父级元素，把事件移除
        dragBox.addEventListener('mouseout', function() {
          this.isDrag = false
          dragBox.style.border = 'none'
          document.removeEventListener('mousemove', handleMove)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
