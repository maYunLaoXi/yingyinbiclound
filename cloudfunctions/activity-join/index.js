// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu"})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  debugger
  const wxContext = cloud.getWXContext()
  await db.collection('activity-data').add({
    data: {
      openid: wxContext.OPENID,
      ...event
    }
  }).then(res => {
    result = res
  })

  return result
}