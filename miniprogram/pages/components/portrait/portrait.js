// miniprogram/pages/component/portrait/portrait.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',
    imageList: [],
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
    debugger
    this.setData({
      className: options['class-name']
    })
    this.getData()
  },

  getData(page = 1) {
    const { nowPage, totalPage, className = 'portrait' } = this.data
    if(nowPage === totalPage)return
    // 这是一个异步
    const heightArr = this.getHeighter()
    
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
      this.setData({
        imageList: imageList.concat(res.result.data)
      })
      return
      const [leftNum, rightNum] = heightArr
      const { result } = res
      const revResult = result.data
      // 如果返回的是奇数条，那么left.lenght比right.length多一条
      let left = revResult.filter((item, i) => i % 2 === 0)
      let right = revResult.filter((item,i) => i % 2 === 1)
      const { imagesLeft, imagesRight } = this.data
      if(leftNum && rightNum){
        if(leftNum >= rightNum){
          // 左边长
          [left, right] = [right, left]
        }
      }
      this.setData({
        nowPage: result.page,
        totalPage: result.totalPage,
        imagesLeft: imagesLeft.concat(left),
        imagesRight: imagesRight.concat(right)
      })
    })
  },
  // 点击查看图片
  toImageShowNav(e) {
    const { item, name } = e.detail
    app.globalData.imageShowData = item
    wx.navigateTo({
      url: `/pages/image-show/image-show?from=${name}`
    })
  },
  getHeighter() {
    const arr = []
    //创建节点选择器
    const query = wx.createSelectorQuery()
    query.select('#left').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      arr[0] = res[0].height
    })
    const query2 = wx.createSelectorQuery()
    query2.select('#right').boundingClientRect()
    query2.selectViewport().scrollOffset()
    query2.exec(res => {
      arr[1] = res[0].height
    })
    return arr
  },
  onPageScroll: function(e) {
    // 页面滚动时执行
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})