<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="富文本" class="fwb">
    <template slot="form">
      <quill-editor ref="Editor" v-model="content" :options="editorOption" class="editorWrapper" />
    </template>
    <Html slot="phone" :html="phoneHtml" />
  </PhoneModel>
</template>

<script>
  import http from '@/CMS/api'
  import PhoneModel from '../../Components/PhoneModel'
  import Html from '@/Page/views/fwb/index'
  import { formConf, formItems } from './data'
  import 'quill/dist/quill.snow.css'
  import { quillEditor, Quill } from 'vue-quill-editor'
  import { Base64 } from 'js-base64'
  // 自定义字体大小
  const Size = Quill.import('attributors/style/size')
  Size.whitelist = ['.2rem', '.24rem', '.28rem', '.32rem', '.36rem', '.4rem']
  Quill.register(Size, true)

  // 自定义字体类型
  const fonts = ['SourceHanSansCN', 'SimSun', 'SimHei', 'Microsoft YaHei', 'KaiTi', 'FangSong']
  const Font = Quill.import('formats/font')
  Font.whitelist = fonts
  Quill.register(Font, true)

  // 自定义链接
  const Link = Quill.import('formats/link')
  // 自定义a链接
  class LinkDIY extends Link {
    // 继承Link Blot
    static create(value) {
      const node = super.create(value)
      value = Link.sanitize(value)
      node.setAttribute('href', value)
      node.setAttribute('rel', 'noopener noreferrer')
      node.setAttribute('target', '_self')
      return node
    }
  }
  LinkDIY.blotName = 'link'
  LinkDIY.tagName = 'A'
  // 注册LinkDIY
  Quill.register(LinkDIY)

  export default {
    name: 'TempFormFwb',
    components: { PhoneModel, Html, quillEditor },
    props: {
      initData: {
        type: Object
      }
    },
    data() {
      return {
        phoneHtml: {},
        // 表单加载
        loading: false,
        // 弹窗显示
        show: false,
        // 内容
        content: null,
        // 富文本配置
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', { 'color': [] }, { 'background': [] }, 'link', 'image'],
              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
              [{ script: 'super' }, { script: 'sub' }],
              [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
              [{ font: fonts }, { size: ['.2rem', '.24rem', '.28rem', '.32rem', '.36rem', '.4rem'] }],
              ['clean']
            ]
          }
        },
        // 表单配置
        formConf,
        // 表单项目
        formItems
      }
    },
    computed: {
      editor() {
        return this.$refs.Editor.quill
      }
    },
    async mounted() {
      // 初始化表单数据
      this.init()
    },
    methods: {
      // 预览
      handlePreview() {
        this.getParams(params => {
          this.phoneHtml = params
        }, true)
      },
      init() {
        const { deltas } = this.initData
        // 表单数据
        this.editor.setContents(deltas)
      },
      // 提交
      async getParams(cb, isPreview) {
        const { editor, upload } = this
        // 内容
        const contents = editor.getContents()
        // 图片
        const images = []
        const idxs = []
        // 筛选
        contents.ops.forEach(({ insert }, idx) => {
          // 图片
          if (typeof insert !== 'object') return
          const { image } = insert
          // 添加
          image && /^data:/.test(image) && (images.push(image), idxs.push(idx))
        })
        console.log(contents)
        // 提交未上传图片
        if (images.length && !isPreview) {
          // 上传
          const imgUrls = await upload(images)
          console.log('imageUrls')
          console.log(imgUrls)
          // 替换base64
          idxs.forEach((idx, i) => (contents.ops[idx].insert.image = `${http.getApi('list_imgBaseUrl')}${imgUrls[i]}`))
          // 更新
          editor.setContents(contents)
        }
        // 回调
        cb({
          html: editor.root.innerHTML,
          deltas: contents
        })
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
