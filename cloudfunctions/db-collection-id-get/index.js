// 跟椐collection和_id查找数据
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { collection, _id } = event
  return db.collection(collection).doc(_id).get()
}