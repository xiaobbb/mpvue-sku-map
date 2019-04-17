<template>
  <div class="page">
    <!--列表页面-->
    <div class="congray">
        <!--车辆列表-->
        <div class="carlist" v-if="carinfolist.length>0">
            <radio-group class="radio-group" @change="changeIsDefault($event)">
               <div class="radio"  v-for="(item,index) in carinfolist" :key="index" @click="choseCar(index)">
                    <div class="caritem">
                    <div class="flex-container infostyle">
                      <div class="carlogo">
                          <img src="/static/images/bg6.png" class="cloth">
                          <img src="/static/images/car3.png" class="car">
                      </div>
                      <div class="flex-container coml">
                        <p class="brand">品牌: {{item.CarBrand}}-{{item.CarType}}</p>
                        <p class="carnum">车牌: {{item.CarMumber}}</p>
                      </div>
                    </div>
                    <div class="flex-container choosemenu">
                      <div class="flex-container choose">
                          <label>
                            <radio :value="item.Id" :checked="item.IsDefault===1"/>
                            <span class="chosetitle2" v-if="item.IsDefault===1">已设为默认</span>
                            <span class="chosetitle" v-else>设为默认</span> 
                          </label>
                      </div>
                      <div class="flex-container edit">
                          <p @click="btnEaditCar(item.CarMumber)">
                              <img src="/static/images/edit.png" class="menu">
                              <text>编辑</text>
                          </p>
                          <p @click="delCarInfo(index,item.Id)">
                              <img src="/static/images/del.png" class="menu">
                              <text>删除</text>
                          </p>
                      </div>
                    </div>
                </div>
              </div>
            </radio-group>

        </div>
        <!--底部按钮-->
        <div class="btn" @click="btnEaditCar(0)">
            <div>
                <img src="/static/images/add.png" class="add">
                <span>新增车辆</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { post } from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.params=this.$root.$mp.query.url
    console.log(this.params)
    this.setBarTitle();
  },
  onShow(){
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync("token");
    this.carinfolist = [];
    this.getAllcar(); 
  },
  data () {
    return {
        isDefault:false,
        userId: "",
        token: "",
        carinfolist:[],
        params:""
    }
  },
  watch:{
  },
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "车辆信息"
      });
    },
    async getAllcar(){  //获取车辆信息
      const params={
        UserId: this.userId,
        Token: this.token,
      } 
      let res=await post("/User/GetCarInfo",params);
      if(res.data.length>0){
        this.carinfolist = this.carinfolist.concat(res.data);
      }
    },
    async setCarDefault(index,carId){  //设置默认车辆
      let res = await post("User/SetCarDefault",{
        UserId:this.userId,
        Token:this.token,
        CarInfo:{
          id:carId,
          IsDefault:1
        }
      });
      for(let i=0;i<this.carinfolist.length;i++){
        if(index===i){
          this.$set(this.carinfolist[i],"IsDefault",1);
        }else{
          this.$set(this.carinfolist[i],"IsDefault",0);
        }
      }
    },
    async delCarInfo(index,carId){
      let res = await post("User/DelCarInfo",{
        UserId:this.userId,
        Token:this.token,
        CarInfo:{
          Id:carId
        }
      });
      if(res.code===0){
        let _this = this;
        wx.showToast({
          title: '删除成功！',
          icon: 'none',
          duration: 2000,
          success:function(){
            _this.carinfolist.splice(index,1);
          }
        })
      }
    },
    changeIsDefault(e){
      var arrs = this.carinfolist;
      for (let i=0;i<arrs.length;i++) {
        if (arrs[i].Id == e.target.value) {
          this.setCarDefault(i,arrs[i].Id);
        }
      }
    },
    btnEaditCar(carNumber){
      wx.navigateTo({ url: "/pages/addCar/main?carNumber="+carNumber });
    },
    choseCar(e){
      //console.log(e)
      console.log(this.carinfolist[e])
      let CarInfo=this.carinfolist[e]
      wx.setStorageSync("CarInfo",CarInfo)
      wx.navigateTo({ url: "/pages/"+this.params+"/main"});
    }
  },

  created () {
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
  @import "../../css/common.css";
</style>
