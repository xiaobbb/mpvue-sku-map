<template>
  <div class="contain">
    <!--大图片-->
    <div class="glo-relative bg-cart">
        <map id="map"  :longitude="longitude" :latitude="latitude"  scale="14" :controls="controls"  :markers="markers"   @markertap="markertap"   @regionchange="regionchange"   @controltap="controltap" show-location style="width: 750rpx; height: 500rpx;"></map>
    </div>
    <div class="pad">
        <!--预约时间-->
          <div class="appoint">预约时间</div>
        <!--时间-->
          <div class="timeflex">
            <div v-for="(item,index) in datelist" :key="index" :class="{active:active==index}" @click="changebg(index)">{{item}}</div>
          </div>
          <!--开始时间 结束时间-->
          <div class="tagflex">
            <div>开始时间</div>
            <div>结束时间</div>
          </div>
          <!--滑动选择时间-->
          <div class="freeRoom">
            <div>
                <!--<div class="timeText">{{year}}年{{month}}月{{day}}日</div>-->
                <picker-view class="pickerView" :value="value" @change="bindDateChangeStart">
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in hourses" :key='key'>{{item}}点</div>
                    </picker-view-column>
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in minutes" :key='key'>{{item}}分</div>
                    </picker-view-column>
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in hourses" :key='key'>{{item}}点</div>
                    </picker-view-column>
                    <picker-view-column class="pickerColumn">
                        <div class="pickerItem" v-for="(item,key) in minutes" :key='key'>{{item}}分</div>
                    </picker-view-column>
                </picker-view>
            </div>
        </div>
    </div>
    <!--底部按钮组-->
    <div class="tagflex bottomstyle">
        <div class="btn-cancle" @click="cancle">取消</div>
        <div class="btn-order" @click="choseTime">立即下单</div>
    </div>
  </div>
</template>

<script>
import "../../css/common.css";
import "../../css/global.css";
import { mapState, mapMutations } from "vuex"; //vuex辅助函数
export default {
  onLoad(){
    this.datelist=[]
    this.setBarTitle();
    this.choosedate();
    this.gethous();
    this.getMinutes();
    this.datetip=this.datelist[this.active]
    
  },
  data () {
    return {
      datelist:[],
      active:'0',
      hourses:[],
      minutes:[],
      datetip:"",//选中的日期
      time:[],//时间
      nowhour:"",//当前的时间
      nowminute:"",
      controls: [{  //控件不随着地图移动
          id: 1,
          iconPath: '/static/images/location.png',
          position: {
            left: 0,
            top: 150,
            width: 30,
            height: 30
          },
          clickable: true
      }],
    }
  },
  computed:{
   ...mapState(["cityName","nowPlace","longitude","latitude"])
  },
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "填写订单"
      });
    },
    changebg(item){
      this.active=item
      this.datetip=this.datelist[this.active]
    },
    choosedate(){
      this.datelist=[]
      var ddd=new Date()
      //console.log(date)
      var month=ddd.getMonth()+1
      var date=ddd.getDate()
      this.nowhour=ddd.getHours()
      this.nowminute=ddd.getMinutes()
      console.log()
      for(var n=0;n<5;n++){
        var i=`${month}`+'月'+`${date}`+'日'
        this.datelist.push(i)
        date++
      }
    },
    gethous(){
      for (let i =0; i <= 24; i++) {
          if(i.toString().length<2){
            i="0"+i
          }
          this.hourses.push(i)
      }
    },
    getMinutes(){
      for (let i =0; i <= 60; i++) {
          if(i.toString().length<2){
            i="0"+i
          }
          this.minutes.push(i)
      }
    },
    bindDateChangeStart (e) {
          //console.log(e)
          // valIndex 是获取到的年月日在各自集合中的下标
          this.time = e.mp.detail.value
          // console.log(JSON.stringify(e.mp.detail.value))
          // let hourses = this.hourses[valIndex[0]]
          // let minutes = this.minutes[valIndex[1]]
          // 滚动时再动态 通过年和月获取 这个月下对应有多少天
    },
    choseTime(){
      console.log(this.datetip)
      console.log(this.time)
         if(this.time[0] >23 || this.time[0] < 7 ){
         wx.showToast({
            title: '您选择的时间不在营业范围内',
            icon: 'none',
            duration: 2000,
            complete: function (){
              
            }
        });
        return false
       }else if(this.time[2] - this.time[0] > 2 ){
         wx.showToast({
            title: '服务时间不超过两个小时哦。。。',
            icon: 'none',
            duration: 2000,
            complete: function (){
              
            }
        });
        return false
       }else if(this.active==0 && this.time[0]<this.nowhour && this.time[1] <this.nowminute){
          wx.showToast({
            title: '您选择的时间已过...',
            icon: 'none',
            duration: 2000,
            complete: function (){
              
            }
        });
        return false
       }else if(this.time[0]>this.time[2]){
         wx.showToast({
            title: '开始时间不能大于结束时间',
            icon: 'none',
            duration: 2000,
            complete: function (){
              
            }
        });
        return false
      }else{
          if(this.datetip && this.time.length>0){
            wx.setStorageSync("timearr",this.time)
            wx.setStorageSync("datearr",this.datetip)
              wx.navigateTo({ url: "/pages/location/main" });
          }else{
                wx.showToast({
                  title: '请选择时间',
                  icon: 'none',
                  duration: 2000,
                  complete: function (){
                    
                  }
              });
              return false
            }
            
          }
    }
    
    // choseTime(){
    //   //console.log(this.datetip)
    //   const _datetip=this.datetip.split("月")
    //   let mon = _datetip[0]
    //   let dd = _datetip[1].split("日")[0]
    //   mon.length<2 ? mon="0"+mon : mon
    //   dd.length<2 ? dd="0"+dd :dd
    //   let tt=mon+"-"+dd  //日期
    //   const time1=[]
    //   for (let i of this.time){
    //     if(i.toString().length<2){
    //         i="0"+i
    //     }
    //     time1.push(i)
    //   }
      
    //    const timeValue=time1[0]+":"+time1[1]+"-"+time1[2]+":"+time1[3] //时间
    //    if(this.time[0] >23 || this.time[0] < 7 ){
    //      wx.showToast({
    //         title: '您选择的时间不在营业范围内',
    //         icon: 'none',
    //         duration: 2000,
    //         complete: function (){
              
    //         }
    //     });
    //     return false
    //    }else if(this.time[2] - this.time[0] > 2 ){
    //      wx.showToast({
    //         title: '服务时间不超过两个小时哦。。。',
    //         icon: 'none',
    //         duration: 2000,
    //         complete: function (){
              
    //         }
    //     });
    //     return false
    //    }else if(this.time[0]<this.nowhour && this.time[1] <this.nowminute){
    //       wx.showToast({
    //         title: '您选择的时间已过...',
    //         icon: 'none',
    //         duration: 2000,
    //         complete: function (){
              
    //         }
    //     });
    //     return false
    //    }else if(this.time[0]>this.time[2]){
    //      wx.showToast({
    //         title: '开始时间不能大于结束时间',
    //         icon: 'none',
    //         duration: 2000,
    //         complete: function (){
              
    //         }
    //     });
    //     return false
    //   }else{
    //       //console.log(time1)
    //       if(dd && time1.length>0){
    //           wx.navigateTo({ url: "/pages/location/main?tt="+tt+"&mm="+timeValue });
    //       }else{
    //             wx.showToast({
    //               title: '请选择时间',
    //               icon: 'none',
    //               duration: 2000,
    //               complete: function (){
                    
    //               }
    //           });
    //           return false
    //         }
            
    //       }
    // }
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
                }
            }
        }
    }
</style>
