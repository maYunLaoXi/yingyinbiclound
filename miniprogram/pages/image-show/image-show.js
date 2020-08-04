// miniprogram/pages/image-show/image-show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    userInfo: {},
    hideShowBtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, show, hideShowBtn } = options
    let btn = hideShowBtn !== 'false'
    debugger
    if(id) this.getImages(id, Number(show))
    const { imgShowUser } = app.globalData
    this.setData({
      userInfo: imgShowUser,
      hideShowBtn: btn
    })
  },
  /**
   * 获取图片数据
   */
  getImages(_id, show) {
    wx.cloud.callFunction({
      name: 'db-collection-id-get',
      data: {
        collection: 'activity-data',
        _id
      }
    }).then(res => {
      let data = res.result.data
      if(show !== -1){
        data = res.result.data.showData[show]
      }
      this.setData({
        data: data
      })
    })
  },
  goShowActivity(){
    console.log(this.data)
    const { title, article, photo, _id } = this.data.data
    wx.navigateTo({
      url: `/pages/show-activity/show-activity?_id=${_id}&title=${title}&article=${article}&url=${photo[0].url}`,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
})