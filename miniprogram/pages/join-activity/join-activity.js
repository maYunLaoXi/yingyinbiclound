// miniprogram/pages/join-activity.js
const app = getApp()
import { uploadToCloud, qinuiUpload } from '../../utils/index'
import Toast from '/vant-weapp/toast/toast.js'
Page({
  data: {
    activeNames: [],
    address: null,
    imgList: [],
    title: '',
    article: '',
    isShow: false,
  },
  onLoad(){
    const { address } = app.globalData.userInfo

    this.setData({
      address: address[0],
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  inputTitle(e){
    this.data.title = e.detail.value
  },
  articleInput(e){
    this.setData({
      article: e.detail.value
    })
  },
  handleShow(e) {
    this.setData({
      isShow: e.detail.value
    })
  },
  getImageList(e){
    console.log(e.detail)
    this.setData({ imgList: e.detail })
  },
  addressEdit(){
    wx.navigateTo({
      url: '/pages/address-edit-add/index?redirect=join-activity'
    })
  },
  upload(){
    const { imgList, address, title, article, isShow } = this.data
    const { name, actName, version, _id } = app.globalData.activity
    
    if(!imgList.length){
      wx.showModal({
        content: '检测到你还没有选择图片哦',
        showCancel: false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if(!address){
      wx.showModal({
        content: '检测到你还没有完善地址呢',
        showCancel: false,
      })
      return
    }
    this.showToast()
    qinuiUpload({
      path: imgList,
      photoClass: 'activity' + actName,
    }).then(res => {
      debugger
      wx.cloud.callFunction({
        name: 'activity-join',
        data: {
          name,
          actName,
          version,
          show: isShow,
          photo: res,
          address,
          title,
          article,
          activity_id: _id,
          check: true,
        }
      }).then(res => {
        debugger
        Toast.clear()
        wx.showModal({
          content: '图片已快马送达作者手中，请留意接下来的小程序和公众号消息',
          showCancel: false,
          success (res) {
            wx.navigateBack()
          }
        })
      })
    })

    // 如果没有私有云可使用些方法存在云存储
    // uploadToCloud(imgList, 'activity/' + actName).then(res => {
    
    // }).catch(err => {
    //   wx.showModal({
    //     content: '发生了点意外，请稍后重试',
    //     showCancel: false,
    //   })
    // })
  },

  // 上传提示
  showToast() {
    Toast.loading({
      mask: true,
      message: '上传中...',
      duration: 0,
      onClose: _ => {
        Toast.success({
          message: '添加成功',
          duration: 0,
        });
      }
    });
  }
})