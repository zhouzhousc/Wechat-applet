// pages/tap-supervision/target-list/target-list.js
let targetFindall = require('../../../request/target/findall.js')
let supervisionTargetListInteractive = require('../../../interactive/supervisionTargetListInteractive')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        viewHeight: 0,//屏幕高度
        viewWidth: 0,//屏幕宽度
        page: {//页面情况
            number: 0,//当前页面
            totalPages: 0,//总页面数
            totalElements: 0,//元素总数
            size: 5
        },
        targetEnabled: true,
        targets: [],
        hasMore: false,
        requestBuilder: {},
        userDao: {},
        router: {},
        bowner: ''
    },

    //跳转到详情
    handleTapDetail(event){
        console.log('跳转到任务详情')
        let target = event.currentTarget.dataset.target;
        this.data.router.toTapSupervisionTargetDetail([{ key: "target", value: JSON.stringify(target) }])
    },

    //获取页面数据
    loadTable() {
        let requireData = {
            // supervisionId: this.data.userDao.getUser().supervisionsIdForSuperintendentId,
            enabled: this.data.targetEnabled,
            page: this.data.page.number,
            size: this.data.page.size,
            state:"",
            owner: this.data.bowner
        }
        targetFindall.data = requireData
        let that = this

        wx.cloud.callFunction({
            name: 'targetfenye',
            data: requireData,
            
            success: res => {
                console.log("Print -->")
                console.log(res.result)
                console.log(res)

                if (res.result.page.number == 0) {//重头开始
                    that.setData({
                        targets: res.result.data
                    })
                } else {//从中间开始
                    let targets = that.data.targets
                    for (let target of res.result.data) {
                        targets.push(target)
                    }
                    that.setData({
                        targets: targets
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
                console.log(that.data.targets)

            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [targetfenye] 调用失败：', err)
            }
          });
    },
    resetPage() {//重置页面情况
        this.setData({
            page: {//页面情况
                number: 0,//当前页面
                totalPages: 0,//总页面数
                totalElements: 0,//元素总数
                size: 5
            }
        })
        console.log('页面情况重置成功')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let app = getApp()
        // 获取系统信息
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
        if (supervisionTargetListInteractive.isReload()) {//判断是否整个页面刷新
            //获取数据
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
            this.resetPage()
            this.loadTable()
            supervisionTargetListInteractive.resetReload()
        } else {//判断是否局部刷新
            if (supervisionTargetListInteractive.isPartRefresh()) {
                let newTargets = supervisionTargetListInteractive.resetPartRefresh()
                for (let target of newTargets) {
                    for (let i = 0; i < this.data.targets.length; i++) {
                        if (this.data.targets[i].id == target.id) {
                            this.setData({
                                ['targets[' + i + ']']: target
                            })
                        }
                    }
                }
            }
        }
    }
})