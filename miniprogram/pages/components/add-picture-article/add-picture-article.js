// miniprogram/pages/components/add-picture-article/add-picture-article.js
const app = getApp()
import { qinuiUpload, msgSecCheck, showToast, reqSubscribe } from '../../../utils/index'
import Toast from '/vant-weapp/toast/toast.js'
Page({
  data: {
    imageList: [],
    openid: '',
    title: '',
    article: '',
    PhotographyClass: [],
    picClass: null,
    navigationBar: '',
    pass: false,

    // drag组件end
    
    // 是否参加晒相活动
    isJoinDevelop: false,
    activity: {},
    address: null,
    // upload提示 
    uploading: 0,
    progress: 0,
    total: 0,
  },
  // 选择的图片
  getImageList(list) {
    this.setData({ imageList: list.detail })
  },
  async upload() { 
    const { imageList, picClass } = this.data
    const promiseAll = []
    const classObj = picClass ? picClass : { nameEn: 'other'}

    if(!imageList.length) {
      Toast('你还没有选择图片')
      return
    }
    // await uploadModal('提交的图片用于与作者交流，最终将由管理员处置')
    // 进度提示
    this.setData({
      uploading: 1,
      total: imageList.length,
    })
    qinuiUpload({
      path: imageList,
      photoClass: classObj.nameEn,
      progress: this.uploadProgress
    }).then(res => {
      this.cloudDbUpload({ photo: res, picClass: classObj })
    })
  },
  // 上传进度
  uploadProgress(progress) {
    console.log(progress)
    this.setData({
      progress,
    })
  },
  // 上传
  async cloudDbUpload({ photo, picClass }){
    
    const { title, article, isJoinDevelop, address } = this.data

    let result = await msgSecCheck(title + article)
    const { pass: textPass } = result
    const pass = false, msg = '';
    const db = wx.cloud.database()

    db.collection('photography-class').add({
      data: {
        createTime: db.serverDate(),
        photo,
        title,
        article,
        class: picClass.nameEn,
        activity: {
          isJoinDevelop,
          activity_id: isJoinDevelop ? this.data.activity._id : '',
          address
        },
        check: false,
        // 点赞 [点过的openid]
        start: [],
        // 收藏 
        collection: 0,
        // 分享
        share: 0,
        // 审核
        pass,
        // 评论
        // comment: [],
        // 文字是否能过
        textPass,
        subcrible: '',
        sendMessage: false,
      }
    }).then(res => {
      this.setData({
        uploading: 0
      })
      showToast(true, msg, this.afterUpload, res)
    })
  },
  afterUpload({ _id }) {
    wx.showModal({
      content: '图片上传成功，是否订阅审核提醒？',
      success: (res) => {
        if (res.confirm) {
          reqSubscribe(_id, 'photography-class')
        }
        this.initUser()
      }
    })
  },
  initUser() {
    try{
      const pages =  getCurrentPages()
      const userPage =  pages[pages.length - 2]
      if(userPage.init) userPage.init()
    }catch(err) {}
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.setData({
      PhotographyClass: app.globalData.PhotographyClass
    })
    this.getNowActivity()
  },
  // 获取当前进行的晒相活动
  getNowActivity() {
    const db = wx.cloud.database();
    const _ = db.command
    db.collection('activity').where({
      open: true,
      // actName: 'photoDevelop'
    }).get({
      success: res => {
        if(res.data.length){
          let a = res.data[0]
          this.setData({
            activity: res.data[0]
          })
        }
      }
    })
  },
  inputTitle(e) {
    this.data.title = e.detail.value
  },
  articleInput(e) {
    this.setData({
      article: e.detail.value
    })
  },
  classPicker(e) {
    this.setData({
      picClass: this.data.PhotographyClass[e.detail.value]
    })
  },
  // switch 
  handleJoin(e) {
    const { userInfo } = app.globalData
    if(e.detail.value && userInfo.address && userInfo.address.length) {
      console.log(userInfo.address[0])
      this.setData({ 
        address: userInfo.address[0]
      })
    }
    this.setData({
      isJoinDevelop: e.detail.value
    })
  },
})