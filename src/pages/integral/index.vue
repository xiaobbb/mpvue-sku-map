<template>
  <div>
     <div class="orange flex-container clomn">
        <p>当前可用积分</p>
        <p><span class="score" v-if="isHasInfo">{{memberInfo.Score}}</span>分</p>
     </div>
     <div class="scorerecord"><text>积分记录</text></div>
     <div class="scorelist" v-if="scoreList.length>0">
        <div class="scoreitem flex-container" v-for="(item,index) in scoreList" :key="index">
            <div class="flex-container clomn iteminfo">
                <p>{{item.Remark}}</p>
                <p>{{item.AddTime}}</p>
            </div>
            <div class="itembig" :class="{'active': !item.direction}">{{item.Change}}</div>
        </div>
     </div>
     <p style="text-align:center;font-size:30rpx;color:#666;padding:120rpx 20rpx 80rpx;" v-if="scoreList.length===0">暂无数据</p>
    <p class="ovedMsg" v-if="isOved" style="text-align:center;padding:20rpx;font-size:26rpx;color:#666;">我也是有底线的</p> 
  </div>
</template>

<script>
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow(){
    this.scoreList = [];
    this.memberInfo = {};
    this.setBarTitle();
    this.getMemberInfo();
    this.getScoreList();
  },
  data () {
    return {
      userId:wx.getStorageSync('userId'),
      token:wx.getStorageSync('token'),
      page:1,
      pageSize:15,
      scoreList:[],
      isHasInfo:false,
      isLoad:false,
      isOved:false,
      count:0,
      allPage:0,
      memberInfo:{}
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "我的积分"
      });
    },
    async getScoreList(){
      
      let result = await post("user/ScoreList",{
        UserId:this.userId,
        Token:this.token,
        page:this.page
      })
      this.count = result.count;
      if (parseInt(this.count) % this.pageSize === 0) {
        this.allPage = this.count / this.pageSize;
      } else {
        this.allPage = parseInt(this.count / this.pageSize) + 1;
      }
      if(result.data.length>0){
        for(let i=0;i<result.data.length;i++){
          result.data[i].Change = result.data[i].Change.split(".")[0];
          if(result.data[i].Change.substring(0,1)=="+"){
            this.$set(result.data[i],"direction",true);
          }else{
            this.$set(result.data[i],"direction",false);
          }
        }
        this.scoreList = this.scoreList.concat(result.data);
      }
      if(this.allPage > this.page){
        this.isLoad = true;
      }else{
        this.isLoad = false;
      }
      console.log("bbbbb");
      console.log(this.scoreList);
    },
    async getMemberInfo(){
      let result = await post("User/GetMemberInfo",{
         UserId: this.userId,
         Token:this.token
      });
      if(Object.keys(result.data).length >0){
        this.isHasInfo = true;
        this.memberInfo = result.data;
      }
    //   console.log(result);
    }
    
  },

  created () {
    // let app = getApp()
  },
  onPullDownRefresh(){
     
  },
  onReachBottom(){
    if(this.isLoad){
      this.page++;
      this.getScoreList();
    }else{
      if (this.page > 1) {
        this.isOved = true;
      } else {
        this.isOved = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
  @import "../../css/common.css";
</style>
