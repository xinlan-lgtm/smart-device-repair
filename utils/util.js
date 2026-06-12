// utils/util.js - 通用工具函数

// 生成工单号: WO + 日期(8位) + 序号(3位)
function generateOrderId(seq) {
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('')
  const num = String(seq).padStart(3, '0')
  return 'BXD' + date + num
}

// 格式化时间戳到 yyyy-MM-dd HH:mm
function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const date = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-')
  const time = [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0')
  ].join(':')
  return date + ' ' + time
}

// 格式化相对时间
function formatRelativeTime(timestamp) {
  if (!timestamp) return ''
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return Math.floor(diff / minute) + '分钟前'
  if (diff < day) return Math.floor(diff / hour) + '小时前'
  if (diff < 7 * day) return Math.floor(diff / day) + '天前'
  return formatDateTime(timestamp)
}

// 图片路径转Base64
function imageToBase64(filePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: (res) => resolve(res.data),
      fail: reject
    })
  })
}

module.exports = {
  generateOrderId,
  formatDateTime,
  formatRelativeTime,
  imageToBase64
}
