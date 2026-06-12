// pages/ai-result/ai-result.js - AI分析结果页
const app = getApp()

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
    // 接收从repair页传来的AI分析结果和报修数据
    // TODO: P4阶段实现 - 解析传入的数据
    const { aiResult, repairData } = options
    if (aiResult) {
      try {
        this.setData({ aiResult: JSON.parse(decodeURIComponent(aiResult)) })
      } catch (e) {
        console.error('AI结果解析失败', e)
      }
    }
    if (repairData) {
      try {
        this.setData({ repairData: JSON.parse(decodeURIComponent(repairData)) })
      } catch (e) {
        console.error('报修数据解析失败', e)
      }
    }
  },

  // 确认并提交工单
  onConfirmSubmit() {
    this.setData({ submitting: true })
    // TODO: P4阶段实现 - 将AI分析结果和报修数据合并保存
    wx.showToast({ title: '提交功能即将上线', icon: 'none' })
    this.setData({ submitting: false })
  },

  // 返回修改
  onBackToEdit() {
    wx.navigateBack()
  }
})
