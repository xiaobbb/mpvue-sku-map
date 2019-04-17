<template>
  <div class="backgray setlist">
    <div class="setitem flex-container white">
          <p>绑定手机号码</p>
          <p class="flex-container" v-if="showPhone" @click="bindPhone()">
              <text class="radius">立即绑定</text>
              <img src="/static/images/back.png" class="right">
          </p>
          <p class="flex-container" v-else @click="bindPhone()">
              <text class="phonecolor">{{phone}}</text>
              <text class="radius circle">重新绑定</text>
              <img src="/static/images/back.png" class="right">
          </p>
      </div>
      <div class="setitem flex-container white">
          <p>设置支付密码</p>
          <p class="flex-container">
              <text class="radius" v-if="showPass" @click="bandItem(2)">立即设置</text>
              <text class="radius circle" v-else @click="bandItem(2)">重新设置</text>
              <img src="/static/images/back.png" class="right">
          </p>
      </div>
      <div class="setitem flex-container white" @click="bandItem(3)">
          <p>地址管理</p>
          <p >
              <img src="/static/images/back.png" class="right">
          </p>
      </div>
      <div class="setitem flex-container white" @click="bandItem(4)">
          <p>意见反馈</p>
          <p >
              <img src="/static/images/back.png" class="right">
          </p>
      </div>
      <div class="setitem flex-container white"  @click="bandItem(5)">
          <p>防伪质保查询</p>
          <p>
              <img src="/static/images/back.png" class="right">
          </p>
      </div>
  </div>
</template>

<script>
import {post} from '@/utils/index'
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync('token');
    this.setBarTitle();
    this.getData()
  },
  data () {
    return {
      showPhone:true,
      phone:'',
      showPass:true,
      userId:"",
      token:""
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "设置"
      });
    },
    async getData(){
      const params ={
        UserId: this.userId,
        Token: this.token
      }
      const res =await post('User/SettingPageData',params)
      this.showPhone = !res.data.IsMobile;
      this.showPass = !res.data.IsPayPwd;
      this.phone = res.data.Mobile
    },
    bindPhone(){
         wx.navigateTo({ url: "/pages/setphone/main" });
    },
    bandItem(a){
      // if(a==1){
      //    wx.navigateTo({ url: "/pages/setphone/main" });
      // }
      console.log(a)
      if(a==2){
         wx.navigateTo({ url: "/pages/setpassword/main" });
      }
      if(a==3){
         wx.navigateTo({ url: "/pages/sitemanage/main" });
      }
      if(a==4){
         wx.navigateTo({ url: "/pages/setoption/main" });
      }
      if(a==5){
         wx.navigateTo({ url: "/pages/qualityQuery/main" });
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
</style>
