// miniprogram/pages/image-show/image-show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    userInfo: {},
    hideShowBtn: true,
    start: null,
    hasStart: false,
    collection: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, collection, hideShowBtn, from = '' } = options
    if(!collection) return
    this.setData({ collection })
    let btn = hideShowBtn !== 'undefined'
    if(from === 'activity-data') {
      // 来自活动页的waterfall
      this.setViewFromData(app.globalData.imageShowData)
    }else if(from === 'activity-receive') {
      // 来自活动页的waterfall
      this.setViewFromData(app.globalData.imageShowData)
      return
    }else if( from === 'photography-class') {
      this.setViewFromClass(from)
    }else {
      if(id && collection) this.getImages(id, collection)
      const { imgShowUser } = app.globalData
      this.setData({
        userInfo: imgShowUser,
        hideShowBtn: btn,
        options,
      })
    }
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
      this.viewStart(data)
      this.setData({
        data: data
      })
    })
  },
  setViewFromData(data, hideShowBtn = true) {   
    this.viewStart(data)
    this.setData({
      data: data,
      userInfo: data.userInfo,
      hideShowBtn,
      options: {
        activity_id: data.activity_id,
      }
    })
  },
  setViewFromClass() {
    const { imageShowData } = app.globalData
    this.viewStart(imageShowData)
    this.setData({
      data: imageShowData,
      userInfo: imageShowData.userInfo
    })
  },
  // 设定画数展示数据
  setView(){

  },
  goShowActivity(){
    console.log(this.data)
    const { title, article, photo, _id } = this.data.data
    const { activity_id = ''} = this.data.options
    wx.navigateTo({
      url: `/pages/show-activity/show-activity?_id=${_id}&title=${title}&article=${article}&url=${photo[0].url}&activity_id=${activity_id}`,
    })
  },
  viewStart(data) {
    const { start } = data
    if(!start)return
    try{
      const { _openid } = app.globalData.userInfo
      const hasStart = start.includes(_openid)
      this.setData({
        start,
        hasStart
      })
    }catch(err) {}
  },
  async tabStart(e) {
    const { collection, data, start = [] } = this.data
    const { _id } = data 
    if(!collection || !_id) return

    const res = await wx.cloud.callFunction({
      name: 'start',
      data: {
        _id,
        collection,
        start,
      }
    })
    const { stats, start: resStart } = res.result

    if(stats.updated === 1) {
      this.viewStart({ start: resStart})
    }

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
})