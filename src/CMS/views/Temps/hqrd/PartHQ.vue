<template>
  <section class="part">
    <el-form-item label="行情标题：">
      <el-input v-model="title" size="mini" placeholder="请输入行情标题" class="selectBox"/>
    </el-form-item>
    <div v-for="(item, idx) in list" :key="idx" class="tr">
      <template v-if="!item.isNull">
        <el-form-item :label="labels[item.type - 1]">
          <el-input v-if="item.type === 1" v-model="item.value" size="mini" class="inp"/>
          <el-input v-else-if="item.type === 2" type="textarea" v-model="item.value" size="mini" class="textarea"/>
          <Uploader
            v-else-if="item.type === 3"
            :ref="`uploaders`"
            :imgs="item.imgs"
            @change="imgs => onImgsChange(idx, imgs)"
          />
        </el-form-item>
        <el-button icon="el-icon-minus" type="primary" size="mini" circle @click="_ => handleRemove(idx)"/>
      </template>
    </div>
    <div class="">
      <el-button type="primary" size="mini" @click="handleAdd(1)">新增标题</el-button>
      <el-button type="primary" size="mini" @click="handleAdd(2)">新增描述</el-button>
      <el-button type="primary" size="mini" @click="handleAdd(3)">新增图片</el-button>
      <el-button type="danger" size="mini" @click="handleClose">删除区块</el-button>
    </div>
  </section>
</template>

<script>
  import Uploader from '../../Components/Uploader'

  export default {
    name: 'Part',
    components: { Uploader },
    props: {
      data: Object
    },
    data() {
      const { title = '', list = [] } = this.data
      return {
        // label
        labels: ['行情描述：', '二级描述：', '行情图片：'],
        // 标题
        title,
        // 列表
        list
      }
    },
    methods: {
      // 添加模块
      handleAdd(type) {
        this.list.push({ type, value: '', imgs: [] })
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
        const { list, title, data } = this
        return {
          ...data,
          title,
          list: list.filter(({ isNull, value, imgs }) => !isNull && (value || imgs.length))
        }
      },
      onImgsChange(idx, imgs) {
        this.list[idx] = {
          type: 3,
          imgs
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
