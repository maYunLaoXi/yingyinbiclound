// pages/components/add-image-comp/add-image-comp.js
const app = getApp()
import { randomStr, compress } from '../../../utils/index'

Component({
  options: {
    // 是否会被全局样式影响
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 可以上传的图片最多张数
    num: {
      type: Number,
      value: 30
    },
    // wx.chooseImage的sizeType
    sizeType: {
      type: Array,
      value: ['original', 'compressed']
    },
    // wx.chooseImage的sourceType
    sourceType: {
      type: Array,
      value: ['album']
    },
    // 是否加载完页面后立即打开相册
    onLoadChoose: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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
  },
  /**
   * 生命周期
   */
  lifetimes: {
    ready() {
      this.drag = this.selectComponent('#drag');

      if(this.data.onLoadChoose) {
        setTimeout(() => this.wxChooseImage(), 80)
      }
    },

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // drag组件方法
    sortEnd(e) {
      this.setListData({ listData: e.detail.listData})
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

      this.setListData({ listData })
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
    wxChooseImage() {
      const { listData, num, sizeType, sourceType } = this.data
      if(listData.length >= num)return
      let count = num - listData.length > 9 ? 9 : num -listData.length

      wx.chooseImage({
        count, // 默认9
        sizeType, // 可以指定是原图还是压缩图，默认二者都有
        sourceType, // 默认从相册选择
        success: (res) => {
          const { tempFiles } = res
          tempFiles.forEach(item => {
            compress(item).then(res => {
              const { path, height, width, type, size } = res
              this.reListData({
                item: {
                  dragId: randomStr(),
                  images: path,
                  height,
                  width,
                  type,
                  size,
                },
                type: 'add'
              })
            })
          })
        }
      });
    },
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
      this.setListData({ listData: newListData})
    },
    ViewImage(e) {
      const urls = []
      this.data.listData.forEach(item => urls.push(item.images))
      let current = e.detail.key
      wx.previewImage({
        urls,
        current: urls[current]
      });
    },
    // 设定图片并传递给父组件
    setListData({ listData, init = true, send = true }){
      listData && this.setData({
        listData
      })
      init && this.drag.init()
      send && this.triggerEvent('list', listData)
    }
  }
})
