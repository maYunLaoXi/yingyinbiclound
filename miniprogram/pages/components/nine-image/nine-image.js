// pages/components/nine-image/nine-image.js
import { readableTime, isLogin } from '../../../utils/index'
import Toast from '/vant-weapp/toast/toast.js'
const app = getApp()
Component({
  options: {
    // 是否会被全局样式影响
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    images: {
      type: Array,
      value: []
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    imageList: [],
    _openid: null
  },
  lifetimes: {
  },
  
  observers: {
    'images': function(images) {
      if(!images && !images.length)return
      if(!this.data.userInfo) {
        const { userInfo } = app.globalData
        if(userInfo) {
          this.setData({
            _openid: userInfo._openid
          })
        }
      }
      const { imageList } = this.data
      images.forEach(item => {
        this.setHasStart(item)
        item.photoView = item.photo.slice(0,3)
        this.setTime(item)
      })
      this.setData({ imageList: [...imageList, ...images]})
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImg(e) {
      const { item, url } = e.currentTarget.dataset
      const urls = []
      item.forEach(item => urls.push(item.url + '?imageView/2/w/800'))
      wx.previewImage({
        current: url + '?imageView/2/w/800', // 当前显示图片的http链接
        urls, // 需要预览的图片http链接列表
      })
    },
    async start(e) {
      Toast('先去‘我的’页登录吧～')
      if(!isLogin()) {
        Toast.fail('失败文案');
        return
      }
      const { item, index } = e.currentTarget.dataset
      const { _id, start } = item
      const res = await wx.cloud.callFunction({
        name: 'start',
        data: {
          _id,
          start,
        }
      })
      const { stats, start: resStart } = res.result
      if(stats.updated === 1) {
        item.start = resStart
        const { imageList } = this.data
        imageList[index] = {...item, hasStart: true }
        this.setData({ imageList })
      }
    },
    setHasStart(item){
      const { userInfo } = app.globalData
      if(userInfo && userInfo._openid) {
        const {start} = item
        if(start.includes(userInfo._openid))item.hasStart = true;
      }
    },
    setTime(item) {
      const { createTime } = item
      if(!createTime)return
      item.createTime = readableTime(createTime)
    },
    toImageShow(e) {
      const { show } = e.currentTarget.dataset
      app.globalData.imageShowData = show
      wx.navigateTo({
        url: '/pages/image-show/image-show?from=photography-class',
      })
    }
  }
})
