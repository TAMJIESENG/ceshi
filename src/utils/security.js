import CryptoJS from 'crypto-js'

// 密码安全相关
export class PasswordSecurity {
  // 生成随机盐值
  static generateSalt() {
    return CryptoJS.lib.WordArray.random(128/8).toString()
  }

  // 哈希密码
  static hashPassword(password, salt) {
    if (!salt) {
      salt = this.generateSalt()
    }
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString()
    return {
      hash: hash,
      salt: salt
    }
  }

  // 验证密码
  static verifyPassword(password, hash, salt) {
    const testHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString()
    return testHash === hash
  }

  // 密码强度检查
  static checkPasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    const score = Object.values(checks).filter(Boolean).length
    let strength = 'weak'
    
    if (score >= 4) strength = 'strong'
    else if (score >= 3) strength = 'medium'
    
    return {
      strength,
      score,
      checks,
      suggestions: this.getPasswordSuggestions(checks)
    }
  }

  static getPasswordSuggestions(checks) {
    const suggestions = []
    if (!checks.length) suggestions.push('密码至少需要8个字符')
    if (!checks.uppercase) suggestions.push('添加大写字母')
    if (!checks.lowercase) suggestions.push('添加小写字母')
    if (!checks.numbers) suggestions.push('添加数字')
    if (!checks.special) suggestions.push('添加特殊字符')
    return suggestions
  }
}

// 输入验证和过滤
export class InputValidator {
  // XSS防护 - HTML转义
  static escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // 清理HTML标签
  static stripHtml(html) {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  // SQL注入防护 - 基础过滤
  static sanitizeSqlInput(input) {
    if (typeof input !== 'string') return input
    
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
      'EXEC', 'EXECUTE', 'UNION', 'SCRIPT', '--', ';'
    ]
    
    // 需要转义的特殊字符模式
    const specialPatterns = [
      { pattern: /\/\*/g, replacement: '' }, // 匹配 /*
      { pattern: /\*\//g, replacement: '' }  // 匹配 */
    ]
    
    let sanitized = input
    
    // 先处理特殊字符模式
    specialPatterns.forEach(({ pattern, replacement }) => {
      sanitized = sanitized.replace(pattern, replacement)
    })
    
    // 再处理普通关键词
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi')
      sanitized = sanitized.replace(regex, '')
    })
    
    return sanitized.trim()
  }

  // 用户名验证
  static validateUsername(username) {
    const errors = []
    
    if (!username || username.length < 3) {
      errors.push('用户名至少需要3个字符')
    }
    
    if (username.length > 20) {
      errors.push('用户名不能超过20个字符')
    }
    
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      errors.push('用户名只能包含字母、数字、下划线和中文')
    }
    
    const forbiddenWords = ['root', 'system', 'test', '管理员']
    if (forbiddenWords.some(word => username.toLowerCase().includes(word))) {
      errors.push('用户名包含禁用词汇')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // 邮箱验证
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return {
      isValid: emailRegex.test(email),
      errors: emailRegex.test(email) ? [] : ['邮箱格式不正确']
    }
  }

  // 金额验证
  static validateAmount(amount) {
    const errors = []
    const numAmount = parseFloat(amount)
    
    if (isNaN(numAmount)) {
      errors.push('金额必须是数字')
    } else {
      if (numAmount < 0) errors.push('金额不能为负数')
      if (numAmount > 999999) errors.push('金额过大')
      if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
        errors.push('金额最多保留2位小数')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// 访问控制和限流
export class RateLimiter {
  constructor() {
    this.attempts = new Map()
    this.blocked = new Map()
  }

  // 检查是否被限制
  isBlocked(identifier) {
    const blockInfo = this.blocked.get(identifier)
    if (!blockInfo) return false
    
    if (Date.now() > blockInfo.until) {
      this.blocked.delete(identifier)
      this.attempts.delete(identifier)
      return false
    }
    
    return true
  }

  // 记录失败尝试
  recordFailure(identifier, maxAttempts = 5, blockDuration = 15 * 60 * 1000) {
    if (this.isBlocked(identifier)) return true
    
    const current = this.attempts.get(identifier) || { count: 0, firstAttempt: Date.now() }
    current.count++
    current.lastAttempt = Date.now()
    
    // 15分钟内的尝试才计数
    if (Date.now() - current.firstAttempt > 15 * 60 * 1000) {
      current.count = 1
      current.firstAttempt = Date.now()
    }
    
    this.attempts.set(identifier, current)
    
    if (current.count >= maxAttempts) {
      this.blocked.set(identifier, {
        until: Date.now() + blockDuration,
        attempts: current.count
      })
      return true
    }
    
    return false
  }

  // 重置尝试记录
  reset(identifier) {
    this.attempts.delete(identifier)
    this.blocked.delete(identifier)
  }

  // 获取剩余限制时间
  getBlockTimeRemaining(identifier) {
    const blockInfo = this.blocked.get(identifier)
    if (!blockInfo) return 0
    
    const remaining = blockInfo.until - Date.now()
    return Math.max(0, remaining)
  }
}

// CSRF保护
export class CSRFProtection {
  static generateToken() {
    return CryptoJS.lib.WordArray.random(256/8).toString()
  }

  static setToken() {
    const token = this.generateToken()
    sessionStorage.setItem('csrf_token', token)
    return token
  }

  static getToken() {
    return sessionStorage.getItem('csrf_token')
  }

  static validateToken(token) {
    const storedToken = this.getToken()
    return storedToken && storedToken === token
  }
}

// 操作日志
export class AuditLogger {
  static log(action, details = {}) {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      username: this.getCurrentUsername(),
      ip: 'client-side' // 实际应用中应从服务器获取
    }

    // 存储到localStorage
    const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]')
    logs.unshift(logEntry)
    
    // 只保留最近1000条记录
    if (logs.length > 1000) {
      logs.splice(1000)
    }
    
    localStorage.setItem('audit_logs', JSON.stringify(logs))
    
    // 开发环境下控制台输出
    if (import.meta.env.DEV) {
      console.log('🔍 Audit Log:', logEntry)
    }
  }

  static getCurrentUserId() {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      return userData.id || null
    } catch {
      return null
    }
  }

  static getCurrentUsername() {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      return userData.username || 'anonymous'
    } catch {
      return 'anonymous'
    }
  }

  static getLogs(limit = 100) {
    const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]')
    return logs.slice(0, limit)
  }

  static clearLogs() {
    localStorage.removeItem('audit_logs')
  }
}

// 数据加密
export class DataEncryption {
  static encrypt(data, key = 'default-key') {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
      return encrypted
    } catch (error) {
      console.error('Encryption failed:', error)
      return null
    }
  }

  static decrypt(encryptedData, key = 'default-key') {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }
}

// 安全存储
export class SecureStorage {
  static setItem(key, value, encrypt = false) {
    try {
      const data = encrypt ? DataEncryption.encrypt(value) : JSON.stringify(value)
      localStorage.setItem(key, data)
      
      // 记录存储操作
      AuditLogger.log('storage_write', { key, encrypted: encrypt })
    } catch (error) {
      console.error('Secure storage write failed:', error)
    }
  }

  static getItem(key, decrypt = false) {
    try {
      const data = localStorage.getItem(key)
      if (!data) return null
      
      const result = decrypt ? DataEncryption.decrypt(data) : JSON.parse(data)
      
      // 记录读取操作
      AuditLogger.log('storage_read', { key, decrypted: decrypt })
      
      return result
    } catch (error) {
      console.error('Secure storage read failed:', error)
      return null
    }
  }

  static removeItem(key) {
    localStorage.removeItem(key)
    AuditLogger.log('storage_delete', { key })
  }
}

// 导出所有安全工具
export const Security = {
  PasswordSecurity,
  InputValidator,
  RateLimiter,
  CSRFProtection,
  AuditLogger,
  DataEncryption,
  SecureStorage
}

export default Security