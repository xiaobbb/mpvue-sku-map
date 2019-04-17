<template>
  <div class="backgray">
    <!--头部切换-->
    <div v-if="hasData">
      <!--预约上门订单-->
      <div class="border" v-if="appraiseType==1">
        <div class="flex-container head white">
          <img :src="info.order.ArtificerPic" class="avatar" v-if="info.order.ArtificerPic">
          <img src="/static/images/default.png" class="avatar" v-else>
          <div>
            <p class="person">服务技师：{{info.order.Artificer}}</p>
            <p class="time">服务时间：{{info.order.Fahuodate}}</p>
          </div>
        </div>  
        <div class="white flex-container mark">
          <p>服务打分</p>
          <p>
            <span v-for="(item,index) in starChecked" :key="index">
              <img v-if="item" src="/static/images/xing.png" class="xing-point">
              <img v-else src="/static/images/gray1.png" class="xing-point">
            </span>
          </p>
        </div>
      </div>
      <!--商城订单-->
      <div class="border" v-if="appraiseType==0">
        <div class="flex-container head white">
          <img src="/static/images/shop22.png" class="product">
          <div class="prodetail">
            <p class="person">{{info.detaillist[0].ProductName}}</p>
            <p class="time">{{info.detaillist[0].SpecText}}</p>
            <p class="proprice">￥{{info.detaillist[0].Market_price}}</p>
          </div>
        </div>
        <div class="white flex-container mark">
          <p>服务打分</p>
          <p>
            <span v-for="(item,index) in starChecked" :key="index" @click="shiftStar(index)">
              <img v-if="item" src="/static/images/xing.png" class="xing-point">
              <img v-else src="/static/images/gray1.png" class="xing-point">
            </span>
          </p>
        </div>
      </div>
      <!--预约到店订单-->
      <div class="border" v-if="appraiseType==2">
        <div class="flex-container head white">
          <img src="/static/images/shop22.png" class="shopimg">
          <div>
            <p class="person">车御品汽车服务</p>
            <p class="time">服务时间：2019-03-19 11:00</p>
          </div>
        </div>
        <div class="white flex-container mark">
          <p>服务打分</p>
          <p>
            <span v-for="(item,index) in starChecked" :key="index">
              <img v-if="item" src="/static/images/xing.png" class="xing-point">
              <img v-else src="/static/images/gray1.png" class="xing-point">
            </span>
          </p>
        </div>
      </div>
    </div>
    <!--图片展示-->
    <div class="comment white">
      <textarea  class="commentdet" v-model="contentText"
        placeholder="亲，您对技师的服务表现还满意吗？给其他想做服务的 小伙伴做个参考呗~期待给您更好的服务……"
      ></textarea>
      <div class="imgs">
        <div class="imgItem" v-for="(img,index) in imgPathArr" :key="index">
          <div class="delete" @click="deleteImg(index)">×</div>
          <img :src="img" alt>
        </div>
        <img
          src="/static/images/bg20.png"
          @click="chosseImg"
          v-show="isShowBtnUpload"
          class="compics"
        >
      </div>
    </div>
    <div class="flex-container checksata white" @click="shiftIsanonymous">
      <img src="/static/images/choose.png" class="chosesate" v-if="isanonymous===1">
      <img src="/static/images/nocheck.png" class="chosesate" v-else>

      <text>匿名评价</text>
    </div>
    <div class="paybtn commit" @click="submitAppraise">提交</div>
  </div>
</template>

<script>
import { post } from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad() {
    this.setBarTitle();
  },
  onShow() {
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");
    this.orderNo = this.$root.$mp.query.orderNo;
    this.pramas=this.$root.$mp.query.url
    this.appraiseType = this.$root.$mp.query.appraiseType;
    this.appraiseId = this.$root.$mp.query.appraiseId;
    console.log( this.orderNo,"发表评论的订单编号")
    this.getOrderComment();
  },
  data() {
    return {
      pramas:"",//url参数
      userId: "",
      token: "",
      orderNo: "",
      appraiseId:"",
      appraiseType: 0, //0:商品评价；1：上门服务评价；2：到店评价
      imgBase: [],
      imgPathArr:[],
      info: {},
      hasData: false,
      rank: 5, //评论星级
      starChecked: [true, true, true, true, true],
      isanonymous: 1, //1:匿名；0：不匿名
      title:"",  //评价标题（目前为空）
      contentText: "",
      imgLenght:8,
      isShowBtnUpload:true    //是否显示图片上传按钮
    };
  },

  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "发表评论"
      });
    },
    shiftIsanonymous() {
      if (this.isanonymous === 1) {
        this.isanonymous = 0;
      } else {
        this.isanonymous = 1;
      }
    },
    shiftStar(index) {
      for (let i = 0; i < this.starChecked.length; i++) {
        if (i <= index) {
          this.$set(this.starChecked, i, true);
          this.num++;
        } else {
          this.$set(this.starChecked, i, false);
        }
      }
    },
    valOther(){
      //提交评价
      if (this.contentText == "") {
        wx.showToast({
          title: "请输入评价内容！",
          icon: "none",
          duration: 1500
        });
        return false;
      }
      if(this.contentText.length<10){
         wx.showToast({
          title: "最少输入10个字符！",
          icon: "none",
          duration: 1500
        });
        return false;
      }
      return true;
    },
    chosseImg() {
      const that = this;
      let num = 0;
      if (that.imgPathArr.length < this.imgLenght) {
        num = this.imgLenght - that.imgPathArr.length;
        wx.chooseImage({
          count: num,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: res => {
            that.imgPathArr = that.imgPathArr.concat(res.tempFilePaths);
            if (that.imgPathArr.length === 8) {
              that.isShowBtnUpload = false;
            }
            for(let i=0;i<that.imgPathArr.length;i++){
              wx.getFileSystemManager().readFile({
                filePath: that.imgPathArr[i], //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success: res => { //成功的回调
                  that.imgBase.push({
                    PicUrl: "data:image/png;base64," + res.data.toString()
                  });
                }
              })
            }
          }
        });
      }
    },
    deleteImg(i) {
      this.imgBase.splice(i, 1);
      this.imgPathArr.splice(i,1);
      if(this.imgPathArr.length<8){
        this.isShowBtnUpload = true;
      }
    },
    async getOrderComment() {
      let result = await post("Order/GetOrderComment", {
        UserId: this.userId,
        Token: this.token,
        OrderNo: this.orderNo
      });
      console.log(result,"获取到的评论对象")
      if (Object.keys(result.data).length > 0) {
        this.hasData = true;
        this.info = result.data;
        // this.appraiseId = 
      }
    },
    async orderComment() {
      let obj = {
        id:this.appraiseId,
        title:this.title,
        contentText:this.contentText,
        rank:this.rank,
        PicNo:JSON.stringify(this.imgBase),
        isanonymous:this.isanonymous
      }
      let result = await post("Order/OrderComment", {
        UserId: this.userId,
        Token: this.token,
        OrderNo: this.orderNo,
        CommentList:[obj]
      });
      if(result.code===0){
        let pageUrl = '';
        //0:商品评价；1：上门服务评价；2：到店评价
        if(this.appraiseType===0){
          pageUrl = '/pages/myorder/main?orderBigType=1&status=4';
        }
        if(this.appraiseType===1){
          pageUrl = '/pages/myorder/main?orderBigType=2&status=1';
        }
        if(this.appraiseType===2){
          pageUrl = '/pages/myorder/main?orderBigType=2&status=2';
        }
        wx.redirectTo({
          url:pageUrl
        })
      }
    },
    submitAppraise() {
      let num = 0;
      for (let i = 0; i < this.starChecked.length; i++) {
        if(this.starChecked[i]){
          num++;
        }
      }
      this.rank = num;
      if(this.valOther()){
        this.orderComment();
      }
    }
  },

  created() {
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
</style>
