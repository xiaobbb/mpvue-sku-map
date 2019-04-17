<template>
  <div class="contain">
    <!--备注-->
    <div class="signtitle">不填写备注也可以提交订单</div>
    <!--图片列表-->
    <textarea name="" id="" cols="20" rows="10" class="infobg" placeholder="可以把停车位置写的更详细，可以把想跟洗车员传达的信息都写在这里" v-model="textInfo">
    </textarea>
    <div class="paybtn" @click="orderpay">确定</div>
  </div>
</template>

<script>
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
  },
  data () {
    return {
      textInfo:""
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "添加备注"
      });
    },
    orderpay(){
      //console.log(this.textInfo)
      wx.navigateTo({ url: "/pages/location/main?textinfo="+this.textInfo });
      
    },
    fotrim(){
      this.textInfo=""
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
