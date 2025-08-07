import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 默认设置
  const defaultSettings = {
    appearance: {
      theme: 'light',
      primaryColor: '#409EFF',
      fontSize: 14,
      compact: false,
      animations: true
    },
    notification: {
      desktop: false,
      sound: true,
      email: false,
      types: ['order', 'security'],
      quietStart: '22:00',
      quietEnd: '08:00',
      priority: 'normal',
      duration: 5,
      rateLimit: true
    },
    privacy: {
      autoLogout: 'never',
      rememberLogin: true,
      confirmActions: true,
      dataEncryption: false
    },
    system: {
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: '1,234.56',
      pageSize: 20,
      autoRefresh: false,
      cacheStrategy: 'standard',
      crashReporting: true,
      analytics: false,
      debugMode: false,
      preload: true
    },
    payment: {
      methods: ['alipay', 'wechat'],
      minAmount: 10,
      feeRate: 0.5,
      autoConfirm: true,
      timeout: '1800'
    },
    email: {
      enabled: false,
      smtpHost: '',
      smtpPort: 587,
      fromEmail: '',
      password: '',
      encryption: 'tls',
      types: ['register', 'purchase']
    },
    security: {
      loginSecurity: true,
      ipWhitelist: false,
      allowedIPs: ['127.0.0.1'],
      operationLog: true,
      dataEncryption: false
    },
    api: {
      rateLimit: 1000,
      corsEnabled: false,
      allowedOrigins: ''
    },
    backup: {
      autoBackup: true,
      frequency: 'daily',
      backupTime: '03:00',
      retainCount: 7,
      contents: ['users', 'products', 'orders', 'settings']
    }
  }

  const settings = reactive({ ...defaultSettings })

  // 加载设置
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('system_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.assign(settings, parsed)
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  // 保存设置
  const saveSettings = () => {
    try {
      localStorage.setItem('system_settings', JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('保存设置失败:', error)
      return false
    }
  }

  // 重置设置
  const resetSettings = () => {
    Object.assign(settings, defaultSettings)
    return saveSettings()
  }

  // 更新单个设置
  const updateSetting = (path, value) => {
    const keys = path.split('.')
    let current = settings
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    return saveSettings()
  }

  // 获取设置值
  const getSetting = (path, defaultValue = null) => {
    const keys = path.split('.')
    let current = settings
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return defaultValue
      }
    }
    
    return current
  }

  // 应用主题
  const applyTheme = (theme) => {
    settings.appearance.theme = theme
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      
      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        if (settings.appearance.theme === 'auto') {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
        }
      })
    }
    saveSettings()
  }

  // 应用主题色
  const applyPrimaryColor = (color) => {
    settings.appearance.primaryColor = color
    document.documentElement.style.setProperty('--el-color-primary', color)
    document.documentElement.style.setProperty('--primary-color', color)
    saveSettings()
  }

  // 应用字体大小
  const applyFontSize = (size) => {
    settings.appearance.fontSize = size
    document.documentElement.style.setProperty('--base-font-size', size + 'px')
    saveSettings()
  }

  // 应用紧凑模式
  const applyCompactMode = (compact) => {
    settings.appearance.compact = compact
    document.documentElement.classList.toggle('compact-mode', compact)
    saveSettings()
  }

  // 应用动画设置
  const applyAnimations = (enable) => {
    settings.appearance.animations = enable
    document.documentElement.classList.toggle('no-animations', !enable)
    saveSettings()
  }

  // 应用所有外观设置
  const applyAppearance = () => {
    applyTheme(settings.appearance.theme)
    applyPrimaryColor(settings.appearance.primaryColor)
    applyFontSize(settings.appearance.fontSize)
    applyCompactMode(settings.appearance.compact)
    applyAnimations(settings.appearance.animations)
  }

  // 获取数据统计
  const getDataStats = () => {
    let totalSize = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length
      }
    }

    const users = JSON.parse(localStorage.getItem('all_users') || '[]')
    const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]')

    return {
      cacheSize: Math.round(totalSize / 1024),
      userData: users.length,
      logCount: logs.length
    }
  }

  // 导出设置
  const exportSettings = () => {
    const data = {
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入设置
  const importSettings = (data) => {
    try {
      if (data.settings) {
        Object.assign(settings, data.settings)
        saveSettings()
        applyAppearance()
        return true
      }
      return false
    } catch (error) {
      console.error('导入设置失败:', error)
      return false
    }
  }

  // 更新通知设置
  const updateNotificationSetting = (key, value) => {
    settings.notification[key] = value
    saveSettings()
  }

  // 更新隐私设置
  const updatePrivacySetting = (key, value) => {
    settings.privacy[key] = value
    saveSettings()
  }

  // 更新系统设置
  const updateSystemSetting = (key, value) => {
    settings.system[key] = value
    saveSettings()
  }

  // 验证设置数据
  const validateSettings = (settingsData) => {
    const errors = []
    
    // 验证外观设置
    if (settingsData.appearance) {
      const { theme, fontSize, primaryColor } = settingsData.appearance
      if (theme && !['light', 'dark', 'auto'].includes(theme)) {
        errors.push('无效的主题设置')
      }
      if (fontSize && (fontSize < 12 || fontSize > 18)) {
        errors.push('字体大小必须在12-18px之间')
      }
      if (primaryColor && !/^#[0-9A-F]{6}$/i.test(primaryColor)) {
        errors.push('无效的主题色格式')
      }
    }
    
    // 验证隐私设置
    if (settingsData.privacy) {
      const { autoLogout } = settingsData.privacy
      if (autoLogout && !['never', '30', '60', '120', '240'].includes(autoLogout)) {
        errors.push('无效的自动登出时间设置')
      }
    }
    
    return errors
  }

  // 重置特定部分的设置
  const resetSection = (section) => {
    if (defaultSettings[section]) {
      settings[section] = { ...defaultSettings[section] }
      saveSettings()
      if (section === 'appearance') {
        applyAppearance()
      }
      return true
    }
    return false
  }

  // 获取设置摘要
  const getSettingsSummary = () => {
    return {
      theme: settings.appearance.theme,
      primaryColor: settings.appearance.primaryColor,
      fontSize: settings.appearance.fontSize,
      language: settings.system.language,
      autoLogout: settings.privacy.autoLogout,
      notifications: settings.notification.desktop
    }
  }

  // 新设置模块的更新方法
  const updatePaymentSetting = (key, value) => {
    settings.payment[key] = value
    return saveSettings()
  }

  const updateEmailSetting = (key, value) => {
    settings.email[key] = value
    return saveSettings()
  }

  const saveEmailConfig = () => {
    return saveSettings()
  }

  const updateSecuritySetting = (key, value) => {
    settings.security[key] = value
    return saveSettings()
  }

  const updateApiSetting = (key, value) => {
    settings.api[key] = value
    return saveSettings()
  }

  const saveApiConfig = () => {
    return saveSettings()
  }

  const updateBackupSetting = (key, value) => {
    settings.backup[key] = value
    return saveSettings()
  }

  return {
    settings,
    loadSettings,
    saveSettings,
    resetSettings,
    updateSetting,
    getSetting,
    applyTheme,
    applyPrimaryColor,
    applyFontSize,
    applyCompactMode,
    applyAnimations,
    applyAppearance,
    getDataStats,
    exportSettings,
    importSettings,
    updateNotificationSetting,
    updatePrivacySetting,
    updateSystemSetting,
    validateSettings,
    resetSection,
    getSettingsSummary,
    // 新设置模块方法
    updatePaymentSetting,
    updateEmailSetting,
    saveEmailConfig,
    updateSecuritySetting,
    updateApiSetting,
    saveApiConfig,
    updateBackupSetting
  }
})