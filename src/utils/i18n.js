// 国际化语言包
export const messages = {
  'zh-CN': {
    // 通用
    common: {
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      search: '搜索',
      reset: '重置',
      export: '导出',
      import: '导入',
      back: '返回',
      close: '关闭',
      loading: '加载中...',
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息'
    },
    
    // 设置页面
    settings: {
      title: '系统设置',
      menu: {
        appearance: '外观设置',
        notification: '通知设置',
        privacy: '隐私安全',  
        system: '系统偏好',
        data: '数据管理',
        about: '关于系统'
      },
      
      // 外观设置
      appearance: {
        title: '外观设置',
        subtitle: '个性化您的界面体验',
        theme: '主题模式',
        themeLight: '浅色主题',
        themeDark: '深色主题',
        themeAuto: '跟随系统',
        primaryColor: '主题色彩',
        fontSize: '字体大小',
        fontSizePreview: '预览文字效果',
        compactMode: '紧凑模式',
        compactModeHint: '减少界面元素间距，显示更多内容',
        animations: '动画效果',
        animationsHint: '启用页面切换和交互动画'
      },
      
      // 通知设置
      notification: {
        title: '通知设置',
        subtitle: '管理系统通知和提醒',
        desktop: '桌面通知',
        desktopHint: '允许系统发送桌面通知',
        sound: '声音提示',
        soundHint: '播放通知提示音',
        email: '邮件通知',
        emailHint: '重要事件通过邮件通知',
        types: '通知类型',
        typeOrder: '订单状态',
        typePayment: '支付提醒',
        typeSecurity: '安全警告',
        typeSystem: '系统公告',
        quietTime: '免打扰时间',
        quietStart: '开始时间',
        quietEnd: '结束时间',
        priority: '通知优先级',
        priorityLow: '低',
        priorityNormal: '普通',
        priorityHigh: '高',
        priorityUrgent: '紧急',
        priorityHint: '高优先级通知会忽略免打扰时间',
        duration: '通知持续时间',
        durationHint: '秒后自动关闭',
        rateLimit: '通知频率限制',
        rateLimitHint: '每分钟最多显示3条通知，避免通知泛滥',
        history: '通知历史',
        historyView: '查看通知历史',
        historyClear: '清除历史',
        historyCount: '条历史记录',
        test: '测试通知',
        testDesktop: '测试桌面通知',
        testSound: '测试声音通知',
        testEmail: '测试邮件通知'
      },
      
      // 隐私安全
      privacy: {
        title: '隐私安全',
        subtitle: '保护您的账户和数据安全',
        autoLogout: '自动登出',
        autoLogoutNever: '从不',
        autoLogoutHint: '无操作自动退出登录',
        rememberLogin: '记住登录',
        rememberLoginHint: '下次访问自动登录',
        confirmActions: '操作确认',
        confirmActionsHint: '重要操作需要二次确认',
        dataEncryption: '数据加密',
        dataEncryptionHint: '本地数据加密存储',
        passwordManagement: '密码管理',
        changePassword: '修改密码',
        securitySettings: '安全设置',
        accessLogs: '访问日志',
        viewLogs: '查看访问记录',
        clearLogs: '清除日志'
      },
      
      // 系统偏好
      system: {
        title: '系统偏好',
        subtitle: '配置系统行为和性能选项',
        language: '语言设置',
        languageCurrent: '当前',
        timezone: '时区设置',
        timezoneBeijing: '北京时间 (UTC+8)',
        timezoneHongKong: '香港时间 (UTC+8)',
        timezoneTokyo: '东京时间 (UTC+9)',
        timezoneNewYork: '纽约时间 (UTC-5)',
        timezoneCurrent: '当前时间',
        dateFormat: '日期格式',
        numberFormat: '数字格式',
        numberFormatExample: '示例',
        pageSize: '页面大小',
        pageSizeHint: '列表页默认显示条数',
        autoRefresh: '自动刷新',
        autoRefreshHint: '数据自动刷新间隔: 30秒',
        nextRefresh: '下次刷新',
        cacheStrategy: '缓存策略',
        cacheAggressive: '积极缓存 (性能优先)',
        cacheStandard: '标准缓存 (平衡)',
        cacheMinimal: '最小缓存 (内存优先)',
        cacheNone: '无缓存 (总是最新)',
        cacheCurrent: '当前缓存大小',
        crashReporting: '错误报告',
        crashReportingHint: '自动发送崩溃和错误报告以改进系统',
        analytics: '使用统计',
        analyticsHint: '匿名收集使用数据以优化用户体验',
        debugMode: '调试模式',
        debugModeHint: '显示详细日志和调试信息',
        preload: '预加载',
        preloadHint: '预加载常用数据以提升响应速度',
        performance: '系统性能',
        memoryUsage: '内存使用',
        responseTime: '响应时间',
        performanceTest: '性能测试',
        optimizeSystem: '优化系统'
      },
      
      // 数据管理
      data: {
        title: '数据管理',
        subtitle: '管理本地数据和缓存',
        cacheSize: '缓存大小',
        userData: '用户数据',
        logCount: '日志记录',
        exportData: '数据导出',
        exportAll: '导出所有数据',
        exportSettings: '仅导出设置',
        exportHint: '导出您的个人数据和设置',
        importData: '数据导入',
        importFile: '选择备份文件',
        importHint: '从备份文件恢复数据',
        dangerZone: '危险操作',
        dangerHint: '以下操作不可恢复，请谨慎操作',
        clearCache: '清除缓存',
        resetSettings: '重置设置',
        clearAllData: '清空所有数据'
      },
      
      // 关于系统
      about: {
        title: '关于系统',
        subtitle: '系统信息和版本详情',
        appName: '卡密管理系统',
        appDesc: '专业的卡密生成、销售、管理解决方案',
        version: '版本',
        build: '构建',
        environment: '环境',
        systemStatus: '系统状态',
        systemHealth: '系统健康度',
        uptime: '运行时间',
        activeUsers: '活跃用户',
        systemDetails: '系统详情',
        os: '操作系统',
        browser: '浏览器',
        screenResolution: '屏幕分辨率',
        timezone: '时区',
        language: '语言',
        userAgent: '用户代理',
        coreFeatures: '核心功能',
        techStack: '技术栈',
        diagnostics: '系统诊断',
        runDiagnostic: '运行系统诊断',
        exportSystemInfo: '导出系统信息',
        clearSystemCache: '清理系统缓存',
        restartSystem: '重启应用',
        support: '支持与帮助',
        supportHint: '如有问题或建议，请联系技术支持',
        checkUpdate: '检查更新',
        help: '使用帮助',
        reportBug: '报告问题',
        license: '许可证'
      },
      
      // 消息提示
      messages: {
        themeChanged: '主题已更改',
        colorUpdated: '主题色已更新',
        fontSizeAdjusted: '字体大小已调整',
        compactModeEnabled: '已启用紧凑模式',
        compactModeDisabled: '已关闭紧凑模式',
        animationsEnabled: '已启用动画效果',
        animationsDisabled: '已关闭动画效果',
        notificationUpdated: '通知设置已更新',
        languageUpdated: '语言设置已更新',
        languageWillReload: '语言已切换，页面将在3秒后自动刷新以应用新语言',
        timezoneUpdated: '时区设置已更新',
        settingsSaved: '设置已保存',
        settingsReset: '设置已重置'
      }
    }
  },
  
  'zh-TW': {
    // 通用
    common: {
      confirm: '確認',
      cancel: '取消',
      save: '儲存',
      delete: '刪除',
      edit: '編輯',
      add: '新增',
      search: '搜尋',
      reset: '重設',
      export: '匯出',
      import: '匯入',
      back: '返回',
      close: '關閉',
      loading: '載入中...',
      success: '成功',
      error: '錯誤',
      warning: '警告',
      info: '資訊'
    },
    
    settings: {
      title: '系統設定',
      menu: {
        appearance: '外觀設定',
        notification: '通知設定',
        privacy: '隱私安全',
        system: '系統偏好',
        data: '資料管理',
        about: '關於系統'
      },
      
      appearance: {
        title: '外觀設定',
        subtitle: '個人化您的介面體驗',
        theme: '主題模式',
        themeLight: '淺色主題',
        themeDark: '深色主題',
        themeAuto: '跟隨系統',
        primaryColor: '主題色彩',
        fontSize: '字體大小',
        fontSizePreview: '預覽文字效果',
        compactMode: '緊湊模式',
        compactModeHint: '減少介面元素間距，顯示更多內容',
        animations: '動畫效果',
        animationsHint: '啟用頁面切換和互動動畫'
      },
      
      system: {
        title: '系統偏好',
        subtitle: '配置系統行為和效能選項',
        language: '語言設定',
        languageCurrent: '目前',
        timezone: '時區設定'
      },
      
      messages: {
        languageUpdated: '語言設定已更新',
        languageWillReload: '語言已切換，頁面將在3秒後自動重新整理以套用新語言'
      }
    }
  },
  
  'en-US': {
    // Common
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      reset: 'Reset',
      export: 'Export',
      import: 'Import',
      back: 'Back',
      close: 'Close',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    },
    
    settings: {
      title: 'System Settings',
      menu: {
        appearance: 'Appearance',
        notification: 'Notifications',
        privacy: 'Privacy & Security',
        system: 'System Preferences',
        data: 'Data Management',
        about: 'About System'
      },
      
      appearance: {
        title: 'Appearance Settings',
        subtitle: 'Personalize your interface experience',
        theme: 'Theme Mode',
        themeLight: 'Light Theme',
        themeDark: 'Dark Theme',
        themeAuto: 'Follow System',
        primaryColor: 'Primary Color',
        fontSize: 'Font Size',
        fontSizePreview: 'Preview text effect',
        compactMode: 'Compact Mode',
        compactModeHint: 'Reduce interface spacing, display more content',
        animations: 'Animations',
        animationsHint: 'Enable page transitions and interaction animations'
      },
      
      system: {
        title: 'System Preferences',
        subtitle: 'Configure system behavior and performance options',
        language: 'Language Settings',
        languageCurrent: 'Current',
        timezone: 'Timezone Settings'
      },
      
      messages: {
        languageUpdated: 'Language settings updated',
        languageWillReload: 'Language switched, page will reload in 3 seconds to apply new language'
      }
    }
  }
}

// 当前语言
let currentLanguage = 'zh-CN'

// 获取翻译文本
export const t = (key, params = {}) => {
  const keys = key.split('.')
  let value = messages[currentLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // 如果当前语言没有找到，尝试使用中文作为后备
      let fallbackValue = messages['zh-CN']
      for (const fk of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
          fallbackValue = fallbackValue[fk]
        } else {
          return key // 都没找到就返回key
        }
      }
      return fallbackValue
    }
  }
  
  if (typeof value === 'string') {
    // 简单的参数替换
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match
    })
  }
  
  return key
}

// 设置语言
export const setLanguage = (lang) => {
  if (messages[lang]) {
    currentLanguage = lang
    // 更新HTML的lang属性
    document.documentElement.lang = lang
    return true
  }
  return false
}

// 获取当前语言
export const getCurrentLanguage = () => currentLanguage

// 获取支持的语言列表
export const getSupportedLanguages = () => Object.keys(messages)

// 初始化语言设置
export const initLanguage = (lang = 'zh-CN') => {
  const savedLang = localStorage.getItem('system_language') || lang
  setLanguage(savedLang)
  return currentLanguage
}

// 保存语言设置
export const saveLanguage = (lang) => {
  localStorage.setItem('system_language', lang)
  setLanguage(lang)
}