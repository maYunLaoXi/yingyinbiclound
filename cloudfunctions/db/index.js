// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({  env: "development-zgtnu" })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('photographyClass').where({
    portrait: _.all([
      _.elemMatch({
        share: _.eq(0)
      })
    ])
  }).get().then(res => {
    debugger
  })
  .catch(err => {
    debugger
  })
}