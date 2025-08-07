// 初始化默认管理员账号
export function initializeDefaultAdmin() {
  try {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]')
    
    // 检查是否已有管理员账号
    const existingAdmin = users.find(user => user.role === 'admin')
    
    if (!existingAdmin) {
      console.log('🔧 创建默认管理员账号...')
      
      const defaultAdmin = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // 明文密码，便于首次登录
        role: 'admin',
        registerTime: new Date().toLocaleString('zh-CN'),
        balance: 0,
        level: '管理员',
        twoFactorEnabled: false,
        emailVerified: true,
        lastLogin: null,
        loginAttempts: 0
      }
      
      users.push(defaultAdmin)
      localStorage.setItem('all_users', JSON.stringify(users))
      
      console.log('✅ 默认管理员账号已创建')
      console.log('   用户名: admin')
      console.log('   密码: admin123')
    } else {
      // 确保现有管理员账号有明文密码（向后兼容）
      if (!existingAdmin.password && existingAdmin.passwordHash) {
        console.log('🔧 修复管理员账号兼容性...')
        existingAdmin.password = 'admin123' // 设置默认密码
        localStorage.setItem('all_users', JSON.stringify(users))
        console.log('✅ 管理员账号已修复，密码: admin123')
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ 初始化管理员账号失败:', error)
    return false
  }
}

// 检查并修复用户数据
export function checkAndFixUserData() {
  try {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]')
    let needsUpdate = false
    
    users.forEach(user => {
      // 确保所有用户都有必要的字段
      if (!user.registerTime) {
        user.registerTime = new Date().toLocaleString('zh-CN')
        needsUpdate = true
      }
      
      if (!user.balance && user.balance !== 0) {
        user.balance = 0
        needsUpdate = true
      }
      
      if (!user.level) {
        user.level = user.role === 'admin' ? '管理员' : '普通'
        needsUpdate = true
      }
      
      if (user.twoFactorEnabled === undefined) {
        user.twoFactorEnabled = false
        needsUpdate = true
      }
      
      if (user.emailVerified === undefined) {
        user.emailVerified = false
        needsUpdate = true
      }
      
      if (!user.loginAttempts) {
        user.loginAttempts = 0
        needsUpdate = true
      }
    })
    
    if (needsUpdate) {
      localStorage.setItem('all_users', JSON.stringify(users))
      console.log('✅ 用户数据已修复')
    }
    
    return true
  } catch (error) {
    console.error('❌ 修复用户数据失败:', error)
    return false
  }
}