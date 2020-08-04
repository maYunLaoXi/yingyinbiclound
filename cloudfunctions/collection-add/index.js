// 从集合中增加一条
const cloud = require('wx-server-sdk')

cloud.init({ env: 'development-zgtnu' })

// 云函数入口函数
exports.main = async (event, context) => {
  

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}