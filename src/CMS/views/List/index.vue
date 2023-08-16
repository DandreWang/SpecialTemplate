<style lang="scss" scoped>
  @import "./index";
</style>
<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <section class="PageList">
    <header class="formBox">
      <el-input v-model="templateInfo.name" style="width:180px;" size="medium" clearable placeholder="请输入专题名称" />
      <el-select v-model="templateInfo.templateid" size="medium" style="margin:0 10px;" placeholder="请选择模板名称">
        <el-option v-for="opt in options" :key="opt.id" :value="opt.id" :label="opt.name" />
      </el-select>
      <el-input
        v-model="templateInfo.creator"
        style="width:180px;margin-right:10px;"
        size="medium"
        clearable
        placeholder="请输入创建人"
      />
      <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
      <el-button type="danger" size="medium" @click="handleAdd">新建</el-button>
    </header>
    <SearchTablePagination ref="table" v-bind="tableOptions" class="tableBox" width="100%">
      <template slot="append">
        <el-table-column prop="cz" label="操作" align="center" fixed="right" width="500">
          <template slot-scope="{ row }">
            <el-button v-clipboard:copy="row.url" v-clipboard:success="onCopy" size="mini" :disabled="!row.url">
              复制链接
            </el-button>
            <el-button size="mini" @click="handleCopy(row.id)">复制模板</el-button>
            <el-button size="mini" type="primary" plain @click="handleShowDetail(row)">编辑</el-button>
            <el-button size="mini" type="primary" plain @click="handlePublish(row)">发布</el-button>
            <el-button size="mini" type="warning" plain @click="handleLock(row.id)">
              {{ `${row.locked ? '已锁定' : '锁定'}`
              }}
            </el-button>
            <el-popconfirm
              confirm-button-text="是的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确认删除该模板吗？"
              @confirm="handleDelete(row.id)"
            >
              <el-button slot="reference" size="mini" type="danger" :disabled="row.locked" plain>删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </SearchTablePagination>
    <TempDialog
      ref="form"
      :title="title"
      :form-submit="formSubmit"
      :form-publish="formPublish"
    />
  </section>
</template>
<script>
  import { Message, MessageBox } from 'element-ui'
  import http from '@/CMS/api'
  import SearchTablePagination from '../Components/SearchTablePagination/index'
  import TempDialog from '../Components/TempDialog'
  import { tableOptions, formConf, formItems } from './data'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'

  Vue.use(VueClipboard)
  export default {
    name: 'List',
    components: { SearchTablePagination, TempDialog },
    data() {
      return {
        options: [],
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
        // 弹窗标题
        title: '编辑',
        // 查询
        templateInfo: {
          name: '',
          templateid: null,
          creator: ''
        },
        page: 1,
        size: 15
      }
    },
    mounted() {
      this.getTempList()
    },
    methods: {
      // 获取模板列表
      async getTempList() {
        // const { data } = await http.request('tempList_getTemp', { page: 1, size: 100 })
        const data = ['hqbb', 'hqbb_n', 'hqxw', 'ggtz', 'fwb', 'qhzc', 'hqrd', 'rmhq', 'zbgg', 'rdzx'].map(txt => ({
        id: txt, name: txt, type: txt
        }))
        data.unshift({ id: null, name: '全部模板' })
        this.options = data
      },
      // 查询
      handleSearch() {
        const { templateInfo: { name, templateid, creator }, page, size } = this
        const table = this.$refs.table
        // 设置参数
        table.handleSetBaseParams({ page, size, name, templateid: templateid ? templateid - 0 : null, creator })
        // 刷新表格
        // table.searchHandler()
      },
      // 新增
      handleAdd() {
        const { options } = this
        // 清理行标
        this.rowId = ''
        // 设置标题
        this.title = '新建专题'
        // 显示弹窗
        this.$refs.form.setData({
          show: true,
          options
        })
      },
      // 查看详情
      async handleShowDetail(row) {
        const { options } = this
        const { id } = row
        // 保留选中行ID
        this.rowId = id
        // 设置标题
        this.title = `编辑专题（${id}）`
        this.$refs.form.setData({
          show: true,
          formData: row,
          rowId: id,
          options
        })
      },
      // 发布操作
      handlePublish(row) {
        const { id, html, updatedate, publishdate } = row
        // 最新
        if (publishdate > updatedate) return Message({ message: '线上已为最新版本，请勿重复发布！', type: 'warning' })
        // 弹框
        MessageBox.confirm('确认发布?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          // 行id
          this.rowId = id
          // 更新
          this.formPublish({ id, html })
        })
      },
      // 发布
      async formPublish(params) {
        // rowId存在，修改，否则新建
        await http.request('list_publishPage', params)
        // 成功
        Message({ message: '发布成功', type: 'success' })
        // 刷新表格
        this.$refs.table.fetchHandler()
      },
      // 删除模板
      async handleDelete(id) {
        const { status } = await http.request('list_deleteModule', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 复制模板
      async handleCopy(id) {
        const { status } = await http.request('list_copyModule', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 修改锁定状态
      async handleLock(id) {
        const { status } = await http.request('list_lockModule', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 保存  pageParams页面数据  temParams模板参数
      async formSubmit(params, disRefresh) {
        // 模板参数
        const { pageName: name, templateid: templateid, templateName: templatename, html } = params
        let obj = {}
        if (templateid === 15) {
          const { linkFor, adPosition } = params
          const idTmp = adPosition.join(',')
          obj = { name, templateid, templatename, html, linkFor, adPositionId: idTmp }
        } else {
          obj = { name, templateid, templatename, html }
        }
        // rowId存在，修改，否则新建
        const { rowId } = this
        rowId && Object.assign(obj, { id: rowId })
        // 请求
        const { data: { id } = {}} = await http.request(`list_${rowId ? 'updatePage' : 'addNewPage'}`, obj)
        // 刷新表格
        !disRefresh && this.$refs.table.fetchHandler()
        // 返回id
        return id || rowId
      },
      // 复制
      onCopy() {
        Message({ message: '已复制至剪贴板', type: 'warning' })
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
