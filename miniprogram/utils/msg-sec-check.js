import { wxUploadFile } from "./upload"

// 文字内空安全
export const msgSecCheck = (msg) => {
  if(!msg) return Promise.resolve({pass: true, msg: ''})
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'msg-sec-check',
      data: {
        msg
      }
    }).then(res => {
      if(res.result.errCode === 0)resolve({ pass: true, ...res })
      else resolve({ pass: false, msg: '你的内容需要作者审核', ...res})
    }).catch(err => {
      resolve({ pass: false, msg: '你的内容需要作者审核', ...err})
    })

  })
}

// 上传提示并反回
export const showToast =(pass, msg, cb) => {
  if(pass) {
    wx.showToast({
      title: '上传完成',
      icon: 'success',
      duration: 1000,
    })
    setTimeout(_ => {
      if(cb)cb()
      else wx.navigateBack()
    }, 1000)
  }else {
    wx.showModal({
      title: '提示',
      content: msg,
      success (res) {
        if(cb)cb
        else wx.navigateBack()
      }
    })
  }
}