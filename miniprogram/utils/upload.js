export const uploadToCloud = (list, path) => {
  debugger
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