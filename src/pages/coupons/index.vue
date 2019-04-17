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
    <div class="nodata" v-if="couptlist.length<=0">
      <img src="/static/images/nodata.png" class="couppics">
      <p>暂无优惠券</p>
    </div>
    <!--排行list-->
    <scroll-view scroll-y @scrolltolower="loadMore" class="certlistBox">
      <div class="certlist">
        <div>
          <div class="coupitem" v-for="(item,index) in couptlist" :key="index">
            <img src="/static/images/huiyellow.png" class="bgcolor" v-if="item.Enables===1">
            <img src="/static/images/gray3.png" class="bgcolor" v-if="item.Enables===2">
            <img src="/static/images/passbg3.png" class="bgcolor" v-if="item.Enables===3">
            <div class="coupinfo">
              <div class="main">
                <p v-if="item.DiscountType===2">
                  {{item.Denomination}}
                  <span>折</span>
                </p>
                <p v-else>
                  <span>￥</span>
                  {{item.Denomination}}
                </p>
                <p class="meetConditions">
                  <span v-if="item.MeetConditions>0">满{{item.MeetConditions}}元可用</span>
                  <span v-else>直接减免</span>
                </p>
              </div>
              <div class="right flex-container">
                <div>
                  <p class="coupname">{{item.Title}}</p>
                  <p class="couptime coupuse">{{item.AddTime}}-{{item.EndTime}}</p>
                  <p class="couptime">{{item.ScopeOfUse}}</p>
                </div>
                <div
                  class="btn"
                  v-if="item.Enables===1&&item.isUse"
                  @click="gotoShopcenter(item.Id,item.Denomination)"
                >立即使用</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p
        class="ovedMsg"
        v-if="isOved"
        style="text-align:center;padding:20rpx;font-size:26rpx;color:#666;"
      >我也是有底线的</p>
    </scroll-view>
  </div>
</template>

<script>
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow() {
    // Enables:0:不可以使用；1：可使用；2：已使用；3：为已过期
    this.couptlist = [];
    this.pramas=this.$root.$mp.query.url
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync('token');

    this.setBarTitle();
    this.getCouponList();
  },
  data() {
    return {
      pramas:"",
      active:"2",
      userId:"",
      token:"",
      status:2,  //1--已过期,2--未使用,3--已使用
      page:1,
      pageSize:12,
      couponType:0,
      count:0,
      allPage:0,
      isLoad:false,
      isOved:false,
      titlelist:[
        {id:2,name:"未使用"},{id:3,name:"已使用"},{id:1,name:"已过期"}
      ],
      couptlist: []
    };
  },

  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "优惠券"
      });
    },
    async getCouponList() {
      let result = await post("User/CouponList", {
        UserId: this.userId,
        Token: this.token,
        Status: this.status,
        page: this.page,
        pageSize: this.pageSize,
        Type: this.couponType
      });
      this.count = result.count;
      if (parseInt(this.count) % this.pageSize === 0) {
        this.allPage = this.count / this.pageSize;
      } else {
        this.allPage = parseInt(this.count / this.pageSize) + 1;
      }
      if (result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].AddTime = result.data[i].AddTime.split(" ")[0]
            .split("/")
            .join(".");
          result.data[i].EndTime = result.data[i].EndTime.split(" ")[0]
            .split("/")
            .join(".");
        }
        this.couptlist = this.couptlist.concat(result.data);
      }
      console.log("当前的page:" + this.page);
      console.log("总页数：" + this.allPage);
      if (this.allPage > this.page) {
        this.isLoad = true;
      } else {
        this.isLoad = false;
      }
      // 是否在选择使用优惠券
      this.useCoupon();
    },
    // 判断是否满足优惠券使用条件
    async useCoupon() {
      const coupon = this.$store.state.selectCoupon;
      if (coupon.status) {
        const list = this.couptlist;
        for (let i = 0; i < list.length; i += 1) {
          const _list = list[i];
          // 满足条件,isUse为可使用的优惠券
          if (
            (_list.MeetConditions * 1 <= coupon.price * 1 ||
              _list.MeetConditions * 1 === 0) &&
            (_list.ProductId * 1 === coupon.productId * 1 ||
              _list.ProductId * 1 === 0) &&
            (_list.ProTypeId * 1 === coupon.classifyId * 1 ||
              _list.ProTypeId * 1 === 0)
          ) {
            this.couptlist[i].isUse = true;
          } else {
            this.couptlist[i].isUse = false;
          }
        }
      }
    },
    change(e) {
      //console.log(e)
      this.active = e;
      this.status = e;
      this.page = 1;
      this.isLoad = false;
      this.isOved = false;
      this.couptlist = [];
      this.getCouponList();
    },
    gotoShopcenter(id, price) {
      const coupon = this.$store.state.selectCoupon;
      const confirmOrder = this.$store.state.confirmOrder;
      // 选择优惠券
      if (coupon.status) {
        // 设置提交订单参数
        this.$store.commit("setConfirmOrder", {
          addressId: confirmOrder.addressId,
          productId: confirmOrder.productId,
          skuId: confirmOrder.skuId,
          buyNum: confirmOrder.buyNum,
          couponId: id
        });
        // 设置优惠券价格
        this.$store.commit("update", { couponPrice: price });

        wx.redirectTo({ url: coupon.url });
        this.$store.commit("setSelectCoupon", {
          price: 0,
          productId: 0,
          classifyId: 0,
          url: "",
          status: false
        });
      } else {
        // 没有选择优惠券
        wx.switchTab({
          url: "/pages/shopcenter/main?couponId=" + id
        });
      }
    },
    loadMore() {
      if (this.isLoad) {
        this.page++;
        this.getCouponList();
      } else {
        if (this.page > 1) {
          this.isOved = true;
        } else {
          this.isOved = false;
        }
      }
    }
  },

  created() {
    // let app = getApp()
  },
  onReachBottom() {}
};
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
.cerbg {
  height: 100vh;
}
.certlistBox {
  height: calc(100vh - 86rpx);
  overflow: hidden;
  overflow-y: auto;
}
.certlist {
  padding-top: 20rpx;
}
</style>
