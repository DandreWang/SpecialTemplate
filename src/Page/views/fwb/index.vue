<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <section class="fwb-html ql-editor" v-html="html.html"></section>
</template>

<script>
  import 'quill/dist/quill.snow.css'

  export default {
    name: 'TempFwbHtml',
    components: {},
    props: {
      html: {
        type: Object,
        default: _ => ({})
      },
      isPage: Boolean
    },
    data() {
      return {
      }
    },
    watch: {
      html(n, o) {
        // this.reload(n)
      }
    }
  }
</script>
