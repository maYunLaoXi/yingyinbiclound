// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'development-zgtnu' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { pageSize = 20, page = 1, collection = 'photography-class' }  = event;
  
  const where = { _openid: wxContext.OPENID }

  const totalSizeRes = await db.collection(collection).where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)

  const result = await db.collection(collection)
  .orderBy('createTime', 'desc') // 对createTime字段进行desc(降序：越大越靠前)
  .where(where)
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .get()
  const res = handleRes(result.data)
  return {
    data: res,
    page,
    pageSize,
    totalPage,
    totalSize
  }
}

function handleRes(data) {
  if(!data.length) return data
  const res = []
  data.forEach(item => {
    res.push({
      _id: item._id,
      photo: item.photo[0],
      share: item.share,
      start: item.start
    })
  })
  return res
}