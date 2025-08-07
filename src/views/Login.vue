<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-shape shape-1"></div>
      <div class="decoration-shape shape-2"></div>
      <div class="decoration-shape shape-3"></div>
    </div>
    
    <div class="login-container">
      <!-- 品牌logo区域 -->
      <div class="brand-section">
        <div class="brand-logo">
          <div class="logo-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M24 12L36 18V30L24 36L12 30V18L24 12Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="24" cy="24" r="4" fill="currentColor"/>
            </svg>
          </div>
          <h1 class="brand-title">SecureCard</h1>
          <p class="brand-subtitle">企业级卡密管理系统</p>
        </div>
      </div>
      
      <!-- 登录表单区域 -->
      <div class="login-form-section">
        <div class="form-header">
          <h2>登录您的账户</h2>
          <p>欢迎回来，请输入您的登录信息</p>
        </div>
        
        <!-- 维护模式提示 -->
        <div v-if="isMaintenanceActive" class="maintenance-notice">
          <div class="maintenance-alert">
            <div class="alert-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="alert-content">
              <h4>系统维护中</h4>
              <p>当前系统正在进行维护，仅允许管理员登录。普通用户请稍后重试。</p>
            </div>
          </div>
        </div>
        
        <el-form 
          :model="loginForm" 
          :rules="rules" 
          ref="loginFormRef" 
          class="login-form"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username" class="form-field">
            <div class="field-label">
              <label>用户名</label>
            </div>
            <div class="input-wrapper">
              <div class="input-prefix">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <el-input 
                v-model="loginForm.username" 
                placeholder="输入用户名或邮箱"
                class="custom-input"
              />
            </div>
          </el-form-item>
          
          <el-form-item prop="password" class="form-field">
            <div class="field-label">
              <label>密码</label>
              <a href="#" class="forgot-link" @click.prevent>忘记密码？</a>
            </div>
            <div class="input-wrapper">
              <div class="input-prefix">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="输入密码"
                show-password
                class="custom-input"
              />
            </div>
          </el-form-item>
          
          <el-form-item prop="captcha" class="form-field">
            <div class="field-label">
              <label>验证码</label>
            </div>
            <div class="captcha-wrapper">
              <div class="input-wrapper captcha-input">
                <div class="input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <el-input 
                  v-model="loginForm.captcha" 
                  placeholder="输入验证码"
                  class="custom-input"
                  maxlength="4"
                />
              </div>
              <div class="captcha-image-container">
                <canvas
                  ref="captchaCanvas"
                  class="captcha-canvas"
                  width="120"
                  height="40"
                  @click="refreshCaptcha"
                  :title="'点击刷新验证码'"
                ></canvas>
              </div>
              <button 
                type="button" 
                class="refresh-btn" 
                @click="refreshCaptcha"
                title="刷新验证码"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
          </el-form-item>
          
          <div class="form-options">
            <el-checkbox v-model="loginForm.remember" class="remember-checkbox">
              记住我7天
            </el-checkbox>
          </div>
          
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleLogin"
            class="login-button"
          >
            <span v-if="!loading">登录账户</span>
            <span v-else>正在验证...</span>
          </el-button>
        </el-form>
        
        <div class="form-divider">
          <span>或</span>
        </div>
        
        <div class="alternative-actions">
          <button class="alt-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            使用Google登录
          </button>
        </div>
        
        <div class="form-footer">
          <p>还没有账户？ <router-link to="/register" class="signup-link">免费注册</router-link></p>
          <div class="footer-links">
            <router-link to="/" class="footer-link">返回首页</router-link>
            <span class="divider">•</span>
            <a href="#" class="footer-link" @click.prevent>帮助中心</a>
            <span class="divider">•</span>
            <a href="#" class="footer-link" @click.prevent>隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useMaintenanceStore } from '@/stores/maintenance'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const maintenanceStore = useMaintenanceStore()

const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
}

const captchaCanvas = ref()
const captchaText = ref('')

const isMaintenanceActive = computed(() => {
  return maintenanceStore.isMaintenanceActive()
})

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let text = ''
  for (let i = 0; i < 4; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = text
  drawCaptcha(text)
}

// 绘制验证码
const drawCaptcha = (text) => {
  if (!captchaCanvas.value) return
  
  const canvas = captchaCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 设置背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#f8fafc')
  gradient.addColorStop(1, '#e2e8f0')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制干扰线
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`
    ctx.lineWidth = 1
    ctx.stroke()
  }
  
  // 绘制文字
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const x = (canvas.width / 4) * i + (canvas.width / 8)
    const y = canvas.height / 2 + (Math.random() - 0.5) * 6
    const angle = (Math.random() - 0.5) * 0.3
    
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 70%, 45%)`
    ctx.fillText(char, 0, 0)
    ctx.restore()
  }
  
  // 绘制干扰点
  for (let i = 0; i < 50; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI)
    ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
    ctx.fill()
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha()
  loginForm.captcha = ''
}

// 验证验证码
const validateCaptcha = (captcha) => {
  return captcha.toLowerCase() === captchaText.value.toLowerCase()
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      // 验证验证码
      if (!validateCaptcha(loginForm.captcha)) {
        ElMessage.error('验证码错误，请重新输入')
        refreshCaptcha()
        return
      }
      
      loading.value = true
      
      try {
        // 尝试登录
        const result = await userStore.login({
          username: loginForm.username,
          password: loginForm.password
        })
        
        if (result.success) {
          // 登录成功
          if (result.isAdmin) {
            ElMessage.success('管理员登录成功')
            router.push('/admin')
          } else {
            // 检查维护模式
            if (isMaintenanceActive.value) {
              userStore.logout()
              ElMessage.error('系统维护中，仅允许管理员登录')
              refreshCaptcha()
              return
            }
            ElMessage.success('登录成功')
            router.push('/dashboard')
          }
        } else if (result.requireSecurityKey) {
          // 需要安全密钥验证
          ElMessage.warning('检测到IP地址变化，需要安全验证')
          
          // 保存临时数据用于安全验证
          sessionStorage.setItem('security_verification_data', JSON.stringify(result.securityData))
          sessionStorage.setItem('admin_temp_password', loginForm.password)
          
          // 跳转到安全验证页面
          router.push('/security-verification')
        } else {
          // 登录失败
          ElMessage.error(result.message || '登录失败')
          refreshCaptcha()
        }
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  // 检查维护模式状态
  maintenanceStore.checkMaintenanceMode()
  // 初始化验证码
  setTimeout(() => {
    generateCaptcha()
  }, 100)
})
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
  
  &.shape-1 {
    width: 520px;
    height: 520px;
    top: -260px;
    right: -260px;
    animation: float 8s ease-in-out infinite;
  }
  
  &.shape-2 {
    width: 320px;
    height: 320px;
    bottom: -160px;
    left: -160px;
    animation: float 10s ease-in-out infinite reverse;
  }
  
  &.shape-3 {
    width: 200px;
    height: 200px;
    top: 20%;
    left: 10%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(101, 163, 13, 0.1) 100%);
    animation: float 12s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0px) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
}

.login-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 480px;
    padding: 40px 20px;
  }
}

.brand-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 60px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 1024px) {
    display: none;
  }
}

.brand-logo {
  text-align: center;
  animation: slideInLeft 0.8s ease-out;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.login-form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 60px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  
  @media (max-width: 1024px) {
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  @media (max-width: 640px) {
    padding: 32px 24px;
  }
}

.form-header {
  margin-bottom: 32px;
  animation: slideInRight 0.8s ease-out;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    line-height: 1.2;
  }
  
  p {
    color: #64748b;
    font-size: 16px;
    margin: 0;
    line-height: 1.5;
  }
}

.maintenance-notice {
  margin-bottom: 24px;
  animation: slideInDown 0.6s ease-out;
}

.maintenance-alert {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .alert-icon {
    color: #d97706;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .alert-content {
    flex: 1;
    
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #92400e;
      margin: 0 0 4px 0;
    }
    
    p {
      font-size: 13px;
      color: #a16207;
      margin: 0;
      line-height: 1.4;
    }
  }
}

.login-form {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.form-field {
  margin-bottom: 24px;
  
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
  
  :deep(.el-form-item__error) {
    font-size: 13px;
    color: #ef4444;
    margin-top: 6px;
    padding-left: 4px;
  }
}

.field-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }
  
  .forgot-link {
    font-size: 13px;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    
    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  
  .input-prefix {
    position: absolute;
    left: 16px;
    color: #6b7280;
    z-index: 10;
    display: flex;
    align-items: center;
  }
  
  .custom-input {
    :deep(.el-input__wrapper) {
      background: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 0 16px 0 48px;
      height: 48px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      
      &:hover {
        border-color: #d1d5db;
      }
      
      &.is-focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    :deep(.el-input__inner) {
      font-size: 15px;
      color: #111827;
      
      &::placeholder {
        color: #9ca3af;
      }
    }
  }
}

.form-options {
  margin-bottom: 32px;
  
  .remember-checkbox {
    :deep(.el-checkbox__label) {
      font-size: 14px;
      color: #4b5563;
      font-weight: 500;
    }
    
    :deep(.el-checkbox__input) {
      .el-checkbox__inner {
        border-color: #d1d5db;
        border-radius: 4px;
        
        &:hover {
          border-color: #3b82f6;
        }
      }
      
      &.is-checked .el-checkbox__inner {
        background-color: #3b82f6;
        border-color: #3b82f6;
      }
    }
  }
}

.login-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.5);
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  &.is-loading {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 14px 0 rgba(148, 163, 184, 0.39);
    }
  }
}

.form-divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
  
  span {
    background: rgba(255, 255, 255, 0.8);
    padding: 0 16px;
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  }
}

.alternative-actions {
  margin-bottom: 32px;
}

.alt-button {
  width: 100%;
  height: 48px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.form-footer {
  text-align: center;
  
  p {
    font-size: 15px;
    color: #6b7280;
    margin: 0 0 16px 0;
    
    .signup-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
      
      &:hover {
        color: #2563eb;
        text-decoration: underline;
      }
    }
  }
  
  .footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    
    .footer-link {
      font-size: 13px;
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s ease;
      
      &:hover {
        color: #6b7280;
        text-decoration: underline;
      }
    }
    
    .divider {
      color: #d1d5db;
      font-size: 12px;
    }
  }
}

.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.captcha-input {
  flex: 1;
}

.captcha-image-container {
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
  }
}

.captcha-canvas {
  display: block;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
}

.refresh-btn {
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  margin-left: 8px;
  flex-shrink: 0;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: rotate(90deg);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .form-header {
    h2 {
      font-size: 24px;
    }
    
    p {
      font-size: 14px;
    }
  }
  
  .form-field {
    margin-bottom: 20px;
  }
  
  .input-wrapper .custom-input :deep(.el-input__wrapper) {
    height: 44px;
    padding: 0 12px 0 44px;
  }
  
  .login-button,
  .alt-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>