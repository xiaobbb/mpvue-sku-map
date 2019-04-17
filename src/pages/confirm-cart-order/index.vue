<template>
  <div class="backgray">
    <!--地址栏-->
    <div class="flex-container clomn orderhead white" @click="goSelectAddress">
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
    <div class="gray proorder" v-for="(item,index) in productList" :key="index">
      <div class="protitle white pad">{{item.ShopName}}</div>
      <div class="proinfo flex-container pad" v-for="(product,listIndex) in item.list" :key="listIndex">
        <div>
          <img :src="product.ProductImg" class="orderimg">
        </div>
        <div class="inforight">
          <div class="infotitle">{{product.ProductName}}</div>
          <div class="infospec">{{product.sku}}</div>
          <div class="infoprice flex-container">
            <p>￥{{product.SalePrice}}</p>
            <p>x{{product.Number}}</p>
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
      
    </div>
    <div class="gray proorder">
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
          {{freight*1?freight:"免运费"}}
          <img
            src="/static/images/back.png"
            class="right"
          >
        </div>
      </div>
      <div class="infoslide inputbor flex-container white pad">
        <div>买家留言</div>
        <input type="text" v-model="message" placeholder="填写内容已和卖家协商确认" class="inputmes">
      </div>
      <div class="infoslide slideprice white pad">
        共计{{cartIds.length}}件商品 合计：
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
      :couponId.sync="couponId"
      :couponPrice.sync="couponPrice"
      :cartIds="cartIds"
      :listType="1"
    ></Coupon>
    <!-- 支付 -->
    <Pay
      :showPay.sync="showPay"
      :orderNumber="orderNumber"
      :total="total"
      :navigateUrl="'/pages/myorder/main'"
    ></Pay>
  </div>
</template>

<script>
import { post } from "@/utils/index";
import Coupon from "@/components/coupon.vue";
import Pay from "@/components/pay.vue";
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
      productList: [],
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
      cartIds:[]
    };
  },

  computed: {
    total(){
      let totals = 0;
      this.productList.map((arr)=> {
        arr.list.map((_list)=>{
          totals += (_list.SalePrice*_list.Number)
        })
      })
      totals =  totals - this.couponPrice -this.freight
     return  totals.toFixed(2)
      console.log(this.couponPrice,this.freight)
      // 计算购物车价格
    //   const _carIds = JSON.stringify(this.cartIds);
    //   const __carIds = _carIds.substring(1, _carIds.length - 1);
    //   const res = await post("Order/BuyCartShopMoney", {
    //     UserId: wx.getStorageSync("userId"),
    //     Token: wx.getStorageSync("token"),
    //     ShopId:0,
    //     CartIds: __carIds,
    //     AddressId: this.address.id,
    //     // 优惠券id
    //     MemberCouponId: this.couponId * 1,
    //     // 服务卡券
    //     MemberCardId: 0
    //   });
    //  return  res.data.toFixed(2)
    },
  },
  watch: {
    // 更新id时更新地址
    "$store.state.addressId"() {
      if (this.$store.state.addressId) {
        // this.getAddress();
      }
    }
  },
  onShow() {
    this.showPay = false;
    this.setBarTitle();
    this.getData();
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
      // 获取页面传参,在store里获取
      // const store = this.$store.state
      // console.log('store',store)
      // const id = store.confirmOrder.productId;
      // this.productId = store.confirmOrder.productId;
      // const sku = store.confirmOrder.sku;

      // this.sku = sku.replace(/_/g, " ");
      // this.sbumitValue = sku
      // this.buyNum = store.confirmOrder.buyNum||1;
      // this.couponPrice = this.$store.state.couponPrice.toFixed(2)
      this.cartIds = this.$store.state.cartIds;
      // this.cartIds = [443, 444];
      const _carIds = JSON.stringify(this.cartIds);
      const __carIds = _carIds.substring(1, _carIds.length - 1);
      console.log("_carIds", __carIds);
      const res = await post("Cart/GetConfirmOrderGoods", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        CartIdList: __carIds
      });
      this.productList = [];
      res.data.map(datas => {
        this.productList.map((product, index) => {
          // 判断相同店铺的产品，放到list下
          if (datas.ShopId === product.ShopId) {
            const _datas = datas
            _datas.sku = datas.SpecText.replace(/_/g, " ")
            this.productList[index].list.push(_datas);
          } else {
          // 不存在店铺该店铺，创建一个店铺
          const _datas = datas
          _datas.sku = datas.SpecText.replace(/_/g, " ")
          this.productList.push({
              ShopId: datas.ShopId,
              ShopName: datas.ShopName,
              freight:0,
              message:'',
              list:[_datas]
            });
          }
        });
        // 第一次遍历productList没有值，增加一个
        if (this.productList.length < 1) {
          const _datas = datas
          _datas.sku = datas.SpecText.replace(/_/g, " ")
          this.productList.push({
              ShopId: datas.ShopId,
              ShopName: datas.ShopName,
              freight:0,
              message:'',
              list:[_datas]
            });
        }
      });
      
      // for (let i = 0; i < res.data.length; i += 1) {
      //   const datas = res.data[i];
      //   // 遍历产品列表，如果相同店铺添加到数组，不同店铺增加一个店铺
      //   for (let j = 0; j < this.productList.length; j += 1) {
      //     const _productList = this.productList[j];
      //     if (datas.ShopId === _productList.shopId) {
      //       this.productList[j].list.push({
      //         price: datas.SalePrice,
      //         sku: datas.SpecText.replace(/_/g, " "),
      //         sbumitValue: datas.SpecText,
      //         stock: datas.Stock,
      //         id: datas.Id,
      //         title: datas.ProductName,
      //         img: datas.ProductImg,
      //         num: datas.Number
      //       });
      //     } else {
      //       this.productList.push({
      //         shopName: datas.ShopName,
      //         shopId: datas.ShopId,
      //         list: [
      //           {
      //             price: datas.SalePrice,
      //             sku: datas.SpecText.replace(/_/g, " "),
      //             sbumitValue: datas.SpecText,
      //             stock: datas.Stock,
      //             id: datas.Id,
      //             title: datas.ProductName,
      //             img: datas.ProductImg,
      //             num: datas.Number
      //           }
      //         ]
      //       });
      //     }
      //   }
      //   // 第一次遍历产品列表为空，创建一个店铺，并保存第一个产品
      //   if (this.productList.length < 1) {
      //     this.productList.push({
      //       shopName: datas.ShopName,
      //       shopId: datas.ShopId,
      //       list: [
      //         {
      //           price: datas.SalePrice,
      //           sku: datas.SpecText.replace(/_/g, " "),
      //           sbumitValue: datas.SpecText,
      //           stock: datas.Stock,
      //           id: datas.Id,
      //           title: datas.ProductName,
      //           img: datas.ProductImg,
      //           num: datas.Number
      //         }
      //       ]
      //     });
      //   }
      // }
      console.log("productList", this.productList);

      this.getAddress();
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
      const UserId = wx.getStorageSync("userId");
      const Token = wx.getStorageSync("token");
      const _carIds = JSON.stringify(this.cartIds);
      const __carIds = _carIds.substring(1, _carIds.length - 1);
        const params = {
          UserId,
          Token,
          CartIds: __carIds,
          AddressId: this.address.id
        };
        const res = await post("Order/BuyCartToFreight", params);
        this.freight = res.data;
    },
    // 提交订单
    async goPay() { 
      const _carIds = JSON.stringify(this.cartIds);
      const __carIds = _carIds.substring(1, _carIds.length - 1);
      
      const res = await post("Order/BuyCart", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        CartIds: __carIds,
        AddressId: this.address.id,
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
      
      console.log("typeof",typeof(res.data));
      let order = ''
      if(typeof(res.data)==='string'){
        this.orderNumber = res.data;
      
      // 查询订单价格
      order = await post("Order/OrderDetails", {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        OrderNo: res.data
      });
      }else{
      const str = JSON.stringify(res.data);
      const _str = _carIds.substring(1, str.length - 1);
        this.orderNumber = _str;
      }
      console.log("前台计算订单价格", this.total);
      console.log("后台计算订单价格", order.data.TotalPrice);
      // 1.5秒后弹出支付窗口
      setTimeout(() => {
        this.showPay = true;
      }, 500);
    },
    // 跳转选择收货地址
    goSelectAddress() {
      this.$store.commit("setSelectAddress", {
        url: "/pages/confirm-cart-order/main",
        status: true
      });
      wx.navigateTo({ url: "/pages/sitemanage/main" });
    },
    // 选择优惠券
    onShowCoupon() {
      this.showCoupon = true;
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
.proorder{
  border-bottom:20rpx #f4f7fc solid;
}
.proinfo{
  border-bottom:#fff 10rpx solid;
}
</style>
