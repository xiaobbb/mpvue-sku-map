<template>
  <div class="cerbg" style="background:#f4f7fc">
    <!--导航栏-->
    <div class="title">
      <div
        class="ranktitle"
        v-for="item in titlelist"
        :key="item.name"
        :class="{active:active==item.id}"
        @click="change(item.id)"
      >{{item.name}}</div>
    </div>
    <!-- <div class="slide"></div> -->
    <!--没有优惠券-->
      <div class="nodata"  v-if="couptlist.length<=0">
        <img src="/static/images/nodata.png" class="couppics">
        <p>暂无服务卡券</p>
    </div>
    <!--排行list-->
    <scroll-view scroll-y @scrolltolower="loadMore" class="certlistBox">
      <div class="certlist">
      <!--未使用-->
      <!-- <div> -->
        <div class="ceritem" v-for="(item,index) in couptlist" :key="index">
          <div v-if="item.Enables===1">
            <img src="/static/images/green.png" v-if="index===0||index%3===0" class="bgcolor">
            <img src="/static/images/orange.png" v-else-if="(index+1)%2===0" class="bgcolor">
            <img src="/static/images/yellow1.png" v-else class="bgcolor">
          </div>
          <div class="itemain flex-container">
            <div>
              <p class="certitle">{{item.TypeName}}</p>
              <p class="small">{{item.Title}}</p>
              <p class="small">凭此券免费兑换{{item.TypeName}}一次</p>
              <p class="inite">{{item.EndTime}} 前有效</p>
            </div>
            <div @click="gotoShopcenter(item.Id)" v-if="item.Enables===1">立即使用</div>
          </div>
        </div>
      <!-- </div> -->
      <!--已使用或者过期-->
      <!-- <div v-else>
        <div class="ceritem">
          <img src="/static/images/graybg.png" class="bgcolor">
          <div class="itemain flex-container">
            <div>
              <p class="certitle">洗车</p>
              <p class="small">粤AD6688</p>
              <p class="small">凭此券免费兑换洗车一次</p>
              <p class="inite">2020-01-31 前有效</p>
            </div>
            <div>
              <img src="/static/images/used.png" class="frazz" v-if="isused">
              <img src="/static/images/pass.png" class="frazz" v-else>
            </div>
          </div>
        </div>
        <div class="ceritem">
          <img src="/static/images/graybg.png" class="bgcolor">
          <div class="itemain flex-container">
            <div>
              <p class="certitle">洗车</p>
              <p class="small">粤AD6688</p>
              <p class="small">凭此券免费兑换洗车一次</p>
              <p class="inite">2020-01-31 前有效</p>
            </div>
            <div>
              <img src="/static/images/used.png" class="frazz" v-if="isused">
              <img src="/static/images/pass.png" class="frazz" v-else>
            </div>
          </div>
        </div>
      </div> -->
      </div>
      <p class="ovedMsg" v-if="isOved" style="text-align:center;padding:20rpx;font-size:26rpx;color:#666;">我也是有底线的</p> 
    </scroll-view>
    
  </div>
</template>

<script>
import {post} from '@/utils/index'
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow(){
    // Enables:0:不可以使用；1：可使用；2：已使用；3：为已过期
    this.couptlist= [];
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync('token');
    this.setBarTitle();
    this.getServerType();
    this.getCouponList();
  },
  data () {
    return {
      active:"2",
      isalive:true,
      isused:true,
      titlelist:[
        {id:2,name:"未使用"},{id:3,name:"已使用"},{id:1,name:"已过期"}
      ],
      userId:"",
      token:"",
      status:2,  //1--已过期,2--未使用,3--已使用
      brandList:21, //0:默认全部 21:服务商品 22:服务套餐 23:服务卡券
      page:1,
      pageSize:12,
      couponType:1,  //0：优惠券；1：卡券；2：新人礼包
      count:0,
      allPage:0,
      isLoad:false,
      isOved:false,
      couptlist:[],
      //list:[{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"},{Title: "免费洗车1次",EndTime:"2019/5/16 10:57:00",ProTypeId:33,TypeName:"洗车"}],
      serverType:[]  //服务类型分类的数据
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "服务卡券"
      });
    },
    change(e){
      //console.log(e)
      this.active=e;
      this.status = e;
      this.page=1;
      this.isLoad = false;
      this.isOved = false;
      this.couptlist = [];
      this.getCouponList();
    },
    async getServerType(){
      let result = await post("Server/GetCarWash",{
         BrandList:this.brandList
      });
      if(result.data.length>0){
        this.serverType = result.data;
      }
    },
    async getCouponList(){
      let result = await post("User/CouponList",{
        UserId:this.userId,
        Token:this.token,
        Status:this.status,
        page:this.page,
        pageSize:this.pageSize,
        Type:this.couponType
      });
      this.count = result.count;
      if (parseInt(this.count) % this.pageSize === 0) {
        this.allPage = this.count / this.pageSize;
      } else {
        this.allPage = parseInt(this.count / this.pageSize) + 1;
      }
      if(result.data.length>0){
        for(let i=0;i<result.data.length;i++){
          result.data[i].EndTime = result.data[i].EndTime.split(" ")[0].split("/").join("-");
          // this.$set(result.data[i],"TypeName","");
          for(let j=0;j<this.serverType.length;j++){
            if(result.data[i].ProTypeId===this.serverType[j].Id){
              this.$set(result.data[i],"TypeName",this.serverType[j].TypeName);
            }
          }
        }
        this.couptlist = this.couptlist.concat(result.data);
      }
      console.log(this.couptlist);
      if(this.allPage > this.page){
        this.isLoad = true;
      }else{
        this.isLoad = false;
      }
    },
    gotoShopcenter(id){
      wx.switchTab({
        url:"/pages/shopcenter/main?serverCouponId="+id
      })
    },
    loadMore(){
      console.log(this.isLoad);
      if(this.isLoad){
        this.page++;
        this.getCouponList();
      }else{
        if (this.page > 1) {
          this.isOved = true;
        } else {
          this.isOved = false;
        }
      }
    }
  },

  created () {
    // let app = getApp()
  },
  onReachBottom(){
    
  }
}
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
.cerbg{
  height: 100vh;
}
.certlistBox{
  height: calc(100vh - 86rpx);
  overflow: hidden;
  overflow-y:auto;
  
}
.certlist{
  padding-top:20rpx;
}
</style>
