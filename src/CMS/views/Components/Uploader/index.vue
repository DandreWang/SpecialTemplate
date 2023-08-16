<template>
  <el-upload
    :action="uploadApi"
    :file-list="fileList"
    name="image"
    :on-success="onSuccess"
    :on-remove="onRemove"
    accept="image/*"
    list-type="picture-card"
    class="uploader"
  >
    <i class="el-icon-plus"/>
  </el-upload>
</template>

<script>
  import http from '@/CMS/api'

  export default {
    name: 'Uploader',
    props: {
      imgs: Array
    },
    data() {
      // 上传
      const uploadApi = http.getApi('list_uploadImg').split(',')[0]
      // 图片地址
      const imgBaseUrl = http.getApi('list_imgBaseUrl')
      return {
        // 上传
        uploadApi,
        // 文件列表
        fileList: this.imgs.map(imageUrl => ({ url: `${imgBaseUrl}${imageUrl}`, imageUrl }))
      }
    },
    watch: {
      fileList(n) {
        this.$emit('change', n.map(({ imageUrl }) => imageUrl))
      }
    },
    methods: {
      // 上传文件
      onSuccess(res, file, files) {
        const { imageUrl } = res.data
        // 更新url
        files[files.length - 1].imageUrl = imageUrl
        // 更新列表
        this.fileList = files
      },
      // 删除文件
      onRemove(file, files) {
        this.fileList = files
      }
    }
  }
</script>
<style scoped lang="scss">
  .uploader {
    width: 240px;
    $size: 50px;

    .el-icon-plus {
      line-height: $size;
    }

    /deep/ {
      .uploadImg, .el-upload-list--picture-card li, .el-upload--picture-card {
        width: $size;
        height: $size;
        line-height: $size;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }

      .el-upload-list__item-status-label {
        line-height: 20px;
      }
    }
  }

  .zoom-img {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 400px;
  }
</style>
