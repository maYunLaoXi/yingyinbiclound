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
      if(!images) return
      if(images && !images.length){
        this.setData({
          imageList: []
        })
        return
      }
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
      if(!isLogin()) {
        Toast('登录才可点赞哦～')
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
      const { imageList } = this.data

      if(stats.updated === 1) {
        item.start = resStart
        imageList[index] = {...item, hasStart: !item.hasStart }
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
      const from  = 'photography-class'
      wx.navigateTo({
        url: `/pages/image-show/image-show?from=${from}&collection=${from}`,
      })
    }
  }
})
