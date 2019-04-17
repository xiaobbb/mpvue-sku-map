<template>
  <div>
    <!--备注-->
    <div class="signtitle">
      <p>上传现场照片有助于洗车员快速找到车辆位置~</p>
      <p>不添加现场照片也可以提交订单</p> 
    </div>
    <!--图片列表-->
    <div class="flex" style="justify-content:flex-start">
        <div class="flexitem" style="margin-right:10rpx;" v-for="(img,index) in imgPathArr" :key="index">
            <img :src="img" class="pic">
            <img src="/static/images/close5.png" class="close"  @click="deleteImg(index)">
        </div>
        <div>
            <img src="/static/images/bg1.png" class="pic"  v-show="isShowBtnUpload" @click="chosseImg">
        </div>
    </div>
    <div class="paybtn" @click="submit">确定</div>
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
      isShowBtnUpload:true,
      imgLenght:4,
      imgPathArr:[],
      imgBase:[],
      userid: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token"),
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "添加现场图片"
      });
    },
    // 修改图片
    chosseImg() {
      const that = this;
      let num = 0;
      if(that.imgPathArr.length<this.imgLenght){
        num=this.imgLenght-that.imgPathArr.length;
         wx.chooseImage({
           count:num,
           sizeType:["compressed"],
           sourceType: ["album", "camera"],
            success: res => {
               that.imgPathArr = that.imgPathArr.concat(res.tempFilePaths);
               if(that.imgPathArr.length==8){
                 that.isShowBtnUpload=false
               }
                for(let i=0;i<that.imgPathArr.length;i++){
                    wx.getFileSystemManager().readFile({
                    filePath: that.imgPathArr[i], //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                      that.imgBase.push({
                        PicUrl: "data:image/png;base64," + res.data.toString()
                      });
                    }
                  })
                }
            }
        });
      }
     
    },
    deleteImg(i){
        this.imgBase.splice(i,1)
        this.imgPathArr.splice(i,1);
        if(this.imgPathArr.length<8){
          this.isShowBtnUpload = true;
        }
    },
    submit(){
      this.$store.commit("update",{"pList":this.imgBase})
      wx.navigateTo({ url: "/pages/location/main"});
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
