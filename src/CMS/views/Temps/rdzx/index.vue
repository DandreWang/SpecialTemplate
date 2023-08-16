<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <PhoneModel title="热点资讯" class="rdzx">
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <div slot="append" class="btns">

            <el-form-item class="zxid" label="资讯Id:">
                <el-input v-model="zxid" size="small" placeholder="请输入资讯Id"/>
            </el-form-item>

            <el-form-item class="checkZxid">
              <el-button size="mini" type="primary" @click="checkZxid">确定</el-button>
            </el-form-item>

            <el-form-item label="按钮配置：" class="controlBtn">
                <el-button size="mini" type="primary" @click="addTab(editableTabsValue, tabIndex)">添加按钮</el-button>
            </el-form-item>

            <el-tabs v-if="tabIndex" v-model="editableTabsValue" type="card" closable class="btnTabs" @tab-remove="removeTab">
                <el-tab-pane
                v-for="(item, idx) in btnItems"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                >
                <el-form-item label="按钮图片：" class="btnImage">
                    <!-- light -->
                    <div class="light">
                      <el-upload
                      :auto-upload="false"
                      :limit="1"
                      :on-change="(file, fileList)=>{return handleLightChange(file, fileList, idx)}"
                      :on-exceed="(file, fileList)=>{return handleLightExceed(file, fileList, idx)}"
                      :action="''"
                      list-type="picture"
                      accept="image/*"
                      class="uploader"
                      :file-list="item.lightBg"
                      >
                      <el-button size="mini" type="primary" class="uploadLight">点击上传（白）</el-button>
                      <div slot="file" slot-scope="{file}">
                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                          <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                              <i class="el-icon-zoom-in" />
                          </span>
                          <span class="el-upload-list__item-preview" @click="handleRemoveLightBtn(file, idx)">
                              <i class="el-icon-delete" />
                          </span>
                          </span>
                      </div>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                      <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                  </div>
                  <!-- dark -->
                  <div class="dark">
                      <el-upload
                      :auto-upload="false"
                      :limit="1"
                      :on-change="(file, fileList)=>{return handleDarkChange(file, fileList, idx)}"
                      :on-exceed="(file, fileList)=>{return handleDarkExceed(file, fileList, idx)}"
                      :action="''"
                      list-type="picture"
                      accept="image/*"
                      class="uploader"
                      :file-list="item.darkBg"
                      >
                      <el-button size="mini" type="primary" class="uploadDark">点击上传（黑）</el-button>
                      <div slot="file" slot-scope="{file}">
                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                          <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                              <i class="el-icon-zoom-in" />
                          </span>
                          <span class="el-upload-list__item-preview" @click="handleRemoveDarkBtn(file, idx)">
                              <i class="el-icon-delete" />
                          </span>
                          </span>
                      </div>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                      <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                  </div>
                </el-form-item>
                
                <el-form-item label="按钮位置：" class="btns">
                    <el-select v-model="item.position" size="small" class="selectBox">
                    <el-option v-for="{ label, value } in positionOpt" :key="value" :label="label" :value="value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="按钮名称：" class="linkInp">
                    <el-input v-model="item.btnName" size="small" class="linkInp" />
                </el-form-item>
                
                <el-form-item label="主包按钮显示：" class="moneyBtn">
                    <el-select v-model="item.moneyShow" size="small" class="selectBox">
                    <el-option v-for="{ label, value } in moneyBtnOpt" :key="value" :label="label" :value="value" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="主包下载弹框：" class="type">
                    <el-select v-model="item.showPop" size="small" class="selectBox">
                    <el-option v-for="{ label, value } in popOpt" :key="value" :label="label" :value="value" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="弹框类型：" class="type">
                    <el-select v-model="item.popType" size="small" :disabled="!item.showPop" class="selectBox">
                    <el-option v-for="{ label, value } in popTypeOpt" :key="value" :label="label" :value="value" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="期货按钮显示：" class="futureBtn">
                    <el-select v-model="item.futureShow" size="small" class="selectBox">
                    <el-option v-for="{ label, value } in showBtnOpt" :key="value" :label="label" :value="value" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="期货按钮类型：" class="futureType">
                    <!-- :disabled="!(!item.moneyShow && item.futureShow)" -->
                    <el-select v-model="item.btnType" :disabled="!(!item.moneyShow && item.futureShow)" size="small" class="selectBox">
                    <el-option v-for="{ label, value } in futureBtnTypeOpt" :key="value" :label="label" :value="value" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="跳转链接：" class="linkInp">
                    <el-input v-model="item.link" size="small" :disabled="item.showPop || item.btnType !== 'all'" 
                    class="linkInp" placeholder="客服电话请输入 tel"/>
                </el-form-item>
                
                </el-tab-pane>
            </el-tabs>
        </div>
      </BaseForm>
    </template>
    <Html slot="phone" :theme="theme" :html="phoneHtml" :style="{width: 20+'vw'}"/>
  </PhoneModel>
</template>

<script>
  import http from '@/CMS/api'
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Html from '@/Page/views/rdzx/index'
  import { formConf, formItems, positionOpt, popOpt, popTypeOpt, showBtnOpt, moneyBtnOpt, futureBtnTypeOpt } from './data'
  import { Base64 } from 'js-base64'
  import utils from '@common/utils/crypto'
  const { nodeEncrypt } = utils

  // 按钮对象
  // tab标题 tab绑定值 背景 位置 对齐方式 跳转链接 按钮名称 是否显示弹框 弹框类型 是否在期货包显示按钮 是否在主包显示按钮 期货包内按钮类型
  const btnConf = _ => ({ 
    title: '按钮1', 
    name: '1', 
    lightBg: [], 
    darkBg: [], 
    bg: [], 
    position: '', 
    link: '', 
    btnName: '专题', 
    showPop: false, 
    popType: 'one', 
    futureShow: false, 
    moneyShow: true, 
    btnType: 'all' })

  export default {
    name: 'TempFormRdzx',
    components: { PhoneModel, BaseForm, Html },
    props: {
      initData: {
        type: Object
      },
      theme: String
    },
    data() {
      return {
        // 资讯id
        zxid: '',
        // 页面html数据
        phoneHtml: {},
        // 弹窗显示
        show: false,
        // 按钮id
        btnId: 0,
        // 表单配置
        formConf,
        // 表单项目
        formItems,
        // 按钮图片
        btnImgs: [],
        // 专题编号id
        id: '',
        // 按钮
        btnItems: [btnConf()],
        // 当前选中的按钮
        editableTabsValue: '1',
        // 按钮数
        tabIndex: 1,
        // 按钮位置选项
        positionOpt,
        // 按钮预览
        dialogVisible: false,
        // 弹框选项
        popOpt,
        // 弹框类型
        popTypeOpt,
        // 是否在期货显示按钮
        showBtnOpt,
        // 是否在主包显示按钮
        moneyBtnOpt,
        // 期货包内按钮类型
        futureBtnTypeOpt
      }
    },
    async mounted() {
      // 初始化表单数据
      this.init()
    },
    methods: {
      // 预览
      handlePreview() {
        this.getParams(params => { this.phoneHtml = params }, true)
      },
      // 初始化
      init() {
        const { zxid, btnItems = [btnConf()], id, pageName = '', ...formData } = this.initData
        this.btnItems = btnItems
        console.log('初始数据')
        console.log(this.initData)
        // 专题编号id
        this.id = id
        this.zxid = zxid

        if (!/\_/.test(btnItems[0].btnName) && id) {
          // 新建的空白模板初始按钮名称
          btnItems[0].btnName = `专题${id}_`
        } else if (pageName.indexOf('副本') !== -1) {
          // 复制模板第一个按钮id显示错误
          const name = btnItems[0].btnName.split('_')
          name[0] = `专题${id}`
          btnItems[0].btnName = name.join('_')
        }
        // 表单数据
        this.$refs.baseForm.setData({ formData })
        // if (this.bg.length) {
        if (this.zxid) {
          this.tabIndex = this.btnItems.length
          this.handlePreview()
        }
      },

      // 提交
      async getParams(cb, isPreview) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== "function") return
          // 声明
          const { btnItems, upload, id, zxid} = this
          // 按钮图片
          const lightImages = [], 
                darkImages = [], 
                lightIdxs = [],
                darkIdxs = []
          btnItems.forEach((item, idx) => {
            const { lightBg, darkBg } = item 
            if (lightBg.length && darkBg.length) {
              const { image: lightImage } = lightBg[0]
              const { image: darkImage } = darkBg[0]
              lightImage && /^data:/.test(lightImage) && (lightImages.push(lightImage), lightIdxs.push(idx))
              darkImage && /^data:/.test(darkImage) && (darkImages.push(darkImage), darkIdxs.push(idx))
            } else return
           })
          //  提交上传的图片
          if (lightImages.length && darkImages.length && !isPreview) {
            // 上传
            const lightImgUrls = await upload(lightImages)
            const darkImgUrls = await upload(darkImages)
            lightIdxs.forEach((idx, i) => {
               btnItems[idx].lightBg[0].url = `${http.getApi('list_imgBaseUrl')}${lightImgUrls[i].replace('/', '')}`
               btnItems[idx].lightBg[0].image = ''
            })
            darkIdxs.forEach((idx, i) => {
              btnItems[idx].darkBg[0].url = `${http.getApi('list_imgBaseUrl')}${darkImgUrls[i].replace('/', '')}`
              btnItems[idx].darkBg[0].image = ''
            })
          }

          // 生成计数短链
          const { getTracker } = this
          const btnRes = []
          for (const item of btnItems) {
            const { btnName, showPop, link } = item
            const tmp = btnName.split('_')
            const name = tmp.length === 1 ? tmp[0] : tmp.length === 2 ? tmp[1] : ''
            const str =  `专题${id}_${name}`
            let res = '', 
                downloadYes = '', 
                downloadNo = '', 
                downloadTotal = '',
                telYes = '',
                telNo = ''
            res = await getTracker(link === 'tel' ? `专题${id}_客服热线` : str)
            // 下载弹窗按钮短链生成
            if (showPop) {
              downloadYes = await getTracker(`专题${id}_download_yes`) // 下载弹窗 - 确认（未安装）
              downloadNo = await getTracker(`专题${id}_download_no`) // 下载弹窗 - 取消
              downloadTotal = await getTracker(`专题${id}_download_total yes`) // 下载弹窗 - 确认（总数）
            }
            // 客服电话弹窗按钮短链生成
            if (link === 'tel') {
              telYes = await getTracker(`专题${id}_tel_yes`) // 客服弹窗 - 呼叫
              telNo = await getTracker(`专题${id}_tel_no`) // 客服弹窗 - 取消
            }
            btnRes.push({ ...item, btnName: str, trackUrl: res, downloadYes, downloadNo, downloadTotal, telYes, telNo })
          }
          this.btnItems = btnRes
          
          // 回调
          cb({
            btnItems : btnRes,
            id,
            zxid
          })
        })
      },

      // 上传图片
      async upload(imgs) {
        // 转码
        const imgBlobs = imgs.map(img => {
          const [mime, str] = img.split(',')
          return new File([Base64.toUint8Array(str)], 'img.png', { type: mime.match(/:(.*?);/)[1] })
        })
        // 上传
        const imgUrls = await Promise.all(imgBlobs.map(imgBlob => {
          // 表单对象
          const formData = new FormData()
          // 添加
          formData.append('image', imgBlob)
          // 上传
          return http.request('list_uploadImg', formData, { cantCancel: true })
        }))
        // 格式化
        return imgUrls.map(res => res && res.data ? res.data.imageUrl : false).filter(i => i)
      },

      // 判断资讯id是否是合法18位
      checkZxid() {
        if (this.zxid.length === 18) {
          this.handlePreview()
        } else {
          alert('您输入的资讯id有误，请检查后重新输入。')
        }
      },

      // 添加按钮tab
      addTab(targetName, idx) {
        const { id } = this
        const newTabName = this.tabIndex < 1 ? '1' : ++idx + ''
        const tmp = [btnConf()]
        tmp[0]['title'] = `按钮${idx === 0 ? 1 : idx}`
        tmp[0]['name'] = newTabName
        tmp[0]['btnName'] = `专题${id || ''}_`
        this.btnItems.splice(idx + 1, 0, ...tmp)
        this.tabIndex++
        this.editableTabsValue = newTabName
        // this.handlePreview()
      },
      // 删除按钮tab
      removeTab(targetName) {
        const tabs = this.btnItems
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.btnItems = tabs.filter(tab => tab.name !== targetName)
        if (targetName - 0 < this.tabIndex) {
          const tmp = this.btnItems.map((item, idx) => {
            return {
              ...item,
              title: `按钮${idx + 1}`,
              name: idx < 1 ? '1' : ++idx + ''
            }
          })
          this.btnItems = tmp
          this.editableTabsValue = tmp.length + ''
        }
        this.tabIndex--
        this.handlePreview()
      },
      // 图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      // 关闭弹窗
      clear() {
        // 表单清空
        this.formItems = this.formItems.slice(0, 1)
        this.$refs.baseForm.$refs.form.resetFields()
      },
      // 设置子组件值
      setData(data) {
        const { formData } = data
      },

      // 按钮白色图片替换
      handleLightExceed(files, fileList, idx) {
        const [file] = files
        // 格式转换
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750 // rem
            // 更新替换
            this.btnItems[idx].lightBg = [{ name: file.name, url: URL.createObjectURL(file), image: res, width: image.width / dpr / 100, height: image.height / dpr / 100 }]
            this.handlePreview()
          }
          image.src = res
        }, false)
      },
      // 按钮黑色图片替换
      handleDarkExceed(files, fileList, idx) {
        const [file] = files
        // 格式转换
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750 // rem
            // 更新替换
            this.btnItems[idx].darkBg = [{ name: file.name, url: URL.createObjectURL(file), image: res, width: image.width / dpr / 100, height: image.height / dpr / 100 }]
            this.handlePreview()
          }
          image.src = res
        }, false)
      },

      // 按钮白色图片
      handleLightChange(file, fileList, idx) {
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file.raw)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750 // rem
            this.btnItems[idx].bg.push({ name: file.name, url: file.url, image: res, width: image.width / dpr / 100, height: image.height / dpr / 100, 'model': 'light' })
            this.btnItems[idx].lightBg.push({ name: file.name, url: file.url, image: res, width: image.width / dpr / 100, height: image.height / dpr / 100, 'model': 'light' })
            this.handlePreview()
          }
          image.src = res
        }, false)
      },
      // 按钮黑色图片
      handleDarkChange(file, fileList, idx) {
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file.raw)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750 // rem
            this.btnItems[idx].bg.push({ name: file.name, url: file.url, image: res, width: image.width / dpr / 100, height: image.height / dpr / 100, 'model': 'dark' })
            this.btnItems[idx].darkBg.push({ name: file.name, url: file.url, image: res, width: image.width / dpr / 100, height: image.height / dpr / 100, 'model': 'dark' })
            this.handlePreview()
          }
          image.src = res
        }, false)
      },
      // 删除白色图片
      handleRemoveLightBtn(file, idx) {
        this.btnItems[idx].lightBg = []
        this.handlePreview()
      },
      // 删除黑色图片
      handleRemoveDarkBtn(file, idx) {
        this.btnItems[idx].darkBg = []
        this.handlePreview()
      },

      // 生成按钮对应打点短链
      async getTracker(name) {
        const tokenTmp = localStorage.getItem('token')
        const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAK2IaLMengXdADXKwf469axbR+irOW3CwsfuyCwn8SO/iVpvFL498XAvcGLQB1qQtlmEN2Llv2zzq5qa8gNf7HEDPJJgzVaFV+RMdDn9PDBiV2jrY9UEuj5vh87I5u5hWcKLa9lwnO/H1gnaimIQdqVOG432B6i9qIsVx26N4sQIDAQAB'
        const token = nodeEncrypt(tokenTmp, publicKey)
        const { result, status } = await http.request('track_getTracker', { name, token })
        if (status === 0) {
          return result
        } else {
          return ''
        }
      }
    }
  }
</script>
