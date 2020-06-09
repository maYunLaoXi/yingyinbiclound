// miniprogram/pages/join-activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getImageList(e){
    console.log(e.detail)
  },
  selAddress(){
    wx.navigateTo({
      url: '/pages/select-address/index?redirect=join-activity'
    })
  }
})