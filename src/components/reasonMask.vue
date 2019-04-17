<template>
  <div v-if="show">
    <div class="mask-modal" @click="closeMsk"></div>
    <div class="reasonmask">
      <div class="reasontitle commonpaditem">
        <img src="/static/images/close.png" class="close" @click="closeMsk">
        <text>{{title}}</text>
      </div>
      <div class="reasonList">
        <radio-group @change="changeReason">
          <label
            class="commonpaditem flex-container reasonitem"
            v-for="item in data"
            :key="item.code"
          >
            <p>{{item.message}}</p>
            <input type="radio" class="checkbox-cart" :value="item.code">
          </label>
        </radio-group>
      </div>
      <div class="reasonclose" @click="btnSure">{{button}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "选择原因"
    },
    button:{
      type: String,
      default: "关闭"
    },
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: ""
    }
  },
  onShow() {},
  data() {
    return {
        code:"",
        codeTxt:""
    };
  },
  methods: {
    closeMsk() {},
    changeReason(e){
       this.code = e.target.value;
       for(let i=0;i<this.data.length;i++){
           if(this.data[i].code==this.code){
              this.codeTxt = this.data[i].message;
           }
       }
    },
    closeMsk(){
        this.$emit('closeReason');
    },
    btnSure(){
       
        if(this.codeTxt==""){
            wx.showToast({
                title: '请选择原因!',
                icon: 'none',
                duration: 1500
            })
       }else{
         this.$emit('selectReason',this.code,this.codeTxt);
       }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../css/common.css";
.reasonmask {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 767rpx;
  z-index: 60;
  background: #fff;
}
.close {
  width: 28rpx;
  height: 28rpx;
  position: absolute;
  top: 32rpx;
  left: 20rpx;
}
.reasonList{
    height: calc( 767rpx - 206rpx);
    overflow: hidden;
    overflow-y:auto;
}
.reasontitle {
  position: relative;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
}
.commonpaditem {
  padding: 25rpx 30rpx;
}
.reasonitem {
  border-bottom: 1rpx solid #f4f4f4;
}
.reasonitem:last-child {
  border: 0;
}
.reasonclose {
  margin-top: 10rpx;
  padding: 30rpx;
  background: #ff6325;
  color: #fff;
  text-align: center;
}
</style>