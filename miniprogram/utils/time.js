// 对时间有处理

// 一天的毫秒数
const secondsOfMinute = 60;
const secondsOfHour = 60 * secondsOfMinute;
const secondsOfDay = 24 * secondsOfHour;
const secondsOfMonth = 30 * secondsOfDay;
const secondsOfYear = 12 * secondsOfMonth;
const millisecondsOfDay = 1000 * secondsOfDay;
const now = new Date()

/**
 * 返回年月日的数据
 * @param {String} timeStr 接口返回的时间 
 * @param {*} forMat 规则
 */
export const format = (timeStr, forMat) => {
  const time = new Date(timeStr)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  const h = time.getHours()
  const min = time.getMinutes()
  const s = time.getSeconds()
  let result = `${y}年${m}月${d}`
  if(!forMat) result;
}
/**
 * 格式化为可读时间
 *
 * 秒前
 * 分钟前
 * 小时前
 * 天前
 * 个月前
 * 年前
 *
 * @param time
 * @returns {string}
 */
export const readableTime = time => {
  if (!time) return '';

  // ios 兼容
  // const date = new Date(time.replace(/-/g, '/'));
  const date = new Date(time);
  const current = new Date();

  const distance = current.getTime() - date.getTime();
  const seconds = Math.floor(distance / 1000);

  if (seconds < secondsOfMinute) return `${seconds}秒前`;
  if (seconds < secondsOfHour)
    return `${Math.floor(seconds / secondsOfMinute)}分钟前`;
  if (seconds < secondsOfDay)
    return `${Math.floor(seconds / secondsOfHour)}小时前`;
  if (seconds < secondsOfMonth)
    return `${Math.floor(seconds / secondsOfDay)}天前`;
  if (seconds < secondsOfYear)
    return `${Math.floor(seconds / secondsOfMonth)}个月前`;
  return `${Math.floor(seconds / secondsOfYear)}年前`;
};

/**
 * 距上次执行的时间
 * 
 * @param {String} name storage 的名称
 */
export const tiemFromLast = (name) => {
  if(!name) return 0;
  const value = wx.getStorageSync('key')
  if(!value){
    wx.setStorage({
      key: name,
      data: now
    })
    return 0
  }
  const nowTime = now.getTime()
  const lastTime = new Date(value).getTime
  return Math.round(((nowTime - lastTime) / 24 * 60 * 60 * 1000) * 100) / 100
}