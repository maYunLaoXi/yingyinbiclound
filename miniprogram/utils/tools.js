const app = getApp()
/**
 * 生成随机字符串
 */
export const randomStr = () => {
  return Math.random().toString(36).substr(2,15)
}
/**
 * 当前字符串是否在yingyinbi.com域名下
 * @param {String}} url 
 */
export const matchQiniuUrl = url => {
  let reg = new RegExp('yingyinbi.com')
  return reg.test(url)
}
/**
 * 七牛云图片基本处理
 * @param {String}} url 
 */
export const imageView = (url) => {
  return url + '?imageView2/2/w/200/h/270'
}
/**
 * @Author: 梁云辉
 * @Version: 1.0
 * @Date: 2020-07-14
 * @Description: 将数组切成指定长度的组组合集
 * @param {Array} arr 原数组（长数组）
 * @param {Number} num 数组的长度
 */
export const slice2sort = (arr, num) => {
  if(!arr || !Array.isArray(arr))return []
  if(!num) return arr
  let result = []
  for(let i = 0;i < arr.length; i += num) {
    result.push(arr.slice(i, i + num))
  }
  console.log(result)
  return result
}

  // 压缩图片
 export const compress = async (imgObj) => {
  const { path, size } = imgObj
  if(!path || !size) return imgObj

  const maxSize = 1024 * 1024 * 5; // 5MB
  if(size <= maxSize) return getImageInfo(imgObj)

  const compressObj = await doWxCompress(path, maxSize)
  if(compressObj.size <= maxSize) return getImageInfo(compressObj)
  else compress(compressObj)
} 

function doWxCompress(path, maxSize) {
  return new Promise(resolve => {
    // 注： 些函方法目前无法在微信开发者工具上正常使用， 可能会产生反回path后缀为undefined
    wx.compressImage({
      src: path, // 图片路径
      quality: 50, // 压缩质量
      success: res => {
        imageInfoObj(res.tempFilePath, resolve)
      },
    })
  })
}

// 根据path返回 path和size
export const imageInfoObj = (path, resolve) => {
  const imgObj = { path }
  wx.getFileInfo({
    filePath: path,
    success: res => {
      imgObj.size = res.size
      resolve && resolve(imgObj)
    }
  })
}

function getImageInfo(imgObj) {
  const { path, size } = imgObj
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: path,
      success: res => {
        const { path, height, width, type } = res
        resolve({ path, height, width, type, size })
      },
      fail: err => reject(err)
    })
  })
}
/**
 * 用户是否已登录
 */
export const isLogin = () => {
  const { userInfo } = app.globalData
  return userInfo && Object.keys(userInfo).length
}
/**
 * 返回页面栈的某页
 */
export const getPage = (num = -1) => {
  const pages = getCurrentPages()
  return pages[pages.length - Math.abs(num)]
}
/**
 * 获取用户openid
 */
export const getOpenid = () => {
  if(!isLogin())return '';
  return app.globalData.userInfo._openid
}
/**
 * setStart
 */
export const setStart = (start, item) => {
  let receiveStart,receiveItem;
  if(!item){
    receiveStart = item.start
    receiveItem = start
  }else{
    receiveStart = start ? start : []
    receiveItem = item
  }
  const _openid = getOpenid()
  const [newStart, hasStart] = toggleElement(receiveStart, _openid)
  return {...receiveItem, start: newStart, hasStart}
}
/**
 * 数组有就删，没有就加，反回结果数组及里面是否有
 * @param {*} arr 
 * @param {*} ele 
 */
export const toggleElement = (arr = [], ele) => {
  const index = arr.findIndex(value => {
    return value === ele
  })
  const has = index !== -1
  const resArr = [...arr]
  if(!has){
    resArr.push(ele)
  }else{
    resArr.splice(index, 1)
  }
  return [resArr, !has]
}