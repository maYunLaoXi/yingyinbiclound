const app = getApp()
Component({
  options: {
    // 是否会被全局样式影响
    addGlobalClass: true,
  },
  properties: {
    nowClass: {
      type: String,
      value: ''
    }
  },
  data: {
    class:[
      {
        nameCh: '人像',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yingyinbi-portrait-min.jpg?sign=13190be9a6160ccfb98003ff5d62ef5a&t=1570169029',
        page: 'portrait',
      },
      {
        nameCh: '风光',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-landscape.jpg?sign=c0e038d360f5eb1618b6163e35d2c803&t=1570182037',
        page: 'landscape'
      },
      {
        nameCh: '胶片',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-film.jpg?sign=3ed9f05cbf2c86181ab211c526a1b1ee&t=1570181638',
        page: 'film'
      },
      {
        nameCh: '旅行',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-travel.jpg?sign=07854a58898a2f7a536921146359d94b&t=1570181846',
        page: 'travel'
      },
      {
        nameCh: '日常',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-daily.jpg?sign=7277be294f48ae864c456a7efe7a49a1&t=1570182228',
        page: 'daily'
      },
      {
        nameCh: '后期',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-aftershoot.jpg?sign=c0f76670beb0f4d360df81db2f3242f3&t=1570182253',
        page: 'aftershoot'
      },
      {
        nameCh: '视频',
        backgroundImg: 'https://7969-yingyingbi-omlzp-1259664929.tcb.qcloud.la/images/index/index-swiper2/yinyingbi-swiper-2-video.jpg?sign=2aa433c9c3efab58573977b5934588a3&t=1570182590',
        page: 'video'
      }
    ]
  },
  lifetimes: {
    ready() {
      const { PhotographyClass } = app.globalData 
      const { class: dataClass } = this.data

      PhotographyClass.forEach(item => {
        dataClass.forEach(ele => {
          if(item.nameCh === ele.nameCh) {
            ele.nameEn = item.nameEn
          }
        })
      });
      this.setData({
        class: dataClass
      })
    }
  },
  methods: {
    TagNavigate(e) {
      const url = e.currentTarget.dataset.tagType
      wx.navigateTo({
        url: `/pages/components/portrait/portrait?class-name=${url}`
      })
    },
    back() {
      wx.navigateBack()
    }
  }
})