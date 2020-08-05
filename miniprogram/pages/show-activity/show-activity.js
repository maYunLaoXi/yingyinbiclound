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
    isOpenShow: false,
    isHideUserInfo: false,
    // upload提示 
    uploading: 0,
    progress: 0,
    total: 0,
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
    const name = e.currentTarget.dataset.isHideUserInfo ? 'isHideUserInfo' : 'isOpenShow'
    this.setData({
      [name]: e.detail.value
    })
  },
  upload() {
    const { options, imageList, title, article, isOpenShow, isHideUserInfo } = this.data
    if(!title && !article && !imageList.length){
      return
    }
    this.setData({
      uploading: 1,
      total: imageList.length,
    })
    qinuiUpload({
      path: imageList,
      photoClass: 'activity',
      progress: this.uploadProgerss
    }).then(res => {
      console.log(res)
      this.uploading = 0
      const db = wx.cloud.database()

      res.forEach(item => {
        delete item.dragId
      })
      db.collection('activity-receive').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          createTime: db.serverDate(), // 务服器产生时间
          activity_id: options.activity_id, // 活动id
          data_id: options._id, // 作品id
          photo: res,
          title,
          article,
          show:isOpenShow,
          isHideUserInfo,
        }
      })
      .then(res => {
        console.log(res)
        wx.switchTab({
          url: '/pages/user/user'
        })
      })
      .catch(console.error)
    })
  },
  uploadProgerss(progress) {
    console.log(progress)
    this.setData({
      progress,
    })
  }
})