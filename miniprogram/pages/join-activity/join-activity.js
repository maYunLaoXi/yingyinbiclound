// miniprogram/pages/join-activity.js
const app = getApp()
import { qinuiUpload, modalMsgCheck, reqSubscribe, sendEmail } from '../../utils/index'
import Toast from '/vant-weapp/toast/toast.js'
Page({
  data: {
    activeNames: [],
    address: null,
    imgList: [],
    title: '',
    article: '',
    isShow: false,
    // upload提示 
    uploading: 0,
    progress: 0,
    total: 0,
    subcribeTemplate: '251QI5xt5KCVLN9OrxMaEcKFTsy5cH1kyyQ_IKxvfKs'
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
  async upload(){
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
    // await uploadModal()

    const db = wx.cloud.database()

    let pass = false
    const { pass: textPass } = await modalMsgCheck(title + article)
    if (!textPass) return
    this.setData({
      uploading: 1,
      total: imgList.length
    })
    const uploadedList = await qinuiUpload({
      path: imgList,
      photoClass: 'activity' + actName,
      progress: this.uploadProgerss
    })

    const { _id: dataId } = await db.collection('activity-data').add({
      data: {
        createTime: db.serverDate(),
        name,
        actName,
        version,
        show: isShow,
        photo: uploadedList,
        address,
        title,
        article,
        activity_id: _id,
        check: false,
        pass,
        start: [],
        subcrible: '',
        sendMessage: false,
      }
    })
    let tips = '图片上传成功，是否订阅审核提醒？'
    
    sendEmail('activity-data', _id)
    wx.showModal({
      content: tips,
      success: async (res) => {
        if (res.confirm) {
          await reqSubscribe(dataId, 'activity-data')
        }
        wx.navigateBack()
      }
    })

    // 如果没有私有云可使用此方法存在云存储
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
  },
  // 七牛上传进度
  uploadProgerss(progress) {
    console.log(progress)
    this.setData({
      progress,
    })
  }
})