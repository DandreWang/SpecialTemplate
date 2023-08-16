<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="行情播报" class="hqbb">
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <template slot="append">
          <div v-for="(item, idx) in hqList" :key="idx" class="tr">
            <el-form-item label="归属市场：">
              <el-select v-model="item.market" size="small" class="selectBox" @change="id => handleChangeMkt(id, idx)">
                <el-option v-for="{ mktid, mktname } in markets" :key="mktid" :label="mktname" :value="mktid"/>
              </el-select>
            </el-form-item>
            <el-form-item label="合约品种：">
              <el-select v-if="item.isgn" v-model="item.code" size="small" multiple class="selectBox">
                <el-option v-for="{ vcode, vname } in item.contract" :key="vcode" :label="vname" :value="vcode"/>
              </el-select>
              <el-input v-else v-model="item.code" size="small" placeholder="请输入合约品种" class="selectBox"/>
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
  import { staticReq } from '@/CMS/api/hqReq'
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Html from '@/Page/views/hqbb/index_n'
  import { formConf, formItems } from './data'
  import REGS from '@common/utils/validate'
  // 国内商所
  const { domesticMarketCodes } = REGS.VALIDATE_REGS
  // 行情对象
  const hqConf = _ => ({ market: '', isgn: 0, code: '', contract: [] })

  export default {
    name: 'TempFormHqbbN',
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
        this.hqList.forEach(({ code, market, contract, isgn }) => {
          // 空值过滤
          if (!code || !code.length) return
          // 国内
          const codes = isgn ? code : [code]
          // 单个遍历
          uids = uids.concat(codes.map(dm => {
            const nid = `${market}|${dm}`
            // 防止重复添加
            return uids.every(({ id }) => id !== nid) ? {
              label: contract.length ? contract.filter(({ vcode }) => vcode === dm)[0].vname : nid,
              isgn,
              id: nid
            } : false
          }))
        })
        // 更新
        return uids.filter(i => i)
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
        // 格式化
        // this.markets = [].concat(gn.map(item => {
        //   const { mktid } = item
        //   return {
        //     ...item,
        //     mktid: mktid === '220' ? 8 : mktid
        //   }
        // }), gw)
        this.markets = [].concat(gn, gw)
      },
      // init
      init() {
        const { hqList = [hqConf()], ...formData } = this.initData
        //  品种
        this.hqList = hqList
        // 表单数据
        this.$refs.baseForm.setData({ formData })
      },
      // 切换市场
      async handleChangeMkt(mktId, idx) {
        // 是否为国内
        const isgn = domesticMarketCodes.test(`${mktId}|`)
        // 更新
        Object.assign(this.hqList[idx], {
          code: isgn ? [] : '',
          isgn
        })
        // 国内不加载合约
        if (!isgn) return
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
        this.getParams(params => {
          this.phoneHtml = params
        })
      },
      // 提交
      getParams(cb) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 声明
          const { hqList, selectedCls } = this
          // 声明
          const gnIds = []
          const gwIds = []
          // 遍历
          selectedCls.forEach(({ id, isgn }) => {
            isgn ? gnIds.push(id) : gwIds.push(id)
          })
          // 回调
          cb({
            ...baseFormData,
            hqList,
            gnIds,
            gwIds
          })
        })
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
