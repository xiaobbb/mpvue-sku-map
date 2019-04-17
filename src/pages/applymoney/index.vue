<template>
  <div>
      <div>
          <!--商城订单申请退款-->
          <div v-if="showShop"  class="flex-container pad">
              <div>
              <img src="/static/images/apply.png" class="applyimg">
              </div>
              <div class="flex-container clomn applypro">
                  <p class="protitle">绿妞长效镀晶9H汽车度镀晶纳米水晶镀 膜包施工新全车辆车漆面德国</p>
                  <p class="prospec">精选1年版（全国包施工）</p>
                  <p class="proprice">¥ 1288</p>
              </div>
          </div>
          <!--预约订单申请退款-->
          <div class="flex-container pad" v-else>
              <div>
              <img src="/static/images/shop5.png" class="applyimg">
              </div>
              <div class="flex-container clomn applypro">
                  <p class="protitle">普教洗车</p>
                  <p class="proprice">¥ 30</p>
              </div>
          </div>
      </div>
      <div class="promopt">
          <p>· 本品支持订单签收后的7天内退换货，商城将在2天内审核申请 </p>
          <p>· 申请成功后奖励的积分将相应扣除，货款原支付方式退回 </p>
          <p>· 如未与买家协商一致，请勿使用到付或平邮 </p>
      </div>
      <div class="slide"></div>
      <!--退款选项-->
      <div>
          <div class="flex-container applyitem arrowposit">
              <p>退款原因:</p>
              <input type="text" placeholder="商品少件/破损">
              <img src="/static/images/back.png" class="right arrowpic" @click="choseReason">
          </div>
          <div class="flex-container applyitem">
              <p>退款原因:</p>
              <input type="text" placeholder="选填">
          </div>
          <div class="applyitem lastap flex-container">
              <p>退款金额:</p>
              <div>￥1288</div>
          </div>
      </div>
      <div class="tipspromot">可修改退款金额，最多￥1288.00，不含配送费用</div>
      <div class="addpics">
          <p>上传凭证</p>
          <div>
              <img src="/static/images/camera.png" class="pics">
              <img src="/static/images/camera.png" class="pics">
          </div>
      </div>
      <div class="slide"></div>
      <div class="applycon">确认提交</div>
      <!--弹框遮罩-->
    <div class="mask-modal" v-if="isshow"></div>
    <div class="reasonmask" v-if="isshow">
        <div class="reasontitle commonpaditem">
            <img src="/static/images/close.png" class="close" @click="closeMsk">
            <text>选择退款原因</text>
        </div>
        <div>
            <div class="commonpaditem flex-container reasonitem" v-for="item in reasonlist" :key="item.id">
                <p>{{item.name}}</p>
                <input type="checkbox" class="checkbox-cart"/>
            </div>
        </div>
        
        <div class="reasonclose" @click="closeMsk">关闭</div>
    </div>
  </div>
</template>

<script>
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
  },
  data () {
    return {
      isshow:false,
      showShop:true,//选择是商城订单还是预约订单
      reasonlist:[
        {id:1,name:"多拍/拍错/不想要"},{id:2,name:"质量问题/功能不符"},{id:3,name:"外观/型号/参数等描述不符"},{id:4,name:"发错货品"},{id:5,name:"货品小件/破损/受污染"},{id:6,name:"其他原因(请备注说明)"},
      ]
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "申请退款"
      });
    },
    closeMsk(){
      this.isshow=false
    },
    choseReason(){
      this.isshow=true
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
