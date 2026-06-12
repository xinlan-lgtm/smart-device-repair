// app.js - 智能设备报修系统 入口文件
App({
  globalData: {
    // 当前用户身份信息
    userInfo: null,
    // 用户角色：'worker' | 'admin' | null（未登录）
    role: null
  },

  onLaunch() {
    // 启动时读取本地存储的用户身份
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.role = userInfo.role
    }
  },

  // 检查是否已登录（已选择角色）
  isLoggedIn() {
    return !!this.globalData.userInfo
  },

  // 获取当前角色
  getRole() {
    return this.globalData.role
  },

  // 判断是否为管理员
  isAdmin() {
    return this.globalData.role === 'admin'
  },

  // 设置用户身份（登录/切换角色）
  setUser(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.role = userInfo.role
    wx.setStorageSync('userInfo', userInfo)
  },

  // 清除用户身份（退出登录）
  clearUser() {
    this.globalData.userInfo = null
    this.globalData.role = null
    wx.removeStorageSync('userInfo')
  }
})
