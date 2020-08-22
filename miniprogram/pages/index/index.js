//index.js
import { qinuiUpload, tiemFromLast } from '../../utils/index'

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
    ],
    dynamicList: [],
    dynamicListPage: 0,
    dynamicListTotalPage: 0,
    dot: true,
  },

  onLoad: async function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 操作tabbar的数字： 
    // wx.setTabBarBadge({
    //   index: 2, //第几个
    //   text: '6',  //显示的字
    // })

    //清除tabbar数字
    // wx.removeTabBarBadge({
    //   index: 0,
    // })

    // 获取云数据，swiper的图片地址
    const db = wx.cloud.database();
    db.collection('index-data').where({ open: true }).get({
      success:(res) => {
        const { swiper } = res.data[0]
        this.setData({
          swiper: swiper,
        })
      },
      error:function(err){
        console.log('err',err)
      }
    })
    // 获取用户信息
    const userInfo = await this.wxGetSetting()
    if(userInfo) {
      await this.getDbUserInfo(userInfo)
    }
    this.getDynamic()
  },
  wxGetSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
                success: res => resolve(res.userInfo),
                fail: err => reject(err)
            })
          }else resolve('')
        },
        fail: err => reject(err)
      });
    })
  },

  // 获取数据库的用户信息
  getDbUserInfo(userInfo){
    const getInfo =  tiemFromLast('updateUserInfo') < 10 
    return new Promise(resolve => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          info: userInfo,
          getInfo
        }
      }).then(res => {
        let result = res.result
        if(!result)result = userInfo;
        
        app.globalData.userInfo = result
        this.setData({
          avatarUrl: result.avatarUrl,
          userInfo: result
        })
        resolve(res)
      }).catch(err => {
        resolve(err)
      })
    })
  },
  async getDynamic(page = 1) {
    const { dynamicList } = this.data
    this.setData({ dot: true })

    const imageList = await wx.cloud.callFunction({
      name: 'get-image-index',
      data: {
        page,
        pageSize: 9,
      }
    })
    const { data, page: resPage, totalPage } = imageList.result
    if(page === this.data.dynamicListPage) return
    this.setData({
      dynamicList: [...dynamicList, ...data],
      dynamicListPage: resPage,
      dynamicListTotalPage: totalPage,
      dot: false
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
  // 点击swiper
  cliImage(e) {
    const { item } = e.currentTarget.dataset
    app.globalData.imgShowUser = item.userInfo
    wx.navigateTo({
      url: `/pages/image-show/image-show?id=${item._id}&collection=${item.collection}`,
    })
  },
  // 触底事件
  onReachBottom(){
    const { dynamicListPage, dynamicListTotalPage } = this.data
    if(dynamicListPage === dynamicListTotalPage) return;
    this.getDynamic(dynamicListPage + 1)
  },
  show:function(){
    console.log(this.data.swiper)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      dynamicList: [],
      dynamicListPage: 0,
      dynamicListTotalPage: 1,
      dot: true
    })
    this.getDynamic(1)
  },
})
