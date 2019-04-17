<template>
  <div class="sectionPage">
    <div class="main">
      <div class="regLoginBox">
        <div class="logo">
          <div class="img">
            <img src="/static/images/shop5.png">
          </div>
        </div>
        <div class="from pd10">
          <div class="from-line">
            <span class="icon icon_phone"></span>
            <input type="text" class="ipt" placeholder="请输入手机号码" v-model="phoneNumber">
          </div>
          <div class="from-line">
            <span class="icon icon_code"></span>
            <input type="text" class="ipt" placeholder="请输入验证码" v-model="verifyCode">
            <!-- <div class="getcode" @click="getCode(this)">{{btnText}}</div> -->
            <button
              class="getcode"
              style="background:#ff5c29;font-size:28rpx;"
              @click="getVerifyCode(this)"
            >{{btnText}}</button>
          </div>
          <div class="from-line">
            <span class="icon icon_pwd"></span>
            <input type="password" class="ipt" placeholder="请输入密码" v-model="password">
          </div>
          <div class="from-line">
            <span class="icon icon_pwd"></span>
            <input type="password" class="ipt" placeholder="请输入密码" v-model="password2">
          </div>
          <div class="from-line from-txt inlineflex">
            <!-- <div class="IconsCK IconsCK-radio checked" style="margin-right:12rpx;vertical-align:top;"></div> -->
            <input type="checkbox" checked class="checkbox-cart">
            <text style="font-size:28rpx">我已阅读并同意</text>
            <text style="color:#ff5c29;font-size:28rpx">《用户协议》</text>
          </div>
        </div>
        <div class="ftbtn pd10">
          <a class="btn" @click="Register()">确认注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { host, post, get } from "../../utils";
import logins from '@/utils/login'
import "../../css/login.css";
import "../../css/common.css";
import "../../css/global.css";
//var qcloud = require("wafer2-client-sdk/index.js");
export default {
  created() {},
  onShow() {
    this.setBarTitle();
  },
  data() {
    return {
      btnText: "获取验证码",
      phoneNumber: "",
      verifyCode: "",
      password: "",
      password2: ""
    };
  },
  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "注册"
      });
    },
    //注册账号 访问接口:BindOrRegister
    async Register() {
      if (
        this.phoneNumber == "" ||
        this.verifyCode == "" ||
        this.password == "" ||
        this.password2 == ""
      ) {
        wx.showToast({
          title: "字段不能为空",
          icon: "none",
          duration: 2000
        });
      } else if (this.password !== this.password2) {
        wx.showToast({
          title: "两次输入的密码不一致",
          icon: "none",
          duration: 2000
        });
      } else {
        //   var result = await post("/Login/MobileRegister",{
        //   Mobile:this.phoneNumber,
        //   VerifyCode:this.verifyCode,
        //   Password:this.password,
        // });
        var userinfo = wx.getStorageSync("userInfo");
        var openid = wx.getStorageSync("openId");
        var token = wx.getStorageSync("token");
        var unionid = wx.getStorageSync("unionid");
        wx.request({
          url: "https://carapi.wtvxin.com/api/Login/BindOrRegister", //仅为示例，并非真实的接口地址
          method: "POST",
          data: {
            mobile: this.phoneNumber,
            yzcode: this.verifyCode,
            unionid: unionid, //微信统一unionid号
            userInfo: userinfo,
            password: this.password,
            openId: openid
          },
          header: {
            "content-type": "application/json" // 默认值
          },
          success: function(res) {
            console.log(res.data);
            if (res.data.meta.code === 1) {
              wx.showToast({
                title: "绑定手机成功",
                icon: "success",
                duration: 2000,
                complete: function() {
                  //绑定手机成功之后,延时2秒跳转到会员中心
                  setTimeout(function() {
                    // 登录
                    logins(true)
                    // wx.switchTab({
                    //   url: "/pages/mine/main"
                    // });
                  }, 1500);
                }
              });
              //绑定手机成功之后，跳转到会员中心
            } else {
              wx.showToast({
                title: res.data.meta.message, //提示的内容,
                icon: "none", //图标,
                duration: 1500, //延迟时间,
                mask: false, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            }
          }
        });
      }
    },
    getVerifyCode(that) {
      const TIME_COUNT = 60; // 60s后重新获取验证码
      var codeNum = this.verificationCode;
      var phoneNum = this.phoneNumber;
      if (phoneNum === "") {
        wx.showToast({
          title: "手机号不能为空",
          icon: "none",
          duration: 2000
        });
      } else {
        //发送绑定手机验证码：http://scapi.wtvxin.com/api/services/app/Account/SendBindingSecurityCode
        this.sendbindcode(this.phoneNumber);
        wx.showToast({
          title: "短信已发送",
          icon: "success",
          duration: 2000
        });
        if (!this.timer) {
          this.count = TIME_COUNT;

          that.disabled = "disabled";
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
              this.btnText = this.count + "s后重新获取";
            } else {
              that.disabled = "";
              clearInterval(this.timer);
              this.timer = null;
              this.btnText = "获取验证码";
            }
          }, 1000);
        }
      }
    },
    //发送绑定手机验证码
    sendbindcode(phoneNum) {
      //console.log(this.phoneNumber)
      //  var result = get("/Login/GetMiniAppBindTelCode?mobile="+this.phoneNumber);
      var result = get("Login/GetMiniAppBindTelCode", {
        Mobile: this.phoneNumber
      });
      console.log(result);
      //console.log("999999999999999999999");
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
