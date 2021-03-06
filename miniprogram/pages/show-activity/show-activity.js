// miniprogram/pages/show-activity/show-activity.js
import { qinuiUpload, modalMsgCheck, showToast, sendEmail } from '../../utils/index'

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
  async upload() {
    const { options, imageList, title, article, isOpenShow, isHideUserInfo } = this.data
    if(!title && !article && !imageList.length){
      return
    }
    const { pass: textPass } = await modalMsgCheck(title + article)
    if (!textPass) return

    this.setData({
      uploading: 1,
      total: imageList.length,
    })

    const uploadRes = await qinuiUpload({
      path: imageList,
      photoClass: 'activity',
      progress: this.uploadProgerss
    })
    this.uploading = 0
    const db = wx.cloud.database()

    const res = await db.collection('activity-receive').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        createTime: db.serverDate(), // 务服器产生时间
        activity_id: options.activity_id, // 活动id
        data_id: options._id, // 作品id
        photo: uploadRes,
        title,
        article,
        show: isOpenShow,
        check: false,
        isHideUserInfo,
        pass: false,
        read: false
      }
    })
    sendEmail('activity-receive', res._id)
    showToast(true, '感谢你的支持，生活愉快！', () => {
      wx.switchTab({
        url: '/pages/user/user'
      })
    })
  },
  uploadProgerss(progress) {
    console.log(progress)
    this.setData({
      progress,
    })
  }
})