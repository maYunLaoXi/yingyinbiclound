// 获取可在活动页中展示的作品（包括show）
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { collection = 'activity-data', pageSize = 9, page = 1, where }  = event;

  const totalSizeRes = await db.collection(collection).where(where).count()
  const totalSize = totalSizeRes.total
  const totalPage = Math.ceil(totalSize / pageSize)
  
  const all = await db.collection(collection)
  .aggregate()
  .match(where)
  .sort({ createTime: -1 })
  .skip((page -1) * pageSize)
  .limit(pageSize)
  .lookup({
    from: 'user',
    localField: '_openid',
    foreignField: '_openid',
    as: 'userInfo'
  })
  .end()
  const { list } = all
  setUserInfo(list)
  return {
    data: list,
    page,
    pageSize,
    totalSize,
    totalPage,
  }
}
function setUserInfo(list) {
  if(!list || !list.length) return;
  list.forEach(item => {
    const { userInfo = [{}]} = item
    item.userInfo = userInfo[0]
  });
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
        item.userInfo = res.data[0]
        resolve(res)
      })
    }))
  })
  return Promise.all(allArr)
}