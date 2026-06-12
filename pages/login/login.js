// pages/login/login.js - 角色选择/登录页
const app = getApp()

Page({
  data: {
    selectedRole: '' // 'worker' | 'admin'
  },

  onLoad() {
    // 如果已登录，直接跳转到首页
    if (app.isLoggedIn()) {
      wx.switchTab({ url: '/pages/repair/repair' })
    }
  },

  // 选择角色
  onRoleSelect(e) {
    const role = e.currentTarget.dataset.role
    this.setData({ selectedRole: role })
  },

  // 确认登录
  onConfirm() {
    const { selectedRole } = this.data
    if (!selectedRole) {
      wx.showToast({ title: '请选择身份', icon: 'none' })
      return
    }
    const userInfo = {
      id: selectedRole === 'admin' ? 'ADM001' : 'WK001',
      name: selectedRole === 'admin' ? '管理员' : '工人',
      role: selectedRole
    }
    app.setUser(userInfo)
    wx.switchTab({ url: '/pages/repair/repair' })
  }
})
