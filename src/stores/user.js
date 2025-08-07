import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import { PasswordSecurity, InputValidator, RateLimiter, AuditLogger } from '@/utils/security'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(Cookies.get('token') || null)
  const rateLimiter = new RateLimiter()
  
  // 获取当前IP地址（模拟）
  const getCurrentIP = () => {
    // 在实际生产环境中，这里会获取真实IP
    // 现在使用模拟的方式来测试功能
    let storedIP = localStorage.getItem('simulated_ip')
    if (!storedIP) {
      // 生成一个模拟的IP地址
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      localStorage.setItem('simulated_ip', ip)
      storedIP = ip
    }
    return storedIP
  }
  
  // 验证安全密钥
  const verifySecurityKey = async (securityKey, adminId) => {
    try {
      const validKeys = JSON.parse(localStorage.getItem('security_keys') || '[]')
      const currentTime = new Date().getTime()
      
      // 查找有效的密钥
      const keyRecord = validKeys.find(key => 
        key.key === securityKey && 
        key.isActive && 
        currentTime <= key.expirationTime
      )
      
      if (!keyRecord) {
        AuditLogger.log('security_key_invalid', {
          adminId,
          key: securityKey.substring(0, 8) + '...',
          timestamp: new Date().toISOString()
        })
        return { success: false, message: '安全密钥无效或已过期' }
      }
      
      // 密钥验证成功，标记为已使用
      keyRecord.isActive = false
      keyRecord.usedTime = new Date().toISOString()
      keyRecord.usedBy = adminId
      localStorage.setItem('security_keys', JSON.stringify(validKeys))
      
      AuditLogger.log('security_key_verified', {
        adminId,
        keyId: keyRecord.id,
        timestamp: new Date().toISOString()
      })
      
      return { success: true, message: '安全密钥验证成功' }
    } catch (error) {
      return { success: false, message: '密钥验证失败' }
    }
  }
  
  // 管理员安全登录（带安全密钥）
  const adminSecureLogin = async (credentials, securityKey) => {
    try {
      const users = JSON.parse(localStorage.getItem('all_users') || '[]')
      const adminUser = users.find(u => u.username.toLowerCase() === 'admin' && u.role === 'admin')
      
      if (!adminUser) {
        return { success: false, message: '管理员账号不存在' }
      }
      
      // 验证安全密钥
      const keyResult = await verifySecurityKey(securityKey, adminUser.id)
      if (!keyResult.success) {
        return keyResult
      }
      
      // 密钥验证成功，更新信任IP
      const currentIP = getCurrentIP()
      const adminSecurity = JSON.parse(localStorage.getItem('admin_security') || '{}')
      adminSecurity.trustedIP = currentIP
      adminSecurity.lastSecurityVerification = new Date().toISOString()
      localStorage.setItem('admin_security', JSON.stringify(adminSecurity))
      
      // 登录成功
      const newToken = `admin_token_${adminUser.id}_${Date.now()}`
      
      token.value = newToken
      user.value = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        registerTime: adminUser.registerTime,
        balance: adminUser.balance || 0,
        avatar: adminUser.avatar || '',
        phone: adminUser.phone || '',
        realName: adminUser.realName || '',
        bio: adminUser.bio || '',
        level: adminUser.level || 'SVIP',
        twoFactorEnabled: adminUser.twoFactorEnabled || false,
        emailVerified: adminUser.emailVerified || true
      }
      
      localStorage.setItem('user_token', newToken)
      localStorage.setItem('user_data', JSON.stringify(user.value))
      Cookies.set('token', newToken, { expires: 7 })
      
      AuditLogger.log('admin_secure_login_success', {
        username: adminUser.username,
        userId: adminUser.id,
        newTrustedIP: currentIP,
        timestamp: new Date().toISOString()
      })
      
      return { success: true, message: '管理员安全登录成功', isAdmin: true }
    } catch (error) {
      return { success: false, message: '安全登录失败' }
    }
  }
  
  // 模拟IP变化（用于测试）
  const simulateIPChange = () => {
    const newIP = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    localStorage.setItem('simulated_ip', newIP)
    console.log(`🔄 模拟IP变化: ${newIP}`)
    return newIP
  }

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 初始化时从 localStorage 加载用户数据
  const initializeUser = () => {
    const savedToken = localStorage.getItem('user_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      const userData = JSON.parse(savedUser)
      
      // 从all_users中获取最新的用户数据，确保余额等信息是最新的
      try {
        const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
        const currentUser = allUsers.find(u => String(u.id) === String(userData.id))
        
        if (currentUser) {
          // 合并用户数据，确保包含最新的余额等信息
          user.value = {
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser.role || 'user',
            registerTime: currentUser.registerTime,
            balance: currentUser.balance || 0,
            level: currentUser.level,
            lastBalanceUpdate: currentUser.lastBalanceUpdate,
            avatar: currentUser.avatar || '',
            phone: currentUser.phone || '',
            realName: currentUser.realName || '',
            bio: currentUser.bio || '',
            twoFactorEnabled: currentUser.twoFactorEnabled || false,
            emailVerified: currentUser.emailVerified || false
          }
          
          // 更新本地存储的用户数据
          localStorage.setItem('user_data', JSON.stringify(user.value))
        } else {
          user.value = userData
        }
      } catch (error) {
        user.value = userData
      }
      
      Cookies.set('token', savedToken, { expires: 7 })
    }
  }

  const login = async (credentials) => {
    try {
      // 检查是否为管理员登录
      const isAdminLogin = credentials.username.toLowerCase() === 'admin'
      
      if (isAdminLogin) {
        console.log('🛡️ 检测到管理员登录，启用高级安全检测...')
        
        // 管理员登录：启用完整安全检查
        const users = JSON.parse(localStorage.getItem('all_users') || '[]')
        const adminUser = users.find(u => u.username.toLowerCase() === 'admin' && u.role === 'admin')
        
        if (!adminUser) {
          return { success: false, message: '管理员账号不存在' }
        }
        
        // 密码验证
        let isPasswordValid = false
        if (adminUser.password) {
          isPasswordValid = adminUser.password === credentials.password
        }
        
        if (!isPasswordValid) {
          console.log('❌ 管理员密码验证失败')
          AuditLogger.log('admin_login_failed', { 
            username: credentials.username,
            reason: 'invalid_password',
            securityMode: 'enabled',
            timestamp: new Date().toISOString()
          })
          return { success: false, message: '管理员密码错误' }
        }
        
        // IP安全检测
        const currentIP = getCurrentIP()
        const adminSecurity = JSON.parse(localStorage.getItem('admin_security') || '{}')
        const trustedIP = adminSecurity.trustedIP
        
        console.log(`🔍 IP安全检测: 当前IP=${currentIP}, 信任IP=${trustedIP}`)
        
        // 如果是第一次登录或IP发生变化
        if (!trustedIP) {
          // 首次登录，记录IP
          adminSecurity.trustedIP = currentIP
          adminSecurity.firstLoginTime = new Date().toISOString()
          localStorage.setItem('admin_security', JSON.stringify(adminSecurity))
          console.log('✅ 首次管理员登录，IP已记录为信任IP')
        } else if (currentIP !== trustedIP) {
          // IP变化，需要安全验证
          console.log('⚠️ 检测到IP变化，需要安全密钥验证')
          AuditLogger.log('admin_ip_change_detected', {
            username: credentials.username,
            trustedIP: trustedIP,
            currentIP: currentIP,
            timestamp: new Date().toISOString()
          })
          
          return { 
            success: false, 
            requireSecurityKey: true,
            message: '检测到IP地址变化，需要安全密钥验证',
            securityData: {
              trustedIP,
              currentIP,
              adminId: adminUser.id
            }
          }
        }
        
        // 管理员IP验证通过，登录成功
        console.log('✅ 管理员IP验证通过')
        const newToken = `admin_token_${adminUser.id}_${Date.now()}`
        
        // 更新最后登录信息
        adminSecurity.lastLoginTime = new Date().toISOString()
        adminSecurity.lastLoginIP = currentIP
        localStorage.setItem('admin_security', JSON.stringify(adminSecurity))
        
        token.value = newToken
        user.value = {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          registerTime: adminUser.registerTime,
          balance: adminUser.balance || 0,
          avatar: adminUser.avatar || '',
          phone: adminUser.phone || '',
          realName: adminUser.realName || '',
          bio: adminUser.bio || '',
          level: adminUser.level || 'SVIP',
          twoFactorEnabled: adminUser.twoFactorEnabled || false,
          emailVerified: adminUser.emailVerified || true
        }
        
        // 保存会话信息
        localStorage.setItem('user_token', newToken)
        localStorage.setItem('user_data', JSON.stringify(user.value))
        Cookies.set('token', newToken, { expires: 7 })
        
        // 记录管理员成功登录（注明安全功能已关闭）
        AuditLogger.log('admin_login_success', { 
          username: adminUser.username,
          userId: adminUser.id,
          role: adminUser.role,
          securityMode: 'disabled_during_login',
          timestamp: new Date().toISOString()
        })
        
        console.log('✅ 管理员登录成功，重新启用安全功能')
        
        return { success: true, isAdmin: true }
        
      } else {
        // 普通用户登录：启用完整安全功能
        console.log('🔒 普通用户登录，启用完整安全功能')
        
        // 输入验证
        const usernameValidation = InputValidator.validateUsername(credentials.username)
        if (!usernameValidation.isValid) {
          AuditLogger.log('login_attempt_invalid_username', { 
            username: credentials.username,
            errors: usernameValidation.errors 
          })
          return { success: false, message: '用户名格式不正确' }
        }

        // 清理输入
        const cleanUsername = InputValidator.sanitizeSqlInput(credentials.username.trim())
        const clientIP = 'client-' + Math.random().toString(36).substr(2, 9) // 模拟IP

        // 检查登录限流
        if (rateLimiter.isBlocked(cleanUsername) || rateLimiter.isBlocked(clientIP)) {
          const blockTime = Math.max(
            rateLimiter.getBlockTimeRemaining(cleanUsername),
            rateLimiter.getBlockTimeRemaining(clientIP)
          )
          const minutes = Math.ceil(blockTime / (1000 * 60))
          
          AuditLogger.log('login_blocked', { 
            username: cleanUsername, 
            blockTimeMinutes: minutes,
            reason: 'rate_limit'
          })
          
          return { 
            success: false, 
            message: `登录失败次数过多，请 ${minutes} 分钟后再试` 
          }
        }

        // 从 localStorage 获取所有用户
        const users = JSON.parse(localStorage.getItem('all_users') || '[]')
        
        // 查找用户
        const foundUser = users.find(u => u.username === cleanUsername)
        
        if (!foundUser) {
          // 记录失败尝试
          rateLimiter.recordFailure(cleanUsername)
          rateLimiter.recordFailure(clientIP)
          
          AuditLogger.log('login_failed', { 
            username: cleanUsername,
            reason: 'user_not_found',
            timestamp: new Date().toISOString()
          })
          
          return { success: false, message: '用户名或密码错误' }
        }

        // 验证密码（完整安全验证）
        let isPasswordValid = false
        
        try {
          // 优先使用明文密码验证
          if (foundUser.password) {
            isPasswordValid = foundUser.password === credentials.password
          }
          
          // 如果明文密码验证失败，且存在哈希密码，则尝试哈希验证
          if (!isPasswordValid && foundUser.passwordHash && foundUser.passwordSalt) {
            isPasswordValid = PasswordSecurity.verifyPassword(credentials.password, foundUser.passwordHash, foundUser.passwordSalt)
          }
        } catch (error) {
          console.error('密码验证过程出错:', error)
          // 如果所有验证都出错，强制使用明文密码验证作为后备
          if (foundUser.password) {
            isPasswordValid = foundUser.password === credentials.password
          }
        }

        if (!isPasswordValid) {
          // 记录失败尝试
          rateLimiter.recordFailure(cleanUsername)
          rateLimiter.recordFailure(clientIP)
          
          AuditLogger.log('login_failed', { 
            username: cleanUsername,
            reason: 'invalid_password',
            timestamp: new Date().toISOString()
          })
          
          return { success: false, message: '用户名或密码错误' }
        }

        // 登录成功，重置限流计数
        rateLimiter.reset(cleanUsername)
        rateLimiter.reset(clientIP)
        
        // 生成简单的 token
        const newToken = `token_${foundUser.id}_${Date.now()}`
        
        token.value = newToken
        user.value = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: foundUser.role || 'user',
          registerTime: foundUser.registerTime,
          balance: foundUser.balance || 0,
          avatar: foundUser.avatar || '',
          phone: foundUser.phone || '',
          realName: foundUser.realName || '',
          bio: foundUser.bio || '',
          level: foundUser.level || '普通',
          twoFactorEnabled: foundUser.twoFactorEnabled || false,
          emailVerified: foundUser.emailVerified || false
        }
        
        // 保存到 localStorage 和 Cookies
        localStorage.setItem('user_token', newToken)
        localStorage.setItem('user_data', JSON.stringify(user.value))
        Cookies.set('token', newToken, { expires: 7 })
        
        // 记录成功登录
        AuditLogger.log('login_success', { 
          username: cleanUsername,
          userId: foundUser.id,
          role: foundUser.role || 'user',
          securityMode: 'enabled',
          timestamp: new Date().toISOString()
        })
        
        return { success: true, isAdmin: false }
      }
    } catch (error) {
      console.error('登录过程出现异常:', error)
      return { success: false, message: '登录失败' }
    }
  }

  const register = async (userData) => {
    try {
      // 输入验证
      const usernameValidation = InputValidator.validateUsername(userData.username)
      if (!usernameValidation.isValid) {
        AuditLogger.log('register_attempt_invalid_username', { 
          username: userData.username,
          errors: usernameValidation.errors 
        })
        return { success: false, message: usernameValidation.errors[0] }
      }

      const emailValidation = InputValidator.validateEmail(userData.email)
      if (!emailValidation.isValid) {
        AuditLogger.log('register_attempt_invalid_email', { 
          email: userData.email,
          errors: emailValidation.errors 
        })
        return { success: false, message: emailValidation.errors[0] }
      }

      // 密码强度检查
      const passwordStrength = PasswordSecurity.checkPasswordStrength(userData.password)
      if (passwordStrength.strength === 'weak') {
        AuditLogger.log('register_attempt_weak_password', { 
          username: userData.username,
          suggestions: passwordStrength.suggestions 
        })
        return { 
          success: false, 
          message: `密码强度不足: ${passwordStrength.suggestions.join(', ')}` 
        }
      }

      // 清理输入
      const cleanUsername = InputValidator.sanitizeSqlInput(userData.username.trim())
      const cleanEmail = InputValidator.sanitizeSqlInput(userData.email.trim())

      // 从 localStorage 获取所有用户
      const users = JSON.parse(localStorage.getItem('all_users') || '[]')
      
      // 检查用户名是否已存在
      const existingUser = users.find(u => 
        u.username === cleanUsername || u.email === cleanEmail
      )
      
      if (existingUser) {
        AuditLogger.log('register_failed', { 
          username: cleanUsername,
          email: cleanEmail,
          reason: 'user_exists'
        })
        return { success: false, message: '用户名或邮箱已存在' }
      }

      // 生成密码哈希
      const passwordHash = PasswordSecurity.hashPassword(userData.password)
      
      // 创建新用户
      const newUser = {
        id: Date.now(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash: passwordHash.hash,
        passwordSalt: passwordHash.salt,
        // 保留明文密码用于兼容（实际生产环境应删除）
        password: userData.password,
        role: 'user',
        registerTime: new Date().toLocaleString('zh-CN'),
        balance: 0,
        level: '普通',
        twoFactorEnabled: false,
        emailVerified: false,
        lastLogin: null,
        loginAttempts: 0
      }
      
      // 添加到用户列表
      users.push(newUser)
      localStorage.setItem('all_users', JSON.stringify(users))

      // 记录注册成功
      AuditLogger.log('register_success', { 
        username: cleanUsername,
        email: cleanEmail,
        userId: newUser.id,
        timestamp: new Date().toISOString()
      })
      
      return { success: true, message: '注册成功' }
    } catch (error) {
      return { success: false, message: '注册失败' }
    }
  }

  const logout = () => {
    // 记录登出操作
    if (user.value) {
      AuditLogger.log('logout', { 
        username: user.value.username,
        userId: user.value.id,
        timestamp: new Date().toISOString()
      })
    }

    token.value = null
    user.value = null
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    Cookies.remove('token')
  }

  // 更新用户余额
  const updateUserBalance = async (userId, newBalance, reason = '') => {
    try {
      const users = JSON.parse(localStorage.getItem('all_users') || '[]')
      const userIndex = users.findIndex(u => String(u.id) === String(userId))
      
      if (userIndex === -1) {
        return { success: false, message: '用户不存在' }
      }

      const oldBalance = users[userIndex].balance || 0
      users[userIndex].balance = parseFloat(newBalance)
      users[userIndex].lastBalanceUpdate = new Date().toLocaleString('zh-CN')
      
      // 保存余额变更记录
      const balanceHistory = JSON.parse(localStorage.getItem('balance_history') || '[]')
      balanceHistory.push({
        id: Date.now(),
        userId: userId,
        username: users[userIndex].username,
        oldBalance: oldBalance,
        newBalance: parseFloat(newBalance),
        change: parseFloat(newBalance) - oldBalance,
        reason: reason || '管理员手动调整',
        operatorType: 'admin',
        createTime: new Date().toLocaleString('zh-CN')
      })

      localStorage.setItem('all_users', JSON.stringify(users))
      localStorage.setItem('balance_history', JSON.stringify(balanceHistory))

      // 如果是当前登录用户，更新本地用户数据
      if (user.value && String(user.value.id) === String(userId)) {
        user.value.balance = parseFloat(newBalance)
        localStorage.setItem('user_data', JSON.stringify(user.value))
      }

      return { 
        success: true, 
        message: `用户余额已更新：${oldBalance} → ${newBalance}` 
      }
    } catch (error) {
      return { success: false, message: '更新余额失败' }
    }
  }

  // 获取用户余额
  const getUserBalance = (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('all_users') || '[]')
      const foundUser = users.find(u => String(u.id) === String(userId))
      return foundUser ? (foundUser.balance || 0) : 0
    } catch (error) {
      return 0
    }
  }

  // 扣除用户余额（用于购买）
  const deductBalance = async (userId, amount, reason = '') => {
    try {
      const users = JSON.parse(localStorage.getItem('all_users') || '[]')
      const userIndex = users.findIndex(u => String(u.id) === String(userId))
      
      if (userIndex === -1) {
        return { success: false, message: '用户不存在' }
      }

      const currentBalance = users[userIndex].balance || 0
      if (currentBalance < amount) {
        return { success: false, message: '余额不足' }
      }

      const newBalance = currentBalance - amount
      const result = await updateUserBalance(userId, newBalance, reason)
      
      return result
    } catch (error) {
      return { success: false, message: '扣除余额失败' }
    }
  }

  // 获取余额变更历史
  const getBalanceHistory = (userId = null) => {
    try {
      const history = JSON.parse(localStorage.getItem('balance_history') || '[]')
      if (userId) {
        return history.filter(record => String(record.userId) === String(userId))
      }
      return history.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    } catch (error) {
      return []
    }
  }

  // 刷新当前用户数据
  const refreshCurrentUser = () => {
    if (!user.value) return
    
    try {
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const currentUser = allUsers.find(u => String(u.id) === String(user.value.id))
      
      if (currentUser) {
        // 更新用户数据，保持响应式
        user.value.balance = currentUser.balance || 0
        user.value.level = currentUser.level || '普通'
        user.value.lastBalanceUpdate = currentUser.lastBalanceUpdate
        user.value.email = currentUser.email
        user.value.role = currentUser.role
        user.value.avatar = currentUser.avatar || ''
        user.value.phone = currentUser.phone || user.value.phone
        user.value.realName = currentUser.realName || user.value.realName
        user.value.bio = currentUser.bio || user.value.bio
        user.value.vipExpireTime = currentUser.vipExpireTime
        user.value.vipUpgradeTime = currentUser.vipUpgradeTime
        
        // 更新本地存储
        localStorage.setItem('user_data', JSON.stringify(user.value))
      }
    } catch (error) {
      console.error('刷新用户数据失败:', error)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    initializeUser,
    updateUserBalance,
    getUserBalance,
    deductBalance,
    getBalanceHistory,
    refreshCurrentUser,
    getCurrentIP,
    verifySecurityKey,
    adminSecureLogin,
    simulateIPChange
  }
})