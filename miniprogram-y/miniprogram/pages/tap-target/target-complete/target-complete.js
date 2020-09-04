let targetCompleteObj = require('../../../request/target/complete.js')
let targetListInteractive = require('../../../interactive/targetTargetListInteractive.js')
let simpleDateFormatter = require('../../../utils/simpleDateFormatter.js')
// pages/complete-target/complete-target.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:null,
    commentLength:0,
    target:{},
    superintendent: '',
    commitReviewDisabled:false,
    requestBuilder: {},
    userDao: {},
    router: {},
    viewHeight: 0,//屏幕高度
    viewWidth: 0,//屏幕宽度
    owner: '',
    bowner: ''
  },
  //重置数据
  resetData(){
    this.setData({
      comment: null,
      commentLength: 0,
      target: {},
      commitReviewDisabled:false
    })
  },
  handleInputComment(event){
    this.setData({
      comment:event.detail.value,
      commentLength:event.detail.value.length
    })
  },
  handleTapCommit(){
    this.setData({
      commitReviewDisabled:true
    })
    let that = this
    if(this.validate()){
      wx.showModal({
        title: '是否提交',
        // content: '是否提交给' + that.data.userDao.getUser().superintendent,
        content: '是否提交给' + that.data.bowner,
        success: function (res) {
          if (res.confirm) {
              wx.showLoading({
                title: '提交中'
              })
              let nowtime = simpleDateFormatter.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
              let completedata = {
               // targetId: that.data.target.id,
                targetId: that.data.target._id,
                targetReward: that.data.target.reward,
                targetComment: that.data.target.content,
                comment:that.data.comment,
                owner: that.data.owner,
                nowtime: nowtime
              }
              wx.cloud.callFunction({
                name: 'targetcomplete',
                data: completedata,           

                success: res => {
                  console.log("ccccccccccccccc")
                  console.log(res)
                  wx.hideLoading()
                    if (res.result.stats) {
                      console.log('提交成功')
                      //让任务列表刷新
                      //targetListInteractive.setPartRefresh(res.data.data)
                      that.data.router.toTapTargetTargetList()
                    
                      //让任务列表刷新
                      targetListInteractive.setReload()
                      //跳转到任务列表
                      wx.switchTab({
                        url: '/pages/tap-target/target-list/target-list'
                      })
                    } 
                }, 
                fail: err => {
                  //失败了
                  console.log("提交审核失败了")
                  wx.showToast({
                    title: res.errMsg,
                    icon: 'none'
                  })
                  return
                }
              })
          } else if (res.cancel) {
            return
          }
        }
      })
    }
    this.setData({
      commitReviewDisabled: false
    })
  },
  //表格校验
  validate(){
    if (this.data.commentLength == 0) {
      wx.showToast({
        title: '感想内容不能为空',
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
    this.resetData()
    //将参数格式化
    if(options.target){
      this.setData({
        target: JSON.parse(options.target)
      })
    }
    let app = getApp()
    // let that = this
    // console.log("app.globalData.nickName")
    // console.log(app.globalData.nickName)
    // wx.getStorageSync({
    //   key: 'nickName',
    //   success (res) {
    //       console.log("---------------" + res.data)
    //       that.setData({
    //           owner: res.data
    //       })
    //   }
    // })
    // 获取系统信息
    this.setData({
      viewHeight: app.globalData.viewHeight,
      viewWidth: app.globalData.viewWidth,
      requestBuilder: app.globalData.requestBuilder,
      router: app.globalData.router,
      // superintendent: app.globalData.userDao.getUser().superintendent
    })
   
  },

  onShow() {
    let app = getApp()

    this.setData({
      owner: app.globalData.nickName,
      bowner: app.globalData.bnickName
    })
  }


})