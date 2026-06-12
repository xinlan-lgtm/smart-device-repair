// pages/login/login.js - 角色选择/登录页
const app = getApp()

Page({
  data: {
    selectedRole: '' // 'worker' | 'admin' | 'inspector'
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
    var roleNames = { worker: '工人', admin: '管理员', inspector: '复查员' }
    var roleIds = { worker: 'WK001', admin: 'ADM001', inspector: 'INS001' }
    const userInfo = {
      id: roleIds[selectedRole] || 'WK001',
      name: roleNames[selectedRole] || '工人',
      role: selectedRole
    }
    app.setUser(userInfo)
    // 复查员默认进入工单列表，工人和管理员进入报修页
    if (selectedRole === 'inspector') {
      wx.switchTab({ url: '/pages/orders/orders' })
    } else {
      wx.switchTab({ url: '/pages/repair/repair' })
    }
  }
})
