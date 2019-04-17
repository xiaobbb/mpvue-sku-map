<template>
  <div class="content">
    <div class="pay__hd">
      <p class="price">￥45.00</p>
      <p class="tips">实付金额</p>
    </div>
    <div class="pay__bd">
      <div class="weui-cells payMethod">
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <img src="/static/images/wx.png" class="iconImg" alt>
            <span class="title">微信支付</span>
          </div>
          <div class="weui-cell__ft">
            <radio :value="2" :checked="true"/>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <img src="/static/images/rmbbg.png" class="iconImg" alt>
            <span class="title">余额支付</span>
          </div>
          <div class="weui-cell__ft">
            <span class="tipsPrice">余额：￥0.00<span class="tips">（余额不足）</span></span>
            <radio :value="2" :checked="true"/>
          </div>
        </div>
      </div>
    </div>
    <div class="pay__ft">
      <div class="fixed"><div class="btn">立即支付</div></div>
    </div>
  </div>
</template>

<script>
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad() {
    this.setBarTitle();
  },
  data() {
    return {};
  },

  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "支付"
      });
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
