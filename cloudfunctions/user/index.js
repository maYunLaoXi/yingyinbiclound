// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu"})

const db = cloud.database();

// 云函数入口函数
exports.main = async (data, context) => {
  let isUser = false
  const { update, add } = data
  const wxContext = cloud.getWXContext()
 
  await db.collection('user').where({
    openid: wxContext.OPENID
  }).get().then(res => {
    if(res.data.length)isUser = res.data[0]
  })
  if(isUser){
    // 老用户
    debugger
    if(update){
      await db.collection('user').where({ openid: wxContext.OPENID }).update({ ...update }).then(res => {
        debugger
      })
    }
    if(add){
      await db.collection('user').where({ openid: wxContext.OPENID }).set({
        data: {a: 'aaaa'},
        success: () => {
          debugger
        }
      })
    }
  }else {
    // 新用户
    if(add){
      const userInfo = add
      await db.collection('user').add({
        data: {
          ...userInfo,
          openid: wxContext.OPENID,
        }
      })
    }
  }
  return { openid: wxContext.OPENID}
}