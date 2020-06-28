// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu"})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  debugger
  try {
    return await db.collection('photographyClass').add({
      data: {
        ...event.data,
        uploadTime: db.serverDate()
      }
    })
  } catch(err) {
    console.log(err)
  }
}