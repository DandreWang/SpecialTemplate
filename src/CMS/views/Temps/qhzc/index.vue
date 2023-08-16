<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="期货早餐" class="qhzc">
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <template slot="append">
          <div class="box">
            <div class="labelBox">
              <label class="el-form-item__label">内容区块：</label>
              <el-button type="primary" size="mini" @click="handleAdd">添加区块</el-button>
            </div>
            <div class="contWrap">
              <Part
                ref="listRef"
                v-for="(item, idx) in contList"
                :key="item.id"
                :data="item"
                class="contItem"
                @remove="_ => handleRemove(idx)"
              />
            </div>
          </div>
        </template>
      </BaseForm>
    </template>
    <Html slot="phone" :html="phoneHtml"/>
  </PhoneModel>
</template>

<script>
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Html from '@/Page/views/qhzc/index'
  import Part from './Part'
  import { formConf, formItems } from './data'
  import { format } from 'date-fns'

  export default {
    name: 'TempFormQhzc',
    components: { PhoneModel, Html, BaseForm, Part },
    props: {
      initData: {
        type: Object
      }
    },
    data() {
      return {
        phoneHtml: {},
        // 表单加载
        loading: false,
        // 弹窗显示
        show: false,
        // 区块
        contList: [],
        // 表单配置
        formConf,
        // 表单项目
        formItems
      }
    },
    computed: {
      editor() {
        return this.$refs.Editor.quill
      }
    },
    async mounted() {
      // 初始化表单数据
      this.init()
    },
    methods: {
      // 预览
      handlePreview() {
        this.getParams(params => {
          this.phoneHtml = params
        })
      },
      init() {
        const { contList = [], ...formData } = this.initData
        // 填充
        this.contList = contList
        // 更新
        this.$refs.baseForm.setData({ formData })
      },
      // 提交
      async getParams(cb) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 声明
          const { contList, $refs: { listRef }} = this
          // 回调
          cb({
            ...baseFormData,
            date: format(baseFormData.date, 'YYYY-MM-DD'),
            contList: contList.map((item, idx) => listRef[idx].getParams())
              .filter(({ title, list }) => title !== '' || list.length)
          })
        })
      },
      // 添加
      handleAdd() {
        this.contList.push({ id: new Date().getTime() })
      },
      // 删除
      handleRemove(idx) {
        this.contList.splice(idx, 1)
      },
      // 关闭弹窗
      clear() {
        // 表单清空

      }
    }
  }
</script>
