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
    const { id, collection, hideShowBtn } = options
    let btn = hideShowBtn !== 'undefined'

    if(id && collection) this.getImages(id, collection)
    const { imgShowUser } = app.globalData
    this.setData({
      userInfo: imgShowUser,
      hideShowBtn: btn,
      options,
    })
  },
  /**
   * 获取图片数据
   */
  getImages(_id, collection) {
    wx.cloud.callFunction({
      name: 'db-collection-id-get',
      data: {
        collection,
        _id
      }
    }).then(res => {
      let data = res.result.data
      this.setData({
        data: data
      })
    })
  },
  goShowActivity(){
    console.log(this.data)
    const { title, article, photo, _id } = this.data.data
    const { activity_id = ''} = this.data.options
    wx.navigateTo({
      url: `/pages/show-activity/show-activity?_id=${_id}&title=${title}&article=${article}&url=${photo[0].url}&activity_id=${activity_id}`,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
})