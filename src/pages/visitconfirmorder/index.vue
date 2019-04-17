<template>
  <div class="backgray">
    <div>
      <!---->
      <div class="flex-container clomn  ordershophead white">
          <div class="orderserve">服务商家</div>
          <div class="flex-container ordermain" v-if="orderinfo.length>0">
              <img :src="orderinfo[0].ShopData[0].Logo" class="ordershopimg" >
              <div class="flex-container clomn orderplace">
                  <p class="placename">{{orderinfo[0].ShopData[0].ShopNick}}</p>
                  <p>{{orderinfo[0].ShopData[0].Address}}</p>
              </div>
          </div>
          <div class="ordertips">(温馨提示：请核对收货地址是否正确)</div>
      </div>
      <div class="slide"></div>
      <!--订单详情-->
      <div class="white proinfo">
          <div class="orderserve">服务项目</div>
          <div class="flex-container ordermain">
              <img :src="orderinfo[0].PicNo" class="ordershopimg">
              <div class="flex-container clomn orderplace">
                  <p class="placename detailright">{{orderinfo[0].Name}}</p>
                  <p>￥{{orderinfo[0].Price}}</p>
              </div>
          </div>
          <div class="flex-container infoslide white pad" @click="choseItem(1)">
              <div>服务车辆</div>
              <div>
                  <span v-if="CarInfo">{{CarInfo}}</span>
                  <img src="/static/images/back.png" class="right" v-else>
              </div>
          </div>
          <div class="flex-container infoslide white pad" @click="choseItem(3)">
              <div>优惠券</div>
              <div>
                  <span v-if="couponPrice*1">-{{couponPrice}}</span>
                  <img src="/static/images/back.png" class="right" v-else>
              </div>
              <!-- <div>
                  <img src="/static/images/back.png" class="right">
              </div> -->
          </div>
          <div class="flex-container infoslide white pad" @click="choseItem(5)">
              <div>服务卡券</div>
              <div>
                  <span v-if="CardTicketName">-{{CardTicketName}}</span>
                  <img src="/static/images/back.png" class="right" v-else>
              </div>
          </div>
          <div class="infoslide inputbor flex-container white pad">
              <div>买家留言</div>
              <input type="text" placeholder="填写内容已和卖家协商确认" class="inputmes" v-model="Remarks">
          </div>
          <div class="infoslide slideprice white pad">合计：<span>￥{{total}}</span></div>
      </div>
      <!--底部按钮-->
      <div class="botbtn">
          <div class="price white">合计: <span>￥{{total}}</span></div>
          <div class="btnconfir" @click="goPay">提交订单</div>
      </div>
      <!--遮罩层-->
    <orderCount :showCoupon.sync="showCoupon" :couponId.sync = "CouponId" :couponList="couponList" :couponPrice.sync="couponPrice" ></orderCount>
    <orderCard :showCoupon.sync="showCardTicket" :CardTicketId.sync="CardTicketId" :couponList="couponList" :CardTicketPrice.sync="CardTicketPrice"></orderCard>
    </div>
    <Pay :showPay.sync="showPay" :orderNumber="orderNumber" 
    :total="total" :successUrl="'/pages/myorder/main'" :closeUrl="'/pages/myorder/main'"
    ></Pay>
    <!-- <div>  
        <div class="lasttime white">剩余支付时间  <span>{{minute}}</span> : <span>{{second}}</span></div>
        <div class="flex-container white commonpad">
            <p class="strong">应付金额</p>
            <p class="shouldpay">￥{{totalPrice}}</p>
        </div>
        <div class="slide"></div>
        <div class="white">
            <div class="itempay commonpad">选择第三方支付，剩余支付<span class="shouldpay">¥{{totalPrice}}</span>元</div>
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
        </div>
        <div class="btncharge" @click="payMoney">立即支付</div>
    </div> -->
  </div>
</template>

<script>
import { get, myget, mypost, post, toLogin } from "../../utils";
import orderCount from '@/components/orderCount.vue'
import Pay from '@/components/pay.vue'
import orderCard from '@/components/orderCard.vue'
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow(){
    this.showPay = false
    this.setBarTitle();
    //获取vuex商品信息
    this.proid=this.$store.state.visitconfirmorder.ProductId
    this.lat=wx.getStorageSync('latitude');
    this.lng=wx.getStorageSync('longitude');
    this.Token=wx.getStorageSync('token');
    this.UserId=wx.getStorageSync('userId');
    this.Password=wx.getStorageSync('password');
    const carInfo=wx.getStorageSync('CarInfo');
    this.CarInfoId=carInfo.Id
    this.CarInfo=carInfo.CarBrand+carInfo.CarType+carInfo.CarColor
    this.getOrderInfo()
    console.log(this.proid,this.Token,this.UserId,this.CarInfoId)
    this.changeTime()
    if(this.CarInfoId){
      this.getTotal()//获取订单总金额
    }
  },
  data () {
    return {
      showPay:false,
      couponList:[],//子组件展示信息
      CardTicketData:[],//卡券列表
      CouponData:[],//优惠券列表
      isshow:true,
      proid:"", //产品id
      CarInfoId:"",//车辆id
      CarInfo:"",
      CouponId:"0",//优惠券id
      CardTicketId:"0",//服务卡券id
      couponPrice:"0.00",
      CardTicketPrice:"0.00",
      Token:"",
      UserId:"",
      orderNumber:"",//订单编号
      Password:"",
      Remarks:"",
      orderinfo:[],
      orderParmar:"", ////////////
      minute:10,
      second:'00',
      timer:"",
      a:4,
      payitems:[
        {id:1,value:"微信支付",checked:'true'},{id:2,value:"余额支付"}
      ],
      showCoupon:false,//组件
      showCardTicket:false,
      totalPrice:"",//总价格
    }
  },
  computed:{ //计算之后的总价格
    total(){
      let totals = 0;
      totals= this.totalPrice-this.couponPrice-(this.totalPrice*this.CardTicketPrice)
      return  totals.toFixed(2)
    }    
  },
  components: {
    orderCount,orderCard,Pay
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "确认订单"
      });
    },
    async getOrderInfo(){ //获取订单信息
      var result=await post("/Order/ServiceProductsFirmOrder",{
        UserId:this.UserId,
        Token:this.Token,
        ProductId:this.proid
      })
      if(result.code==0){
        this.orderinfo=result.data
        this.CouponData=result.data[0].CouponData
        this.CardTicketData=result.data[0].CardTicketData
        console.log(result.data,"确认页面详情")
      }
    },
    choseItem(e){
      if(e==1){   //我的车辆
           wx.navigateTo({ url: "/pages/mycar/main?url=visitconfirmorder"});
      }else if(e==3){ //优惠券
          this.showCoupon=true
          this.title="请选择优惠券"
          this.couponList=this.CouponData
      }else{   //服务卡券
          this.showCardTicket=true
          this.title="请选择服务卡券"
          this.couponList=this.CardTicketData
      }
      console.log(this.couponList)
    },
    radioChange(e){
      for(const x in this.payitems){
        if(this.payitems[x].id==e.target.value){
          this.payitems[x].checked=true
        }else{
          this.payitems[x].checked=false
        }
      }
    },
    //获取订单总金额
    async getTotal(){
        wx.setStorageSync('CarInfo',"");
        var result=await post("/Order/ServiceProductsPlaceOrderVerifyAmount",{
          UserId:this.UserId,
          Token:this.Token,
          ProductId:this.proid,
          CarInfoId:this.CarInfoId,
          CouponId:this.CouponId,
          CardTicketId:this.CardTicketId,
          Remarks:this.Remarks
      })
      console.log(result,"获取订单总金额")
      if(result.code==0){
        this.totalPrice=result.data.allPayMoney
      }
    },
    async goPay(){  //提交支付
      console.log(this.UserId,this.proid,this.CarInfoId,this.CouponId,this.CardTicketId,"提交信息")
      if(this.CarInfoId){
          this.isshow=false
          var result=await post("/Order/ServiceProductsPlaceOrder",{
            UserId:this.UserId,
            Token:this.Token,
            ProductId:this.proid,
            CarInfoId:this.CarInfoId,
            CouponId:this.CouponId,
            CardTicketId:this.CardTicketId,
            Remarks:this.Remarks
        })
        console.log(result,"发起支付请求")
        if(result.code==0){
            this.orderNumber=result.data
            setTimeout(()=> {
            this.showPay=true
            },500)
        }
      }else{
          wx.showToast({
            title: "请选择服务车辆",
            icon: "none",
            duration: 2000
          });
          return false
      }
      
    },
    // payMoney(){
    //     //判断哪种支付方法
    //     for(let i=0;i<this.payitems.length;i++){
    //       if(this.payitems[i].checked){
    //         console.log(i)
    //         if(i==0){
    //           this.wxPay()
    //         }else{
    //           this.otherPay()
    //         }
    //       }
    //     }
    // },
    // async wxPay(){
    //   var res=await post("/Order/ConfirmWeiXinSmallPay",{
    //        UserId:this.UserId,
    //        Token:this.Token,
    //       OrderNo:this.orderNumber
    //     })
    //     if(res.code==0){
    //         let payData=JSON.parse(res.data.JsParam);
    //         wx.requestPayment({
    //         timeStamp: payData.timeStamp,
    //         nonceStr: payData.nonceStr,
    //         package: payData.package,
    //         signType: payData.signType,
    //         paySign: payData.paySign,
    //         success(res) { 
    //           wx.navigateTo({
    //             url:"/pages/visitconfirmorder/main"
    //           });
    //         },
    //         fail(res) {

    //         }
    //       })
    //    }
    // },
    // async otherPay(){
    //   console.log(this.password,"支付密码")
    //   var res=await post("/Order/PaymentOrder",{
    //        UserId:this.UserId,
    //       Token:this.Token,
    //       Password:this.password, //会员支付密码
    //       OrderNo:this.orderNumber
    //     })
    //     console.log(res,"余额支付")
    //     if(res.code==0){
    //       //余额支付成功
          
    //     }
    // },
    // async getOrderParam(){  //获取订单支付金额及支付剩余时间
    //     if(this.OrderNo){
    //         var result=await post("/Order/GetOrderParam",{
    //           UserId:this.UserId,
    //           Token:this.Token,
    //           OrderNo:this.OrderNo
    //         })
    //         console.log(result,"获取订单金额 剩余支付时间")
    //         if(result.code==0){
    //           this.orderParmar=result.data
    //           this.minute=result.data.ExpireTime
    //       }
    //     }
    // },
    //定时器支付时间变化
    changeTime(){
      this.timer=setInterval(
        ()=>{
        if(this.second==='00'){
          this.second=59
          this.minute--
        }
        this.second--
        if(!this.second.toString()[1]){
          this.second=`0${this.second}`
        }
        if(!this.minute.toString()[1]){
          this.minute=`0${this.minute}`
        }
        if(this.minute==="00"){
          clearInterval(this.timer)
        }
      },2000)
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
</style>
