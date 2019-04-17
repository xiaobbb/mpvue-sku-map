<template>
  <div class="backgray">
    <div class="menuTypeBox">
      <div class="menuType">
        <span class="item" :class="{'active':orderBigType===1}" @click="shiftOrderBigType(1)">商城订单</span>
        <span class="item" :class="{'active':orderBigType===2}" @click="shiftOrderBigType(2)">预约订单</span>
      </div>
    </div>
    <div class="menuContent">
      <!--商城订单-->
      <div v-if="orderBigType===1">
        <div class="menuhead flex-container white">
          <p
            v-for="item in menulist"
            :key="item.id"
            :class="{active:status==item.id}"
            @click="shiftStatus(item.id)"
          >{{item.name}}</p>
        </div>
        <scroll-view scroll-y class="shoplist" @scrolltolower="loadMoreOrder">
          <div>
            <div class="shopitem white" v-for="(item,index) in orderList" :key="index">
              <div class="flex-container commonpad">
                <p class="number">订单编号：{{item.OrderNumber}}</p>
                <p class="tips">{{item.StatusName}}</p>
              </div>
              <div class="bgindo">
                <div
                  class="proinfo flex-container pad"
                  v-for="(item2,index2) in item.orderDetails"
                  :key="index2"
                  @click="toOrderDetail(1,item2.OrderNumber)"
                >
                  <div>
                    <img :src="item2.ProductImg" class="orderimg">
                  </div>
                  <div class="inforight flex1">
                    <div class="infotitle">{{item2.ProductName}}</div>
                    <div class="flex-container">
                      <div
                        class="infospec flex1"
                        v-if="item2.ProductSkuName"
                      >{{item2.ProductSkuName}}</div>
                      <div class="infospec flex1" v-else>无规格属性</div>
                      <p>x{{item2.ProductCount}}</p>
                    </div>
                    <div class="infoprice flex-container">
                      <p>￥{{item2.UnitPrice}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="itemtotal">
                共{{item.allNum}}件商品(含配送费
                <span v-if="item.isExpress">￥{{item.ExpressPrice}}</span>)
                <span>合计￥{{item.TotalPrice}}</span>
              </div>
              <!-- 待付款 -->
              <div class="menubtn flex-container flexEnd" v-if="item.StatusId===0">
                <text class="btn" @click="showReasonMak(index,item.OrderNumber)">取消订单</text>
                <text class="btn active" @click="toPay(index,item.OrderNumber)">付款</text>
              </div>
              <!-- 待使用 -->
              <div class="menubtn flex-container flexEnd" v-if="item.StatusId===19">
                <text class="btn active">申请退款</text>
              </div>
              <!-- 已使用 -->
              <div class="menubtn flex-container flexEnd" v-if="item.StatusId===3">
                <text class="btn active" @click="gotoAddComent(index,item.OrderNumber)">去评价</text>
              </div>
              <!-- 已完成 、已经取消订单删除 -->
              <div class="menubtn flex-container flexEnd" v-if="item.StatusId===13 || item.StatusId===14 || item.StatusId===4">
                <text class="btn" @click="btnDel(index,item.OrderNumber)">删除订单</text>
              </div>
            </div>
          </div>
          <p
            style="text-align:center;font-size:30rpx;color:#666;padding:120rpx 20rpx 80rpx;"
            v-if="hasData"
          >暂无数据</p>
          <p
            class="ovedMsg"
            v-if="isOved"
            style="text-align:center;padding:20rpx;font-size:26rpx;color:#666;"
          >我也是有底线的</p>
        </scroll-view>
      </div>
      <!--预约订单-->
      <div v-if="orderBigType===2">
        <div class="menuhead flex-container white visit">
          <div
            class="item flex1 center"
            v-for="item in visitlist"
            :key="item.id"
            @click="change(item.id)"
          >
            <p class="inline-block" :class="{active:serviceMode==item.id}">{{item.name}}</p>
          </div>
          <!-- <p
            v-for="item in visitlist"
            :key="item.id"
            :class="{active:active==item.id}"
            @click="change(item.id)"
          >{{item.name}}</p>-->
        </div>
        <scroll-view scroll-y class="shoplist" @scrolltolower="loadMoreOrder">
          <div
            class="shopitem white"
            v-for="(item,index) in bookList"
            :key="index"
            
          >
            <div class="flex-container commonpad">
              <p class="number">订单编号：{{item.OrderNumber}}</p>
              <p class="tips">{{item.StatusName}}</p>
            </div>
            <!--切换上门服务-->
            <div class="seritem" @click="toOrderDetail(2,item.OrderNumber)">
              <p>项目：{{item.ProductName}}</p>
              <p>地址：{{item.ServiceAddr}}</p>
              <p>
                车辆：
                <span style="margin-right:10rpx;">
                  {{item.CarBrand}}
                  <span v-if="item.CarType">-{{item.CarType}}</span>
                </span>
                <span style="margin-right:10rpx;" v-if="item.CarColor">{{item.CarColor}}</span>
                <span style="margin-right:10rpx;">{{item.CarMumber}}</span>
              </p>
              <p>时间：2019-03-18 14:00-16:00</p>
              <p>手机号：13682293390</p>
            </div>
            <!-- 未付款的 -->
            <div class="menubtn flex-container flexEnd" v-if="item.StatusId===0">
              <text class="btn" @click="showReasonMak(index,item.OrderNumber)">取消订单</text>
              <text class="btn active" @click="toPay(index,item.OrderNumber)">支付</text>
            </div>
            <!-- 已使用 -->
            <div class="menubtn flex-container flexEnd" v-if="item.StatusId===3 || item.StatusId===20">
              <text class="btn active" @click="gotoAddComent(index,item.OrderNumber)">去评价</text>
            </div>
            <!-- 已经取消订单、已完成订单删除 -->
            <div class="menubtn flex-container flexEnd" v-if="item.StatusId===4 || item.StatusId===13 || item.StatusId===14">
              <text class="btn" @click="btnDel(index,item.OrderNumber)">删除订单</text>
            </div>
            <!--切换到店服务-->
            <!-- <div class="seritem" v-if="active==2">
              <p>项目：外观简单清洗洗车</p>
              <p>门店：车御品汽车服务</p>
              <p>车辆：别克-凯越 红色 粤AH6688</p>
              <p>手机号：13682293390</p>
            </div>
            <div class="menubtn flex-container flexEnd">
              <text class="btn">取消订单</text>
              <text class="btn active">付款</text>
            </div>-->
          </div>
          <p
            style="text-align:center;font-size:30rpx;color:#666;padding:120rpx 20rpx 80rpx;"
            v-if="hasData"
          >暂无数据</p>
          <p
            class="ovedMsg"
            v-if="isOved"
            style="text-align:center;padding:20rpx;font-size:26rpx;color:#666;"
          >我也是有底线的</p>
        </scroll-view>
      </div>
    </div>
    <!-- 取消订单选择原因 -->
    <reasonMask
      :title="title"
      :button="button"
      v-if="reasonList.length>0"
      :show="reasonShow"
      :data="reasonList"
      @closeReason="closeReason"
      @selectReason="selectReason"
    ></reasonMask>
    <!-- 支付 -->
    <Pay :showPay="showPay" v-if="showPay" :orderNumber="orderNo" 
      :total="totalPrice" :navigateUrl="'/pages/myorder/main'"
    ></Pay>
  </div>
</template>

<script>
import { post, get } from "../../utils";
import reasonMask from "@/components/reasonMask";
import Pay from '@/components/pay.vue'
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad() {
    this.setBarTitle();
    // orderNo=201904111016183668853&appraiseType=0&appraiseId=1120,==>最终是要传到评价页面的，appriseType: 0:商城产品评价；1：上门评价；2：到店评价sd
    //跳转到评价的时候，首先要判断一个订单有多少条数据，如果有超过一条的话，就要有跳转到评价列表里面，从评价列表中去一条一条的评价,
    //
  },
  onShow() {
    //支付的时候初始原来的值
    this.orderNo = "";
    this.cancleIndex="";
    this.reasonShow= false;
    this.showPay =false;  //支付弹窗
    this.totalPrice ="";  //需要支付的价格
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");
    this.orderList = [];
    this.bookList = [];
    this.reasonList = [];
  
    if (this.$root.$mp.query.orderBigType) {
      //是商城订单还是预约订单;1:商城订单；2：预约订单
      this.orderBigType = this.$root.$mp.query.orderBigType;
    } else {
      this.orderBigType = 1;
    }
    if (this.orderBigType === 1) {
      if (this.$root.$mp.query.status || this.$root.$mp.query.status == 0) {
        this.status = this.$root.$mp.query.status;
      } else {
        this.status = 0;
      }
      this.serviceMode = 1;
      this.getOrderList();
    }
    if (this.orderBigType === 2) {
      if (this.$root.$mp.query.status) {
        this.serviceMode = this.$root.$mp.query.status;
      } else {
        this.serviceMode = 1;
      }
      this.status = 0;
      this.getReserveOrderList();
    }
    console.log("orderBigType:" + this.orderBigType);
    console.log("status:" + this.status);
    console.log("serviceMode:" + this.serviceMode);
    console.log(this.orderNo,"订单列表")
  },
  data() {
    return {
      userId: "",
      token: "",
      status: 0, //商城订单的状态
      page: 1,
      pageSize: 10,
      count: 0,
      allPage: 0,
      isLoad: false,
      isOved: false,
      hasData: false,
      orderBigType: 1, //1:商城订单；2：预约订单
      serviceMode: 1,
      menulist: [
        { id: 0, name: "全部" },
        { id: 1, name: "待付款" },
        { id: 2, name: "待使用" },
        { id: 3, name: "待评价" },
        { id: 4, name: "已完成" }
      ],
      visitlist: [{ id: 1, name: "上门服务" }, { id: 2, name: "到店服务" }],
      orderList: [],
      bookList: [],
      title: "取消订单原因",
      button: "确定",
      reasonList: [],
      orderNo: "",
      cancleIndex:"",
      reasonShow: false,
      showPay:false,  //支付弹窗
      totalPrice:""  //需要支付的价格
    };
  },

  components: {
    reasonMask,
    Pay
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "我的订单"
      });
    },
    shiftOrderBigType(e) {
      this.initData();
      this.orderBigType = e;
      if (this.orderBigType === 1) {
        this.getOrderList();
      }
      if (this.orderBigType === 2) {
        this.getReserveOrderList();
      }
    },
    change(e) {
      //console.log(e)
      this.initData();
      this.serviceMode = e;
      this.getReserveOrderList();
    },
    toOrderDetail(e, orderNo) {
      if (e == 1) {
        wx.navigateTo({ url: "/pages/orderdetail/main?orderNo=" + orderNo });
      }
      if (e == 2) {
        wx.navigateTo({ url: "/pages/appointorderdet/main?orderNo=" + orderNo+"&serType=" + this.serviceMode  });
      }
    },
    initData() {
      this.page = 1;
      this.count = 0;
      this.allPage = 0;
      this.isLoad = false;
      this.isOved = false;
      this.hasData = false;
      this.orderList = [];
      this.bookList = [];
      this.reasonList = [];
      this.orderNo = "";
      this.cancleIndex = "";
      this.reasonShow = false;
      this.totalPrice = "";
    },
    shiftStatus(status) {
      this.status = status;
      this.initData();
      this.getOrderList();
    },
    async getOrderList() {
      //商城订单
      let result = await post("Order/OrderList", {
        UserId: this.userId,
        Token: this.token,
        Status: this.status,
        Page: this.page,
        pageSize: this.pageSize
      });
      if (result.data == "" && this.page === 1) {
        this.hasData = true;
      }
      if (result.data.length > 0) {
        this.count = result.count;
        if (parseInt(this.count) % this.pageSize === 0) {
          this.allPage = this.count / this.pageSize;
        } else {
          this.allPage = parseInt(this.count / this.pageSize) + 1;
        }
        for (let i = 0; i < result.data.length; i++) {
          if (parseFloat(result.data[i].ExpressPrice).toFixed(2) > 0) {
            this.$set(result.data[i], "isExpress", true);
          } else {
            this.$set(result.data[i], "isExpress", false);
          }
          let num = 0;
          for (let j = 0; j < result.data[i].orderDetails.length; j++) {
            num += result.data[i].orderDetails[j].ProductCount;
          }
          this.$set(result.data[i], "allNum", num);
        }
        // Express
        this.orderList = this.orderList.concat(result.data);
        if (this.allPage > this.page) {
          this.isLoad = true;
        } else {
          this.isLoad = false;
        }
        console.log(this.orderList,"订单列表");
      }
    },
    async getReserveOrderList() {
      let result = await post("Order/ReserveOrderList", {
        UserId: this.userId,
        Token: this.token,
        page: this.page,
        pageSize: this.pageSize,
        ServiceMode: this.serviceMode
      });
      if (result.data == "" && this.page === 1) {
        this.hasData = true;
      }
      if (result.data.length > 0) {
        this.bookList = this.bookList.concat(result.data);
        console.log(this.bookList,"上门订单")
      }
    },
    showReasonMak(index, orderNo) {
      this.orderNo = orderNo;
      this.cancleIndex = index;
      this.reasonShow = true;
      this.getCancelReason();
    },
    closeReason() {
      this.reasonShow = false;
    },
    selectReason(code, codeTxt) {
      this.cancelOrders(codeTxt);
    },
    async getCancelReason() {
      //获取取消订单原因
      let result = await get("Order/CancelReason");
      if (result.data.length > 0) {
        this.reasonList = result.data;
      }
    },
    async cancelOrders(reasonMark) {
      let result = await post("Order/CancelOrders", {
        UserId: this.userId,
        Token: this.token,
        OrderNo: this.orderNo,
        ReMarks: reasonMark
      });
      if (result.code === 0) {
        let _this = this;
        wx.showToast({
          title: "取消订单成功!",
          icon: "none",
          duration: 1500,
          success: function() {
            setTimeout(() => {
              _this.reasonShow = false;
              
              //做改变订单状态
              if(_this.orderBigType===1){  //商城订单
                _this.$set(_this.orderList[_this.cancleIndex],"StatusId",14);
                _this.$set(_this.orderList[_this.cancleIndex],"StatusName","交易关闭");
              }
              if(_this.orderBigType===2){  //预约订单
                _this.$set(_this.bookList[_this.cancleIndex],"StatusId",14);
                _this.$set(_this.bookList[_this.cancleIndex],"StatusName","交易关闭");
              }
              _this.orderNo = "";
              _this.cancleIndex = "";
            }, 1500);
          }
        });
      }
    },
    btnDel(index, orderNo) {
      let _this = this;
      wx.showModal({
        content: "您确定要删除该订单么？",
        success(res) {
          if (res.confirm) {
            _this.DeleteOrders(index, orderNo);
          } else if (res.cancel) {
          }
        }
      });
    },
    async DeleteOrders(index, orderNo) {
      let result = await post("Order/DeleteOrders", {
        UserId: this.userId,
        Token: this.token,
        OrderNo: orderNo
      });
      if (result.code === 0) {
        let _this = this;
        wx.showToast({
          title: "删除订单成功!",
          icon: "none",
          duration: 1500,
          success: function() {
            setTimeout(() => {
              if(_this.orderBigType===1){
                _this.orderList.splice(index, 1);
              }
              if(_this.orderBigType===2){
                _this.bookList.splice(index, 1);
              }
            }, 1500);
          }
        });
      }
    },
    gotoAddComent(index,orderNo){
      if(this.orderBigType===1){  //商城订单
        if(this.orderList[index].orderDetails.length>1){  //跳到评价列表页面
           
        }else{  //跳到评价页面
           wx.navigateTo({
             url:"/pages/addcomment/main?appraiseType=0&orderNo="+orderNo
           })
        }
      }
      if(this.orderBigType===2){  //预约订单
        if(this.bookList[index].orderDetails.length>1){  //跳到评价列表页面
           
        }else{  //跳到评价页面
           wx.navigateTo({
             url:"/pages/addcomment/main?appraiseType="+this.serviceMode+"+&orderNo="+orderNo
           })
        }
      }
    },
    toPay(index,orderNo){
      console.log(index)
      if(this.orderBigType===1){
        this.totalPrice =this.orderList[index].TotalPrice;
        
      }
      if(this.orderBigType===2){
        this.totalPrice =this.bookList[index].TotalPrice;
      }
      console.log(this.totalPrice)
      this.orderNo = orderNo;
    //  this.showPay = true;
    },
    loadMoreOrder(e) {
      console.log("ffffffffff");
      if (this.isLoad) {
        this.page++;
        if (this.orderBigType === 1) {
          //商城订单
          this.getOrderList();
        }
        if (this.orderBigType === 2) {
          //预约订单
          this.getReserveOrderList();
        }
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
  onReachBottom() {
    // if(this.isLoad){
    //   this.page++;
    //   if(this.orderBigType===0){  //商城订单
    //     this.getOrderList();
    //   }
    //   if(this.orderBigType===1){  //预约订单
    //      this.getReserveOrderList();
    //   }
    // }else{
    //   if (this.page > 1) {
    //     this.isOved = true;
    //   } else {
    //     this.isOved = false;
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
@import "../../css/common.css";
</style>
