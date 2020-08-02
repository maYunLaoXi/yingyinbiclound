// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'development-zgtnu' })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { collection = 'activity-data', _id, data, method } = event
  debugger
  let methodData = {}
  if(method){
    Object.keys(data).forEach(item => {
      methodData[item] = _[method](data[item])
    })
  }
  try {
    return await db.collection(collection).doc(_id).update({
      // data 传入需要局部更新的数据
      data: {
        ...methodData
      }
    })
  } catch(e) {
    console.error(e)
  }
}