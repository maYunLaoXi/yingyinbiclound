// 云函数入口文件
const cloud = require('wx-server-sdk')
const { isEqual } = require('lodash')

cloud.init({ env: 'development-zgtnu'})

const db = cloud.database();
// 云函数入口函数
exports.main = async (data, context) => {
  debugger
  const { info = {}, getInfo } = data
  const wxContext = cloud.getWXContext()
  let result = await getUserInfo(wxContext)
  if(getInfo) return result.data[0]

  debugger
  if(result.data && result.data.length){
    debugger
    const dbInfo = result.data[0]
    // 如果是老用户
    if(isEqual(info, dbInfo)){
      return dbInfo
    }
    // 更新信息
    const newInfo = {
      ...dbInfo,
      ...info,
    }
    const _id = newInfo._id;

    delete newInfo._id
    db.collection('user').where({ openid: wxContext.OPENID }).update({
      data: newInfo
    })
    result = {
      _id,
      ...newInfo
    }
  }else{
    // 新用户
    db.collection('user').add({
      data: {
        _openid: wxContext.OPENID,
        ...info
      }
    })
    result = {
      _openid: wxContext.OPENID,
      ...info
    }
  }
  return result
}
function getUserInfo(wxContext) {
  return db.collection('user').where({ _openid: wxContext.OPENID }).get()
}
