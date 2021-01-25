// 审核通知
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('begin')
  switch (event.action) {
    case 'requestSubscribeTemplate': {
      return requestSubscribeTemplate(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    default :
      return false
  }

}

async function requestSubscribeTemplate(event) {
  return '251QI5xt5KCVLN9OrxMaEcKFTsy5cH1kyyQ_IKxvfKs'
}

async function sendSubscribeMessage(event) {
  debugger
  const { templateId, _openid } = event

  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: _openid,
    template_id: templateId,
    miniprogram_state: 'developer',
    page: 'pages/user/user',
    // 此处字段应修改为所申请模板所要求的字段
    data: {
      thing1: {
        value: '你的作品已通过，可在相应分类下看到',
      },
      date2: {
        value: getTime(),
      },
    }
  })

  return sendResult
}

function getTime() {
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()

  const h = date.getHours()
  const min = date.getMinutes()
  const s = date.getSeconds()

  return `${y}-${m}-${d} ${h}:${min}:${s}`
}