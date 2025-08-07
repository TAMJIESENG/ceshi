import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { initializeSampleData } from '@/utils/initialize'
import I18nPlugin, { initI18n } from '@/plugins/i18n'
import '@/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(I18nPlugin)

// 初始化用户数据
const userStore = useUserStore()
userStore.initializeUser()

// 初始化设置并应用
const settingsStore = useSettingsStore()
settingsStore.loadSettings()
settingsStore.applyAppearance()

// 初始化国际化
const savedLanguage = settingsStore.settings.system.language || 'zh-CN'
initI18n(savedLanguage)

// 初始化默认管理员账号（确保总是可用）
const initializeDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem('all_users') || '[]')
  
  // 查找现有管理员账号
  let adminUser = users.find(user => user.role === 'admin')
  
  if (!adminUser) {
    console.log('🔧 创建默认管理员账号...')
    const defaultAdmin = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // 明文密码
      role: 'admin',
      registerTime: new Date().toLocaleString('zh-CN'),
      balance: 10000,
      level: 'SVIP',
      twoFactorEnabled: false,
      emailVerified: true,
      loginAttempts: 0
    }
    
    users.push(defaultAdmin)
    localStorage.setItem('all_users', JSON.stringify(users))
    console.log('✅ 默认管理员账号已创建: admin/admin123')
  } else {
    // 确保现有管理员账号有明文密码（向后兼容）
    if (!adminUser.password) {
      console.log('🔧 修复管理员账号密码...')
      adminUser.password = 'admin123'
      localStorage.setItem('all_users', JSON.stringify(users))
      console.log('✅ 管理员账号密码已修复: admin123')
    }
    
    // 确保管理员有所有必要字段
    let needsUpdate = false
    if (!adminUser.loginAttempts) {
      adminUser.loginAttempts = 0
      needsUpdate = true
    }
    if (adminUser.twoFactorEnabled === undefined) {
      adminUser.twoFactorEnabled = false
      needsUpdate = true
    }
    if (adminUser.emailVerified === undefined) {
      adminUser.emailVerified = true
      needsUpdate = true
    }
    
    if (needsUpdate) {
      localStorage.setItem('all_users', JSON.stringify(users))
      console.log('✅ 管理员账号数据已更新')
    }
    
    console.log(`✅ 管理员账号已就绪: ${adminUser.username}/admin123`)
  }
}

initializeDefaultAdmin()

// 初始化示例数据
initializeSampleData()

// 开发者工具配置 - 仅管理员可用
const initializeDevTools = () => {
  if (process.env.NODE_ENV !== 'development') return
  
  // 检查用户权限的函数
  const checkAdminAccess = () => {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
    return userData.role === 'admin'
  }
  
  // 启用开发者工具的函数
  const enableDevTools = () => {
    if (!checkAdminAccess()) {
      console.warn('🔒 开发者工具仅限管理员用户使用')
      return
    }
    
    // 启用 Vue 开发者工具
    app.config.devtools = true
    app.config.debug = true
    
    // 添加全局调试信息
    window.__APP_DEBUG__ = {
      userStore,
      localStorage: {
        all_users: () => JSON.parse(localStorage.getItem('all_users') || '[]'),
        user_data: () => JSON.parse(localStorage.getItem('user_data') || '{}'),
        all_cards: () => JSON.parse(localStorage.getItem('all_cards') || '[]'),
        balance_history: () => JSON.parse(localStorage.getItem('balance_history') || '[]')
      },
      utils: {
        clearAllData: () => {
          localStorage.clear()
          window.location.reload()
        },
        createTestUser: (username = 'testuser', role = 'user') => {
          const users = JSON.parse(localStorage.getItem('all_users') || '[]')
          const newUser = {
            id: Date.now(),
            username,
            email: `${username}@test.com`,
            password: 'test123',
            role,
            registerTime: new Date().toLocaleString('zh-CN'),
            balance: role === 'admin' ? 10000 : 100,
            level: role === 'admin' ? 'SVIP' : '普通',
            twoFactorEnabled: false,
            emailVerified: true
          }
          users.push(newUser)
          localStorage.setItem('all_users', JSON.stringify(users))
          console.log(`创建测试用户: ${username}/test123`)
          return newUser
        },
        createTestCards: (type = 'monthly', count = 10) => {
          const cards = JSON.parse(localStorage.getItem('all_cards') || '[]')
          const cardTypes = {
            monthly: { name: '月卡', value: '¥29.90' },
            quarterly: { name: '季卡', value: '¥79.90' },
            yearly: { name: '年卡', value: '¥299.90' }
          }
          
          for (let i = 0; i < count; i++) {
            const cardNumber = `CARD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            const card = {
              id: Date.now() + i,
              cardNumber,
              cardType: cardTypes[type].name,
              value: cardTypes[type].value,
              status: 'unused',
              createTime: new Date().toLocaleString('zh-CN'),
              useTime: null,
              expireTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
            }
            cards.push(card)
          }
          
          localStorage.setItem('all_cards', JSON.stringify(cards))
          console.log(`创建 ${count} 张${cardTypes[type].name}测试卡密`)
          return cards.slice(-count)
        }
      }
    }
    
    console.log('🔧 管理员开发者工具已启用')
    console.log('📊 可用调试命令:')
    console.log('  __APP_DEBUG__.localStorage.all_users() - 查看所有用户')
    console.log('  __APP_DEBUG__.localStorage.user_data() - 查看当前用户')
    console.log('  __APP_DEBUG__.localStorage.all_cards() - 查看所有卡密')
    console.log('  __APP_DEBUG__.localStorage.balance_history() - 查看余额历史')
    console.log('  __APP_DEBUG__.utils.clearAllData() - 清空所有数据')
    console.log('  __APP_DEBUG__.utils.createTestUser("用户名", "角色") - 创建测试用户')
    console.log('  __APP_DEBUG__.utils.createTestCards("类型", 数量) - 创建测试卡密')
  }
  
  // 监听登录状态变化
  const originalSetItem = localStorage.setItem
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments)
    
    // 当用户数据更新时检查权限
    if (key === 'user_data') {
      setTimeout(() => {
        const userData = JSON.parse(value || '{}')
        if (userData.role === 'admin' && !window.__APP_DEBUG__) {
          enableDevTools()
        } else if (userData.role !== 'admin' && window.__APP_DEBUG__) {
          // 管理员权限被撤销，移除开发者工具
          delete window.__APP_DEBUG__
          console.log('🔒 开发者工具已禁用 - 非管理员用户')
        }
      }, 100)
    }
  }
  
  // 监听登出
  const originalRemoveItem = localStorage.removeItem
  localStorage.removeItem = function(key) {
    originalRemoveItem.apply(this, arguments)
    
    if (key === 'user_data' && window.__APP_DEBUG__) {
      delete window.__APP_DEBUG__
      console.log('🔒 开发者工具已禁用 - 用户已登出')
    }
  }
  
  // 初始检查
  setTimeout(() => {
    if (checkAdminAccess()) {
      enableDevTools()
    }
  }, 1000)
}

initializeDevTools()

app.mount('#app')