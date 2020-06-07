// miniprogram/pages/address-edit-add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '请先择地区'
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      address: e.detail.value.join(' ')
    })
  },
  getLocation(){
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        const reg = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g
        console.log(reg.exec(res.address))
      }
    })
  }
})