/**
 * 获取当前用户上传过的活动图片信息，包括每期中所上传过的图片，和买家秀
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userOpenid = wxContext.OPENID
  const { page = 1, pageSize = 16, imageView = '' } = event

  // 查询所有活动 联表查询
  const activities = await db.collection('activity').aggregate()
    .lookup({
      from: 'activity-data',
      let: {
        act_id: '$_id',
        userOpenid,
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$activity_id', '$$act_id']),
          $.eq(['$_openid', '$$userOpenid'])
        ])))
        .done(),
      as: 'list'
    })
    .lookup({ // 用户作品可能有用于参于活动的
      from: 'photography-class',
      let: {
        act_id: '$_id',
        userOpenid,
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$activity.activity_id', '$$act_id']),
          $.eq(['$_openid', '$$userOpenid'])
        ])))
        .done(),
      as: 'listClass'
    })
    .lookup({ // 关联用户作品中的回收
      from: 'activity-receive',
      localField: 'listClass._id',
      foreignField: 'data_id',
      as: 'listClassReceive'
    })
    .lookup({ // 关联活动直接上传的回收，不知怎么加在上面的list里，记录在receiveData中再作处理
      from: 'activity-receive',
      localField: 'list._id',
      foreignField: 'data_id',
      as: 'receiveData'
    })
    .end()
  const result =  handleList(activities.list, imageView)
  const res = isEmpty(result) ? [] : result
  return {
    data: res
  }
}

/**
 * 通过id将所参与过的活协分类
 * @param {Array} list 联表查询的数据
 * @param {String} imageView 七牛云图片URL的处理
 */
function handleList(list, imageView) {
  if(!list || list.length === 0) return []
  list.forEach(item => {
    const { list: listOrg, listClass, receiveData, listClassReceive } = item
    let newList = [...mapData(listOrg, receiveData, false), ...mapData(listClass, listClassReceive, true)]

    item.list = newList.reverse()
    delete item.listClass
    delete item.receiveData
    delete item.listClassReceive
  })
  return list
}
function mapData(data, receive, isClass) {
  const list = []
  data.forEach(item => {
    const { title, article, check, show, _id, start } = item
    const address = isClass ? item.activity.address : item.address
    const activity_id = isClass ? item.activity.activity_id : item.activity_id
    const showData = receive.filter(showItem => showItem.data_id === _id)
    list.push({
      _id,
      start,
      article,
      title,
      show,
      check,
      photo: item.photo[0],
      showData,
      address,
      activity_id,
      fromPhotoClass: isClass,
    })
  })
  return list
}

function isEmpty(result) {
  if(!result.length) return 0
  const empty = []
  result.forEach(item => {
    if(!item.list)empty.push(1)
  })
  return empty.length === result.length
}