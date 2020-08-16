//index.js
import { qinuiUpload } from '../../utils/index'

const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    swiper:[],

    swiper2:[
      {
        text: '人像',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yingyinbi-portrait-min.jpg?sign=13190be9a6160ccfb98003ff5d62ef5a&t=1570169029',
        page: 'portrait'
      },
      {
        text: '风光',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-landscape.jpg?sign=c0e038d360f5eb1618b6163e35d2c803&t=1570182037',
      },
      {
        text: '胶片',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-film.jpg?sign=3ed9f05cbf2c86181ab211c526a1b1ee&t=1570181638',
      },
      {
        text: '旅行',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-travel.jpg?sign=07854a58898a2f7a536921146359d94b&t=1570181846',
      },
      {
        text: '日常',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-daily.jpg?sign=7277be294f48ae864c456a7efe7a49a1&t=1570182228',
      },
      {
        text: '后期',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-aftershoot.jpg?sign=c0f76670beb0f4d360df81db2f3242f3&t=1570182253',
      },
      {
        text: '视频',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-video.jpg?sign=2aa433c9c3efab58573977b5934588a3&t=1570182590',
      }
    ]
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 操作tabbar的数字： 
    wx.setTabBarBadge({
      index: 2, //第几个
      text: '6',  //显示的字
    })

    //清除tabbar数字
    // wx.removeTabBarBadge({
    //   index: 0,
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.getDbUserInfo(res.userInfo)
            }
          })
        }
      },
      fail: err => {
        debugger
      }
    });

    // 获取云数据，swiper的图片地址
    const db = wx.cloud.database();
    db.collection('index-data').doc("fd9fa871-d12a-4c78-bb4d-a376c7b4e004").get({
      success:(res) => {
        console.log('clound',res);
        const arr = [];
        for(var i in res.data.swiper){
          arr.push(res.data.swiper[i])
        }
        this.setData({
          swiper: arr,
        })
      },
      error:function(err){
        console.log('err',err)
      }
    })
    // 获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
      }
    })
  },

  // 获取数据库的用户信息
  getDbUserInfo(userInfo){
    wx.cloud.callFunction({
      name: 'user',
      data: {
        getInfo: true
      }
    }).then(res => {
      let [result] = res.result.data
      if(!result)result = userInfo;

      app.globalData.userInfo = result
      this.setData({
        avatarUrl: result.avatarUrl,
        userInfo: result
      })
      console.log({globalData: app.globalData})
    })
  },

  // 去活动页
  toActivity(){
    wx.switchTab({
      url: '/pages/activity/activity',
    })
  },
  // 点击标签
  TagNavigate(page) {
    const url = page.currentTarget.dataset.tagType
    wx.navigateTo({
      url: '/pages/components/' + url + '/' + url
    })
  },
  show:function(){
    console.log(this.data.swiper)
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // debugger
  },
  test(){
    // wx.cloud.callFunction({
    //   name: 'qiniu-upload',
    //   data: {}
    // }).then(res => {
    //   debugger
    // }).catch(err => {
    //   debugger
    // })
    wx.chooseImage({
      success: res => {
        debugger
        qinuiUpload({ path: res.tempFilePaths[0], photoClass: 'film' })
      }
    })
  }
})
