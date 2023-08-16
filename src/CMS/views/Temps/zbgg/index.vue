<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <!-- <PhoneModel title="主包广告" class="zbgg"> -->
  <PhoneModel class="zbgg">
    <template slot="form">
      <h3><strong>&nbsp;&nbsp;落地页配置：</strong></h3><br>
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <div slot="append" class="btns">
          <el-form-item label="落地页背景图片：" class="bg">
            <ImageUploader
              :images-arr="bg"
              @updateArr="updateBg(arguments)"
            />
          </el-form-item>
          <el-form-item label="按钮配置：">
            <el-button size="mini" type="primary" @click="addTab(editableTabsValue, tabIndex)">添加按钮</el-button>
          </el-form-item>
          <el-tabs
            v-if="tabIndex"
            v-model="editableTabsValue"
            type="card"
            closable
            class="btnTabs"
            @tab-remove="removeTab"
          >
            <el-tab-pane
              v-for="(item, idx) in btnItems"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <el-form-item label="按钮名称：" class="linkInp">
                <el-input v-model="item.btnName" size="small" class="linkInp" />
              </el-form-item>
              <el-form-item label="按钮图片：">
                <ImageUploader
                  :images-arr="btnItems[idx].bg"
                  :idx="idx"
                  @updateArr="updateBtnItems(arguments)"
                />
              </el-form-item>
              <el-form-item label="按钮背景：" class="btnBg">
                <ImageUploader
                  :images-arr="btnItems[idx].btnBg"
                  :idx="idx"
                  @updateArr="updateBtnBg(arguments)"
                />
              </el-form-item>
              <el-form-item label="固定位置：" class="btns">
                <el-select v-model="item.style" size="small" class="selectBox">
                  <el-option v-for="{ label, value } in btnOpt" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
              <el-form-item label="对齐方式：" class="btns">
                <el-select v-model="item.align" size="small" class="selectBox" :disabled="item.style.length">
                  <el-option v-for="{ label, value } in positionOpt" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
              <el-form-item label="期货APP外按钮显示：" class="moneyBtn">
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
              <el-form-item label="期货APP内按钮显示：" class="futureBtn">
                <el-select v-model="item.futureShow" size="small" class="selectBox">
                  <el-option v-for="{ label, value } in showBtnOpt" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
              <el-form-item label="用户类型：" class="type">
                <!-- @change="btnTypeChange(item)" -->
                <el-select
                  v-model="item.btnType"
                  :disabled="!(!item.moneyShow && item.futureShow)"
                  size="small"
                  class="selectBox"
                >
                  <el-option v-for="{ label, value } in futureBtnTypeOpt" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
              <el-form-item label="跳转页面类型：" class="type">
                <el-select
                  v-model="item.jumpType"
                  :disabled="!(!item.moneyShow && item.futureShow)"
                  size="small"
                  class="selectBox"
                  @change="jumpTypeChange(item)"
                >
                  <el-option v-for="{ label, value } in jumpTypeOpt" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
              <el-form-item label="链接类型：" class="type">
                <el-select
                  v-model="item.linkType"
                  :disabled="item.jumpType && item.jumpType !== 'other' || item.moneyShow && !item.futureShow"
                  size="small"
                  class="selectBox"
                >
                  <el-option v-for="{ label, value } in linkTypeOpt" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
              <el-form-item label="是否区分安卓IOS：" class="splitSwitch">
                <el-switch v-model="item.ifSplit" />
              </el-form-item><br>
              <el-form-item v-show="!item.ifSplit" label="跳转链接：" class="linkInp">
                <el-input
                  v-model="item.link"
                  size="small"
                  :disabled="item.showPop || item.jumpType && item.jumpType !== 'other' && !item.moneyShow && item.futureShow"
                  class="linkInp"
                  placeholder="客服电话请输入 tel"
                />
              </el-form-item>
              <el-form-item v-show="item.ifSplit" label="IOS跳转链接：" class="linkInp">
                <el-input
                  v-model="item.iosLink"
                  size="small"
                  :disabled="item.showPop || item.jumpType && item.jumpType !== 'other'"
                  class="linkInp"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item v-show="item.ifSplit" label="安卓跳转链接：" class="linkInp">
                <el-input
                  v-model="item.adrLink"
                  size="small"
                  :disabled="item.showPop || item.jumpType && item.jumpType !== 'other'"
                  class="linkInp"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </div>
      </BaseForm>
    </template>
    <br><br>
    <!-- 挽留弹窗 -->
    <template slot="form">
      <BaseForm
        ref="baseForm"
        :form-options="formConf"
        :form-items="formItems"
      >
        <div slot="append" class="remainPopup">
          <el-form-item label="是否配置挽留弹窗：" class="popupTitle">
            <el-switch v-model="ifPopup" @change="handlePreview()" />
            <el-button size="mini" type="primary" @click="handleStayPreview">预览挽留弹窗</el-button>
          </el-form-item><br>

          <div v-show="ifPopup" class="popupOpt">
            <el-form-item v-if="false" label="链接用于：" class="popupLinkFor">
              <el-select v-model="linkFor" size="small" class="selectBox" @change="handlePreview()">
                <el-option v-for="{ label, value } in linkForOpt" :key="value" :label="label" :value="value" />
              </el-select>
            </el-form-item><br>

            <el-form-item label="用户类型：" class="popupUserType">
              <el-select v-model="userType" size="small" class="selectBox" @change="handlePreview()">
                <el-option v-for="{ label, value } in userTypeOpt" :key="value" :label="label" :value="value" />
              </el-select>
            </el-form-item><br>

            <el-form-item label="展示频率：" class="popupFrequency">
              <el-select v-model="frequency" size="small" class="selectBox" @change="handlePreview()">
                <el-option v-for="{ label, value } in frequencyOpt" :key="value" :label="label" :value="value" />
              </el-select>
            </el-form-item><br>

            <el-form-item label="挽留弹窗背景图片：" class="popupBg">
              <ImageUploader
                :images-arr="popupBg"
                @updateArr="updatePopupBg(arguments)"
              />
            </el-form-item>

            <el-form-item label="按钮图片：">
              <ImageUploader
                :images-arr="popupBtnItems[0].popupBg"
                :idx="0"
                @updateArr="updatePopupBtnItems(arguments)"
              />
            </el-form-item>
            <el-form-item label="跳转页面类型：" class="skipTo">
              <el-select v-model="popupBtnItems[0].skipTo" size="small" class="selectBox" @change="handleSkipChange(popupBtnItems[0])">
                <el-option v-for="{ label, value } in popupBtnOpts.skipTo" :key="value" :label="label" :value="value" />
              </el-select>
            </el-form-item><br>
            <el-form-item label="链接类型：" class="skipTo">
              <el-select v-model="popupBtnItems[0].linkType" size="small" class="selectBox" :disabled="popupBtnItems[0].skipTo!=='others'">
                <el-option v-for="{ label, value } in linkTypeOpt" :key="value" :label="label" :value="value" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否区分安卓IOS：" class="splitSwitch">
              <el-switch v-model="popupBtnItems[0].ifPopSplit" />
            </el-form-item><br>
            <el-form-item v-show="!popupBtnItems[0].ifPopSplit" label="跳转链接：" class="linkInp">
              <el-input v-model="popupBtnItems[0].link" class="linkInp" size="small" placeholder="请输入" :disabled="popupBtnItems[0].skipTo!=='others'" />
            </el-form-item>
            <el-form-item v-show="popupBtnItems[0].ifPopSplit" label="IOS跳转链接：" class="linkInp">
              <el-input v-model="popupBtnItems[0].iosLink" class="linkInp" size="small" placeholder="请输入" :disabled="popupBtnItems[0].skipTo!=='others'" />
            </el-form-item>
            <el-form-item v-show="popupBtnItems[0].ifPopSplit" label="安卓跳转链接：" class="linkInp">
              <el-input v-model="popupBtnItems[0].adrLink" class="linkInp" size="small" placeholder="请输入" :disabled="popupBtnItems[0].skipTo!=='others'" />
            </el-form-item>
          </div>
        </div>
      </BaseForm>
    </template>
    <Html slot="phone" ref="phone" :html="phoneHtml" @leftChange="getPositionX(arguments)" @topChange="getPositionY(arguments)" />
  </PhoneModel>
</template>

<script>
  import http from '@/CMS/api'
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Html from '@/Page/views/zbgg/index'
  import ImageUploader from '../../Components/ImageUploader'
  import {
    // 落地页配置
    formConf,
    formItems,
    btnOpt,
    popOpt,
    popTypeOpt,
    linkTypeOpt,
    showBtnOpt,
    moneyBtnOpt,
    futureBtnTypeOpt,
    jumpTypeOpt,
    positionOpt,
    // 挽留弹窗配置
    linkForOpt,
    userTypeOpt,
    frequencyOpt,
    popupBtnOpts
  } from './data'
  import { Base64 } from 'js-base64'
  import utils from '@common/utils/crypto'

  const { nodeEncrypt } = utils

  // 按钮配置对象
  const btnConf = _ => ({
    // tab标题
    title: '按钮1',
    // tab绑定值
    name: '1',
    // 按钮图片
    bg: [],
    // 按钮背景
    btnBg: [],
    // 位置
    style: '',
    // 对齐方式
    align: '',
    // 链接类型
    linkType: 'h5',
    // 链接是否区分安卓和ios
    ifSplit: false,
    // 跳转链接
    link: '',
    // ios链接
    iosLink: '',
    // 安卓链接
    adrLink: '',
    // 按钮名称
    btnName: '专题',
    // 是否显示弹框
    showPop: false,
    // 弹框类型
    popType: 'one',
    // 是否在期货包显示按钮
    futureShow: false,
    // 是否在主包显示按钮
    moneyShow: true,
    // 用户类型
    btnType: 'all',
    // 跳转页面类型
    jumpType: 'other',
    // 按钮拖动x位置
    positionX: null,
    // 按钮拖动y位置
    positionY: null,
    // qs计数短链
    // 取消下载
    downloadNo: '',
    // 下载弹窗显示
    downloadTotal: '',
    // 确认下载
    downloadYes: '',
    // 拨打客服电话
    telYes: '',
    // 取消拨打
    telNo: '',
    // 点击跳转按钮
    trackUrl: ''
  })

  // 挽留弹窗按钮配置对象
  const popupBtnConf = _ => ({
    // tab标题
    title: '按钮',
    // tab绑定值
    name: '1',
    // 按钮名称
    btnName: `专题`,
    // 背景
    popupBg: [],
    // 对齐方式
    align: '',
    // 跳转页面类型
    skipTo: '',
    // // 下载方式
    // download: '',
    // 链接类型
    linkType: 'h5',
    // 链接是否区分ios和安卓
    ifPopSplit: false,
    // 跳转链接
    link: '',
    // ios跳转链接
    iosLink: '',
    // 安卓跳转链接
    adrLink: '',
    // qs计数短链
    // 主包跳转期货app
    popup_futures: '',
    // 主包跳转应用商店
    popup_appStore: '',
    // 期货跳转交易首页
    popup_trade: '',
    // 期货跳转开户页
    popup_account: '',
    // 期货跳转开户云
    popup_cloud: '',
    // 期货跳转自定义
    popup_others: '',
    // 点击挽留弹窗按钮总次数
    popup_total: ''
  })

  export default {
    name: 'TempFormZbgg',
    components: { PhoneModel, BaseForm, Html, ImageUploader },
    props: {
      initData: {
        type: Object
      }
    },
    data() {
      return {
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
        // 背景
        bg: [],
        // 按钮图片
        btnImgs: [],
        // 专题id
        id: '',
        // 按钮
        btnItems: [btnConf()],
        // // 链接是否区分安卓和ios
        // ifSplit: false,
        // 选中的按钮
        editableTabsValue: '1',
        // 按钮数
        tabIndex: 1,
        // 按钮选项
        btnOpt,
        // 按钮对齐方式
        positionOpt,
        // 按钮预览
        dialogVisible: false,
        // 弹框选项
        popOpt,
        // 弹框类型
        popTypeOpt,
        // 按钮链接类型
        linkTypeOpt,
        // 是否在期货显示按钮
        showBtnOpt,
        // 是否在主包显示按钮
        moneyBtnOpt,
        // 用户类型 // 期货包内按钮类型
        futureBtnTypeOpt,
        // 跳转页面类型
        jumpTypeOpt,
        // 是否展示挽留弹窗
        ifPopup: false,
        // 链接用于选项
        linkForOpt,
        // 用户类型选项
        userTypeOpt,
        // 展示频率选项
        frequencyOpt,
        // 链接用于
        linkFor: '2',
        // // 挽留弹窗链接是否区分安卓和ios
        // ifPopSplit: false,
        // 用户类型
        userType: '',
        // 展示频率
        frequency: '',
        // 挽留弹窗背景图片
        popupBg: [],
        // 按钮对象（含 对齐方式 跳转页面 下载方式）
        popupBtnOpts,
        // 挽留弹窗按钮
        popupBtnItems: [popupBtnConf()],
        // 挽留弹窗选中的按钮
        editablePopupTabsValue: '1',
        // 挽留弹窗按钮数
        popupTabIndex: 1,
        // 挽留弹窗曝光计数
        popup_yes: '',
        // 挽留弹窗关闭计数
        popup_no: '',

        // 归因统计 链接用于
        trackLinkFor: null,
        // 归因统计 广告投放位置
        adPosition: []

      }
    },
    async mounted() {
      // 初始化表单数据
      this.init()
    },

    methods: {
      // 跳转页面类型变化，不为其他时清空跳转链接
      jumpTypeChange(item) {
        const { jumpType } = item
        if (jumpType !== 'other') {
          item.link = ''
          item.iosLink = ''
          item.adrLink = ''
        }
      },

      // 挽留弹窗跳转页面类型变化
      handleSkipChange(item) {
        const { skipTo } = item
        if (skipTo !== 'others') {
          item.link = ''
          item.iosLink = ''
          item.adrLink = ''
        }
      },

      // 预览
      handlePreview() {
        this.getParams(params => {
          this.phoneHtml = params
        }, true)
      },
      // 预览挽留弹窗
      handleStayPreview() {
        this.$refs.phone.$refs.stayPopup.showFlg = true
      },
      // 初始化
      init() {
        const { btnItems = [btnConf()],
                bg = [],
                id,
                pageName = '',
                ifPopup = false,
                popupBg = [],
                linkFor = '',
                userType = '',
                frequency = '',
                trackLinkFor = null,
                adPosition = [],
                popupBtnItems = [popupBtnConf()],
                popup_yes = '',
                popup_no = '',
                ...formData } = this.initData
        console.log('初始数据')
        console.log(this.initData)
        console.log('模板id：', id)
        Object.assign(this, { btnItems, id, bg, ifPopup, linkFor, userType, frequency, popupBg, popupBtnItems, trackLinkFor, adPosition, popup_yes, popup_no })
        if (!/\_/.test(btnItems[0].btnName) && id) {
          // 新建的空白模板初始按钮名称
          btnItems[0].btnName = `专题${id}_`
        } else if (pageName.indexOf('副本') !== -1) {
          // 复制模板第一个按钮id显示错误
          const name = btnItems[0].btnName.split('_')
          name[0] = `专题${id}`
          btnItems[0].btnName = name.join('_')
        }

        // 旧模板按钮背景图初始化
        this.btnItems = btnItems.map(item => {
          return {
            ...item,
            btnBg: item.btnBg ? item.btnBg : []
          }
        })

        // 表单数据
        this.$refs.baseForm.setData({ formData })
        if (this.bg.length) {
          this.tabIndex = this.btnItems.length
          this.handlePreview()
        }

        if (this.popupBg.length) {
          this.popupTabIndex = this.popupBg.length
          this.handlePreview()
        }
      },
      // 提交
      async getParams(cb, isPreview) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 声明
          const { btnItems, upload, bg, id, popupBg, ifPopup, linkFor, userType, frequency, popupBtnItems, trackLinkFor, adPosition } = this
          let { popup_yes, popup_no } = this

          const fileResult = bg.length ? bg[0].image : ''
          const popupFileResult = popupBg.length ? popupBg[0].image : ''
          // 按钮图片
          const images = []
          const idxs = []
          btnItems.forEach((item, idx) => {
            const { bg } = item
            if (bg.length) {
              const { image } = bg[0]
              image && /^data:/.test(image) && (images.push(image), idxs.push(idx))
            } else return
          })
          // 按钮背景图片
          const btnBgImages = []
          const bgIdxs = []
          btnItems.forEach((item, idx) => {
            const { btnBg } = item
            if (btnBg.length) {
              const { image } = btnBg[0]
              image && /^data:/.test(image) && (btnBgImages.push(image), bgIdxs.push(idx))
            } else return
          })

          // 挽留弹窗按钮图片
          const popupImages = []
          const popupidxs = []
          popupBtnItems.forEach((item, idx) => {
            const { popupBg } = item
            if (popupBg.length) {
              const { image } = popupBg[0]
              image && /^data:/.test(image) && (popupImages.push(image), popupidxs.push(idx))
            } else return
          })

          // 提交未上传图片
          if (fileResult && !isPreview) {
            const imgUrl = await upload([fileResult])
            bg[0].url = `${http.getApi('list_imgBaseUrl')}${imgUrl[0].replace('/', '')}`
            bg[0].image = ''
          }

          if (ifPopup && popupFileResult && !isPreview) {
            const imgUrl = await upload([popupFileResult])
            popupBg[0].url = `${http.getApi('list_imgBaseUrl')}${imgUrl[0].replace('/', '')}`
            popupBg[0].image = ''
          }

          // 按钮图片上传
          if (images.length && !isPreview) {
            // 上传
            const imgUrls = await upload(images)
            // 替换base64
            idxs.forEach((idx, i) => {
              btnItems[idx].bg[0].url = `${http.getApi('list_imgBaseUrl')}${imgUrls[i].replace('/', '')}`
              btnItems[idx].bg[0].image = ''
            })
          }
          // 按钮背景图上传
          if (btnBgImages.length && !isPreview) {
            // 上传
            const imageUrls = await upload(btnBgImages)
            // 替换base64
            bgIdxs.forEach((idx, i) => {
              btnItems[idx].btnBg[0].url = `${http.getApi('list_imgBaseUrl')}${imageUrls[i].replace('/', '')}`
              btnItems[idx].btnBg[0].image = ''
            })
          }

          // 挽留弹窗按钮上传
          if (popupImages.length && !isPreview) {
            const popupImgUrls = await upload(popupImages)
            popupidxs.forEach((idx, i) => {
              popupBtnItems[idx].popupBg[0].url = `${http.getApi('list_imgBaseUrl')}${popupImgUrls[i].replace('/', '')}`
              popupBtnItems[idx].popupBg[0].image = ''
            })
          }
          // 生成计数短链
          const { getTracker } = this
          const btnRes = []
          for (const item of btnItems) {
            const { btnName, showPop, link } = item
            const tmp = btnName.split('_')
            const name = tmp.length === 1 ? tmp[0] : tmp.length === 2 ? tmp[1] : ''
            const str = `专题${id}_${name}`

            if (!isPreview) {
              item.trackUrl = await getTracker(link === 'tel' ? `专题${id}_客服热线` : str)
            }
            // 下载弹窗按钮短链生成
            if (showPop && !isPreview) {
              item.downloadYes = await getTracker(`专题${id}_download_yes`) // 下载弹窗 - 确认（未安装）
              item.downloadNo = await getTracker(`专题${id}_download_no`) // 下载弹窗 - 取消
              item.downloadTotal = await getTracker(`专题${id}_download_total yes`) // 下载弹窗 - 确认（总数）
            }
            // 客服电话弹窗按钮短链生成
            if (link === 'tel' && !isPreview) {
              item.telYes = await getTracker(`专题${id}_tel_yes`) // 客服弹窗 - 呼叫
              item.telNo = await getTracker(`专题${id}_tel_no`) // 客服弹窗 - 取消
            }
            btnRes.push({ ...item, btnName: str })
          }
          this.btnItems = btnRes

          // 挽留弹窗计数
          // let popup_yes = ''
          // let popup_no = ''
          if (ifPopup && !isPreview) {
            popup_yes = await getTracker(`专题${id}_挽留弹窗_曝光`) // 出现挽留弹窗的次数
            popup_no = await getTracker(`专题${id}_挽留弹窗_关闭`) // 关闭弹窗
          }
          const popupBtnRes = []
          for (const item of popupBtnItems) {
            const { download, skipTo } = item
            // const popup_total = ''
            // // popup_total = await getTracker(`专题${id}_挽留弹窗_跳转（总）`)       // 点击挽留弹窗按钮总次数
            if (linkFor === '1' && !isPreview) {
              if (download === 'one') {
                item.popup_futures = await getTracker(`专题${id}_挽留弹窗_跳转期货App`) // 主包跳转期货App
              } else if (download === 'two') {
                item.popup_appStore = await getTracker(`专题${id}_挽留弹窗_跳转应用商店`) // 主包跳转应用商店
              }
            } else if (linkFor === '2' && !isPreview) {
              if (skipTo === 'trade') {
                item.popup_trade = await getTracker(`专题${id}_挽留弹窗_交易`) // 期货跳转交易
              } else if (skipTo === 'account') {
                item.popup_account = await getTracker(`专题${id}_挽留弹窗_开户`) // 期货跳转开户
              } else if (skipTo === 'others') {
                item.popup_others = await getTracker(`专题${id}_挽留弹窗_其他`) // 期货跳转其他
              } else if (skipTo === 'cloud') {
                item.popup_cloud = await getTracker(`专题${id}_挽留弹窗_开户云`) // 期货跳转开户云
              }
            }
            popupBtnRes.push({ ...item })
          }
          this.popupBtnItems = popupBtnRes
          // 回调
          cb({
            bg, id, btnItems: btnRes,
            ifPopup, popupBg, linkFor,
            userType, frequency, popupBtnItems: popupBtnRes,
            popup_yes, popup_no,
            trackLinkFor, adPosition
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
        return imgUrls.reduce((list, item) => {
          item && item.data && item.data.imageUrl && list.push(item.data.imageUrl)
          return list
        }, [])
      },
      // 添加按钮tab
      addTab(targetName, idx) {
        const { id } = this
        const newTabName = this.tabIndex < 1 ? '1' : ++idx + ''
        const tmp = [btnConf()]
        tmp[0]['title'] = `按钮${idx === 0 ? 1 : idx}`
        tmp[0]['name'] = newTabName
        tmp[0]['btnName'] = `专题${id || ''}_`
        // debugger
        this.btnItems.splice(idx + 1, 0, ...tmp)
        this.tabIndex++
        this.editableTabsValue = newTabName
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
          const tmp = this.btnItems.map((item, idx) => ({
            ...item,
            title: `按钮${idx + 1}`,
            name: idx < 1 ? '1' : ++idx + ''
          }))
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
      // 获取拖动图片位置
      getPositionX(val) {
        const [id, x] = val
        this.btnItems = this.btnItems.map((item = {}, idx) => {
          const { style } = item
          // 更新
          return Object.assign({}, item, idx === Number(id) && !style ? { positionX: x } : null)
        })
      },
      getPositionY(val) {
        // const id = val[0] - 0
        // const y = val[1]
        const [id, y, yVal] = val
        this.btnItems = this.btnItems.map((item = {}, idx) => {
          const { style } = item
          // 更新
          return Object.assign({}, item, idx === Number(id) && !style ? {
            positionY: y, posYVal: yVal
          } : null)
        })
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

      // 同步背景
      updateBg(data) {
        this.bg = data[0]
        this.handlePreview()
      },
      // 同步挽留弹窗背景
      updatePopupBg(data) {
        this.popupBg = data[0]
        this.handlePreview()
      },
      // 同步按钮图片背景
      updateBtnItems(data) {
        this.btnItems[data[1]].bg = data[0]
        this.handlePreview()
      },
      // 同步按钮背景
      updateBtnBg(data) {
        this.btnItems[data[1]].btnBg = data[0]
        this.handlePreview()
      },
      // 同步挽留弹窗按钮图片背景
      updatePopupBtnItems(data) {
        this.popupBtnItems[data[1]].popupBg = data[0]
        this.handlePreview()
      },

      // 生成按钮对应打点短链
      async getTracker(name) {
        const tokenTmp = localStorage.getItem('token')
        if (!tokenTmp) return ''
        const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAK2IaLMengXdADXKwf469axbR+irOW3CwsfuyCwn8SO/iVpvFL498XAvcGLQB1qQtlmEN2Llv2zzq5qa8gNf7HEDPJJgzVaFV+RMdDn9PDBiV2jrY9UEuj5vh87I5u5hWcKLa9lwnO/H1gnaimIQdqVOG432B6i9qIsVx26N4sQIDAQAB'
        const token = nodeEncrypt(tokenTmp, publicKey)
        const { result, status } = await http.request('track_getTracker', { name, token }) || {}
        if (status === 0) {
          return result
        } else {
          return ''
        }
      }
    }
  }
</script>
