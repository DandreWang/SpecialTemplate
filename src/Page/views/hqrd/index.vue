<style lang="scss" scoped>
  @import "./index";
</style>
<template>
  <section :class="`hqrd-html theme${theme}`">
    <header class="top">
      <div class="titBox">
        <div class="tit1">{{titSup}}</div>
        <div class="tit2" :text="title">{{title}}</div>
        <div class="tit3">{{titSub}}</div>
      </div>
      <DownloadBtn>
        <div
          slot-scope="{ state, txt, defClick }"
          :tracker-eventcode="btn.bdId"
          :tracker-extinfo="`${btn.bdId}_state:${state}；pos:top`"
          class="topBtn"
          @click="defClick"
        >{{btn.txt || txt}}
        </div>
      </DownloadBtn>
    </header>
    <div class="content">
      <template v-for="{ title, list, type, theme, id } in contList">
        <div v-if="type === 'HQ'" :key="id" class="hqBox">
          <div class="title">{{title}}</div>
          <template v-for="{ type, value, imgs } in list">
            <div v-if="type === 1" class="title">{{value}}</div>
            <div v-else-if="type === 2" class="hqSub" v-html="value.replace(/\n/g, '<br/>')"></div>
            <img v-else-if="type === 3" v-for="img in imgs" class="hqImg" :src="`${prodUrl}${img}`" alt="">
          </template>
        </div>
        <div v-else-if="type === 'XC'" :key="id" :class="theme === 1 ? 'card card1' : 'dropsList'">
          <div class="title">{{title}}</div>
          <div class="cons">
            <div v-for="{ tit, txt } in list" class="trs">
              <div class="tit">{{tit}}</div>
              <div class="txt">{{txt}}</div>
            </div>
          </div>
        </div>
        <div v-else-if="type === 'TS'" :key="id" class="desc">
          <div v-for="item in list" :class="item.type === 1 ? 'tit' : 'txt'" v-html="item.value.replace(/\n/g, '<br/>')"/>
        </div>
        <div v-else-if="type === 'WD'" :key="id" class="card card2">
          <div v-for="item in list" :class="item.type === 1 ? 'title' : 'txt'" v-html="item.value.replace(/\n/g, '<br/>')"/>
        </div>
        <Temps v-else-if="type === 'GD'" :key="id" :type="list[0].value"/>
      </template>
    </div>
    <DownloadBtn v-if="btn.show" class="btnBox">
      <footer
        slot-scope="{ state, txt, defClick }"
        :tracker-eventcode="btn.bdId"
        :tracker-extinfo="`${btn.bdId}_state:${state}；pos:bottom`"
        @click="defClick"
      >
        <div class="btn">{{btn.txt || txt}}</div>
        <div class="warn">温馨提醒：投资有风险 入市需谨慎</div>
      </footer>
    </DownloadBtn>
  </section>
</template>

<script>
  import DownloadBtn from '@/Page/views/Components/DownloadBtn'
  import Temps from './Temps'
  import { prodUrl } from '@/Page/api/pageConf'

  export default {
    name: 'TempHqrdHtml',
    components: { DownloadBtn, Temps },
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
        // 标题
        title: '',
        // 上方
        titSup: '',
        // 下方
        titSub: '',
        // 按钮埋点
        btn: {
          // 显示隐藏
          show: false,
          // 按钮文字
          txt: '',
          // 按钮埋点
          bdId: ''
        },
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
        const { theme, title, titSup, titSub, btn = {}, contList } = n
        // 更新
        Object.assign(this, { theme, contList, title, titSup, titSub, btn })
      }
    }
  }
</script>
