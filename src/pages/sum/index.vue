<template>
  <div class="backgray">
    <div class="suminfo white">
      <div class="title">
        <span>充值账户:</span>
        <span class="yellow" v-if="isHasInfo">{{memberInfo.Mobile}}</span>
      </div>
      <div class="flex-container charge" v-if="list.length>0">
        <div
          class="flex-container clomn chargeitem"
          :class="{'active':active===index}"
          v-for="(item,index) in list"
          :key="index"
          @click="shiftActive(index,item.Id)"
        >
          <p class="money">{{item.RechargeAmount}}元</p>
          <p class="minicoupon">多送{{item.ActualBalance-item.RechargeAmount}}元现金</p>
        </div>
      </div>
      <label class="flex-container chosepay" @click="shiftIsChecked">
        <div class="flex-container">
          <img src="/static/images/wx2.png" class="wxlogo">
          <p>微信支付</p>
        </div>
        <input type="checkbox" :checked="isChecked" @click.stop="shiftIsChecked" class="checkbox-cart">
      </label>
    </div>
    <div class="white botbtn flex-container">
      <div class="total">
        合计：
        <span>￥{{payPrice}}</span>
      </div>
      <div class="btncharge" @click="btnCharge">立即充值</div>
    </div>
  </div>
</template>

<script>
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow() {
    this.list = [];
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");
    this.setBarTitle();
    this.getMemberInfo();
    this.getRechargeList();
    this.WxOpenid=wx.getStorageSync("openId");
  },
  data() {
    return {
      userId: "",
      token: "",
      page: 1,
      pageSize: 20,
      list: [],
      active: 0,
      isHasInfo:false,
      memberInfo:{},
      payPrice:0,
      isChecked:true,
      WxOpenid:"",
      rechargeId:"",
      WxCode:""
    };
  },

  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "余额充值"
      });
    },
    orderpay() {
      wx.navigateTo({ url: "/pages/locationcomplete/main" });
    },
    shiftActive(index,id) {
      this.active = index;
      this.payPrice = this.list[index].RechargeAmount;
      this.rechargeId = id;
    },
    async getRechargeList() {
      let result = await post("Recharge/RechargeList", {
        UserId: this.userId,
        Token: this.token,
        page: this.page,
        pageSize: this.pageSize
      });
      if (result.data.length > 0) {
        this.list = this.list.concat(result.data);
      }
      this.payPrice = this.list[0].RechargeAmount;
      this.rechargeId = this.list[0].Id;
    },
    async getMemberInfo() {
      let result = await post("User/GetMemberInfo", {
        UserId: this.userId,
        Token: this.token
      });
      if (Object.keys(result.data).length > 0) {
        this.isHasInfo = true;
        this.memberInfo = result.data;
      }
      //   console.log(result);
    },
    async recharge(){
      let result = await post("Recharge/AddSmallRecharge",{
        UserId:this.userId,
        Token:this.token,
        SmallOpenid:this.WxOpenid,
        RechargeId:this.rechargeId,
      });
      if(result.code===0){
        let payData=JSON.parse(result.data.JsParam);
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success(res) { 
             wx.navigateTo({
              url:"/pages/wallet/main"
             });
          },
          fail(res) {

          }
        })
      }
    },
    shiftIsChecked(){
       this.isChecked = !this.isChecked;
    },
    btnCharge(){
      if(this.isChecked){
         this.recharge();
      }else{
        wx.showToast({
          title: '请选择支付方式',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  created() {
    // let app = getApp()
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
</style>
