// pages/components/photos/photos.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageList: {
      type: Array,
      value: []
    },
    collection: {
      type: String,
      value: ''
    },
    height: {
      type: String,
      value: 'auto'
    }
  },
  observers: {
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapImg(e) {
      const { item, index } = e.currentTarget.dataset
      this.triggerEvent('cliImage', item)
    },
    edit(e) {
      if(!this.data.collection) return;

      const { systemInfo } = app.globalData
      if (systemInfo.platform !== "devtools") wx.vibrateShort();
      const that = this
      wx.showModal({
        title: '注意',
        content: '长按为删除操作，数据不可恢复！确定删除？',
        success (res) {
          if (res.confirm) {
            const { item, index } = e.currentTarget.dataset
            that.delDbData(that.data.collection, item._id, index)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    async delDbData(collection, _id, index) {
      if(!collection || !_id) return;

      const db = wx.cloud.database()
      const res = await db.collection(collection).doc(_id).remove()
      if(res.stats.removed === 1) {
        this.triggerEvent("removeImg", {_id, index})
      }
    }
  }
})
