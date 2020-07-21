/**
 * 生成随机字符串
 */
export const randomStr = () => {
  return Math.random().toString(36).substr(2,15)
}
/**
 * 当前字符串是否在yingyinbi.com域名下
 * @param {String}} url 
 */
export const matchQiniuUrl = url => {
  let reg = new RegExp('yingyinbi.com')
  return reg.test(url)
}
/**
 * 七牛云图片基本处理
 * @param {String}} url 
 */
export const imageView = (url) => {
  return url + '?imageView2/2/w/200/h/270'
}
/**
 * @Author: 梁云辉
 * @Version: 1.0
 * @Date: 2020-07-14
 * @Description: 将数组切成指定长度的组组合集
 * @param {Array} arr 原数组（长数组）
 * @param {Number} num 数组的长度
 */
export const slice2sort = (arr, num) => {
  if(!arr || !Array.isArray(arr))return []
  if(!num) return arr
  let result = []
  for(let i = 0;i < arr.length; i += num) {
    result.push(arr.slice(i, i + num))
  }
  console.log(result)
  return result
}