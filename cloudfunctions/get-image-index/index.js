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

  const res = await db.collection('photography-class')
  .aggregate() 
  .match(where)
  .sort({
    createTime: -1
  })
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .lookup({
    from: 'user',
    localField: '_openid',
    foreignField: '_openid',
    as: 'userInfo'
  })
  .end()
  const { list } = res
  setUserInfo(list)

  return {
    data: list,
    page,
    pageSize,
    totalPage
  }
}
function setUserInfo(list) {
  if(!list || !list.length) return;
  list.forEach(item => {
    const { userInfo = [{}]} = item
    item.userInfo = userInfo[0]
  });
}