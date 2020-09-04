let reviewedFindall = require('../../../request/reviewed/findall.js')
let reviewedVerify = require('../../../request/reviewed/verify.js')
let supervisionTargetListInteractive = require('../../../interactive/supervisionTargetListInteractive')
let simpleDateFormatter = require('../../../utils/simpleDateFormatter.js')
// pages/reviewed/reviewed.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        page: {//页面情况
            number: 0,//当前页面
            totalPages: 0,//总页面数
            totalElements: 0,//元素总数
            size: 5
        },
        revieweds: [],
        targetCon: "",
        hasMore: false,
        requestBuilder: {},
        userDao: {},
        router: {},
        viewHeight: 0,//屏幕高度
        viewWidth: 0,//屏幕宽度
        bowner: '',
        targetRew: 0
    },
    //
    handleTapReject(event) {//拒绝操作
        let reviewed = event.currentTarget.dataset.reviewed;
        console.log("##############")
        console.log(reviewed.targetContent)

        let that = this
        that.setData({
            targetCon: reviewed.targetContent
        })

        wx.showModal({
            title: '否决',
            content: '是否否决任务结果，否决后任务将变成进行状态',
            success: function (res) {
                if (res.confirm) {
                    console.log('进行请求')
                    that.verifyReviewed(that.data.targetCon, false)
                } else {
                    return
                }
            }
        });
    },
    handleTapAgree(event) {//同意操作
        let reviewed = event.currentTarget.dataset.reviewed;
        console.log(reviewed)
        let that = this
        that.setData({
            targetCon: reviewed.targetContent
        })
        wx.showModal({
            title: '同意',
            content: '同意任务结果，同意后他将奖励' + reviewed.targetReward + '积分',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        targetRew: reviewed.targetReward
                    })
                    that.verifyReviewed(that.data.targetCon, true)
                } else {
                    return
                }
            }
        })
    },
    //审批分装
    verifyReviewed(reviewedId, reply) {
        let nowtime = simpleDateFormatter.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
        
        reviewedVerify.data = data
        let that = this
        let data = {targetcon: reviewedId, reply: reply, nowtime: nowtime, owner: that.data.bowner, targetrew: that.data.targetRew}
        wx.cloud.callFunction({ 
            name: 'agreeorReject', 
            data: data,
            
            success: (res) => { 
                console.log("@@@@@@@@@@@@@@@@")
                // console.log(that.data.revieweds[0].targetContent)
                // console.log(res)
                // console.log(res.result)
                for (let i = 0; i < that.data.revieweds.length; i++) {
                    if (that.data.revieweds[i].targetContent == res.result) {
                        //如果是最后一个的话直接移除
                        if(i==that.data.revieweds.length-1){
                            that.data.revieweds.pop()
                            that.setData({
                                revieweds: that.data.revieweds
                            })
                            break
                        }
                        for (let x = i; x < that.data.revieweds.length - 1; x++) {
                            that.data.revieweds[x] = that.data.revieweds[x + 1]
                            that.data.revieweds.pop()
                            that.setData({
                                revieweds: that.data.revieweds
                            })
                        }
                        break
                    }
                }
                wx.showToast({
                    title: '操作成功',
                })
                supervisionTargetListInteractive.setReload()
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '调用失败',
                })
                console.error('[云函数] [getReviewed] 调用失败：', err)
                }
        })
    },

    //获取页面数据
    loadTable() {
        let requireData = {
            // supervisionId: this.data.userDao.getUser().supervisionsIdForSuperintendentId,
            enabled: true,
            page: this.data.page.number,
            size: this.data.page.size,
            state: 1,
            owner: this.data.bowner
        }
        reviewedFindall.data = requireData
        // console.log(reviewedFindall)
        let that = this
        wx.cloud.callFunction({ 
            name: 'getSupReviewed', 
            data: requireData,
            
            success: (res) => { 
                if (res.result.page.number == 0) {//重头开始
                    that.setData({
                        revieweds: res.result.data
                    })
                } else {//从中间开始
                    let revieweds = that.data.revieweds
                    for (let reviewed of res.result.data) {
                        revieweds.push(reviewed)
                    }
                    that.setData({
                        revieweds: revieweds
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
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                console.log(this.data.hasMore)
                console.log(that.data.page)
                console.log(that.data.revieweds)

            },
            fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '调用失败',
                })
                console.error('[云函数] [getReviewed] 调用失败：', err)
              }
        })     
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
    }
})