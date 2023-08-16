<style lang="scss" scoped>
  @import "./index";
</style>
<template>
  <div :class="`content ${colsFlg ? 'hideAside' : ''} ${pageCls}`">
    <slot name="header"/>
    <!--侧边栏-->
    <el-aside :width="asideWidth" :style="{left: colsFlg ? `-${asideWidth}` : 0}">
      <slot name="aside"/>
    </el-aside>
    <el-main :style="{marginLeft: !colsFlg ? asideWidth : 0}">
      <div class="colsBtn" @click="handleCollapse"/>
      <router-view/>
    </el-main>
  </div>
</template>

<script>
  export default {
    name: 'Panel',
    props: {
      asideWidth: {
        type: String,
        default: '190px'
      },
      pageCls: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        colsFlg: false
      }
    },
    methods: {
      handleCollapse() {
        this.colsFlg = !this.colsFlg
      }
    }
  }
</script>
