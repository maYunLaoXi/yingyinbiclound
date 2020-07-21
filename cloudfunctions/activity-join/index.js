// 活动信息上传
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const images = []
  const imageRes = await getImageInfo(event.photo)
  imageRes.forEach(item => {
    images.push({
      url: item.config.url.split('?')[0],
      ...item.data
    })
  })
  event.photo = images
  await db.collection('activity-data').add({
    data: {
      openid: wxContext.OPENID,
      ...event,
      uploadTime: db.serverDate()
    }
  }).then(res => {
    result = res
  })

  return result
}

function getImageInfo(images) {
  const promiseAll = []

  images.forEach(item => {
    promiseAll.push(axios.get(item + '?imageInfo'))
  })
  return Promise.all(promiseAll)
}
