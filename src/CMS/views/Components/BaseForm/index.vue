<style lang="scss" scoped>
  @import "indes";
</style>
<template>
  <el-form ref="form" :model="form" v-bind="formOptions" inline class="form">
    <slot name="insertBefore" />
    <el-form-item
      v-for="fi in formItems"
      v-show="!fi.hide"
      :key="fi.prop"
      :label="`${fi.label}：`"
      :prop="fi.prop"
      :class="`formItem ${fi.itemType === 'colorInp' || fi.itemType === 'select' || fi.itemType === 'date'? 'isinline' : ''} ${fi.cls ? fi.cls : ''}`"
      v-bind="fi.itemConf"
    >
      <el-input v-if="fi.itemType === 'inp'" v-model="form[fi.prop]" :placeholder="`请输入${fi.label}`" v-bind="fi" />
      <el-date-picker v-if="fi.itemType === 'date'" v-model="form[fi.prop]" :placeholder="`请选择${fi.label}`" v-bind="fi" />
      <el-select v-else-if="fi.itemType === 'select'" v-model="form[fi.prop]" v-bind="fi">
        <el-option v-for="opt in fi.options" :key="opt.value" v-bind="opt" />
      </el-select>
      <el-input v-else-if="fi.itemType === 'colorInp'" v-model="form[fi.prop]" class="colInp">
        <template slot="suffix">
          <el-color-picker v-model="form[fi.prop]" class="colBox" size="medium" />
        </template>
      </el-input>
      <el-upload
        v-else-if="fi.itemType === 'upload'"
        :auto-upload="false"
        :on-change="handleUploadChange(fi.prop)"
        :on-exceed="handleReplaceFile(fi.prop)"
        :limit="1"
        :action="''"
        :file-list="uploaderData[fi.prop]"
        v-bind="fi"
        accept="image/*"
        list-type="picture-card"
        class="uploader"
      >
        <img slot="default" :src="updImg" class="uploadImg">
        <div slot="file" slot-scope="{file}" class="uploadImg">
          <el-popover placement="top-start" width="500" trigger="hover">
            <div
              :style="{
                backgroundImage: `url(${encodeURI(file.url)})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                height: '400px'
              }"
            />
            <div slot="reference" :style="{ backgroundImage: `url(${encodeURI(file.url)})` }" class="uploadImg" />
          </el-popover>
        </div>
      </el-upload>
    </el-form-item>
    <slot name="append" />
  </el-form>
</template>

<script>

  export default {
    name: 'BaseForm',
    props: {
      formOptions: {
        type: Object
      },
      formItems: {
        type: Array,
        default: _ => ([])
      }
    },
    data() {
      const { formItems, fmtFormData } = this
      // 组件数据
      const uploaderData = {}
      formItems.forEach(({ prop, itemType }) => itemType === 'upload' && (uploaderData[prop] = []))
      return {
        // 标签页名称
        form: fmtFormData(),
        // 表单加载
        loading: false,
        // 弹窗标题
        title: '',
        // 上传组件缓存
        uploaderData,
        // 上传图标
        updImg: require('./upload.png')
      }
    },
    methods: {
      // 上传成功
      handleUploadChange(prop) {
        return file => {
          // 文件
          const { raw } = file
          // 表单数据
          this.form[prop] = raw
          // 转化
          const url = URL.createObjectURL(raw)
          // 空数组则手动添加
          this.uploaderData[prop] = [{ ...file, url }]
        }
      },
      // 替换文件
      handleReplaceFile(prop) {
        return files => {
          const [file] = files
          // 更新显示
          this.uploaderData[prop] = [{ raw: file, url: URL.createObjectURL(file) }]
          // 更新表单数据
          this.form[prop] = file
        }
      },
      // 获取表单结果
      getFormVal(cb) {
        // 表单验证
        this.$refs.form.validate(flg => typeof cb === 'function' && cb(!flg ? false : this.form))
      },
      // 格式化参数
      fmtFormData(data = {}) {
        const { formItems } = this
        const form = {}
        // 设置默认值
        formItems.forEach(item => {
          const { prop, val, itemType } = item
          const value = data[prop] || val
          // 文件则更改文件列表
          if (itemType === 'upload' && typeof value === 'string') {
            // 生成文件
            return (this.uploaderData[prop] = [{ url: value }])
          }
          form[prop] = value || ''
        })
        return form
      },
      // 设置子组件值
      setData(data) {
        const { formData } = data
        Object.assign(this, { ...data }, formData && { form: this.fmtFormData(formData) })
      }
    }
  }
</script>
