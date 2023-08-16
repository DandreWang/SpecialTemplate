<template>
  <section class="uploads">
    <!--上传文件-->
    <header class="formBox" />
    <el-form label-width="80px" :model="form" class="form">
      <el-form-item label="上传路径" class="inp">
        <el-input v-model="form.input" />
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="upload"
          drag
          :on-exceed="exceedFile"
          :on-change="fileChange"
          :before-remove="handleRemove"
          :before-upload="beforeUploadFile"
          :http-request="uploadSectionFile"
          :limit="limitNum"
          accept=""
          :action="UploadUrl()"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" :loading="uploading" @click="uploadFile">
          {{ uploadingText }}
        </el-button>
        <el-button size="small" @click="clear">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  import http from '../../api'
  import { Message } from 'element-ui'
  export default {
    name: 'Upload',
    data() {
      return {
        limitNum: 5, // 上传excel时，同时允许上传的最大数
        fileList: [], // excel文件列表
        uploading: false, // 是否显示loading
        uploadingText: '立即上传', // 按钮文字
        form: {
          input: ''
        }
      }
    },
    mounted() {
    },
    methods: {
      cancelLoading() {
        this.uploading = false
        this.uploadingText = '立即上传'
      },
      uploadSectionFile() {
      },
      // 文件超出个数限制时的钩子p
      exceedFile(files, fileList) {
        this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`)
      },
      // 文件状态改变时的钩子(添加文件,上传成功,上传失败时调用)
      fileChange(file, fileList) {
        this.fileList.push(file.raw)
      },
      // 删除文件
      handleRemove() {
        this.clear()
      },
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404
      UploadUrl() {
        return ''
      },
      // 上传文件之前的钩子,判断上传的文件是否符合格式
      beforeUploadFile(file) {
      // const extension = file.name.split('.')[1] === 'xls'
      // const size = file.size / 1024 / 1024 < 20
      // !extension && this.$message.warning('只能上传后缀是.xls的文件')
      // !size && this.$message.warning('文件大小不得超过20M')
      // return extension && size
      },
      // 立即上传
      async uploadFile() {
        if (this.fileList.length === 0) {
          this.$message.warning('请上传文件')
          return
        }
        const formData = new FormData()
        const { fileList } = this
        if (fileList.length <= 0) return
        fileList.forEach((file) => {
          formData.append('file', file)
        })
        formData.append('templateName', this.form.input)
        const { status } = await http.request('list_uploadFile', formData)
        if (status !== 0) return
        // 成功
        Message({ message: '保存成功', type: 'success' })
        this.clear()
      },
      // 清空上传的文件
      clear() {
        this.$refs.upload.clearFiles()
        this.fileList = []
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./index";
  .title{
    font-size: 20px;
    margin: 20px 0 16px;
    color: #EA5503;
  }
  .uploads{
    margin-bottom: 30px;
  }
</style>
