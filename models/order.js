// models/order.js - 工单数据操作（基于本地Storage模拟数据库）
var storage = require('../utils/storage')
var util = require('../utils/util')
var constants = require('../utils/constants')

// 获取全部工单
function getAllOrders() {
  return storage.get(storage.KEYS.ORDERS) || []
}

// 获取当前用户的工单
function getMyOrders(submitterId) {
  var orders = getAllOrders()
  return orders.filter(function(o) {
    return o.submitterId === submitterId
  })
}

// 根据状态筛选工单
function getOrdersByStatus(status, submitterId) {
  var orders = getAllOrders()
  if (status && status !== 'all') {
    orders = orders.filter(function(o) {
      return o.status === status
    })
  }
  if (submitterId) {
    orders = orders.filter(function(o) {
      return o.submitterId === submitterId
    })
  }
  return orders.sort(function(a, b) {
    return b.createdAt - a.createdAt
  })
}

// 根据ID查找工单
function getOrderById(id) {
  var orders = getAllOrders()
  return orders.find(function(o) {
    return o.id === id
  }) || null
}

// 创建新工单
function createOrder(data) {
  var orders = getAllOrders()

  // 生成当天序号
  var today = new Date()
  var todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('')

  var todayOrders = orders.filter(function(o) {
    return o.id.indexOf(todayStr) !== -1
  })
  var seq = todayOrders.length + 1

  var newOrder = {
    id: util.generateOrderId(seq),
    deviceName: data.deviceName,
    deviceCode: data.deviceCode,
    workerId: data.workerId || '',
    faultDesc: data.faultDesc,
    images: data.images || [],
    aiFaultType: data.aiFaultType || '',
    aiUrgency: data.aiUrgency || '',
    aiSuggestion: data.aiSuggestion || '',
    aiConfidence: data.aiConfidence || 0,
    status: constants.ORDER_STATUS.PENDING,
    statusLog: [{
      status: constants.ORDER_STATUS.PENDING,
      time: Date.now(),
      operator: data.submitterName
    }],
    processorNote: '',
    submitterName: data.submitterName,
    submitterId: data.submitterId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  orders.push(newOrder)
  storage.set(storage.KEYS.ORDERS, orders)
  return newOrder
}

// 更新工单状态
function updateOrderStatus(id, status, operator, note) {
  var orders = getAllOrders()
  var index = -1
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id === id) {
      index = i
      break
    }
  }
  if (index === -1) return null

  orders[index].status = status
  orders[index].updatedAt = Date.now()
  orders[index].statusLog.push({
    status: status,
    time: Date.now(),
    operator: operator
  })
  if (note !== undefined) {
    orders[index].processorNote = note
  }

  storage.set(storage.KEYS.ORDERS, orders)
  return orders[index]
}

// 删除工单
function deleteOrder(id) {
  var orders = getAllOrders()
  var filtered = orders.filter(function(o) {
    return o.id !== id
  })
  storage.set(storage.KEYS.ORDERS, filtered)
}

module.exports = {
  getAllOrders: getAllOrders,
  getMyOrders: getMyOrders,
  getOrdersByStatus: getOrdersByStatus,
  getOrderById: getOrderById,
  createOrder: createOrder,
  updateOrderStatus: updateOrderStatus,
  deleteOrder: deleteOrder
}
