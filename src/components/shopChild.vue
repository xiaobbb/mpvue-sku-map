<template>
  <div class="childbg">
      <img :src="detailinfo[0].Logo" class="shopbg1">
      <div class="radius">
        <div class="flex-container item">
            <div class="flex-container  row">
                <p class="sertitle">{{name}}</p>
                <div class="shopclass flex-container">
                    <p>
                      <img src="/static/images/xing.png" class="xing-point">
                      <img src="/static/images/xing.png" class="xing-point">
                      <img src="/static/images/xing.png" class="xing-point">
                      <img src="/static/images/xing.png" class="xing-point">
                      <img src="/static/images/gray1.png" class="xing-point">
                    </p>
                    <text class="grad">{{detailinfo[0].ServiceScore}}.0分</text>
                <text class="numb">({{detailinfo[0].TransactionNumber}}条订单)</text>
                </div>
            </div>
            <div class="flex-container range" style="width:30%;" @click="makePhoneCall">
              <p class="location">
                  <img src="/static/images/bg9.png" class="big">
                  <img src="/static/images/phone.png" class="small">
              </p>
            </div>  
        </div>
        <div class="halfhr"></div>
        <div class="flex-container item">
            <div class="flex-container loactsty">
                <img src="/static/images/locat2.png" class="locationwid">
                <div>
                  <p class="sertitle">地址</p>
                  <p class="sercomplain">{{address}}</p>
                </div>
            </div>
            <div class="flex-container range" style="width:30%;"  @click="getMap">
              <p class="location">
                  <img src="/static/images/bg9.png" class="big">
                  <img src="/static/images/to.png" class="small">
              </p>
              <p>{{detailinfo[0].Distance}}km</p>
            </div>
        </div>
        <div class="halfhr"></div>
        <div class="flex-container item">
            <div class="flex-container loactsty">
                <img src="/static/images/time2.png" class="locationwid timesize">
                <div>
                  <p class="sertitle">营业时间</p>
                  <p class="sercomplain">{{detailinfo[0].BusinessHours}}</p>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  props:["isShow","detailinfo"],
   onLoad(){
      //console.log(this.detailinfo)
    this.phoneNum=this.detailinfo[0].Phone
    this.address=this.detailinfo[0].Address
    // this.latitude=this.shopLat
    // this.longitude=this.shopLng
    this.latitude=this.detailinfo[0].Lat*1
    this.longitude=this.detailinfo[0].Lng*1
    this.name=this.detailinfo[0].ShopNick
  },
  onShow(){
   
  },
  data () {
    return {
       phoneNum:"",
       address:"",  //	地址的详细说明
       latitude:"",
       longitude:"",
       name:"", //位置名
    }
  },

  components: {
    
  },

  methods: {
    makePhoneCall(){
      wx.makePhoneCall({
        phoneNumber: this.phoneNum
      })
    },
    getMap(){
      //console.log(this.latitude,typeof(this.latitude*1),"经度类型")
      wx.openLocation({
        latitude:this.latitude,
        longitude:this.longitude,
        address:this.address,
        name:this.name,
        scale: 18
      })
    }
   
    
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.childbg{
   background:#f4f7fc ;
   padding-bottom:20rpx;
}
.shopbg1{
    width:702rpx;
    height:400rpx;
    display:block;
    margin:0 auto;
}
.big{
    width:48rpx;
    height:48rpx;
}
.small{
    width:24rpx;
    height:24rpx;
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%)
}
.location{
    position: relative;
    width:48rpx;
    height:48rpx;
   
}
.range{
    flex-direction: column;
    color:#999;
    padding:0 30rpx;
}
.lineleft{
  border-left:1rpx solid #eee;
}
.item{
    padding:20rpx 25rpx;
    background:#fff; 
    
}

.sertitle{
    font-size: 28rpx;
    font-weight: bold;
    height:28rpx;
    box-sizing: border-box;
}
.sercomplain{
    margin:25rpx 0;
    color:#999;
    font-weight:500;
    font-size:24rpx;
    height:24rpx;
    box-sizing: border-box;
}
.shopclass{
    font-size: 24rpx;
    margin:15rpx 0;
}
.numb{
    color:#999;
    margin-left:60rpx;
}
.grad{
    margin-left:10rpx;
    font-size:28rpx;
}
.row{
  flex-direction: column;
  align-items: flex-start;
  -ms-flex-direction: column;
}
.locationwid{
  width:34rpx;
  height:44rpx;
  margin-right:20rpx;
  box-sizing: border-box;
}
.timesize{
  width:38rpx;
  height:38rpx;
}
.loactsty{
  align-items: flex-start;
  justify-content: flex-start;
}
.halfhr{
  width:670rpx;
  height:3rpx;
  border:0;
  background:#eee;
  margin:0 auto;
}
.radius{
  border-bottom-left-radius:15rpx;
  border-bottom-right-radius:15rpx;
  width:702rpx;
  margin:0 auto;
}
.alig{
  margin-right:10rpx;
}
</style>
