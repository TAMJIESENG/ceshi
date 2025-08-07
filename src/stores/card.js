import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useCardStore = defineStore('card', () => {
  const cards = ref([])
  const loading = ref(false)
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })

  const generateCardNumber = () => {
    const prefix = 'CARD'
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  const generateCards = async (params) => {
    try {
      loading.value = true
      
      const generatedCards = []
      const { type, quantity, value, zoneId, zoneName, productId, productName, cardTypeId, cardTypeName, cardTypeDuration } = params
      
      // 从 localStorage 获取现有卡密
      const existingCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      
      console.log('=== 生成卡密参数检查 ===')
      console.log('专区ID:', zoneId)
      console.log('商品ID:', productId)
      console.log('卡密类型ID:', cardTypeId)
      console.log('卡密类型名称:', cardTypeName)
      console.log('生成数量:', quantity)
      console.log('卡密面值:', value)
      
      for (let i = 0; i < quantity; i++) {
        const cardNumber = generateCardNumber()
        const card = {
          id: Date.now() + i,
          cardNumber,
          cardType: cardTypeName || getCardTypeName(type),
          value: `¥${value}`,
          status: 'unused',
          createTime: new Date().toLocaleString('zh-CN'),
          useTime: null,
          expireTime: calculateExpireTimeFromDuration(cardTypeDuration) || calculateExpireTime(type),
          zoneId: zoneId,
          zoneName: zoneName || '',
          productId: productId,
          productName: productName || '',
          cardTypeId: cardTypeId,
          cardTypeName: cardTypeName,
          cardTypeDuration: cardTypeDuration,
          cardTypePrice: typeof value === 'string' && value.includes('¥') ? parseFloat(value.replace('¥', '')) : parseFloat(value) // 存储卡密类型的数字价格
        }
        
        console.log(`生成第${i+1}张卡密:`, {
          cardNumber: card.cardNumber,
          cardTypeId: card.cardTypeId,
          zoneId: card.zoneId,
          productId: card.productId,
          value: card.value,
          cardTypePrice: card.cardTypePrice
        })
        
        generatedCards.push(card)
        existingCards.push(card)
      }
      
      // 保存到 localStorage
      localStorage.setItem('all_cards', JSON.stringify(existingCards))
      
      cards.value.unshift(...generatedCards)
      
      return { 
        success: true, 
        message: `成功生成 ${quantity} 张卡密`,
        data: { cards: generatedCards }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || '生成失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const getCardTypeName = (type) => {
    const typeMap = {
      monthly: '月卡',
      quarterly: '季卡',
      yearly: '年卡',
      trial: '体验卡'
    }
    return typeMap[type] || type
  }

  const calculateExpireTime = (type) => {
    const now = new Date()
    switch (type) {
      case 'monthly':
        now.setMonth(now.getMonth() + 1)
        break
      case 'quarterly':
        now.setMonth(now.getMonth() + 3)
        break
      case 'yearly':
        now.setFullYear(now.getFullYear() + 1)
        break
      case 'trial':
        now.setDate(now.getDate() + 7) // 体验卡7天
        break
    }
    return now.toLocaleString('zh-CN')
  }

  const calculateExpireTimeFromDuration = (duration) => {
    if (!duration) return null
    
    const now = new Date()
    
    // 处理预设的时间选项
    switch (duration) {
      case '7天':
        now.setDate(now.getDate() + 7)
        break
      case '1个月':
        now.setMonth(now.getMonth() + 1)
        break
      case '3个月':
        now.setMonth(now.getMonth() + 3)
        break
      case '6个月':
        now.setMonth(now.getMonth() + 6)
        break
      case '1年':
        now.setFullYear(now.getFullYear() + 1)
        break
      case '永久':
        return '永久有效'
      default:
        // 处理自定义时间格式，如 "15天", "2个月", "3年"
        const customMatch = duration.match(/^(\d+)(天|周|个月|年)$/)
        if (customMatch) {
          const value = parseInt(customMatch[1])
          const unit = customMatch[2]
          
          switch (unit) {
            case '天':
              now.setDate(now.getDate() + value)
              break
            case '周':
              now.setDate(now.getDate() + (value * 7))
              break
            case '个月':
              now.setMonth(now.getMonth() + value)
              break
            case '年':
              now.setFullYear(now.getFullYear() + value)
              break
            default:
              return null
          }
        } else {
          return null
        }
    }
    return now.toLocaleString('zh-CN')
  }

  const fetchCards = async (params = {}) => {
    try {
      loading.value = true
      
      // 从 localStorage 获取卡密数据
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      
      cards.value = allCards
      pagination.value = {
        currentPage: params.page || 1,
        pageSize: params.limit || 10,
        total: allCards.length
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: '获取卡密列表失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const queryCard = async (cardNumber) => {
    try {
      // 从 localStorage 查询卡密
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const foundCard = allCards.find(card => card.cardNumber === cardNumber)
      
      if (foundCard) {
        return { 
          success: true, 
          data: foundCard 
        }
      } else {
        return { 
          success: false, 
          message: '卡密不存在' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: '查询失败' 
      }
    }
  }

  const useCard = async (cardNumber) => {
    try {
      // 从 localStorage 获取所有卡密
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const cardIndex = allCards.findIndex(card => card.cardNumber === cardNumber)
      
      if (cardIndex === -1) {
        return { 
          success: false, 
          message: '卡密不存在' 
        }
      }
      
      if (allCards[cardIndex].status !== 'unused') {
        return { 
          success: false, 
          message: '卡密已被使用或已过期' 
        }
      }
      
      // 更新卡密状态
      allCards[cardIndex].status = 'used'
      allCards[cardIndex].useTime = new Date().toLocaleString('zh-CN')
      
      // 保存到 localStorage
      localStorage.setItem('all_cards', JSON.stringify(allCards))
      
      // 更新本地状态
      const localCardIndex = cards.value.findIndex(card => card.cardNumber === cardNumber)
      if (localCardIndex !== -1) {
        cards.value[localCardIndex].status = 'used'
        cards.value[localCardIndex].useTime = new Date().toLocaleString('zh-CN')
      }
      
      return { 
        success: true, 
        message: '卡密使用成功',
        data: allCards[cardIndex]
      }
    } catch (error) {
      return { 
        success: false, 
        message: '使用失败' 
      }
    }
  }

  const deleteCard = async (cardId) => {
    try {
      // 从 localStorage 删除卡密
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const filteredCards = allCards.filter(card => String(card.id) !== String(cardId))
      
      if (filteredCards.length === allCards.length) {
        // 没有删除任何卡密，可能是ID不匹配
        return { 
          success: false, 
          message: '未找到要删除的卡密' 
        }
      }
      
      localStorage.setItem('all_cards', JSON.stringify(filteredCards))
      
      // 更新本地状态
      const cardIndex = cards.value.findIndex(card => String(card.id) === String(cardId))
      if (cardIndex !== -1) {
        cards.value.splice(cardIndex, 1)
        pagination.value.total--
      }
      
      return { 
        success: true, 
        message: '删除成功' 
      }
    } catch (error) {
      return { 
        success: false, 
        message: '删除失败' 
      }
    }
  }

  // 批量删除卡密
  const batchDeleteCards = async (cardIds) => {
    try {
      if (!cardIds || cardIds.length === 0) {
        return {
          success: false,
          message: '请选择要删除的卡密'
        }
      }

      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      let deleteCount = 0
      let skipCount = 0
      const errors = []

      // 检查哪些卡密可以删除（只有unused状态的卡密可以删除）
      const cardsToDelete = []
      for (const cardId of cardIds) {
        const card = allCards.find(c => String(c.id) === String(cardId))
        if (!card) {
          errors.push(`卡密 ID ${cardId} 不存在`)
          continue
        }

        if (card.status !== 'unused') {
          skipCount++
          errors.push(`卡密 ${card.cardNumber} 已被使用或购买，无法删除`)
          continue
        }

        cardsToDelete.push(cardId)
      }

      // 执行删除
      const filteredCards = allCards.filter(card => !cardsToDelete.some(id => String(id) === String(card.id)))
      deleteCount = allCards.length - filteredCards.length

      localStorage.setItem('all_cards', JSON.stringify(filteredCards))

      // 更新本地状态
      cards.value = cards.value.filter(card => !cardsToDelete.some(id => String(id) === String(card.id)))
      pagination.value.total = filteredCards.length

      return {
        success: true,
        message: `批量删除完成：成功删除 ${deleteCount} 个，跳过 ${skipCount} 个`,
        data: {
          deleteCount,
          skipCount,
          errors: errors.slice(0, 10) // 只返回前10个错误
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `批量删除失败：${error.message}`
      }
    }
  }

  // 购买卡密功能
  const purchaseCard = async (cardType, quantity, userId, username, totalPrice) => {
    try {
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      
      // 查找可购买的卡密（未使用且未被购买）
      const availableCards = allCards.filter(card => 
        card.cardType === getCardTypeName(cardType) && 
        card.status === 'unused' && 
        !card.purchasedBy
      )
      
      if (availableCards.length < quantity) {
        return {
          success: false,
          message: `库存不足，当前只有 ${availableCards.length} 张可用的${getCardTypeName(cardType)}`
        }
      }

      // 如果提供了总价，执行余额扣除
      if (totalPrice && totalPrice > 0) {
        const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
        const userIndex = allUsers.findIndex(u => String(u.id) === String(userId))
        
        if (userIndex === -1) {
          return {
            success: false,
            message: '用户不存在'
          }
        }
        
        const currentBalance = allUsers[userIndex].balance || 0
        if (currentBalance < totalPrice) {
          return {
            success: false,
            message: '余额不足'
          }
        }
        
        // 扣除余额
        allUsers[userIndex].balance = currentBalance - totalPrice
        localStorage.setItem('all_users', JSON.stringify(allUsers))
        
        // 更新当前用户数据
        const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
        if (String(currentUser.id) === String(userId)) {
          currentUser.balance = allUsers[userIndex].balance
          localStorage.setItem('user_data', JSON.stringify(currentUser))
        }
      }
      
      // 标记前 quantity 张卡密为已购买
      const purchasedCards = availableCards.slice(0, quantity)
      const purchaseTime = new Date().toLocaleString('zh-CN')
      
      purchasedCards.forEach(card => {
        const cardIndex = allCards.findIndex(c => c.id === card.id)
        if (cardIndex !== -1) {
          allCards[cardIndex].status = 'sold'
          allCards[cardIndex].purchasedBy = userId
          allCards[cardIndex].purchaser = username
          allCards[cardIndex].purchaseTime = purchaseTime
        }
      })
      
      // 保存到 localStorage
      localStorage.setItem('all_cards', JSON.stringify(allCards))
      
      return {
        success: true,
        message: `成功购买 ${quantity} 张${getCardTypeName(cardType)}`,
        data: { 
          cards: purchasedCards.map(card => ({
            ...card,
            status: 'sold',
            purchasedBy: userId,
            purchaser: username,
            purchaseTime: purchaseTime
          }))
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '购买失败'
      }
    }
  }

  // 获取用户购买的卡密
  const getUserCards = async (userId) => {
    try {
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const userCards = allCards.filter(card => card.purchasedBy === userId)
      
      return {
        success: true,
        data: userCards
      }
    } catch (error) {
      return {
        success: false,
        message: '获取用户卡密失败'
      }
    }
  }

  // 获取可购买的卡密数量
  const getAvailableCards = () => {
    try {
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      
      const available = {
        monthly: allCards.filter(card => card.cardType === '月卡' && card.status === 'unused' && !card.purchasedBy).length,
        quarterly: allCards.filter(card => card.cardType === '季卡' && card.status === 'unused' && !card.purchasedBy).length,
        yearly: allCards.filter(card => card.cardType === '年卡' && card.status === 'unused' && !card.purchasedBy).length
      }
      
      return available
    } catch (error) {
      return {
        monthly: 0,
        quarterly: 0,
        yearly: 0
      }
    }
  }

  // 激活购买的卡密
  const activateCard = async (cardNumber, userId) => {
    try {
      const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      const cardIndex = allCards.findIndex(card => 
        card.cardNumber === cardNumber && 
        card.purchasedBy === userId &&
        card.status === 'sold'
      )
      
      if (cardIndex === -1) {
        return {
          success: false,
          message: '卡密不存在或已被激活'
        }
      }
      
      // 更新卡密状态为已使用
      allCards[cardIndex].status = 'used'
      allCards[cardIndex].useTime = new Date().toLocaleString('zh-CN')
      
      localStorage.setItem('all_cards', JSON.stringify(allCards))
      
      return {
        success: true,
        message: '卡密激活成功',
        data: allCards[cardIndex]
      }
    } catch (error) {
      return {
        success: false,
        message: '激活失败'
      }
    }
  }

  const getCardStatusType = (status) => {
    const typeMap = {
      unused: 'success',
      sold: 'warning',
      used: 'info',
      expired: 'danger'
    }
    return typeMap[status] || 'info'
  }

  const getCardStatusText = (status) => {
    const textMap = {
      unused: '未使用',
      sold: '已购买',
      used: '已激活',
      expired: '已过期'
    }
    return textMap[status] || '未知'
  }

  const exportCards = (cardList) => {
    const csvContent = [
      ['卡号', '类型', '面值', '状态', '创建时间', '使用时间'].join(','),
      ...cardList.map(card => [
        card.cardNumber,
        card.cardType,
        card.value,
        getCardStatusText(card.status),
        card.createTime,
        card.useTime || ''
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `cards_${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 导入卡密功能
  const importCards = async (importData) => {
    try {
      loading.value = true
      
      const { cards: importCards, overwriteExisting = false } = importData
      const existingCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
      
      let successCount = 0
      let skipCount = 0
      let errorCount = 0
      const errors = []
      
      for (let i = 0; i < importCards.length; i++) {
        const importCard = importCards[i]
        
        try {
          // 验证必要字段
          if (!importCard.cardNumber || !importCard.cardType || !importCard.value) {
            errors.push(`第${i + 1}行：缺少必要字段（卡号、类型或面值）`)
            errorCount++
            continue
          }
          
          // 检查卡号是否已存在
          const existingIndex = existingCards.findIndex(card => card.cardNumber === importCard.cardNumber)
          
          if (existingIndex !== -1) {
            if (overwriteExisting) {
              // 覆盖现有卡密
              existingCards[existingIndex] = {
                ...existingCards[existingIndex],
                ...importCard,
                id: existingCards[existingIndex].id, // 保留原ID
                createTime: importCard.createTime || existingCards[existingIndex].createTime
              }
              successCount++
            } else {
              errors.push(`第${i + 1}行：卡号 ${importCard.cardNumber} 已存在`)
              skipCount++
            }
          } else {
            // 添加新卡密
            const newCard = {
              id: Date.now() + Math.random(),
              cardNumber: importCard.cardNumber,
              cardType: importCard.cardType,
              value: importCard.value,
              status: importCard.status || 'unused',
              createTime: importCard.createTime || new Date().toLocaleString('zh-CN'),
              useTime: importCard.useTime || null,
              expireTime: importCard.expireTime || calculateExpireTime(getCardTypeKey(importCard.cardType)),
              purchasedBy: importCard.purchasedBy || null,
              purchaser: importCard.purchaser || null,
              purchaseTime: importCard.purchaseTime || null
            }
            
            existingCards.push(newCard)
            successCount++
          }
        } catch (error) {
          errors.push(`第${i + 1}行：处理失败 - ${error.message}`)
          errorCount++
        }
      }
      
      // 保存到localStorage
      localStorage.setItem('all_cards', JSON.stringify(existingCards))
      
      // 更新本地状态
      await fetchCards()
      
      return {
        success: true,
        message: `导入完成：成功 ${successCount} 个，跳过 ${skipCount} 个，失败 ${errorCount} 个`,
        data: {
          successCount,
          skipCount,
          errorCount,
          errors: errors.slice(0, 10) // 只返回前10个错误
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `导入失败：${error.message}`
      }
    } finally {
      loading.value = false
    }
  }

  // 解析卡密类型键值
  const getCardTypeKey = (cardType) => {
    const typeMap = {
      '月卡': 'monthly',
      '季卡': 'quarterly', 
      '年卡': 'yearly'
    }
    return typeMap[cardType] || 'monthly'
  }

  // 解析CSV文件
  const parseCSV = (csvText) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        throw new Error('CSV文件格式错误：至少需要标题行和一行数据')
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const cards = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length !== headers.length) {
          continue // 跳过格式不正确的行
        }
        
        const card = {}
        headers.forEach((header, index) => {
          const value = values[index]
          
          // 映射CSV标题到卡密字段
          switch (header) {
            case '卡号':
              card.cardNumber = value
              break
            case '类型':
              card.cardType = value
              break
            case '面值':
              card.value = value
              break
            case '状态':
              // 转换状态文本为状态值
              const statusMap = {
                '未使用': 'unused',
                '已购买': 'sold', 
                '已激活': 'used',
                '已过期': 'expired'
              }
              card.status = statusMap[value] || 'unused'
              break
            case '创建时间':
              card.createTime = value
              break
            case '使用时间':
              card.useTime = value || null
              break
            case '过期时间':
              card.expireTime = value
              break
            case '购买用户':
              card.purchaser = value
              break
            case '购买时间':
              card.purchaseTime = value
              break
          }
        })
        
        if (card.cardNumber) {
          cards.push(card)
        }
      }
      
      return { success: true, data: cards }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // 解析手动输入的文本
  const parseManualText = (textData) => {
    try {
      const lines = textData.split('\n').filter(line => line.trim())
      if (lines.length === 0) {
        throw new Error('请输入卡密数据')
      }
      
      const cards = []
      const statusMap = {
        '未使用': 'unused',
        '已购买': 'sold', 
        '已激活': 'used',
        '已过期': 'expired'
      }
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        
        const parts = line.split(',').map(p => p.trim())
        
        if (parts.length < 3) {
          throw new Error(`第${i + 1}行格式错误：至少需要卡号、类型、面值`)
        }
        
        const [cardNumber, cardType, value, status = '未使用'] = parts
        
        if (!cardNumber || !cardType || !value) {
          throw new Error(`第${i + 1}行：卡号、类型、面值不能为空`)
        }
        
        // 验证卡密类型
        if (!['月卡', '季卡', '年卡'].includes(cardType)) {
          throw new Error(`第${i + 1}行：卡密类型必须是月卡、季卡或年卡`)
        }
        
        // 验证面值格式
        if (!value.includes('¥') && !value.includes('元')) {
          throw new Error(`第${i + 1}行：面值格式错误，应包含¥符号`)
        }
        
        const card = {
          cardNumber,
          cardType,
          value,
          status: statusMap[status] || 'unused',
          createTime: new Date().toLocaleString('zh-CN'),
          useTime: null,
          expireTime: null,
          purchasedBy: null,
          purchaser: null,
          purchaseTime: null
        }
        
        cards.push(card)
      }
      
      return { success: true, data: cards }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return {
    cards,
    loading,
    pagination,
    generateCards,
    fetchCards,
    queryCard,
    useCard,
    deleteCard,
    batchDeleteCards,
    purchaseCard,
    getUserCards,
    getAvailableCards,
    activateCard,
    getCardStatusType,
    getCardStatusText,
    exportCards,
    importCards,
    parseCSV,
    parseManualText
  }
})