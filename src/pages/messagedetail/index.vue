<template>
  <div class="commonpad" v-if="hasData">
      <div class="title">{{info.Title}}</div>
      <div class="flex-container tips">
          <text>{{time}}</text>
          <text>{{info.BrowseNum}}人浏览</text>
      </div>
       
      <div class="content" v-html="info.ContentDetails"></div>
      <div class="btnset flex-container">
          <div class="flex-container" @click="btnOperation">
              <img src="/static/images/zan.png" class="zan">
              <text>{{info.LikeNum}}</text>
          </div>
          <button class="flex-container btn" open-type="share">
              <img src="/static/images/share.png" class="share">
              <text>分享</text>
          </button>
      </div>
  </div>
</template>

<script>
import { post,filePath,getCurrentPageUrlWithArgs } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow(){
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync("token");
    this.initData();
    this.id = this.$root.$mp.query.id;
    this.setBarTitle();
    this.getNewsInfo();
   this.curPage = getCurrentPageUrlWithArgs();
  },
  data () {
    return {
      userId:"",
      token:"",
      id:"",
      info:{},
      time:"",
      hasData:false,
      curPage: ""
    }
  },
 
  components: {

  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "消息详情"
      });
    },
    initData(){
      this.hasData = false;
      this.info = {};
    },
    orderpay(){
      wx.navigateTo({ url: "/pages/locationcomplete/main" });
    },
    async getNewsInfo(){
      let result = await post("News/FindNewsList",{
        FindId:this.id,
        page:1,
        pagesize:1
      });

      this.info = result.data[0];
      this.time = this.info.Addtime.split("T").join(" ");
      this.hasData = true;
    },
    btnOperation(){
      if(this.userId && this.token){
         this.findlikeOperation();
      }else{
        wx.showModal({
          content: "亲，您已掉线，是否重新登录",
          success(e) {
            if (e.confirm) {
              wx.redirectTo({
                url: "/pages/login/main"
              });
            } else if (e.cancel) {

            }
          }
        });
      }
    },
    async findlikeOperation(){
      let result = await post("News/FindlikeOperation",{
        UserId:this.userId,
        Token:this.token,
        FindId:this.id
      });
      if(result.code===0){
        let _this = this;
        if(_this.info.likeNum===1){  //取消点赞
          //取消点赞
          let num = parseInt(_this.info.LikeNum) - 1;
          wx.showToast({
            title: "取消点赞成功",
            icon: "none",
            duration: 1000,
            success:function(){
              _this.$set(_this.info,"LikeNum",num);
              _this.$set(_this.info,"likeNum",0);
              return false;
            }
          });
        }
        if (_this.info.likeNum === 0) {
          let num = parseInt(_this.info.LikeNum) + 1;
          wx.showToast({
            title: "点赞成功",
            icon: "none",
            duration: 1000,
            success:function(){
              _this.$set(_this.info,"LikeNum",num);
              _this.$set(_this.info,"likeNum",1);
              return false;
            }
          });
        }
      }
    }
  },

  created () {
    // let app = getApp()
  },
  onPullDownRefresh(){
    this.initData();
    this.getNewsInfo();
  },
   onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.info.Title,
      imageUrl: filePath+this.info.PicNo,
      path: this.curPage
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
  @import "../../css/common.css";
</style>
