<template>
  <div class="backgray">
    <!--地址栏-->
    <div class="flex-container clomn orderhead white" @click="goSelectAddress" v-if="isCard">
      <div class="orderuser">
        <p>收货人：{{address.name}}</p>
        <p>{{address.phone}}</p>
      </div>
      <div class="flex-container addressContent">
        <img src="/static/images/place.png" class="place">
        <text class="placeinfo">收货地址：{{address.address}}</text>
        <img src="/static/images/back.png" class="right">
      </div>
      <div class="ordertips">(温馨提示：请核对收货地址是否正确)</div>
    </div>
    <div class="slide"></div>
    <!--订单详情-->
    <div class="gray proorder">
      <div class="protitle white pad">{{product.shopName}}</div>
      <div class="proinfo flex-container pad">
        <div>
          <img :src="product.img" class="orderimg">
        </div>
        <div class="inforight">
          <div class="infotitle">{{product.title}}</div>
          <div class="infospec">{{sku}}</div>
          <div class="infoprice flex-container">
            <p>￥{{product.price}}</p>
            <p>x{{buyNum}}</p>
          </div>
        </div>
      </div>
      <!-- <div class="flex-container infoslide white pad">
              <div>购买数量</div>
              <div class="flex-container">
                  <img src="/static/images/add5.png" @click="addNum" class="specpic"> 
                  <input class="num" v-model="buyNum" type="number" />
                  <img src="/static/images/shot5.png" @click="lessNum" class="specpic">
              </div>
      </div>-->
      <!-- <div class="flex-container infoslide white pad">
              <div>支付方式</div>
              <div class="infoway">在线支付</div>
      </div>-->
      <div v-if="isCard">
        <div class="flex-container infoslide white pad" @click="onShowCoupon">
          <div>优惠券</div>
          <div>
            <span v-show="couponPrice*1">-{{couponPrice}}</span>
            <img src="/static/images/back.png" class="right">
          </div>
        </div>
        <div class="flex-container infoslide white pad">
          <div>邮费</div>
          <div>
            {{product.freight*1?product.freight:"免运费"}}
            <img
              src="/static/images/back.png"
              class="right"
            >
          </div>
        </div>
      </div>
      <div class="infoslide inputbor flex-container white pad">
        <div>买家留言</div>
        <input type="text" v-model="message" placeholder="填写内容已和卖家协商确认" class="inputmes">
      </div>
      <div class="infoslide slideprice white pad">
        共计{{buyNum}}件商品 合计：
        <span>￥{{total}}</span>
      </div>
    </div>
    <!--底部按钮-->
    <div class="botbtn">
      <div class="price white">
        合计:
        <span>￥{{total}}</span>
      </div>
      <div class="btnconfir" @click="goPay">提交订单</div>
    </div>
    <!--选择优惠券-->
    <Coupon
      :showCoupon.sync="showCoupon"
      :productNumber="buyNum"
      :productId="productId"
      :productAttr="sbumitValue"
      :couponId.sync="couponId"
      :couponPrice.sync="couponPrice"
    ></Coupon>
    <!-- 支付 -->
    <Pay
      :showPay.sync="showPay"
      :orderNumber="orderNumber"
      :total="total"
      :successUrl="'/pages/myorder/main'"
      :closeUrl="'/pages/myorder/main'"
    ></Pay>
  </div>
</template>

<script>
import { post } from "@/utils/index";
import Pay from "@/components/pay.vue";
import Coupon from "@/components/coupon.vue";
import "../../css/common.css";
import "../../css/global.css";
export default {
  components: {
    Coupon,
    Pay
  },
  data() {
    return {
      showPay: false,
      showway: false,
      product: {},
      buyNum: 1,
      productId: "",
      sku: "",
      skuId: "",
      sbumitValue: "",
      skuPrice: 0,
      freight: 0,
      message: "",
      address: {
        id: "",
        name: "",
        phone: "",
        address: ""
      },
      // 优惠券价格
      couponPrice: 0.0,
      showCoupon: false,
      // 使用的优惠券id，0--不使用
      couponId: 0,
      // 订单编号
      orderNumber: "",
      // 是否卡券
      isCard: false
    };
  },

  computed: {
    total() {
      let totals = 0;
      console.log(
        this.product.price,
        this.buyNum,
        this.couponPrice,
        this.freight
      );
      totals =
        this.product.price * this.buyNum - this.couponPrice - this.freight;
      return totals.toFixed(2);
    }
  },
  watch: {
    // 更新id时更新地址
    "$store.state.addressId"() {
      if (this.$store.state.addressId) {
        // this.getData();
      }
    }
  },
  onShow() {
    this.showPay = false;
    this.setBarTitle();
    this.getData();
    this.isCard = !Boolean(this.$root.$mp.query.isCard);
    console.log("卡券", this.$root.$mp.query.isCard, this.isCard);
    // Promise.all(
    // [this.getData(),this.getAddress()]).then((res)=> {
    //   console.log('getFreight')
    //   this.getFreight()
    // })
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "确认订单"
      });
    },

    async getData() {
      const that = this;
      // 获取页面传参,在store里获取
      const store = this.$store.state;
      console.log("store", store);
      const id = store.confirmOrder.productId;
      this.productId = store.confirmOrder.productId;
      const sku = store.confirmOrder.sku;

      this.sku = sku.replace(/_/g, " ");
      this.sbumitValue = sku;
      this.buyNum = store.confirmOrder.buyNum || 1;
      // this.couponPrice = this.$store.state.couponPrice.toFixed(2)
      const res = await post("Goods/BuyNowInfo", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        proId: id,
        proSpecText: sku
      });
      const datas = res.data;
      that.product = {
        shopName: datas.ShopName,
        img: datas.ProductImage,
        title: datas.ProductName,
        id: datas.ProductId,
        shopId: datas.ShopId,
        price: datas.Price,
        //   库存
        stock: datas.Stock
      };
      // 判断是否在购买卡券
      if(this.isCard){
       this.getAddress();
      }
    },
    // 获取收货地址
    async getAddress() {
      this.address.id = this.$store.state.addressId;
      // 重置store选择地址
      this.$store.commit("setSelectAddress", {
        url: "",
        status: false
      });

      let res = {};
      // 还没选中地址，拿默认地址
      if (!this.address.id) {
        res = await post("Address/defaultaddress_New", {
          UserId: wx.getStorageSync("userId"),
          Token: wx.getStorageSync("token")
        });
      } else {
        // 选择地址获取选择的信息
        res = await post("Address/GetInfo", {
          UserId: wx.getStorageSync("userId"),
          Token: wx.getStorageSync("token"),
          Id: this.address.id
        });
      }
      const _res = res.data;
      this.address = {
        id: _res.id,
        name: _res.name,
        phone: _res.tel,
        address: _res.addressinfo
      };
      this.getFreight();
    },
    // 获取运费
    async getFreight() {
      const params = {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        proId: this.product.id,
        SpecText: this.sku,
        Number: this.buyNum,
        AddressId: this.address.id
      };
      const res = await post("Order/BuyNowToFreight", params);
      this.freight = res.data;
    },
    // 提交订单
    async goPay() {
      const res = await post("Order/BuyNowSubmitOrder", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        ProId: this.product.id,
        Number: this.buyNum,
        AddressId: this.address.id,
        // sku
        SpecText: this.sbumitValue,
        // 是否开发票
        InvoiceId: 0,
        InvoiceEmail: "",
        // InvoiceType:2,
        // 优惠券id
        MemberCouponId: this.couponId * 1,
        // MemberCouponId:0,
        // 备注
        Remark: this.message,
        // 服务卡券
        MemberCardId: 0
      });
      wx.showToast({ title: "提交成功！" });
      this.orderNumber = res.data;
      // 查询订单价格
      const order = await post("Order/OrderDetails", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        OrderNo: res.data
      });
      console.log("前台计算订单价格", this.total);
      console.log("后台计算订单价格", order.data.TotalPrice);
      // 0.5秒后弹出支付窗口
      // setTimeout(() => {
        this.showPay = true;
      // }, 500);
    },
    // 跳转选择收货地址
    goSelectAddress() {
      this.$store.commit("setSelectAddress", {
        url: "/pages/confirmorder/main",
        status: true
      });
      wx.navigateTo({ url: "/pages/sitemanage/main" });
    },
    // 选择优惠券
    onShowCoupon() {
      this.showCoupon = true;
    },
    selectCoupon(e) {
      console.log(e.mp.detail.value);
      const index = e.mp.detail.value;
      if (index === "不使用优惠券") {
        return false;
      }
      // const couponList = this.couponList
      // this.couponList[index].status = true;
      // for(let i=0;i<couponList.length;i+=1){
      //   if(i!==index){
      //     this.couponList[i].status = false;
      //   }
      // console.log(this.couponList[i])
      // }
    },
    // 跳转选择优惠券
    goSelectCoupon() {
      // 设置提交订单参数
      const confirmOrder = this.$store.state.confirmOrder;
      this.$store.commit("setConfirmOrder", {
        addressId: confirmOrder.addressId,
        productId: confirmOrder.productId,
        skuId: confirmOrder.skuId,
        buyNum: this.buyNum,
        couponId: confirmOrder.couponId
      });
      this.$store.commit("setSelectCoupon", {
        price: this.total,
        // price:200,
        // productId:0,
        productId: this.product.id,
        classifyId: 0,
        url: "/pages/confirmorder/main",
        status: true
      });
      wx.navigateTo({ url: "/pages/coupons/main" });
    },
    closeMask() {
      (this.showPay = false), (this.showway = false), (this.showCoupon = false);
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
.infoslide img {
  margin-left: 10rpx;
}
</style>
