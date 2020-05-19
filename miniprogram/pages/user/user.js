// miniprogram/pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged:false,
    userInfo:{},
    userProfile: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/users/feigle/IMG_0987.JPG?sign=76b26af236b150caa9b1b4aa14aa74da&t=1572185422',
  },
  // 点击获取用户信息 
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //  从本地读取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          logged: true,
          avatarUrl: res.data.avatarUrl,
          userInfo: res.data
        })
      }
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