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
    nowPage: NaN,
    totalPage: NaN,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  getData(page = 1) {
    const { nowPage, totalPage } = this.data
    if(nowPage === totalPage)return

    wx.cloud.callFunction({
      name: 'page-list',
      data: {
        collection: 'photographyClass',
        className: 'portrait',
        page: page,
        pageSize: 10
      }
    }).then(res => {
      const { result } = res
      console.log({result})
      const revResult = result.data
      const left = revResult.filter((item, i) => i % 2 === 0)
      const right = revResult.filter((item,i) => i % 2 === 1)
      const { imagesLeft, imagesRight } = this.data
  
      this.setData({
        nowPage: result.page,
        totalPage: result.totalPage,
        imagesLeft: imagesLeft.concat(left),
        imagesRight: imagesRight.concat(right)
      })
    })
  },

  getHeighter() {
    const query = wx.createSelectorQuery();
  },
  onPageScroll: function(e) {
    console.log(e.scrollTop)
    // 页面滚动时执行
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(this.data.nowPage + 1)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})