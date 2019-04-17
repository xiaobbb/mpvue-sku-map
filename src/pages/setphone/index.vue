<template>
  <div class="backgray setlist">
    <div class="setitem flex-container white">
      <div class="flex-container">
        <img src="/static/images/phonecon.png" class="phonecon">
        <input type="text" placeholder="请输入手机号" v-model="phoneNumber">
      </div>
      <img src="/static/images/back.png" class="right">
    </div>
    <div class="setitem flex-container white">
      <div class="flex-container">
        <img src="/static/images/passcon.png" class="passcon">
        <input type="text" placeholder="请输入验证码" v-model="verifyCode">
      </div>
      <text class="getpass" :class="btnText !== '获取验证码'?'noactive':''" @click="getVerifyCode()">{{btnText}}</text>
    </div>
    <div class="paybtn setbtn" @click="setPhone">确定</div>
  </div>
</template>

<script>
import { post} from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad() {
    this.setBarTitle();
  },
  data() {
    return {
      btnText: "获取验证码",
      phoneNumber: "",
      verifyCode: "",
      token: wx.getStorageSync("token"),
      userid: wx.getStorageSync('userId')
    };
  },

  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "设置手机号码"
      });
    },

    async setPhone() {
      if (!this.verifyCode) {
        wx.showToast({
          title: "验证码不能为空",
          icon: "none",
          duration: 2000
        });
      } else {
        const result = await post("User/UpdateMobile", {
          Mobile: this.phoneNumber,
          UserId: this.userid,
          VerifyCode: this.verifyCode,
          Token: this.token
        });
        wx.showToast({
          title: result.msg,
          icon: "success",
          duration: 2000
        });
      setTimeout(()=> {
      wx.navigateBack();
      },1500)
      }
    },
    async getVerifyCode() {
      const TIME_COUNT = 60; // 60s后重新获取验证码
      const phoneNum = this.phoneNumber;
      if (!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(phoneNum))) {
        wx.showToast({
          title: "请输入正确的手机号码！",
          icon: "none",
          duration: 2000
        });
      } else {
        const code = await post("User/GetBindTelCode", {
          Token: this.token,
          Mobile: this.phoneNumber,
          UserId: this.userid
        });
        wx.showToast({
          title: "短信已发送",
          icon: "success"
        });
        this.count = TIME_COUNT;
        const timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count -= 1;
            this.btnText = this.count + "s后重新获取";
            console.log(this.count, this.btnText);
          } else {
            clearInterval(timer);
            this.btnText = "获取验证码";
          }
        }, 1000);
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
.noactive{
  background:#aaa!important;

}
</style>
