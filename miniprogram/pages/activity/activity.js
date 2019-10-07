// miniprogram/pages/home/home.js
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
    tempFilePaths:[]
  },

  //图片上传
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 9,//最多可选的张数是9
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {

        wx.showLoading({
          title: '上传中',
        })

        //更改数据并绑定到视图
        this.setData({
          tempFilePaths:res.tempFilePaths
        })
        const filePath = res.tempFilePaths;
        console.log(this.data.tempFilePaths)

        // 上传图片
        // const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        // wx.cloud.uploadFile({
        //   cloudPath,
        //   filePath,
        //   success: res => {
        //     console.log('[上传文件] 成功：', res)

        //     app.globalData.fileID = res.fileID
        //     app.globalData.cloudPath = cloudPath
        //     app.globalData.imagePath = filePath

        //     wx.navigateTo({
        //       url: '../storageConsole/storageConsole'
        //     })
        //   },
        //   fail: e => {
        //     console.error('[上传文件] 失败：', e)
        //     wx.showToast({
        //       icon: 'none',
        //       title: '上传失败',
        //     })
        //   },
        //   complete: () => {
        //     wx.hideLoading()
        //   }
        // })

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