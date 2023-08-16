<style lang="scss" scoped>
  @import "./index";
</style>
<template>
  <section :class="`qhzc-html theme${theme}`">
    <header class="top">
      <div class="title">{{tit}}</div>
      <div class="desc">{{subStr}}</div>
      <div class="dt">{{date}}</div>
    </header>
    <div class="content">
      <template v-for="{title, list} in contList">
        <div class="tit">{{title}}</div>
        <div class="txtBox">
          <div class="bd"></div>
          <template v-for="{ type, value, imgs } in list">
            <div v-if="type === 1" class="subTit">{{value}}</div>
            <div v-else-if="type === 2" class="txt" v-html="value.replace(/\n/g, '<br/>')"></div>
            <img v-else-if="type === 3" v-for="img in imgs" class="img" :src="`${prodUrl}${img}`" alt="">
          </template>
          <div class="bd b"></div>
        </div>
      </template>
    </div>
    <footer></footer>
  </section>
</template>

<script>
  import { prodUrl } from '@/Page/api/pageConf'
  export default {
    name: 'TempQhzcHtml',
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
        prodUrl,
        // 主题
        theme: 1,
        // 主标题
        tit: '',
        // 次级标题
        subStr: '',
        // 日期
        date: '',
        // 内容
        contList: []
      }
    },
    mounted() {
      const { isPage, html, reload } = this
      // 渲染
      isPage && reload(html)
    },
    watch: {
      html(n, o) {
        this.reload(n)
      }
    },
    methods: {
      reload(n) {
        // 声明
        const { theme, tit, subStr, date, contList } = n
        // 更新
        Object.assign(this, { theme, contList, tit, subStr, date })
      }
    }
  }
</script>
