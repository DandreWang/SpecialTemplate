<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="行情热点" class="hqrd">
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <template slot="append">
          <el-form-item label="底部按钮：">
            <el-switch v-model="btn.show"/>
          </el-form-item>
          <div v-show="btn.show" class="">
            <el-form-item label="按钮文字：">
              <el-input v-model="btn.txt" size="small" class="inp"/>
            </el-form-item>
            <el-form-item label="埋点ID：">
              <el-input v-model="btn.dbId" size="small" class="inp"/>
            </el-form-item>
          </div>
          <div class="box">
            <div class="labelBox">
              <label class="el-form-item__label">内容区块：</label>
              <el-button type="primary" size="mini" @click="handleAdd('HQ')" class="addBtn">行情模块</el-button>
              <el-button type="primary" size="mini" @click="handleAdd('TS')" class="addBtn">提示模块</el-button>
              <el-button type="primary" size="mini" @click="handleAdd('XC')" class="addBtn">宣传模块</el-button>
              <el-button type="primary" size="mini" @click="handleAdd('WD')" class="addBtn">问答模块</el-button>
              <el-button type="primary" size="mini" @click="handleAdd('GD')" class="addBtn">固定模块</el-button>
            </div>
            <div class="contWrap">
              <component
                ref="listRef"
                v-for="(item, idx) in contList"
                :key="item.id"
                :data="item"
                class="contItem"
                :is="`Part${item.partType}`"
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
  import Html from '@/Page/views/hqrd/index'
  import PartBase from './PartBase'
  import PartHQ from './PartHQ'
  import PartXC from './PartXC'
  import { formConf, formItems } from './data'

  export default {
    name: 'TempFormHqrd',
    components: { PhoneModel, Html, BaseForm, PartBase, PartHQ, PartXC },
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
        // 下载按钮
        btn: {
          // 显示隐藏
          show: false,
          // 文字
          txt: '',
          // 埋点
          dbId: ''
        },
        // 区块
        contList: [],
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
        this.getParams(params => {
          this.phoneHtml = params
        })
      },
      init() {
        const { contList = [], btn = {}, ...formData } = this.initData
        // 填充
        this.contList = contList
        this.btn = btn
        // 更新
        this.$refs.baseForm.setData({ formData })
      },
      // 提交
      async getParams(cb) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 声明
          const { contList, btn, $refs: { listRef }} = this
          // 回调
          cb({
            ...baseFormData,
            btn,
            contList: contList.map((item, idx) => listRef[idx].getParams())
              .filter(({ title, list }) => title || list.length)
          })
        })
      },
      // 添加
      handleAdd(code) {
        this.contList.push({ id: new Date().getTime(), partType: /HQ|XC/.test(code) ? code : 'Base', type: code })
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
