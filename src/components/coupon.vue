<template>
  <div v-show="showCoupon" @touchmove.stop="dialog">
      <!--遮罩层-->
    <div class="mask-modal" @click="closeMask"></div>
    <div class="paymask white" >
      <div class="paytile">
        <text>选择优惠券</text>
      </div>
      <div>
        <radio-group class="radio-group" @change="selectCoupon">
          <label class="flex-container couponItem" v-for="(item,index) in couponList" :key="index">
            {{item.name}}
            <input type="radio" name="coupon" :value="item.id" :checked="couponId==item.id">
          </label>

          <label class="flex-container couponItem">
            不使用优惠券
            <input type="radio" name="coupon" :checked="couponId==0" value="0">
          </label>
        </radio-group>
      </div>
      <div class="paybtn btnbottom" @click="closeMask">完成</div>
    </div>
  </div>
</template>
<script>
import {post} from '@/utils/index'
export default {
    props:{
        showCoupon:{
          type:Boolean,
          default:false
        },
        // 0--立即购买，1--购物车
        listType:{
          type:Number,
          default:0
        },
        productId:{
          type:Number,
          default:0
        },
        productNumber:{
          type:Number,
          default:0
        },
        productAttr:{
          type:String,
          default:''
        },
        cartIds:{
          type:Array,
          default:function(){
            return []
          }
        },
        couponId:{
          type:Number,
          default:0
        },
        couponPrice:{
          type:Number,
          default:0
        }
    },
    watch:{
      showCoupon(){
        if(this.showCoupon){
          this.getCouponList()
        }
      }
    },
  data() {
    return {
      couponList: [
      ]
    };
  },
  methods: {
    dialog(){
      return
    },
    selectCoupon(e){
      console.log(e.mp.detail.value)
      const id = e.mp.detail.value
      let price = 0
      for(let i=0;i<this.couponList.length;i++){
          const _res = this.couponList[i]
          if(_res.id == id){
            price = _res.price
          }
        }
      this.$emit('update:couponId',id)
      this.$emit('update:couponPrice',price)
  },
    // 获取可使用的优惠券
    async getCouponList(){
      
      const _carIds = JSON.stringify(this.cartIds);
      const __carIds = _carIds.substring(1, _carIds.length - 1);
      let result = await post("Order/GetCouponList",{
        UserId:wx.getStorageSync('userId'),
        Token:wx.getStorageSync('token'),
        Type:this.listType,
        ProductId:this.productId,
        ProductNumber:this.productNumber,
        ProductSpec:this.productAttr,
        CartIds:__carIds
      });
      console.log('获取优惠券列表',result)
        this.couponList=[]
        for(let i=0;i<result.data.length;i++){
          const _res = result.data[i]
          this.couponList.push({
            name:_res.Title,
            id:_res.Id,
            price:_res.Denomination,
            status:false
          })
        }
        // if(result.data.length<1){

        // }
    },
  closeMask(){ 
      this.$emit('update:showCoupon', false); //触发 input 事件，并传入新值
        
    //   this.showCoupon = !this.showCoupon
  }
  }
};
</script>
<style lang="scss" scoped>
  @import "../css/common.css";
.paymask {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height:720rpx;
  overflow:auto;
  box-sizing: border-box;
  z-index: 60;
  padding-bottom: 60rpx;
}
.paytile {
  position: relative;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
}
.couponItem {
  padding: 20rpx;
  border-bottom: 1rpx solid #ececec;
}
.btnbottom {
  margin-top: 60rpx;
}
</style>

