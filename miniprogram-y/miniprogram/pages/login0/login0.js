// miniprogram/pages/login0/login0.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bcimgUrl: '../../images/10.jpg',
    userInfo:'',
    can_getuserinfo: false


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const userInfo = app.globalData.userInfo
    // this.setData({
    //     userInfo:userInfo
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
                  success: function (sres) {       //访问存放微信用户头像的Url 
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
      let app = getApp();     
      // 取得全局App

      wx.setStorageSync('userInfo', e.detail.userInfo);
      this.setData({
          userInfo:e.detail.userInfo
      })
      wx.setStorageSync('nickName', e.detail.userInfo.nickName);
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
      app.globalData.nickName = e.detail.userInfo.nickName
      console.log("appgn----------------------appgn")
      console.log(app.globalData.nickName)

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
            console.log("登录授权为真")
            wx.switchTab({
              url: '/pages/tap-target/target-list/target-list', //这里是成功登录后跳转的页面
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
    }
})