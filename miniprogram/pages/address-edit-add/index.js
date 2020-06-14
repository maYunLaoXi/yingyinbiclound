// miniprogram/pages/address-edit-add/index.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
import { lbsKey as key } from '../../account/lbs.qq'
import Dialog from '/vant-weapp/dialog/dialog.js'

let qqmapsdk;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '请先择地区',
    address: {},
    name: '',
    userInfo: app.globalData.userInfo,
  },
  onLoad(optitons){
    const address = app.globalData.userInfo.address[0]
    this.setData({
      address,
      name: address.name,
      region: `${address.province} ${address.city} ${address.district}`
    })
    qqmapsdk = new QQMapWX({
      key,
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const value = e.detail.value
    this.setData({
      region: value.join(' '),
      address: {
        ...this.data.address,
        province: value[0],
        city: value[1],
        district: value[2]
      }
    })
  },
  getLocation(){
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        qqmapsdk.geocoder({
          address: res.address + res.name,
          success: res2 => {
            const { address_components, title } = res2.result
            const { province, city, district } = address_components;
            this.setData({
              region: province + ' ' + city + ' ' + district,
              address: {
                ...this.data.address,
                province,
                city,
                district,
                detail: title
              }

            })
          },
          fail: err => {
          }
        })
      }
    })
  },
  inputName(e){
    this.setData({
      name: e.detail.value
    })
  },
  inputDetail(e) {
    const address = this.data.address
    address.detail = e.detail.value
    this.setData({
      address,
    })
  },
  inputPhone(e) {
    const { type } = e.currentTarget.dataset
    const address = this.data.address
    address[type] = e.detail.value
    this.setData({
      address
    })
  },
  inputMailCode(e) {
    const address = this.data.address
    address.mailCode = e.detail.value
    this.setData({
      address
    })
  },
  upload(){
    const { address, name } = this.data;
    address.name = name
    const all = ['province', 'city', 'district', 'detail', 'name', 'mailCode']
    let flag = false
    all.forEach(item => {
      console.log('item-' +item)
      if(!address[item] || !name){
        flag = true
        console.log(item)
        return
      }
    })
    if(flag){
      Dialog.alert({
        message: '检测到你还有必填项没有填哦',
      }).then(() => {
        // on close
      })
      return
    }
    wx.cloud.callFunction({
      name: 'user',
      data: {
        info: {
          address: [{ ...address, name}]
        }
      }
    }).then(res => {
      debugger
      app.globalData.userInfo = res.result
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({
        address: res.result.address[0],
      })
      wx.navigateBack()
    })
  }
})