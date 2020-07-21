/**
 * 获取当前用户上传过的活动图片信息，包括每期中所上传过的图片，和买家秀
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { page = 1, pageSize = 16, imageView = '' } = event

  // 查询所有活动
  const activities = await db.collection('activity').aggregate()
    .lookup({
      from: 'activity-data',
      localField: '_id',
      foreignField: 'activity_id',
      as: 'list'
    }).end()
  const result =  handleList(activities.list, imageView)
  return {
    data: result
  }
}

/**
 * 通过id将所参与过的活协分类
 * @param {Array} list 联表查询的数据
 * @param {String} imageView 七牛云图片URL的处理
 */
function handleList(list, imageView) {
  debugger
  if(!list || list.length === 0) return []
  list.forEach(item => {
    const newList = []
    item.list.forEach(ele => {
      const { activity_id, address, title, article, check, show, _id } = ele
      newList.push({
        activity_id,
        _id,
        article,
        title,
        show,
        check,
        address,
        photo: ele.photo[0]
      })
    })
    item.list = newList
  })
  return list
}