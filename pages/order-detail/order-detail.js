// pages/order-detail/order-detail.js - 工单详情页
const app = getApp()
const orderModel = require('../../models/order')
const util = require('../../utils/util')
const constants = require('../../utils/constants')

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
    const order = orderModel.getOrderById(this.data.orderId)
    if (!order) {
      wx.showToast({ title: '工单不存在', icon: 'none' })
      setTimeout(function() { wx.navigateBack() }, 1500)
      return
    }

    // 格式化时间
    order.createdText = util.formatDateTime(order.createdAt)
    order.updatedText = util.formatDateTime(order.updatedAt)
    var statusInfo = constants.STATUS_MAP[order.status]
    order.statusLabel = statusInfo ? statusInfo.label : '未知'
    order.statusColor = statusInfo ? statusInfo.color : '#999'

    // 格式化状态日志时间
    if (order.statusLog) {
      order.statusLog = order.statusLog.map(function(log) {
        log.timeText = util.formatDateTime(log.time)
        return log
      })
    }

    // 格式化图片列表供预览
    order.previewImages = order.images || []

    this.setData({ order: order })
  },

  // 图片预览
  onPreviewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: this.data.order.previewImages,
      current: url
    })
  },

  // 阻止事件冒泡（弹窗内部点击不关闭）
  prevent() {},

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
    const { selectedStatus, orderId } = this.data
    if (!selectedStatus) {
      wx.showToast({ title: '请选择状态', icon: 'none' })
      return
    }
    var userInfo = app.globalData.userInfo
    var operatorName = (userInfo && userInfo.name) ? userInfo.name : '管理员'
    var updated = orderModel.updateOrderStatus(orderId, selectedStatus, operatorName)
    if (updated) {
      this.setData({ showStatusModal: false })
      this.loadOrderDetail()
      wx.showToast({ title: '状态已更新', icon: 'success' })
    }
  }
})
