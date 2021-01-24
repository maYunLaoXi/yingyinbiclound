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
        reject(err)
      },
    })
  })
}