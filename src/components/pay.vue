<template>
  <div v-show="showPay">
    <!--遮罩层-->
    <div class="mask-modal" @click="goUrl"></div>
    <!--确认付款-->
    <div v-show="showPayType" class="paymask white">
      <div class="paytile">
        <img src="/static/images/close.png" class="close" @click="goUrl">
        <text>确认付款</text>
      </div>
      <div class="maskprice">￥{{total}}</div>
      <div class="flex-container maskitem">
        <div class="fontclolr">订单号</div>
        <div>{{orderNumber}}</div>
      </div>
      <div class="flex-container maskitem" @click="showPayType = false">
        <div class="fontclolr">付款方式</div>
        <div>
          <text class="wx">{{payType*1?'余额':'微信'}}</text>
          <img src="/static/images/back.png" class="right">
        </div>
      </div>
      <div class="flex-container maskitem" v-if="payType*1">
        <div class="fontclolr">支付密码</div>
        <input
          type="password"
          class="payPassword"
          max="6"
          placeholder="请输入支付密码"
          v-model="payPassword"
        >
      </div>
      <div class="paybtn btnbottom" @click="pay">确认付款</div>
    </div>
    <!--选择付款方式-->
    <div v-show="!showPayType" class="paymask white">
      <div class="paytile">
        <img
          src="/static/images/leftarrow.png"
          class="leftarrow leftposi"
          @click="showPayType = true"
        >
        <text>选择支付方式</text>
      </div>
      <div>
        <radio-group @change="changes">
          <label class="flex-container payitem">
            <div class="flex-center">
              <img src="/static/images/wx.png" class="payimg">
              微信
            </div>
            <input type="radio" name="payType" :checked="payType==0" value="0">
          </label>
          <label class="flex-container payitem">
            <div class="flex-center">
              <img src="/static/images/rmbbg.png" class="payimg">
              余额
            </div>
            <input type="radio" name="payType" :checked="payType==1" value="1">
          </label>
        </radio-group>
      </div>
    </div>
  </div>
</template>
<script>
// 引入组件，使用
// <Pay :showPay.sync="showPay" :orderNumber="orderNumber" :total="total" ></Pay>
// showPay.sync ---组件的显示隐藏状态。 orderNumber---订单号。 total---价格
// 扩展
// closeUrl ---关闭窗口跳转的页面。默认关闭窗口
// :successUrl="'/pages/myorder/main'"
// successUrl ---支付成功跳转的页面。
import { post } from "@/utils/index";
export default {
  props: {
    // 支付成功跳转地址，默认不跳转
    successUrl: {
      type: String,
      default: ""
    },
    // 点击取消跳转地址，默认关闭弹窗
    closeUrl: {
      type: String,
      default: ""
    },
    showPay: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0.0
    },
    orderNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 0--微信支付.1--余额支付
      payType: 0,
      showPayType: true,
      total: "",
      payPassword: Number
    };
  },
  watch: {
    payPassword() {
      if (this.payPassword.length > 6) {
        this.payPassword = this.payPassword.substring(0, 6);
        wx.showToast({
          title: "请输入正确的6位支付密码！",
          icon: "none"
        });
      }
    }
  },
  methods: {
    pay() {
      if (this.payType) {
        this.balance();
      } else {
        this.wx();
      }
    },
    //   微信支付
    async wx() {
      let result = await post("Order/ConfirmWeiXinSmallPay", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        WxOpenid: wx.getStorageSync("openId"),
        OrderNo: this.orderNumber
      });
      if (result.code === 0) {
        let payData = JSON.parse(result.data.JsParam);
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success(res) {
            wx.showToast({
              title: "支付成功"
            });
            setTimeout(() => {
              wx.redirectTo({
                url: this.successUrl
              });
            }, 1500);
          },
          fail(err) {
            // wx.showToast({
            //   title: "支付失败",
            //   icon: "none"
            // });
            // setTimeout(() => {
            //   wx.redirectTo({
            //     url: "/pages/myorder/main"
            //   });
            // }, 1500);
          }
        });
      } else {
        setTimeout(() => {
          wx.redirectTo({
            url: "/pages/myorder/main"
          });
        }, 1500);
      }
    },
    // 余额支付
    async balance() {
      const paswd = this.payPassword.toString();
      if (paswd.length !== 6) {
        this.payPassword = "";
        wx.showToast({
          title: "请输入正确的6位支付密码！",
          icon: "none"
        });
        return false;
      }
      try {
        let res = await post("Order/PaymentOrder", {
          UserId: wx.getStorageSync("userId"),
          Token: wx.getStorageSync("token"),
          Password: this.payPassword,
          OrderNo: this.orderNumber
        });
        wx.showToast({
          title: "支付成功"
        });
        setTimeout(() => {
          wx.redirectTo({
            url: this.successUrl
          });
        }, 1500);
      } catch (err) {
        this.payPassword = "";
      }
    },
    changes(e) {
      this.payType = e.mp.detail.value;
      this.showPayType = true;
      console.log(e);
    },
    goUrl() {
      if (this.closeUrl) {
        console.log("跳转");
        wx.redirectTo({ url: this.closeUrl });
      } else {
        console.log("关闭");
        this.$emit("update:showPay", false);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../pages/confirmorder/style";
@import "../css/common.css";
.flex-center {
  display: flex;
  align-items: center;
  img {
    margin-right: 20rpx;
  }
}
.payPassword {
  text-align: right;
}
</style>


