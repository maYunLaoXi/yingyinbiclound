// miniprogram/pages/user/user.js
import { matchQiniuUrl, imageView, qinuiUpload } from '../../utils/index'
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
    // userProfile: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/users/feigle/IMG_0987.JPG?sign=76b26af236b150caa9b1b4aa14aa74da&t=1572185422',
    userProfile: 'http://img.yingyinbi.com/_DSC6367q-min-slice.jpg?imageView2/2/w/800',
    images: [],
    // 用户作品
    imageList: [],
    imageListPage: 0,
    imageListTotalSize: 0,
    imageListTotalPage: 0,
    // 用户活动作品
    activityList: [],
    activityListTotalSize: 0,
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
        info: userInfo,
      }
    }).then(res => {
      debugger
      app.globalData.userInfo = res.result
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
    const { id, show, hideShowBtn, activityId = '', item } = e.currentTarget.dataset
    let collection = show ? 'activity-receive' : 'activity-data'
    // 此图片来自photography-class
    if(item && item.fromPhotoClass) collection = 'photography-class'
    
    app.globalData.imgShowUser = app.globalData.userInfo
    wx.navigateTo({
      url: `/pages/image-show/image-show?id=${id}&collection=${collection}&hideShowBtn=${hideShowBtn}&activity_id=${activityId}`,
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
              this.getImageList()
              this.getActivityList()
            }
          })
        }
      },
      fail: err => {
        debugger
      }
    })
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
      const { imageList, imageListPage } = this.data
      const { data, page, pageSize, totalPage, totalSize } = res.result
      if(imageListPage === page) return
      this.setData({
        imageListPage: page,
        imageListTotalSize: totalSize,
        imageListTotalPage: totalPage,
        imageList: imageList.concat(data)
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
        activityList: res.result.data,
        activityListTotalSize: res.result.data[0].list.length
      })
    })
  },
  toUserEdit(){
    wx.navigateTo({
      url: '/pages/user-info/user-info',
    })
  },
  // 点击用户作品
  clickUserImage(e){
    const item = e.detail
    this.toImageShow({
      currentTarget: {
        dataset: {
          id: item._id,
          hideShowBtn: true,
          item: { fromPhotoClass: true }
        }
      }
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
  imageListBottom(e) {
    const { imageListTotalPage, imageListPage } = this.data
    if(imageListPage === imageListTotalPage)return;
    this.getImageList({page: imageListPage + 1})
    debugger
  }
})