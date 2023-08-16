<style lang="scss" scoped>
  $height: 543px;
  .TempBox {
    display: flex;
    overflow: auto;

    .typeForm {
      min-width: 598px;
      max-height: $height;
      overflow: auto;

      /deep/ .temp_title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 12px;
      }
    }

    .phone {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: $height;
      // min-width: 386px;
      width: 386px;
      flex-shrink: 0;

      .mtop, .vtop {
        width: 375px;
        height: auto;
      }

      .vbox {
        width: 100%;
        height: 100%;
        overflow: auto;
        border: 1px solid #ccc;
      }
    }
  }
</style>
<template>
  <div class="TempBox">
    <div class="typeForm">
      <div class="temp_title">
        {{ title }}
      </div>
      <slot name="form" />
    </div>
    <div class="phone">
      <!--      <img src="./images/mobile_top.png" alt="" class="mtop">-->
      <!--      <img src="./images/headbg.png" alt="" class="vtop">-->
      <div class="vbox">
        <slot name="phone" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PhoneModel',
    props: {
      title: {
        type: String
      }
    }
  }
</script>
