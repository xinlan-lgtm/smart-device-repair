// utils/constants.js - 常量定义

// 工单状态枚举
const ORDER_STATUS = {
  PENDING: 'pending',         // 待处理
  PROCESSING: 'processing',   // 处理中
  COMPLETED: 'completed',     // 已完成
  VERIFIED: 'verified'        // 已验收
}

// 状态显示映射
const STATUS_MAP = {
  pending: { label: '待处理', color: '#F59E0B' },
  processing: { label: '处理中', color: '#3B82F6' },
  completed: { label: '已完成', color: '#10B981' },
  verified: { label: '已验收', color: '#059669' }
}

// 角色枚举
const ROLE = {
  WORKER: 'worker',
  ADMIN: 'admin',
  INSPECTOR: 'inspector'
}

// 紧急程度枚举
const URGENCY_LEVEL = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  CRITICAL: '紧急'
}

// 紧急程度颜色映射
const URGENCY_COLOR = {
  '低': '#10B981',
  '中': '#F59E0B',
  '高': '#F97316',
  '紧急': '#EF4444'
}

// DeepSeek API 配置
const DEEPSEEK_CONFIG = {
  BASE_URL: 'https://api.deepseek.com',
  MODEL: 'deepseek-chat',
  // API Key - 生产环境请勿将Key写在前端代码中
  API_KEY: 'sk-cbf4c94ece354b46b73fe79dcb2a3dfe'
}

// 图片上传限制
const IMAGE_LIMIT = {
  MAX_COUNT: 3,              // 最多3张
  MAX_SIZE: 2 * 1024 * 1024  // 单张最大2MB
}

module.exports = {
  ORDER_STATUS,
  STATUS_MAP,
  ROLE,
  URGENCY_LEVEL,
  URGENCY_COLOR,
  DEEPSEEK_CONFIG,
  IMAGE_LIMIT
}
