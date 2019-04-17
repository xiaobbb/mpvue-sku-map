import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    cityName: "定位中..",
    nowPlace:"正在定位中...",
    latitude:"",
    longitude:"",
    pList:[],//上门洗车添加图片
    visitconfirmorder:{  //到店确认订单
      ProductId:''
    },
    //商城确认订单
    confirmOrder:{
      addressId:'',
      productId:'',
      sku:'',
      buyNum:1,
      couponId:'',
    },
    // 是否正在选择地址
    addressId:'',
    selectAddress:{
      url:'',
      status:false
    },
    // 选择优惠券状态，price产品价格，productId产品id，calssifyId分类Id
    selectCoupon:{
      price:0,
      productId:0,
      classifyId:0,
      url:'',
      status:false
    },
    // 优惠券价格
    couponPrice:0.00,
    // 购物车
    carIds:[],
  },
  mutations: {
    /**
     * 在main.js例引入
     * import store from './store/index'
     * 把store挂载到全局
     * Vue.prototype.$store = store;
     */

    /**
     * 这里设置一个统一的方法,大部分用的vuex都是简单的改变一些状态,不需要写过多的mutations
     * 使用方法 例:
     * this.$store.update({"cityName":"北京"})
     * this.$store.commit('update',{"cityName":"北京"})
     * 
     *  config需要传入对象
     * @param {*} state 
     * @param {*Object} config 
     */
    update(state, config) {
      Object.keys(config).map((item, key) => {
        state[item] = config[item]
      })
    },
    // 设置提交订单到店数据
    setVisitConfirmOrder(state,params){
      state.visitconfirmorder = params;
    },
    // 设置提交订单商城数据
    setConfirmOrder(state,params){
      state.confirmOrder = params;
    },
    // 选择地址
    setSelectAddress(state,params){
      state.selectAddress = params
    },
    // 选择优惠券
    setSelectCoupon(state,params){
      state.selectCoupon = params
    }
    
  }
})

export default store;

