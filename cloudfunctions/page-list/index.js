// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-zgtnu"
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async ({ collection, pageSize = 10, page = 1, className }, context) => {
  console.log(wxContext)
  const where = { class: className }
  const totalSizeRes = await db.collection(collection).where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)
  const all = await db.collection(collection).orderBy('uploadTime', 'desc').where(where).skip(
    (page - 1) * pageSize
  ).limit(pageSize).get()
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
        openid: item.openid
      }).get().then(res => {
        item.userInfo = res.data[0]
        resolve(res)
      })
    }))
  })
  return Promise.all(allArr)
}