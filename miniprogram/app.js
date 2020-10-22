//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'development-zgtnu',
        env: 'yingyingbi-omlzp',
        // 是否在将用户访问记录到用户管理中，在控制台中可见
        traceUser: true,
      })
    }
    this.initConst()
    const globalData = {
      PhotographyClass: [
        {
          nameCh: '人像',
          nameEn: 'portrait',
          page: ''
        },
        {
          nameCh: '风光',
          nameEn: 'landscape',
          page: ''
        },
        {
          nameCh: '胶片',
          nameEn: 'film',
          page: ''
        },
        {
          nameCh: '旅行',
          nameEn: 'travel',
          page: ''
        },
        {
          nameCh: '日常',
          nameEn: 'daily',
          page: ''
        },
        {
          nameCh: '后期',
          nameEn: 'aftershoot',
          page: ''
        },
        // {
        //   nameCh: '视频',
        //   nameEn: 'video',
        //   page: ''
        // },
        {
          nameCh: '其它',
          nameEn: 'other',
          page: ''
        },
      ], 
      router: {
        back: false,
        redirect: ''
      }
    }
    let that = this
    setGlobalDdata(that, globalData)
  },
  initConst(){
    const that = this
    wx.getSystemInfo({
      success(res){
        const systemInfo = {
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          platform: res.platform,
        }
        setGlobalDdata(that, { systemInfo })
      }
    })
  }
})

function setGlobalDdata (that, data) {
  that.globalData = Object.assign({}, that.globalData, data)
}
