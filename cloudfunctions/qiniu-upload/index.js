// 云函数入口文件
const cloud = require('wx-server-sdk')
const { qiniuAK, qiniuSK } = require('../account')
const qiniu = require('qiniu')
const mac = new qiniu.auth.digest.Mac(qiniuAK, qiniuSK)
const bucket = 'yinyingbi'
const options = {
  scope: bucket,
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  console.log({uploadToken})
  const wxContext = cloud.getWXContext()
  debugger

  return {
    uptoken: uploadToken,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}