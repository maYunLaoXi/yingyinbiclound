// 文字安全鉴定

const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  const msg = event.msg
  
  let result = await cloud.openapi.security.msgSecCheck({
    content: msg
  })
  return result
}