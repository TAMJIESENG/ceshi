import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export const useVipStore = defineStore('vip', () => {
  const loading = ref(false)
  
  // VIP等级配置
  const vipLevels = reactive({
    普通: {
      name: '普通用户',
      level: 0,
      icon: 'user',
      color: '#909399',
      benefits: [
        '基础功能使用',
        '标准客服支持'
      ],
      discount: 0 // 无折扣
    },
    VIP: {
      name: 'VIP会员',
      level: 1,
      icon: 'crown',
      color: '#f39c12',
      benefits: [
        '享受所有基础功能',
        '9.5折优惠购买卡密',
        '优先客服支持',
        '专属VIP标识'
      ],
      discount: 0.05 // 95折
    },
    SVIP: {
      name: 'SVIP超级会员',
      level: 2,
      icon: 'diamond',
      color: '#9b59b6',
      benefits: [
        '享受所有VIP功能',
        '9折优惠购买卡密',
        '专属客服通道',
        '每月免费赠送卡密',
        '独享SVIP标识',
        '优先获得新功能体验'
      ],
      discount: 0.10 // 9折
    }
  })

  // VIP套餐价格配置
  const vipPackages = reactive({
    VIP: {
      monthly: {
        name: 'VIP月卡',
        duration: 30,
        originalPrice: 19.90,
        currentPrice: 19.90,
        description: '30天VIP会员权益'
      },
      quarterly: {
        name: 'VIP季卡',
        duration: 90,
        originalPrice: 49.90,
        currentPrice: 49.90,
        description: '90天VIP会员权益，更优惠'
      },
      yearly: {
        name: 'VIP年卡',
        duration: 365,
        originalPrice: 168.00,
        currentPrice: 168.00,
        description: '365天VIP会员权益，最划算'
      }
    },
    SVIP: {
      monthly: {
        name: 'SVIP月卡',
        duration: 30,
        originalPrice: 39.90,
        currentPrice: 39.90,
        description: '30天SVIP超级会员权益'
      },
      quarterly: {
        name: 'SVIP季卡',
        duration: 90,
        originalPrice: 99.90,
        currentPrice: 99.90,
        description: '90天SVIP超级会员权益'
      },
      yearly: {
        name: 'SVIP年卡',
        duration: 365,
        originalPrice: 328.00,
        currentPrice: 328.00,
        description: '365天SVIP超级会员权益，尊享特权'
      }
    }
  })

  // 计算用户当前VIP等级
  const getUserVipInfo = (userLevel) => {
    return vipLevels[userLevel] || vipLevels['普通']
  }

  // 计算商品实际价格（应用VIP折扣）
  const calculateDiscountPrice = (originalPrice, userLevel = '普通') => {
    const vipInfo = getUserVipInfo(userLevel)
    const discountAmount = originalPrice * vipInfo.discount
    const finalPrice = originalPrice - discountAmount
    
    return {
      originalPrice: parseFloat(originalPrice.toFixed(2)),
      discount: vipInfo.discount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      savings: parseFloat(discountAmount.toFixed(2))
    }
  }

  // 购买VIP
  const purchaseVip = async (vipType, packageType, paymentMethod) => {
    try {
      loading.value = true
      
      const userStore = useUserStore()
      const currentUser = userStore.user
      
      if (!currentUser) {
        return { success: false, message: '请先登录' }
      }

      const packageInfo = vipPackages[vipType][packageType]
      if (!packageInfo) {
        return { success: false, message: '套餐不存在' }
      }

      const totalAmount = packageInfo.currentPrice

      // 检查余额（如果使用余额支付）
      if (paymentMethod === 'balance') {
        const userBalance = userStore.getUserBalance(currentUser.id)
        if (userBalance < totalAmount) {
          return { success: false, message: '余额不足，请充值后再试' }
        }
      }

      // 创建VIP订单
      const vipOrder = {
        id: Date.now(),
        orderNumber: `VIP${Date.now().toString().slice(-8)}`,
        userId: currentUser.id,
        username: currentUser.username,
        vipType,
        packageType,
        packageName: packageInfo.name,
        duration: packageInfo.duration,
        amount: totalAmount,
        paymentMethod,
        status: 'pending',
        createTime: new Date().toLocaleString('zh-CN')
      }

      // 保存VIP订单
      const vipOrders = JSON.parse(localStorage.getItem('vip_orders') || '[]')
      vipOrders.unshift(vipOrder)
      localStorage.setItem('vip_orders', JSON.stringify(vipOrders))

      // 如果使用余额支付，立即处理支付
      if (paymentMethod === 'balance') {
        const payResult = await processVipPayment(vipOrder.id, paymentMethod)
        return payResult
      }

      return {
        success: true,
        message: 'VIP订单创建成功，请完成支付',
        data: vipOrder
      }
    } catch (error) {
      return { success: false, message: error.message || '购买失败' }
    } finally {
      loading.value = false
    }
  }

  // 处理VIP支付
  const processVipPayment = async (orderId, paymentMethod) => {
    try {
      const vipOrders = JSON.parse(localStorage.getItem('vip_orders') || '[]')
      const orderIndex = vipOrders.findIndex(order => order.id === orderId)
      
      if (orderIndex === -1) {
        return { success: false, message: '订单不存在' }
      }

      const order = vipOrders[orderIndex]
      const userStore = useUserStore()
      const currentUser = userStore.user

      // 扣除余额
      const deductResult = await userStore.deductBalance(
        currentUser.id, 
        order.amount, 
        `购买${order.packageName}`
      )

      if (!deductResult.success) {
        return deductResult
      }

      // 更新用户VIP等级
      const result = await upgradeUserVip(currentUser.id, order.vipType, order.duration)
      if (!result.success) {
        return result
      }

      // 更新订单状态
      order.status = 'completed'
      order.paymentTime = new Date().toLocaleString('zh-CN')
      order.completedTime = order.paymentTime

      vipOrders[orderIndex] = order
      localStorage.setItem('vip_orders', JSON.stringify(vipOrders))

      // 刷新当前用户数据
      userStore.refreshCurrentUser()

      return {
        success: true,
        message: `恭喜您成功开通${order.packageName}！`,
        data: order
      }
    } catch (error) {
      return { success: false, message: error.message || '支付处理失败' }
    }
  }

  // 升级用户VIP等级
  const upgradeUserVip = async (userId, vipType, duration) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const userIndex = allUsers.findIndex(u => String(u.id) === String(userId))
      
      if (userIndex === -1) {
        return { success: false, message: '用户不存在' }
      }

      const user = allUsers[userIndex]
      const currentTime = new Date()
      
      // 计算VIP到期时间
      let vipExpireTime
      if (user.vipExpireTime && new Date(user.vipExpireTime) > currentTime) {
        // 如果当前VIP未过期，在现有时间基础上延长
        vipExpireTime = new Date(user.vipExpireTime)
      } else {
        // 如果当前VIP已过期或首次购买，从现在开始计算
        vipExpireTime = new Date(currentTime)
      }
      
      vipExpireTime.setDate(vipExpireTime.getDate() + duration)

      // 更新用户VIP信息
      user.level = vipType
      user.vipExpireTime = vipExpireTime.toISOString()
      user.vipUpgradeTime = currentTime.toLocaleString('zh-CN')

      allUsers[userIndex] = user
      localStorage.setItem('all_users', JSON.stringify(allUsers))

      // 记录VIP升级历史
      const vipHistory = JSON.parse(localStorage.getItem('vip_history') || '[]')
      vipHistory.push({
        id: Date.now(),
        userId,
        username: user.username,
        fromLevel: user.level,
        toLevel: vipType,
        duration,
        expireTime: vipExpireTime.toISOString(),
        upgradeTime: currentTime.toLocaleString('zh-CN'),
        operatorType: 'user'
      })
      localStorage.setItem('vip_history', JSON.stringify(vipHistory))

      return { success: true, message: 'VIP等级升级成功' }
    } catch (error) {
      return { success: false, message: error.message || 'VIP升级失败' }
    }
  }

  // 检查用户VIP状态
  const checkUserVipStatus = (userId) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const user = allUsers.find(u => String(u.id) === String(userId))
      
      if (!user) {
        return { isValid: false, level: '普通', expireTime: null }
      }

      const currentTime = new Date()
      const expireTime = user.vipExpireTime ? new Date(user.vipExpireTime) : null

      // 检查VIP是否过期
      if (!expireTime || expireTime <= currentTime) {
        // VIP已过期，重置为普通用户
        if (user.level !== '普通') {
          const userIndex = allUsers.findIndex(u => String(u.id) === String(userId))
          if (userIndex !== -1) {
            allUsers[userIndex].level = '普通'
            localStorage.setItem('all_users', JSON.stringify(allUsers))
          }
        }
        return { isValid: false, level: '普通', expireTime: null }
      }

      return {
        isValid: true,
        level: user.level,
        expireTime: expireTime.toISOString(),
        daysRemaining: Math.ceil((expireTime - currentTime) / (1000 * 60 * 60 * 24))
      }
    } catch (error) {
      return { isValid: false, level: '普通', expireTime: null }
    }
  }

  // 获取VIP订单列表
  const getVipOrders = (userId = null) => {
    try {
      const vipOrders = JSON.parse(localStorage.getItem('vip_orders') || '[]')
      if (userId) {
        return vipOrders.filter(order => String(order.userId) === String(userId))
      }
      return vipOrders
    } catch (error) {
      return []
    }
  }

  // 管理员更新VIP价格
  const updateVipPricing = (vipType, packageType, newPrice) => {
    try {
      if (vipPackages[vipType] && vipPackages[vipType][packageType]) {
        vipPackages[vipType][packageType].currentPrice = parseFloat(newPrice)
        
        // 保存价格配置到localStorage
        localStorage.setItem('vip_pricing', JSON.stringify(vipPackages))
        
        return { success: true, message: '价格更新成功' }
      }
      return { success: false, message: '套餐不存在' }
    } catch (error) {
      return { success: false, message: '价格更新失败' }
    }
  }

  // 初始化价格配置
  const initializePricing = () => {
    try {
      const savedPricing = localStorage.getItem('vip_pricing')
      if (savedPricing) {
        const pricing = JSON.parse(savedPricing)
        Object.assign(vipPackages, pricing)
      } else {
        // 首次初始化，保存默认价格
        localStorage.setItem('vip_pricing', JSON.stringify(vipPackages))
      }
    } catch (error) {
      console.error('初始化VIP价格配置失败:', error)
    }
  }

  // 计算VIP统计数据
  const getVipStats = () => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const currentTime = new Date()
      
      const stats = {
        totalUsers: allUsers.length,
        normalUsers: 0,
        vipUsers: 0,
        svipUsers: 0,
        activeVipUsers: 0,
        expiredVipUsers: 0,
        thisMonthRevenue: 0,
        totalRevenue: 0
      }

      allUsers.forEach(user => {
        const vipStatus = checkUserVipStatus(user.id)
        
        if (vipStatus.level === 'VIP') {
          if (vipStatus.isValid) {
            stats.vipUsers++
            stats.activeVipUsers++
          } else {
            stats.expiredVipUsers++
            stats.normalUsers++
          }
        } else if (vipStatus.level === 'SVIP') {
          if (vipStatus.isValid) {
            stats.svipUsers++
            stats.activeVipUsers++
          } else {
            stats.expiredVipUsers++
            stats.normalUsers++
          }
        } else {
          stats.normalUsers++
        }
      })

      // 计算收入统计
      const vipOrders = getVipOrders()
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()

      vipOrders.forEach(order => {
        if (order.status === 'completed') {
          stats.totalRevenue += order.amount
          
          const orderDate = new Date(order.completedTime)
          if (orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear) {
            stats.thisMonthRevenue += order.amount
          }
        }
      })

      return stats
    } catch (error) {
      return {
        totalUsers: 0,
        normalUsers: 0,
        vipUsers: 0,
        svipUsers: 0,
        activeVipUsers: 0,
        expiredVipUsers: 0,
        thisMonthRevenue: 0,
        totalRevenue: 0
      }
    }
  }

  // 初始化
  initializePricing()

  return {
    loading,
    vipLevels,
    vipPackages,
    getUserVipInfo,
    calculateDiscountPrice,
    purchaseVip,
    processVipPayment,
    upgradeUserVip,
    checkUserVipStatus,
    getVipOrders,
    updateVipPricing,
    initializePricing,
    getVipStats
  }
})