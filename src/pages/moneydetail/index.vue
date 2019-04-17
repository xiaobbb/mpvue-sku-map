<template>
  <div class="cerbg" style="background:#fff">
    <div class="flex-container recordtitle">
      <p
        v-for="item in recordlist"
        :key="item.id"
        :class="{active:active===item.id}"
        @click="change(item.id)"
      >{{item.name}}</p>
    </div>
    <!-- <div class="slide"></div> -->
    <scroll-view scroll-y @scrolltolower="loadMore" class="recordlistBox">
      <div class="recordlist" v-if="list.length>0">
        <div class="recorditem commonpad flex-container" v-for="(item,index) in list" :key="index">
          <div>
            <p>{{item.Remark}}</p>
            <p class="minisize">{{item.AddTime}}</p>
          </div>
          <div>
            <p class="addshort add" :class="{'add':item.Type==11}">
              <span v-if="item.Type==11">＋</span>
              <span v-else>-</span>
              {{item.Change}}
            </p>
            <p class="minisize">余额：{{item.After}}</p>
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
</template>

<script>
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onShow() {
    this.list = [];
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");
    this.setBarTitle();
    this.getRechargeList();
  },
  data() {
    return {
      userId: "",
      token: "",
      page: 1,
      pageSize: 15,
      isLoad: false,
      isOved: false,
      hasData: false,
      count: 0,
      allPage: 0,
      active: 0,
      recordlist: [
        { id: 0, name: "全部" },
        { id: 1, name: "充值记录" },
        { id: 2, name: "支出记录" }
      ],
      list: []
    };
  },

  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "资金明细"
      });
    },
    change(e) {
      this.active = e;
      this.page = 1;
      this.isLoad = false;
      this.isOved = false;
      this.hasData = false;
      this.count = 0;
      this.allPage = 0;
      this.list = [];
      this.getRechargeList();
    },
    orderpay() {
      wx.navigateTo({ url: "/pages/locationcomplete/main" });
    },
    async getRechargeList() {
      let result = await post("Recharge/GetRechargeList", {
        UserId: this.userId,
        Token: this.token,
        page: this.page,
        pageSize: this.pageSize,
        Type: this.active
      });
      this.count = result.count;
      if (parseInt(this.count) % this.pageSize === 0) {
        this.allPage = this.count / this.pageSize;
      } else {
        this.allPage = parseInt(this.count / this.pageSize) + 1;
      }
      if (result.data.length === 0 && this.page === 1) {
        this.hasData = true;
      }
      if (result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].AddTime = result.data[i].AddTime.split("/").join("-");
        }
        this.list = this.list.concat(result.data);
      }
      if (this.allPage > this.page) {
        this.isLoad = true;
      } else {
        this.isLoad = false;
      }
    },
    loadMore() {
      if (this.isLoad) {
        this.page++;
        this.getRechargeList();
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

.recordlistBox {
  height: calc(100vh - 100rpx);
  overflow: hidden;
  overflow-y: auto;
}
</style>
