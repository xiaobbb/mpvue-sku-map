<template>
  <div class="flex-container bigcontainer">
    <!--左菜单-->
    <div class="ser-menu">
      <div
        v-for="(item,index) in menulist"
        :key="index"
        :class="{'active':activeId==item.id}"
        @click="getClassifyLisit(item.id)"
        class="nemeitem"
      >
        <text class="title">{{item.name}}</text>
      </div>
    </div>
    <!--右列表-->
    <div class="list">
      <div class="flex-container intitem" v-for="(item,index) in productlist" :key="item.id">
        <div class="flex-container cartdetal">
          <div>
            <img :src="item.img" class="carpic" v-if="ispop" @click="goDetail(item.brandId,item.id)">
            <!-- <img src="/static/images/comblo.png" class="carpic" v-else-if="comb"  @click="goDetail(2)">
            <img src="/static/images/cardshop.png" class="carpic" v-else  @click="goDetail(2)">-->
          </div>
          <div class="flex-container citeminfo">
            <p class="itemtitle" @click="goDetail(item.brandId,item.id)">{{item.title}}</p>
            <p class="progress" @click="goDetail(item.brandId,item.id)">
              <text v-for="(tab,tabIndex) in item.tab" :key="tabIndex">{{tab}}</text>
            </p>
            <p class="sales">销量{{item.sale}}</p>
            <div class="flex-container around">
              <p class="price">￥{{item.price}}</p>
              <div v-show="item.isAttr">
                <img src="/static/images/s1.png" @click="lessNumber(index)" class="tippic">
                <text class="nums">{{item.num}}</text>
                <img src="/static/images/addcart.png" @click="addNumber(index)" class="tippic">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--底部按钮-->
    <div class="btn">
      <div class="btninfo">
        <div class="btn-shop">
          <div class="cartshopbg" @click="goUrl('/pages/shopcart/main')">
            <img src="/static/images/shopcart.png" class="cartshop">
            <text class="numright">{{carNum}}</text>
          </div>
          <div class="shopprice">￥{{carPrice}}</div>
        </div>
        <div class="btn-confirm" @click="goUrl('/pages/shopcart/main')">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  data() {
    return {
      // servicelist:'',
      ispop: true,
      comb: false,
      // 分类列表
      menulist: [],
      //普通商品
      productlist: [],
      //卡券
      cardlist: [
      ],
      //套餐
      combolist: [
      ],
      activeId: Number,
      isSelectAll: "true",
      carData:[],
      carNum:0,
      carPrice:0,
      userId: '',
      token: ''
    };
  },
  watch: {
    // productlist:{
    //     handler: function () {
    //       const list =[]
    //       for(let i=0;i<this.productlist.length;i+=1){
    //         const data = this.productlist[i]
    //         if(data.num){
              
    //           list.push(data)
    //         }
    //       }
    //       this.carData = list;
    //       console.log(this.carData)
    //     },
    //     deep: true
    // }
  },
  onShow() {
    this.cardlist=[]
    this.combolist=[]
    this.carData=[]
      this.userId=wx.getStorageSync('userId'),
      this.token=wx.getStorageSync('token'),
    this.setBarTitle();
    // 分类列表
    this.getClassify();
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "商城"
      });
    },
    // 获取分类列表
    getClassify() {
      const that = this;
      post("Server/GetCarWash",{BrandList:0}).then(res => {
        this.menulist=[]
        for (let i = 0; i < res.data.length; i += 1) {
          const datas = res.data[i];
          that.menulist.push({
            id: datas.Id,
            name: datas.TypeName
          });
        }
        // 获取第一个分类产品
        that.getClassifyLisit(that.menulist[0].id);
      });
    },
    // 分类产品列表
    getClassifyLisit(id) {
      const that = this;
      that.activeId = id;
      that.productlist = [];
      post("/Goods/GoodsList", { page: 1, pageSize: 30, TypeId: id }).then(
        res => {
          for (let i = 0; i < res.data.length; i += 1) {
            const datas = res.data[i];
            that.productlist.push({
              brandId:datas.BrandId, //商品分类0--全部分类，21--商品，22--套餐，23--卡券
              id: datas.Id,
              title: datas.Name,
              price: datas.Price,
              img: datas.ProductImg,
              sale: datas.SalesVolume,
              num: 0,
              tab:datas.KeywordName?JSON.parse(datas.KeywordName):[],
              isAttr:datas.SpecificationValue&&datas.BrandId===21
            });
          }
        that.getCarData()
        }
      );
    },
    // 删除购物车
    async lessNumber(index) {

      // if (this.productlist[index].num > 0) {
      //   this.productlist[index].num -= 1;
      // }
      const product = this.productlist[index]
      let carId = '';
      let num = ''
      for(let i=0;i<this.carData.length;i+=1){
        if(this.carData[i].ProductId === product.id ){
          carId = this.carData[i].Id;
          num = this.carData[i].Number-1
        }
      }
      const data = [{
        "CartId":carId,
        "Total":num,
        "SpecText":''
      }]
      const params ={
        UserId:this.userId,
        Token:this.token,
        data:data
      }
      // 数量大于0，编辑购物车
      // 数量等于0，删除购物车
      if(num!==0){
      await post('Cart/EditCart',params)
      }else{
      const res = await post('Cart/DelCart',params)
        if((res.code*1) === 0){
          this.productlist[index].num =0
        }
      }
      this.getCarData()
    },
    // 添加购物车
    async addNumber(index) {
      // this.productlist[index].num += 1;
      const product = this.productlist[index]
      const params ={
        UserId:this.userId,
        Token:this.token,
        ProId: product.id,
        Count:1,
        SpecText:''
      }
      const res = await post('Cart/AddCart',params)
      this.getCarData()
    },
    // 获取购物车信息
    async getCarData(){
      const params ={
        UserId:this.userId,
        Token:this.token,
      }
      const res = await post('Cart/CartList',params)
      this.carNum=0;
      let carPrice =0;
      for(let i=0;i<res.data.length;i+=1){
        const datas = res.data[i]
        this.carNum += datas.Number
        carPrice += (datas.SalePrice*datas.Number)
        this.carData.push(datas)
        const productlist = this.productlist;
        for(let j=0;j<productlist.length;j+=1){
          const _productlist = productlist[j]
          if(datas.ProductId === _productlist.id){
            this.productlist[j].num = datas.Number;
          }
        }
      }
      this.carPrice = carPrice.toFixed(2)
    },
    change(e) {
      console.log(e);
      this.active = e;
      if (e == "服务卡券") {
        this.servicelist = this.cardlist;
        this.ispop = false;
        this.comb = false;
      } else if (e == "营销套餐") {
        this.servicelist = this.combolist;
        this.comb = true;
        this.ispop = false;
      } else {
        this.servicelist = this.productlist;
        this.ispop = true;
      }
    },
    // 跳转
    goDetail(type,id) {
      //type商品分类0--全部分类，21--商品，22--套餐，23--卡券
        console.log(type,'type-id',id)
      // wx.navigateTo({ url: "/pages/detail/main?id=" + id });
      // return false;
      var a = type*1;
      if (a === 21) {
        wx.navigateTo({ url: "/pages/detail/main?id=" + id });
      }
      if (a === 22||a===23) {
        wx.navigateTo({ url: "/pages/coupondetail/main?id="+id });
      }
      
    },
    toPAy() {
      wx.navigateTo({ url: "/pages/confirmorder/main" });
    },
    goUrl(url){
      wx.navigateTo({url})
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
</style>
