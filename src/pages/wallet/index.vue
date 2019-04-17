<template>
  <div class="backgray">
      <div class="orange flex-container clomn">
        <p class="hint">余额(元)</p>
        <p class="score" v-if="isHasInfo"><span v-if="memberInfo.Wallet===0">0.00</span><span v-else>{{memberInfo.Wallet}}</span></p>
     </div>
     <div class="white">
        <div class="flex-container waitem" @click="toSum">
            <img src="/static/images/sum.png" class="walletlogo">
            <p>余额充值</p>
        </div>
        <div class="flex-container waitem" @click="toMoneyDetail">
            <img src="/static/images/capital.png" class="walletlogo">
            <p>资金明细</p>
        </div>
     </div>
  </div>
</template>

<script>
import {post} from '@/utils/index'
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow(){
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync('token');
    this.isHasInfo = false;
    this.memberInfo= {};
    this.setBarTitle();
    this.getMemberInfo();
  },
  data () {
    return {
      isHasInfo:false,
      userId:"",
      token:"",
      memberInfo:{}
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "我的钱包"
      });
    },
    toSum(){
      wx.navigateTo({ url: "/pages/sum/main" });
    },
    toMoneyDetail(){
      wx.navigateTo({ url: "/pages/moneydetail/main" });
    },
    async getMemberInfo(){
      let result = await post("User/GetMemberInfo",{
         UserId: this.userId,
         Token:this.token
      });
      if(Object.keys(result.data).length >0){
        this.isHasInfo = true;
        this.memberInfo = result.data;
        console.log(this.memberInfo);
      }
    //   console.log(result);
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
