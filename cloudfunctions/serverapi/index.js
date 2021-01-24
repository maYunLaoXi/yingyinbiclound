// 审核通知
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'requestSubscribeTemplate': {
      return requestSubscribeTemplate(event)
    }
  }

}

async function requestSubscribeTemplate(event) {
  return '251QI5xt5KCVLN9OrxMaEcKFTsy5cH1kyyQ_IKxvfKs'
}