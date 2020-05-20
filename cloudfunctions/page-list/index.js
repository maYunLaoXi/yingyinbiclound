// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-zgtnu"
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async ({ collection, pageSize = 10, page = 1, where = {} }, context) => {
  const totalSizeRes = await db.collection(collection).where({
    portrait: _.exists(true)
  }).get({
    success: res => {
      debugger
    },
    fail: err => {
      debugger
    }
  })
  debugger
  // const totalSize = totalSizeRes.total
  // const totalPage = Math.ceil(totalSizeRes / pageSize)
  // debugger
  // const all = await db.collection(collection).where(where)
  // .skip(
  //   (page - 1) * pageSize
  // )
  // .limit(pageSize)
  // .get()
  // .then(res => {
  //   console.log({res})
  //   debugger
  // })

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}