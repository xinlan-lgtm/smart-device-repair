// pages/ai-result/ai-result.js - AI分析结果页
const app = getApp()
const orderModel = require('../../models/order')
const constants = require('../../utils/constants')

Page({
  data: {
    // AI分析结果
    aiResult: null,
    // 报修数据（从上一页传入）
    repairData: null,
    // 提交中
    submitting: false
  },

  onLoad(options) {
    // 解析传入的AI分析结果和报修数据
    if (options.aiResult) {
      try {
        var aiResult = JSON.parse(decodeURIComponent(options.aiResult))
        // 附加颜色和显示文本
        aiResult.urgencyColor = constants.URGENCY_COLOR[aiResult.urgency] || '#999'
        aiResult.confidencePercent = Math.round((aiResult.confidence || 0) * 100)
        this.setData({ aiResult: aiResult })
      } catch (e) {
        console.error('AI结果解析失败', e)
        wx.showToast({ title: '数据解析失败', icon: 'none' })
      }
    }
    if (options.repairData) {
      try {
        this.setData({ repairData: JSON.parse(decodeURIComponent(options.repairData)) })
      } catch (e) {
        console.error('报修数据解析失败', e)
      }
    }
  },

  // 确认并提交工单
  onConfirmSubmit() {
    var that = this
    this.setData({ submitting: true })

    var userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.showToast({ title: '请先选择身份', icon: 'none' })
      this.setData({ submitting: false })
      return
    }

    var repairData = this.data.repairData
    var aiResult = this.data.aiResult

    // 创建工单，附带AI分析结果
    orderModel.createOrder({
      deviceName: repairData.deviceName,
      deviceCode: repairData.deviceCode,
      workerId: repairData.workerId,
      faultDesc: repairData.faultDesc,
      images: repairData.images,
      submitterName: userInfo.name,
      submitterId: userInfo.id,
      aiFaultType: aiResult.faultType || '',
      aiUrgency: aiResult.urgency || '',
      aiSuggestion: aiResult.suggestion || '',
      aiConfidence: aiResult.confidence || 0
    })

    that.setData({ submitting: false })

    wx.showToast({
      title: '报修提交成功',
      icon: 'success',
      duration: 1500,
      success: function() {
        // 通过页面栈找到repair页面，清空表单数据
        setTimeout(function() {
          var pages = getCurrentPages()
          // 倒序查找 repair 页面
          for (var i = pages.length - 2; i >= 0; i--) {
            if (pages[i].route === 'pages/repair/repair') {
              pages[i].setData({
                deviceName: '',
                deviceCode: '',
                workerId: '',
                faultDesc: '',
                images: [],
                canSubmit: false
              })
              break
            }
          }
          wx.navigateBack()
        }, 1500)
      }
    })
  },

  // 返回修改
  onBackToEdit() {
    wx.navigateBack()
  }
})
