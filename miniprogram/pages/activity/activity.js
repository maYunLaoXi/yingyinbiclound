// miniprogram/pages/home/home.js
const app = getApp()
Page({
  data: {
    topImg: '',
    name: '晒相4.0',
    beforeEnd: 0,
    authorAvatar: '',
    author: '影音笔',
    descriptionShort: '',
    tempFilePaths:[],
    drawerImg1: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/activities/%E6%99%92%E7%9B%B84.0/IMG_0206mohu.jpg?sign=b779ad36004423e6b615052ecfc90b28&t=1572144936',
    TabCur: 0,
    // imageJoin
    imageJoin: [],
    imageJoinPage: 1,
    imageJoinTotalPage: NaN,
    dotJoin: true,
    // imageShow
    imageShow: [],
    imageShowPage: 1,
    imageShowTotalPage: NaN,
    dotShow: true
  },

  //立即参加 
  joinActivity: function () {
    const { userInfo } = app.globalData
    if(!userInfo){
      this.showModal({
        currentTarget: {
          dataset: { target: 'loginTips'}
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/join-activity/join-activity?redirect=activity'
      })
    }
  },
  /**
   * 去 我的 页
   */
  goLogin(){
    this.hideModal()
    app.globalData.router.redirect = 'activity'
    wx.switchTab({
      url: '/pages/user/user?redirect=activity',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.router.redirect === 'activity')app.globalData.router.redirect = ''
    // 数据请求
    const db = wx.cloud.database();
    db.collection('activity').where({
      open: true
    }).get({
      success: (res) => {
        let data = res.data
        if(!data.length)return
        data = data[0]
        const {
          name,
          actName,
          author,
          authorAvatar,
          endTime,
          poster: topImg,
          descriptionShort,
        } = data
        app.globalData.activity = data
        const end = new Date(endTime).getTime()
        const now = new Date().getTime()
        let beforeEnd = Math.floor((end - now) / (1000 * 60 * 60 * 24))
        beforeEnd = beforeEnd < 0 ? 0 : beforeEnd
        this.setData({
          name,
          actName,
          author,
          authorAvatar,
          beforeEnd,
          topImg: topImg ? topImg + '?imageView/2/w/800' : '',
          descriptionShort,
        })
      },
      error: function (err) {
        console.log('err', err)
      }
    })
    return new Promise(resolve => {
      this.getShow()
      this.getJoin().then(res => resolve(res))
    })
  },
  init(){

  },

  /**
   * 精选内容(用户设定公开展示的内容)
   * @param {*} e 
   */
  async getJoin({ page = 1, pageSize = 9 } = {}){
    const { imageJoinPage, imageJoinTotalPage } = this.data
    if(imageJoinPage === imageJoinTotalPage)return
    this.setData({ dotJoin: true })
    const res = await wx.cloud.callFunction({
      name: 'activity-get',
      data: {
        collection: 'activity-data',
        page,
        pageSize,
        where: {
          check: true,
          show: true,
          pass: true,
        }
      }
    })
    const {data, page: resPage, totalPage: resTotalPage} = res.result;
    if(!data.length) return

    this.setData({
      imageJoin: data,
      imageJoinPage: resPage,
      imageJoinTotalPage: resTotalPage,
      dotJoin: false
    })
    return true
  },
  /**
   *  show内空（买家秀）
   */
  async getShow({page = 1, pageSize = 9 } = {}) {
    const { imageShowPage, imageShowTotalPage } = this.data
    if(imageShowPage === imageShowTotalPage) return
    this.setData({ dotShow: true })
    const res = await wx.cloud.callFunction({
      name: 'activity-get',
      data: {
        collection: 'activity-receive',
        page,
        pageSize,
        where: {
          check: true,
          show: true,
          pass: true,
        }
      }
    })
    const { data, page: resPage, totalPage: resTotalPage } = res.result
    this.setData({
      imageShow: data,
      imageShowPage: resPage,
      imageShowTotalPage: resTotalPage,
      dotShow: false
    })
  },
  // 点击查看图片
  toImageShowNav(e) {
    const { item, name } = e.detail
    app.globalData.imageShowData = item
    wx.navigateTo({
      url: `/pages/image-show/image-show?from=${name}&collection=${name}`
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    this.setData({
      imageJoin: [],
      imageJoinPage: 1,
      imageJoinTotalPage: NaN,
      imageShow: [],
      imageShowPage: 1,
      imageShowTotalPage: NaN,
    })
    await this.onLoad()    
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    if(this.data.TabCur == 1) {
      this.getJoin({page: this.data.imageJoinPage + 1})
    }
  },
// colorui
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  longTapScan(e){
    var current = e.target.dataset.src;
    console.log(e.target)
    wx.previewImage({
      current: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/%E5%BD%B1%E9%9F%B3%E7%AC%94%E7%9B%B8%E5%85%B3/%E5%BD%B1%E9%9F%B3%E7%AC%94-qrcodd.jpg?sign=8bbb26ad4ec95904fb0c2f3c5708fc86&t=1570374091',
      urls: ['https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/%E5%BD%B1%E9%9F%B3%E7%AC%94%E7%9B%B8%E5%85%B3/%E5%BD%B1%E9%9F%B3%E7%AC%94-qrcodd.jpg?sign=8bbb26ad4ec95904fb0c2f3c5708fc86&t=1570374091']
    })
  },

  tabSelect(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      TabCur: id
    })
  }
})