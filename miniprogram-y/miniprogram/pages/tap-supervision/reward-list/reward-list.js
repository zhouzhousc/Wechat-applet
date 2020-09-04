let prizeFindallObj = require('../../../request/prize/findall')
let storeDownloadObj = require('../../../request/store/download-file')
let supervisionRewardListInteractive = require('../../../interactive/supervisionRewardListInteractive')
let storeDao = require('../../../store/store-dao')
// pages/tap-supervision/reward-list/reward-list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: {//页面情况
            number: 0,//当前页面
            totalPages: 0,//总页面数
            totalElements: 0,//元素总数
            size: 8
        },
        rewards: [],
        hasMore: false,
        requestBuilder: {},
        userDao: {},
        router: {},
        viewHeight: 0,//屏幕高度
        viewWidth: 0,//屏幕宽度
        imagePath: "/static/images/icon-add-fill.png",
        downloadCompleted: false,
        bowner: ''
    },


    //为某个奖品添加跳转到详情的参数
    addNavigateParamsForReward(reward){
        let jsonStr = JSON.stringify(reward)
        reward.navigateParams = encodeURIComponent(jsonStr)
    },

    //为某个奖品记录添加图片地址,异步方法
    addPictureForReward(reward){
        console.log("###########################")
        console.log(reward.storeId)
        let storeId = reward.storeId
        let path = storeDao.getStore(storeId)//获取本地路径
        if (path == undefined) {//本地并没有保存
            console.log("***&&&&&***")
            console.log(storeId)
            storeDao.downloadPicture(storeId)
            //第一次用网图并下载
            reward.storePath = this.data.requestBuilder(storeDownloadObj).url+'?storeId='+storeId
        }else{
            reward.storePath = path
        }
    },


    resetPage() {//重置页面情况
        this.setData({
            page: {//页面情况
                number: 0,//当前页面
                totalPages: 0,//总页面数
                totalElements: 0,//元素总数
                size: 8
            }
        })
        console.log('页面情况重置成功')
    },


    //获取页面数据
    loadTable() {
        let requireData = {
            // supervisionId: this.data.userDao.getUser().supervisionsIdForSuperintendentId,
            // enabled: true,
            page: this.data.page.number,
            size: this.data.page.size,
            owner: this.data.bowner
        }
 
        let that = this
        wx.cloud.callFunction({
            name: 'prizefindall',
            data: requireData,

            success: res => {
                for (let reward of res.result.data) {
                    that.addPictureForReward(reward)
                    that.addNavigateParamsForReward(reward)
                }
                console.log(res)
                console.log(res.result)
                console.log(res.result.data)
                console.log("llllllllllllllllllll")

                if (res.result.page.number == 0) {//重头开始
                    that.setData({
                        rewards: res.result.data
                    })
                } else {//从中间开始
                    let rewards = that.data.rewards
                    for (let reward of res.result.data) {
                        rewards.push(reward)
                    }
                    that.setData({
                        rewards: rewards
                    })
                }
                that.setData({
                    page: {//页面情况
                        number: res.result.page.number,//当前页面
                        totalPages: res.result.page.totalPages,//总页面数
                        totalElements: res.result.page.totalElements,//元素总数
                        size: that.data.page.size
                    }
                })
                let hasMore = false
                if (that.data.page.totalPages - 1 > that.data.page.number) {
                    hasMore = true
                }
                that.setData({
                    hasMore: hasMore
                })
                console.log(that.data.page)
                console.log(that.data.rewards)

            },
            fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '调用失败',
                })
                console.error('[云函数] [prizefindall] 调用失败：', err)
              }
        })     
    },


    //跳转到添加奖品
    handleAddReward(){
        wx.navigateTo({
            url: '/pages/tap-supervision/reward-add/reward-add',
        })
    },

    handleTouchStart(){
        this.setData({
            imagePath: "/static/images/icon-add.png"
        })
    },
    handleTouchEnd(){
        this.setData({
            imagePath: "/static/images/icon-add-fill.png"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let app = getApp()
        //定义高度与宽度
        this.setData({
            viewHeight: app.globalData.viewHeight,
            viewWidth: app.globalData.viewWidth,
            requestBuilder: app.globalData.requestBuilder,
            userDao: app.globalData.userDao,
            router: app.globalData.router,
            bowner: app.globalData.bnickName
        })
        //获取数据
        this.resetPage()
        this.loadTable()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        console.log('上拉刷新')
        this.resetPage()
        this.loadTable()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('下拉触底')
        if (this.data.hasMore) {//还有更多内容
            this.setData({
                page: {//页面情况
                    number: this.data.page.number + 1,//当前页面
                    totalPages: this.data.page.totalPages,//总页面数
                    totalElements: this.data.page.totalElements,//元素总数
                    size: this.data.page.size
                }
            })
            //加载数据
            this.loadTable()
        }
    },


    onShow(){
        if (supervisionRewardListInteractive.isReload()) {//判断是否整个页面刷新
            //获取数据
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
            this.resetPage()
            this.loadTable()
            supervisionRewardListInteractive.resetReload()
        } else {//判断是否局部刷新
            if (supervisionRewardListInteractive.isPartRefresh()) {
                let newRewards = supervisionRewardListInteractive.resetPartRefresh()
                for (let reward of newRewards) {
                    this.addPictureForReward(reward)
                    this.addNavigateParamsForReward(reward)
                    for (let i = 0; i < this.data.rewards.length; i++) {
                        if (this.data.rewards[i].id == reward.id) {
                            this.setData({
                                ['rewards[' + i + ']']: reward
                            })
                        }
                    }
                }
            }
        }
    }
})