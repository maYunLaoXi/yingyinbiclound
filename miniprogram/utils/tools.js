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