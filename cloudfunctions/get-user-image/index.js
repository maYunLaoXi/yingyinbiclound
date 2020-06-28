// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu" })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { pageSize = 20, page = 1, collection = 'photographyClass' }  = event;
  debugger
  
  const where = { openid: wxContext.OPENID }

  const totalSizeRes = await db.collection(collection).where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)

  const result = await db.collection(collection)
  .orderBy('uploadTime', 'desc') // 排序条件，对uploadTime字段进行desc(降序：越大越靠前)
  .where(where)
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .get()
debugger
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
  debugger
  if(!data.length) return data
  const res = []
  data.forEach(item => {
    if(!item.fileID && item.photo){
      item.fileID = item.photo
    }
    res.push({
      _id: item._id,
      fileID: item.fileID[0],
      share: item.share,
      start: item.start
    })
  })
  return res
}