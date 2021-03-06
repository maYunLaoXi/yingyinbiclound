// 上传后的订阅
import { requestSubscribeMessage, WxshowToast } from './wxApiPromise'

export async function reqSubscribe(dataId, collection, subcribeTemplate = '251QI5xt5KCVLN9OrxMaEcKFTsy5cH1kyyQ_IKxvfKs') {
  if (!dataId || !collection) return
  const res = await requestSubscribeMessage(subcribeTemplate)
  let msg = '订阅失败'

  if (res[subcribeTemplate] === 'accept') {
    msg = '订阅成功'
    if (dataId) await updateDbSubscribleInfo(dataId, collection, subcribeTemplate)
  }
  await WxshowToast({
    icon: 'none',
    title: msg,
  })
  return res
}

export function updateDbSubscribleInfo(dataId, collection, subcribeTemplate) {
  const db = wx.cloud.database()
  db.collection(collection).doc(dataId).update({
    data: {
      subcrible: subcribeTemplate
    },
    success: function(res) {
      console.log(res.data)
    }
  })
}

// 给管理员发邮件
export const sendEmail = (collection, _id) => {
  return wx.cloud.callFunction({
    name: 'nodemailer',
    data: { collection, _id }
  })
}