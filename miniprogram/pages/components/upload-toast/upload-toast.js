// pages/components/upload-toast/upload-toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    progress: {
      type: Number,
      value: 90
    },
    total: {
      type: Number,
      value: 9
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    waveHeight: 0,
    totalProgerss: 0,
    now: 0
  },
  observers: {
    'progress': function(e) {
      if(this.data.total === 1){
        this.setData({
          totalProgerss: e
        })
        return
      }
      if(e===100){
        let now = this.data.now
        this.setData({
          now: ++now,
          totalProgerss: Math.round( ++now / this.data.total * 100)
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onePcs(progress) {
      const now = this.data.now
    }
  }
})
