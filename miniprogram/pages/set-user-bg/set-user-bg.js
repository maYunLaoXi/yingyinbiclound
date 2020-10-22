import { qinuiUpload } from '../../utils/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationTitle: '设置代表作',
    url: '',
    // 上传
    progress: 0,
    uploading: 0,
    progress: 0,
    total: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { url } =  options
    this.setData({ url})
  },
  async upload() {
    const { url } = this.data
    if(!url) return
    this.setData({
      uploading: 1
    })
    const res = await qinuiUpload({ path: url, progress: this.uploadProgress  })
    const dbUserInfo = await wx.cloud.callFunction({
      name: 'user',
      data: {
        info: {
          profile: res[0].url
        }
      }
    })
    app.globalData.userInfo = dbUserInfo.result
    wx.navigateBack({
      delta: 1,
    })
  },
   // 上传进度
   uploadProgress(progress) {
    console.log(progress)
    this.setData({
      progress,
    })
  },

})