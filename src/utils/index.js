// import logins from './login'

function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

export function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}


//API接口地址
const host = 'https://carapi.wtvxin.com/api/';
//const host = 'http://localhost:801/api/';
const filePath = 'https://car.wtvxin.com';
export {
    host,
    filePath
}
//请求封装
function request(url, method, data, header = {}) {
    wx.showLoading({
        title: '加载中' //数据请求前loading
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url, //仅为示例，并非真实的接口地址
            method: method,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                wx.hideLoading();
                switch (res.data.code) {
                    case 0:
                        resolve(res.data);
                        break;
                    case 2:
                        wx.showToast({
                            title: '需要重新登录!',
                            icon: 'none'
                        })
                        // logins();
                        setTimeout(()=>{
                            wx.navigateTo({url:'/pages/login/main'})
                        },1000)
                        reject(false)
                        break;
                    default:
                        reject(false)
                        wx.showToast({
                            title: res.data.msg + '!',
                            icon: 'none'
                        })
                }
            },
            fail: function(error) {
                wx.hideLoading();
                wx.showToast({
                    title: error + '，请刷新页面重试!',
                    icon: 'none'
                })
                reject(false)
            },
            complete: function() {
                wx.hideLoading();
            }
        })
    })
}

//请求个性化数据，Head带上AccessToken
function myrequest(url, method, data, header = {}) {
    var accessToken = wx.getStorageSync('accessToken');
    wx.showLoading({
        title: '加载中' //数据请求前loading
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url, //仅为示例，并非真实的接口地址
            method: method,
            data: data,
            header: {
                'content-type': 'application/json', // 默认值
                'Authorization': `Bearer ` + accessToken,
            },
            success: function(res) {
                wx.hideLoading();
                resolve(res.data)
            },
            fail: function(error) {
                wx.hideLoading();
                reject(false)
            },
            complete: function() {
                wx.hideLoading();
            }
        })
    })
}

export function getbase64(urladdress) {

    wx.request({
        url: urladdress,
        method: 'GET',
        responseType: 'arraybuffer',
        success: (result) => {
            let base64 = wx.arrayBufferToBase64(result);
            return base64;
        },
        fail: () => {},
        complete: () => {}
    });
    //({
    //     url:'https://www.dounine.com/hello.jpg',
    //     method:'GET',
    //     responseType: 'arraybuffer',
    //     success:function(res){
    //       let base64 = wx.arrayBufferToBase64(res);
    //       $this.data.userImageBase64 = 'data:image/jpg;base64,' + base64;;
    //     }
    // });

}
export function get(url, data) {
    return request(url, 'GET', data)
}
export function post(url, data) {
    return request(url, 'POST', data)
}

//myget ,mypost 携带AccessToken获取个性化(私人)数据
export function myget(url, data) {

    return myrequest(url, 'GET', data)
}

export function mypost(url, data) {

    return myrequest(url, 'POST', data)
}
//用户是否登录 未登录跳转到登录页面

//提供全局方法，维护和判断accessToken
export function toLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
        wx.navigateTo({
            url: "/pages/login/main"
        });
    } else {
        return true;
    }
}

export function login() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
        return userInfo;
    }
}

//AccessToken过期时间(大概是1天)，定时检测AccessToken,在过期之前清空本地userInfo
export function checkAccessToken() {
    setInterval(checkAccessTokenTimeout, 3 * 1000); //这个时间可以自定义。比如 25 * 60 * 1000（代表25分钟）
}

//检查accessToken是否过期
export function checkAccessTokenTimeout() {
    var accesstoken = wx.getStorageSync('token');
    if (accesstoken == null || accesstoken == undefined || accesstoken == "") {
        console.log("token is empty")
        return false
    }
    var tokenDate = wx.getStorageSync('tokenDate');
    var aftertimestamp = Date.parse(new Date()); //返回时间毫秒数，比如1489899243209
    if (aftertimestamp - tokenDate >= 43200000) { //超过了12小时,重新登陆
        removeLocalToken()
        return false
    }
    return true
}

function removeLocalToken() { //移除userInfo,Token
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
}

export function getStorageOpenid() {
    const openId = wx.getStorageSync("openId");
    if (openId) {
        return openId;
    } else {
        return ''
    }
}

export function getOpenid() {
    // wx.login({
    //   success: res => {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://api.weixin.qq.com/sns/jscode2session',
    //         data: {
    //           "appid": "wx73dbae1cbf851757",
    //           "secret": "317530a0780de9929daeca3cb06f6f5d",
    //           "js_code": res.code,
    //           "grant_type": "authorization_code"
    //         },
    //         success: function (data) {
    //           var openid = data.data.openid;
    //           wx.setStorageSync("openid", openid);
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }

    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
}

export function getCurrentPageUrlWithArgs() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    const options = currentPage.options;
    let urlWithArgs = `/${url}?`
    for (let key in options) {
        const value = options[key]
        urlWithArgs += `${key}=${value}&`
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
}