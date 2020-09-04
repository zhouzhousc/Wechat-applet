//index.js
const app = getApp()
let can_getuserinfo = false

Page({
  data: {
    can_getuserinfo: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bcimgUrl: '../../images/10.jpg',
    router: {},
    nickName: ''
  },

  onLoad: function() {

    wx.getStorage({
      key: 'can_getuserinfo',
      success: res => {
        console.log(res.data)
        console.log("vvvvvvvvvvvvvvvvv")

        this.setData({          
          can_getuserinfo: res.data
        })
      },
    })

    console.log(can_getuserinfo)
    console.log("kkkkkkkkkkkkkkkk")

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
        

  //获取用户头像时调用的函数
  getUserImg: function (e) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo
              var avatarUrl = userInfo.avatarUrl; //获取微信用户头像存放的Url 
              wx.getImageInfo({
                src: avatarUrl,
                success: function (sres)  {       //访问存放微信用户头像的Url 
                  wx.saveImageToPhotosAlbum({   //下载用户头像并保存到相册（默认为手机相册weixin目录下）
                    filePath: sres.path,
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  bindGetUserInfo: function (e) {

    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.setData({
        userInfo:e.detail.userInfo
    })
    if (e.detail.userInfo) { 
      wx.cloud.callFunction({ 
        name: 'saveUserInfo', 
        data: { 
          userInfo: e.detail.userInfo 
        }, 
        
        success: (res) => { 
          console.log(res) 

          if (res.result && res.result._id) { 
            wx.showToast({ title: '保存成功', 
          }) 
        } 
          wx.setStorage({
            key: 'can_getuserinfo',
            data: true,
          })
          // console.log(can_getuserinfo)
          console.log("ggggggggggggggggggggg")
          // wx.navigateTo({
          //   url: '/pages/tap-target/target-list/target-list', //这里是成功登录后跳转的页面
          // })

          wx.switchTab({
            url: '/pages/tap-target/target-list/target-list'
          })


        
      }, 
        fail: (err) => { 
          wx.showToast({ 
            title: '保存失败...', 
            icon: 'none' 
          }) 
        } 
      }) 
    }
  },

  handleTapLogin() {
    let that = this 
    let app = getApp();     
    // 取得全局App

    wx.getStorage({
      key: 'nickName',

      success: res => {
        console.log(res)
        this.setData({
          nickName: res.data
        })
        console.log(res.data)
        console.log(that.data.nickName)
        app.globalData.nickName = that.data.nickName
        console.log(app.globalData.nickName)

      }
    })

    
    wx.getStorage({
      key: 'can_getuserinfo',

      success: res => {

        console.log('如果没有该缓存键存在，会走fail路径')
        console.log(res)
        console.log(res.data)
        console.log("app----------------------app")
        console.log(app.globalData.nickName)
        console.log("app----------------------app")
        if (res.data == true) { 
          wx.switchTab({
            url: '/pages/tap-target/target-list/target-list'
          })
          console.log('任务页面跳转')
        }         
      },
      fail: res => {
        wx.navigateTo({
          url: '/pages/login0/login0'
        })
      }
    })
  },

})
