let targetFindall = require('../../../request/target/findall.js')
let targetListInteractive = require('../../../interactive/targetTargetListInteractive.js')
// pages/target/target.js
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
            size: 5,
            imageurl1: "../../../static/images/sort.png",
            daindex1: 0,
            imageurl2: "../../../static/images/sort.png",
            daindex2: 0,
            imageurl0: "../../../static/images/sort.png",
            isFold:true
        },
        targetEnabled: true,
        targets: [],
        hasMore: false,
        requestBuilder: {},
        userDao: {},
        router: {},
        states: [{
            key:1,
            value:'进行中'
        },{
            key:2,
            value:'审核中'
        },{
            key:3,
            value:'已完成'
        },{
            key:-1,
            value:'未完成'
        },{
            key:null,
            value:'全部'
        }],
        statesIndex:0,
        owner: ''
    },

    //状态改变
    handleStatesChange(event){
        this.setData({
            isFold: false           
        })

        let newState = this.data.states[event.detail.value];
        this.setData({
            isFold: true,
            statesIndex:event.detail.value
            
        })
        this.resetPage()
        this.loadTable()

    },

    //跳转到任务详情
    handleTapTargetDetail(event){
        console.log('跳转到任务详情')
        let target = event.currentTarget.dataset.target;
        this.data.router.toTapTargetTargetDetail([{key: "target", value: JSON.stringify(target)}])
    },
    //上拉刷新
    onPullDownRefresh() {
        console.log('上拉刷新')
        this.resetPage()
        this.loadTable()
        wx.stopPullDownRefresh()
    },
    //下拉触底
    onReachBottom() {
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
    //点击完成按钮
    handleTapComplete(event) {
        let target = event.currentTarget.dataset.target;
        this.data.router.toTapTargetTargetComplete([{key: "target", value: JSON.stringify(target)}])
    },
    //获取页面数据
    loadTable() {
        let app = getApp()
        let that = this

        let requireData = {
            // supervisionId: this.data.userDao.getUser().supervisionsIdForUserId,
            enabled: this.data.targetEnabled,
            page: this.data.page.number,
            size: this.data.page.size,
            sort:"deadline,asc",
            state: this.data.states[this.data.statesIndex].key==null?'':this.data.states[this.data.statesIndex].key,
            owner: this.data.owner
        }
        console.log(requireData)
        targetFindall.data = requireData

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

        console.log(that.data.targets)
        console.log("ttttttttttttttttttttttt")
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

        //显示文字内容
        wx.showToast({
            title: '脚踏实地，积极进取',
            icon: 'none',
            duration: 2000
        })
        let that = this
        let app = getApp()
        // console.log("app.globalData.nickName")
        // console.log(app.globalData.nickName)
        // wx.getStorage({
        //     key: 'nickName',
        //     success (res) {
        //         console.log("---------------" + res.data)
        //         that.setData({
        //             owner: res.data
        //         })
        //     }
        //   })
        // 获取系统信息
        this.setData({
            viewHeight: app.globalData.viewHeight,
            viewWidth: app.globalData.viewWidth,
            requestBuilder: app.globalData.requestBuilder,
            userDao: app.globalData.userDao,
            router: app.globalData.router
            
        })
        //获取数据
        this.resetPage()
        this.loadTable()
    },
    onShow() {
        let app = getApp()

        this.setData({
            owner: app.globalData.nickName
        })
        console.log(this.data.owner + "=================")
                //获取数据
        // this.resetPage()
        this.loadTable()
        if (targetListInteractive.isReload()) {//判断是否整个页面刷新
            //获取数据
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
            this.resetPage()
            this.loadTable()
            targetListInteractive.resetReload()
            
        } else {//判断是否局部刷新
            if (targetListInteractive.isPartRefresh()) {
                let newTargets = targetListInteractive.resetPartRefresh()
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
    },
    choosesort1: function (e) {
        if (this.data.daindex1 == 0) {
          this.setData({
            imageurl1: "../../../static/images/sort.png",
            daindex1: 1
          })
        } else {
          this.setData({
            imageurl1: "../../../static/images/sortx.png",
            daindex1: 0
          })
        }
    
      },
      choosesort2: function (e) {
        if (this.data.daindex2 == 0) {
          this.setData({
            imageurl2: "../../../static/images/sorts.png",
            daindex2: 1
          })
        } else {
          this.setData({
            imageurl2: "../../../static/images/sortx.png",
            daindex2: 0
          })
        }
    
      }

})