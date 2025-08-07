// 设置工具函数

// 系统设置相关
export const getLanguageName = (langCode) => {
  const languages = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English'
  }
  return languages[langCode] || '简体中文'
}

export const getCurrentTime = (timezone = 'Asia/Shanghai') => {
  try {
    return new Date().toLocaleString('zh-CN', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return new Date().toLocaleString()
  }
}

export const formatDateExample = (format) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    default:
      return `${year}-${month}-${day}`
  }
}

export const formatNumberExample = (number, format) => {
  switch (format) {
    case '1,234.56':
      return number.toLocaleString('en-US', { minimumFractionDigits: 2 })
    case '1.234,56':
      return number.toLocaleString('de-DE', { minimumFractionDigits: 2 })
    case '1 234.56':
      return number.toLocaleString('fr-FR', { minimumFractionDigits: 2 })
    default:
      return number.toLocaleString('en-US', { minimumFractionDigits: 2 })
  }
}

// 数据统计相关
export const calculateStorageSize = () => {
  let totalSize = 0
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length
    }
  }
  
  return Math.round(totalSize / 1024) // 返回KB
}

export const getDataCount = (key, defaultValue = 0) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data.length : defaultValue
  } catch {
    return defaultValue
  }
}

export const cleanupOldData = (key, maxAge = 30 * 24 * 60 * 60 * 1000) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(data)) return
    
    const now = Date.now()
    const cleaned = data.filter(item => {
      if (!item.timestamp) return true
      const age = now - new Date(item.timestamp).getTime()
      return age < maxAge
    })
    
    if (cleaned.length !== data.length) {
      localStorage.setItem(key, JSON.stringify(cleaned))
      return data.length - cleaned.length // 返回清理的数量
    }
    
    return 0
  } catch (error) {
    console.error('清理旧数据失败:', error)
    return 0
  }
}

// 版本检查相关
export const checkForUpdates = async () => {
  try {
    // 模拟版本检查API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const currentVersion = '1.0.0'
    const latestVersion = '1.0.0' // 实际应用中从服务器获取
    
    return {
      hasUpdate: currentVersion !== latestVersion,
      currentVersion,
      latestVersion,
      updateInfo: {
        changelog: [
          '修复了已知的安全问题',
          '优化了系统性能',
          '添加了新的功能特性'
        ],
        releaseDate: '2024-01-15',
        isRequired: false
      }
    }
  } catch (error) {
    throw new Error('检查更新失败')
  }
}

// 帮助相关
export const getHelpTopics = () => {
  return [
    {
      id: 'getting-started',
      title: '快速开始',
      description: '了解如何使用卡密管理系统',
      content: `
## 快速开始指南

### 1. 用户注册与登录
- 首次使用需要注册账户
- 登录后可以访问系统所有功能

### 2. 卡密管理
- 生成卡密：批量创建卡密
- 查询卡密：查看卡密状态和使用情况
- 删除卡密：删除无效或过期的卡密

### 3. 系统设置
- 外观设置：自定义主题和界面
- 通知设置：配置系统通知
- 安全设置：密码和权限管理
      `
    },
    {
      id: 'card-management',
      title: '卡密管理',
      description: '卡密的生成、查询和管理',
      content: `
## 卡密管理详解

### 卡密生成
1. 设置卡密类型和有效期
2. 选择生成数量
3. 批量生成并导出

### 卡密查询
1. 按条件筛选卡密
2. 查看使用状态
3. 导出查询结果

### 安全注意事项
- 定期备份重要数据
- 及时删除过期卡密
- 设置强密码保护账户
      `
    }
  ]
}

// 错误报告相关
export const submitBugReport = async (reportData) => {
  try {
    // 模拟提交错误报告
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 收集系统信息
    const systemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...reportData
    }
    
    // 实际应用中应发送到服务器
    console.log('错误报告已提交:', systemInfo)
    
    return {
      success: true,
      reportId: Date.now().toString(),
      message: '感谢您的反馈，我们会尽快处理'
    }
  } catch (error) {
    throw new Error('提交报告失败')
  }
}