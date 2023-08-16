<style lang="scss" scoped>
  @import "./index.scss";
</style>

<template>
  <section class="adv pageWrapper">
    <header>
      <div class="errorTxt">抱歉，没有找到页面君～！</div>
    </header>
    <div class="quotes">
      <div class="title">投资需要思考和休息</div>
      <div class="cont">
        <div class="text">{{ quotesArr[num] }}</div>
      </div>
    </div>
    <footer v-if="isFutures">
      <div class="btn" @click="handleBtnClick">下次再来</div>
    </footer>
  </section>
</template>

<script>
  import utils from '@/Page/utils'

  const { callFuturesService, mobileEnv: { isFutures }} = utils
  export default {
    name: 'Index',
    data() {
      return {
        isFutures,
        quotesArr: [
          '期货投资六字箴言：顺势，轻仓，止损',
          '只做有把握的事情，不冒无谓的风险',
          '投资并不需要做对很多事情，重要的是不要犯大错',
          '真正的聪明人会从别人的经验中获得教训',
          '永远不要试图抄底摸顶，资金安全永远放在首位'
        ],
        num: 0
      }
    },
    mounted() {
      const { quotesArr } = this
      // 取随机数
      this.num = Math.floor(Math.random() * quotesArr.length)
    },
    methods: {
      // 点击按钮关闭页面
      handleBtnClick() {
        callFuturesService('1000', {})
      }
    }
  }
</script>
