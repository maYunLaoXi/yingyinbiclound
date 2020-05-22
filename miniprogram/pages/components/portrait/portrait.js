// miniprogram/pages/component/portrait/portrait.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBox: [
      {
        position: 'left',
      },
      {
        position: 'right',
      },
    ],
    imagesLeft: [],
    imagesRight: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'page-list',
      data: {
        collection: 'photographyClass',
        className: 'portrait',
        page: 1,
        pageSize: 10
      }
    }).then(res => {
      debugger
      const { result } = res
      const revResult = result.data.reverse()
      const left = revResult.filter((item, i) => i % 2 === 0)
      const right = revResult.filter((item,i) => i % 2 === 1)
      this.setData({
        imagesLeft: left,
        imagesRight: right
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