// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = await db.collection('account').doc('qqmailsmtpcode').get()
  if (!data.code) return { errMsg: '错误的code'}
  const transporter = nodemailer.createTransport({
    service: 'QQ',
    port: 465,
    auth: {
      user: '593871583@qq.com',
      pass: data.code
    }
  })
  const mailOptions = {
    from: '593871583@qq.com',
    to: '593871583@qq.com',
    subject: '影音笔有用户上传作品啦！',
    html: template(event)
  }
  const res = await sendMail(transporter, mailOptions)

  return {
    msg: 'ok',
    data: res
  }
}
const sendMail = (transporter, options) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) reject(err)
      else resolve(info)
    })
  })
}
const template = (event) => {
  const { collection, _id } = event
  if (!collection || !_id) return `集合或id 未传${collection}====${_id}`
  const temp = `
    <h1>有用户上传作品啦</h1>
    <p>数据: ${collection}</p>
    <p>_id: ${_id}</p>
  `
  return temp
}