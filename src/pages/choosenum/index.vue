<template>
  <div>
    <!--城市-->
    <div class="citylist flex-container" v-if="id==1">
      <div class="cityitem" v-for="(item,index) in citylist" :key="item.id" @click="choseItem(index)">
        <text>{{item.name}}</text>
        </div>
    </div>
    <!--字母-->
    <div class="citylist flex-container" v-else>
      <div class="numitem" v-for="(item,cindex) in numlist" :key="item.id" @click="choseItem(cindex)">
        <text>{{item.name}}</text>
        </div>
    </div>
  </div>
</template>

<script>
import "../../css/common.css";
import "../../css/global.css";
export default {
  onLoad(){
    this.setBarTitle();
    this.id=this.$root.$mp.query.id
    //console.log(this.id)
  },
  data () {
    return {
        isCity:false,
        id:"",
        city:"",
        citylist:[
          {id:1,name:"京（北京）"},{id:2,name:"沪（上海）"},{id:3,name:"粤（广东）"},{id:4,name:"渝 (重庆）"},{id:5,name:"津 (天津）"},{id:6,name:"浙 (浙江）"},
          {id:7,name:"川 (四川）"},{id:8,name:"鄂 (湖北）"},{id:9,name:"苏 (江苏）"},{id:10,name:"皖 (安徽)"},{id:11,name:"闽 (福建）"},{id:12,name:"湘 (湖南）"},
          {id:13,name:"黑 (黑龙江））"},{id:14,name:"辽 (辽宁））"},{id:15,name:"吉 (吉林）"},{id:16,name:"鲁 (山东）"},{id:17,name:"甘 (甘肃）"},{id:18,name:"冀 (河北)"},
          {id:19,name:"陕 (陕西）"},{id:20,name:"豫 (河南）"},{id:21,name:"宁 (宁夏）"},{id:22,name:"晋 (山西）"},{id:23,name:"琼 (海南）"},{id:24,name:"赣 (江西）"},
          {id:25,name:"贵 (贵州）"},{id:26,name:"桂 (广西）"},{id:27,name:"云 (云南)"},{id:28,name:"青 (青海）"},{id:29,name:"粤 (广东）"},{id:30,name:"新 (新疆）"},
          {id:31,name:"京（北京）"},{id:32,name:"蒙 (内蒙古）"},{id:33,name:"沪 (上海）"},{id:34,name:"藏 (西藏)"},{id:35,name:"使 (大使馆）"}
          ],
          numlist:[
          {id:1,name:"A"},{id:2,name:"B"},{id:3,name:"C"},{id:4,name:"D"},{id:5,name:"E"},{id:6,name:"F"},
          {id:7,name:"G"},{id:8,name:"H"},{id:9,name:"I"},{id:10,name:"J"},{id:11,name:"K"},{id:12,name:"L"},
          {id:13,name:"M"},{id:14,name:"N"},{id:15,name:"O"},{id:16,name:"P"},{id:17,name:"Q"},{id:18,name:"R"},
          {id:19,name:"S"},{id:20,name:"T"},{id:21,name:"U"},{id:22,name:"V"},{id:23,name:"W"},{id:24,name:"X"},
          {id:25,name:"Y"},{id:26,name:"Z"}
          ]
        
    }
  },
 
  components: {
    
  },
  methods: {
    setBarTitle() {
      wx.setNavigationBarTitle({
        title: "选择车辆"
      });
    },
    
    choseItem(e){
      if(this.id==1){
          this.city=this.citylist[e].name.slice(0,1)
      }else{
          this.city=this.numlist[e].name.slice(0,1)
      }
     
      
      wx.showLoading({
        title: "选择成功..."
      });
      this.goBack()
    },
    goBack(){
      setTimeout(
        ()=>{
          console.log(this.id)
          console.log(this.city)
            wx.navigateTo({ url: "/pages/mycar/main?city="+this.city+"&id="+this.id});
        },2000)
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
