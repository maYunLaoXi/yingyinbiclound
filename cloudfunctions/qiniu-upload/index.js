// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'development-zgtnu'})

const db = cloud.database()
const qiniu = require('qiniu')



// 云函数入口函数
exports.main = async (event, context) => {
  const key = await db.collection('account').doc('qiniukey').get()
  const { AccessKey, SecretKey } = key.data
  debugger
  const mac = new qiniu.auth.digest.Mac(AccessKey, SecretKey)
  const bucket = 'yinyingbi'
  const options = {
    scope: bucket,
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  const wxContext = cloud.getWXContext()

  return {
    uptoken: uploadToken,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}