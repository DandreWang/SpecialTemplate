<style lang="scss" scoped>
  @import "./index";
</style>
<template>
  <section class="List">
    <header class="formBox">
      <el-button type="danger" size="medium" @click="handleAdd">
        新建
      </el-button>
    </header>
    <SearchTablePagination ref="table" v-bind="tableOptions" class="tableBox">
      <template slot="append">
        <el-table-column prop="cz" label="编辑" align="center">
          <template slot-scope="{ row }">
            <img src="./upd.png" alt="" class="icon" @click="handleShowDetail(row)">
          </template>
        </el-table-column>
      </template>
    </SearchTablePagination>
    <el-dialog
      :visible.sync="show"
      :title="title"
      :close-on-click-modal="false"
      :width="'1024px'"
      class="dialog"
      @close="handleCloseDialog"
    >
      <div class="dialogCont">
        <BaseForm
          ref="baseForm"
          :form-options="formConf"
          :form-items="formItems"
        />
        <div class="btn">
          <el-button type="primary" @click="handleSubmit">
            保存
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import { Message, MessageBox } from 'element-ui'
  import http from '@/CMS/api'
  import SearchTablePagination from '../Components/SearchTablePagination'
  import BaseForm from '../Components/BaseForm'
  import { tableOptions, formConf, formItems } from './data'

  export default {
    name: 'TempList',
    components: { SearchTablePagination, BaseForm },
    data() {
      return {
        // loading
        loading: false,
        // 表格配置
        tableOptions,
        // 选中行身份证号
        rowId: '',
        // 表单配置
        formConf,
        // 表单项目
        formItems,
        // 弹框标题
        title: '',
        // 弹框
        show: false
      }
    },
    mounted() {
      // 弹框
      // console.log(this.$refs.baseForm)
    },
    methods: {
      // 新增
      handleAdd() {
        // 清理行标
        this.rowId = ''
        // 显示弹窗
        this.show = true
        this.title = '新建模板'
      },
      // 编辑
      async handleShowDetail(row) {
        // 保留选中行ID
        this.rowId = row.id
        this.show = true
        this.title = '修改模板'
        const obj = Object.assign({}, row)
        setTimeout(_ => {
          this.$refs.baseForm.setData({
            form: obj
          })
        })
      },
      // 保存
      async handleSubmit() {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          if (!baseFormData) return
          // // rowId存在，修改，否则新建
          const { rowId } = this
          rowId && Object.assign(baseFormData, { id: rowId })
          // 请求
          await http.request(`tempList_${rowId ? 'updateTemp' : 'addTemp'}`, baseFormData)
          // 成功
          Message({ message: '保存成功', type: 'success' })
          // 刷新表格
          this.$refs.table.fetchHandler()
          this.show = false
        })
      },
      // 关闭弹窗
      handleCloseDialog() {
        // 表单清空
        this.$refs.baseForm.$refs.form.resetFields()
      },
      // 取消
      handleCancel() {
        this.show = false
      }
    }
  }
</script>

<style lang="scss">
:not(input,textarea,select) {
  user-select: text;
  // user-select: text;
}
</style>
