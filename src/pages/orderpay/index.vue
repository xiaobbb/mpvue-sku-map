<template>
  <div>
    <!--支付-->
    <div class="glo-relative">
        <map id="map"  :longitude="longitude" :latitude="latitude"  scale="15" :controls="controls"  :markers="markers"   @markertap="markertap"   @regionchange="regionchange"   @controltap="controltap" show-location style="width: 100%; height:610rpx;"></map>
    </div>
    <!--item-->
    <div class="paymenu">
        <div class="ordertitle">
            <p>确认支付信息</p>
            <img src="/static/images/close.png" class="close">
        </div>
        <p class="menu">￥{{price || 1.00}}</p>
        <radio-group class="radio-group" @change="radioChange">
            <label class="radio" v-for="item in payitems" :key="item.id">
              <div class="flex-container payitem commonpad">
                  <div class="flex-container">
                      <img src="/static/images/wx.png" class="payimg" v-if="item.id==1">
                      <img src="/static/images/rmbbg.png" class="payimg" v-if="item.id==2">
                      <text style="margin-left:20rpx;"> {{item.value}}</text>
                  </div>
                  <radio :value="item.id" :checked="item.checked"/>
              </div>
            </label>
          </radio-group>
        <div class="paybtn" style="margin-top:50rpx;" @click="payMoney">立即支付</div>
    </div>
  </div>
</template>

<script>
import { get, myget, mypost, post, toLogin } from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync('token');
    this.password=wx.getStorageSync('password');
    this.setBarTitle();
    this.orderNo=this.$root.$mp.query.orderNo
    this.price=this.$root.$mp.query.price
  },
  data () {
    return {
      latitude: wx.getStorageSync("latitude"),
      longitude: wx.getStorageSync("longitude"),
      orderNo:"",//订单编号
      price:"",
      userId:"",
      token:"",
      password:"", //会员支付密码
      controls: [{  //控件不随着地图移动
          id: 1,
          iconPath: '/static/images/location.png',
          position: {
            left: 0,
            top: 500,
            width: 30,
            height: 30
          },
          clickable: true
      }],
      payitems:[
        {id:1,value:"微信支付",checked:'true'},{id:2,value:"余额支付"}
      ]
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "支付订单"
      });
    },
    payMoney(){
        //判断哪种支付方法
        for(let i=0;i<this.payitems.length;i++){
          if(this.payitems[i].checked){
            if(i==0){
              this.wxPay()
            }else{
              this.otherPay()
            }
          }
        }
    },
    async wxPay(){
      var res=await post("/Order/ConfirmWeiXinSmallPay",{
          UserId:this.userId,
          Token:this.token,
          //OrderNo:"201904111028561742883"
          OrderNo:this.orderNo
        })
        console.log(res,"微信支付")
        if(res.code==0){
            let payData=JSON.parse(res.data.JsParam);
            wx.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package,
            signType: payData.signType,
            paySign: payData.paySign,
            success(res) { 
              wx.navigateTo({
                url:"/pages/location/main"
              });
            },
            fail(res) {

            }
          })
        }
    },
    async otherPay(){
      console.log(this.password,"支付密码")
      var res=await post("/Order/PaymentOrder",{
          UserId:this.userId,
          Token:this.token,
          //OrderNo:"201904111028561742883",
          Password:this.password, //会员支付密码
          OrderNo:this.orderNo
        })
        console.log(res,"余额支付")
        if(res.code==0){
          //余额支付成功


          
        }
    },
    radioChange:function(e){
      for(const x in this.payitems){
        if(this.payitems[x].id==e.target.value){
          this.payitems[x].checked=true
        }else{
          this.payitems[x].checked=false
        }
      }
    },
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
  @import "../../css/common.css";
  .payimg{
    width:56rpx;
    height:56rpx;
}
</style>
