// miniprogram/pages/components/add-picture-article/add-picture-article.js
const app = getApp()
import { randomStr } from '../../../utils/index'
import Toast from '/vant-weapp/toast/toast.js'
Page({
  data: {
    openid: '',
    title: '',
    arcicle: '',
    PhotographyClass: [],
    picClass: null,
    navigationBar: 'fasfdas',
    // drag组件
    isIphoneX: app.globalData.isIphoneX,
    size: 4,
    listData: [],
    extraNodes: [
      {
        type: "after",
        dragId: "plus",
        slot: "plus",
        fixed: true
      }
    ],
    pageMetaScrollTop: 0,
    scrollTop: 0,
    // drag组件end
    
    // 是否参加晒相活动
    isJoinDevelop: false,
    activity: {}
  },
  // drag组件方法
  sortEnd(e) {
    console.log("sortEnd", e.detail.listData)
    this.setData({
      listData: e.detail.listData
    });
  },
  change(e) {
    console.log("change", e.detail.listData)
  },
  delImg(e) {
    wx.vibrateShort();
    this.reListData({
      item: e.detail
    })
  },
  sizeChange(e) {
    wx.pageScrollTo({ scrollTop: 0 })
    this.setData({
      size: e.detail.value
    });
    this.drag.init();
  },
  itemClick(e) {
    console.log(e);
  },
  toggleFixed(e) {
    let key = e.currentTarget.dataset.key;

    let { listData } = this.data;

    listData[key].fixed = !listData[key].fixed

    this.setData({
      listData: listData
    });

    this.drag.init();
  },
  scroll(e) {
    this.setData({
      pageMetaScrollTop: e.detail.scrollTop
    })
  },
  // 页面滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },
  // drag组件方法end
  
  /**
   * 增加或删除图片
   * @param {*} options 
   */
  reListData({ item, type} = {}) {
    if(!item)return
    const { listData } = this.data
    let newListData

    if(type){
      // 增
      listData.push(item)
      newListData = listData
    }else{
      // 删
      newListData = listData.filter(imgItem => imgItem.dragId !== item.dragId)
    }
    this.setData({
      listData: newListData
    });
    this.drag.init();
  },
  upload() {
    this.showToast()
    const { listData, title, arcicle, picClass, isJoinDevelop } = this.data
    const promiseAll = []

    if(!listData.length) {
      Toast('你还没有选择图片')
      return
    }
    // 先将所有图片上传
    listData.forEach(item => {
      const name = picClass.nameEn + '/' + item.dragId + item.images.match(/\.[^.]+?$/)[0];

      promiseAll.push(wx.cloud.uploadFile({
        cloudPath: 'photography-class/' + name,
        filePath: item.images, // 文件路径
      }))
    })
    Promise.all(promiseAll).then(res => {
      const allNeedToAdd = [];

      res.forEach(item => {
        allNeedToAdd.push(item.fileID)
      })
      // 统一上传数据库
      this.cloudDbUpload({ title, arcicle, picClass, isJoinDevelop, fileID: allNeedToAdd })
    }).catch(err => {
      debugger
    })
  },
  // 上传
  cloudDbUpload({ title, arcicle, picClass, isJoinDevelop, fileID } = {}){    
    // 云调用
    wx.cloud.callFunction({
      name: 'class-edit-add',
      data: {
        data: {
          openid: app.globalData.openid,
          fileID,
          title,
          arcicle,
          class: picClass.nameEn,
          activity: {
            isJoinDevelop,
            activityId: isJoinDevelop ? this.data.activity._id : ''
          },
          uploadTime: new Date().getTime(),
          // 点赞 [点过的openid]
          start: [],
          // 收藏 
          collection: 0,
          // 分享
          share: 0,
          // 审核
          pass: false,
          // userInfo: app.globalData.userInfo,
          // 评论
          // comment: [],  
        }
      }
    }).then(res => {
      console.log('上传成功', res)
      Toast.clear()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ChooseImage()
    this.drag = this.selectComponent('#drag');
    this.setData({
      PhotographyClass: app.globalData.PhotographyClass
    })
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.getNowActivity()
  },
  // 获取当前进行的晒相活动
  getNowActivity() {
    const db = wx.cloud.database({env: "development-zgtnu"});
    const _ = db.command
    db.collection('activity').where({
      open: true,
      actName: 'photoDevelop'
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
    const urls = []
    this.data.listData.forEach(item => urls.push(item.images))
    wx.previewImage({
      urls,
      current: e.currentTarget.dataset.url
    });
  },
  doWxChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        const tempFilePaths = res.tempFilePaths

        tempFilePaths.forEach((item, i) => {
          this.reListData({
            item: {
              dragId: randomStr(),
              images: item
            },
            type: 'add'
          })
        })
      }
    });
  },
  inputTitle(e) {
    this.data.title = e.detail.value
  },
  articleInput(e) {
    this.setData({
      arcicle: e.detail.value
    })
  },
  classPicker(e) {
    this.setData({
      picClass: this.data.PhotographyClass[e.detail.value]
    })
  },
  // switch 
  handleJoin(e) {
    this.setData({
      isJoinDevelop: e.detail.value
    })
  },
  // 上传提示
  showToast() {
    Toast.loading({
      mask: true,
      message: '上传中...',
      duration: 0,
      onClose: _ => {
        Toast.success({
          message: '上传完成',
          duration: 1,
          onClose: _ => {
            wx.navigateBack()
          }
        });
      }
    });
  }
})