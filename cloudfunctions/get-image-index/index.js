// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { page, pageSize = 10 } = event
  const where = {
    pass: true,
    check: true,
  }
  
  const totalSizeRes = await db.collection('photography-class').where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)
  const result = await db.collection('photography-class')
  .orderBy('createTime', 'desc')
  .where(where)
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .get()
  // .aggregate()
  // .lookup({
  //   from: 'user',
  //   localField: '_openid',
  //   foreignField: '_openid',
  //   as: 'userInfo'
  // })
  // .end()
  await getUserInfo(result.data)
  return {
    data: result.data,
    page,
    pageSize,
    totalPage
  }
}
async function getUserInfo(data) {
  if(!data.length) return data
  const allArr = []
  data.forEach(item => {
    let _openid = item._openid || item.openid || ''
    allArr.push(new Promise((resolve, reject) => {
      db.collection('user').where({
        _openid
      }).get().then(res => {
        const [info] = res.data
        const { _id, avatarUrl, nickName, _openid } = info
        item.userInfo = { _id, avatarUrl, nickName, _openid }
        resolve(res)
      })
    }))
  })
  return Promise.all(allArr)
}