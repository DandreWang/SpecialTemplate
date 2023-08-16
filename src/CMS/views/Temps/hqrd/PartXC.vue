<template>
  <section class="part">
    <el-form-item label="模板样式：">
      <el-select v-model="theme" size="mini">
        <el-option v-for="opt in themes" :key="opt.value" v-bind="opt"/>
      </el-select>
    </el-form-item>
    <el-form-item label="模块标题：">
      <el-input v-model="title" size="mini" placeholder="请输入模块标题" class="selectBox"/>
    </el-form-item>
    <div v-for="(item, idx) in list" :key="idx" class="tr">
      <template v-if="!item.isNull">
        <div class="left">
          <el-form-item label="次级标题：">
            <el-input v-model="item.tit" size="mini" class="inp"/>
          </el-form-item>
          <el-form-item label="段落内容：">
            <el-input type="textarea" v-model="item.txt" size="mini" class="textarea"/>
          </el-form-item>
        </div>
        <el-button icon="el-icon-minus" type="primary" size="mini" circle @click="_ => handleRemove(idx)"/>
      </template>
    </div>
    <div class="">
      <el-button type="primary" size="mini" @click="handleAdd">新增内容条目</el-button>
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
      const { title = '', theme = 1, list = [] } = this.data
      return {
        // 样式
        themes: [
          { value: 1, label: '标签' },
          { value: 2, label: '水滴' }
        ],
        // 样式
        theme,
        // 标题
        title,
        // 列表
        list
      }
    },
    methods: {
      // 添加模块
      handleAdd() {
        this.list.push({ tit: '', txt: '', isNull: false })
      },
      handleRemove(idx) {
        // 声明
        const { list } = this
        // 更新
        list[idx] = { isNull: true }
        // 更新
        this.list = [].concat(list)
      },
      // 删除模块
      handleClose() {
        this.$emit('remove')
      },
      // 获取表单数据
      getParams() {
        // 声明
        const { list, title, theme, data } = this
        return {
          ...data,
          theme,
          title,
          list: list.filter(({ isNull, tit, txt }) => !isNull || tit || txt)
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
    .tr {
      display: flex;
      align-items: center;
      .left {
        width: 300px;
      }
    }
  }
</style>
