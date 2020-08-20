// miniprogram/pages/component/portrait/portrait.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',
    imageList: [],
    nowPage: NaN,
    totalPage: NaN,
    dot: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      className: options['class-name']
    })
    this.getData()
  },

  getData(page = 1) {
    const { nowPage, totalPage, className = 'portrait' } = this.data
    if(nowPage === totalPage)return
    this.setData({ dot: true })
    
    wx.cloud.callFunction({
      name: 'page-list',
      data: {
        collection: 'photography-class',
        className,
        page: page,
        pageSize: 9
      }
    }).then(res => {
      const { imageList } = this.data
      const { data, page, totalPage } = res.result
      this.setData({
        imageList: imageList.concat(data),
        nowPage: page,
        totalPage,
        dot: false
      })
    })
  },
  // 刷新重置
  init(){
    this.setData({
      imageList: [],
      nowPage: NaN,
      totalPage: NaN,
      dot: false,
    })
    this.getData(1)
  },
  // 点击查看图片
  toImageShowNav(e) {
    const { item, name } = e.detail
    app.globalData.imageShowData = item
    wx.navigateTo({
      url: `/pages/image-show/image-show?from=${name}&collection=${name}`
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(this.data.nowPage + 1)
  },
  showImage(e) {
    const { itemObj } = e.currentTarget.dataset
    wx.navigateTo({
      url: "../img-article/img-article?redirect=portrait",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        // acceptDataFromOpenedPage: function(data) {
        //   console.log(data)
        // },
        // someEvent: function(data) {
        //   console.log(data)
        // }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { ...itemObj })
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
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})