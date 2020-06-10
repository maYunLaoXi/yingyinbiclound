// miniprogram/pages/home/home.js
const app = getApp()
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    topImg: '',
    activityTitle: '晒相4.0',
    endDay: 0,
    authProfile: '',
    authName: '影音笔',
    descriptionShort: '',
    tempFilePaths:[],
    drawerImg1: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/activities/%E6%99%92%E7%9B%B84.0/IMG_0206mohu.jpg?sign=b779ad36004423e6b615052ecfc90b28&t=1572144936',
    TabCur: 0,
  },

  //立即参加 
  joinActivity: function () {
    const { userInfo } = app.globalData
    debugger
    if(userInfo){
      let modal = '你还没有登录,点确定去登吧'
      app.globalData.router.redirect = 'activity'
      wx.switchTab({
        url: '/pages/user/user?redirect=activity',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/join-activity/join-activity?redirect=activity'
    })
    return
    // 选择图片
    wx.chooseImage({
      count: 9,//最多可选的张数是9
      sizeType: ['original'],//不压缩图片
      sourceType: ['album'],
      success: (res) => {

        wx.showLoading({
          title: '上传中',
        })

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.router.redirect === 'activity')app.globalData.router.redirect = ''
    // 数据请求
    const db = wx.cloud.database();
    db.collection('activity-data').doc("activity-data-develop4.0").get({
      success: (res) => {
        console.log('activity-data', res);
        const {
          activityTitle,
          authName,
          authProfile,
          endDay,
          topImg,
          descriptionShort,
        } = res.data;

        this.setData({
          authName,
          authProfile,
          endDay,
          topImg,
          activityTitle,
          descriptionShort,
        })
      },
      error: function (err) {
        console.log('err', err)
      }
    })

  },

// colorui
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  longTapScan(e){
    var current = e.target.dataset.src;
    console.log(e.target)
    wx.previewImage({
      current: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/%E5%BD%B1%E9%9F%B3%E7%AC%94%E7%9B%B8%E5%85%B3/%E5%BD%B1%E9%9F%B3%E7%AC%94-qrcodd.jpg?sign=8bbb26ad4ec95904fb0c2f3c5708fc86&t=1570374091',
      urls: ['https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/%E5%BD%B1%E9%9F%B3%E7%AC%94%E7%9B%B8%E5%85%B3/%E5%BD%B1%E9%9F%B3%E7%AC%94-qrcodd.jpg?sign=8bbb26ad4ec95904fb0c2f3c5708fc86&t=1570374091']
    })
  },

  tabSelect(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      TabCur: id
    })
  }
})