// pages/mine/mine.js - 个人中心页
const app = getApp()

Page({
  data: {
    userInfo: null,
    isAdmin: false,
    isInspector: false
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    var userInfo = app.globalData.userInfo
    this.setData({
      userInfo: userInfo,
      isAdmin: app.isAdmin(),
      isInspector: app.isInspector()
    })
  },

  // 切换身份
  onSwitchRole() {
    wx.showModal({
      title: '切换身份',
      content: '切换身份将重新选择角色，确认继续？',
      success: (res) => {
        if (res.confirm) {
          app.clearUser()
          wx.redirectTo({ url: '/pages/login/login' })
        }
      }
    })
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于',
      content: '智能设备报修系统 v1.0\n面向工厂场景的设备故障报修与处理平台',
      showCancel: false
    })
  }
})
