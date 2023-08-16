<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <section class="hqbb-html">
    <header>
      <div class="tit1">
        {{ titFutures.tit1 }}
      </div>
      <div class="line2">
        <div class="tit2">
          {{ titFutures.tit2 }}
        </div>
        <div class="right">
          <div class="tit3">
            {{ titFutures.tit3 }}
          </div>
          <div class="tit4">
            {{ titFutures.tit4 }}
          </div>
        </div>
      </div>
    </header>
    <div class="content">
      <div class="subTit">
        {{ subTit }}
      </div>
      <div class="thr tr">
        <div class="th">
          期货品种
        </div>
        <div class="th">
          最新/涨跌幅
        </div>
      </div>
      <div
        v-for="{ isgn, name, price, zdf, uid, zdfTxt, isjy } in hqList"
        :class="`tr icon${isgn ? 1 : 2}`"
        @click="handleJumpHq(uid)"
      >
        <div class="name">
          {{ name }}
        </div>
        <div class="val">
          {{ `${price}/` }}<span :class="zdf !== '-' && zdf !== 0 ? zdf > 0 ? 'z' : 'd' : ''">{{ zdfTxt }}</span>
        </div>
        <div :class="`hqBtn ${isjy ? '' : 'k'}`">
          {{ isjy ? '去交易' : '看分时' }}
        </div>
      </div>
    </div>
    <div class="line" />
    <div class="about">
      <div class="aboutTit">
        期货公司简介
      </div>
      <div class="desc">
        期货是旗下持牌期货公司。主要从事国内商品期货经纪和金融期货经纪业务。
      </div>
      <div class="tips">
        免责声明：本页面非任何法律文件，不构成任何投资建议或承诺。用户在使用期货APP及开户前需认真阅读相关法律文件及相关规则，审慎作出投资决策，自行承担投资风险。
      </div>
    </div>
    <DownloadBtn class="emp">
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
  const { jumpQuotation, mobileEnv: { isFutures, ios }, getAppVsn, setTitle, shareFun } = hybird

  export default {
    name: 'TempHqbbHtmlN',
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
        cols: [
          { label: '期货品种', key: 'name' },
          { label: '最新', key: 'p' },
          { label: '涨跌幅', key: 'zdf' }
        ],
        // 埋点ID
        itemDbId: '', btnDbId: '',
        // 分享描述
        shareConf: {},
        // 标题行情
        titFutures: {
          tit1: '',
          tit2: '',
          tit3: '',
          tit4: ''
        },
        // 行情标题
        subTit: '',
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
        console.log(n)
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
      // 跳转
      handleJumpHq(uid) {
        const { itemDbId } = this
        try {
          itemDbId && window.sendTrackLog('Button', 'Click', itemDbId, `${itemDbId}_uid:${uid}`)
        } catch (e) {
        }
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
        const { fmtList, hqList } = this
        // 更新
        this.hqList = fmtList(hqList.map(o => {
          const [n] = qtList.filter(qt => qt.uid === o.uid)
          // 无变化
          if (!n) return o
          // 更新
          return Object.assign({}, n, { name: o.name })
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
            orderBy: 'zdf', sort: 'asc', pageSize: 999, pageIndex: 0
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
        const { tit1, tit2, tit3, tit4, subTit, itemDbId, btnDbId, mainClsId, shareConf = {}, gwIds } = n
        // 更新
        Object.assign(this, {
          subTit, itemDbId, btnDbId, mainClsId, shareConf, gwIds,
          // 更新
          titFutures: { tit1, tit2, tit3, tit4 }
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
        return idList.reduce((prev, id) => {
          // 具体合约
          const [mkt, code] = id.split('|')
          // 找出对应主力
          const item = list.find(item => {
            // 声明
            const { sc, dm, name } = item
            // 市场码
            const mktid = mkt - 0
            // 中金所利用名称判断，广期所代码大小写不一致，其他代码判断
            // return mktid === sc && (mktid === 8 && name.replace(/(^[A-Z]*)(.*)/, '$1') === code || code === dm.replace(/\d*$/, ''))
            return mktid === sc && (mktid === 220 && name.replace(/(^[A-Z]*)(.*)/, '$1') === code || mktid === 225 && code.toLowerCase() === dm.replace(/\d*$/, '') || code === dm.replace(/\d*$/, ''))
          })
          // 添加
          item && prev.push(item)
          // 返回
          return prev
        }, [])
        // return idList.map(id => {
        //   // 具体合约
        //   const [mkt, code] = id.split('|')
        //   // 找出对应主力
        //   const ar = list.filter(item => {
        //     // 声明
        //     const { sc, dm, name } = item
        //     // 市场码
        //     const mktid = mkt - 0
        //     // 中金所利用名称判断，其他代码判断
        //     // return mktid === sc && (mktid === 8 && name.replace(/(^[A-Z]*)(.*)/, '$1') === code || code === dm.replace(/\d*$/, ''))
        //     return mktid === sc && (mktid === 220 && name.replace(/(^[A-Z]*)(.*)/, '$1') === code || code === dm.replace(/\d*$/, ''))
        //   })
        //   return ar && ar.length ? ar[0] : false
        // }).filter(item => item)
      },
      getFmtName(uid, name) {
        const fmtName = names[uid]
        return fmtName || name.replace(/\d+$/, '期货')
      }
    }
  }
</script>
