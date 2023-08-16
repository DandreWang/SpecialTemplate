<template>
  <div class="zbgg">
    <el-upload
      list-type="picture"
      accept="image/*"
      class="uploader"
      :auto-upload="false"
      :limit="1"
      :on-change="(file, fileList, index) => handleChange(file, fileList, index)"
      :on-exceed="(file, fileList, index) => handleExceed(file, fileList, index)"
      :action="''"
      :file-list="imagesArr"
    >
      <el-button size="mini" type="primary">
        点击上传
      </el-button>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="上传图片">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in" />
          </span>
          <span class="el-upload-list__item-preview" @click="handleRemove()">
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ImageUploader',
    props: {
      imagesArr: {
        type: Array
      },
      idx: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl: ''
      }
    },
    watch: {
      imagesArr() {
        this.$emit('updateArr', this.imagesArr, this.idx)
      }
    },
    methods: {
      // 背景图片
      handleChange(file, fileList, index) {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) return this.$message.error('图片过大，请压缩后再上传')
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file.raw)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750
            this.imagesArr.push({
              name: file.name,
              url: file.url,
              image: res,
              width: image.width / dpr / 100,
              height: image.height / dpr / 100
            })
          }
          image.src = res
          console.log('image:')
          console.log(res)
        }, false)
      },

      // 图片替换
      handleExceed(file, fileList, index) {
        const [f] = file
        const isLt2M = f.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('图片过大，请压缩后再上传')
          return
        }
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(f)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const { width, height } = image
            const dpr = width / 750 < 1 ? 1 : width / 750
            this.imagesArr = [{
              name: f.name,
              url: URL.createObjectURL(f),
              image: res,
              width: width / dpr / 100,
              height: height / dpr / 100,
              isShort: (height / dpr) < 1334
            }]
          }
          image.src = res
        }, false)
      },

      // 图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      // 删除图片
      handleRemove() {
        this.imagesArr = []
      }
    }
  }
</script>
