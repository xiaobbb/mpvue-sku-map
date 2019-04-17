<template>
  <div>
      <!--顶部图片-->
      <div>
        <img :src="detailinfo.PicData[0].PicUrl" class="bg">
      </div>
      <div class="item">
          <div class="title">{{detailinfo.Name}}</div>
          <div class="complain">{{detailinfo.Synopsis}}</div>
          <div class="flex-container iteminfo">
              <p>已售{{detailinfo.SalesVolume || 0}}件</p>
              <p>今日仅剩<span>{{detailinfo.Stock}}</span>件</p>
          </div>
      </div>
      <div class="hr"></div>
      <!--服务项目-->
      <div class="flex-container item">
          <div>
              <div class="sertitle">服务项目</div>
              <div class="sercomplain">{{detailinfo.Name}}</div>
              <div class="flex-container iteminfo">
                  <p>
                    <img src="/static/images/gou.png" class="pics">
                    <text>未消费，随时退</text>
                  </p>
                  <p>
                    <img src="/static/images/gou.png" class="pics">
                    <text>过期退</text>
                  </p>
              </div>
          </div>
          <div class="price">￥{{detailinfo.Price || 0}}</div>
      </div>
      <div class="hr"></div>
      <!--位置-->
      <div class="flex-container item">
          <div>
              <p class="sertitle">{{detailinfo.ShopData[0].ShopNick}}</p>
              <p class="sercomplain">{{detailinfo.ShopData[0].Address}}</p>
          </div>
          <div class="flex-container range">
            <p class="location" @click="getMap">
                <img src="/static/images/bg9.png" class="big">
                <img src="/static/images/to.png" class="small">
            </p>
            <p>{{detailinfo.ShopData[0].Distance}}km</p>
          </div>
      </div>
      <div class="slide"></div>
      <!--评分-->
      <div class="point" v-if="commonlist.length>0">
        <div class="flex-container">
            <p class="left">
              <text>评分</text><text>4.0</text>
            </p>
            <p @click="showAllComment">
              <text>{{ commonlist.length || 0 }}条评论</text>
              <img src="/static/images/back.png" class="arrowback">
            </p>
        </div>
        <div class="pointsheet">
            <pointChildpic :commonlist="commonlist" v-if="commonlist.length>0" :showPic="false"></pointChildpic>
        </div>
      </div>
      <div class="slide"></div>
      <!--购买须知-->
      <div class="point pointnow" style="margin-bottom:100rpx;">
          <div class="main">购买需知</div>
          <div class="pmenu">
              <img src="/static/images/time.png" class="tippic">
              <div>
                <p  class="fsize">适用车型</p>
                <p class="carcor">五座轿车</p>
              </div>
          </div>
          <div class="pmenu">
              <img src="/static/images/time.png" class="tippic">
              <div>
                <p  class="fsize">适用车型</p>
                <p class="carcor">五座轿车</p>
              </div>
          </div>
      </div>
      <!--支付-->
      <div class="btn"> 
          <div class="btnmoney">￥{{detailinfo.Price || 0}}</div>
          <div class="btncharge" @click="toPay(detailinfo.Id)">去结算</div>
      </div>

  </div>
</template>

<script>
import { get, myget, mypost, post, toLogin } from "../../utils";
import pointChildpic from "@/components/pointChildpic"; //公用评论带图片组件
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
    this.proid=this.$root.$mp.query.proid;
    this.shopLat=this.$root.$mp.query.shopLat;
    this.shopLng=this.$root.$mp.query.shopLng;
    this.lat=wx.getStorageSync('latitude');
    this.lng=wx.getStorageSync('longitude');
    this.Token=wx.getStorageSync('token');
    this.UserId=wx.getStorageSync('userId');
    this.getSerdetail()
    console.log(this.shopLng,this.shopLat,"商铺经纬度")
  },
  data () {
    return {
      shopLat:"",  //商铺经纬度 
      shopLng:"",
       name:"",
       address:"",
       proid:"",
       lat:"",
       lng:"",
       Token:"",
       UserId:"",
       detailinfo:[],
       commonlist:[]
      
    }
  },
 
  components: {
    pointChildpic
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "服务详情"
      });
    },
    async getSerdetail(){
        var result=await post("/Server/ServiceProductsDetails",{
            UserId:this.UserId,
            Token:this.Token,
            ProductId:this.proid,
            Lat:this.lat,
            Lng:this.lng
        })
        if(result.code==0){
            this.detailinfo=result.data[0];
            this.address=result.data[0].ShopData[0].ShopNick
            this.name=result.data[0].ShopData[0].Address
            this.commonlist=result.data[0].CommentData;
            this.$set(result.data[0].ShopData[0],"Distance",parseFloat(result.data[0].ShopData[0].Distance).toFixed(2))
            console.log(this.detailinfo,"服务详情");
            this.address=result.data[0].ShopData[0].Address
            this.name=result.data[0].ShopData[0].ShopNick 
            //console.log("数据长度："+this.commentlist.length);
        }
    },
    showAllComment(){
        wx.navigateTo({ url: "/pages/shopcommentlist/main?proid="+this.proid });
    },//获取所有评价
    getMap(){
       wx.openLocation({
        latitude:this.shopLat*1,
        longitude:this.shopLng*1,
        address:this.address,
        name:this.name,
        scale: 18
      })
    },
    toPay(e){//跳转到确认订单页面
      this.$store.commit("setVisitConfirmOrder",{
          ProductId:e
      })
      wx.navigateTo({ url: "/pages/visitconfirmorder/main" });
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
