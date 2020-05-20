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
    // wx.cloud.callFunction({
    //   name: 'get-class',
    //   data: {
    //     class: 'portrait'
    //   }
    // }).then(res => {
    //   console.log({res})
    //   const { result } = res
    //   const revResult = result.reverse()
    //   const left = result.filter((item, i) => i % 2 === 0)
    //   const right = result.filter((item,i) => i % 2 === 1)
    //   this.setData({
    //     imagesLeft: left,
    //     imagesRight: right
    //   })
    // })

    wx.cloud.callFunction({
      name: 'db',
      data: {
        collection: 'photographyClass',
        where: {
          _id: 'id_class_portrait',
          portrait: {
            fn: 'exists',
            params: true
          }
        }
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