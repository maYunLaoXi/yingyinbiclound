// pages/components/waterfall/waterfall.js
Component({
  options: {
    // 是否会被全局样式影响
    addGlobalClass: true,
  },
  properties: {
    // image数组，最好为单数
    imageList: {
      type: Array
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
      {
        fileID: ['cloud://development-zgtnu.6465-development-zgtnu-1259664929/photography-class/portrait/7rl3xst911i.jpg'], // url01为封面(必须)
        title: '标题',
        userInfo: {
          avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL0msB8jbgywsOpnhwpBBiaibGriciam9qibUZpFe3zAibXcGAmMhstwOXLzcoxGHKtBkIJqCwfm66v1rzA/132',
          nickName: '用户尼称'
        },
        start: 0,// 点赞数
      }
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
      if(!list || !list.length)return
      const [leftNum, rightNum] = await this.getHeighter();
      debugger
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
  methods: {
    getHeighter() {
      const arr = []
      //创建节点选择器
      const query = wx.createSelectorQuery()
      query.select('#left').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        debugger
        arr[0] = res[0].height
      })
      const query2 = wx.createSelectorQuery()
      query2.select('#right').boundingClientRect()
      query2.selectViewport().scrollOffset()
      query2.exec(res => {
        arr[1] = res[0].height
      })
      console.log({arr})
      debugger
      return arr
    },
  }
})
