// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const fileID = event.fileID
  const promiseAll = []
  const errData = []
  let result;

  fileID.forEach((item, i) => {
    promiseAll.push(check(item, errData))
  })

  await Promise.all(promiseAll).then(res => {
    result = res
  }).catch(err => {
    result = Promise.reject(errData)
  })
  console.log(result)
  debugger
  return result
}

async function check(id, errData){
  const formData = (await cloud.downloadFile({
    fileID: id
  })).fileContent;
  return new Promise((resolve, reject) => {
    cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: formData
      }
    }).then(res => {
      debugger
      resolve(res)
    })
    .catch(err => {
      debugger
      errData.push(id)
      reject(err)
    })
  })
}