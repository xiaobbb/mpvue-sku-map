<template>
  <div class="comment">
    <pointChildpic :commonlist="commonlist" :showPic="true"></pointChildpic>
  </div>
</template>

<script>
import pointChildpic from "@/components/pointChildpic"; 
import { get, myget, mypost, post, toLogin } from "../../utils";//公用评论带图片组件
export default {
  onLoad(){
    this.ProductId=this.$root.$mp.query.proid
    this.setBarTitle();
  },
  onShow(){
    this.getCommentList()
    console.log(this.ProductId)
  },
  data () {
    return {
      ProductId:"",
      Page:"1",
      PageSize:"5",
      CommentType:"0",
      commonlist:[]
    }
  },
 
  components:{
    pointChildpic
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "全部评论"
      });
    },
     async getCommentList(){
       const res=await post("/Server/ServiceProductCommentList",{
          Page:this.Page,
          PageSize:this.PageSize,
          ProductId:this.ProductId,
          CommentType:""
       })
       console.log(res,"商品全部评价")
       if(res.code==0){
         this.commonlist=res.data
         for(let i of this.commonlist){
            this.$set(i,"AddTime",i.AddTime.split("T").join("  "))
        }
       }
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
  @import "../../css/common.css";
</style>
