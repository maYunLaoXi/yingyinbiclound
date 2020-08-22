// pages/components/image-view/image-view.js
import { slice2sort, imageView } from '../../../utils/index'
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    images: {
      type: Array,
      value: [{
        url: 'http://img.yingyinbi.com/public/activitydevelop4.0/bpyvp5zpz9icrtty44104c.png',
        width: 1696,
        height: 1098,
        size: 11111,
      }]
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgArr: []
  },
  /**
   * 数据监听
   */
  observers: {
    'images': function(images) {
      if(!images.length) return

      images.forEach(item => item.url = item.url + '?imageView2/2/w/600')
      let imgArr = slice2sort(images, 2)
      this.setSize(imgArr)
      this.setData({
        imgArr
      })
    }
  },
  
  
  /**
   * 组件的方法列表
   */
  methods: {
    setSize(list) {
      const { systemInfo } = app.globalData
      const windowWidth = systemInfo.windowWidth - 1
      const { round } = Math

      list.forEach(item => {
        let imgWidth = windowWidth
        let imgHeight = 3 / 4 * imgWidth
        const [img1, img2] = item
        // debugger
        if(img2) {
          let allWidth = img1.width + img2.width
          
          img1.imgWidth = round(imgWidth * img1.width / allWidth)
          img2.imgWidth = round(imgWidth * img2.width / allWidth)
          img1.imgHeight = img2.imgHeight = round(getImgHeight(img1,img2))
        }else {
          img1.imgWidth = round(windowWidth + 3)
          if(img1.width > img1.height) 
          img1.imgHeight = img1.width >= img1.height ? (windowWidth + 3) * 9 / 16 : (windowWidth + 3) * 4 / 3
        }
      });
    },
    // 预览图片
    previewImg(e) {
      const { src: url } = e.currentTarget.dataset
      const urls = []
      this.data.images.forEach(item => urls.push(item.url))
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls, // 需要预览的图片http链接列表
      })
    }
  }
})
function getImgHeight(img1, img2) {
  let img = img1
  // 找宽度短的
  if(img1.imgWidth >= img2.width){
    img = img2
  }
  const ratio = img.width / img.height
  return img.imgWidth / ratio
}
