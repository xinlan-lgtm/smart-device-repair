// pages/order-detail/order-detail.js - 工单详情页
const app = getApp()

Page({
  data: {
    orderId: '',
    order: null,
    isAdmin: false,
    // 状态修改
    showStatusModal: false,
    selectedStatus: ''
  },

  onLoad(options) {
    const { id } = options
    this.setData({
      orderId: id,
      isAdmin: app.isAdmin()
    })
    this.loadOrderDetail()
  },

  // 加载工单详情
  loadOrderDetail() {
    // TODO: P6阶段实现 - 从本地存储查找工单
    wx.showToast({ title: '详情加载功能即将上线', icon: 'none' })
  },

  // 管理员 - 打开状态修改弹窗
  onShowStatusModal() {
    this.setData({ showStatusModal: true })
  },

  // 管理员 - 关闭状态修改弹窗
  onCloseStatusModal() {
    this.setData({ showStatusModal: false })
  },

  // 管理员 - 选择新状态
  onStatusSelect(e) {
    const status = e.currentTarget.dataset.status
    this.setData({ selectedStatus: status })
  },

  // 管理员 - 确认修改状态
  onConfirmStatus() {
    // TODO: P6阶段实现 - 更新工单状态
    this.setData({ showStatusModal: false })
  }
})
