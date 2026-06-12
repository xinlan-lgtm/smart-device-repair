// pages/orders/orders.js - 工单列表页（工人和管理员共用）
const app = getApp()

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
    // TODO: P5阶段实现 - 从本地存储读取工单
    this.setData({ loading: false })
  },

  // 点击工单卡片
  onOrderTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`
    })
  }
})
