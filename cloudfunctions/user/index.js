// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu"})

const db = cloud.database();

// 云函数入口函数
exports.main = async (data, context) => {
  let isUser = false
  const { info, getInfo } = data
  const wxContext = cloud.getWXContext()
  let result = await getUserInfo(wxContext)
  console.log(result)
  debugger
  // 如果是老用户
  if(result.data && result.data.length){
    isUser = true
    if(info){
      // 更新信息
      const newInfo = {
        ...result.data[0],
        ...info,
      }
      delete newInfo._id
      db.collection('user').where({ openid: wxContext.OPENID }).update({
        data: newInfo
      })
    }
    if(getInfo){
      result = {
        ...result.data[0],
        ...info,
      }
    }
  }else{
    // 新用户
    db.collection('user').add({
      data: {
        openid: wxContext.OPENID,
        ...add
      }
    })
    result = {
      openid: wxContext.OPENID,
      ...add
    }
  }
  return result
}
function getUserInfo(wxContext) {
  return db.collection('user').where({ openid: wxContext.OPENID }).get()
}
