<template>
  <div class="detail">
    <div v-if="showEvaluate">
      <!--头部-->
      <div>
        <img :src="product.img" class="shippic">
        <div class="shophead">
          <p class="headtitle">
            ￥
            <span>{{product.price}}</span>
          </p>
          <div class="flex-container">
            <p class="headinfo">{{product.title}}</p>
            <p class="flex-container headright" @click="share">
              <img src="/static/images/shareicon.png" class="share">
              <text>分享</text>
            </p>
          </div>
          <div class="flex-container headtips">
            <P>快递:{{product.freight||'免运费'}}</P>
            <P>已售{{product.salesNum}}</P>
            <P>{{product.province}}{{product.city}}</P>
          </div>
        </div>
      </div>
      <div class="slide"></div>
      <!--优惠-->
      <div class="flex-container coupon">
        <div class="flex-container">
          <div>优惠</div>
          <div>
            <div class="couponmenu">
              <div class="flex-container" v-if="coupon[0]">
                <text class="itemname">优惠券</text>
                <p class="couponmenuinfo">
                  <img src="/static/images/deatailbg.png" class="couponbg">
                  <text>满{{coupon[0].meetConditions}}减{{coupon[0].price}}</text>
                </p>
              </div>
              <div class="flex-container couptsild">
                <text class="itemname">积分</text>
                <p>购买可得{{product.score||0}}积分</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flec-container" @click="getCoupons">
          <text class="getcon">领券</text>
          <img src="/static/images/back.png" class="right">
        </div>
      </div>
      <div class="slide"></div>
      <!--说明-->
      <div class="state">
        <div
          class="flex-container statetips"
          v-if="product.serviceTab&&product.serviceTab.length>0"
        >
          <p class="tipname">服务</p>
          <div class="flex-container stateinfo">
            <p v-for="(item,index) in product.serviceTab" :key="index">
              <img src="/static/images/gou.png" class="pics">
              <text>{{item}}</text>
            </p>
          </div>
        </div>
        <div class="flex-container statetips" @click="chooseSpecs">
          <p class="tipname">规格</p>
          <div class="flex-container stateinfo">
            <text>请选择规格数量</text>
            <img src="/static/images/back.png" class="right">
          </div>
        </div>
        <div class="flex-container statetips" @click="getPramas">
          <p class="tipname">参数</p>
          <div class="flex-container stateinfo">
            <text>服务类型 品牌...</text>
            <img src="/static/images/back.png" class="right">
          </div>
        </div>
      </div>
      <div class="slide"></div>
      <!--宝贝评价-->
      <div class="estimate">
        <div class="flex-container estititle">
          <p>宝贝评价</p>
          <p @click="commentList">
            <text class="seeall">查看全部</text>
            <img src="/static/images/back.png" class="right">
          </p>
        </div>
        <detailChildpic
          v-for="(item,index) in product.comment"
          :key="index"
          :data="item"
          v-show="index===0"
        >{{item}}</detailChildpic>
      </div>
      <div class="slide"></div>
      <!--商品详情-->
      <div class="particular">
        <div class="parttitle">商品详情</div>
        <div v-html="product.detail">
          <!-- <img src="/static/images/vedio.png" class="vedio"> -->
        </div>
        <!-- <img src="/static/images/detailinfo.png" class="partinfo"> -->
      </div>
      <!--底部按钮-->
      <div class="bottom">
        <div class="flex-container bottips">
          <p class="clomn flex-container" @click="gotabBar('/pages/index/main')">
            <img src="/static/images/home1.png" class="bottip">
            <text>主页</text>
          </p>
          <p class="clomn flex-container">
            <img src="/static/images/mesg.png" class="bottip">
            <text>客服</text>
          </p>
          <p class="clomn flex-container" @click="goUrl('/pages/shopcart/main')">
            <img src="/static/images/shopcar.png" class="bottip">
            <text>购物车</text>
          </p>
        </div>
        <div class="botcart bot" @click="chooseSpecs">加入购物车</div>
        <div class="botchase bot" @click="chooseSpecs('pay')">立即购买</div>
      </div>
      <!--遮罩层-->
      <div class="mask-modal" v-if="isshow" @click="onMask"></div>
      <!--优惠-->
      <div class="mask" v-if="showDiscount">
        <div class="masktitle">优惠</div>
        <div class="maskinfo">
          <p class="maskitem">促销</p>
          <div class="maskdetail">
            <p class="maskcoupon">积分</p>
            <text>购买可得{{product.score||0}}积分 拷贝</text>
          </div>
          <p class="maskitem">领券</p>
          <div class="maskcouponlist" v-for="(coupon,couponIndex) in coupon" :key="couponIndex">
            <img src="/static/images/pinkbg.png" class="pink">
            <div class="maskser flex-container">
              <div>
                <p class="maskprice">
                  ¥
                  <span>{{coupon.price}}</span>
                </p>
                <p class="maskask">满{{coupon.meetConditions}}使用</p>
                <p class="maskask">有效期{{coupon.time}}</p>
              </div>
              <div class="maskget" @click="nowGetCoupon(coupon.id)">立即领取</div>
            </div>
          </div>
        </div>
        <div class="btnget" @click="cancleMask">完成</div>
      </div>
      <!--产品参数-->
      <div class="mask" v-if="showPram">
        <div class="masktitle">产品参数</div>
        <div class="pramasitem flex-container" v-if="product.productParams.setviceType">
          <p>服务类型</p>
          <p class="pramastitle">{{product.productParams.setviceType}}</p>
        </div>
        <div class="pramasitem flex-container" v-if="product.productParams.name">
          <p>品牌</p>
          <p class="pramastitle">{{product.productParams.name}}</p>
        </div>
        <div class="pramasitem flex-container" v-if="product.productParams.typeNum">
          <p>型号</p>
          <p class="pramastitle">{{product.productParams.typeNum}}</p>
        </div>
        <div class="pramasitem flex-container" v-if="product.province">
          <p>省份</p>
          <p class="pramastitle">{{product.province}}</p>
        </div>
        <div class="pramasitem flex-container" v-if="product.productParams.attr">
          <p>规格</p>
          <p class="pramastitle">{{product.productParams.attr}}</p>
        </div>
        <div class="btnget pramasget" @click="canclePramas">完成</div>
      </div>
      <!--加入购物车、选择规格-->
      <div class="mask choose" v-if="showNums">
        <div class="flex-container choosetitle">
          <div class="flex-container">
            <img :src="selectSku.img||product.img" class="maskshop">
            <div class="chooseinfo">
              <p class="price">{{selectSku.price||product.price}}</p>
              <p class="tips count">库存{{selectSku.num||product.stock}}件</p>
              <p class="tips" v-show="selectSku.value">已选:“{{selectSku.value}}”</p>
            </div>
          </div>
          <div>
            <img src="/static/images/close.png" @click="onMask" class="close">
          </div>
        </div>
        <!-- sku -->
        <Sku :sku="sku" :skuAll="skuAll" v-if="showSku" @getSkuData="getSkuData"></Sku>
        <div class="flex-container choosenums">
          <p>购买数量</p>
          <p class="flex-container">
            <img src="/static/images/11.png" class="menu" @click="lessNum">
            <input type="number" v-model="payNum">
            <img src="/static/images/12.png" class="menu" @click="addNum">
          </p>
        </div>
        <div class="btnget pramasget" v-if="addcart" @click="confirm">完成</div>
        <div class="addcart flex-container" v-else>
          <div class="addtocart" @click="addCart">加入购物车</div>
          <div class="addconfirm" @click="confirm">确定</div>
        </div>
      </div>
      <!--分享-->
      <div class="mask mask2" v-if="showShare">
        <div class="flex-container maskshare">
          <p class="flex-container clomn">
            <img src="/static/images/friend.png" class="friend">
            <text>微信好友</text>
          </p>
          <p class="flex-container clomn">
            <img src="/static/images/friend2.png" class="friend">
            <text>微信好友</text>
          </p>
        </div>
        <div class="cancleshare" @click="cancleShare">取消分享</div>
      </div>
    </div>
  </div>
</template>

<script>
import detailChild from "@/components/detailChild"; //公用组件
import detailChildpic from "@/components/detailChildpic"; //公用组件
import Sku from "@/components/sku.vue"; //公用组件
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  data() {
    return {
      userId: "",
      token: "",
      id: "",
      isshow: false,
      showDiscount: false,
      showShare: false,
      showPram: false,
      addcart: false,
      showNums: false,
      showEvaluate: true,
      payNum: 1,
      product: {},
      // 优惠券
      coupon: [],
      // sku
      showSku: false,
      sku: {},
      skuAll: [],
      selectSku: {
        //选中的sku组合
        value: {},
        img: "",
        num: "",
        price: "",
        text: "", //sku组合用下划线分隔_
        value: "" //sku组合，不带下划线
      }
    };
  },

  components: {
    detailChild,
    detailChildpic,
    Sku
  },
  watch: {},
  onShow() {
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");
    this.id = this.$root.$mp.query.id;
    this.setBarTitle();
    this.getData();
  },
  // 初始化
  onInit() {
    this.showSku = false;
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "商品详情"
      });
    },
    async getData() {
      const that = this;
      const id = this.$root.$mp.query.id;
      const res = await post("Goods/ProductInfo", { proId: 311 * 1 });

      const datas = res.data;
      // 获取优惠券信息
      that.getCoupon();
      that.product = {
        img: datas.ProductImgList[0].PicUrl || "",
        imgs: [],
        comment: [],
        title: datas.ProductName,
        id: datas.ProductId,
        shopId: datas.ShopId,
        price: datas.ProductPrice,
        // 积分
        score: datas.Score,
        //   库存
        stock: datas.Stock,
        detail: datas.ContentDetail,
        // 销量
        salesNum: datas.SalesVolume,
        // 邮费
        freight: datas.freight || "免运费",
        // 省份
        province: datas.ProvinceName,
        // 城市
        city: datas.CityName,
        serviceTab: datas.ServiceName ? JSON.parse(datas.ServiceName) : [],
        productParams: {
          // 品牌
          name: datas.BrandName,
          // 型号
          typeNum: datas.ModelName,
          // 服务类型
          serviceType: datas.TypeName,
          attr: ""
        }
      };
      // 商品图片
      for (let i = 0; i < datas.ProductImgList.length; i += 1) {
        that.product.imgs.push(datas.ProductImgList[i].PicUrl);
      }
      // 评论列表
      for (let i = 0; i < datas.EvaluateList.length; i += 1) {
        const comments = datas.EvaluateList[i];
        that.product.comment.push({
          id: comments.Id,
          userId: comments.MemberId,
          userName: comments.MemberName,
          userImg: comments.MemberHeadImg,
          content: comments.ContentText,
          time: comments.AddTime,
          rank: comments.Rank,
          img: comments.EvaluateImgList.split(","),
          // 回复
          reply: datas.Reply
        });
      }
      // sku
      let _sku = {}; //渲染的sku数据
      let skuAll = []; //全部sku数据
      for (let i = 0; i < datas.ProductSpecList.length; i += 1) {
        const sku = datas.ProductSpecList[i];
        let value = JSON.parse(sku.SpecValue);
        // Object.keys(value).map((item,index,arr)=>{
        //   console.log(item,index,'对象')
        // })

        for (let j in value) {
          // 保存渲染的data到_sku
          if (!_sku[j]) {
            _sku[j] = [];
          }
          if (JSON.stringify(_sku[j]).indexOf(value[j]) === -1) {
            _sku[j].push({
              val: value[j],
              status: false, //是否可选
              selectStatus: false //选择状态
            });
            // console.log(JSON.stringify(_sku[j]), value[j], "产品详情");
          }
        }
        // 保存全部sku数据
        skuAll.push({
          num: sku.ProStock,
          price: sku.PunitPrice,
          img: sku.SpecImage,
          value,
          text: sku.SpecText
        });
      }
      this.sku = _sku;
      this.skuAll = skuAll;
      this.showSku = true;
    },
    // 过去sku组件传过来的数据
    getSkuData(skuAllItem) {
      this.selectSku = {
        num: skuAllItem.num,
        price: skuAllItem.price,
        img: skuAllItem.img,
        text: skuAllItem.text,
        value: skuAllItem.text.replace(/_/g, " ")
      };
    },
    // 获取优惠券列表
    async getCoupon() {
      if (wx.getStorageSync("token") && wx.getStorageSync("userId")) {
        const params = {
          UserId: wx.getStorageSync("userId"),
          Token: wx.getStorageSync("token"),
          // ShopId:shopId,
          page: 1
        };
        const res = await post("Coupon/CouponCenter", params);
        this.coupon = [];
        for (let i = 0; i < res.data.length; i += 1) {
          const _res = res.data[i];
          this.coupon.push({
            price: _res.Denomination,
            time: _res.StartEndTimeStr,
            meetConditions: _res.MeetConditions,
            id: _res.Id
          });
        }
        console.log(this.coupon, "coupon");
      }
    },
    // 点击遮罩层隐藏
    onMask() {
      this.isshow = false;
      this.showDiscount = false;
      this.showPram = false;
      this.showNums = false;
      this.showShare = false;
    },
    lessNum() {
      if (this.payNum > 1) {
        this.payNum -= 1;
      }
    },
    addNum() {
      this.payNum += 1;
    },
    goUrl(url) {
      wx.navigateTo({ url });
    },
    gotabBar(url) {
      wx.switchTab({ url });
    },
    // 加入购物车
    async addCart() {
      // 判断库存
      if (!this.stockCheck()) {
        return false;
      }
      const params = {
        UserId: this.userId,
        Token: this.token,
        ProId: this.product.id,
        Count: this.payNum,
        SpecText: this.selectSku.text
      };
      try {
        const res = await post("Cart/AddCart", params);
        wx.showToast({
          title: "添加成功！",
          icon: "success"
        });
      } catch (e) {
        console.log("e");
        console.log(e);
      }
    },
    // 校验购买数量、是否选择sku
    stockCheck() {
      if (this.skuAll.length > 0 && !this.selectSku.text) {
        wx.showToast({
          title: "请选择购买规格！",
          icon: "none"
        });
        return false;
      }
      let stock = this.selectSku.num || this.product.stock;
      if (stock < this.payNum) {
        wx.showToast({
          title: "购买数量大于剩余库存！",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    // 购买
    confirm() {
      // 判断库存
      if (!this.stockCheck()) {
        return false;
      }
      this.showNums = false;
      this.isshow = false;

      this.$store.commit("setConfirmOrder", {
        addressId: "",
        productId: this.product.id,
        sku: this.selectSku.text,
        buyNum: this.payNum,
        couponId: ""
      });
      wx.navigateTo({ url: `/pages/confirmorder/main` });
    },
    share() {
      this.isshow = true;
      this.showShare = true;
    },
    cancleShare(pay) {
      this.isshow = false;
      this.showShare = false;
    },
    // 展示优惠券
    getCoupons() {
      this.isshow = true;
      this.showDiscount = true;
    },
    // 领取优惠券
    async nowGetCoupon(id) {
      const params = {
        UserId: wx.getStorageSync("userId"),
        Token: wx.getStorageSync("token"),
        UseType: 0,
        CouponId: id
      };
      const res = await post("Coupon/ReceiveCoupon", params);
      wx.showToast({
        title: "领取成功!",
        icon: "success"
      });
      // setTimeout(() => {
      //   this.isshow = false;
      //   this.showDiscount = false;
      // }, 1500);
    },
    cancleMask() {
      this.isshow = false;
      this.showDiscount = false;
    },
    getPramas() {
      this.isshow = true;
      this.showPram = true;
    },
    canclePramas() {
      this.isshow = false;
      this.showPram = false;
    },
    chooseSpecs(pay) {
      if (pay === "pay") {
        this.addcart = true;
      } else {
        this.addcart = false;
      }
      this.isshow = true;
      this.showNums = true;
    },
    commentList() {
      wx.navigateTo({
        url: `/pages/comment-list/main?productId=${this.product.id}&shopId=${
          this.product.shopId
        }`
      });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.getData();
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },
  created() {
    // let app = getApp()
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
</style>
