// pages/components/image-view/image-view.js
import { slice2sort } from '../../../utils/index'
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

  },
  /**
   * 数据监听
   */
  observers: {
    'images': function(images) {
      if(!images.length) return
      debugger
      let imgArr = slice2sort(images, 2)
      this.setSize(imgArr)
      console.log(imgArr)
    }
  },
  
  
  /**
   * 组件的方法列表
   */
  methods: {
    setSize(list) {
      const { systemInfo } = app.globalData
      const windowWidth = systemInfo.windowWidth - 2

      list.forEach(item => {
        let imgWidth = windowWidth / 2
        let imgHeight = 4 / 3 * imgWidth
        const [img1, img2] = item

        if(img2) {
          let allWidth = img1.width + img2.width
          
          img1.imgWidth = imgWidth * img1.width / allWidth
          img2.imgWidth = imgWidth * img2.width / allWidth
          img1.imgHeight = img2.imgHeight = getImgHeight(img1,img2)
        }else {
          img1.imgWidth = windowWidth
          img1.imgHeight = windowWidth / img1.width / img.height
        }
 
      });
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
