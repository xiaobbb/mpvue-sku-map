<template>
  <div v-if="hasData">
    <div class="remind">
      <text v-if="shwoSuccess">{{info.StatusName}}</text>
    </div>
    <div class="flex-container orderhead white">
        <img src="/static/images/place.png" class="place">
        <div class="clomn personinfo">
            <div class="orderuser">
                <p>{{info.ContactName}}</p>
                <p>{{info.TelephoneNumber}}</p>
            </div>
            <div>{{info.Address}}</div>
        </div>
    </div>
    <div class="slide"></div>
    <div class="flex-container prodetail" v-for="(item,index) in info.orderDetails" :key="index">
        <div class="orderpics">
            <img :src="item.ProductImg" class="orderpics">
        </div>
        <div class="proright">
            <div class="clomn protitle">
              <p>{{item.ProductName}}</p>
            </div>
            <div class="flex-container">
              <p class="ordercolor flex1"><span v-if="item.ProductSkuName">{{item.ProductSkuName}}</span><span v-else>无规格属性</span></p>
              <p class="ordercolor">x{{item.ProductCount}}</p>
            </div>
            <p>￥{{item.UnitPrice}}</p>
        </div>
    </div>
    <div class="orderlist">
        <div class="orderitem padtop">
            <!-- <div class="flex-container">
                <p>运费（快递）</p>
                <p>￥{{info.ExpressPrice}}</p>
            </div> -->
            <div class="flex-container">
                <p>订单总价</p>
                <p>￥{{info.TotalPrice}}</p>
            </div>
            <div class="flex-container">
                <p>优惠</p>
                <p>-¥0.00</p>
            </div>
        </div>
        <div class="flex-container padtop">
              <p>需付款</p>
              <p class="pricecolor">￥{{info.TotalPrice}}</p>
        </div>
    </div>
    <div class="slide"></div>
    <div class="orderinfo">
        <p class="infotitle">订单信息</p>
        <p class="pitem">订单编号：{{info.OrderNumber}} <span class="copy">复制</span></p>
        <p class="pitem">创建时间：{{info.AddTime}}</p>
        <p class="pitem" v-if="info.StatusId !==0">支付时间：{{item.PayTime}}</p>
        <!-- <div v-if="shwoSuccess">
            <p class="pitem">到店时间：2018-04-20 17:20:59</p>
            <p class="pitem">成交时间：2018-04-20 18:20:59</p>
        </div> -->
    </div>
    <div class="flex-container tipmenu">
        <p class="flex-container">
            <img src="/static/images/phonecall.png" class="tippics1">
            <span>拨打电话</span>
        </p>
        <p class="flex-container">
            <img src="/static/images/kefu.png" class="tippics2">
            <span>在线客服</span>
        </p>
    </div>
    <div class="slide"></div>
    <div class="backgray">
        <div class="orderbottom white" v-if="showDefaule">
            <p @click="cancleOrder">取消订单</p>
            <p @click="goToPay">付款</p>
        </div>
        <!--删除订单 重新购买-->
        <div class="orderbottom white" v-if="showDelOrder">
            <p>删除订单</p>
            <p>重新购买</p>
        </div>
        <!--买家已付款-->
        <div class="orderapybottom white " v-if="showPay">
            <p>再次购买</p>
        </div>
        <!--交易成功-->
        <div class="orderapybottom white " v-if="shwoSuccess">
            <p @click="addCommont">去评价</p>
        </div>
    </div>
    <!--遮罩层是否删除订单-->
    <div class="mask-modal" v-if="showMask"></div>
    <!--删除遮罩层-->
    <div v-if="showDelete" class="maskdelete">
        <div class="title">
          <text>您的订单尚未付款成功，确 认要取消本订单吗？</text>
        </div>
        <div class="flex-container bottombtn">
            <div>取消</div>
            <div @click="confirmDel">确认</div>
        </div>
    </div>
    <!--拨打电话遮罩层-->
    <div v-if="showCall" class="maskcall">
        <div class="title call">
          <text>400-118-5222</text>
        </div>
        <div class="flex-container bottombtn">
            <div>取消</div>
            <div @click="confirmDel">呼叫</div>
        </div>
    </div>
      
  </div>
</template>

<script>
import { post } from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
  },
  onShow(){
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");
    this.orderNo = this.$root.$mp.query.orderNo;
    this.getOrderDetails();
  },
  data () {
    return {
      userId:"",
      token:"",
      orderNo:"",
      orderItemNum:"",//发表评论的订单编号
      info:{},
      hasData:false,
      showMask:false,
      showCall:false,
      showDefaule:false,
      showCancleorder:false,
      showPay:false,
      showDelete:false,
      showDelOrder:false,
      shwoSuccess:true
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "订单详情"
      });
    },
    cancleOrder(){
      this.showDelete=true,
      this.showMask=true,
      this.showDefaule=false
    },
    goToPay(){
      this.showPay=true,
      this.showDelete=false,
      this.showDefaule=false
    },
    confirmDel(){
      this.showMask=false,
      this.showDelete=false,
      this.showDelOrder=true
    },
    addCommont(){
      wx.navigateTo({ url: "/pages/addcomment/main?orderNo="+this.orderItemNum+"&url=addcomment"});
    },
    async getOrderDetails(){
      let result = await post("Order/OrderDetails",{
        UserId:this.userId,
        Token:this.token,
        OrderNo:this.orderNo
      })
      console.log(result,"订单详情")
      if(Object.keys(result.data).length>0){
        this.info = result.data;
        this.orderItemNum=result.data.OrderNumber
        console.log(this.orderItemNum,"子单号")
        this.hasData = true;
      }
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
