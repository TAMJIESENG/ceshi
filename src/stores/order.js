import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/utils/api'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const loading = ref(false)
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })

  const generateOrderNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const timestamp = Date.now().toString().slice(-6)
    return `ORD${year}${month}${day}${timestamp}`
  }

  const createOrder = async (orderData) => {
    try {
      loading.value = true
      
      // 获取当前用户信息
      const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
      if (!currentUser.id) {
        return {
          success: false,
          message: '请先登录'
        }
      }
      
      const orderNumber = generateOrderNumber()
      const { cardType, quantity, paymentMethod } = orderData
      
      const priceMap = {
        monthly: 29.90,
        quarterly: 79.90,
        yearly: 299.90
      }
      
      const baseUnitPrice = priceMap[cardType]
      
      // 应用VIP折扣
      const { useVipStore } = await import('@/stores/vip')
      const vipStore = useVipStore()
      const discountInfo = vipStore.calculateDiscountPrice(baseUnitPrice, currentUser.level)
      
      const unitPrice = discountInfo.finalPrice
      const totalAmount = unitPrice * quantity
      const totalSavings = discountInfo.savings * quantity
      
      // 检查可用卡密库存
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const cardTypeName = getCardTypeName(cardType)
      const availableCards = allCards.filter(card => 
        card.cardType === cardTypeName && 
        card.status === 'unused' && 
        !card.purchasedBy
      )
      
      if (availableCards.length < quantity) {
        return {
          success: false,
          message: `库存不足，当前只有 ${availableCards.length} 张${cardTypeName}可用`
        }
      }
      
      const order = {
        id: Date.now(),
        orderNumber,
        userId: currentUser.id,
        username: currentUser.username,
        userLevel: currentUser.level,
        cardType,
        quantity,
        originalUnitPrice: baseUnitPrice,
        unitPrice,
        totalAmount,
        discount: discountInfo.discount,
        totalSavings,
        paymentMethod,
        status: 'pending',
        createTime: new Date().toLocaleString('zh-CN'),
        paymentTime: null,
        completedTime: null,
        cardNumbers: [] // 存储分配给订单的卡密号
      }
      
      // 保存到 localStorage
      const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      allOrders.unshift(order)
      localStorage.setItem('all_orders', JSON.stringify(allOrders))
      
      orders.value.unshift(order)
      
      return {
        success: true,
        message: '订单创建成功',
        data: order
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '创建订单失败'
      }
    } finally {
      loading.value = false
    }
  }

  const payOrder = async (orderId, paymentData) => {
    try {
      // 从localStorage和内存中查找订单
      let allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      const orderIndex = allOrders.findIndex(order => String(order.id) === String(orderId))
      
      if (orderIndex === -1) {
        return {
          success: false,
          message: '订单不存在'
        }
      }
      
      const order = allOrders[orderIndex]
      
      if (order.status !== 'pending') {
        return {
          success: false,
          message: '订单状态不允许支付'
        }
      }
      
      // 检查用户余额（如果使用余额支付）
      if (paymentData.paymentMethod === 'balance') {
        const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
        const userBalance = currentUser.balance || 0
        
        if (userBalance < order.totalAmount) {
          return {
            success: false,
            message: '余额不足，请充值后再试'
          }
        }
        
        // 扣除用户余额
        const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
        const userIndex = allUsers.findIndex(u => String(u.id) === String(currentUser.id))
        
        if (userIndex !== -1) {
          allUsers[userIndex].balance = userBalance - order.totalAmount
          localStorage.setItem('all_users', JSON.stringify(allUsers))
          
          // 更新当前用户数据
          currentUser.balance = allUsers[userIndex].balance
          localStorage.setItem('user_data', JSON.stringify(currentUser))
          
          // 记录余额变更
          const balanceHistory = JSON.parse(localStorage.getItem('balance_history') || '[]')
          balanceHistory.push({
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            oldBalance: userBalance,
            newBalance: currentUser.balance,
            change: -order.totalAmount,
            reason: `订单支付：${order.orderNumber}`,
            operatorType: 'system',
            createTime: new Date().toLocaleString('zh-CN')
          })
          localStorage.setItem('balance_history', JSON.stringify(balanceHistory))
        }
      }
      
      // 分配卡密给用户
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const cardTypeName = getCardTypeName(order.cardType)
      const availableCards = allCards.filter(card => 
        card.cardType === cardTypeName && 
        card.status === 'unused' && 
        !card.purchasedBy
      )
      
      if (availableCards.length < order.quantity) {
        return {
          success: false,
          message: '库存不足，无法完成支付'
        }
      }
      
      // 分配卡密
      const assignedCards = availableCards.slice(0, order.quantity)
      const purchaseTime = new Date().toLocaleString('zh-CN')
      
      assignedCards.forEach(card => {
        const cardIndex = allCards.findIndex(c => c.id === card.id)
        if (cardIndex !== -1) {
          allCards[cardIndex].status = 'sold'
          allCards[cardIndex].purchasedBy = order.userId
          allCards[cardIndex].purchaser = order.username
          allCards[cardIndex].purchaseTime = purchaseTime
        }
      })
      
      localStorage.setItem('all_cards', JSON.stringify(allCards))
      
      // 更新订单状态
      order.status = 'completed'
      order.paymentTime = purchaseTime
      order.completedTime = purchaseTime
      order.paymentMethod = paymentData.paymentMethod
      order.cardNumbers = assignedCards.map(card => card.cardNumber)
      
      // 更新localStorage中的订单
      allOrders[orderIndex] = order
      localStorage.setItem('all_orders', JSON.stringify(allOrders))
      
      // 更新内存中的订单
      const memoryOrderIndex = orders.value.findIndex(o => String(o.id) === String(orderId))
      if (memoryOrderIndex !== -1) {
        orders.value[memoryOrderIndex] = { ...order }
      }
      
      return {
        success: true,
        message: `支付成功！已为您分配 ${order.quantity} 张${cardTypeName}`,
        data: order
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '支付失败'
      }
    }
  }

  const fetchOrders = async (params = {}) => {
    try {
      loading.value = true
      
      // 从 localStorage 获取订单数据
      const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
      
      // 根据用户权限过滤订单
      let filteredOrders = allOrders
      if (currentUser.role !== 'admin') {
        // 普通用户只能看到自己的订单
        filteredOrders = allOrders.filter(order => String(order.userId) === String(currentUser.id))
      }
      
      orders.value = filteredOrders
      pagination.currentPage = params.page || 1
      pagination.pageSize = params.limit || 10
      pagination.total = filteredOrders.length
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: '获取订单列表失败'
      }
    } finally {
      loading.value = false
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      // 从localStorage和内存中查找订单
      let allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      const orderIndex = allOrders.findIndex(order => String(order.id) === String(orderId))
      
      if (orderIndex === -1) {
        return {
          success: false,
          message: '订单不存在'
        }
      }
      
      const order = allOrders[orderIndex]
      
      if (order.status !== 'pending') {
        return {
          success: false,
          message: '只能取消待支付的订单'
        }
      }
      
      // 检查权限：普通用户只能取消自己的订单
      const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
      if (currentUser.role !== 'admin' && String(order.userId) !== String(currentUser.id)) {
        return {
          success: false,
          message: '无权取消此订单'
        }
      }
      
      order.status = 'cancelled'
      order.cancelTime = new Date().toLocaleString('zh-CN')
      
      // 更新localStorage中的订单
      allOrders[orderIndex] = order
      localStorage.setItem('all_orders', JSON.stringify(allOrders))
      
      // 更新内存中的订单
      const memoryOrderIndex = orders.value.findIndex(o => String(o.id) === String(orderId))
      if (memoryOrderIndex !== -1) {
        orders.value[memoryOrderIndex] = { ...order }
      }
      
      return {
        success: true,
        message: '订单已取消'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '取消订单失败'
      }
    }
  }

  const getOrderStatusType = (status) => {
    const typeMap = {
      pending: 'warning',
      paid: 'info',
      completed: 'success',
      cancelled: 'danger',
      refunded: 'info'
    }
    return typeMap[status] || 'info'
  }

  const getOrderStatusText = (status) => {
    const textMap = {
      pending: '待支付',
      paid: '已支付',
      completed: '已完成',
      cancelled: '已取消',
      refunded: '已退款'
    }
    return textMap[status] || '未知'
  }

  const getCardTypeName = (type) => {
    const typeMap = {
      monthly: '月卡',
      quarterly: '季卡',
      yearly: '年卡'
    }
    return typeMap[type] || type
  }

  const getPaymentMethodName = (method) => {
    const methodMap = {
      balance: '余额支付',
      alipay: '支付宝',
      wechat: '微信支付',
      bank: '银行卡'
    }
    return methodMap[method] || method
  }

  const calculateOrderStats = () => {
    const stats = {
      totalOrders: orders.value.length,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalAmount: 0,
      todayOrders: 0,
      todayAmount: 0
    }
    
    const today = new Date().toDateString()
    
    orders.value.forEach(order => {
      switch (order.status) {
        case 'pending':
          stats.pendingOrders++
          break
        case 'completed':
          stats.completedOrders++
          stats.totalAmount += order.totalAmount
          break
        case 'cancelled':
          stats.cancelledOrders++
          break
      }
      
      const orderDate = new Date(order.createTime).toDateString()
      if (orderDate === today) {
        stats.todayOrders++
        if (order.status === 'completed') {
          stats.todayAmount += order.totalAmount
        }
      }
    })
    
    return stats
  }

  const exportOrders = (orderList) => {
    const csvContent = [
      ['订单号', '卡密类型', '数量', '单价', '总金额', '支付方式', '状态', '创建时间', '支付时间'].join(','),
      ...orderList.map(order => [
        order.orderNumber,
        getCardTypeName(order.cardType),
        order.quantity,
        order.unitPrice,
        order.totalAmount,
        getPaymentMethodName(order.paymentMethod),
        getOrderStatusText(order.status),
        order.createTime,
        order.paymentTime || ''
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    orders,
    loading,
    pagination,
    createOrder,
    payOrder,
    fetchOrders,
    cancelOrder,
    getOrderStatusType,
    getOrderStatusText,
    getCardTypeName,
    getPaymentMethodName,
    calculateOrderStats,
    exportOrders
  }
})