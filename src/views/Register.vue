<template>
  <div class="register-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-shape shape-1"></div>
      <div class="decoration-shape shape-2"></div>
      <div class="decoration-shape shape-3"></div>
      <div class="decoration-shape shape-4"></div>
    </div>
    
    <div class="register-container">
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
          <div class="brand-features">
            <div class="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>安全可靠</span>
            </div>
            <div class="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>快速高效</span>
            </div>
            <div class="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>企业级安全</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 注册表单区域 -->
      <div class="register-form-section">
        <div class="form-header">
          <h2>创建您的账户</h2>
          <p>加入我们，享受专业的卡密管理服务</p>
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
              <p>当前系统正在进行维护，暂停新用户注册。请稍后重试。</p>
            </div>
          </div>
        </div>
        
        <el-form 
          :model="registerForm" 
          :rules="rules" 
          ref="registerFormRef" 
          class="register-form"
          :disabled="isMaintenanceActive"
          @keyup.enter="handleRegister"
        >
          <div class="form-row">
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
                  v-model="registerForm.username" 
                  placeholder="输入用户名"
                  class="custom-input"
                />
              </div>
            </el-form-item>
            
            <el-form-item prop="email" class="form-field">
              <div class="field-label">
                <label>邮箱地址</label>
              </div>
              <div class="input-wrapper">
                <div class="input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <el-input 
                  v-model="registerForm.email" 
                  placeholder="输入邮箱地址"
                  class="custom-input"
                />
              </div>
            </el-form-item>
          </div>
          
          <el-form-item prop="password" class="form-field">
            <div class="field-label">
              <label>设置密码</label>
            </div>
            <div class="input-wrapper">
              <div class="input-prefix">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="设置登录密码"
                show-password
                class="custom-input"
              />
            </div>
            <div class="password-strength">
              <div class="strength-indicator">
                <div class="strength-bar" :class="passwordStrength.class"></div>
                <div class="strength-bar" :class="passwordStrength.class === 'strong' ? 'strong' : ''"></div>
                <div class="strength-bar" :class="passwordStrength.class === 'strong' ? 'strong' : ''"></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
          </el-form-item>
          
          <el-form-item prop="confirmPassword" class="form-field">
            <div class="field-label">
              <label>确认密码</label>
            </div>
            <div class="input-wrapper">
              <div class="input-prefix">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password" 
                placeholder="再次确认密码"
                show-password
                class="custom-input"
              />
            </div>
          </el-form-item>
          
          <div class="captcha-section">
            <div class="captcha-label">
              <label>安全验证</label>
            </div>
            <SliderCaptcha 
              ref="sliderCaptchaRef"
              @success="onCaptchaSuccess"
              @fail="onCaptchaFail"
            />
          </div>
          
          <div class="form-options">
            <el-checkbox v-model="registerForm.agree" class="agreement-checkbox">
              我已阅读并同意
              <a href="#" class="agreement-link" @click.prevent>《用户服务协议》</a>
              和
              <a href="#" class="agreement-link" @click.prevent>《隐私政策》</a>
            </el-checkbox>
          </div>
          
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleRegister"
            class="register-button"
          >
            <span v-if="!loading">创建账户</span>
            <span v-else>正在创建...</span>
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
            使用Google注册
          </button>
        </div>
        
        <div class="form-footer">
          <p>已有账户？ <router-link to="/login" class="signin-link">立即登录</router-link></p>
          <div class="footer-links">
            <router-link to="/" class="footer-link">返回首页</router-link>
            <span class="divider">•</span>
            <a href="#" class="footer-link" @click.prevent>帮助中心</a>
            <span class="divider">•</span>
            <a href="#" class="footer-link" @click.prevent>联系支持</a>
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
import { User, Lock, Message } from '@element-plus/icons-vue'
import SliderCaptcha from '@/components/SliderCaptcha.vue'

const router = useRouter()
const userStore = useUserStore()
const maintenanceStore = useMaintenanceStore()

const registerFormRef = ref()
const sliderCaptchaRef = ref()
const loading = ref(false)
const captchaVerified = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordStrength = computed(() => {
  const password = registerForm.password
  if (!password) return { class: '', text: '请设置密码' }
  
  let score = 0
  
  // 长度检查
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  
  // 复杂度检查
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  if (score < 3) return { class: 'weak', text: '密码强度：弱' }
  if (score < 5) return { class: 'medium', text: '密码强度：中' }
  return { class: 'strong', text: '密码强度：强' }
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const isMaintenanceActive = computed(() => {
  return maintenanceStore.isMaintenanceActive()
})

// 验证码成功回调
const onCaptchaSuccess = () => {
  captchaVerified.value = true
}

// 验证码失败回调
const onCaptchaFail = () => {
  captchaVerified.value = false
}

const handleRegister = async () => {
  // 检查维护模式
  if (isMaintenanceActive.value) {
    ElMessage.error('系统维护中，暂停新用户注册')
    return
  }
  
  if (!registerForm.agree) {
    ElMessage.error('请先同意用户协议')
    return
  }
  
  if (!captchaVerified.value) {
    ElMessage.error('请完成安全验证')
    return
  }
  
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        const result = await userStore.register({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password
        })
        
        if (result.success) {
          ElMessage.success('注册成功，请登录')
          router.push('/login')
        } else {
          ElMessage.error(result.message)
          // 注册失败时重置验证码
          if (sliderCaptchaRef.value) {
            sliderCaptchaRef.value.refresh()
            captchaVerified.value = false
          }
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
})
</script>

<style lang="scss" scoped>
.register-page {
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
    width: 420px;
    height: 420px;
    top: -210px;
    right: -210px;
    animation: float 8s ease-in-out infinite;
  }
  
  &.shape-2 {
    width: 280px;
    height: 280px;
    bottom: -140px;
    left: -140px;
    animation: float 10s ease-in-out infinite reverse;
  }
  
  &.shape-3 {
    width: 160px;
    height: 160px;
    top: 15%;
    left: 8%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(101, 163, 13, 0.1) 100%);
    animation: float 12s ease-in-out infinite;
  }
  
  &.shape-4 {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 15%;
    background: linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%);
    animation: float 14s ease-in-out infinite reverse;
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

.register-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 520px;
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
  margin: 0 0 32px 0;
  font-weight: 500;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  
  svg {
    color: #10b981;
    flex-shrink: 0;
  }
}

.register-form-section {
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

.register-form {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
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

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-indicator {
  flex: 1;
  display: flex;
  gap: 4px;
  height: 4px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background-color 0.3s ease;
  
  &.weak {
    background: #ef4444;
  }
  
  &.medium {
    background: #f59e0b;
  }
  
  &.strong {
    background: #10b981;
  }
}

.strength-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
}

.captcha-section {
  margin-bottom: 24px;
}

.captcha-label {
  margin-bottom: 12px;
  
  label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }
}

.form-options {
  margin-bottom: 32px;
  
  .agreement-checkbox {
    :deep(.el-checkbox__label) {
      font-size: 14px;
      color: #4b5563;
      font-weight: 500;
      line-height: 1.5;
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
    
    .agreement-link {
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
}

.register-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px 0 rgba(16, 185, 129, 0.5);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
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
    
    .signin-link {
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
  
  .register-button,
  .alt-button {
    height: 44px;
    font-size: 15px;
  }
  
  .brand-features {
    margin-top: 24px;
    gap: 12px;
  }
  
  .feature-item {
    font-size: 13px;
    gap: 10px;
  }
}
</style>