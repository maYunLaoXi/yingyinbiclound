// 将wx api 改为 Promise版本

export const requestSubscribeMessage = (templateId) => {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        console.log(res)
        if (res[templateId] === 'accept') {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        console.log('requestSubscribeMessage', err)
        reject(err)
      },
    })
  })
}

export const WxshowToast = (options) => {
  const { success, fail } = options
  return new Promise((resolve, reject) => {
    wx.showToast({
      ...options,
      success: (res) => {
        success && success()
        resolve(res)
      },
      fail: err => {
        fail && fail()
        reject(err)
      }
    })
  })
}