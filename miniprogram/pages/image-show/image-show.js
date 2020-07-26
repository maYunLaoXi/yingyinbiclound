// miniprogram/pages/image-show/image-show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    if(id) this.getImages(id)
    const { imgShowUser } = app.globalData
    this.setData({
      userInfo: imgShowUser
    })
  },
  /**
   * 获取图片数据
   */
  getImages(_id) {
    wx.cloud.callFunction({
      name: 'db-collection-id-get',
      data: {
        collection: 'activity-data',
        _id
      }
    }).then(res => {
      this.setData({
        data: res.result.data
      })
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