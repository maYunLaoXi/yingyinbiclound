/**
 * 生成随机字符串
 */
export const randomStr = () => {
  return Math.random().toString(36).substr(2,15)
}
/**
 * 
 * @param {String}} url 当前字符串是否在yingyinbi.com域名下
 */
export const matchQiniuUrl = url => {
  let reg = new RegExp('yingyinbi.com')
  return reg.test(url)
}
/**
 * 
 * @param {String}} url 七牛云图片基本处理
 */
export const imageView = (url) => {
  return url + '?imageView2/2/w/200/h/270'
}