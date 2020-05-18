// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu"})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    await db.collection('photographyClass')
    .where({
      _id: event._id
    }).update({
      data: {
        [event.class]: _.push(event.data)
      }
    })
  } catch(err) {
    console.log(err)
  }
  return { data: event }
}