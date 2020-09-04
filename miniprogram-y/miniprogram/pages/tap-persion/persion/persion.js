let userInfoObj = require('../../../request/user/info')
Page({
    data: {
        username: "",
        userAccount: "",
        requestBuilder: {},
        imageSrc:"",
        userDao: {},
        router: {},
        viewHeight: 0,//屏幕高度
        viewWidth: 0,//屏幕宽度
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        can_getuserinfo: false
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
        wx.setStorageSync('can_getuserinfo', true);

        app.globalData.nickName = e.detail.userInfo.nickName
        console.log("appgn----------------------appgn")
        console.log(app.globalData.nickName)
        console.log("appgn----------------------appgn")
  
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
              this.setData({
                can_getuserinfo: true
            })
              wx.switchTab({
                // url: '/pages/tap-target/target-list/target-list', 
                //这里是成功登录后跳转的页面
                url: '/pages/tap-persion/persion/persion',
                // 跳转页面后刷新页面
                success() {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                }
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

    //跳转到我的审核列表
    handleTapReviewed(){
        console.log('跳转到我的审核列表')
        this.data.router.toTapPersionReviewedList()
    },

    //跳转到我的兑换列表
    handleTapExchange(){
        console.log('跳转到我的审核列表')
        this.data.router.toTapPersionExchangeList()
    },

    handleTapLogout(){
        console.log('退出登录')
        wx.clearStorage()
        wx.reLaunch({
            url: '../../tap-persion/persion/persion'
          })
    },
    loadUserInfo(){
        wx.getStorage({
            key: 'can_getuserinfo',
            success: res => {
              this.setData({
                can_getuserinfo: true
            })
            }
          });
        
        //从缓存中加载用户数据
        // let currentUser = this.data.userDao.getUser();
        wx.getStorage({
            key: 'userInfo',
            success: res => {
              console.log(res.data)
              console.log(res)
              this.setData({
                imageSrc: res.data.avatarUrl,
                username: res.data.nickName
            })
            }
          });
          wx.getStorage({
            key: 'userAccount',
            success: res => {
              console.log(res.data)
              console.log(res)
              this.setData({
                userAccount: res.data
            })
            }
          });
    },
    refreshUserAmount(){
        let that = this
        
        wx.cloud.callFunction({ 
            name: 'getUserAmount', 
            data: {nickName:that.data.username},
     
            success: (res) => { 
                console.log(res.result)
                this.setData({
                    userAccount: res.result[0].amount
                })
                wx.setStorageSync('userAccount', res.result[0].amount);
                console.log(that.data.userAccount)
            },
            fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '调用失败',
                })
                console.error('[云函数] [getUserAmount] 调用失败：', err)
              }
          })     
    },

    // 第一次加载应该使用云函数的数据
    onLoad(){


        let app = getApp()
        // 获取系统信息
        
        this.loadUserInfo();
        this.setData({
            viewHeight: app.globalData.viewHeight,
            viewWidth: app.globalData.viewWidth,
            userDao: app.globalData.userDao,
            router: app.globalData.router
            // imageSrc: app.globalData.userInfo == null ? '/static/images/icon-person.png' : app.globalData.serInfo.avatarUrlu
        })
    },
    onShow(){
      this.loadUserInfo()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.refreshUserAmount()
        this.loadUserInfo()
        wx.stopPullDownRefresh()
    }
})