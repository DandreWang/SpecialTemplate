<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="公告通知" class="hqxw">
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      />
    </template>
    <Html slot="phone" :html="phoneHtml"/>
  </PhoneModel>
</template>

<script>
  import http from '@/CMS/api'
  import { staticReq, seeReq } from '@/CMS/api/hqReq'
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Html from '@/Page/views/ggtz/index'
  import { formConf, formItems } from './data'
  import REGS from '@common/utils/validate'
  // 国内商所
  const { domesticMarketCodes } = REGS.VALIDATE_REGS
  // 行情对象
  const hqConf = _ => ({ market: '', isgn: 0, code: [], contract: [] })

  export default {
    name: 'TempFormGgtz',
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
      // 初始化表单数据
      this.init()
    },
    methods: {
      // 预览
      handlePreview() {
        this.getParams(params => { this.phoneHtml = params })
      },
      init() {
        const { ...formData } = this.initData
        // 表单数据
        this.$refs.baseForm.setData({ formData })
      },
      // 提交
      getParams(cb) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 回调
          cb({
            ...baseFormData
          })
        })
      },
      // 关闭弹窗
      clear() {
        // 表单清空
        this.$refs.baseForm.$refs.form.resetFields()
      },
      // 设置子组件值
      setData(data) {
        const { formData } = data
        // Object.assign(this, { ...data }, formData && { form: this.fmtFormDate(formData) })
      }
    }
  }
</script>
