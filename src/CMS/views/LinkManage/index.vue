<style lang="scss" scoped>
  @import "./index";
</style>
<style lang="scss">
.el-drawer__wrapper {
  .el-drawer__header {
    font-size: 20px;
    color: #333;
  }
  .el-drawer__body {
    width: 392px;
    margin-left: 40px;
    // transform: translateX(-50%);
  }
}
</style>
<template>
  <section class="PageList">
    <!-- 条件查询 -->
    <header class="formBox">
      <el-form inline>
        <el-form-item label="模板编号">
          <el-input v-model="linkInfo.templateManageId" style="width:180px;" size="medium" clearable placeholder="请输入模板编号" />
        </el-form-item>
        <el-form-item label="模板名称">
          <el-input v-model="linkInfo.templateManageName" style="width:180px;margin:0 10px;" size="medium" clearable placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="链接编号">
          <el-input v-model="linkInfo.id" style="width:180px;margin-right:10px" size="medium" clearable placeholder="请输入链接编号" />
        </el-form-item>
        <el-form-item label="链接名称">
          <el-input v-model="linkInfo.name" style="width:180px;" size="medium" clearable placeholder="请输入链接名称" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="linkInfo.creator" style="width:180px;margin:0 10px;" size="medium" clearable placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
          <el-button type="danger" size="medium" @click="handleAdd">新建</el-button>
        </el-form-item>
      </el-form>
    </header>
    <SearchTablePagination ref="table" v-bind="linkTableOptions" class="tableBox" width="100%">
      <template slot="append">
        <el-table-column label="链接地址" prop="url" width="250">
          <template slot-scope="{row}">
            <el-link @click="handleJump(row.url)">{{ row.url }}</el-link>
          </template>
        </el-table-column>
      </template>
      <template slot="append">
        <el-table-column label="发布状态" prop="publishStatus" align="center" width="150">
          <template slot-scope="{row}">
            <el-tag :type="row.published ? 'success' : 'primary'">
              {{ !row.published ? '草稿' : '已发布' }}
            </el-tag>
            <div v-if="row.published === 2" style="font-size:14px;color:red;margin-top:5px">已编辑、未发布</div>
          </template>
        </el-table-column>
      </template>
      <template slot="append">
        <el-table-column prop="cz" label="操作" align="center" fixed="right" width="400">
          <template slot-scope="{ row }">
            <el-button v-clipboard:copy="row.url" v-clipboard:success="onCopy" size="mini" :disabled="!row.url">复制链接</el-button>
            <el-button size="mini" type="primary" plain @click="handleShowDetail(row)">编辑</el-button>
            <el-button size="mini" type="primary" plain @click="handlePublish(row)">发布</el-button>
            <el-button size="mini" type="warning" plain @click="handleLock(row.id)">
              {{ `${row.locked ? '已锁定' : '锁定'}` }}
            </el-button>
            <el-popconfirm
              confirm-button-text="是的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确认删除吗？"
              @confirm="handleDelete(row.id)"
            >
              <el-button slot="reference" size="mini" type="danger" :disabled="row.locked" plain>删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </SearchTablePagination>
    <LinkDialog
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
  // import TempDialog from '../Components/TempDialog'
  import LinkDialog from '../Components/LinkDialog'
  import { linkTableOptions, formConf, formItems } from './data'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'

  Vue.use(VueClipboard)
  export default {
    name: 'LinkManage',
    components: { SearchTablePagination, LinkDialog },
    data() {
      return {
        options: [],
        // loading
        loading: false,
        // 表格配置
        linkTableOptions,
        // 选中行身份证号
        rowId: '',
        // 表单配置
        formConf,
        // 表单项目
        formItems,
        // 弹窗标题
        title: '编辑',
        // 条件查询
        linkInfo: {
          // 模板编号
          templateManageId: '',
          // 模板名称
          templateManageName: '',
          // 链接编号
          id: '',
          // 链接名称
          name: '',
          // 创建人
          creator: ''
        },
        page: 1,
        size: 15
      }
    },
    mounted() {
      // this.getTempList()
    },
    methods: {
      // 查询
      handleSearch() {
        const { linkInfo: { name, creator, templateManageId, templateManageName, id }, page, size } = this
        const table = this.$refs.table
        // 设置参数
        table.handleSetBaseParams({ page, size, name, templateManageId, templateManageName, creator, id })
        // 刷新表格
        table.searchHandler()
      },
      // 新增
      handleAdd() {
        // const { options } = this
        console.log('新建')
        // 清理行标
        this.rowId = ''
        // 设置标题
        this.title = '新建链接'
        // 显示弹窗
        this.$refs.form.setData({
          show: true,
          isAdd: true
          // options
        })
      },
      // 链接跳转
      handleJump(link) {
        window.open(link)
      },
      // 查看详情
      async handleShowDetail(row) {
        // const { options } = this
        const { id } = row
        // 保留选中行ID
        this.rowId = id
        // 设置标题
        this.title = `编辑链接（${id}）`
        this.$refs.form.setData({
          show: true,
          formData: row,
          rowId: id,
          isAdd: false
        })
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
          // 更新
          this.formPublish({ id })
        })
      },
      // 发布
      async formPublish(params) {
        // rowId存在，修改，否则新建
        await http.request('linkManage_publish', params)
        // 成功
        Message({ message: '发布成功', type: 'success' })
        // 刷新表格
        this.$refs.table.fetchHandler()
      },
      // 删除模板
      async handleDelete(id) {
        const { status } = await http.request('linkManage_delete', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 修改锁定状态
      async handleLock(id) {
        const { status } = await http.request('linkManage_lock', { id })
        if (status === 0) {
          Message({ message: '操作成功', type: 'success' })
          this.$refs.table.fetchHandler()
        }
      },
      // 保存  pageParams页面数据  temParams模板参数
      async formSubmit(params, disRefresh) {
        console.log('params:', params)
        // 模板参数
        const { adPosition, linkFor, linkName, templateId } = params
        let obj = {}
        // 专题模板多链接
        obj = {
          adPositionId: adPosition.join(','),
          linkFor,
          name: linkName,
          templateManageId: templateId
        }

        // rowId存在，修改，否则新建
        const { rowId } = this
        rowId && Object.assign(obj, { id: rowId })
        // 请求
        const { data } = await http.request(`linkManage_${rowId ? 'update' : 'create'}`, obj)
        let id = ''
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
