// miniprogram/pages/address-edit-add/index.js
import { lbsKey as key } from '../../account/lbs.qq'
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '请先择地区',
    address: {},
    name: ''
  },
  onLoad(){
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
            console.log(address_components, title)
            const { province, city, district } = address_components;
            this.setData({
              region: province + ' ' + city + ' ' + district,
              address: {
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
  inputMailCode(e) {
    const address = this.data.address
    address.mailCode = e.detail.value
    this.setData({
      address
    })
  },
  upload(){
    const { address, name } = this.data;
    const all = ['province', 'city', 'district', 'detail', 'name', 'mailCode']
    let flag = false
    for(let [key,value ] of Object.entries(address)){
      if(!all.includes(key) || !value){
        debugger
      }
    }
    wx.cloud.callFunction({
      name: 'user',
      data: {
        add: {
          address: [{ ...address, name}]
        }
      }
    }).then(res => {
      debugger
    })
  }
})