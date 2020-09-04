let util = require('../../../utils/util.js');
let simpleDateFormatter = require('../../../utils/simpleDateFormatter.js');
let numberUtil = require('../../../utils/numberUtil.js')
let targetAddObj = require('../../../request/target/add.js')
let targetListInteractive = require('../../../interactive/targetTargetListInteractive.js')
// pages/add-target/add-target.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        now: util.formatTime(new Date()),
        deadline: null,
        content: null,
        contentLength: 0,
        reward: 1,
        punishment: 1,
        addDisabled: false,//添加按钮是否不可用
        requestBuilder: {},
        userDao: {},
        router: {},
        viewHeight: 0,//屏幕高度
        viewWidth: 0,//屏幕宽度
        result: '',
        owner: ''
    },
    //数据重置
    resetData(){
        console.log('添加任务数据重置')
        this.setData({
            now: util.formatTime(new Date()),
            deadline: null,
            content: null,
            contentLength: 0,
            reward: 1,
            punishment: 1,
            addDisabled: false
        })
    },
    handleChangeDate(val){
        console.log(val.detail.value)
        this.setData({
            deadline: val.detail.value
        })
    },
    handleInputContent(event){
        this.setData({
            content: event.detail.value,
            contentLength: event.detail.value.length
        })
    },
    handleInputReward(event){
        let value = event.detail.value
        if (!numberUtil.isRealNum(value) || numberUtil.isFloat(value)) {
            value = ""
        }
        this.setData({
            reward: value
        })
    },
    handleInputPunishment(event){
        let value = event.detail.value
        if (!numberUtil.isRealNum(value) || numberUtil.isFloat(value)) {
            value = ""
        }
        this.setData({
            punishment: value
        })
    },
    //点击确认按钮
    handleTapAdd(){
        this.setData({
            addDisabled: true
        })
        let that = this
        wx.showModal({
            title: '确认添加任务',
            content: '是否确认添加任务，确认后任务不可修改',
            success: function (res) {
                if (res.confirm) {
                    if (that.validate()) {//校验成功
                        wx.showLoading({
                            title: '添加中'
                        })
                        let nowtime = simpleDateFormatter.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
                        let adddata = {
                            content: that.data.content,
                            deadline: that.data.deadline,
                            reward: that.data.reward,
                            punishment: that.data.punishment,
                            owner: that.data.owner,
                            nowtime: nowtime
                        }
                        // targetAddObj.data = data
                        // wx.request(that.data.requestBuilder(targetAddObj, (res) => {
                        //     wx.hideLoading()
                        //     if (res.data.status) {
                        //         console.log('添加成功')
                        //         //让任务列表刷新
                        //         targetListInteractive.setReload()
                        //         //跳转到任务列表
                        //         that.data.router.toTapTargetTargetList()
                        //     } else {//失败了
                        //         wx.showToast({
                        //             title: res.data.message,
                        //             icon: 'none'
                        //         })
                        //         return
                        //     }
                        // }))
                        wx.cloud.callFunction({
                            name: 'targetadd',
                            data: adddata,
                            success: res => {
                              wx.showToast({
                                title: '添加成功',
                              })
                                //让任务列表刷新
                                targetListInteractive.setReload()
                                //跳转到任务列表
                                wx.switchTab({
                                    url: '/pages/tap-target/target-list/target-list'
                                })
                            //   this.setData({
                            //     result: JSON.stringify(res.result)
                            //   })
                            },
                            fail: err => {
                              wx.showToast({
                                icon: 'none',
                                title: '调用失败',
                              })
                              console.error('[云函数] [targetadd] 调用失败：', err)
                            }
                          })

                    }
                } else if (res.cancel) {
                    return
                }
            }
        })
        this.setData({
            addDisabled: false
        })
    },
    //数据校验
    validate(){
        if (this.data.contentLength == 0) {
            wx.showToast({
                title: '任务内容不能为空',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (this.data.deadline == null) {
            wx.showToast({
                title: '截止时间不能为空',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        let deadlineDateTime = simpleDateFormatter.parseDate(this.data.deadline, 'yyyy-MM-dd').getTime()
        let now = simpleDateFormatter.formatDate(new Date(), "yyyy-MM-dd")
        let nowDateTime = simpleDateFormatter.parseDate(now, 'yyyy-MM-dd').getTime()
        if (deadlineDateTime <= nowDateTime) {
            wx.showToast({
                title: '截止时间必须大于当前时间',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (!numberUtil.isRealNum(this.data.reward) || !numberUtil.isRealNum(this.data.punishment)) {
            wx.showToast({
                title: '请输入分数',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (this.data.reward <= 0 || this.data.punishment <= 0) {
            wx.showToast({
                title: '分数只能是大于0而小于999',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        return true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let app = getApp()
        // 获取系统信息
        this.setData({
            viewHeight: app.globalData.viewHeight,
            viewWidth: app.globalData.viewWidth,
            owner: app.globalData.nickName,
            userDao: app.globalData.userDao,
            router: app.globalData.router
        })
    },
    onShow() {
        let app = getApp()
        this.setData({
          owner: app.globalData.nickName
        })
        this.resetData()
      }
})