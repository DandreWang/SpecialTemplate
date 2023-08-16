<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <section class="PageList">
    <header class="formBox">
      <el-form inline>
        <el-form-item label="模板名称">
          <el-input v-model="templateInfo.name" style="width:180px;" size="medium" clearable placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="templateInfo.creator" style="width:180px;margin:0 10px;" size="medium" clearable placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="模板使用状态">
          <el-select v-model="templateInfo.useStatus" size="medium" style="margin-right:10px;" placeholder="请选择模板使用状态" clearable>
            <el-option v-for="opt in useStatusOpts" :key="opt.value" :value="opt.value" :label="opt.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板发布状态">
          <el-select v-model="templateInfo.published" size="medium" style="margin-right:10px;" placeholder="请选择模板发布状态" clearable>
            <el-option v-for="opt in publishStatusOpts" :key="opt.value" :value="opt.value" :label="opt.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
          <el-button type="danger" size="medium" @click="handleAdd">新建</el-button>
        </el-form-item>
      </el-form>
    </header>
    <SearchTablePagination ref="table" v-bind="tableOptions" class="tableBox" width="100%">
      <template slot="append">
        <el-table-column label="链接使用数量" align="center" prop="number" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.linkNumber }}</span>
            <el-popover
              v-if="scope.row.linkNumber"
              placement="right"
              title="链接ID"
              width="200"
              trigger="click"
              :content="fmtLinkDetail(scope.row.linkManageIdList)"
            >
              <el-link slot="reference" style="color:#409eff">详情</el-link>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <template slot="append">
        <el-table-column label="发布状态" prop="publishStatus" align="center" width="150">
          <template slot-scope="{row}">
            <el-tag :type="row.published ? 'success' : 'primary'">{{ !row.published ? '草稿' : '已发布' }}</el-tag>
            <div v-if="row.published === 2" style="font-size:14px;color:red;margin-top:5px">已编辑、未发布</div>
          </template>
        </el-table-column>
      </template>
      <template slot="append">
        <el-table-column prop="cz" label="操作" align="center" fixed="right" width="500">
          <template slot-scope="{ row }">
            <!-- <el-button v-clipboard:copy="row.url" v-clipboard:success="onCopy" size="mini" :disabled="!row.url">
              复制链接
            </el-button> -->
            <el-button size="mini" @click="handleCopy(row.id)">复制模板</el-button>
            <el-popconfirm
              v-if="row.linkNumber"
              confirm-button-text="要"
              cancel-button-text="不要"
              icon="el-icon-info"
              icon-color="red"
              title="该模板正被使用中，如你修改，可能会影响线上页面，你还要继续吗？"
              @confirm="handleShowDetail(row)"
            >
              <el-button slot="reference" size="mini" type="primary" plain>编辑</el-button>
            </el-popconfirm>
            <el-button v-else size="mini" type="primary" plain @click="handleShowDetail(row)">编辑</el-button>
            <el-button size="mini" type="primary" plain @click="handlePublish(row)">发布</el-button>
            <el-button size="mini" type="warning" plain @click="handleLock(row.id)">
              {{ `${row.locked ? '已锁定' : '锁定'}` }}
            </el-button>
            <el-popconfirm
              confirm-button-text="是的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              :title="`${row.linkNumber ? '该模板正在使用中，确认删除吗？' : '确认删除该模板吗？'}`"
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
  import { tableOptions, formConf, formItems, useStatusOpts, publishStatusOpts } from './data'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'

  Vue.use(VueClipboard)

  export default {
    name: 'ZbggList',
    components: { SearchTablePagination, TempDialog },
    data() {
      return {
        useStatusOpts,
        publishStatusOpts,
        options: [],
        // loading
        loading: false,
        // 表格配置
        tableOptions,
        // 选中行id
        rowId: '',
        // 表单配置
        formConf,
        // 表单项目
        formItems,
        // 弹窗标题
        title: '编辑',
        // 查询
        templateInfo: {
          // 模板名称
          name: '',
          // 创建人
          creator: '',
          // 模板使用状态
          useStatus: null,
          // 模板发布状态
          published: null
        },
        page: 1,
        size: 15
      }
    },
    mounted() {
      this.getTempList()
    },
    methods: {
      // 获取模板列表（公用模板弹窗组件需要传入options）
      async getTempList() {
        // const { data } = await http.request('tempList_getTemp', { page: 1, size: 100 })
        console.log('temp data:', data)
        const data= [{id: 'qhzc', name: 'qhzc', type: 'qhzc'}]
        data.unshift({ id: null, name: '全部模板' })
        this.options = data
      },
      // 查询
      handleSearch() {
        const { templateInfo: { name, creator, useStatus, published }, page, size } = this
        const table = this.$refs.table
        // 设置参数
        table.handleSetBaseParams({ page, size, name, creator, useStatus, published })
        // 刷新表格
        table.searchHandler()
      },
      // 链接详情
      fmtLinkDetail(cont) {
        const res = []
        cont.forEach(({ id }) => res.push(id))
        return res
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
          isZbgg: true,
          options
        })
      },
      // 查看详情
      async handleShowDetail(row) {
        console.log('编辑')
        console.log(row)
        const { options } = this
        const { id } = row
        // 保留选中行ID
        this.rowId = id
        // 设置标题
        this.title = `编辑专题（${id}）`
        this.$refs.form.setData({
          show: true,
          formData: row,
          isZbgg: true,
          rowId: id,
          options
        })
      },
      // 查看链接详情
      handleLinkDetail(row) {
        console.log(row)
      },
      // 发布操作
      handlePublish(row) {
        const { id, updatedate, publishdate } = row
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
          // // 更新
          // this.formPublish({ id, savedHtml })
          // 更新
          this.formPublish({ id })
        })
      },
      // 发布
      async formPublish(params) {
        const { id } = params
        const { rowId } = this
        // 请求
        await http.request('zbggManage_publish', { id: id || rowId })
        // 成功
        Message({ message: '发布成功', type: 'success' })
        // 刷新表格
        this.$refs.table.fetchHandler()
      },
      // 删除模板
      async handleDelete(id) {
        const { status } = await http.request('zbggManage_delete', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 复制模板
      async handleCopy(id) {
        const { status } = await http.request('zbggManage_copy', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 修改锁定状态
      async handleLock(id) {
        const { status } = await http.request('zbggManage_lock', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 保存  pageParams页面数据  temParams模板参数
      async formSubmit(params, disRefresh) {
        console.log('params:', params)
        // 模板参数
        const { pageName: name, html } = params
        let obj = {}
        // 专题模板多链接
        obj = { name, html }
        // rowId存在，修改，否则新建
        const { rowId } = this
        rowId && Object.assign(obj, { id: rowId })

        // 请求
        let id = ''
        const { data } = await http.request(`zbggManage_${rowId ? 'update' : 'create'}`, obj)
        // 更新接口不返回data
        if (data) {
          id = data.id
        }
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

<style lang="scss" scoped>
  @import "./index";
</style>
