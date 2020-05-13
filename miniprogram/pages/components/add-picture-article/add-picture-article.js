/*
 * @Author: your name
 * @Date: 2020-05-12 22:41:30
 * @LastEditTime: 2020-05-13 22:52:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yingyinbiclound/miniprogram/pages/components/add-picture-article/add-picture-article.js
 */
// miniprogram/pages/components/add-picture-article/add-picture-article.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    arcicle: '',
    PhotographyClass: [],
    class: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('aa', app)
    this.setData({
      PhotographyClass: app.globalData.PhotographyClass
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.doWxChooseImage()
  },
  ChooseImage() {
   this.doWxChooseImage()
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  doWxChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  articleInput(e) {
    this.setData({
      arcicle: e.detail.value
    })
  },
  classPicker(e) {
    this.setData({
      class: this.data.PhotographyClass[e.detail.value]
    })
  }
})