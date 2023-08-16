<style lang="scss" scoped>
  .logoBox {
    height: 73px;
    line-height: 73px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #C4C4C4;
    .logo {
      height: 36px;
      margin-top: 19px;
      width: 156px;
    }
  }
  .left{
    background-color: #fff;
    border-left: 2px solid transparent;
    height: 64px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-family: PingFangSC-Medium;
    color: #778CA2;

    &.act {
      background-color: #F8FAFB;
      border-left-color: #F35A5A;
      color: #F35A5A;
    }
  }
</style>
<template>
  <Panel aside-width="220px">
    <template slot="aside">
      <div class="logoBox">
        <Logo theme='#6E6E6E' hasSide title='专题模板后台' />
        <!-- <img src="./logo.png" alt="" class="logo"> -->
      </div>
      <div
        v-for="{path, name, title} in links"
        :key="path"
        :class="`left ${act === path ? 'act' : ''}`"
        @click="handleRouteChange(path, title)"
      >
        {{ title }}
      </div>
    </template>
  </Panel>
</template>

<script>
  import { routes } from '../../router'
  import Panel from '../Components/Panel'
  import Logo from './Logo.vue'

  export default {
    name: 'Main',
    components: { Panel, Logo },
    data() {
      return {
        links: routes,
        // 当前路由
        act: window.location.hash.substr(1).replace(/^(.*)\?.*/, '$1')
      }
    },
    methods: {
      handleRouteChange(index) {
        this.act = index
        this.$router.push(index)
      // document.getElementsByTagName('title')[0].innerHTML = title
      }
    }
  }
</script>
