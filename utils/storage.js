// utils/storage.js - 本地存储管理

// 存储Key常量
const KEYS = {
  USER_INFO: 'userInfo',
  ORDERS: 'orders',
  ORDER_SEQ: 'orderSeq'
}

// 读取
function get(key) {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : null
  } catch (e) {
    console.error('Storage get error:', e)
    return null
  }
}

// 写入
function set(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

// 删除
function remove(key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.error('Storage remove error:', e)
  }
}

// 清除全部
function clearAll() {
  try {
    wx.clearStorageSync()
  } catch (e) {
    console.error('Storage clear error:', e)
  }
}

module.exports = {
  KEYS,
  get,
  set,
  remove,
  clearAll
}
