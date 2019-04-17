<template>
  <div>
      <!--导航栏-->
      <div class="title">
          <div class="ranktitle" v-for="(item,index) in titlelist" :key="index" :class="{active:active==index}" @click="change(index)">{{item.name}}</div>
      </div>
      <div class="slide"></div>
      <!--排行list-->
      <div class="ranklist">
          <div class="rankitem flex-container" v-for="(item,pindex ) in datalist" :key="item.pindex" @click="showShopDetail(pindex)">
              <div class="flex-container shopnum">
                  <div class="options">
                    <img src="/static/images/1.png" class="nums" v-if="pindex+1==1">
                    <img src="/static/images/2.png" class="nums" v-if="pindex+1==2">
                    <text v-if="pindex+1>2">{{pindex+1}}</text>
                  </div>
                  <div class="flex-container rankinfo">
                    <img :src="item.Logo" class="shopimg">
                    <div class="rankcol">
                        <p class="shopname">{{item.ShopName}}</p>
                        <p>
                            <img src="/static/images/xing.png" class="xing-point">
                            <img src="/static/images/xing.png" class="xing-point">
                            <img src="/static/images/xing.png" class="xing-point">
                            <img src="/static/images/xing.png" class="xing-point">
                            <img src="/static/images/xing.png" class="xing-point">
                            <text>{{item.ServiceScore}}.0分</text>
                        </p>
                    </div>
                  </div>
              </div>
              <div class="ranknums">
                  <p>{{item.TransactionNumber}}</p>
                  <p>成交数量</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { host,post,get } from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
    this.getShopBrank()
  },
  data () {
    return {
      active:"0",
      datalist:[],
      titlelist:[
        {id:1,name:"日榜"},{id:2,name:"周榜"},{id:3,name:"月榜"}
      ]
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "门店排行榜"
      });
    },
    change(e){
      this.active=e
      this.getShopBrank()
    },
    getShopBrank(){
     // console.log(this.datalist)
      wx.request({
      url:"http://carapi.wtvxin.com/api/Shop/StoreRanking", //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        Sort:this.active
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) =>{
        wx.hideLoading();
        //console.log(res.data)
        if(res.data.code==0){
         this.datalist=res.data.data
         //console.log(this.datalist)
        }
       },
      
      
      })
    
    },
    showShopDetail(e){
      //console.log(this.datalist[e].ShopId,"排行榜发送")
      var shopid=this.datalist[e].ShopId
      wx.navigateTo({ url: "/pages/shopdetail/main?shopid="+shopid });
    }
    
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
  @import "../../css/common.css";
</style>
