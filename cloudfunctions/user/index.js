// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu"})

const db = cloud.database();

// 云函数入口函数
exports.main = async ({userInfo, isUser}, context) => {
  debugger
  const wxContext = cloud.getWXContext()
  
  if(isUser){
    await db.collection('user').where({
      openid: wxContext.OPENID
    }).addFields({
      ...userInfo,
    }).then(res => {
      debugger
    })
  }else {
    await db.collection('user').add({
      data: {
        ...userInfo,
        openid: wxContext.OPENID,
      }
    })
  }
  return { openid: wxContext.OPENID}
}