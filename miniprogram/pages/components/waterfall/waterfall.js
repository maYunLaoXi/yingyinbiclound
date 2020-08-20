const app = getApp()
// 瀑布流组件
Component({
  options: {
    // 是否会被全局样式影响
    addGlobalClass: true,
  },
  properties: {
    // image数组，最好为单数
    imageList: {
      type: Array
    },
    // 组件名
    name: {
      type: String,
      value: ''
    },
    dot: {
      type: [Number, Boolean],
      value: false
    }
  },
  data: {
    // 左右两边盒子
    imageBox: [
      {
        position: 'left',
      },
      {
        position: 'right',
      },
    ],
    imagesLeft: [
      // {
      //   fileID: ['cloud://development-zgtnu.6465-development-zgtnu-1259664929/photography-class/portrait/7rl3xst911i.jpg'], // url01为封面(必须)
      //   title: '标题',
      //   userInfo: {
      //     avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL0msB8jbgywsOpnhwpBBiaibGriciam9qibUZpFe3zAibXcGAmMhstwOXLzcoxGHKtBkIJqCwfm66v1rzA/132',
      //     nickName: '用户尼称'
      //   },
      //   start: 0,// 点赞数
      // }
    ],
    imagesRight: [],
    // imageLeft imageRight的模型
    image: [
      {
        fileID: ['url01', 'url02'], // url01为封面(必须)
        title: '标题',
        userInfo: {
          avatarUrl: '用户/作者头像url',
          nickName: '用户尼称'
        },
        start: 0,// 点赞数
      }
    ]
  },
  observers: {
    'imageList': async function(list){
      if(list && list.length === 0){
        this.setData({
          imagesLeft: [],
          imagesRight: []
        })
        return
      }
      this.setStart(list)
      const [leftNum, rightNum] = await this.getHeighter();
      // 如果返回的是奇数条，那么left.lenght比right.length多一
      let left = list.filter((item, i) => i % 2 === 0)
      let right = list.filter((item,i) => i % 2 === 1)
      const { imagesLeft, imagesRight } = this.data

      if(leftNum && rightNum){
        if(leftNum >= rightNum){
          // 左边长
          [left, right] = [right, left]
        }
      }
      this.setData({
        imagesLeft: imagesLeft.concat(left),
        imagesRight: imagesRight.concat(right)
      })
    }
  },
  lifetimes: {
    attached() {
    }
  },
  methods: {
    getHeighter() {
      //创建节点选择器
      const promise1 = new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#left').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
          const height = res[0] ? res[0].height : 0
          resolve(height)
        })
      })
      const promise2 = new Promise(resolve => {
        const query2 = wx.createSelectorQuery().in(this)
        query2.select('#right').boundingClientRect()
        query2.selectViewport().scrollOffset()
        query2.exec(res => {
          const height = res[0] ? res[0].height : 0
          resolve(height)
        })
      })
      return Promise.all([promise1, promise2])
    },
    // 点击图片事件
    tapImage(e) {
      /**
       * 组件间的事件通信 
       * 第一个参数为 事件，第二个参数为 父组件中e.detail, 第三个参数为 触发事件的选项
       * see https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html
       */ 
      this.triggerEvent('img', { item: e.currentTarget.dataset.item , name: this.data.name})
    },
    setStart(list) {
      list.forEach(item => {
        const { start = [] } = item
        if(!start.length){
          item.hasStart = false
          return
        }
        const { _openid } = app.globalData.userInfo
        item.hasStart = start.includes(_openid)
      });
    },
    async tabStart(e) {
      const { obj, i, position } = e.currentTarget.dataset
      const list = position === 'left' ? 'imagesLeft' : 'imagesRight'
      const { name, [list]: imageList } = this.data
      const res = await wx.cloud.callFunction({
        name: 'start',
        data: {
          collection: name,
          _id: obj._id,
          start: obj.start
        }
      })
      const { stats, start: resStart } = res.result
      const { _openid } = app.globalData.userInfo

      if(stats.updated === 1) {
        imageList[i] = {
          ...obj,
          start: resStart,
          hasStart: resStart.includes(_openid)
        }
        this.setData({
          [list]: imageList
        })
      }
    }
  }
})
