<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="show"
    :title="title"
    :close-on-click-modal="false"
    :width="`${dialogWidth}px`"
    class="dialog"
    @close="handleCloseDialog"
  >
    <div class="dialogCont">
      <el-form ref="form" :model="form" :rules="rules" size="small" class="typeForm">
        <el-form-item prop="linkName" label="链接名称">
          <el-input v-model="form.linkName" class="nameInp" placeholder="请输入链接名称" clearable />
        </el-form-item>
        <el-form-item prop="linkFor" label="投放平台">
          <el-select v-model="form.linkFor" size="small" class="selectBox" placeholder="请选择投放平台" clearable>
            <el-option v-for="{ label, value } in linkOptions" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="投放位置" prop="adPosition" class="launch">
          <el-select v-model="form.adPosition" multiple placeholder="请选择投放位置" clearable>
            <el-input v-model="newItemVal" class="newInput" size="mini" style="width:80%;margin-left:10px" placeholder="请输入新建条目" />
            <el-button size="mini" type="primary" plain @click="addItem">添加</el-button>
            <el-option v-for="item in launchOptions" :key="item.value" :label="item.label" :value="item.value">
              <span v-if="!item.editable" class="showTxt" @dblclick="handleItemEdit(item.value)">{{ item.label }}</span>
              <el-input v-else v-model="item.label" @click.stop.native="focus()" @blur="handleInputConfirm(item.value, item.label)" @keyup.native.enter="$event.target.blur(item.value, item.label)" />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="templateId" label="选择模板">
          <div v-show="hasChecked" class="checked">
            <el-input v-model="checkedTemp" class="checkTxt" disabled />
            <el-button type="warning" size="small" style="margin-left:10px;" @click="handlePreview(selectedTemp)">预览</el-button>
            <el-button type="danger" size="small" style="margin-left:10px;" plain @click="handleCancel()">取消选择</el-button>
          </div>
          <div v-if="isAdd || canCheck" class="linkTable">
            <el-form inline>
              <el-form-item label="模板编号">
                <el-input v-model="templateInfo.id" style="width:180px;" size="mini" clearable placeholder="请输入模板编号" />
              </el-form-item>
              <el-form-item label="模板名称">
                <el-input v-model="templateInfo.name" style="width:180px;margin:0 10px;" size="mini" clearable placeholder="请输入模板名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
              </el-form-item>
            </el-form>
            <SearchTablePagination ref="tempTable" v-bind="tableOptions" @current-change="handleCurrentChange">
              <template slot="append">
                <el-table-column label="使用状态" prop="useStatus" align="center">
                  <template slot-scope="{row}">
                    <el-tag :type="row.linkNumber ? 'success' : 'primary'">{{ !row.linkNumber ? '未使用' : '已使用' }}</el-tag>
                  </template>
                </el-table-column>
              </template>
              <template slot="append">
                <el-table-column prop="cz" label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-button type="warning" @click="handlePreview(row)">预览</el-button>
                  </template>
                </el-table-column>
              </template>
            </SearchTablePagination>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm('form')">确 定</el-button>
      <el-button @click="handleCloseDialog">取 消</el-button>
    </div>
    <PreviewDrawer ref="drawer" />
    <el-dialog
      :visible.sync="showTip"
      width="30%"
      append-to-body
      style="margin-top:15vh"
    >
      <span style="font-size:18px">该模板还未发布，换一个吧~</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showTip = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import PreviewDrawer from '../PreviewDrawer'
  import SearchTablePagination from '../SearchTablePagination'
  import { tableOptions } from './data'
  import { Message } from 'element-ui'
  import http from '@/CMS/api'
  export default {
    name: 'LinkDialog',
    components: { SearchTablePagination, PreviewDrawer },
    props: {
      // 标题
      title: String,
      formSubmit: {
        type: Function,
        default: _ => _ => null
      },
      formPublish: {
        type: Function,
        default: _ => _ => null
      },
      dialogWidth: {
        type: Number,
        default: 1200
      }
    },
    data() {
      return {
        tableOptions,
        // 是否显示弹窗
        show: false,
        // 是否显示提示弹窗
        showTip: false,
        // 是否是新建
        isAdd: false,
        // 表单加载
        loading: false,
        // 表单
        form: {
          // 链接名称
          linkName: '',
          // 投放平台（链接用于）
          linkFor: '',
          // 投放位置
          adPosition: '',
          // 选中的模板
          templateId: ''
        },
        // 模板查询条件
        templateInfo: {
          id: '',
          name: ''
        },
        // 表单验证
        rules: {
          linkName: [{ required: true, message: '请填写链接名称', trigger: 'blur' }],
          linkFor: [{ required: false, message: '请选择投放平台', trigger: 'blur' }],
          adPosition: [{ required: false, message: '请选择投放位置', trigger: 'blur' }],
          templateId: [{ required: true, message: '请选择模板', trigger: 'blur' }]
        },
        // 链接名称生成方式
        nameType: 'auto',
        // 投放平台
        linkOptions: [{
          label: '主包',
          value: 1
        }, {
          label: '期货App',
          value: 2
        }, {
          label: '天天基金',
          value: 4
        }, {
          label: '其他',
          value: 3
        }],
        // 投放位置
        launchOptions: [],
        // 投放位置新建条目
        newItemVal: '',
        // 重新编辑配置弹窗
        showEditDialog: false,
        // 模板列表
        tempList: [],
        // 是否能选择模板
        canCheck: false,
        // 是否已选择模板
        hasChecked: false,
        // 选中模板名称
        checkedTemp: '',
        // 选中模板暂存
        selectedTemp: ''
      }
    },
    mounted() {
      this.getAdPosition()
    },
    methods: {
      // 关闭弹窗
      handleCloseDialog() {
        // 表单清空
        this.form = { linkName: '', linkFor: '', adPosition: '', templateId: '' }
        // 状态重置
        this.canCheck = false
        this.hasChecked = false
        this.checkedTemp = ''
        this.show = false
      },

      // 确认（提交表单）
      handleConfirm(form) {
        this.$refs[form].validate(async(valid) => {
          if (valid) {
            const { formSubmit, handleCloseDialog, form: { adPosition, linkFor, linkName, templateId }} = this
            await formSubmit({ adPosition, linkFor, linkName, templateId })
            // 成功
            Message({ message: '保存成功', type: 'success' })
            // 关闭弹窗
            handleCloseDialog()
          } else {
            return false
          }
        })
      },

      // 设置子组件值
      setData(data) {
        console.log('linkDialog Data: ')
        console.log(data)
        Object.assign(this, {
          ...data
        })

        // 列表重置至第一页
        this.$nextTick(() => {
          if (!this.isAdd) return
          const { tempTable } = this.$refs
          tempTable.handleSetBaseParams({ page: 1 })
          tempTable.searchHandler()
        })

        // 初始值设置
        const { formData = null } = data
        if (formData && typeof formData === 'object') {
          console.log('formData: ', formData)
          const { adPositionId, linkFor, templateManageId, templateManageName, name } = formData
          Object.assign(this, {
            hasChecked: true,
            checkedTemp: `已选择模板：${templateManageId}-${templateManageName}`,
            selectedTemp: formData,
            canCheck: false,
            form: {
              adPosition: adPositionId ? adPositionId.split(',').map(e => { return e - 0 }) : [],
              linkFor: linkFor,
              templateId: templateManageId,
              linkName: name
            }
          })
        }
      },

      // 模板查询
      handleSearch() {
        const { templateInfo: { id, name }, page, size } = this
        const table = this.$refs.tempTable
        // 设置参数
        table.handleSetBaseParams({ page, size, name, id })
        // 刷新表格
        table.searchHandler()
      },

      // 选择模板
      handleCheck() {
        this.canCheck = true
      },

      // 投放位置选项编辑
      handleItemEdit(val) {
        const target = this.launchOptions.find(e => e.value === val)
        target.editable = true
      },
      // 选项编辑输入完成
      async handleInputConfirm(id, val) {
        const target = this.launchOptions.find(e => e.value === id)
        const formData = new FormData()
        formData.append('id', id)
        formData.append('name', val)
        await http.request('list_updateAdPosition', formData)
        target.editable = false
        this.getAdPosition()
      },
      // 获取输入
      async addItem() {
        const { newItemVal, getAdPosition } = this
        if (!newItemVal) return
        const formData = new FormData()
        formData.append('name', newItemVal)
        await http.request('list_addAdPosition', formData)
        getAdPosition()
        this.newItemVal = ''
      },
      // 阻止input冒泡事件
      focus() {
        console.log('hi')
      },

      // 获取投放位置选项
      async getAdPosition() {
        const { data } = await http.request('list_listAdPosition')
        this.launchOptions = data.map(({ id, name }) => {
          return {
            label: name,
            value: id,
            editable: false
          }
        })
      },

      // 预览
      handlePreview(row) {
        console.log('预览：', row)
        // 编辑
        if (!row) {
          console.log('编辑')
          return
        }

        // 新建
        const { name, savedHtml, publishedHtml, published, id, templateManageName, templateManageId } = row
        this.$refs.drawer.setData({
          title: `已选择模板：${templateManageId || id}-${templateManageName || name}`,
          showDrawer: true,
          direction: 'rtl',
          tempData: published === 2 || published === 0 ? JSON.parse(savedHtml) : JSON.parse(publishedHtml)
        })
      },

      // 选中一模板
      handleCurrentChange(row) {
        console.log('选中：', row)
        if (row && !row.published) {
          this.$refs.tempTable.$children[0].setCurrentRow()
          this.showTip = true
          return
        }
        this.hasChecked = row && true
        this.checkedTemp = row && `已选择模板：${row.id}-${row.name}`
        this.selectedTemp = row || null
        this.form.templateId = row && row.id
      },

      // 取消选中模板
      handleCancel(row) {
        this.canCheck = true
        this.hasChecked = false
        if (this.$refs.tempTable) {
          this.$refs.tempTable.$children[0].setCurrentRow(row)
        }
        // this.hasChecked = false
        this.checkedTemp = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/ {
  .el-dialog {
    margin-top: 8vh !important;
  }
  .el-dialog__body {
    padding-top: 8px;
    padding-bottom: 0;
  }
  .el-dialog__footer {
    padding-top: 0;
    margin-top: -30px;
  }
  .el-form-item__label:before {
    content: '*';
    margin-right: 4px;
    color: #fff;
  }

  .checkTxt {
    color:#f56c6c;
    width: 435px;
    // border: 1px dotted #f56c6c;
    border-radius: 4px;
    // padding: 5px;
    .el-input__inner {
      background-color: transparent;
      border: 1px dotted #f56c6c;
      color:#f56c6c;
    }
  }

  .el-table {
    .el-table__cell {
      padding: 5px 0;
    }
  }
}
.nameInp {
  width: 600px;
  // margin-left: 20px;
}
.el-select {
  width: 600px;
}

.linkTable {
  margin-top: 20px;
}
</style>
