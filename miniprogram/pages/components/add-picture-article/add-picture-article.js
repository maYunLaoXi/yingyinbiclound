// miniprogram/pages/components/add-picture-article/add-picture-article.js
const app = getApp()
import { randomStr } from '../../../utils/index'
Page({

  /**
   * 页面的初始数据
   */
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
    isJoinDevelop: false
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
    const { openid, listData, title, arcicle, picClass, isJoinDevelop } = this.data
    const db = wx.cloud.database()
    // db.collection(picClass.nameEn)
    listData.forEach(item => {r
      this.doWxUpload({ openid, item, title, arcicle, picClass, isJoinDevelop, db })
    })
  },
  // 上传
  doWxUpload({ openid, item, title, arcicle, picClass, isJoinDevelop, db } = {}){
    if(!item || !picClass) return
    const name = picClass.nameEn + item.dragId + item.images.match(/\.[^.]+?$/)[0];

    wx.cloud.uploadFile({
      cloudPath: name,
      filePath: item.images, // 文件路径
    }).then(res => {
      // get resource ID
      console.log(res.fileID)
      const fileID = res.fileID

      let dd = db.collection("photographyClass")
      .doc('05f2c36f5ec15c120102c27a3752a602')
      .update({
        data: {
          [picClass.nameEn]: {
            openid,
            fileID,
            title,
            arcicle,
            class: picClass.nameEn,
            isJoinDevelop,
          }
        }
      }).then(res => {
        debugger
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drag = this.selectComponent('#drag');
    this.setData({
      PhotographyClass: app.globalData.PhotographyClass
    })
    console.log({app})
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
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
  articleInput(e) {
    this.setData({
      arcicle: e.detail.value
    })
  },
  classPicker(e) {
    this.setData({
      picClass: this.data.PhotographyClass[e.detail.value]
    })
  }
})