<template>
  <div>
    <!--填写订单-->
    <div class="glo-relative">
        <map id="map"  :longitude="longitude" :latitude="latitude"  scale="15" :controls="controls"  :markers="markers"   @markertap="markertap"   @regionchange="regionchange"   @controltap="controltap" show-location style="width:750rpx; height: 516rpx;"></map>
    </div>
    <!--列表-->
    <div class="list">
      <div class="item" v-for="(item,index) in locationlist" :key="index" @click="change(index)">
            <div class="iteminfo">
              <span class="location-self">{{item.name}}</span>
              <p class="sub">{{item.address}}</p>
            </div>
            <img src="/static/images/choose2.png" class="choose" :class="{active:active==index}">
        </div>
    </div>
  </div>
</template>

<script>
import "../../css/common.css";
import "../../css/global.css";
import { mapState, mapMutations } from "vuex"; //vuex辅助函数
export default {
  onLoad(){
    this.setBarTitle();
    this.getAround()  //获取周边pio信息（经纬度 关键词）
    //this.getMapShow() //测试------根据城市名称获取地图
    
  },
  onShow(){
    this.latitude=this.$store.state.latitude
    this.longitude=this.$store.state.longitude
    //console.log(this.latitude)
  },
  data () {
    return {
      locationlist:[ ],
      active:'0',
      markers:[{
        iconPath: "/static/images/person.png",
        id:1,
        latitude: this.latitude,
        longitude: this.longitude,
        width:20,
        height:25
      }],
      controls: [{  //控件不随着地图移动
          id: 2,
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
    ...mapMutations(["update"]),
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "位置"
      });
    },
    getAround(){  //获取周边城市信息
      wx.request({
            url:"https://api.map.baidu.com/place/search?&query=大厦&location="+this.latitude+","+this.longitude+"&radius=1000&output=json&key=KpdqD9A6OzIRDWUV1Au2jcPgy9BZxDGG&",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success:(res)=>{
                //console.log(res.data.results,"poi检索")
                this.locationlist=res.data.results
          }
        })
    },
    controltap(){
        wx.getLocation({
          type: 'wgs84',
          success:(data)=> {
          // console.log(data,"微信地图")
          // this.latitude=data.latitude
          // this.longitude=data.longitude
          this.$store.commit('update',
                  { latitude:data.latitude,longitude:data.longitude
                  });
                  this.getAround()
        },
        fail:(info)=>{
          //失败回调
          console.log(info);
          //如果用户拒绝授权
          // 默认为北京
          this.cityName = "北京市";
          this.update({ cityName: "北京市" });
        }
      });
    },
    change:function(e){
      this.active=e
      // this.latitude=this.locationlist[e].location.lat
      // this.longitude=this.locationlist[e].location.lng
      let address=this.locationlist[e].address;
      this.update({ latitude:this.locationlist[e].location.lat,
                longitude:this.locationlist[e].location.lng
          });
     // console.log(address)
      //  wx.request({
      //       url:"https://api.map.baidu.com/geocoder/v2/?ak=KpdqD9A6OzIRDWUV1Au2jcPgy9BZxDGG&address="+address+"&output=json&src=webapp.baidu.openAPIdemo&coord_type= bd09ll",
      //       header: {
      //         "content-type": "application/x-www-form-urlencoded"
      //       },
      //       success:(res)=>{
      //         const _res = res.data.result.location
      //           console.log(_res.lat,_res.lng,"state")
      //           // this.longitude=res.data.result.location.lng
      //           // this.latitude=res.data.result.location.lat
      //           this.update({ latitude:res.data.result.location.lat,
      //                         longitude:res.data.result.location.lng
      //                   });
      //           //console.log(this,"选择位置页面")
      //     }
      //   })
      
    },
    getMapShow(){  //测试根据城市名称获取地图
       wx.request({
            url:"https://api.map.baidu.com/geocoder/v2/?ak=KpdqD9A6OzIRDWUV1Au2jcPgy9BZxDGG&address=广州市&output=json&src=webapp.baidu.openAPIdemo&coord_type= bd09ll",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success:(res)=>{
              const _res = res.data.result.location
                console.log(_res.lat,_res.lng,"state")
                // this.longitude=res.data.result.location.lng
                // this.latitude=res.data.result.location.lat
                this.update({ latitude:res.data.result.location.lat,
                              longitude:res.data.result.location.lng
                        });
                //console.log(this,"选择位置页面")
          }
        })
        const MapContext=wx.createMapContext("map")
        MapContext.getCenterLocation({
          success:(res)=>{
              console.log(res,"获取地图中心位置经纬度")
              this.markers=[{
                  iconPath: "/static/images/person.png",
                  id:1,
                  latitude: res.latitude,
                  longitude: res.longitude,
                  width:48,
                  height:55
              }]
          }
        })
    }
    
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";

</style>
