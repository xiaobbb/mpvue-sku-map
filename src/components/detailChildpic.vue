<template>
  <div class="point">
    <div class="flex-container userinfo">
      <div class="flex-container">
        <div>
          <img :src="data.userImg" class="avatar">
        </div>
        <div>
          <p>
            <text>{{data.userName}}</text>
            <text class="carname">{{data.sku}}</text>
          </p>
          <p>
            <img
              v-for="(rank,index) in data.rank"
              :key="index"
              src="/static/images/xing.png"
              class="xing-point"
            >
            <img
              v-for="(rank,index) in (5-data.rank)"
              :key="index"
              src="/static/images/gray1.png"
              class="xing-point"
            >
          </p>
        </div>
      </div>
      <div class="usertime">{{data.time}}</div>
    </div>
    <div>{{data.content}}</div>
    <div class="picslist" v-if="data.img.length>0">
      <img v-for="(img,indexImg) in data.img" :key="indexImg" :src="img" class="pointpics">
      <!-- <img src="/static/images/download9.png" class="pointpics">
            <img src="/static/images/download9.png" class="pointpics">
            <img src="/static/images/download9.png" class="pointpics">
      <img src="/static/images/download9.png" class="pointpics">-->
    </div>
    <!-- <div class="usertime">车御品汽车服务</div> -->

    <div class="callback" v-if="data.reply">[商家回复]：{{data.reply}}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      list: []
    };
  },
  onShow() {
    console.log("daa", this.list);
  }
};
</script>

<style lang="scss" scoped>
.point {
  padding: 20rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #f4f4f4;
}
.arrowback {
  width: 12rpx;
  height: 22rpx;
  margin-left: 10rpx;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  margin-right: 15rpx;
}
.left text + text {
  font-size: 35rpx;
  color: #ff6325;
  margin-left: 30rpx;
}
.userinfo {
  margin: 20rpx 0;
}
.carname {
  color: #ff6325;
  margin-left: 20rpx;
  font-size: 24rpx;
}
.usertime {
  color: #999;
  margin-top: 10rpx;
  font-size: 22rpx;
}
.pointpics {
  width: 168rpx;
  height: 168rpx;
}
.picslist {
  padding: 20rpx 0;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  margin-right: -10rpx;
  img {
    margin-right: 10rpx;
  }
}
.callback {
  background: #fef4f0;
  color: #7c726e;
  padding: 20rpx;
  margin-top: 10rpx;
  border-radius: 10rpx;
}
</style>
