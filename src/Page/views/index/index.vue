<template>
  <component :is="`Temp_${templateType}`" v-if="templateType" ref="temp" is-page :html="tempData" />
</template>

<script>
  import Temps from './data'
  import getPageConf from '../../api/pageConf'
  import utils from '../../utils'
  import { logger } from '../../utils/log'
  // 分享
  const { shareFun } = utils

  export default {
    name: 'Index',
    components: { ...Temps },
    data() {
      return {
        templateType: '',
        tempData: {}
      }
    },
    mounted() {
      this.getPageConf()
    },
    methods: {
      getPageConf() {
        const { id } = this.$route.query
        getPageConf.get(`${id}.js?time=${new Date().getTime()}`, {}, {}, {}, true).then(res => {
          console.log('res')
          console.log(res)
          const { templateType, dbId, khPageId, shareConf: { shareTitle = '', shareDesc = '' } = {}} = res
          // 模板类型
          this.templateType = templateType
          // 模板数据
          this.tempData = res
          // 分享
          shareTitle && shareFun({ title: shareTitle, desc: shareDesc })
          // 埋点
          logger(dbId, khPageId)
        })
      }
    }
  }
</script>
