// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { _id, collection = 'photography-class', start = [] } = event; 
  // addToSet 除非数组中已存在该元素，否则添加进数组。
  // pull 将数组中所有匹配给定值或查询条件的元素都移除掉
  let method = start.includes(wxContext.OPENID) ? 'pull' : 'addToSet'
  const res = await db.collection(collection).doc(_id).update({
    data: {
      start: _[method](wxContext.OPENID)
    }
  })
  let resStart = []
  if(method === 'pull') resStart = start.filter(item => item !== wxContext.OPENID)
  else resStart = [wxContext.OPENID, ...start];

  return {...res, start: resStart,}
}