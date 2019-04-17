<template>
  <div class="comment">
    <detailChildpic v-for="(item,index) in list" :key="index" :data="item"></detailChildpic>
    <div v-if="list.length<1">暂时没有评价哦！</div>
  </div>
</template>

<script>
import detailChildpic from "@/components/detailChildpic"; //公用组件
import { post } from "@/utils/index";
export default {
  components: { detailChildpic },
  onLoad(e) {
    (this.ShopId = e.shopId), (this.ProductId = e.productId);
    console.log("url", this.ShopId, this.ProductId);
  },
  onShow() {
    this.setBarTitle();
    this.getData();
  },
  data() {
    return {
      list: [],
      Page: 1,
      PageSize: 10,
      ShopId: "",
      ProductId: ""
    };
  },

  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "全部评论"
      });
    },

    async getData() {
      const params = {
        Page: this.Page,
        PageSize: this.PageSize,
        ShopId: this.ShopId,
        ProductId:this.ProductId,
        CommentType: 0
      };
      const res = await post("Server/ServiceCommentList", params);
      if (this.Page === 1) {
        this.list = [];
      }
      for (let i = 0; i < res.data.length; i += 1) {
        const comments = res.data[i];
        this.list.push({
          // id: comments.Id,
          // userId: comments.MemberId,
          userName: comments.MemberName,
          userImg: comments.Avatar,
          content: comments.ContentText,
          time: comments.AddTime,
          // 评分
          rank: comments.Rank,
          img: comments.PicData,
          // 回复
          reply: comments.Reply,
          sku: comments.ProductSpecText.replace(/_/g, " ")
        });
      }
      console.log(this.list, "list");
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    // 初始化页面
    this.Page = 1;
    this.getData();
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom(){
    this.Page+=1
    this.getData();
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
