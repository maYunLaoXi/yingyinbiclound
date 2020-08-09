// pages/components/photos/photos.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageList: {
      type: Array,
      value: []
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
      const { item } = e.currentTarget.dataset
      this.triggerEvent('cliImage', item)
    }
  }
})
