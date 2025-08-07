// 初始化示例数据
export const initializeSampleData = () => {
  // 检查是否已经初始化过
  if (localStorage.getItem('data_initialized')) {
    return
  }

  // 创建示例卡密数据
  const sampleCards = [
    {
      id: 1,
      cardNumber: 'CARD17350123456789ABC',
      cardType: '月卡',
      value: '¥29.90',
      status: 'unused',
      createTime: '2024-01-01 10:00:00',
      useTime: null,
      expireTime: '2024-02-01 10:00:00'
    },
    {
      id: 2,
      cardNumber: 'CARD17350123456790DEF',
      cardType: '季卡',
      value: '¥79.90',
      status: 'used',
      createTime: '2024-01-02 11:00:00',
      useTime: '2024-01-03 14:30:00',
      expireTime: '2024-04-02 11:00:00'
    },
    {
      id: 3,
      cardNumber: 'CARD17350123456791GHI',
      cardType: '年卡',
      value: '¥299.90',
      status: 'unused',
      createTime: '2024-01-03 12:00:00',
      useTime: null,
      expireTime: '2025-01-03 12:00:00'
    },
    {
      id: 4,
      cardNumber: 'CARD17350123456792JKL',
      cardType: '月卡',
      value: '¥29.90',
      status: 'expired',
      createTime: '2023-12-01 09:00:00',
      useTime: null,
      expireTime: '2024-01-01 09:00:00'
    }
  ]

  // 创建示例订单数据
  const sampleOrders = [
    {
      id: 1,
      orderNumber: 'ORD202401010001',
      cardType: 'monthly',
      quantity: 1,
      unitPrice: 29.90,
      totalAmount: 29.90,
      paymentMethod: 'balance',
      status: 'completed',
      createTime: '2024-01-01 10:00:00',
      paymentTime: '2024-01-01 10:01:00'
    },
    {
      id: 2,
      orderNumber: 'ORD202401020001',
      cardType: 'quarterly',
      quantity: 1,
      unitPrice: 79.90,
      totalAmount: 79.90,
      paymentMethod: 'alipay',
      status: 'completed',
      createTime: '2024-01-02 11:00:00',
      paymentTime: '2024-01-02 11:05:00'
    },
    {
      id: 3,
      orderNumber: 'ORD202401030001',
      cardType: 'yearly',
      quantity: 1,
      unitPrice: 299.90,
      totalAmount: 299.90,
      paymentMethod: 'wechat',
      status: 'pending',
      createTime: '2024-01-03 12:00:00',
      paymentTime: null
    }
  ]

  // 创建示例用户数据（除了管理员）
  const currentUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
  const sampleUsers = [
    {
      id: 2,
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
      role: 'user',
      registerTime: '2024-01-01 09:00:00',
      balance: 500,
      level: 'VIP',
      twoFactorEnabled: false,
      emailVerified: true,
      phone: '13888888888',
      realName: '测试用户',
      bio: '这是一个测试用户账号'
    },
    {
      id: 3,
      username: 'demo',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'user',
      registerTime: '2024-01-02 10:00:00',
      balance: 200,
      level: '普通',
      twoFactorEnabled: false,
      emailVerified: false,
      phone: '13999999999',
      realName: '演示用户'
    }
  ]

  // 创建示例公告数据
  const sampleAnnouncements = [
    {
      id: 1,
      title: '系统升级维护通知',
      content: '尊敬的用户，我们将于今晚23:00-24:00进行系统升级维护，期间可能会影响服务使用，请您提前做好准备。感谢您的理解与支持！',
      type: 'warning',
      priority: 'high',
      status: 'published',
      showOnHome: true,
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
      author: 'admin'
    },
    {
      id: 2,
      title: '新功能上线公告',
      content: '我们很高兴地宣布，新的密码修改和客服联系功能已经正式上线！用户现在可以在个人中心更安全地修改密码，并通过联系客服功能获得更好的支持。',
      type: 'success',
      priority: 'normal',
      status: 'published',
      showOnHome: true,
      createTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      updateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      author: 'admin'
    },
    {
      id: 3,
      title: '春节期间服务安排',
      content: '春节期间我们的客服团队会适当调整工作时间，如有紧急问题请通过系统留言功能联系我们，我们会尽快处理。祝大家春节快乐！',
      type: 'info',
      priority: 'normal',
      status: 'published',
      showOnHome: false,
      createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      updateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      author: 'admin'
    }
  ]

  // 创建示例联系数据
  const sampleContacts = [
    {
      id: 1,
      userId: 2,
      username: 'testuser',
      email: 'test@example.com',
      subject: '卡密使用问题咨询',
      category: 'card',
      priority: 'normal',
      message: '您好，我购买的月卡显示已激活，但是登录时提示卡密无效，请帮助解决这个问题。谢谢！',
      status: 'resolved',
      createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      updateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      adminReply: '您好！经过检查，您的卡密状态正常。这个问题可能是由于浏览器缓存引起的，请清除浏览器缓存后重新登录尝试。如果还有问题，请及时联系我们。',
      replyTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
    },
    {
      id: 2,
      userId: 3,
      username: 'demo',
      email: 'demo@example.com',
      subject: '账户余额充值问题',
      category: 'payment',
      priority: 'high',
      message: '我昨天通过支付宝充值了100元，但是账户余额没有更新，订单状态显示成功，请尽快处理。',
      status: 'processing',
      createTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      updateTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      adminReply: null,
      replyTime: null
    }
  ]

  // 保存数据到 localStorage
  localStorage.setItem('all_cards', JSON.stringify(sampleCards))
  localStorage.setItem('all_orders', JSON.stringify(sampleOrders))
  localStorage.setItem('all_announcements', JSON.stringify(sampleAnnouncements))
  localStorage.setItem('all_contacts', JSON.stringify(sampleContacts))
  
  // 合并用户数据（保留现有的管理员账号）
  const allUsers = [...currentUsers, ...sampleUsers]
  localStorage.setItem('all_users', JSON.stringify(allUsers))

  // 标记为已初始化
  localStorage.setItem('data_initialized', 'true')
  
  console.log('示例数据初始化完成')
  console.log('测试账号1: testuser/123456')
  console.log('测试账号2: demo/demo123')
  console.log('管理员账号: admin/admin123')
}

// 重置所有数据
export const resetAllData = () => {
  const confirmReset = confirm('确定要重置所有数据吗？这将删除所有用户、卡密和订单数据！')
  
  if (confirmReset) {
    localStorage.removeItem('all_users')
    localStorage.removeItem('all_cards')
    localStorage.removeItem('all_orders')
    localStorage.removeItem('all_announcements')
    localStorage.removeItem('all_contacts')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('data_initialized')
    localStorage.removeItem('cardQueryHistory')
    localStorage.removeItem('system_settings')
    localStorage.removeItem('price_settings')
    
    alert('所有数据已重置，页面即将刷新')
    window.location.reload()
  }
}

// 导出数据
export const exportAllData = () => {
  const data = {
    users: JSON.parse(localStorage.getItem('all_users') || '[]'),
    cards: JSON.parse(localStorage.getItem('all_cards') || '[]'),
    orders: JSON.parse(localStorage.getItem('all_orders') || '[]'),
    announcements: JSON.parse(localStorage.getItem('all_announcements') || '[]'),
    contacts: JSON.parse(localStorage.getItem('all_contacts') || '[]'),
    systemSettings: JSON.parse(localStorage.getItem('system_settings') || '{}'),
    priceSettings: JSON.parse(localStorage.getItem('price_settings') || '{}'),
    exportTime: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `card_system_data_${new Date().getTime()}.json`
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// 导入数据
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.users) localStorage.setItem('all_users', JSON.stringify(data.users))
        if (data.cards) localStorage.setItem('all_cards', JSON.stringify(data.cards))
        if (data.orders) localStorage.setItem('all_orders', JSON.stringify(data.orders))
        if (data.announcements) localStorage.setItem('all_announcements', JSON.stringify(data.announcements))
        if (data.contacts) localStorage.setItem('all_contacts', JSON.stringify(data.contacts))
        if (data.systemSettings) localStorage.setItem('system_settings', JSON.stringify(data.systemSettings))
        if (data.priceSettings) localStorage.setItem('price_settings', JSON.stringify(data.priceSettings))
        
        localStorage.setItem('data_initialized', 'true')
        
        resolve('数据导入成功')
      } catch (error) {
        reject('数据格式错误')
      }
    }
    
    reader.onerror = () => reject('文件读取失败')
    reader.readAsText(file)
  })
}