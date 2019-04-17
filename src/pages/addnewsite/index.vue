<template>
  <div class="backgray setlist">
    <!-- <div class="setitem flex-container white">
          <p>收货人</p>
          <input type="text" placeholder="请输入收货人姓名">
      </div>
      <div class="setitem flex-container white">
          <p>手机号码</p>
          <input type="text" placeholder="请输入手机号码">
      </div>
      <div class="setitem flex-container white">
          <p>所在地区</p>
          <div class="flex-container input">
              <input type="text" placeholder="请输入所在地区">
              <img src="/static/images/back.png" class="right">
          </div>
      </div>
      <div class="setitem flex-container white">
          <p>详细地址</p>
          <textarea type="text" placeholder="道路、门牌号、小区、楼栋号、单元、 室等"></textarea>
    </div>-->
    <van-cell-group>
      <van-field clearable label="收货人" :value="name" @change="onName" placeholder="请输入收货人姓名" title-width="70px"/>
      <van-field clearable label="手机号码" :value="phone" @change="onPhone"  placeholder="请输入手机号码" title-width="70px"/>
      <van-field
        clearable
        label="所在地区"
        placeholder="请输入所在地区"
        title-width="70px"
        icon="arrow"
        disabled
        :input-class="area?'color333':''"
        @click="showArea = true"
         :value="area"
      />

      <van-field
        label="详细地址"
        type="textarea"
        placeholder="道路、门牌号、小区、楼栋号、单元、 室等"
        autosize
        :border="false"
        title-width="70px"
        input-class="van-textarea-min-height"
         :value="address"
         @change="onAddress" 
      />
    </van-cell-group>
    <div class="setitem flex-container white">
      <p>设为默认地址</p>
      <!-- <img src="/static/images/nocheck1.png" class="checkstyle" v-if="showDefault">
      <img src="/static/images/check2.png" class="checkstyle" v-else>-->
      <div class="body-view">
        <!-- <switch checked bindchange="switch1Change" /> -->
        <!-- <switch checked @change="switch2Change" indicator-active-color="red"  v-model="isDefault"/> -->
        <van-switch :checked="isDefault" size="24px" @change="isDefault = !isDefault"  active-color="#ff6325" />
      </div>
    </div>
    <div class="paybtn setbtn" @click="submit">{{buttonText}}</div>
    <!--弹框遮罩-->
    <!-- <div class="mask-modal" v-if="isshow"></div>
    <div class="mask white flex-container clomn" v-if="isshow">
      <div class="masktitle">所在地区</div>
      <div class="province">
        <P>河北省</P>
        <P>唐山市</P>
        <P class="active">请选择</P>
      </div>
      <div class="arrlist">
        <p>北京市</p>
        <p>河北省</p>
        <p>山西省</p>
        <p>天津市</p>
        <p>吉林省</p>
        <p>吉林省</p>
        <p>吉林省</p>
      </div>
    </div> -->
    <van-popup :show="showArea" position="bottom" :overlay="true" @close="showArea = false">
      <van-area :area-list="areaList" @cancel="showArea = false" @confirm="confirmArea"/>
    </van-popup>
  </div>
</template>

<script>
import areaList from "@/utils/areaList";
import {post} from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
  data() {
    return {
      areaList,
      showArea: false,
      name: "",
      phone:'',
      area:'',
      provinceCode:'',
      cityCode:'',
      districtCode:'',
      address:'',
      isDefault:false,
      // showDefault: true,
      // isshow: false,
      // index: 0,
      token: wx.getStorageSync("token"),
      userid: wx.getStorageSync('userId'),
      buttonText:'保存'
      // provArray: ["A", "B", "C"]
    };
  },
  onLoad(){
    this.setBarTitle();
    const id = this.$root.$mp.query.id
    if(id){
      this.editAddress(id)
    }
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "添加新地址"
      });
      
          this.buttonText= '保存'
          this.name='';
          this.phone='';
          this.isDefault=false;
          this.area='';
          this.address='';
          this.provinceCode='';
          this.cityCode='';
          this.districtCode ='';
    },
    async editAddress(id){
      const params = {
        Id:id,
          UserId:this.userid,
          Token: this.token
      }
        const res = await post('Address/GetInfo',params)
          this.buttonText= '修改';
          this.name=res.data.name;
          this.phone=res.data.tel;
          this.isDefault=res.data.is_def?true:false;
          this.area=res.data.addressstr;
          this.address=res.data.address;
          this.provinceCode=res.data.province;
          this.cityCode=res.data.city;
          this.districtCode =res.data.district;
    },
    // 选择地址
    confirmArea(area) {
      this.showArea = false;
      let text = '';
      const areas = area.mp.detail.values;
      for(let i=0;i<areas.length;i+=1){
        text +=areas[i].name
      }
      this.provinceCode=areas[0].code||'',
      this.cityCode=areas[1].code||'',
      this.districtCode=areas[2].code||'',
      this.area = text;
    },
    submit(){
      const toast =  this.jiaoyan();
      console.log(toast)
      if(toast){
        wx.showToast({
          title:toast,
          icon: "none",
          duration: 2000
        });
        return false;
      }
      const params = {
          UserId:this.userid,
          Token: this.token,
          Consignee: this.name,
          Mobile: this.phone,
          IsDefault: this.isDefault?1:0,
          FullAddress: this.address,
          ProvinceCode: this.provinceCode,
          CityCode: this.cityCode,
          DistrictCode : this.districtCode,
          StreetCode:'',
          PostCode:''
      }
      if(this.buttonText === '修改'){
        params.Id=this.$root.$mp.query.id;
        post('Address/UpdateAddress',params).then(res=> {
          wx.showToast({
          title: res.msg,
          icon: "success"
        });
          setTimeout(()=> {
            wx.redirectTo({ url: "/pages/sitemanage/main" });
          },1500)
        })
      }else{
        // 新增
        post('Address/AddAddress',params).then(res=> {
          wx.showToast({
          title: res.msg,
          icon: "success"
        });
          setTimeout(()=> {
            wx.redirectTo({ url: "/pages/sitemanage/main" });
          },1500)
        })
      }
    },
    jiaoyan(){
      if(!this.name){
        return '请输入收货人'
      }if(!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.phone))){
        return '请输入正确的手机号码'
      }if(!this.area){
        return '请选择省份'
      }if(!this.address){
        return '请输入收货地址'
      }
      return false;
    },
    onName(e){
      this.name = e.mp.detail
    },onPhone(e){
      this.phone = e.mp.detail
    },onAddress(e){
      this.address = e.mp.detail
    },
    switch2Change(e) {
      //console.log( e )
    },
    bindPickerChange(e) {
      console.log(e);
    }
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
