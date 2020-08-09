import { randomStr } from './tools'
/**
 * 云存储上传图片方法
 * @param {Array} list drag组件的imageList { dragId: 图片唯一标识， images: 图片本地临时地址 }
 * @param {String} path 云存储中的文件盘路径
 */
export const uploadToCloud = (list, path) => {
  if(!list || list.length === 0)return list
  const rootPath = path ? path + '/' : ''
  const promiseAll = []
  list.forEach(item => {
    const name = item.dragId + item.images.match(/\.[^.]+?$/)[0];
    promiseAll.push(wx.cloud.uploadFile({
      cloudPath: rootPath + name,
      filePath: item.images, // 文件路径
    }))
  })
  return new Promise((resolve, reject) => {
    Promise.all(promiseAll).then(res => {
      const allFileID = [];
      debugger
      res.forEach(item => {
        allFileID.push(item.fileID)
      })
      resolve(allFileID)
    }).catch(err => { reject(err) })
  })
}
/**
 * 七牛上传图片组方法
 * @param {Array, String} path drag组件的imageList { dragId: 图片唯一标识， images: 图片本地临时地址, width, height, size...} 或 图片本地临时地址
 * @param {String} photoClass 云存储中的文件盘路径
 * @param {String} dragId 当path是string类型时用到
 * @param {String} imageView 设定返回值的url处理方式
 * @param {Boolean}   isPublic 是否公开图片（会进行七牛增量审核）
 * @returns {Object} { width, hieght, url, size}
 */
export const qinuiUpload = async ({ path, photoClass = 'other', dragId = 'dragId', imageView = '?imageView2/2/w/200/h/270', isPublic = true, progress: progerssCb, removeDragId = true } = {}) => {
  if(!path)return
  const url = 'https://up-z2.qiniup.com' // 华南地址
  const src = 'http://img.yingyinbi.com' // 云加速地址
  const token = await getQinuiToken()
  const all = []
  let imgList = []

  if(typeof path === 'string') {
    path = [{
      dragId,
      images: path
    }]
  }
  path.forEach(item => {
    let secondName = '.png'
    let path = item.images
    if(/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(path)){
      secondName = path.match(/\.[^.]+?$/)[0]
    }else {
      secondName = '.png'
    }
    let key = `${isPublic ? 'public' : ''}/${photoClass}/${item.dragId + randomStr() + secondName}`
    all.push(
      wxUploadFile(item, url, key, token, progerssCb)
    )
  })
  await Promise.all(all).then(res => {
    res.forEach(item => {
      item.url = src + '/' + item.key
      delete item.key
      delete item.images
      if(removeDragId) delete item.dragId
      imgList.push(item)
    })
  })
  return imgList
}

export const wxUploadFile = (imageObj, url, key, token, progerssCb) => {
  const filePath = imageObj.images

  return new Promise((resolve, reject) => {
    const progress = wx.uploadFile({
      url,
      filePath,
      name: 'file',
      formData: {
        key,
        token,
      },
      success: res => {
        if(typeof res.data === 'string')res.data = JSON.parse(res.data)
        imageObj.key = res.data.key
        resolve(imageObj)
      },
      fail: err => {
        resolve(imageObj)
      }
    })
    progress.onProgressUpdate(res => {
      console.log(res)
      progerssCb && progerssCb(res.progress)
    })
  })
}

/**
 * 获取七牛uploadToken, 用于图片或文件上传
 */
export const getQinuiToken = async () => {
  let token = await wx.cloud.callFunction({
    name: 'qiniu-upload',
    data: {}
  })
  return token.result.uptoken
}