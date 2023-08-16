<template>
  <div id="box" class="wbox" v-if="zxid" ref="wbox">
    <!-- Ad -->
    <div
      class="top-image"
      v-if="ifFixedTop.show"
      @click="handleJump(
        ifFixedTop.link, ifFixedTop.showPop, ifFixedTop.popType,
        ifFixedTop.btnType, ifFixedTop.trackUrl, ifFixedTop.downloadYes,
        ifFixedTop.downloadNo, ifFixedTop.downloadTotal, ifFixedTop.telYes, ifFixedTop.telNo
        )"
    >
      <img
        v-show="ifLight && !black"
        :src="ifFixedTop.lightSrc"
        :style="{width: 100 + '%'}"
        v-if="pc || (!isFutures && ifFixedTop.moneyShow ) || (isFutures && ifFixedTop.futureShow) && (ifFixedTop.btnType === userTag || ifFixedTop.btnType === 'all')"
      >
      <img
        v-show="!ifLight || black"
        :src="ifFixedTop.darkSrc"
        :style="{width: 100 + '%'}"
        v-if="pc || (!isFutures && ifFixedTop.moneyShow ) || (isFutures && ifFixedTop.futureShow) && (ifFixedTop.btnType === userTag || ifFixedTop.btnType === 'all')"
      >
    </div>

    <!-- 文章内容 -->
    <div class="article-content">
      <!-- 标题 -->
      <div class="article-title">
        <h1>{{ title }}</h1>
      </div>
      <!-- 信息 -->
      <div class="source-time">
        <div class="left-part">
          <span>{{ source }}</span>
          <span v-show="showtime">{{ formatArticleTime }}</span>
        </div>
        <div class="right-part" @click="clickToComment">
          <span>{{briefInfo.post_comment_count}}评论</span>
        </div>
      </div>
      <!-- 主体 -->
      <div class="article">
        <div class="article-body">
          <div v-html="body">{{ body }}</div>
        </div>
        <slot name="endOfArticle"></slot>
      </div>

      <!-- Ad -->
      <div
        class="article-image"
        v-if="ifArticleEnd.show"
        @click="handleJump(
          ifArticleEnd.link, ifArticleEnd.showPop, ifArticleEnd.popType,
          ifArticleEnd.btnType, ifArticleEnd.trackUrl, ifArticleEnd.downloadYes,
          ifArticleEnd.downloadNo, ifArticleEnd.downloadTotal, ifArticleEnd.telYes, ifArticleEnd.telNo
        )"
      >
        <img
          v-show="ifLight && !black"
          :src="ifArticleEnd.lightSrc"
          :style="{width: 100 + '%'}"
          v-if="pc || (!isFutures && ifArticleEnd.moneyShow ) || (isFutures && ifArticleEnd.futureShow) && (ifArticleEnd.btnType === userTag || ifArticleEnd.btnType === 'all')"
        >
        <img
          v-show="!ifLight || black"
          :src="ifArticleEnd.darkSrc"
          :style="{width: 100 + '%'}"
          v-if="pc || (!isFutures && ifArticleEnd.moneyShow ) || (isFutures && ifArticleEnd.futureShow) && (ifArticleEnd.btnType === userTag || ifArticleEnd.btnType === 'all')"
        >
      </div>

      <!-- 声明 -->
      <div class="declaration">
        <!-- <p>文章来源：{{ source }}</p> -->
        <p>原标题：{{ title }}</p>
        <p>
          声明：发布此内容旨在传播更多信息，与本站立场无关，不构成投资建议。据此操作，风险自担。
        </p>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comment">
      <!-- 热门评论 -->
      <div class="replyList" v-if="hotReplyList && hotReplyList.length > 0">
        <div class="title">
          <div class="sum">
            <div>热门评论</div>
          </div>
        </div>
        <!-- <Comment1> -->
        <div v-for="item in hotReplyList" :key="item.reply_id">
          <div class="line"></div>
          <div class="reply">
            <div class="content">
              <img class="avatar" :src="`https://avator.eastmoney.com/qface/${item.user_id}/166`" alt="">
              <div class="txt">
                <div class="user-title">
                  <div class="nickname">{{item.reply_user.user_nickname}}</div>
                  <div class="like"><i></i><span v-if="item.reply_like_count">{{item.reply_like_count}}</span></div>
                </div>
                <div class="replayContent">
                  <emoji-comment :comment='item.reply_text'/>
                </div>
              </div>
            </div>
            <div class='operator'>
              <div class="left">
                <!-- <div class="btn">回复</div> -->
                <div class="time">{{item.reply_time}}</div>
              </div>
            </div>

            <div v-if="item.child_replys.length>0" class="comment">
              <div class="comment-li" v-for="(reply, i) in item.child_replys" :key="i">
                <div v-if="item.user_id == reply.source_reply[0].source_reply_user_id">
                  <i :class="{author: reply.user_nickname_is_author}">{{reply.reply_user.user_nickname}}</i>:
                  <emoji-comment :comment='reply.reply_text'/>
                  <i v-if="reply.reply_picture" class="imagePreview" @click="imagePreview(reply.reply_picture)"></i>
                </div>
                <div v-else>
                  <i :class='{author: reply.user_nickname_is_author}'>{{reply.reply_user.user_nickname}}</i>回复<i>{{reply.source_reply[0].source_reply_user_nickname}}:</i>
                  <emoji-comment :comment='reply.reply_text'/>
                  <i v-if="reply.reply_picture" class="imagePreview" @click="imagePreview(reply.reply_picture)"></i>
                </div>
              </div>
              <!-- <i v-if="item.reply_count>2">查看全部{{item.reply_count}}条回复 ></i>   -->
            </div>
          </div>
        </div>
        <!-- <Comment1> -->
      </div>

      <div class="hotReplyList">
        <div class="title">
          <div class="sum">
            <div>全部评论</div>
            &nbsp;{{briefInfo.post_comment_count}}&nbsp;
            <div> 分享</div>
            &nbsp;{{briefInfo.post_forward_count}}&nbsp;
          </div>
          <van-popover
            v-model="showPopover"
            trigger="click"
            :theme="theme"
            :actions="actions"
            @select="onSelect"
            placement="bottom-end"
          >
            <template #reference>
              <div class="operator">{{actions[replayIndex].text}}<i :class="{arrow:true, arrowActive: showPopover}"></i>
              </div>
            </template>
          </van-popover>
        </div>

        <!-- <Comment2> -->
        <div v-for="item in replyList" :key="item.reply_id">
          <div class="line"></div>
          <div class="reply">
            <div class="content">
              <img class="avatar" :src="`https://avator.eastmoney.com/qface/${item.user_id}/166`" alt="">
              <div class="txt">
                <div class="user-title">
                  <div class="nickname">{{item.reply_user.user_nickname}}</div>
                  <div class="like"><i></i><span v-if="item.reply_like_count">{{item.reply_like_count}}</span></div>
                </div>
                <div class="replayContent">
                  <emoji-comment :comment='item.reply_text'/>
                </div>
              </div>
            </div>
            <div class='operator'>
              <div class="left">
                <!-- <div class="btn">回复</div> -->
                <div class="time">{{item.reply_time}}</div>
              </div>
            </div>

            <div v-if="item.child_replys.length>0" class="comment">
              <div class="comment-li" v-for="(reply, i) in item.child_replys" :key="i">
                <div v-if="item.user_id == reply.source_reply[0].source_reply_user_id">
                  <i :class="{author: reply.user_nickname_is_author}">{{reply.reply_user.user_nickname}}</i>:
                  <emoji-comment :comment='reply.reply_text'/>
                  <i v-if="reply.reply_picture" class="imagePreview" @click="imagePreview(reply.reply_picture)"></i>
                </div>
                <div v-else>
                  <i :class='{author: reply.user_nickname_is_author}'>{{reply.reply_user.user_nickname}}</i>回复<i>{{reply.source_reply[0].source_reply_user_nickname}}:</i>
                  <emoji-comment :comment='reply.reply_text'/>
                  <i v-if="reply.reply_picture" class="imagePreview" @click="imagePreview(reply.reply_picture)"></i>
                </div>
              </div>
              <!-- <i v-if="item.reply_count>2">查看全部{{item.reply_count}}条回复 ></i>   -->
            </div>
          </div>
        </div>
        <!-- <Comment2> -->
        <!-- Ad -->
        <div
          class="comment-image"
          v-if="ifCommentsEnd.show"
          @click="handleJump(
            ifCommentsEnd.link, ifCommentsEnd.showPop, ifCommentsEnd.popType,
            ifCommentsEnd.btnType, ifCommentsEnd.trackUrl, ifCommentsEnd.downloadYes,
            ifCommentsEnd.downloadNo, ifCommentsEnd.downloadTotal, ifCommentsEnd.telYes, ifCommentsEnd.telNo
          )"
        >
          <img
            v-show="ifLight && !black"
            :src="ifCommentsEnd.lightSrc"
            :style="{width: 100 + '%'}"
            v-if="pc || (!isFutures && ifCommentsEnd.moneyShow ) || (isFutures && ifCommentsEnd.futureShow) && (ifCommentsEnd.btnType === userTag || ifCommentsEnd.btnType === 'all')"
          >
          <img
            v-show="!ifLight || black"
            :src="ifCommentsEnd.darkSrc"
            :style="{width: 100 + '%'}"
            v-if="pc || (!isFutures && ifCommentsEnd.moneyShow ) || (isFutures && ifCommentsEnd.futureShow) && (ifCommentsEnd.btnType === userTag || ifCommentsEnd.btnType === 'all')"
          >
        </div>
      </div>
    </div>

    <!-- 滑动展示 -->
    <!-- Ad -->
    <div
      class="scroll-module"
      v-if="ifFloatBottom.show"
      @click="handleJump(
      ifFloatBottom.link, ifFloatBottom.showPop, ifFloatBottom.popType,
      ifFloatBottom.btnType, ifFloatBottom.trackUrl, ifFloatBottom.downloadYes,
      ifFloatBottom.downloadNo, ifFloatBottom.downloadTotal, ifFloatBottom.telYes, ifFloatBottom.telNo
      )"
    >
      <div :class="{ downloadBtn:true, showDownloadBtn }">
        <img
          v-show="ifLight && !black"
          :src="ifFloatBottom.lightSrc"
          :style="{width: 100 + '%'}"
          v-if="pc || (!isFutures && ifFloatBottom.moneyShow ) || (isFutures && ifFloatBottom.futureShow) && (ifFloatBottom.btnType === userTag || ifFloatBottom.btnType === 'all')"
        >
        <img
          v-show="!ifLight || black"
          :src="ifFloatBottom.darkSrc"
          :style="{width: 100 + '%'}"
          v-if="pc || (!isFutures && ifFloatBottom.moneyShow ) || (isFutures && ifFloatBottom.futureShow) && (ifFloatBottom.btnType === userTag || ifFloatBottom.btnType === 'all')"
        >
      </div>
    </div>

    <!-- 底部固定 -->
    <!-- <div class="fixedBottom">
      <div class="bottom-comment" @click="handleDownloadBtn"><div class="pencil"></div>说点什么...</div>
      <div :class="isMoney?'icons space-around': 'icons'" >
        <div class="icon-bottom icon-1" @click="commentClick"><span>{{briefInfo.post_comment_count}}</span></div>
        <div class="icon-bottom icon-2" @click="handleDownloadBtn"></div>

        <div v-if="!isMoney" class='icon-bottom icon-3' @click="show=true"><span>{{briefInfo.post_forward_count}}</span></div>
        <van-overlay :show="show" @click="show=false">
          <div class="browserEnv" v-if="inBrowser">
            点击浏览器操作栏【分享】
          </div>
          <div v-else class="share-wrapper" @click.stop>
            <div class="triangle"></div>
            <div class="share-pointer">
              <div class="share-content">点这里分享</div>
              <div class="share-icon"></div>
            </div>
          </div>
        </van-overlay>
      </div>
    </div> -->


    <!-- <DownloadPopup ref="popup" :opt="opt" :download-url="downloadUrl" :pop-type="one" /> -->
    <DownloadPopup ref="popup" :opt="opt" :download-url="downloadUrl" :pop-type="popType"/>
    <PhonePopup ref="phone"/>
  </div>
</template>

<script>
  // index
  import { jsonp } from "./utils/rdzx";
  import { sendThis, getBriefInfo } from "./utils/dataStore";

  // Comments
  import EmojiReply from "./utils/emoji-reply";
  import Vue from "vue";
  import { Popover } from "vant";

  Vue.use(Popover);
  EmojiReply();

  // Comment
  import { ImagePreview } from "vant";
  import { format } from "date-fns";

  Vue.use(ImagePreview);

  // FixedBottom
  // import hybird from '@/Page/utils/hybird'
  import { Overlay } from 'vant';
  // const { jumpH5Fmt, openApp } = hybird
  Vue.use(Overlay);

  // import VConsole from 'vconsole'
  // const vConsole = new VConsole()
  // Vue.use(vConsole)

  // 点击跳转
  import { tracker } from '@/Page/api/track';
  import utils from '../../utils';
  import DownloadPopup from '../Components/DownloadPopup.vue'
  import PhonePopup from '../Components/PhonePopup.vue'

  const { jumpH5Fmt, mobileEnv: { isMoney, isFutures, adr, ios }, openApp, setTitle, shareFun, callFuturesService, getAppVsn } = utils;
  const opt = { ...jumpH5Fmt(), downApp: true }

  export default {
    name: "RdzxHtml",
    components: { DownloadPopup, PhonePopup },
    props: {
      html: {
        type: Object,
        default: _ => ({})
      },
      isPage: Boolean,
      theme: String
    },
    data() {
      return {
        // Article
        article: {},
        // 文章
        hasArticleInfo: true,
        // 加载状态
        loading: true,
        // 所需文章字段
        title: "",
        source: "",
        body: "",
        showtime: "",
        images: [],
        links: "",
        // Comments
        replyList: [],
        // 帖子互动数据
        briefInfo: {},
        // 热门评论
        hotReplyList: [],
        showPopover: false,
        // 通过 actions 属性来定义菜单选项
        actions: [
          { text: "最新", opt: { sort: 1, sorttype: 1 } },
          { text: "最热", opt: { sort: 1, sorttype: -1 } },
          { text: "最早", opt: { sort: -1, sorttype: 1 } },
        ],
        replayIndex: 0,
        // ScrollModule
        timer: null,
        showDownloadBtn: false,
        // FixedBottom
        // 记录正文的滚动位置
        contentScrollTop: 0,
        show: false,
        // 浏览器环境
        // inBrowser: !InApp && !wx,
        inBrowser: true,
        // isMoney,
        isMoney: false,
        // 按钮
        btnItems: [],
        // 分享配置
        shareConf: {},
        // 打点id
        id: '',
        // 资讯id
        zxid: '',
        // 按钮位置顶部固定
        ifFixedTop: {
          show: false,
          link: '',
          lightSrc: '',
          darkSrc: '',
          showPop: false,
          popType: '',
          btnType: '',
          moneyShow: false,
          futureShow: false,
          trackUrl: '',
          downloadYes: '',
          downloadNo: '',
          downloadTotal: '',
          telYes: '',
          telNo: ''
        },
        // 按钮位置文章末尾
        ifArticleEnd: {
          show: false,
          link: '',
          lightSrc: '',
          darkSrc: '',
          showPop: false,
          popType: '',
          btnType: '',
          moneyShow: false,
          futureShow: false,
          trackUrl: '',
          downloadYes: '',
          downloadNo: '',
          downloadTotal: '',
          telYes: '',
          telNo: ''
        },
        // 按钮位置讨论区末尾
        ifCommentsEnd: {
          show: false,
          link: '',
          lightSrc: '',
          darkSrc: '',
          showPop: false,
          popType: '',
          btnType: '',
          moneyShow: false,
          futureShow: false,
          trackUrl: '',
          downloadYes: '',
          downloadNo: '',
          downloadTotal: '',
          telYes: '',
          telNo: ''
        },
        // 按钮位置底部浮动
        ifFloatBottom: {
          show: false,
          link: '',
          lightSrc: '',
          darkSrc: '',
          showPop: false,
          popType: '',
          btnType: '',
          moneyShow: false,
          futureShow: false,
          trackUrl: '',
          downloadYes: '',
          downloadNo: '',
          downloadTotal: '',
          telYes: '',
          telNo: ''
        },
        // 判断预览是否是白皮肤
        ifLight: true,
        // 判断app内是否为黑皮肤
        black: false,
        // 跳转
        InApp: window.AG,
        isFutures,
        pc: !adr && !ios,
        opt,
        jumpUrl: null,
        // 弹框类型
        popType: '',
        // 下载地址
        downloadUrl: 'https://acttg.eastmoney.com/pub/xxlout_qhtgkh_random_0003079a',
        // 用户状态
        userTag: 'all',
      };
    },
    watch: {
      html: {
        handler(n, o) {
          this.fmtHtml(n)
        },
        deep: true
      },
      async zxid() {
        let briefInfo = await getBriefInfo(jsonp)
        this.briefInfo = briefInfo || {}
        await this.getArticle();
        this.getHotReplyList();
      },
      theme() {
        let { theme } = this
        this.ifLight = theme === 'dark' ? false : true
      }
    },

    computed: {
      // Article
      showArticle() {
        const { loading, article } = this;
        return !loading && article && article.news
      },

      formatArticleTime() {
        return format(this.showtime, "MM-DD HH:mm")
      },
    },

    mounted() {
      // 确认皮肤
      let blackTheme = /black/.test(document.body.className)
      this.black = blackTheme
      // 将实例发送至js
      sendThis(this);

      const { timer, clearTimer, showDownloadBtn } = this
      // 底部悬浮
      setTimeout(() => {
        window.addEventListener('scroll', () => {
          let { timer } = this
          // 2s 显示下载按钮
          this.showDownloadBtn = true
          clearTimeout(timer)
          this.timer = setTimeout(() => {
            clearTimer()
          }, 2000)
        }, true)
      }, 1000)

      if (!this.pc) {
        const { shareTitle, shareDesc } = this.shareConf
        ios ? window.addEventListener('pageshow', function (event) {
          setTitle('期货')
          shareTitle && shareFun({ title: shareTitle, desc: shareDesc })
        }) : shareTitle && shareFun({ title: shareTitle, desc: shareDesc })
        setTitle('期货')
      }

      const { isPage, html, fmtHtml } = this
      isPage && this.$nextTick(_ => {
        fmtHtml(html)
      })
    },

    destroyed() {
      this.clearTimer()
    },

    methods: {
      // 将接口中的占位符替换为图片和a标签
      replacePlaceholder() {
        const { images = [], links = [], body = '' } = this
        let nbody = ''
        images.length && images.forEach(({ label, src, alt }) => {
          let str = "<img " + "src='" + src + "'" + "alt='" + alt + "'>";
          nbody = body.replace(label, str);
        });

        links.length && links.forEach(({ label, url_w, text }) => {
          let str = "<a href='" + url_w + "'>" + text + "</a>";
          nbody = nbody.replace(label, str);
        });

        // 清除首行缩进
        this.body = nbody.replace(/<p>\s*/g, '<p>')
          .replace(/class="emh3">\s*/g, 'class="emh3">')
      },
      // 请求文章内容
      async getArticle() {
        let article = await jsonp(
          "https://newsinfo-uat.eastmoney.com/kuaixun/v2/api/content/getnews",
          {
            // 接口文档必传参数
            newstype: 1,
            // 接口文档必传参数
            source: "future_android",
            newsid: this.zxid,
          },
          {
            defaultParams: ["version"],
          }
        ).catch((e) => console.log("error", e));
        Object.assign(this, {
          article: article,
          loading: false,
          hasArticleInfo: article && article.news,
        });
        const { article: { news }, replacePlaceholder } = this;
        const { title, source, body, showtime, images, links } = news || {}
        console.log(images)
        Object.assign(this, { title, source, body, showtime, images, links });
        replacePlaceholder();
      },

      // 请求评论
      async getReplyList(params) {
        let replyList = await jsonp("replyList", {
          type: 0,
          ps: 5,
          p: 1,
          sort: 1,
          sorttype: 1,
          deviceid: 1,
          IsTC: false,
          ...(params || {}),
        });
        this.replyList = replyList.re;
        // format回复时间
        this.replyList.forEach(item => {
          item.reply_time = format(item.reply_time, "MM-DD HH:mm")
        })
        return Promise.resolve(true);
      },

      // 热评
      async getHotReplyList() {
        await this.getReplyList();
        let hotReplyList = await jsonp("hotReplyList", {
          type: 0,
          ps: 2,
          p: 1,
          sort: 1,
          sorttype: 1,
          IsTC: false,
        });
        this.hotReplyList = hotReplyList.re;
        // format回复时间
        this.hotReplyList.forEach(item => {
          item.reply_time = format(item.reply_time, "MM-DD HH:mm")
        })
      },

      // 切换最新 最热 最早
      onSelect(action) {
        let { actions, replayIndex } = this
        replayIndex = actions.findIndex(t => t.text == action.text)
        // this.$emit('optChange', actions[replayIndex].opt )
        this.getReplyList(actions[replayIndex].opt)
        this.replayIndex = replayIndex
      },

      // 预览
      imagePreview(img) {
        ImagePreview({
          images: [img],
        });
      },

      // ScrollModule
      clearTimer() {
        let { timer } = this
        if (!timer) return
        clearTimeout(timer)
        Object.assign(this, {
          timer: null,
          showDownloadBtn: false
        })
      },

      // FixedBottom
      // 点击评论跳转
      commentClick() {
        let { contentScrollTop } = this
        let imageHeight = 0
        this.btnItems.forEach(item => {
          if (item.position === 'fixedTop') imageHeight = 50
        })
        // 评论top位置
        const commentTop = document.querySelector('.comment').getBoundingClientRect().top
        // 文档半屏高度
        const windowHalfHeight = document.documentElement.clientHeight / 2
        // 是否滚动去评论
        const scrollToComment = (windowHalfHeight - (commentTop - imageHeight)) < 0
        // 文档滚动位置
        const bodyTop = document.documentElement.scrollTop || document.body.scrollTop
        // 点击一次回到评论，再点击回到正文
        if (scrollToComment) {
          this.contentScrollTop = bodyTop
          window.scrollTo(0, commentTop + bodyTop - imageHeight)
        } else {
          window.scrollTo(0, contentScrollTop)
        }
      },

      // 点击评论数量跳转至评论区
      clickToComment() {
        let imageHeight = 0
        this.btnItems.forEach(item => {
          if (item.position === 'fixedTop') imageHeight = 50
        })
        const commentTop = document.querySelector('.comment').getBoundingClientRect().top
        window.scrollTo(0, commentTop - imageHeight)
      },

      // handleDownloadBtn2(showPopUp) {
      //   const newsid = this.newid
      //   const shortChain = `dfcfqh://page/newsdetail?newsid=${newsid}&newstype=1`
      //   if (isMoney) {
      //     typeof showPopUp === 'function' && showPopUp()
      //   } else if (isFutures) {
      //     // 期货app内调到原生资讯
      //     callFuturesService('1000', {})
      //     window.location.href = shortChain
      //     return
      //   } else {
      //     openApp(undefined, { ...jumpH5Fmt(false), downApp: true })
      //   }
      // },

      // handleDownloadBtn() {
      //   this.opt = { ...jumpH5Fmt, downApp: true}
      //   this.handleDownloadBtn2(this.$refs.popup.show)
      // },

      // 展示广告
      showAd(p, whichP) {
        let flag = false
        this.btnItems.forEach(item => {
          if (item.position === p && item.lightBg.length && item.darkBg.length) {
            const { link, showPop, popType, btnType, moneyShow, futureShow, trackUrl, downloadYes, downloadNo, downloadTotal, telYes, telNo } = item
            flag = true
            whichP.lightSrc = item.lightBg[0].url
            whichP.darkSrc = item.darkBg[0].url
            whichP.link = link
            whichP.showPop = showPop
            whichP.popType = popType
            whichP.btnType = btnType
            whichP.moneyShow = moneyShow
            whichP.futureShow = futureShow
            whichP.trackUrl = trackUrl
            whichP.downloadYes = downloadYes
            whichP.downloadNo = downloadNo
            whichP.downloadTotal = downloadTotal
            whichP.telYes = telYes
            whichP.telNo = telNo
          }
        })
        whichP.show = flag ? true : false
      },

      // 格式化页面信息
      fmtHtml(n) {
        console.log('页面初始化')
        console.log('###n', n)
        const { btnItems, shareConf, id, zxid, khPageId } = n
        const { ifFixedTop, ifArticleEnd, ifCommentsEnd, ifFloatBottom, showAd } = this
        // 更新
        Object.assign(this, {
          btnItems, shareConf, id, zxid, khPageId
        })
        if (isFutures) {
          callFuturesService('1006', undefined, res => {
            const baseInfo = JSON.parse(res)
            const userTag = baseInfo ? baseInfo.userTag : 0
            // 更新 获取token
            userTag && (this.userTag = userTag === '1' ? '1' : 'trade')
          })
        }
        showAd('fixedTop', ifFixedTop)
        showAd('articleEnd', ifArticleEnd)
        showAd('commentsEnd', ifCommentsEnd)
        showAd('floatBottom', ifFloatBottom)
      },

      // 按钮计数
      async btnTracker(trackUrl) {
        return await tracker.request(trackUrl, {}, { hideMsg: true, noLoading: true })
      },

      // 跳转
      async handleJump(url, showPop, popType, btnType, trackUrl, downloadYes, downloadNo, downloadTotal, telYes, telNo) {
        const { handleFuturesJump, btnTracker } = this

        if (showPop) {
          this.jumpUrl = url
          this.popType = popType
          if (isFutures) {
            await btnTracker(trackUrl)
            window.location.href = url
          } else {
            if (isMoney) {
              this.opt = {
                ...jumpH5Fmt(),
                downApp: true
              }
              // 弹窗
              await btnTracker(trackUrl)
              const popupTrackUrl = { downloadYes, downloadNo, downloadTotal }
              this.$refs.popup.show(popupTrackUrl)
            } else {
              const { status } = await btnTracker(trackUrl) || {}
              if (status === 0) {
                openApp(undefined, opt)
              }
            }
          }
        } else {
          if (url) {
            if (url === 'tel') {
              const popupTrackUrl = { telYes, telNo }
              await btnTracker(trackUrl)
              this.$refs.phone.show(popupTrackUrl)
            } else {
              const { emH5ShareNeed } = window.AG
              // 清空标题和分享
              setTitle('')
              !this.pc ? emH5ShareNeed(0) : undefined
              await btnTracker(trackUrl)
              window.location.href = url
            }
          } else if (isFutures) {
            handleFuturesJump(btnType, url, trackUrl, telYes, telNo)
          }
        }
      },

      // 期货内跳转
      async handleFuturesJump(btnType, url, trackUrl, telYes, telNo) {
        const { btnTracker, khPageId } = this
        await btnTracker(trackUrl)
        debugger
        if (btnType === 'phone') {
          const popupTrackUrl = { telYes, telNo }
          this.$refs.phone.show(popupTrackUrl)
        } else {
          if (btnType === '1') {
            console.log(khPageId)
            // 开户埋点
            khPageId && callFuturesService('1036', { eventValue: { pageID: khPageId }, eventType: 'luodiyeKaihu' })
            // 开户跳转
            window.location.href = `dfcfqh://trade/kaihu${getAppVsn('3.4.0') > 0 ? 'v2' : ''}`
          } else if (btnType === 'trade') {
            window.location.href = ios
              ? 'eastmoney://wireless/txtrade/switchSegment?index=0' : 'dfcft://homepage/jy'
          } else {
            window.location.href = url
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
