<template>
  <div class="page">
    <!--添加车辆信息页面-->
    <div class="addCarContent">
      <div class="sel">
        <div>
          <span class="zhi">*&nbsp;</span>车牌号码
        </div>
        <div class="flex-container line-input">
          <div class="flex-container title">
            <p class="flex-container" @click="chooseCity(1)">
              {{city}}
              <img src="/static/images/bot1.png" class="arrow">
            </p>
            <p class="flex-container" @click="chooseCity(2)">
              {{num}}
              <img src="/static/images/bot1.png" class="arrow">
            </p>
          </div>
          <input type="num" placeholder="请填写车牌号" class="inn" maxlength="5" v-model="carNum">
        </div>
      </div>
      <div class="sel">
        <div>
          <span class="zhi">*&nbsp;</span>品牌车系
        </div>
        <div class="line-input">
          <input type="text" placeholder="请填写您的汽车品牌" v-model="carBrand">
        </div>
      </div>
      <div class="sel">
        <div>&nbsp;车&nbsp;&nbsp; 型</div>
        <div class="line-input">
          <input type="text" placeholder="请填写您的汽车车型" v-model="carSize">
        </div>
      </div>
      <div class="sel">
        <div>&nbsp;颜&nbsp;&nbsp; 色</div>
        <div class="line-input">
          <input type="text" placeholder="请填写您的汽车颜色" v-model="carColor">
        </div>
      </div>
      <div class="sel">
        <div>设为默认车辆</div>
        <div class="line-input" style="text-align:right;">
          <van-switch
            :checked="isDefault"
            size="24px"
            @change="isDefault = !isDefault"
            active-color="#ff6325"
          />
        </div>
      </div>
      <!--按钮-->
      <div class="paybtn btn-save" @click="btnSave">保存</div>
    </div>
    <div class="selectPage" v-if="isShow">
      <!--城市-->
      <div class="citylist flex-container" v-if="selectType===1">
        <div class="cityitem" v-for="(item,index) in citylist" :key="item.id" @click="choseItem(index)">
          <text>{{item.name}}</text>
          </div>
      </div>
      <!--字母-->
      <div class="citylist flex-container" v-if="selectType===2">
        <div class="numitem" v-for="(item,cindex) in numlist" :key="item.id" @click="choseItem(cindex)">
          <text>{{item.name}}</text>
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
  onLoad() {
    this.setBarTitle();
    this.userId = wx.getStorageSync("userId");
    this.token = wx.getStorageSync("token");

    
    // this.params = this.$root.$mp.query.url;
    // let cityname = this.$root.$mp.query.city;
    // let lid = this.$root.$mp.query.id;
    // if (lid == 1) {
    //   this.city = cityname;
    // } else if (lid == 2) {
    //   this.num = cityname;
    // }
  },
  onShow() {
    this.initData();
    this.carNumber = this.$root.$mp.query.carNumber;
    if(this.carNumber!=0){
      this.getAllcar();
    }
  },
  data() {
    return {
      isDefault: false,
      eaditId: "",
      carNumber:"",
      selectType:"",
      isShow:false,
      city: "粤",
      num: "A",
      carNum: "",
      carBrand: "", //车系
      carSize: "", //车型
      carColor: "",
      userId: "",
      token: "",
      citylist: [
        { id: 1, name: "京（北京）" },
        { id: 2, name: "沪（上海）" },
        { id: 3, name: "粤（广东）" },
        { id: 4, name: "渝 (重庆）" },
        { id: 5, name: "津 (天津）" },
        { id: 6, name: "浙 (浙江）" },
        { id: 7, name: "川 (四川）" },
        { id: 8, name: "鄂 (湖北）" },
        { id: 9, name: "苏 (江苏）" },
        { id: 10, name: "皖 (安徽)" },
        { id: 11, name: "闽 (福建）" },
        { id: 12, name: "湘 (湖南）" },
        { id: 13, name: "黑 (黑龙江））" },
        { id: 14, name: "辽 (辽宁））" },
        { id: 15, name: "吉 (吉林）" },
        { id: 16, name: "鲁 (山东）" },
        { id: 17, name: "甘 (甘肃）" },
        { id: 18, name: "冀 (河北)" },
        { id: 19, name: "陕 (陕西）" },
        { id: 20, name: "豫 (河南）" },
        { id: 21, name: "宁 (宁夏）" },
        { id: 22, name: "晋 (山西）" },
        { id: 23, name: "琼 (海南）" },
        { id: 24, name: "赣 (江西）" },
        { id: 25, name: "贵 (贵州）" },
        { id: 26, name: "桂 (广西）" },
        { id: 27, name: "云 (云南)" },
        { id: 28, name: "青 (青海）" },
        { id: 29, name: "粤 (广东）" },
        { id: 30, name: "新 (新疆）" },
        { id: 31, name: "京（北京）" },
        { id: 32, name: "蒙 (内蒙古）" },
        { id: 33, name: "沪 (上海）" },
        { id: 34, name: "藏 (西藏)" },
        { id: 35, name: "使 (大使馆）" }
      ],
      numlist: [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 3, name: "C" },
        { id: 4, name: "D" },
        { id: 5, name: "E" },
        { id: 6, name: "F" },
        { id: 7, name: "G" },
        { id: 8, name: "H" },
        { id: 9, name: "I" },
        { id: 10, name: "J" },
        { id: 11, name: "K" },
        { id: 12, name: "L" },
        { id: 13, name: "M" },
        { id: 14, name: "N" },
        { id: 15, name: "O" },
        { id: 16, name: "P" },
        { id: 17, name: "Q" },
        { id: 18, name: "R" },
        { id: 19, name: "S" },
        { id: 20, name: "T" },
        { id: 21, name: "U" },
        { id: 22, name: "V" },
        { id: 23, name: "W" },
        { id: 24, name: "X" },
        { id: 25, name: "Y" },
        { id: 26, name: "Z" }
      ]
    };
  },
  watch: {
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
  components: {},
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "车辆信息"
      });
    },
    initData() {
      this.isShow = false;
      this.isDefault = false;
      this.eaditId = "";
      this.carNumber= "";
      this.selectType = "";
      // this.data=0;
      this.city = "粤";
      this.num = "A";
      this.carNum = "";
      this.carBrand = ""; //车系
      this.carSize = ""; //车型
      this.carColor = "";
      this.carinfolist = [];
    },
    valOther() {
      //验证
      let reg = new RegExp("[0-9A-Z]");
      if (this.carNum == "") {
        wx.showToast({
          title: "请输入车牌号!",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!reg.test(this.carNum)) {
        wx.showToast({
          title: "请输正确的车牌号格式!",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (this.carBrand == "") {
        wx.showToast({
          title: "请输入品牌车系!",
          icon: "none",
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
        SearchKey:this.carNumber
      } 
      let res=await post("/User/GetCarInfo",params);
      if(res.data.length>0){
        this.eaditId = res.data[0].Id;
        this.city = res.data[0].CarMumber.substring(0,1);
        this.num = res.data[0].CarMumber.substring(1,2);
        this.carNum = res.data[0].CarMumber.substring(2);
        this.carBrand = res.data[0].CarBrand;//车系
        this.carSize= res.data[0].CarType;//车型
        this.carColor=res.data[0].CarColor;
        if(res.data[0].IsDefault===1){
          this.isDefault = true;
        }else{
          this.isDefault = false;
        }
      }
    },
    async editCarInfo() {
      let type = 0;
      //this.isshow=true
      if (this.isDefault) {
        type = 1;
      } else {
        type = 0;
      }
      let res = await post("User/EditCarInfo", {
        UserId: this.userId,
        Token: this.token,
        CarInfo: {
          Id: this.eaditId,
          CarMumber: this.city + this.num + this.carNum,
          CarBrand: this.carBrand,
          CarType: this.carSize,
          CarColor: this.carColor,
          IsDefault: type
        }
      });
      let _this = this;
      if (res.code === 0) {
        wx.showToast({
          title: "修改成功！",
          icon: "none",
          duration: 1500,
          success: function() {
            setTimeout(function(){
              wx.navigateTo({ url: "/pages/mycar/main"});
            },1500)
            
          }
        });
      }
    },
    btnSave() {
      if (this.valOther()) {
        console.log("传进来的车牌号：");
        console.log(this.carNumber);
        if (this.carNumber!=0) {
          //编辑地址
          this.editCarInfo();
        } else {
          this.saveCar();
        }
      }
    },
    async saveCar() {
      let type = 0;
      //this.isshow=true
      if (this.isDefault) {
        type = 1;
      } else {
        type = 0;
      }
      const params = {
        UserId: this.userId,
        Token: this.token,
        CarInfo: {
          CarMumber: this.city + this.num + this.carNum,
          CarBrand: this.carBrand,
          CarType: this.carSize,
          CarColor: this.carColor,
          IsDefault: type
        }
      };
      let res = await post("/User/AddCarInfo", params);
      let _this = this;
      if (res.code === 0) {
        wx.showToast({
          title: "新增成功！",
          icon: "none",
          duration: 1500,
          success: function() {
            setTimeout(function(){
              wx.navigateTo({ url: "/pages/mycar/main"});
            },1500)
          }
        });
      }
    },
    chooseCity(e) {
      this.isShow = true;
      this.selectType = e;
    },
    choseItem(e){
      console.log("当前选中："+e);
      console.log("选中的类型："+this.selectType);
      if(this.selectType==1){
        this.city=this.citylist[e].name.slice(0,1);
      }else{
        this.num=this.numlist[e].name;
      }
      this.isShow = false;
    },
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.page{
  height: 100%;
  position: relative;
}
@import "./style";
@import "../../css/common.css";
</style>
