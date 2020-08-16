// miniprogram/pages/user-info/user-info.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    isShowAddress: false,
    address: {},
    profile: '',
    profileTips: '',
    profileTips2: '上传',
    click: ''
  },
  onLoad(){
  },
  onShow(e) {
    const {userInfo} = app.globalData
    this.handleProfile(userInfo)
    this.setData({ userInfo })
    if(userInfo.address) this.setData({ address: userInfo.address[0] })
  },
  showAddress(e){
    this.setData({ isShowAddress: e.detail })

  },
  addressEdit(){
    this.setData({ click: 'address'})
    wx.navigateTo({
      url: '/pages/address-edit-add/index?redirect=join-activity'
    })
  },
  setUserBg(){
    this.setData({ click: 'bg' })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.navigateTo({
          url: `/pages/set-user-bg/set-user-bg?url=${tempFilePaths}`,
        })
      }
    })
  },
  handleProfile(userInfo) {
    let { profile } = this.data
    const tips = userInfo.profile ?  '已设置' : '未设置'
    let tips2 = '上传'
    if(this.data.click !== 'bg') {
      this.setData({
        profileTips: tips
      })
      return
    }
    if(userInfo.profile && profile && userInfo.profile !== profile){
      tips2 = '设置成功';
    }
    profile = userInfo.profile
    this.setData({
      profileTips: tips,
      profileTips2: tips2,
      profile,
    })
  },

  getUserPage() {
    const pages =  getCurrentPages()
    return pages[pages.length - 2]
  },
  setUserPageData() {
    const page = this.getUserPage()
    if(!page || !this.data.click) return;
    page.setData({
      userInfo: this.data.userInfo,
    })
  }
})