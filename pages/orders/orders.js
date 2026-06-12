// pages/orders/orders.js - 工单列表页（工人和管理员共用）
const app = getApp()
const orderModel = require('../../models/order')
const util = require('../../utils/util')
const constants = require('../../utils/constants')

Page({
  data: {
    // 状态筛选
    statusTabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待处理' },
      { key: 'processing', label: '处理中' },
      { key: 'completed', label: '已完成' }
    ],
    activeTab: 'all',
    // 工单列表
    orders: [],
    // 加载状态
    loading: false,
    // 是否管理员
    isAdmin: false
  },

  onLoad() {
    this.setData({ isAdmin: app.isAdmin() })
    this.loadOrders()
  },

  onShow() {
    // 每次显示时刷新列表
    this.loadOrders()
  },

  // 切换筛选标签
  onTabChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ activeTab: key })
    this.loadOrders()
  },

  // 加载工单列表
  loadOrders() {
    this.setData({ loading: true })

    const { activeTab } = this.data
    const status = activeTab !== 'all' ? activeTab : null

    // 工人只看自己的工单，管理员看全部
    var userInfo = app.globalData.userInfo
    var submitterId = app.isAdmin() ? null : (userInfo ? userInfo.id : null)

    var orders = orderModel.getOrdersByStatus(status, submitterId)

    // 附加格式化的时间显示
    var list = orders.map(function(o) {
      var statusInfo = constants.STATUS_MAP[o.status]
      return {
        id: o.id,
        deviceName: o.deviceName,
        deviceCode: o.deviceCode,
        workerId: o.workerId,
        faultDesc: o.faultDesc,
        images: o.images,
        status: o.status,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        submitterName: o.submitterName,
        submitterId: o.submitterId,
        aiFaultType: o.aiFaultType,
        aiUrgency: o.aiUrgency,
        aiSuggestion: o.aiSuggestion,
        aiConfidence: o.aiConfidence,
        statusLog: o.statusLog,
        statusLabel: statusInfo ? statusInfo.label : '未知',
        statusColor: statusInfo ? statusInfo.color : '#999',
        timeText: util.formatRelativeTime(o.createdAt)
      }
    })

    this.setData({ orders: list, loading: false })
  },

  // 点击工单卡片
  onOrderTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`
    })
  }
})
