let reviewedCount = require('../../../request/reviewed/count.js')
let userSupervisedInfo = require('../../../request/user/supervisedInfo.js')
// pages/supervision/supervision.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        superintendent: '',
        superintendentAmount: 0,
        unreatedCount: 0,
        requestBuilder: {},
        userDao: {},
        router: {},
        viewHeight: 0,//屏幕高度
        viewWidth: 0,//屏幕宽度
        owner: '',
        bowner: ''
    },

    //跳转到兑换记录
    handleTapExchangeList(){
        wx.navigateTo({
            url: '/pages/tap-supervision/exchange-list/exchange-list',
        })
    },
    //跳转到审核列表
    handleTapReviewed(){
        wx.navigateTo({
            url: '/pages/tap-supervision/reviewed-list/reviewed-list',
        })
    },
    //跳转到他的任务列表
    handleTapTargets(){
        wx.navigateTo({
            url: '/pages/tap-supervision/target-list/target-list',
        })
    },
    //跳转到奖品列表
    handleTapRewardList(){
        wx.navigateTo({
            url: '/pages/tap-supervision/reward-list/reward-list',
        })
    },

    //加载监督者信息
    loadUserSupervisedInfo() {
        let that = this
        let app = getApp()

        wx.cloud.callFunction({
            name: 'getsupervisedinfo',
            data: {owner: that.data.owner},
            success: res => {
                app.globalData.bnickName = res.result.data[0].nickname
                console.log(app.globalData.bnickName)
                console.log('获取监督人信息成功')
                console.log(res)
                console.log(res.result)
                that.setData({
                    superintendent: res.result.data[0].nickname,
                    superintendentAmount: res.result.data[0].amount
                    
                })
                
                wx.setStorageSync('bnickName', res.result.data[0].nickname)

                console.log("llllllllllllllllllll")
              
            },
            fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '调用失败',
                })
                console.error('[云函数] [targetfenye] 调用失败：', err)
              }
            
        })

    },

    
    //加载未读审核
    loadReviewedCount(){

        reviewedCount.data = {
            state: 1,
            enabled: true,
            // supervisionId: this.data.userDao.getUser().supervisionsIdForSuperintendentId
        }
        let that = this

        wx.cloud.callFunction({
            name: 'getreviewedcount',
            data: {owner: that.data.superintendent},
            success: res => {
                console.log('获取审核数成功')
                console.log(res)
                console.log(res.result)
                that.setData({
                    unreatedCount: res.result.total
                })
                console.log("llllllllllllllllllll")
              
            },
            fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '调用失败',
                })
                console.error('[云函数] [getreviewedcount] 调用失败：', err)
              }
            
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let app = getApp()
        //定义高度与宽度
        this.setData({
            viewHeight: app.globalData.viewHeight,
            viewWidth: app.globalData.viewWidth,
            owner: app.globalData.nickName
        
            // requestBuilder: app.globalData.requestBuilder,
            // userDao: app.globalData.userDao,
            // router: app.globalData.router
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
        this.loadUserSupervisedInfo()
        this.loadReviewedCount()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        
        this.loadUserSupervisedInfo()
        this.loadReviewedCount()
        wx.stopPullDownRefresh()
    }
})