<template>
  <div v-if="type === 1" class="advantage">
    <div v-for="item in ys" class="txt" v-html="item"/>
  </div>
  <div v-else-if="type === 2" class="partList">
    <div class="title">期货特色功能与服务</div>
    <div v-for="item in tsfw" class="partTr">
      <div class="partTit">{{item.tit}}</div>
      <div class="partTxt" v-html="item.txt"/>
    </div>
  </div>
  <div v-else-if="type === 3" class="flow">
    <div class="title">期货软件基本功能覆盖齐全</div>
    <div class="flowImg"></div>
  </div>
  <div v-else-if="type === 4" class="tips"></div>
  <div v-else-if="type === 5" class="about">
    <div class="title">关于期货</div>
    <div v-for="txt in gygs" class="txt">{{txt}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Temps',
    props: {
      type: Number
    },
    data() {
      return {
        tsfw: [{
          tit: '免费开户下单',
          txt: '10分钟完成手机线上开户，<br>交易下单软件不收费。'
        }, {
          tit: '行情资讯',
          txt: '整合网强大的信息<br>流，重大资讯、产业情报，<br>绝不错过。'
        }, {
          tit: '模拟交易',
          txt: '新手演练基地，<br>零成本策略检验神器！'
        }, {
          tit: '期货微课堂',
          txt: '免费的短视频教学，<br>三分钟一节期货课。'
        }, {
          tit: '期货吧',
          txt: '人气期货社区，讨论基本面<br>动向，交流做单心得。'
        }],
        ys: [
          '闪电<br>期货交易',
          '证监会<br>监管',
          '人气聚集的<br>期货吧',
          '实时<br>期货资讯',
          '便捷<br>在线开户'
        ],
        gygs: [
          '期货（上海期货有限公司）是上市公司（300059）旗下的持牌期货公司。公司坚持“为用户创造更多价值”的经营理念，致力于为用户提供一站式期货服务。',
          '公司在全国期货公司中首批获得中国金融期货经纪业务资格、是上海地区首批中国金融期货交易所交易结算会员。主要从事国内商品期货经纪和金融期货经纪业务，是上海期货交易所（会员号0298）、大连商品交易所（会员号0209）、郑州商品交易所（会员号0269）、广州期货交易所（会员号0038）、中国金融期货交易所（会员号0107）、上海国际能源交易中心（会员号8298）会员。',
          // '公司位于中国上海的金融中心——浦东陆家嘴金融贸易区，毗邻上海期货交易所和中国金融期货交易所。是一家资金实力雄厚、交易环境优雅、交易系统安全快捷、软硬件设备先进、员工队伍专业、精干的全国性期货公司。'
        ]
      }
    }
  }
</script>
