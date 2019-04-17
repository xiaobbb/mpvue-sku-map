<template>
  <div class="page">
    <!--列表页面-->
    <div v-if="isshow" class="congray">
        <!--车辆列表-->
        <div class="carlist" v-if="carinfolist.length>0">
            <radio-group class="radio-group" @change="changeIsDefault($event)">
               <div class="radio"  v-for="(item,index) in carinfolist" :key="index">
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
                          <p @click="btnEaditCar(index,item.Id)">
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
        <div class="btn" @click="addCar">
            <div>
                <img src="/static/images/add.png" class="add">
                <span>新增车辆</span>
            </div>
        </div>
    </div>
    <!--添加车辆信息页面-->
    <div class="addCarContent" v-else>
        <div class="sel">
            <div><span class="zhi">*&nbsp;</span>车牌号码</div>
            <div class="flex-container line-input">
                <div class="flex-container title">
                    <p class="flex-container"  @click="chooseCity(1)">{{city}}<img src="/static/images/bot1.png" class="arrow"></p>
                    <p class="flex-container"  @click="chooseCity(2)">{{num}}<img src="/static/images/bot1.png" class="arrow"></p>
                </div>
                <input type="num" placeholder="请填写车牌号" class="inn" maxlength="5" v-model="carNum">
            </div>
        </div>
        <div class="sel">
            <div><span class="zhi">*&nbsp;</span>品牌车系</div>
            <div  class="line-input">
                <input type="text" placeholder="请填写您的汽车品牌" v-model="carBrand">
            </div>
        </div>
        <div class="sel">
            <div>&nbsp;车&nbsp;&nbsp; 型</div>
            <div  class="line-input">
                <input type="text" placeholder="请填写您的汽车车型" v-model="carSize">
            </div>
        </div>
        <div class="sel">
            <div>&nbsp;颜&nbsp;&nbsp; 色</div>
            <div  class="line-input">
                <input type="text" placeholder="请填写您的汽车颜色" v-model="carColor">
            </div>
        </div>
        <div class="sel">
            <div>设为默认车辆</div>
            <div  class="line-input" style="text-align:right;">
              <van-switch :checked="isDefault" size="24px" @change="isDefault = !isDefault"  active-color="#ff6325" />
            </div>
        </div>
        <!--按钮-->
        <div class="paybtn btn-save" @click="btnSave">保存</div>
    </div>
  </div>
</template>

<script>
import { post } from "../../utils";
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
    this.userId = wx.getStorageSync('userId');
    this.token = wx.getStorageSync("token");
    this.params=this.$root.$mp.query.url;
    let cityname=this.$root.$mp.query.city;
    let lid=this.$root.$mp.query.id;
    if(lid==1){
      this.city=cityname;
    }else if(lid==2){
      this.num=cityname;
    }
  },
  onShow(){
    this.carinfolist = [];
    this.getAllcar(); 
  },
  // onShow(){
  //   this.city=this.$root.$mp.query.city
  //   console.log(this.city,"城市信息")
  // },
  data () {
    return {
        isshow:true,
        isDefault:false,
        eaditType:0,  //0:为新建地址；1：编辑地址
        eaditId:"",
        // data:0,
        city:"粤",
        num:"A",
        carNum:"",
        carBrand:"",//车系
        carSize:"",//车型
        carColor:"",
        userId: "",
        token: "",
        carinfolist:[]
    }
  },
  watch:{
    // carNum(){
    //   var reg=new RegExp("[0-9A-Z]")
    //   //console.log(reg.test(this.carNum))
    //   if(reg.test(this.carNum)==false){
    //       wx.showToast({
    //         title: '格式不对',
    //         icon: 'none',
    //         image: '',
    //         duration: 1500,
    //         mask: false,
    //         success: (result)=>{
    //           this.carNum=""
    //         },
    //         fail: ()=>{},
    //         complete: ()=>{}
    //       });
         
    //   }
    // }
  },
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "车辆信息"
      });
    },
    initData(){
     this.isshow = true;
      this.isDefault=false;
      this.eaditType=0;  //0:为新建地址；1：编辑地址
      this.eaditId="";
      // this.data=0;
      this.city="粤";
      this.num="A";
      this.carNum="";
      this.carBrand="";//车系
      this.carSize="";//车型
      this.carColor="";
      this.carinfolist = [];
    },
    valOther(){  //验证
      let reg=new RegExp("[0-9A-Z]");
      if(this.carNum==""){
        wx.showToast({
          title: '请输入车牌号!',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if(!reg.test(this.carNum)){
        wx.showToast({
          title: '请输正确的车牌号格式!',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if(this.carBrand ==""){
        wx.showToast({
          title: '请输入品牌车系!',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      return true;
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
    async editCarInfo(){
      let type = 0;
      //this.isshow=true
      if(this.isDefault){
        type=1;
      }else{
        type=0;
      }
      let res = await post("User/EditCarInfo",{
        UserId:this.userId,
        Token:this.token,
        CarInfo:{
          Id:this.eaditId,
          CarMumber:this.city+this.num+this.carNum,
          CarBrand:this.carBrand,
          CarType:this.carSize,
          CarColor:this.carColor,
          IsDefault:type
        }
      });
      let _this = this;
      if(res.code===0){
        wx.showToast({
          title: '修改成功！',
          icon: 'none',
          duration: 2000,
          success:function(){
            _this.isshow = true;
            _this.initData();
            _this.getAllcar();
          }
        })
      }
    },
    btnEaditCar(index,id){  //编辑信息
      this.isshow = false;
      this.city = this.carinfolist[index].CarMumber.substring(0,1);
      this.num = this.carinfolist[index].CarMumber.substring(1,2);
      this.carNum = this.carinfolist[index].CarMumber.substring(2);
      this.carBrand = this.carinfolist[index].CarBrand;//车系
      this.carSize= this.carinfolist[index].CarType;//车型
      this.carColor=this.carinfolist[index].CarColor;
      if(this.carinfolist[index].IsDefault===1){
        this.isDefault = true;
      }else{
        this.isDefault = false;
      }
      this.eaditType = 1;
      this.eaditId = id;
    },
    changeIsDefault(e){
      console.log("__________");
      console.log(e.target.value);
      var arrs = this.carinfolist;
      for (let i=0;i<arrs.length;i++) {
        if (arrs[i].Id == e.target.value) {
          this.setCarDefault(i,arrs[i].Id);
        }
      }
      // if(this.carinfolist[index].IsDefault===1){   //已经是默认的时候
      //   this.setCarDefault(index,id,false);
      // }else{
      //   this.setCarDefault(index,id,true);
      // }
    },
    radioChange(e){
      //console.log(e.target.value)
      var arrs = this.carinfolist;
      var that = this;
      for (const x in arrs) {
        if (arrs[x].id == e.target.value) {
          arrs[x].checked = true;
        } else {
          arrs[x].checked = false;
        }
      }
      
    },
    btnSave(){
      if(this.valOther()){
        if(this.eaditType===1){  //编辑地址
          this.editCarInfo();
        }else{
          this.saveCar();
        }
      }
    },
    async saveCar(){
      let type = 0;
      //this.isshow=true
      if(this.isDefault){
        type=1;
      }else{
        type=0;
      }
      const params = {
        UserId:this.userId,
        Token: this.token,
        CarInfo:{
          CarMumber:this.city+this.num+this.carNum,
          CarBrand:this.carBrand,
          CarType:this.carSize,
          CarColor:this.carColor,
          IsDefault:type
        }
      }
      let res=await post("/User/AddCarInfo",params);
      let _this  = this;
      if(res.code===0){
        wx.showToast({
          title: '新增成功！',
          icon: 'none',
          duration: 2000,
          success:function(){
            _this.isshow = true;
            _this.initData();
            _this.getAllcar();
          }
        })
      }
    },
    addCar(){
      this.isshow=false
    },
    chooseCity(e){
      console.log(e)
      //var id=e.target.dataset.id
      //console.log(id)
      wx.navigateTo({ url: "/pages/choosenum/main?id="+e });
    },
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
