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
    // 复查员专用Tab
    inspectorTabs: [
      { key: 'review', label: '待复查' },
      { key: 'mine', label: '我的报修' }
    ],
    inspectorActiveTab: 'review',
    // 工单列表
    orders: [],
    // 加载状态
    loading: false,
    // 是否管理员
    isAdmin: false,
    // 是否复查员
    isInspector: false
  },

  onLoad() {
    this.setData({
      isAdmin: app.isAdmin(),
      isInspector: app.isInspector()
    })
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  // 切换筛选标签（工人/管理员）
  onTabChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ activeTab: key })
    this.loadOrders()
  },

  // 切换复查员Tab
  onInspectorTabChange(e) {
    var key = e.currentTarget.dataset.key
    this.setData({ inspectorActiveTab: key })
    this.loadOrders()
  },

  // 格式化工单列表项
  formatOrderList(orders) {
    var that = this
    return orders.map(function(o) {
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
        returnNote: o.returnNote,
        statusLabel: statusInfo ? statusInfo.label : '未知',
        statusColor: statusInfo ? statusInfo.color : '#999',
        timeText: util.formatRelativeTime(o.createdAt)
      }
    })
  },

  // 加载工单列表
  loadOrders() {
    var userInfo = app.globalData.userInfo
    var isAdmin = app.isAdmin()
    var isInspector = app.isInspector()

    // 复查员：两个Tab——待复查(completed) / 我的报修
    if (isInspector) {
      var inspectorTab = this.data.inspectorActiveTab
      var orders
      if (inspectorTab === 'mine') {
        // 复查员自己提交的工单
        orders = orderModel.getOrdersByStatus(null, userInfo ? userInfo.id : null)
      } else {
        // 待复查：所有状态为"已完成"的工单
        orders = orderModel.getOrdersByStatus('completed', null)
      }
      var list = this.formatOrderList(orders)
      this.setData({ orders: list })
      return
    }

    const { activeTab } = this.data
    const status = activeTab !== 'all' ? activeTab : null

    // 工人只看自己的工单，管理员看全部
    var submitterId = isAdmin ? null : (userInfo ? userInfo.id : null)

    var orders = orderModel.getOrdersByStatus(status, submitterId)
    var list = this.formatOrderList(orders)

    this.setData({ orders: list })
  },

  // 点击工单卡片
  onOrderTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`
    })
  }
})
