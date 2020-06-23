// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "development-zgtnu" })

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { pageSize = 20, page = 1 }  = event;
  const collection = 'photographyClass'
  const where = { openid: wxContext.OPENID }

  const totalSizeRes = await db.collection(collection).where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)

  const result = db.collection(collection).where(where)
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
      fileID: item.fileID[0],
      share: item.share,
      start: item.start
    })
  })
  return res
}