// miniprogram/pages/show-activity/show-activity.js
import { qinuiUpload } from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    imageList: [],
    article: '',
    title: '',
    isOpenShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options,
    })

  },
  back() {
    wx.navigateBack()
  },
  getImageList(list) {
    this.setData({ imageList: list.detail })
  },
  inputTitle(e) {
    this.data.title = e.detail.value
  },
  articleInput(e) {
    this.setData({
      article: e.detail.value
    })
  },
  // switch 
  ifOpenShow(e) {
    this.setData({
      isOpenShow: e.detail.value
    })
  },
  upload() {
    const { options, imageList, title, article, isOpenShow } = this.data
    qinuiUpload({
      path: imageList,
      photoClass: 'activity'
    }).then(res => {
      console.log(res)
      res.forEach(item => {
        delete item.dragId
      })
      wx.cloud.callFunction({
        name: 'activity-update', 
        data: {
          _id: options._id,
          data: {
            showReceive: [{ photo: res, title, article, show: isOpenShow }]
          },
          method: 'unshift'
        }
      }).then(res => {
        debugger
      }).catch(err => {
        debugger
      })
    })
  }
})