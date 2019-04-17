<template>
<div>
    <div class="mask-modal" v-if="showMask"></div>
    <div class="mask choose" v-if="showSpecs">
        <div class="flex-container choosetitle">
            <div class="flex-container">
                <img src="/static/images/smallcar.png" class="maskshop">
                <div class="chooseinfo">
                    <p class="price">￥399</p>
                    <p class=" tips count">库存321件</p>
                    <p class="tips">已选:“优选版不含施工”</p>
                </div>
            </div>
            <div>
              <img src="/static/images/close.png" class="close">
            </div>
        </div>
        <div class="spcestitle">规格</div>
        <div class="flex-container specs">
            <div class="flex-container">
                <img src="/static/images/specimg.png" class="specpic">
                <text>精选1年版（全国包施工）</text>
            </div>
            <div class="flex-container  specactive">
                <img src="/static/images/specimg.png" class="specpic">
                <text>精选1年版（全国包施工）</text>
            </div>
            <div class="flex-container">
                <img src="/static/images/specimg.png" class="specpic">
                <text>精选1年版（全国包施工）</text>
            </div>
        </div>
        <div class="flex-container choosenums">
            <p>购买数量</p>
            <p class="flex-container">
                <img src="/static/images/11.png" class="menu">
                <input type="text" value="1">
                <img src="/static/images/12.png" class="menu">
            </p>
        </div>
        <div class="btnget pramasget" v-if="addcart"  @click="confirm">完成</div>
        <div class="addcart flex-container" v-else>
            <div class="addtocart" @click="addCart">加入购物车</div>
            <div class="addconfirm" @click="confirm">确定</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  onLoad(){
    this.setBarTitle();
  },
   props: ["showSpecs"],
  data () {
    return {
      addcart:false,
      showMask:false
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: ""
      });
    },
     addCart(){
       this.$emit(this.addcart=true)
      // this.addcart=true
    },
    confirm(){
      this.$emit(
        this.showSpecs=false,
        this.showMask=false
      )
      // this.showNums=false
      // this.isshow=false
    },
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style>
.mask{
    width:750rpx;
    height:800rpx;
    position:fixed;
    left:0;
    bottom:0;
    z-index:60;
    background:#fff;
    border-top-left-radius: 15rpx;
    border-top-right-radius: 15rpx;
}
.maskshop{
    width:160rpx;
    height:160rpx;
}
.specpic{
    width:48rpx;
    height:48rpx;
}
.menu{
    width:55rpx;
    height:48rpx;
}
.close{
    width:28rpx;
    height:28rpx;
}
.choose{
    padding:0 20rpx;
}
.choosetitle{
    padding:20rpx 0;
    align-items: flex-start;
}
.chooseinfo{
    margin-left:30rpx;
}
.price{
    color:#f75364;
    font-size:36rpx;
}
.tips{
    color:#999;
    font-size:24rpx;
}
.count{
    margin-bottom:20rpx;
}
.spcestitle{
    padding:20rpx 0;
}
.specs{
    flex-wrap: wrap;
}
.specs div{
    font-size:24rpx;
    width:48%;
    margin-top:20rpx;
    padding:5rpx 2rpx;
    background: #f3f3f3;
}
.specactive{
    border:1rpx solid #ff6325;
    border-radius:10rpx;
    background: #fff7f4;
}
.choosenums{
    border-top:1rpx solid #f4f4f4;
    border-bottom:1rpx solid #f4f4f4;
    margin-top:30rpx;
    padding:30rpx 0;
}
.choosenums input{
    width:68rpx;
    height:44rpx;
    margin:0 10rpx;
    background: #eef2f5;
    text-align:center;
}
.addcart{
    width:690rpx;
    height:72rpx;
    color:#fff;
    text-align: center;
    margin:0 auto;
    margin-top:100rpx;
}
.addcart div{
    width:50%;
    line-height: 72rpx;
}
.addconfirm{
    background: #ff6325;
    border-top-right-radius: 50rpx;
    border-bottom-right-radius: 50rpx;
}
.addtocart{
    background: #fda33a;
    border-top-left-radius: 50rpx;
    border-bottom-left-radius: 50rpx;
}
.callback{
    background: #fef4f0;
    color:#7c726e;
    padding:20rpx;
    margin:0 20rpx 20rpx 20rpx;
    border-radius:10rpx;
}
.btnget{
    width:690rpx;
    height:72rpx;
    color:#fff;
    background: #ff6325;
    text-align: center;
    line-height: 72rpx;
    margin:0 auto;
    margin-top:220rpx;
    border-radius:50rpx;
}
.pramasget{
    margin-top:100rpx;
}
</style>
