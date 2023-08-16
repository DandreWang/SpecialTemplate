<style lang="scss" scoped>
  @import "editor";
</style>
<template>
  <quill-editor
    v-model="html"
    :options="editorOption"
    class="editor"
    @ready="ready($event)"
  />
</template>

<script>
  import http from '@/CMS/api'
  import 'quill/dist/quill.snow.css'
  import { quillEditor, Quill } from 'vue-quill-editor'
  import { ImageDrop } from 'quill-image-drop-module'

  import { Base64 } from 'js-base64'
  import Video from './video.js'
  import fontSizeStyle from './fontsize.js'

  Quill.register(Video, true)
  // 自定义字体类型
  const fonts = ['SourceHanSansCN', 'SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong']
  const Font = Quill.import('formats/font')
  Font.whitelist = fonts
  Quill.register(Font, true)
  Quill.register('modules/imageDrop', ImageDrop)

  export default {
    name: 'QuillDIY',
    components: { quillEditor },
    props: {
      initData: {
        type: Object,
        default: _ => null
      }
    },
    data() {
      const { html, deltas } = this.initData || {}
      return {
        // 内容
        html: html || null,
        delta: deltas || null,
        // 富文本配置
        editorOption: {
          modules: {
            imageDrop: true, // 图片拖拽
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }, { lineheight: ['initial', '1', '1.5', '1.75', '2'] }],
                [{ font: fonts }, { fontsize: ['0.2rem', '0.24rem', '0.28rem', '0.32rem', '0.36rem', '0.4rem'] }],
                ['image', 'video', 'clean']
              ],
              handlers: {
                // 字号
                fontsize: value => this.quill.format('font-size', value)
              }
            }
          }
        }
      }
    },
    methods: {
      ready(quill) {
        // 更新
        this.quill = quill
        // 注册
        Quill.register('formats/fontSize', fontSizeStyle, true)
        // 更新
        quill.setContents(this.delta)
      },
      // 预览
      setDeltas({ html, deltas } = {}) {
        this.html = html
        this.delta = deltas
        // 表单数据
        this.quill.setContents(deltas)
      },
      // 提交
      async getParams(isPreview) {
        const { quill, html, upload } = this
        // 内容
        const deltas = quill.getContents()
        // 图片
        const images = []
        const idxs = []
        // 筛选
        deltas.ops.forEach(({ insert }, idx) => {
          // 图片
          if (typeof insert !== 'object') return
          const { image } = insert
          // 添加
          image && /^data:/.test(image) && (images.push(image), idxs.push(idx))
        })
        try {
          // 提交未上传图片
          if (images.length && !isPreview) {
            // 上传
            const imgUrls = await upload(images)
            // 替换base64
            idxs.forEach((idx, i) => (deltas.ops[idx].insert.image = `${http.getApi('list_imgBaseUrl')}${imgUrls[i]}`))
            // 更新
            quill.setContents(deltas)
          }
          // 回调
          return { html, deltas }
        } catch (e) {
          // 回调
          return Promise.reject(e)
        }
      },
      async upload(imgs) {
        // 转码
        const imgBlobs = imgs.map(img => {
          const [mime, str] = img.split(',')
          return new File([Base64.toUint8Array(str)], 'img.png', { type: mime.match(/:(.*?);/)[1] })
        })
        // 上传
        const imgUrls = await Promise.all(imgBlobs.map(imgBlob => {
          // 表单对象
          const formData = new FormData()
          // 添加
          formData.append('image', imgBlob)
          // 上传
          return http.request('list_uploadImg', formData, { cantCancel: true })
        }))
        // 格式化
        return imgUrls.map(res => res && res.data ? res.data.imageUrl : false).filter(i => i)
      },
      // 关闭弹窗
      clear() {
        // 表单清空
      }
    }
  }
</script>
