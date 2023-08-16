<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <section class="hqxw-ggtz">
    <header>
      {{ tit }}
    </header>
    <div class="cont">
      <p v-for="item in contArr">{{ item }}</p>
    </div>
    <footer></footer>
  </section>
</template>

<script>
  // import hybird from '@/Page/utils/hybird'
  // 工具
  // const { shareFun } = hybird

  export default {
    name: 'TempGgtzHtml',
    props: {
      html: {
        type: Object,
        default: _ => ({})
      },
      isPage: Boolean
    },
    data() {
      return {
        // 标题
        tit: '',
        // 内容
        cont: '',
        contArr: []
      }
    },
    watch: {
      html(n, o) {
        this.reload(n)
      }
    },
    async mounted() {
      const { html } = this
      // 格式化参数
      await this.reload(html)
    },
    methods: {
      // 格式化页面信息
      reload(n) {
        const { tit, cont } = n
        // 空的则返回
        if (!tit) return
        // 更新
        Object.assign(this, {
          tit, contArr: cont.split('\n')
        })
      }
    }
  }
</script>
