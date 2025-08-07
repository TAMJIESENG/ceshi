<template>
  <div class="security-verification">
    <!-- 企业级背景装饰 -->
    <div class="background-decoration">
      <div class="security-shape shape-1"></div>
      <div class="security-shape shape-2"></div>
      <div class="warning-particles">
        <div class="warning-particle" v-for="i in 20" :key="i" :style="getWarningParticleStyle(i)"></div>
      </div>
    </div>

    <!-- 紧急状态导航条 -->
    <div class="emergency-header">
      <div class="header-container">
        <div class="alert-section">
          <div class="alert-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"/>
            </svg>
          </div>
          <div class="alert-text">
            <h1 class="alert-title">安全验证</h1>
            <p class="alert-subtitle">检测到异常登录行为</p>
          </div>
        </div>
        
        <div class="security-level">
          <div class="level-indicator critical"></div>
          <span>高风险</span>
        </div>
      </div>
    </div>

    <div class="verification-container">
      <!-- 安全警告区域 -->
      <div class="security-warning">
        <div class="warning-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"/>
          </svg>
        </div>
        
        <div class="warning-content">
          <h2 class="warning-title">检测到IP地址变更</h2>
          <p class="warning-description">
            为了保护管理员账号安全，系统检测到您的IP地址发生了变化。
            请输入安全密钥以继续登录。
          </p>
          
          <div class="ip-comparison">
            <div class="ip-item trusted">
              <div class="ip-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9V17"/>
                </svg>
                信任IP地址
              </div>
              <div class="ip-value">{{ securityData?.trustedIP || '未知' }}</div>
            </div>
            
            <div class="ip-arrow">→</div>
            
            <div class="ip-item current">
              <div class="ip-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                </svg>
                当前IP地址
              </div>
              <div class="ip-value current-ip">{{ securityData?.currentIP || '未知' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全密钥输入区域 -->
      <div class="key-input-section">
        <div class="input-container">
          <div class="input-header">
            <div class="lock-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
            </div>
            <div class="input-title">
              <h3>输入安全密钥</h3>
              <p>请输入从安全密钥生成器获取的一次性密钥</p>
            </div>
          </div>
          
          <div class="input-form">
            <div class="security-key-input">
              <el-input
                v-model="securityKey"
                placeholder="请输入安全密钥"
                size="large"
                :disabled="verifying"
                @keyup.enter="verifySecurityKey"
                class="key-input"
                maxlength="128"
                show-word-limit
              >
                <template #prefix>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7,14A3,3 0 0,1 10,17A3,3 0 0,1 7,20A3,3 0 0,1 4,17A3,3 0 0,1 7,14M7,18A1,1 0 0,0 8,17A1,1 0 0,0 7,16A1,1 0 0,0 6,17A1,1 0 0,0 7,18M16,6V10H14V6H16M18,11V7A2,2 0 0,0 16,5H14A2,2 0 0,0 12,7V11A1,1 0 0,0 11,12V16A1,1 0 0,0 12,17H18A1,1 0 0,0 19,16V12A1,1 0 0,0 18,11Z"/>
                  </svg>
                </template>
              </el-input>
            </div>
            
            <div class="verification-actions">
              <button 
                class="verify-button"
                @click="verifySecurityKey"
                :disabled="!securityKey.trim() || verifying"
              >
                <span v-if="!verifying" class="button-content">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9V17"/>
                  </svg>
                  验证并登录
                </span>
                <span v-else class="button-content">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="loading-icon">
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                  </svg>
                  验证中...
                </span>
              </button>
              
              <button class="cancel-button" @click="cancelVerification" :disabled="verifying">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
                取消登录
              </button>
            </div>
          </div>
        </div>
        
        <!-- 帮助信息 -->
        <div class="help-section">
          <div class="help-card">
            <div class="help-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C7.59,8 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
              </svg>
            </div>
            <div class="help-content">
              <h4>如何获取安全密钥？</h4>
              <ol>
                <li>打开安全密钥生成器页面</li>
                <li>点击"生成安全密钥"按钮</li>
                <li>复制生成的密钥</li>
                <li>在上方输入框中粘贴密钥</li>
              </ol>
              <div class="help-actions">
                <a href="/security-key-generator" target="_blank" class="help-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                  </svg>
                  打开密钥生成器
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全提示 -->
      <div class="security-tips">
        <div class="tips-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M14.5,10.5C14.5,9 13.38,7.75 12,7.75C10.62,7.75 9.5,9 9.5,10.5H11C11,9.65 11.45,9 12,9C12.55,9 13,9.65 13,10.5C13,10.69 12.92,10.87 12.77,11L11.96,11.84C11.54,12.26 11.25,12.74 11.25,13.5H12.75C12.75,13.08 12.85,12.69 13.11,12.43L13.92,11.61C14.33,11.2 14.5,10.87 14.5,10.5Z"/>
          </svg>
          <h4>安全提示</h4>
        </div>
        <ul class="tips-list">
          <li>每个安全密钥只能使用一次，使用后会自动失效</li>
          <li>密钥有时效性，请及时使用以免过期</li>
          <li>请妥善保管您的密钥，不要泄露给他人</li>
          <li>如多次验证失败，系统将暂时锁定管理员账号</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElInput } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const securityKey = ref('')
const verifying = ref(false)
const securityData = ref(null)

// 获取安全数据
onMounted(() => {
  // 从路由参数或localStorage获取安全数据
  const routeSecurityData = router.currentRoute.value.params.securityData
  if (routeSecurityData) {
    securityData.value = JSON.parse(decodeURIComponent(routeSecurityData))
  } else {
    // 从会话存储获取
    const sessionData = sessionStorage.getItem('security_verification_data')
    if (sessionData) {
      securityData.value = JSON.parse(sessionData)
    } else {
      // 如果没有安全数据，重定向到登录页
      ElMessage.error('安全验证会话已过期，请重新登录')
      router.push('/login')
    }
  }
})

// 警告粒子样式
const getWarningParticleStyle = (index) => {
  const size = Math.random() * 6 + 3
  const duration = Math.random() * 8 + 12
  const delay = Math.random() * 4
  const left = Math.random() * 100
  const top = Math.random() * 100
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

// 验证安全密钥
const verifySecurityKey = async () => {
  if (!securityKey.value.trim()) {
    ElMessage.warning('请输入安全密钥')
    return
  }
  
  verifying.value = true
  
  try {
    // 调用用户存储的安全登录方法
    const result = await userStore.adminSecureLogin(
      { 
        username: 'admin', 
        password: sessionStorage.getItem('admin_temp_password') 
      }, 
      securityKey.value.trim()
    )
    
    if (result.success) {
      ElMessage.success('安全验证成功，正在跳转...')
      
      // 清除临时数据
      sessionStorage.removeItem('security_verification_data')
      sessionStorage.removeItem('admin_temp_password')
      
      // 跳转到管理员面板
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } else {
      ElMessage.error(result.message || '安全密钥验证失败')
    }
  } catch (error) {
    ElMessage.error('验证过程出现错误，请重试')
  } finally {
    verifying.value = false
  }
}

// 取消验证
const cancelVerification = () => {
  // 清除临时数据
  sessionStorage.removeItem('security_verification_data')
  sessionStorage.removeItem('admin_temp_password')
  
  ElMessage.info('已取消安全验证')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.security-verification {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.08) 0%, transparent 70%),
              linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  position: relative;
  overflow-x: hidden;
}

// 背景装饰
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.security-shape {
  position: absolute;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.08) 100%);
  border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
  filter: blur(80px);
  animation: warning-morph 30s ease-in-out infinite;
  
  &.shape-1 {
    width: 600px;
    height: 400px;
    top: -200px;
    right: -300px;
    animation-delay: -10s;
  }
  
  &.shape-2 {
    width: 500px;
    height: 350px;
    bottom: -150px;
    left: -250px;
    animation-delay: -20s;
  }
}

.warning-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  
  .warning-particle {
    position: absolute;
    background: rgba(239, 68, 68, 0.6);
    border-radius: 50%;
    animation: float-warning-particle linear infinite;
    
    &:nth-child(even) {
      background: rgba(220, 38, 38, 0.5);
    }
    
    &:nth-child(3n) {
      background: rgba(185, 28, 28, 0.4);
    }
  }
}

@keyframes warning-morph {
  0%, 100% {
    border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
    transform: translateX(0) translateY(0) scale(1);
  }
  25% {
    border-radius: 70% 30% 85% 15% / 85% 55% 45% 15%;
    transform: translateX(30px) translateY(-25px) scale(1.1);
  }
  50% {
    border-radius: 50% 50% 30% 70% / 65% 30% 70% 35%;
    transform: translateX(-20px) translateY(20px) scale(0.95);
  }
  75% {
    border-radius: 30% 70% 70% 30% / 75% 75% 25% 25%;
    transform: translateX(25px) translateY(30px) scale(1.05);
  }
}

@keyframes float-warning-particle {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(20px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translateY(-10vh) translateX(-20px) scale(1);
  }
  100% {
    transform: translateY(-20vh) translateX(0px) scale(0);
    opacity: 0;
  }
}

// 紧急状态导航条
.emergency-header {
  position: relative;
  z-index: 10;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(254, 242, 242, 0.95) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 2px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.alert-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.alert-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: alert-pulse 2s ease-in-out infinite;
}

@keyframes alert-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

.alert-text {
  .alert-title {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.2;
  }
  
  .alert-subtitle {
    font-size: 14px;
    color: #b91c1c;
    margin: 4px 0 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.security-level {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  color: #b91c1c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  &.critical {
    background: #ef4444;
    animation: critical-blink 1.5s infinite;
  }
}

@keyframes critical-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.verification-container {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}

// 安全警告区域
.security-warning {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(254, 242, 242, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 24px;
  border: 2px solid rgba(239, 68, 68, 0.2);
  box-shadow: 
    0 20px 40px rgba(239, 68, 68, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.04);
  padding: 48px;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      #ef4444 0%, 
      #dc2626 50%, 
      #ef4444 100%);
    animation: warning-flow 3s linear infinite;
  }
  
  .warning-icon {
    color: #ef4444;
    margin-bottom: 32px;
    animation: warning-shake 3s ease-in-out infinite;
  }
  
  .warning-content {
    .warning-title {
      font-size: 32px;
      font-weight: 800;
      color: #b91c1c;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }
    
    .warning-description {
      font-size: 18px;
      color: #7f1d1d;
      line-height: 1.6;
      margin: 0 0 32px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

@keyframes warning-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes warning-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.ip-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
}

.ip-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px 24px;
  min-width: 200px;
  text-align: center;
  border: 2px solid transparent;
  
  &.trusted {
    border-color: rgba(34, 197, 94, 0.3);
    background: linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.6) 100%);
  }
  
  &.current {
    border-color: rgba(239, 68, 68, 0.3);
    background: linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(254, 226, 226, 0.6) 100%);
  }
  
  .ip-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .ip-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    
    &.current-ip {
      color: #b91c1c;
    }
  }
}

.trusted .ip-label {
  color: #166534;
}

.current .ip-label {
  color: #b91c1c;
}

.ip-arrow {
  font-size: 24px;
  font-weight: 700;
  color: #ef4444;
  animation: arrow-pulse 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
}

@keyframes arrow-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

// 密钥输入区域
.key-input-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.input-container {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  
  .lock-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
  }
  
  .input-title {
    flex: 1;
    
    h3 {
      font-size: 22px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
    }
    
    p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
  }
}

.input-form {
  padding: 32px;
}

.security-key-input {
  margin-bottom: 24px;
  
  :deep(.el-input) {
    .el-input__wrapper {
      height: 56px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #3b82f6;
      }
      
      &.is-focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    .el-input__inner {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .el-input__prefix {
      color: #64748b;
    }
  }
}

.verification-actions {
  display: flex;
  gap: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.verify-button {
  flex: 1;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .loading-icon {
    animation: spin 1s linear infinite;
  }
}

.cancel-button {
  height: 56px;
  padding: 0 24px;
  background: transparent;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 帮助区域
.help-section {
  .help-card {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(245, 245, 245, 0.9) 100%);
    border: 1px solid rgba(229, 231, 235, 0.6);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    
    .help-icon {
      color: #3b82f6;
      margin-bottom: 16px;
    }
    
    .help-content {
      h4 {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 16px;
      }
      
      ol {
        margin: 0 0 20px;
        padding-left: 20px;
        color: #4b5563;
        
        li {
          margin-bottom: 8px;
          line-height: 1.5;
        }
      }
      
      .help-actions {
        .help-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        }
      }
    }
  }
}

// 安全提示
.security-tips {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 32px;
  
  .tips-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    color: #3b82f6;
    
    h4 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
  }
  
  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(229, 231, 235, 0.5);
      font-size: 14px;
      color: #4b5563;
      line-height: 1.5;
      
      &:last-child {
        border-bottom: none;
      }
      
      &::before {
        content: '•';
        color: #3b82f6;
        font-weight: 700;
        font-size: 16px;
        flex-shrink: 0;
        margin-top: 2px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .verification-container {
    padding: 40px 16px;
  }
  
  .security-warning {
    padding: 32px 24px;
    
    .warning-title {
      font-size: 24px;
    }
    
    .warning-description {
      font-size: 16px;
    }
  }
  
  .input-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .input-form {
    padding: 24px;
  }
  
  .help-section .help-card {
    padding: 20px;
  }
  
  .security-tips {
    padding: 24px;
  }
}
</style>