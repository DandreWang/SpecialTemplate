<style lang="scss" scoped>
  @import "index";
</style>
<style lang="scss">
  .aboutList {
    .sub {
      font-size: .22rem;color:#666;
      margin: .12rem 0 .04rem;
    }
    .about-sub {
      margin-top:.15rem;
      font-size: .28rem;
      color: #666666;
      font-weight: 400;
    }
  }
  .black .aboutList {
    .sub, .about-sub { color: #999;}
  }
</style>
<template>
  <section class="rmhq-html">
    <header>
      <div class="logo"></div>
      <a href="tel:400-980-1818" class="tel" />

      <div class="tit1" v-html="tit.slice(0,10)" />
      <div class="tit1" style="line-height:.6rem" v-html="subTit" />
    </header>
    <div class="content">
      <div class="hqBox box">
        <!-- 两个标题 -->
        <div class="subTit">
          {{ hqTit }}
        </div>
        <div class="thr tr">
          <div class="th">
            期货品种
          </div>
          <div class="th">
            最新价
          </div>
          <div class="th">
            涨跌幅
          </div>
        </div>
        <div
          v-for="{ isgn, fmtName, name, price, miniSize,zdt, zdf, uid, zdfTxt, isjy } in hqList"
          :key="uid"
          :class="`tr icon${isgn ? 1 : 2} ${isgn}`"
          @click="handleJumpHq(uid, name)"
        >
          <div class="name">
            {{ fmtName }}
          </div>
          <div
            :class="`val ${zdf !== '-' && zdf !== 0 ? zdf > 0 ? 'z' : 'd' : ''} ${zdt}`"
            :style="{fontSize: miniSize?'.26rem':'.3rem'}"
          >
            {{ price }}
          </div>
          <div
            :class="`zdf ${zdf !== '-' && zdf !== 0 ? zdf > 0 ? 'z' : 'd' : ''}`"
          >
            {{ zdfTxt }}
          </div>
          <div :class="`hqBtn ${isjy ? '' : 'k'}`" @click.stop="handleJumpHq(uid, name, isjy? isgn: false)">
            {{ isjy ? '交易' : '行情' }}
          </div>
        </div>
      </div>
      <div v-show="zxList.length" class="zxList box">
        <div class="subTit">
          {{ zxTit }}
        </div>
        <a
          v-for="(item, idx) in zxList"
          :key="idx"
          :class="`zxItem ${item.isVisited ? 'isVisited' : ''}`"
          href="javascript:void(0);"
          @click="handleJumpZX(item, idx)"
        >{{ item.title }}</a>
      </div>
      <div v-if="fwb" class="fwb box">
        <div class="subTit">
          {{ fwbTit }}
        </div>
        <div class="fwbBox" v-html="fwb" />
      </div>
      <div class="features">
        <div class="aboutList box">
          <div class="box-top">
            <div class="featureTit">期货交易特点</div>
          </div>
          <div class="feature-list">
            <div v-for="(tts, i) in features" :key="i" class="tr">
              <div :class="'feature'+(i+1)" />
              <div class="td" v-html="tts" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="isFutures" class="about">
        <div class="tips" v-html="statement" />
      </div>
      <div v-else class="about">
        <div class="aboutList box lastBox">
          <div class="box-top">
            <div class="title">期货交易就选 <span class="app">期货APP</span></div>
          </div>
          <div v-for="(tts,idx) in abouts" :key="idx" class="tr">
            <div class="td" v-html="tts" />
          </div>
        </div>
        <div class="tips" v-html="statement" />
      </div>
    </div>

    <DownloadBtn class="emp">
      <footer
        slot-scope="{ state, txt }"
        class="btnBox"
        :tracker-eventcode="btnDbId"
        :tracker-extinfo="`${btnDbId}_state:${state}`"
        @click="defClick(state)"
      >
        <div v-if="!hasBottomBts" class="btn">
          <div class="btnTxt">
            {{ txt }}
          </div>
          <div class="btnIcon" />
        </div>
        <img v-else class="btnImg" :src="btnImg(state)" alt="">
      </footer>
    </DownloadBtn>
    <DownloadPopup ref="popup" :opt="opt" :download-url="downloadUrl" :pop-type="isMoney?'two':'one'" />
    <PhonePopup ref="phone" />
  </section>
</template>

<script>
  import REGS from '@common/utils/validate'
  import { seeReq } from '../../api/hqReq'
  import { zxReq } from '../../api/zxReq'
  import SSE from '@/Page/utils/SSE'
  import hybird from '@/Page/utils/hybird'
  import utils from '@/Page/utils'
  import { tracker } from '@/Page/api/track'
  import DownloadBtn from '../Components/DownloadBtn'
  import DownloadPopup from '../Components/DownloadPopup.vue'
  import PhonePopup from '../Components/PhonePopup.vue'
  import names from './name'
  import { statement } from './data'

  // import Vue from 'vue'
  // import Vconsole from 'vconsole'
  // const vConsole = new Vconsole()
  // Vue.use(vConsole)

  // 国内商所
  const { domesticMarketCodes } = REGS.VALIDATE_REGS
  // 工具
  const { jumpQuotation, mobileEnv, appJump, jumpTrade } = hybird
  const { jumpH5Fmt, mobileEnv: { isMoney, isFutures, adr, ios }, openApp, setTitle, shareFun, callFuturesService, getAppVsn } = utils
  const opt = { ...jumpH5Fmt(), downApp: true }
  export default {
    name: 'TempRmhqHtml',
    components: { DownloadBtn, DownloadPopup, PhonePopup },
    props: {
      html: {
        type: Object,
        default: _ => ({})
      },
      // 预览环境：0主包 1期货
      envType: Number,
      isPage: Boolean
    },
    data() {
      return {
        statement,
        cols: [
          { label: '期货品种', key: 'fmtName' },
          { label: '最新', key: 'p' },
          { label: '涨跌幅', key: 'zdf' }
        ],
        features: [
          '保证金交易<div class="sub">支付一定比例  即可参与交易</div>',
          '日盘+夜盘<div class="sub">白天忙工作  晚上可炒期货</div>',
          '双向交易<div class="sub">买涨买跌 都有投资机会</div>',
          'T+0交易<div class="sub">当天买当天卖  及时止盈止损</div>'
        ],
        abouts: [
          '旗下期货投资平台',
          '手机APP在线开户 方便快捷',
          '商品期货开户 不设资金门槛'
        ],
        // 标题
        tit: '',
        subTit: '',
        hqTit: '',
        zxTit: '',
        fwbTit: '',
        // 埋点ID
        itemDbId: '', btnDbId: '',
        // 标题品种
        mainClsId: '',
        // 分享描述
        shareConf: '',
        // 品种数据 CZCE_PM305
        futuresUidsStr: '',
        futuresUids: '',
        // 国内品种
        gnIds: [],
        // 国外品种
        gwIds: [],
        // 列表数据
        hqList: [],
        // 资讯数据
        zxList: [],
        fwb: '',
        // 主力数据
        mains: [],
        // sse
        es: null,
        // 选择期货跟交易特点显隐
        mainChooseHide: 0, mainFeatsHide: 0, qhChooseHide: 0, qhFeatsHide: 0,
        // 弹框类型
        popType: '',
        // 下载地址
        downloadUrl: 'https://acttg.eastmoney.com/pub/xxlout_qhtgkh_random_0003079a',
        opt,
        // 1秒内多次点击不打点
        timer: false,
        isMoney,
        isFutures
      }
    },
    computed: {
      // 主包|预览主包
      isMoneyComputed() {
        const { isPage, envType, isMoney } = this
        return isMoney || (!isPage && !envType)
      },
      // 底部按钮配图
      hasBottomBts() {
        const { html, html: { btnOpts = [] }} = this
        if (!html || !html.btnOpts) return
        return html.btnOpts.findIndex(t => t.image) > -1
      }
    },
    watch: {
      html(n, o) {
        this.reload(n)
      }
    },
    async mounted() {
      const { html, isPage } = this
      // 获取主力行情
      await this.getMainList()
      // 格式化参数
      await this.reload(html)
      // 清空标题和分享
      if (isPage) {
        const { shareTitle, shareDesc } = this.shareConf
        ios ? window.addEventListener('pageshow', function(event) {
          setTitle('期货')
          shareTitle && shareFun({ title: shareTitle, desc: shareDesc })
        }) : shareTitle && shareFun({ title: shareTitle, desc: shareDesc })
        setTitle('期货')
      }
      // 网页打开
      isPage && this.initActiveData()
    },
    methods: {
      // 检查黑主题
      checkIsBlack() {
        const bodyClassList = new Array(...document.querySelector('body').classList)
        let isBlack = false
        bodyClassList.forEach(t => {
          if (t === 'black') isBlack = true
          if (t === 'white') isBlack = false
        })
        return isBlack
      },
      // 下载按钮图片
      btnImg(state) {
        const { checkIsBlack, html: { btnOpts = [] }} = this
        state = state === 3 ? 0 : state
        // 黑色
        if (checkIsBlack()) {
          state += 3
        }
        return btnOpts[state].image
      },
      // 跳转
      async handleJumpHq(uid, name, isgn) {
        const { showPop, itemDbId, trackerUrls: { downloadTotal, trade }, tracker } = this
        if (!isFutures) return showPop('download')
        // try {
        //   itemDbId && window.sendTrackLog('Button', 'Click', itemDbId, `${itemDbId}_uid:${uid}`)
        // } catch (e) {
        // }
        // 下载或是交易
        await tracker(isMoney ? downloadTotal : trade)
        const [market, dm] = uid.split('|')
        // 跳交易
        // // isgn ? jumpTrade({ name, dm, market: `${market}|` }) : jumpQuotation({ futuresCode: uid.replace(/^8\|/, 'SF') })
        // isgn ? jumpTrade({ name, dm, market: `${market}|` }) : jumpQuotation({ futuresCode: uid.replace(/^220\|/, 'SF') })

        // // 期货4.7.0版本前不支持广期所行情跳转，要跳转至帮助中心
        if (getAppVsn('4.7.0') < 0 && uid.includes('GFEX')) {
          // 跳转前清除分享
          const { emH5ShareNeed } = window.AG
          emH5ShareNeed(0)
          // 跳转
          window.location.href = 'https://qs.dfcfw.com/3956'
        } else {
          isgn ? jumpTrade({ name, dm, market: `${market}|` }) : jumpQuotation({ futuresCode: uid.replace(/^220\|/, 'SF') })
        }
      },
      handleJumpZX(item, idx) {
        const { code, url, infoType = 1 } = item
        if (!code) return
        if (!isFutures) return this.showPop('download')
        const link = {
          ios: `eastmoney://page/newsdetail?newsid=${code}&newstype=${infoType || 1}`,
          android: `dfcft://router/news/detail?id=${code}&type=${infoType || 1}`
        }
        // 置灰
        this.zxList[idx] && (this.zxList[idx].isVisited = true)
        // 跳转
        if (mobileEnv.isMoney) {
          location.href = link[mobileEnv.ios ? 'ios' : 'android']
        } else if (mobileEnv.isFutures) {
          location.href = `dfcfqh://page/newsdetail?newsid=${code}&newstype=${infoType || 1}`
        } else {
          location.href = url || `https://futures.eastmoney.com/a/${code}.html`
        }
      },
      // 动态数据
      initActiveData() {
        // 建立链接
        this.setSSE()
      },
      async getZxData(data) {
        const { zxList = [], hqList } = data
        const { getZxRemote } = this
        // 参数
        const nlist = await getZxRemote(hqList) || []
        // 拼接
        this.zxList = zxList.concat(nlist)
      },
      // 获取行情数据
      async getHqData(data) {
        const { gnIds, gwIds } = data
        // 无数据则返回
        if (!gnIds && !gwIds) return
        // 声明
        const { getStaticData, fmtGnList, fmtList } = this
        // 请求
        const [gn, gw] = await Promise.all([fmtGnList(gnIds), getStaticData(gwIds)])
        // 无数据则返回
        if (!gn.length && !gw.length) return
        // 汇总
        const res = fmtList([].concat(gn, gw))
        // 全品种
        const futuresUids = res.map(({ uid }) => uid)
        try {
          // 更新列表
          Object.assign(this, {
            // 行情数据
            hqList: res,
            // 行情品种
            futuresUidsStr: futuresUids.join(',').replace(/\|/g, '_'),
            futuresUids
          })
        } catch (e) {
          console.log(e)
        }
      },
      setSSE() {
        const { onMsg, getStaticData, futuresUids, futuresUidsStr, fmtList } = this
        const field = 'uid,zdf,p,name,dm,sc,zt,dt'
        const { options: { apis: { customSSE }, baseURL }} = seeReq
        // sse
        this.es = new SSE({
          // 路径
          url: `${baseURL}${customSSE}${futuresUidsStr}?field=${field}`,
          // 监听
          onMsg,
          // 获取静态数据
          getStaticData: async _ => {
            // 数据
            const res = await getStaticData(futuresUidsStr)
            // 无数据
            if (!res.length) return
            // 排序
            const sortList = futuresUids.map(id => res.filter(item => item.uid === id)[0])
            // 格式化
            this.hqList = fmtList(sortList)
          }
        })
      },
      // 推送更新
      onMsg(event) {
        // 更新
        const { qtList } = JSON.parse(event.data)
        // 空则不更新
        if (!qtList || !qtList.length) return
        const { fmtList, hqList } = this
        // 更新
        this.hqList = fmtList(hqList.map(o => {
          const [n] = qtList.filter(qt => qt.uid === o.uid)
          // 无变化
          if (!n) return o
          // 更新
          return Object.assign({}, n, { fmtName: o.fmtName })
        }))
      },
      // 静态数据
      async getStaticData(uids) {
        if (!uids || !uids.length) return []
        // 格式化
        const ids = Array.isArray(uids) ? uids.join(',').replace(/\|/g, '_') : uids
        try {
          // 获取信息
          const { list, result } = await seeReq.get(`${seeReq.getApi('customList')}${ids}`, {
            orderBy: 'zdf', sort: 'desc', pageSize: 999, pageIndex: 0
          }, { noLoading: true }, {}, true)
          // 无数据
          if (result === 'nodata') return []
          // 排序
          return uids.map(uid => {
            const res = list.filter(({ sc, dm }) => `${sc}|${dm}` === uid.toUpperCase())
            return res.length ? res[0] : false
          }).filter(item => item)
        } catch (e) {
          return []
        }
      },
      // 国内
      async fmtGnList(list) {
        if (!list.length) return []
        const { mains, fliterMain } = this
        // 遍历
        const res = fliterMain(list, mains).filter(item => typeof item === 'object')
        // 国内ids
        this.gnIds = res.map(({ uid }) => uid)
        // 返回结果
        return res
      },
      // 格式化页面信息
      async reload(n) {
        const {
          tit, subTit, zxTit, hqTit, fwbTit, fwb: { html = '' } = {},
          itemDbId, btnDbId, mainClsId, shareConf = {}, gwIds,
          mainChooseHide, mainFeatsHide, qhChooseHide, qhFeatsHide,
          btnOpts, tracker, khPageId
        } = n
        // 空的则返回
        if (!tit) return
        // 更新
        Object.assign(this, {
          tit,
          subTit,
          fwb: html,
          zxTit,
          fwbTit,
          hqTit,
          itemDbId,
          btnDbId,
          mainClsId,
          shareConf,
          gwIds,
          mainChooseHide, mainFeatsHide, qhChooseHide, qhFeatsHide,
          khPageId,
          btnOpts: btnOpts || new Array(6).fill({}),
          trackerUrls: tracker || {}
        })
        // 行情列表
        await this.getHqData(n)
        await this.getZxData(n)
      },
      // 获取主力合约
      async getMainList() {
        try {
          const { list } = await seeReq.request('mainForce', {
            orderBy: 'zdf',
            sort: 'desc',
            pageSize: 1000,
            pageIndex: 0,
            specificContract: true,
            field: 'uid,sc,name,dm,p,zdf,zt,dt'
          }, { noLoading: true })
          this.mains = list
        } catch (e) {
          console.log(e)
        }
      },
      // 文本格式化
      fmtList(list) {
        // 国内市场
        return list.map(item => {
          if (!item) return
          const { p, zdf, zt, dt, name, uid } = item
          const isgn = domesticMarketCodes.test(uid)
          const price = p === '-' || p === 0 ? '--' : String(p)
          return {
            ...item,
            fmtName: this.getFmtName(uid, name),
            price,
            // 小字, 小数点前有5位不变小
            miniSize: price.length > 5 && !(price.indexOf('.') > -1 && price.split('.')[0].length == 5),
            zdt: p === zt ? 'zt' : p === dt ? 'dt' : '',
            zdfTxt: p === 0 ? '--' : typeof zdf === 'number' ? `${zdf > 0 ? '' : ''}${zdf.toFixed(2)}%` : zdf === '-' ? '--' : zdf,
            isgn,
            isjy: isgn && /^\D/.test(uid)
          }
        }).filter(item => item)
      },
      // 过滤对应主力合约
      fliterMain(ids = [], list = []) {
        const idList = typeof ids === 'string' ? [ids] : ids
        // 遍历
        return idList.map(id => {
          // 具体合约
          const [mkt, code] = id.split('|')
          // 找出对应主力
          const ar = list.filter(item => {
            // 声明
            const { sc, dm, name } = item
            // 市场码
            const mktid = mkt - 0
            // 中金所利用名称判断，广期所代码大小写不一致，其他代码判断
            // return mktid === sc && (mktid === 8 && name.replace(/(^[A-Z]*)(.*)/, '$1') === code || code === dm.replace(/\d*$/, ''))
            return mktid === sc && (mktid === 220 && name.replace(/(^[A-Z]*)(.*)/, '$1') === code || mktid === 225 && code.toLowerCase() === dm.replace(/\d*$/, '') || code === dm.replace(/\d*$/, ''))
          })
          return ar && ar.length ? ar[0] : false
        }).filter(item => item)
      },
      async getZxRemote(hqlist) {
        // 格式化参数
        const ps = hqlist.reduce((list, item) => {
          const { num, code } = item
          return list.concat(num && list.every(item => item.dm !== code) ? [{ dm: code, num }] : [])
        }, [])
        // 无需请求
        if (!ps.length) return []
        try {
          // 请求
          const { news = [] } = await zxReq.request('getZx', {
            biz: 'future_ad_210929',
            client: 'future_app',
            req_trace: 123456,
            requestData: ps
          })
          // 遍历
          return news.reduce((ls, item) => ls.concat(item.data), [])
        } catch (e) {
          console.log(e)
        }
      },
      getFmtName(uid, name) {
        const fmtName = names[uid]
        return fmtName || name.replace(/\d+$/, '期货')
      },

      // 按钮计数
      async tracker(trackUrl) {
        console.log('计数', trackUrl)
        // 节流
        if (this.timer) return Promise.resolve()
        this.timer = true
        setTimeout(() => this.timer = false, 1000)

        if (!trackUrl) return Promise.resolve()
        return tracker.request(trackUrl, {}, { hideMsg: true, noLoading: true })
      },

      // 底部按钮点击 0-浏览器 1-未登录交易账号 2-已登录交易账号 3-主包
      async defClick(state) {
        const { showPop, khPageId, trackerUrls: { openAccount, trade }, tracker } = this
        // 未登录则开户
        if (state === 1) {
          await tracker(openAccount)
          // 开户埋点
          khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
          // 开户跳转
          window.location.href = `dfcfqh://trade/kaihu${getAppVsn('3.4.0') > 0 ? 'v2' : ''}`
        } else if (state === 2) {
          await tracker(trade)
          // 跳行情
          window.location.href = ios ? 'eastmoney://wireless/txtrade/switchSegment?index=0' : 'dfcft://homepage/jy'
        } else {
          // 下载
          showPop('download')
        }
      },

      // 下载、电话弹窗
      async showPop(popType) {
        const { opt, downloadUrl, tracker, trackerUrls: { downloadTotal, downloadFuture, downloadStore, telYes, telNo, openAccount, trade }} = this
        // 下载
        if (popType === 'download') {
          if (isMoney) {
            const popupTrackUrl = { downloadYes: downloadStore, downloadFuture }
            await tracker(downloadTotal)
            this.$refs.popup.show(popupTrackUrl)
          } else {
            // const { status } = await tracker.request(downloadTotal, {}, { hideMsg: true, noLoading: true })
            const { status } = await tracker(downloadTotal) || {}
            if (status === 0) {
              console.log('ok')
              openApp(undefined, opt)
            }
          }
        } else if (popType === 'tel') {
          const popupTrackUrl = { telYes, telNo }
          // await tracker(trackUrl)
          this.$refs.phone.show(popupTrackUrl)
        }
      },
      // 期货包打电话
      async handlePhoneClick() {
        const { tracker, trackerUrls: { tel }} = this
        await tracker(tel)
        window.location.href = `tel:400-980-1818`
      }
    }
  }
</script>
