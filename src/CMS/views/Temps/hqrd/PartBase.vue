<template>
  <section class="part">
    <div v-for="(item, idx) in list" :key="idx" class="tr">
      <el-form-item :label="`${item.labels}：`">
        <el-input v-if="item.type === 1" v-model="item.value" size="mini" class="inp"/>
        <el-input v-else-if="item.type === 2" type="textarea" v-model="item.value" size="mini" class="textarea"/>
        <el-select v-else-if="item.type === 3" v-model="item.value" size="mini">
          <el-option v-for="opt in item.options" :key="opt.value" v-bind="opt"/>
        </el-select>
      </el-form-item>
    </div>
    <div class="">
      <el-button type="danger" size="mini" @click="handleClose">删除区块</el-button>
    </div>
  </section>
</template>

<script>

  export default {
    name: 'Part',
    props: {
      data: Object
    },
    data() {
      const { list, type } = this.data
      const def = {
        TS: [
          { type: 1, labels: '提示标题' },
          { type: 2, labels: '提示正文' }
        ],
        WD: [
          { type: 1, labels: '模块标题' },
          { type: 2, labels: '模块正文' }
        ],
        GD: [{
          type: 3, labels: '模板样式', options: [
            { label: '五大优势', value: 1 },
            { label: '特色功能', value: 2 },
            { label: '基本功能', value: 3 },
            { label: '标签插图', value: 4 },
            { label: '关于公司', value: 5 }
          ]
        }]
      }
      return {
        // 列表
        list: !list ? def[type] : list
      }
    },
    methods: {
      // 删除模块
      handleClose() {
        this.$emit('remove')
      },
      // 获取表单数据
      getParams() {
        // 声明
        const { list, data } = this
        return {
          ...data,
          list: list.filter(({ value }) => value)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .part {
    width: 410px;
    border: 1px solid #409EFF;
    border-radius: 4px;
    padding: 12px;
  }
</style>
