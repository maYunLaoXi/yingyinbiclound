Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    // min: {
    //   type: Number,
    //   value: 0
    // },
    // min: {
    //   type: Number,
    //   value: 0,
    //   observer: function(newVal, oldVal) {
    //     // 属性值变化时执行
    //   }
    // },
    // lastLeaf: {
    //   // 这个属性可以是 Number 、 String 、 Boolean 三种类型中的一种
    //   type: Number,
    //   optionalTypes: [String, Object],
    //   value: 0
    // },
    left: {
      type: String,
      value: '返回'
    },
    navigationBarTitleText: {
      type: String,
      value: '影音笔'
    },
    // navigationBarBackgroundColor: "#ffffff",
    // navigationBarTextStyle: "black",
    // backgroundColor: "#F1F3F4",
    // backgroundTextStyle: "light",
    // enablePullDownRefresh: true
  },
  methods: {
    back() {
      wx.navigateBack()
    }
  }
})