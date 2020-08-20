// 云函数入口文件
const cloud = require('wx-server-sdk')
const { isEqual } = require('lodash')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV})

const db = cloud.database();
// 云函数入口函数
exports.main = async (data, context) => {
  const { info = {}, getInfo } = data
  const wxContext = cloud.getWXContext()
  let result = await getUserInfo(wxContext)
  if(getInfo) return result.data[0]

  if(result.data && result.data.length){
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
    await db.collection('user').doc(_id).update({
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
