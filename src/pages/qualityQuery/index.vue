<template>
    <div>
      <div class="backgray">
        <div class="white qualitylist">
            <div class="qualitytitle">使用质保编号查询真伪</div>
            <div class="qualityinfo">
                <div class="qualityitem">
                    <text>质保编号：</text>
                    <input type="text" placeholder="请输入厂家质保编号" v-model="inputTxt">
                </div>
                <!-- <div class="qualityitem chosetime">
                    <text>日期：</text>
                    <input type="text" placeholder="请选择日期">
                    <img src="/static/images/calender.png" class="calender" @click="showCalender">
                </div>
                <div class="qualityitem">
                    <text>产品：</text>
                    <input type="text" placeholder="请输入产品名称">
                </div>
                <div class="qualityitem">
                    <text>编码：</text>
                    <input type="text" placeholder="请输入编码">
                </div> -->
            </div>
            <div class="paybtn apply" @click="securityCheckWarranty">提交查询</div>
            
        </div>
        <div class="result">验证结果：</div>
        <div class="resultinfo white">恭喜你！001XX230X02X022X20X是正品</div>  
      </div>
      <!--遮罩层-->
      <!-- <div class="mask-modal" v-if="isshow"></div>
      <div v-if="isshow" class="calenderMask">
          <div class="title flex-container">
              <p @click="cancleMAsk">取消</p>
              <p class="chose">请选择日期</p>
              <p class="confirm">确定</p>
          </div>
          <div class="freeRoom">
            <div>
                <picker-view class="pickerView" :value="value" @change="bindDateChangeStart">
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in years" :key='key'>{{item}}年</div>
                    </picker-view-column>
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in months" :key='key'>{{item}}月</div>
                    </picker-view-column>
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in days" :key='key'>{{item}}日</div>
                    </picker-view-column>
                </picker-view>
            </div>
        </div>
      </div> -->
    </div>
</template>

<script>
import { post } from "@/utils/index";
import "../../css/common.css";
import "../../css/global.css";
export default {
   onShow(){
    this.setBarTitle();
  },
  data () {
    return {
        inputTxt:""
    }
  },

  components: {
    
  },
  computed:{
     
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "防伪质保查询"
      });
    },
    async securityCheckWarranty(){
        if(this.inputTxt){
          let result = await post("Server/SecurityCheckWarranty",{
            WarrantyNumber:this.inputTxt
          })
        }else{
            wx.showToast({
                title: '请输入质保编号!',
                icon: 'none',
                duration: 2000
            })
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
  .freeRoom{
        .timeText{
            text-align: center;
        }
        .pickerView{
            width:100%;
            height: 300rpx;
            .pickerColumn{
                .pickerItem{
                    line-height:68rpx;
                    height:34rpx;
                    overflow:hidden;
                    text-align: center;
                    background: #f9dfd3;
                }
            }
        }
    }
</style>
