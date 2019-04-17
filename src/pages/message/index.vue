<template>
  <div class="backgray">
      <div class="msglist" v-if="newsList.length>0">
          <div v-for="(item,index) in newsList" :key="index" class="mesitem flex-container clomn" @click="showDetail(item.Id)">
              <div class="time">{{item.Addtime}}</div>
              <div class="itemdesc white">
                  <div class="title">{{item.Title}}</div>
                  <div class="flex-container">
                      <img v-if="item.PicNo !='' " :src="filePath+item.PicNo" class="infomsg">
                      <img v-else src="/static/images/content.png" class="infomsg">
                      <p class="infodesc">{{item.ContentAbstract}}>></p>
                  </div>
              </div>
          </div>
          <!-- <div class="mesitem flex-container clomn">
              <div class="time">{{time}}</div>
              <div class="itemdesc white">
                  <div class="title">爱车有道-涡轮增压</div>
                  <div class="flex-container">
                      <img src="/static/images/voice.png" class="infomsg">
                      <p class="infodesc">带涡轮的汽车保养时，注意一下几点，可以 多开几年>></p>
                  </div>
              </div>
          </div> -->
      </div>
      <p style="text-align:center;font-size:30rpx;color:#666;padding:120rpx 20rpx 80rpx;" v-if="newsList.length===0">暂无数据</p>
      <p class="ovedMsg" v-if="isOved" style="text-align:center;padding:20rpx;font-size:26rpx;color:#666;">我也是有底线的</p> 
  </div>
</template>

<script>
import { post,filePath } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow(){
    this.newsList = [];
    this.setBarTitle();
    this.getFindNewsList();
  },
  data () {
    return {
      userId:"",
      token:"",
      page:1,
      pageSize:15,
      newsList:[],
      time:"",
      filePath:filePath,
      isLoad:false,
      isOved:false,
      count:0,
      allPage:0,
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "我的消息"
      });
    },
    showDetail(id){
      wx.navigateTo({ url: "/pages/messagedetail/main?id="+id });
    },
    format(time){
      let arr = time.split("T")[0].split("-");
      let str = '';
      if(arr.length>0){
        str = arr[0] + "年" + arr[1] + "月" + arr[2] + "月";
      }
      return str
    },
    async getFindNewsList(){
      let result = await post("News/FindNewsList",{
        UserId:this.userId,
        Token:this.token,
        page:this.page,
        pagesize:this.pageSize
      });
      this.count = result.count;
      if (parseInt(this.count) % this.pageSize === 0) {
        this.allPage = this.count / this.pageSize;
      } else {
        this.allPage = parseInt(this.count / this.pageSize) + 1;
      }
      if(result.data.length>0){
        for(let i=0;i<result.data.length;i++){
          result.data[i].Addtime = this.format(result.data[i].Addtime);
          if(result.data[i].Title.length>20){
           result.data[i].Title = result.data[i].Title.substr(0,20)+"...";
          }
          result.data[i].ContentAbstract = result.data[i].ContentAbstract.substr(0,30);
        }
        this.newsList = this.newsList.concat(result.data);
      }
      if(this.allPage > this.page){
        this.isLoad = true;
      }else{
        this.isLoad = false;
      }
    }
    
  },

  created () {
    // let app = getApp()
  },
  onReachBottom(){
    if(this.isLoad){
      this.page++;
      this.getFindNewsList();
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
