// miniprogram/pages/components/img-article/img-article.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singleUrl: '',
    imgUrlArr: [],
    title: '',
    article: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    // eventChannel.emit('someEvent', {data: 'test'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage',(data) => {
      const { fileID: imgUrl, title, article, userInfo } = data
      this.setData({
        title,
        article,
        userInfo
      })
      if(imgUrl.length === 0){
        this.setData({ singleUrl: imgUrl[0]})
        return
      } else {
        const arr = []
        for(let i = 0; i <= imgUrl.length; i += 2) {
          imgUrl[i] && arr.push(imgUrl.slice(i, i + 2))
        }
        this.setData({ imgUrlArr: arr })
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