// pages/repair/repair.js - 提交报修页（工人端）
const app = getApp()
const orderModel = require('../../models/order')

Page({
  data: {
    // 表单数据
    deviceName: '',
    deviceCode: '',
    workerId: '',
    faultDesc: '',
    images: [],           // 本地临时图片路径数组
    // 表单校验
    canSubmit: false,
    // AI分析中
    analyzing: false,
    // AI分析结果
    aiResult: null
  },

  onLoad() {
    this.checkFormValid()
  },

  // 设备名称输入
  onDeviceNameInput(e) {
    this.setData({ deviceName: e.detail.value })
    this.checkFormValid()
  },

  // 设备编号输入
  onDeviceCodeInput(e) {
    this.setData({ deviceCode: e.detail.value })
    this.checkFormValid()
  },

  // 工号输入
  onWorkerIdInput(e) {
    this.setData({ workerId: e.detail.value })
    this.checkFormValid()
  },

  // 故障描述输入
  onFaultDescInput(e) {
    this.setData({ faultDesc: e.detail.value })
    this.checkFormValid()
  },

  // 图片选择/拍照
  onChooseImage() {
    const remain = 3 - this.data.images.length
    if (remain <= 0) {
      wx.showToast({ title: '最多上传3张图片', icon: 'none' })
      return
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({
          images: [...this.data.images, ...newImages]
        })
        this.checkFormValid()
      }
    })
  },

  // 删除图片
  onRemoveImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
    this.checkFormValid()
  },

  // 图片预览
  onPreviewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: this.data.images,
      current: url
    })
  },

  // 检查表单是否可提交
  checkFormValid() {
    const { deviceName, deviceCode, workerId, faultDesc, images } = this.data
    const canSubmit = !!deviceName.trim() && !!deviceCode.trim() && !!workerId.trim() && !!faultDesc.trim() && images.length > 0
    this.setData({ canSubmit })
  },

  // AI智能分析
  onAIAnalyze() {
    if (!this.data.canSubmit) return
    this.setData({ analyzing: true })
    // TODO: P4阶段实现 - 调用 DeepSeek API
    wx.showToast({ title: 'AI分析功能即将上线', icon: 'none' })
    this.setData({ analyzing: false })
  },

  // 直接提交（跳过AI分析）
  onSubmit() {
    if (!this.data.canSubmit) return

    const userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.showToast({ title: '请先选择身份', icon: 'none' })
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    const { deviceName, deviceCode, workerId, faultDesc, images } = this.data

    // 逐项校验
    if (!deviceName.trim()) {
      wx.showToast({ title: '请输入设备名称', icon: 'none' })
      return
    }
    if (!deviceCode.trim()) {
      wx.showToast({ title: '请输入设备编号', icon: 'none' })
      return
    }
    if (!workerId.trim()) {
      wx.showToast({ title: '请输入工号', icon: 'none' })
      return
    }
    if (!faultDesc.trim()) {
      wx.showToast({ title: '请填写故障说明', icon: 'none' })
      return
    }

    // 创建工单，存入本地storage
    orderModel.createOrder({
      deviceName: deviceName.trim(),
      deviceCode: deviceCode.trim(),
      workerId: workerId.trim(),
      faultDesc: faultDesc.trim(),
      images: images,
      submitterName: userInfo.name,
      submitterId: userInfo.id
    })

    // 清空表单
    this.setData({
      deviceName: '',
      deviceCode: '',
      workerId: '',
      faultDesc: '',
      images: [],
      canSubmit: false
    })

    wx.showToast({ title: '报修提交成功', icon: 'success' })
  }
})
