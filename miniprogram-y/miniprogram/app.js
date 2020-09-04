const userDao = require('/store/user-dao.js')
const router = require('/router/router.js')
const requestBuilder = require('/request/factory/requestObjBuilder.js')
//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }



    let that = this
    wx.getSystemInfo({
      success(res) {
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.globalData.viewHeight = res.windowHeight
        that.globalData.viewWidth = res.windowWidth
      }
    })

    //登录
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });


    //获取授权信息
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log('已经授权了')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {//请求授权
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              this.globalData.userInfo = res.userInfo
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail() {
              console.log('用户没有授权')
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    isTargetTargetListReload: false,
    targetTargetListPartRefresh: [],
    isSupervisionTargetListReload: false,
    supervisionTargetListPartRefresh: [],
    isSupervisionRewardListReload: false,
    supervisionRewardListPartRefresh: [],
    viewHeight: 0,//屏幕高度
    viewWidth: 0,//屏幕宽度
    userDao: userDao,//userDao
    router: router,//router
    requestBuilder: requestBuilder,//requestBuilder
    nickName: '',
    bnickName: ''

  }
})
