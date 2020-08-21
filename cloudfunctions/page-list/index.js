// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async ({ collection, pageSize = 10, page = 1, className }, context) => {
  debugger
  const where = { class: className }
  const totalSizeRes = await db.collection(collection).where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)
  const all = await db.collection(collection)
  .orderBy('createTime', 'desc') // 排序条件，对uploadTime字段进行desc(降序：越大越靠前)
  .where(where)
  .skip( // 跳过条件中的第(page -1) * pageSize 条, 从它的下一条开始
    (page - 1) * pageSize
  )
  .limit(pageSize) // 限制返回数量为 pageSize 条
  .get()
  debugger
  await getUserInfo(all.data)
  return {
    data: all.data,
    page,
    pageSize,
    totalSize,
    totalPage
  }
}

async function getUserInfo(data) {
  if(!data.length) return
  const allArr = []
  data.forEach(item => {
    allArr.push(new Promise((resolve, reject) => {
      db.collection('user').where({
        _openid: item._openid
      }).get().then(res => {
        item.userInfo = res.data[0]
        resolve(res)
      })
    }))
  })
  return Promise.all(allArr)
}