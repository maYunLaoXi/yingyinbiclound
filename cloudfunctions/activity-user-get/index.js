/**
 * 获取当前用户上传过的活动图片信息，包括每期中所上传过的图片，和买家秀
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  debugger
  const wxContext = cloud.getWXContext()
  const { page = 1, pageSize = 16 } = event

  const activityData = await db.collection('activity-data')
    .orderBy('uploadTime', 'desc') // 排序条件，对uploadTime字段进行desc(降序：越大越靠前)
    .where({ openid: wxContext.OPENID }).get()
  debugger
  let result = await showDbSearch(filterActiById(activityData.data), wxContext.OPENID)

  return {
    data: result
  }
}

/**
 * 通过id将所参与过的活协分类
 * @param {*} list activityData数据
 */
function filterActiById(list) {
  const jion = []
  const idList = []
  let actId

  list.forEach(item => {
    idList.push(item.activity_id)
  })
  actId = [...new Set(idList)]
  actId.forEach(item => {
    jion.push({
      activity_id: item,
      data: list.filter(ele => ele.activity_id === item)
    })
  })
  console.log({jion})
  return jion
}

async function showDbSearch(idList, openid) {
  debugger
  idList.forEach(item => {
    db.collection('activity-show')
    .orderBy('uploadTime', 'desc')
    .where({ openid, activity_id: item.activity_id }).get().then(res => {
      debugger

    })
  })
}