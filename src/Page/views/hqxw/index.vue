<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <section class="hqxw-html">
    <header>
      <div class="left">
        期货
      </div>
      <div class="right" @click="handleClick">
        旗下持牌期货公司
      </div>
    </header>
    <div class="txt">
      <div class="title">
        <p>{{ tit }}</p>
      </div>
      <div class="txtCont">
        {{ subTit }}
      </div>
    </div>
    <div class="content labelCont">
      <div class="hqBox labelBox">
        <div class="thr tr">
          <div class="th">
            热门期货品种
          </div>
          <div class="th">
            最新价
          </div>
          <div class="th">
            涨跌幅
          </div>
          <div class="th" />
        </div>
        <div
          v-for="{ isgn, name, price, zdf, uid, zdfTxt, isjy } in hqList"
          :class="`tr icon${isgn ? 1 : 2} ${zdf !== '-' && zdf !== 0 ? zdf > 0 ? 'z' : 'd' : ''}`"
          @click="handleJumpHq(uid)"
        >
          <div class="td">
            {{ name }}
          </div>
          <div class="td price">
            {{ price }}
          </div>
          <div class="td zdf">
            {{ zdfTxt }}
          </div>
          <div class="td hqBtn">
            <p :class="`${isjy ? 'icon1' : 'icon2'}`">
              {{ isjy ? '去交易' : '看分时' }}
            </p>
          </div>
        </div>
        <!--<div class="loading" v-show="hqList.length = 0">-->
        <!--<img src="./images/loading.png" alt="">-->
        <!--</div>-->
      </div>
      <DownloadBtn class="emp" :btn-txts="txts">
        <footer
          slot-scope="{ state, txt, defClick }"
          class="btnBox"
          :tracker-eventcode="btnDbId"
          :tracker-extinfo="`${btnDbId}_state:${state}`"
          @click="defClick"
        >
          <div class="btnTxt">
            {{ txt }}
          </div>
        </footer>
      </DownloadBtn>
    </div>
  </section>
</template>

<script>
  import REGS from '@common/utils/validate'
  import { seeReq } from '../../api/hqReq'
  import SSE from '@/Page/utils/SSE'
  import hybird from '@/Page/utils/hybird'
  import DownloadBtn from '@/Page/views/Components/DownloadBtn'
  import names from './name'
  // 国内商所
  const { domesticMarketCodes } = REGS.VALIDATE_REGS
  // 工具
  const { jumpQuotation, jumpOpenAccounting, setTitle, shareFun, getAppVsn, mobileEnv: { isFutures, ios }} = hybird

  export default {
    name: 'TempHqbbHtml',
    components: { DownloadBtn },
    props: {
      html: {
        type: Object,
        default: _ => ({})
      },
      isPage: Boolean
    },
    data() {
      return {
        // 按钮文字
        txts: ['下载APP 查看更多实时行情', '立即开户', '', '下载期货APP'],
        cols: [
          { label: '热门期货品种', key: 'name' },
          { label: '最新价', key: 'p' },
          { label: '涨跌幅', key: 'zdf' }
        ],
        // 标题
        tit: '',
        // 内容
        subTit: '',
        // 埋点ID
        itemDbId: '', btnDbId: '',
        // 标题品种
        mainClsId: '',
        // 分享描述
        shareConf: {},
        // 标题行情
        titFutures: {
          tit1: '',
          tit2: '',
          tit3: ''
        },
        // 品种数据
        futuresUidsStr: '',
        futuresUids: '',
        // 国内品种
        gnIds: [],
        // 国外品种
        gwIds: [],
        // 列表数据
        hqList: [],
        // 主力数据
        mains: [],
        // sse
        es: null
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
      // setTitle('期货')
      // 设置标题和分享
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
      // 跳开户
      handleClick() {
        jumpOpenAccounting({
          disLog: true,
          disCloud: true
        })
      },
      // 跳转
      handleJumpHq(uid) {
        const { itemDbId } = this
        try {
          itemDbId && window.sendTrackLog('Button', 'Click', itemDbId, `${itemDbId}_uid:${uid}`)
        } catch (e) {}
        // // jumpQuotation({ futuresCode: uid.replace(/^8\|/, 'SF') })
        // jumpQuotation({ futuresCode: uid.replace(/^220\|/, 'SF') })
        // 期货4.7.0版本前不支持广期所行情跳转，要跳转至帮助中心
        if (isFutures && getAppVsn('4.7.0') < 0 && uid.includes('GFEX')) {
          // 跳转前清除分享
          const { emH5ShareNeed } = window.AG
          emH5ShareNeed(0)
          window.location.href = 'https://qs.dfcfw.com/3956'
        } else {
          jumpQuotation({ futuresCode: uid.replace(/^220\|/, 'SF') })
        }
      },
      // 动态数据
      initActiveData() {
        // 建立链接
        this.setSSE()
      },
      // 获取行情数据
      async getHqData(data) {
        const { gnIds, gwIds } = data
        // 声明
        const { getStaticData, fmtGnList, fmtList, fmtTitle, fliterMain } = this
        // 请求
        const [gn, gw] = await Promise.all([fmtGnList(gnIds), getStaticData(gwIds)])
        // 无数据则返回
        if (!gn.length && !gw.length) return
        // 汇总
        const res = fmtList([].concat(gn, fliterMain(gwIds, gw)))
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
          // 更新标题
          fmtTitle()
        } catch (e) {
          console.log(e)
        }
      },
      setSSE() {
        const { onMsg, getStaticData, futuresUids, futuresUidsStr, fmtList } = this
        const field = 'uid,zdf,p,name,dm,sc'
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
        const { fmtList, hqList, fmtTitle } = this
        // 更新
        this.hqList = fmtList(hqList.map(o => {
          const [n] = qtList.filter(qt => qt.uid === o.uid)
          // 无变化
          if (!n) return o
          // 更新
          return Object.assign({}, n, { name: o.name })
        }))
        // 更新标题
        fmtTitle()
      },
      // 静态数据
      async getStaticData(uids) {
        if (!uids || !uids.length) return []
        // 格式化
        const ids = Array.isArray(uids) ? uids.join(',').replace(/\|/g, '_') : uids
        try {
          // 获取信息
          const { list, result } = await seeReq.get(`${seeReq.getApi('customList')}${ids}`, {
            orderBy: 'zdf', sort: 'asc', pageSize: 999, pageIndex: 0
          }, { noLoading: true }, {}, true)
          return result === 'nodata' ? [] : list
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
        const { tit, subTit, itemDbId, btnDbId, mainClsId, shareConf = {}, gwIds } = n
        // 空的则返回
        if (!tit) return
        // 更新
        Object.assign(this, {
          tit, subTit, itemDbId, btnDbId, mainClsId, shareConf, gwIds
        })
        // 行情列表
        await this.getHqData(n)
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
            field: 'uid,sc,name,dm,p,zdf'
          }, { noLoading: true })
          this.mains = list
        } catch (e) {
          console.log(e)
        }
      },
      // 标题格式化
      fmtTitle() {
        const { fliterMain, hqList, mainClsId, tit, shareDesc, isPage } = this
        // 标题品种
        const titFutures = fliterMain(mainClsId, hqList)
        // 不存在则返回
        if (!titFutures.length) return
        // 更新列表
        const { name, zdfTxt, zdf } = titFutures[0]
        // 格式化
        const tit1 = name.replace(/[\d|期货]*$/, '')
        const tit2 = zdf !== '-' && zdf < 0 ? '下挫' : '上涨'
        const tit3 = zdfTxt.replace(/\-/, '')
        // 更新分享
        // isPage && shareFun({
        //   title: `${tit1}${tit2}${tit3} ${tit}`,
        //   desc: shareDesc,
        //   isUpd: true
        // })
        // 更新
        this.titFutures = { tit1, tit2, tit3 }
      },
      // 文本格式化
      fmtList(list) {
        // 国内市场
        return list.map(item => {
          if (!item) return
          const { p, zdf, name, uid } = item
          const isgn = domesticMarketCodes.test(uid)
          return {
            ...item,
            name: this.getFmtName(uid, name),
            price: p === '-' || p === 0 ? '--' : p,
            zdfTxt: p === 0 ? '--' : typeof zdf === 'number' ? `${zdf.toFixed(2)}%` : zdf === '-' ? '--' : zdf,
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
      getFmtName(uid, name) {
        const fmtName = names[uid]
        return fmtName || name.replace(/\d+$/, '期货')
      }
    }
  }
</script>
