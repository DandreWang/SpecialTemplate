<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="行情新闻" class="hqxw">
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <template slot="append">
          <!--<el-form-item label="标题品种：" prop="mainCls" :rules="[{required: !mainCls, trigger: 'blur', message: '请选择标题品种'}]">-->
            <!--<el-select v-model="mainCls" size="small" class="selectBox" >-->
              <!--<el-option v-for="{ id, label } in selectedCls" :key="id" :label="label" :value="id"/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <div v-for="(item, idx) in hqList" :key="idx" class="tr">
            <el-form-item label="归属市场：">
              <el-select v-model="item.market" size="small" class="selectBox" @change="id => handleChangeMkt(id, idx)">
                <el-option v-for="{ mktid, mktname } in markets" :key="mktid" :label="mktname" :value="mktid"/>
              </el-select>
            </el-form-item>
            <el-form-item label="合约品种：">
              <el-select v-model="item.code" size="small" multiple class="selectBox">
                <el-option v-for="{ vcode, vname } in item.contract" :key="vcode" :label="vname" :value="vcode"/>
              </el-select>
            </el-form-item>
            <el-button icon="el-icon-plus" type="primary" size="mini" circle @click="_ => handleAdd(idx)"/>
            <el-button
              v-show="hqList.length > 1"
              icon="el-icon-minus"
              type="primary"
              size="mini"
              circle
              @click="_ => handleRemove(idx)"
            />
          </div>
        </template>
      </BaseForm>
    </template>
    <Html slot="phone" :html="phoneHtml"/>
  </PhoneModel>
</template>

<script>
  import http from '@/CMS/api'
  import { staticReq, seeReq } from '@/CMS/api/hqReq'
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Html from '@/Page/views/hqxw/index'
  import { formConf, formItems } from './data'
  import REGS from '@common/utils/validate'
  // 国内商所
  const { domesticMarketCodes } = REGS.VALIDATE_REGS
  // 行情对象
  const hqConf = _ => ({ market: '', isgn: 0, code: [], contract: [] })

  export default {
    name: 'TempFormHqxw',
    components: { PhoneModel, BaseForm, Html },
    props: {
      initData: {
        type: Object
      }
    },
    data() {
      return {
        phoneHtml: {},
        hqList: [hqConf()],
        // 缓存
        gwCache: {},
        // 表单加载
        loading: false,
        // 弹窗显示
        show: false,
        // 市场
        markets: [],
        // 标题品种
        mainCls: '',
        mainClsId: '',
        // 表单配置
        formConf,
        // 表单项目
        formItems
      }
    },
    async mounted() {
      // 获取期货市场数据
      await this.getMarkets()
      // 初始化表单数据
      this.init()
    },
    computed: {
      // 选中行
      selectedCls() {
        // 声明
        let uids = []
        // 下拉列表
        this.hqList.forEach(({ code, market, contract }) => {
          // 单个遍历
          uids = uids.concat(code.map(dm => {
            const nid = `${market}|${dm}`
            // 防止重复添加
            return uids.every(({ id }) => id !== nid) ? {
              label: contract.filter(({ vcode }) => vcode === dm)[0].vname,
              id: nid
            } : false
          }))
        })
        // 更新
        return uids.filter(i => i)
      }
    },
    watch: {
      selectedCls(n) {
        // 是否被清空
        const { mainCls } = this
        // 更新
        mainCls && n.every(({ id }) => id !== mainCls) && (this.mainCls = '')
      }
    },
    methods: {
      // 获取期货市场数据
      async getMarkets() {
        const [gn, gw] = await Promise.all([
          // seeReq.request('main/103', { orderBy: 'zdf', sort: 'asc', pageSize: 999, pageIndex: 0, callbackName: '' }),
          staticReq.request('redis', { msgid: 'gn' }, { cantCancel: true }),
          staticReq.request('redis', { msgid: 'gw' }, { cantCancel: true })
        ])
        // // 格式化
        // this.markets = [].concat(gn.map(item => {
        //   const { mktid } = item
        //   return {
        //     ...item,
        //     mktid: mktid === '220' ? 8 : mktid
        //   }
        // }), gw)
        // 格式化
        this.markets = [].concat(gn, gw)
      },
      // init
      init() {
        const { hqList = [hqConf()], mainCls, mainClsId, ...formData } = this.initData
        //  品种
        this.hqList = hqList
        // 标题品种
        this.mainCls = mainCls
        // 缓存
        this.gwCache[mainCls] = mainClsId
        // 表单数据
        this.$refs.baseForm.setData({ formData })
      },
      // 切换市场
      async handleChangeMkt(mktId, idx) {
        // 更新
        this.hqList[idx].code = []
        // 主力合约
        const list = await staticReq.request('redis', { msgid: mktId })
        // 品种
        this.hqList[idx].contract = list
      },
      // 新增
      handleAdd(idx) {
        this.hqList.splice(idx + 1, 0, hqConf())
      },
      // 删除
      handleRemove(idx) {
        this.hqList.splice(idx, 1)
      },
      // 预览
      handlePreview() {
        this.getParams(params => { this.phoneHtml = params })
      },
      // 提交
      getParams(cb) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 声明
          const { hqList, fmtGwList, selectedCls } = this
          // 声明
          const gnIds = []
          const gwIds = []
          // 遍历
          selectedCls.forEach(({ id }) => {
            domesticMarketCodes.test(id) ? gnIds.push(id) : gwIds.push(id)
          })
          // 格式化国外期货
          const fmtIds = await fmtGwList(gwIds)
          // 回调
          cb({
            ...baseFormData,
            hqList,
            // mainCls,
            // 记录code
            // mainClsId: gwCache[mainCls] || mainCls,
            gnIds,
            gwIds: fmtIds
          })
        })
      },
      // 切换合约
      async fmtGwList(list) {
        const { gwCache } = this
        // 国外
        if (!list.length) return []
        // 现有
        const ar = []
        // 过滤
        const n = list.filter(d => {
          const code = gwCache[d]
          // 添加
          code && ar.push(code)
          return typeof code === 'undefined'
        })
        // 未变化则返回
        if (!n.length) return ar
        // 请求所有品种合约
        const res = await Promise.all(n.map(id => staticReq.request('redis', { msgid: id.toLowerCase().replace(/\|/, '_') }, { cantCancel: true })))
        // 缓存
        n.forEach((d, idx) => {
          try {
            // 缓存
            gwCache[d] = !res[idx].length ? '' : `${d.replace(/\|.*/, '')}|${res[idx][0].code}`
          } catch (e) {
            console.log(e)
          }
        })
        // 结果
        return list.map(d => gwCache[d])
      },
      // 关闭弹窗
      clear() {
        // 表单清空
        this.$refs.baseForm.$refs.form.resetFields()
        // 重置
        this.hqList = [hqConf()]
      },
      // 设置子组件值
      setData(data) {
        const { formData } = data
        // Object.assign(this, { ...data }, formData && { form: this.fmtFormDate(formData) })
      }
    }
  }
</script>
