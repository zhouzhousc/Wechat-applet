let simpleDateFormatter = require('../../../utils/simpleDateFormatter.js')
let reviewedFindall = require('../../../request/reviewed/findall.js')      

// pages/my-reviewed/my-reviewed.js
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
    hasMore: false,
    requestBuilder: {},
    userDao: {},
    router: {},
    viewHeight: 0,//屏幕高度
    viewWidth: 0,//屏幕宽度
    owner: ''
  },

  //获取页面数据
  loadTable() {
    let requireData = {
      // supervisionId: this.data.userDao.getUser().supervisionsIdForSuperintendentId,
      enabled: true,
      page: this.data.page.number,
      size: this.data.page.size,
      state: 1,
      owner: this.data.owner
    }
    reviewedFindall.data = requireData
    // console.log(reviewedFindall)
    let that = this
    wx.cloud.callFunction({ 
      name: 'getReviewed', 
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
          console.log("ssssssssssssssssssssssssss")
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
    // 获取系统信息
    this.setData({
      viewHeight: app.globalData.viewHeight,
      viewWidth: app.globalData.viewWidth,
      requestBuilder: app.globalData.requestBuilder,
      userDao: app.globalData.userDao,
      router: app.globalData.router,
      owner: app.globalData.nickName
    })

    //获取数据
    this.resetPage()
    this.loadTable()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})