<template>
  <div :class="{logo:true, hasSide:hasSide}">
    <img class="icon" src="data:image/png;base64,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" alt="">
    <span :style="{color:theme||'#2c3e50'}" class="title">{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: String,
    // 有侧边栏
    hasSide: Boolean,
    // 文字颜色
    theme: String,
  },
}
</script>

<style scoped lang='scss'>
.logo {
  display: flex;
  align-items: center;
  margin-top:-5px;
  .icon {
    width:36px;height: auto;
  } 
  .title {
    font-family: Verdana,Geneva,Tahoma,sans-serif;
    font-size:20px;
    margin-left:15px;
    white-space: pre;
  } 
}
.hasSide {
  margin-left:15px;
  .title {
    margin-left:10px
  }
}

</style>