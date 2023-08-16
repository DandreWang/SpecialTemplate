<style lang="scss" scoped>
  .dialog {
    /deep/ {
      .el-dialog {
        margin-top: 2vh !important;
      }
      .el-dialog__body {
        padding-top: 8px;
      }
      .el-form-item__label:before {
        content: '*';
        margin-right: 4px;
        color: #fff;
      }
    }

    .dialogCont {
      position: relative;
      height: 770px;
      overflow: auto;
      /deep/.el-form-item {
        &.share {
          width: 700px;
          .el-form-item__content {
            width: calc(100% - 100px);
          }
        }
        &.launch {
          width: 700px;
          .el-select {
            width: 580px;
          }
        }
      }
    }
  }

  .theme {
    width: 100px;
  }

</style>
<style lang="scss">
  .newInput {
    width: 45%;
    margin-left: 20px;
  }
  .showTxt {
    display: inline-block;
    width: 500px;
  }
</style>
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
      <el-form ref="form" :model="form" :rules="rules" size="small" inline class="typeForm">
        <el-form-item label="专题名称：" prop="pageName">
          <el-input v-model="form.pageName" />
        </el-form-item>
        <el-form-item label="模板类型：" prop="templateid">
          <el-select v-model="templateTempId" :disabled="isZbgg" @change="handleChangeTemp">
            <el-option v-for="opt in options" :key="opt.id" :value="opt.id" :label="opt.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="form.templateid !== 16" type="warning" @click="handlePreview">
            预览
          </el-button>
          <!-- 热点资讯预览 -->
          <el-select v-if="form.templateid === 16" v-model="theme" placeholder="预览" class="theme">
            <el-option
              v-for="item in themeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-button type="primary" @click="handleSubmit">
            保存并退出
          </el-button>
          <el-button type="danger" @click="handlePublish">
            发布
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
        <div />
<!--        <el-form-item label="分享标题：" prop="shareTitle" class="share">-->
<!--          <el-input v-model="form.shareTitle" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="埋点ID：" prop="dbId">-->
<!--          <el-input v-model="form.dbId" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="分享描述：" prop="shareDesc" class="share">-->
<!--          <el-input v-model="form.shareDesc" type="textarea" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="开户ID：" prop="khPageId">-->
<!--          <el-input v-model="form.khPageId" />-->
<!--        </el-form-item>-->
        <el-form-item v-if="form.templateid===15 && !isZbgg" label="链接用于：" prop="linkFor">
          <el-select v-model="form.linkFor" size="small" class="selectBox">
            <el-option v-for="{ label, value } in linkOptions" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.templateid===15 && !isZbgg" label="投放位置：" prop="launch" class="launch">
          <el-select v-model="form.adPosition" multiple placeholder="请选择投放位置">
            <el-input v-model="newItemVal" class="newInput" size="mini" placeholder="请输入新建条目" />
            <el-button size="mini" @click="addItem">
              添加
            </el-button>
            <el-option v-for="item in launchOptions" :key="item.value" :label="item.label" :value="item.value">
              <span v-if="!item.editable" class="showTxt" @dblclick="handleItemEdit(item.value)">{{ item.label }}</span>
              <el-input v-else v-model="item.label" @click.stop.native="focus()" @blur="handleInputConfirm(item.value, item.label)" @keyup.native.enter="$event.target.blur(item.value, item.label)" />
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <component :is="`TempForm_${templateType}`" v-if="templateType" ref="temp" :init-data="tempData" :theme="theme" />
    </div>
    <!-- 已锁定不可编辑提示弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
    >
      <span style="font-size:16px;color:#333;">此模板已锁定，无法修改</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 重新配置发布弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="showEditDialog"
      width="30%"
      append-to-body
    >
      <span style="font-size:16px;color:#333;">若要使用按钮自定义跳转新配置，请重新配置用户类型和跳转页面类型，并重新发布页面！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showEditDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import Temps from '../../Temps'
  import { Message, MessageBox } from 'element-ui'
  import http from '@/CMS/api'

  export default {
    name: 'TempDialog',
    components: { ...Temps },
    props: {
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
        // 页面信息
        form: {
          // 页面名称
          pageName: '',
          // 类型
          templateid: '',
          // 分享标题
          shareTitle: '',
          // 分享内容
          shareDesc: '',
          // 埋点ID
          dbId: '',
          // 开户页面ID
          khPageId: '',
          // 是否锁定
          locked: 0,
          // 链接用于（主包广告模板）
          linkFor: null,
          // 投放位置（主包广告模板）
          launch: null
        },
        rules: {
          pageName: [{ required: true, message: '请填写页面名称', trigger: 'blur' }],
          templateid: [{ required: true, message: '请选择模板', trigger: 'blur' }]
          // shareTitle: [{ required: true, message: '请填写分享标题', trigger: 'blur' }],
          // shareDesc: [{ required: true, message: '请填写分享内容', trigger: 'blur' }]
        },
        // 暂存
        templateTempId: '',
        // 模板名称
        templateName: '',
        // 类型
        templateType: '',
        // 初始化数据
        tempData: {},
        // 是否是专题模板列表
        isZbgg: false,
        // 类型列表
        options: [],
        // 表单加载
        loading: false,
        // 弹窗显示
        show: false,
        // 黑白皮肤预览
        theme: '',
        themeOptions: [{
          value: 'light',
          label: '白皮肤'
        }, {
          value: 'dark',
          label: '黑皮肤'
        }],
        // 锁定提示弹窗显示
        dialogVisible: false,
        // 链接用于
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
        showEditDialog: false
      }
    },
    watch: {
      'form.templateid'(n, o) {
        // 对应模板
        const [{ name, type } = { name: '', type: '' }] = this.options.filter(item => item.id === n)
        // 更新
        Object.assign(this, {
          templateType: type, templateName: name
        })
        // zbgg加载投放位置选项
        if (n === 15) {
          this.getAdPosition()
        }
      },
      theme() {
        const temp = document.getElementsByClassName('wbox')
        if (this.theme === 'dark') {
          temp[0].className = 'wbox black'
        } else {
          temp[0].className = 'wbox'
        }
      }
    },
    methods: {
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
      handlePreview() {
        this.$refs.temp.handlePreview()
      },
      // 提交
      handleSubmit() {
        // 声明
        const { formSubmit, templateName, form, getParams, isZbgg } = this
        console.log('form:', form)
        console.log(this.isZbgg)
        // 获取表单数据
        getParams(async params => {
          await formSubmit({
            ...form, templateName, html: JSON.stringify(params), templateid: isZbgg ? 15 : form.templateid
          })
          // 成功
          Message({ message: '保存成功', type: 'success' })
          // 关闭弹窗
          this.show = false
        })
      },
      // 发布模板
      handlePublish() {
        // 声明
        const { formSubmit, formPublish, templateName, form, getParams } = this
        // 获取表单数据
        getParams(async params => {
          await MessageBox.confirm('确认保存并发布?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          // 字符串
          const htmlStr = JSON.stringify(params)
          // // 保存
          const id = await formSubmit({
            ...form, templateName, html: htmlStr
          }, true)
          // 发布
          await formPublish({ id, html: htmlStr })
          // 关闭弹窗
          this.show = false
        })
      },
      // 获取数据
      getParams(cb) {
        if (typeof cb !== 'function') return
        const { form: { shareTitle, shareDesc, dbId, khPageId, linkFor, launch }, templateType, $refs } = this

        // 表单验证
        $refs.form.validate(flg => {
          if (!flg) return
          // 提交
          $refs.temp.getParams(p => {
            cb({ ...p, shareConf: { shareTitle, shareDesc }, templateType, dbId, khPageId })
          })
        })
      },
      handleCancel() {
        this.show = false
      },
      // 关闭弹窗
      handleCloseDialog() {
        // 表单清空
        this.form = { templateid: '', pageName: '' }
        this.templateTempId = ''
        // 清空表单
        this.$refs.form.resetFields()
        this.tempData = {}
      },
      // 切换模板
      async handleChangeTemp(n) {
        try {
          // 提示
          this.form.templateid && await this.$confirm('切换模板将不保留未保存数据, 请确认是否已保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          // 更新
          this.form.templateid = n
        } catch (e) {}
      },
      // 设置子组件值
      setData(data) {
        const { formData, rowId, options, isZbgg, ...baseData } = data
        console.log('data')
        console.log(data)
        console.log(formData)
        if (formData && typeof formData === 'object') {
          const { templateid: templateid, name: pageName, html, locked, savedHtml, publishedHtml, id: zbggid, published } = formData
          // 模板数据
          const tempData = html ? JSON.parse(html) : published === 2 || published === 0 ? JSON.parse(savedHtml) : JSON.parse(publishedHtml)
          console.log('tempData:', tempData)
          // 声明
          const { dbId, khPageId, shareConf, btnItems } = tempData
          // 表单更新
          // this.form = { templateid: zbggid ? 15 : templateid, pageName, dbId, khPageId, ...shareConf }
          this.form = { templateid: isZbgg ? 15 : templateid, pageName, dbId, khPageId, ...shareConf }
          // 模板数据
          this.tempData = tempData
          this.tempData.id = rowId
          this.tempData.pageName = pageName
          this.templateTempId = isZbgg ? 15 : templateid
          // 已锁定情况下，弹窗提示不可编辑
          if (locked) {
            setTimeout(_ => {
              this.dialogVisible = true
            }, 500)
          }
          // 原主包广告模板加载投放位置选项
          if (templateid === 15) {
            const { adPositionId, linkFor } = formData
            const tmp = adPositionId ? adPositionId.split(',').map(e => { return e - 0 }) : []
            // 表单更新
            this.form = { templateid, pageName, dbId, khPageId, linkFor, adPosition: tmp, ...shareConf }
            // 模板数据
            this.tempData.adPosition = tmp
            this.tempData.trackLinkFor = linkFor
            this.getAdPosition()
          }
          // 原主包广告未配置跳转页面类型时，弹窗提示重新配置发布
          if ((templateid === 15) && btnItems.length && !btnItems[0].jumpType) {
            setTimeout(_ => {
              this.showEditDialog = true
            }, 500)
          }
        } else {
          // 主包广告新建模板初始化赋值
          if (isZbgg) {
            this.form = { templateid: 15 }
          }
        }

        // 主包广告新建模板
        if (isZbgg) {
          this.templateTempId = 15
          this.isZbgg = isZbgg
          this.rules.templateid[0].required = false
          // 对应模板
          const [{ name, type } = { name: '', type: '' }] = options.filter(item => item.id === 15)
          // 更新
          Object.assign(this, {
            templateType: type,
            templateName: name
          })
        }
        const tmp = options.slice(1)
        Object.assign(this, {
          ...baseData,
          options: tmp
        })
      }
    }
  }
</script>
