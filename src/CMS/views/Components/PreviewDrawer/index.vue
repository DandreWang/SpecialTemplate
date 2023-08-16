<template>
  <el-drawer
    :title="title"
    :visible.sync="showDrawer"
    :direction="direction"
    :append-to-body="true"
  >
    <Zbgg ref="phone" :html="tempData" :is-drawer="true" class="previewBlock" />
  </el-drawer>
</template>

<script>
  import Zbgg from '@/Page/views/zbgg/index'
  export default {
    name: 'PreviewDrawer',
    components: { Zbgg },
    data() {
      return {
        // 模板内容
        tempData: {},
        // 标题
        title: '',
        // 展示
        showDrawer: false,
        // 展示方向
        direction: ''
      }
    },
    methods: {
      // 设置组件值
      setData(data) {
        Object.assign(this, { ...data })
      }
    }
  }
</script>

