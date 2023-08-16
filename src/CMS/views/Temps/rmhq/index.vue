<style lang="scss" scoped>
  @import "index";
</style>
<template>
  <PhoneModel title="热门行情" class="rmhq">
    <template slot="form">
      <div class="box">
        <BaseForm
          ref="baseForm"
          :form-options="formConf"
          :form-items="formItems"
        >
          <template slot="insertBefore">
            <!-- <el-form-item label="适用类型：" :rules="[{required:true}]">
              <el-select
                v-model="envOpts.envType"
                size="small" style="width:100px">
                <el-option :value="0" label="主包"></el-option>
                <el-option :value="1" label="期货APP"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="(envOpts.envType&& i>1)||(!envOpts.envType && i<2)"
              v-for="(t,i) in envOpts.opts" :key="i" :label="t.label" label-width="122px">
              <el-radio-group v-model="envOpts.values[envOpts.keys[i]]"
                style="width:125px">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label='按钮名称：'>专题{{initData.tracker&&initData.tracker.tempId}}_*</el-form-item> -->
            <div ref="btnOpts">
              <el-form-item v-for="(btnLabel, idx) in btnLabels" :key="idx"
                :label="idx==0?'界面按钮：':idx==3?' ':''" >
                <Upload :title="btnLabel" :img="btnOpts[idx] && btnOpts[idx].image" @change="btnOpts[idx].image=$event"/>
              </el-form-item>
            </div>
          </template>
          <template slot="append">
            <div v-for="(item, idx) in hqList" :key="`hq${idx}`" class="tr">
              <el-form-item label="归属市场：">
                <el-select
                  v-model="item.market"
                  size="small"
                  class="selectBox"
                  @change="id => handleChangeMkt(id, idx)">
                  <el-option v-for="{ mktid, mktname } in markets" :key="mktid" :label="mktname" :value="mktid"/>
                </el-select>
              </el-form-item>
              <el-form-item label="合约品种：">
                <el-select v-if="item.isgn" v-model="item.code" size="small" class="codeBox">
                  <el-option v-for="{ vcode, vname } in item.contract" :key="vcode" :label="vname" :value="vcode"/>
                </el-select>
                <el-input v-else v-model="item.code" size="small" placeholder="请输入合约品种" class="codeBox"/>
              </el-form-item>
              <el-form-item v-if="item.isgn" label="资讯数量：">
                <el-input-number v-model="item.num" size="small" :min="0" class="numBox"/>
              </el-form-item>
              <el-button icon="el-icon-plus" type="primary" size="mini" circle @click="_ => handleAdd(idx)"/>
              <el-button
                v-show="hqList.length > 1"
                icon="el-icon-minus"
                type="primary"
                size="mini"
                circle
                @click="_ => handleRemove(idx)"
              />
            </div>
            <div v-for="(item, idx) in zxList" :key="`zx${idx}`" class="tr">
              <el-form-item label="配置资讯：">
                <el-input v-model="item.title" size="small" placeholder="请输入资讯标题" class=""/>
              </el-form-item>
              <el-form-item label="资讯链接：">
                <el-input v-model="item.url" size="small" placeholder="请输入资讯链接" class=""/>
              </el-form-item>
              <el-form-item label="资讯ID：">
                <el-input v-model="item.code" size="small" placeholder="请输入资讯链接" class=""/>
              </el-form-item>
              <el-form-item label="资讯类型：">
                <el-input v-model="item.infoType" size="small" placeholder="请输入资讯链接" class=""/>
              </el-form-item>
              <el-button icon="el-icon-plus" type="primary" size="mini" circle @click="_ => handleAddZX(idx)"/>
              <el-button
                v-show="zxList.length > 1"
                icon="el-icon-minus"
                type="primary"
                size="mini"
                circle
                @click="_ => handleRemoveZX(idx)"
              />
            </div>
          </template>
        </BaseForm>
        <QuillDIY ref="quill"/>
      </div>
    </template>
    <Html slot="phone" :html="phoneHtml" :envType="envOpts.envType"/>
  </PhoneModel>
</template>

<script>
  import http from '@/CMS/api'
  import { Base64 } from 'js-base64'
  import { staticReq } from '@/CMS/api/hqReq'
  import PhoneModel from '../../Components/PhoneModel'
  import BaseForm from '../../Components/BaseForm'
  import Upload from './upload'
  import QuillDIY from '../../Components/QuillDIY'
  import Html from '@/Page/views/rmhq/index'
  import { formConf, formItems } from './data'
  import REGS from '@common/utils/validate'
  import utils from '@common/utils/crypto'
  const { nodeEncrypt } = utils
  // 国内商所
  const { domesticMarketCodes } = REGS.VALIDATE_REGS
  // 行情对象
  const hqConf = _ => ({ market: '', isgn: 0, code: '', num: 0, contract: [] })
  const zxConf = _ => ({ url: '', title: '', code: '', infoType: '' })

  export default {
    name: 'TempFormHqbb',
    components: { PhoneModel, BaseForm, Html, QuillDIY, Upload },
    props: {
      initData: {
        type: Object
      }
    },
    data() {
      return {
        phoneHtml: {},
        hqList: [hqConf()],
        zxList: [zxConf()],
        id: '',
        // 主包显隐
        envOpts: {
          // 0主包 1期货预览
          envType: 1,
          keys: ['mainFeatsHide','mainChooseHide', 'qhFeatsHide', 'qhChooseHide'],
          // 默认不隐藏
          values: { mainFeatsHide: 0, mainChooseHide:0, qhFeatsHide:0, qhChooseHide:0 },
          opts: ['期货交易特点','选期货','期货交易特点','选期货'].map((t,i)=>({ value:0, label:t,}))
        },
        // 下载、开户、交易黑白皮按钮
        btnOpts: [],
        btnLabels: ['下载按钮图片', '开户按钮图片', '交易按钮图片','下载按钮黑色','开户按钮黑色','交易按钮黑色'],
        // 缓存
        gwCache: {},
        // 表单加载
        loading: false,
        // 弹窗显示
        show: false,
        // 市场
        markets: [],
        // 标题品种
        mainCls: '',
        mainClsId: '',
        // 表单配置
        formConf,
        // 表单项目
        formItems,
        // 打点
        tracker: null
      }
    },
    created () {
      this.formatBtns()
    },
    async mounted() {
      // 获取期货市场数据
      await this.getMarkets()
      // 初始化表单数据
      this.init()
    },
    computed: {
      // 选中行
      selectedCls() {
        // 声明
        const uids = []
        // 下拉列表
        this.hqList.forEach(({ code, market, contract, isgn }) => {
          // 空值过滤
          if (!code || !code.length) return
          // 国内
          const nid = `${market}|${code}`
          // 防止重复添加
          uids.every(({ id }) => id !== nid) && uids.push({
            label: contract.length ? contract.filter(({ vcode }) => vcode === code)[0].vname : code,
            isgn,
            id: nid
          })
        })
        // 更新
        return uids
      },
    },
    watch: {
      selectedCls(n) {
        // 是否被清空
        const { mainCls } = this
        // 更新
        mainCls && n.every(({ id }) => id !== mainCls) && (this.mainCls = '')
      },
    },
    methods: {
      // 下载 开户 交易黑白皮按钮
      formatBtns() {
        this.btnOpts = [
          { key: 'download', image: ''},
          { key: 'openAccount', image: ''},
          { key: 'trade', image: ''},
          { key: 'download_bk', image: ''},
          { key: 'openAccount_bk', image: ''},
          { key: 'trade_bk', image: ''},
        ]
      },
      // 获取期货市场数据
      async getMarkets() {
        const [gn, gw] = await Promise.all([
          // seeReq.request('main/103', { orderBy: 'zdf', sort: 'asc', pageSize: 999, pageIndex: 0, callbackName: '' }),
          staticReq.request('redis', { msgid: 'gn' }, { cantCancel: true }),
          staticReq.request('redis', { msgid: 'gw' }, { cantCancel: true })
        ])
        // 格式化
        this.markets = [].concat(gn, gw)
      },
      // init
      init() {
        // 声明
        const { hqList = [hqConf()], zxList = [zxConf()], fwb = {}, mainCls, mainClsId, id, tracker, ...formData } = this.initData
        // 赋值
        Object.assign(this, { id,tracker, hqList: hqList.length ? hqList : [hqConf()], mainCls, zxList: zxList.length ? zxList : [zxConf()] })
        // 富文本
        this.$refs.quill.setDeltas(fwb)
        // 缓存
        this.gwCache[mainCls] = mainClsId
        // 表单数据
        this.$refs.baseForm.setData({ formData })

        this.envOpts.values = this.envOpts.keys.reduce((target, key, i)=> {
          target[key] = formData[key]||0
          return target
        }, {})
        // 按钮
        if (Array.isArray(formData.btnOpts)) {
          this.btnOpts = formData.btnOpts
        }
      },
      // 打点位置固定
      async initTracker() {
        const { id, getTracker } = this
        if (!id) return Promise.resolve();
        const downloadTracker = {
          // downloadYes: await getTracker(`专题${id}_download_yes`), // 下载弹窗 - 确认（未安装）
          // downloadNo: await getTracker(`专题${id}_download_no`), // 下载弹窗 - 取消
          downloadTotal: await getTracker(`专题${id}_下载（总）`), // 下载弹窗 - 确认（总数
          downloadFuture: await getTracker(`专题${id}_下载_跳转期货APP`), // 下载弹窗 - 确认（总数
          downloadStore: await getTracker(`专题${id}_下载_跳转应用商店`), // 下载弹窗 - 确认（总数
        }
        const openAccountTrack = {
          openAccount: await getTracker(`专题${id}_开户`)
        }
        const tradeTracker = {
          trade: await getTracker(`专题${id}_交易`)
        }
        const phoneTracker = {
          tel: await getTracker(`专题${id}_客服热线_期货APP`), // 客服弹窗 - 呼叫
          telYes: await getTracker(`专题${id}_tel_yes`), // 客服弹窗 - 呼叫
          telNo: await getTracker(`专题${id}_tel_no`) // 客服弹窗 - 取消
        }
        this.tracker = {
          ...phoneTracker,
          ...downloadTracker,
          ...openAccountTrack,
          ...tradeTracker,
          tempId: `${id}`,
        }
        return Promise.resolve()
      },
      // 切换市场
      async handleChangeMkt(mktId, idx) {
        // 是否为国内
        const isgn = domesticMarketCodes.test(`${mktId}|`)
        // 更新
        Object.assign(this.hqList[idx], {
          code: isgn ? [] : '',
          isgn
        })
        // 国内不加载合约
        if (!isgn) return
        // 主力合约
        const list = await staticReq.request('redis', { msgid: mktId })
        // 品种
        this.hqList[idx].contract = list
      },
      // 新增
      handleAdd(idx) {
        this.hqList.splice(idx + 1, 0, hqConf())
      },
      // 删除
      handleRemove(idx) {
        this.hqList.splice(idx, 1)
      },
      handleAddZX(idx) {
        this.zxList.splice(idx + 1, 0, zxConf())
      },
      // 删除
      handleRemoveZX(idx) {
        this.zxList.splice(idx, 1)
      },
      // 预览
      handlePreview() {
        this.getParams(params => {
          this.phoneHtml = params
        }, 'preview')
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
      // 获取按钮图片
      handleBtnOpts() {
        let idx =[]
        let imgs = []
        const { btnOpts, } = this
        btnOpts.map((t,i)=>{
          const image = t.image
          if (/^data:/.test(image)) {
            idx.push(i)
            imgs.push(image)
          }
        })
        return new Promise(async resolve=> {
          if (!imgs.length) return resolve()
          const res = await this.upload(imgs)

          res.map(async (t,i)=> {
            this.btnOpts[idx[i]].image = `${http.getApi('list_imgBaseUrl')}${t.replace('/', '')}`
          })
          return resolve()
        })
      },
      // 提交
      async getParams(cb, isPreview) {
        this.$refs.baseForm.getFormVal(async baseFormData => {
          // 未通过
          if (!baseFormData || typeof cb !== 'function') return
          // 声明
          const { hqList, zxList, gwCache, mainCls, selectedCls, $refs,
            envOpts: {values},btnOpts, handleBtnOpts, tracker, id, } = this

          // 获取按钮qs地址
          if (!(tracker && tracker.tempId === id && tracker.tel) && !isPreview) await this.initTracker()

          // 声明
          const gnIds = []
          const gwIds = []
          // 遍历
          selectedCls.forEach(({ id, isgn }) => isgn ? gnIds.push(id) : gwIds.push(id))
          // 按钮
          await handleBtnOpts()
          // 富文本
          const { html, deltas } = await $refs.quill.getParams() || {}
          // 回调
          cb({
            ...baseFormData,
            // 模块显隐
            ...values,
            btnOpts,
            tracker: this.tracker,
            hqList,
            zxList: zxList.filter(item => item.title),
            mainCls,
            fwb: { html, deltas },
            // 记录code
            mainClsId: gwCache[mainCls] || mainCls,
            gnIds,
            gwIds,
          })
        })
      },
      // 关闭弹窗
      clear() {
        // 表单清空
        this.$refs.baseForm.$refs.form.resetFields()
        // 重置
        this.hqList = [hqConf()]
        // 重置
        this.zxList = [zxConf()]
      },
      // 设置子组件值
      setData(data) {
        const { formData } = data
        // Object.assign(this, { ...data }, formData && { form: this.fmtFormDate(formData) })
      },
    }
  }
</script>
