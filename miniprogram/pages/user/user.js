// miniprogram/pages/user/user.js
import { matchQiniuUrl, imageView } from '../../utils/index'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logged:false,
    // 是否为已有用户
    isUser: false,
    userInfo:{},
    userProfile: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/users/feigle/IMG_0987.JPG?sign=76b26af236b150caa9b1b4aa14aa74da&t=1572185422',
    images: [],
    imageList: [],
    activityList: [],
    contentHeight: 'auto'
  },
  // 点击获取用户信息 
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      // 获取openid一起存在数据库
      wx.cloud.callFunction({
        name: 'user',
        data: {
          info: e.detail.userInfo
        }
      }).then(res => {
        console.log(res)
        debugger
        app.globalData.userInfo = res.result
        if(app.globalData.router.redirect === 'activity'){
          wx.switchTab({
            url: '/pages/activity/activity',
          })
        }
      })
    }
  },
  // 获取数据库的用户信息
  getDbUserInfo(userInfo){
    wx.cloud.callFunction({
      name: 'user',
      data: {
        userInfo,
        getInfo: true
      }
    }).then(res => {
      const { data } = res.result;
      app.globalData.userInfo = data.length
      ? data[0]
      : userInfo
      console.log({globalData: app.globalData})
    }).catch(err => {
      app.globalData.userInfo = userInfo
    })
  },
  /**
   *  发表文章
   * @param {*} options 
   */
  toAddPicArticle() {
    wx.navigateTo({
      url: '/pages/components/add-picture-article/add-picture-article'
    })
  },
  toImageShow(e) {
    const { id, show = -1, hideShowBtn = false} = e.currentTarget.dataset
    
    app.globalData.imgShowUser = app.globalData.userInfo
    wx.navigateTo({
      url: `/pages/image-show/image-show?id=${id}&show=${show}&hideShowBtn=${hideShowBtn}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        logged: true,
        isUser:true,
      })
      this.getImageList()
      this.getActivityList()
      return
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                logged: true,
                isUser: true,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              this.getDbUserInfo(res.userInfo)
            }
          })
        } else {
          
        }
      },
      fail: err => {
        debugger
      }
    })
    this.getImageList()
    this.getActivityList()
  },
  /**
   * 获取用户上传的作品
   */
  getImageList({page = 1, pageSize = 20} = {}){
    wx.cloud.callFunction({
      name: 'get-user-image',
      data: {
        page,
        pageSize
      }
    }).then(res => {
      const { imageList } = this.data
      this.setData({
        imageList: imageList.concat(res.result.data)
      })
    })
  },
  getActivityList({ page = 1, pageSize = 20 } = {}) {
    wx.cloud.callFunction({
      name: 'activity-user-get',
      data: {
      }
    }).then(res => {
      console.log('activity-user-get', res)
      this.setData({
        activityList: res.result.data
      })
    })
  },
  moving(e) {
    // console.log(e.detail.y)

    if(e.detail.y <= 0) {
      const { systemInfo } = app.globalData

      this.setData({
        contentHeight: systemInfo.windowHeight - 43  + 'px'
      })
    }
    if(e.detail.y > 0) {
      this.setData({
        contentHeight: 'auto'
      })
    }
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
    console.log('aaaa')
           
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

  }
})