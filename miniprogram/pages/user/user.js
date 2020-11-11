// miniprogram/pages/user/user.js
import { matchQiniuUrl, imageView, qinuiUpload } from '../../utils/index'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logged:false,
    // 是否为已有用户
    isUser: false,
    userInfo:{},
    // userProfile: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/users/feigle/IMG_0987.JPG?sign=76b26af236b150caa9b1b4aa14aa74da&t=1572185422',
    userProfile: 'http://img.yingyinbi.com/_DSC6367q-min-slice.jpg?imageView2/2/w/800',
    images: [],
    // 用户作品
    imageList: [],
    imageListPage: 0,
    imageListTotalSize: 0,
    imageListTotalPage: 0,
    // 用户活动作品
    activityList: [],
    activityListTotalSize: 0,
    contentHeight: 'auto'
  },
  // 点击获取用户信息 
  onGetUserInfo: async function (e) {
    if (e.detail.userInfo) {
      const res = await this.getDbUserInfo(e.detail.userInfo)
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: res.result
      })
      app.globalData.userInfo = res.result
      this.getImageList()
      this.getActivityList()
      if(app.globalData.router.redirect === 'activity'){
        wx.switchTab({
          url: '/pages/activity/activity',
        })
      }
    }
  },
  // 更新并获取数据库的用户信息
  getDbUserInfo(userInfo){
    return wx.cloud.callFunction({
      name: 'user',
      data: {
        info: userInfo,
      }
    })
  },
  /**
   *  发表文章
   * @param {*} options 
   */
  toAddPicArticle() {
    wx.navigateTo({
      url: '/pages/components/add-picture-article/add-picture-article'
    })
  },
  toImageShow(e) {
    const { id, show, hideShowBtn, activityId = '', item } = e.currentTarget.dataset
    let collection = show ? 'activity-receive' : 'activity-data'
    // 此图片来自photography-class
    if(item && item.fromPhotoClass) collection = 'photography-class'
    
    app.globalData.imgShowUser = app.globalData.userInfo
    wx.navigateTo({
      url: `/pages/image-show/image-show?id=${id}&collection=${collection}&hideShowBtn=${hideShowBtn}&activity_id=${activityId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        logged: true,
        isUser:true,
      })
      this.getImageList()
      this.getActivityList()
    }
  },
  init(){
    this.clearDate()
    this.getImageList()
    this.getActivityList()
  },
  clearDate() {
    this.setData({
      imageList: [],
      imageListPage: 0,
      imageListTotalSize: 0,
      imageListTotalPage: 0,
      activityList: [],
      activityListTotalSize: 0,
      contentHeight: 'auto'
    })
  },
  /**
   * 获取用户上传的作品
   */
  getImageList({page = 1, pageSize = 20} = {}){
    wx.cloud.callFunction({
      name: 'get-user-image',
      data: {
        page,
        pageSize
      }
    }).then(res => {
      console.log(res)
      const { imageList, imageListPage } = this.data
      const { data, page, pageSize, totalPage, totalSize } = res.result
      if(imageListPage === page) return
      this.setData({
        imageListPage: page,
        imageListTotalSize: totalSize,
        imageListTotalPage: totalPage,
        imageList: imageList.concat(data)
      })
    })
  },
  getActivityList({ page = 1, pageSize = 20 } = {}) {
    wx.cloud.callFunction({
      name: 'activity-user-get',
      data: {
      }
    }).then(res => {
      const { data } = res.result
      data.forEach(item => {
        this.checkIfChecked(item.list)
      })
      this.setData({
        activityList: data,
        activityListTotalSize: data[0].list.length
      })
    })
  },
  // 图片是否已查验
  checkIfChecked(list) {
    if(!list || !Array.isArray(list)) return
    list.forEach(item => {
      if(!item.check){
        let photo = item.photo
        if(!Array.isArray(photo)) photo = [photo]
        this.setTipImg(photo)
      }
    })
  },
  setTipImg(list) {
    const def = 'http://img.yingyinbi.com/DSC06782qG.jpg'
    list.forEach(item => {
      item.url = def
    })
  },
  toUserEdit(){
    wx.navigateTo({
      url: '/pages/user-info/user-info',
    })
  },
  // 点击用户作品
  clickUserImage(e){
    const item = e.detail
    this.toImageShow({
      currentTarget: {
        dataset: {
          id: item._id,
          hideShowBtn: true,
          item: { fromPhotoClass: true }
        }
      }
    })
  },
  moving(e) {
    if(e.detail.y <= 0) {
      const { systemInfo } = app.globalData
      const { contentHeight } = this.data
      let setHeight = systemInfo.windowHeight - 40 + 'px'
      if(contentHeight === setHeight) return;
      this.setData({
        contentHeight: setHeight
      })
    }
    if(e.detail.y > 300) {
      this.setData({
        contentHeight: 'auto'
      })
    }
  },
  imageListBottom(e) {
    const { imageListTotalPage, imageListPage } = this.data
    if(imageListPage === imageListTotalPage)return;
    this.getImageList({page: imageListPage + 1})
  },
  // 删除视图图作品
  removeImg(e) {
    const { _id, index } = e.detail
    if(!index)return;

    const { imageList } = this.data
    imageList.splice(index, 1)
    this.setData({ imageList })
  }, 
  // 删除作品show
  edit(e) {
    const { systemInfo } = app.globalData
    if (systemInfo.platform !== "devtools") wx.vibrateShort();
    wx.showModal({
      title: '注意',
      content: '长按为删除操作，活动作品关联的show也会删除，数据不可恢复！确定删除？',
      success: res => {
        if (res.confirm) {
          this.realEdit(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  realEdit(e) {
    // show 和 id 来自买家show(activiey-data) ; fromPhotoClass为true表示来自photography-class，false来自activity-receive
    const { item = {}, show, id, index1, index2, index3 } = e.currentTarget.dataset
  
    const { fromPhotoClass, _id } = item
    if(id && show) {
      this.delDbData('activity-receive', id, { index1, index2, index3 })
    }else if(fromPhotoClass === false && _id){
      this.delDbData('activity-data', _id, { index1, index2, index3 })
    }else if(fromPhotoClass === true && _id){
      this.updateDbData('photography-class', _id, { index1, index2, index3 })
    }
  },
  async delDbData(collection, _id, index){
    const db = wx.cloud.database()
    const res = await db.collection(collection).doc(_id).remove()
    if(res.stats.removed === 1) {
      this.setListView(index)
    }
  },
  async updateDbData(collection, _id, index) {
    const db = wx.cloud.database()
    const res = await db.collection(collection).doc(_id).update({
      data: { 
        activity: {
          isJoinDevelop: false
        }
      }
    })
    if(res.stats.updated === 1) {
      this.setListView(index)
    }
  },
  // 更新activity视图
  setListView(index) {
    const { index1, index2, index3 } = index

    const { activityList } = this.data
      if(!index3) {
        activityList[index1].list.splice(index2, 1)
      }else{
        activityList[index1].list[index2].showData.splice(index3, 1)
      }
      this.setData({ activityList })
  }
})