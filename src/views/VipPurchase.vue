<template>
  <div class="vip-purchase-page">
    <!-- 高级背景装饰 -->
    <div class="background-decoration">
      <div class="geometric-shape shape-1"></div>
      <div class="geometric-shape shape-2"></div>
      <div class="geometric-shape shape-3"></div>
      <div class="geometric-shape shape-4"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- 企业级导航条 -->
    <div class="enterprise-header">
      <div class="header-container">
        <div class="logo-section">
          <div class="company-logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea"/>
                  <stop offset="100%" style="stop-color:#764ba2"/>
                </linearGradient>
              </defs>
              <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="url(#logoGradient)" stroke-width="2" fill="none"/>
              <path d="M24 12L36 18V30L24 36L12 30V18L24 12Z" stroke="url(#logoGradient)" stroke-width="1.5" fill="none"/>
              <circle cx="24" cy="24" r="4" fill="url(#logoGradient)"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1 class="company-name">SecureCard</h1>
            <p class="company-tagline">Enterprise Security Solutions</p>
          </div>
        </div>
        
        <div class="header-actions">
          <router-link to="/dashboard" class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            返回控制台
          </router-link>
          <div class="user-info-compact">
            <div class="balance-chip">¥{{ (currentUser?.balance || 0).toFixed(2) }}</div>
            <el-tag :type="currentVipInfo.level === 0 ? 'info' : currentVipInfo.level === 1 ? 'warning' : ''" 
                    :color="currentVipInfo.level === 2 ? '#9333ea' : ''" 
                    class="vip-status-chip" size="small">
              {{ currentVipInfo.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="vip-container">
      <!-- 企业级页面标题区域 -->
      <div class="enterprise-hero">
        <div class="hero-content">
          <div class="hero-badge">
            <div class="badge-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span>Premium Membership</span>
          </div>
          
          <h1 class="hero-title">
            升级至企业级
            <span class="gradient-text">VIP会员</span>
          </h1>
          
          <p class="hero-subtitle">
            解锁专业功能，享受企业级服务体验
            <br>
            获得优先支持、专属折扣和高级安全保障
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">VIP折扣</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">90%</div>
              <div class="stat-label">SVIP折扣</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">专属支持</div>
            </div>
          </div>
        </div>
        
        <!-- 当前状态卡片 -->
        <div v-if="currentUser" class="status-dashboard">
          <div class="dashboard-card" :class="getDashboardClass()">
            <div class="card-header">
              <div class="status-indicator" :class="getStatusClass()"></div>
              <span class="current-plan">当前方案</span>
            </div>
            
            <div class="plan-info">
              <div class="plan-name">{{ currentVipInfo.name }}</div>
              <div class="plan-status" v-if="vipStatus.isValid">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="status-icon">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7H3V9C3 13.4 6.6 17 11 17V21H13V17C17.4 17 21 13.4 21 9Z"/>
                </svg>
                {{ vipStatus.daysRemaining }}天后到期
              </div>
              <div class="plan-status expired" v-else-if="currentUser.level !== '普通'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="status-icon">
                  <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12S7.58 20 12 20 20 16.42 20 12 16.42 4 12 4M15.18 10.54L12 13.72L8.82 10.54L10.24 9.12L12 10.88L13.76 9.12L15.18 10.54Z"/>
                </svg>
                已过期，需要续费
              </div>
            </div>
            
            <div class="upgrade-hint" v-if="currentVipInfo.level < 2">
              <router-link to="#pricing" class="upgrade-link">
                {{ currentVipInfo.level === 0 ? '立即升级' : '升级SVIP' }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.58L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.58Z"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- VIP等级对比 -->
      <div class="vip-comparison">
        <div class="comparison-title">
          <h2>会员等级对比</h2>
          <p>选择适合您的会员等级，享受专属服务</p>
        </div>
        
        <div class="comparison-grid">
          <div 
            v-for="(levelInfo, levelKey) in vipLevels" 
            :key="levelKey"
            class="level-card"
            :class="{ 
              'current': currentUser?.level === levelKey,
              'vip': levelInfo.level === 1,
              'svip': levelInfo.level === 2
            }"
          >
            <div class="card-header">
              <div class="level-icon" :style="{ color: levelInfo.color }">
                <svg v-if="levelInfo.level === 0" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7H3V9C3 13.4 6.6 17 11 17V21H13V17C17.4 17 21 13.4 21 9Z"/>
                </svg>
                <svg v-else-if="levelInfo.level === 1" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 14l5.5-5.5L10 10l4-4L16.5 8.5L18 7l3 3-8.5 8.5L8 14l-3 2z"/>
                </svg>
                <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
                </svg>
              </div>
              <h3>{{ levelInfo.name }}</h3>
              <div class="current-badge" v-if="currentUser?.level === levelKey">当前等级</div>
            </div>
            
            <div class="benefits-list">
              <div v-for="benefit in levelInfo.benefits" :key="benefit" class="benefit-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                {{ benefit }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 企业级套餐选择区域 -->
      <div v-if="currentUser?.level !== 'SVIP' || !vipStatus.isValid" class="enterprise-pricing" id="pricing">
        <div class="pricing-header">
          <div class="header-badge">
            <div class="badge-dot"></div>
            <span>Pricing Plans</span>
          </div>
          <h2 class="pricing-title">选择适合您的会员方案</h2>
          <p class="pricing-subtitle">所有方案均包含核心功能，升级享受更多专属权益</p>
        </div>

        <!-- VIP专业版套餐 -->
        <div v-if="currentUser?.level !== 'VIP' || !vipStatus.isValid" class="plan-section">
          <div class="section-title">
            <div class="title-icon vip-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="title-content">
              <h3>VIP专业版</h3>
              <p>适合个人用户和小型团队</p>
            </div>
            <div class="discount-chip vip-discount">95折优惠</div>
          </div>
          
          <div class="enterprise-cards-grid">
            <div 
              v-for="(pkg, key) in vipPackages.VIP" 
              :key="key"
              class="enterprise-card vip-tier"
              :class="{ 'popular': key === 'yearly' }"
            >
              <!-- 推荐标签 -->
              <div v-if="key === 'yearly'" class="popular-banner">
                <div class="banner-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  最受欢迎
                </div>
              </div>
              
              <div class="card-content">
                <div class="plan-header">
                  <div class="plan-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div class="plan-title">{{ pkg.name }}</div>
                  <div class="plan-desc">{{ pkg.description }}</div>
                </div>
                
                <div class="pricing-display">
                  <div class="price-main">
                    <span class="currency">¥</span>
                    <span class="amount">{{ pkg.currentPrice.toString().split('.')[0] }}</span>
                    <span class="decimal">.{{ pkg.currentPrice.toString().split('.')[1] || '00' }}</span>
                  </div>
                  <div class="price-period">{{ pkg.duration }}天有效期</div>
                  <div class="price-note">约 ¥{{ (pkg.currentPrice / pkg.duration).toFixed(1) }}/天</div>
                </div>
                
                <div class="plan-features">
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    95折购买优惠
                  </div>
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    优先客服支持
                  </div>
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    专属VIP标识
                  </div>
                </div>
                
                <button 
                  class="enterprise-btn vip-btn"
                  :disabled="loading"
                  @click="selectPackage('VIP', key, pkg)"
                >
                  <span v-if="!loading">立即购买</span>
                  <span v-else class="loading-text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="loading-icon">
                      <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                    </svg>
                    处理中
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SVIP企业版套餐 -->
        <div class="plan-section">
          <div class="section-title">
            <div class="title-icon svip-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
              </svg>
            </div>
            <div class="title-content">
              <h3>SVIP企业版</h3>
              <p>适合大型团队和企业用户</p>
            </div>
            <div class="discount-chip svip-discount">90折优惠</div>
          </div>
          
          <div class="enterprise-cards-grid">
            <div 
              v-for="(pkg, key) in vipPackages.SVIP" 
              :key="key"
              class="enterprise-card svip-tier"
              :class="{ 'popular': key === 'yearly' }"
            >
              <!-- 推荐标签 -->
              <div v-if="key === 'yearly'" class="popular-banner svip-banner">
                <div class="banner-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
                  </svg>
                  企业首选
                </div>
              </div>
              
              <div class="card-content">
                <div class="plan-header">
                  <div class="plan-icon svip-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
                    </svg>
                  </div>
                  <div class="plan-title">{{ pkg.name }}</div>
                  <div class="plan-desc">{{ pkg.description }}</div>
                </div>
                
                <div class="pricing-display">
                  <div class="price-main">
                    <span class="currency">¥</span>
                    <span class="amount">{{ pkg.currentPrice.toString().split('.')[0] }}</span>
                    <span class="decimal">.{{ pkg.currentPrice.toString().split('.')[1] || '00' }}</span>
                  </div>
                  <div class="price-period">{{ pkg.duration }}天有效期</div>
                  <div class="price-note">约 ¥{{ (pkg.currentPrice / pkg.duration).toFixed(1) }}/天</div>
                </div>
                
                <div class="plan-features">
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    90折购买优惠
                  </div>
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    专属客服通道
                  </div>
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    每月免费赠送
                  </div>
                  <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    独享SVIP标识
                  </div>
                </div>
                
                <button 
                  class="enterprise-btn svip-btn"
                  :disabled="loading"
                  @click="selectPackage('SVIP', key, pkg)"
                >
                  <span v-if="!loading">立即升级</span>
                  <span v-else class="loading-text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="loading-icon">
                      <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                    </svg>
                    处理中
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 已是最高等级提示 -->
      <div v-else class="max-level-notice">
        <div class="notice-card">
          <div class="notice-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#9b59b6">
              <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
            </svg>
          </div>
          <h3>您已是SVIP超级会员</h3>
          <p>感谢您的支持！您当前享有最高级别的会员权益</p>
          <div class="expire-info">
            VIP到期时间：{{ new Date(vipStatus.expireTime).toLocaleString('zh-CN') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 支付对话框 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="确认支付"
      width="480px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedPackageInfo" class="payment-details">
        <div class="package-info">
          <h4>{{ selectedPackageInfo.packageData.name }}</h4>
          <p>{{ selectedPackageInfo.packageData.description }}</p>
        </div>
        
        <div class="payment-summary">
          <div class="summary-row">
            <span>套餐价格：</span>
            <span class="price">¥{{ selectedPackageInfo.packageData.currentPrice }}</span>
          </div>
          <div class="summary-row total">
            <span>支付金额：</span>
            <span class="total-price">¥{{ selectedPackageInfo.packageData.currentPrice }}</span>
          </div>
        </div>
        
        <div class="payment-methods">
          <h5>选择支付方式</h5>
          <el-radio-group v-model="selectedPaymentMethod" class="payment-options">
            <el-radio value="balance" class="payment-option">
              <div class="payment-method-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8,10.9c-2.27-0.59-3-1.2-3-2.15c0-1.09,1.01-1.85,2.7-1.85c1.78,0,2.44,0.85,2.5,2.1h2.21c-0.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94,0.42-3.5,1.68-3.5,3.61c0,2.31,1.91,3.46,4.7,4.13c2.5,0.6,3,1.48,3,2.41c0,0.69-0.49,1.79-2.7,1.79c-2.06,0-2.87-0.92-2.98-2.1h-2.2c0.12,2.19,1.76,3.42,3.68,3.83V21h3v-2.15c1.95-0.37,3.5-1.5,3.5-3.55C15.8,12.85,14.07,11.66,11.8,10.9z"/>
                </svg>
                <div>
                  <div class="method-name">余额支付</div>
                  <div class="balance-info">当前余额：¥{{ currentUser?.balance || 0 }}</div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="paymentDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            :loading="loading"
            @click="confirmPayment"
            :disabled="!selectedPaymentMethod"
          >
            确认支付
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useVipStore } from '@/stores/vip'

const router = useRouter()
const userStore = useUserStore()
const vipStore = useVipStore()

const currentUser = computed(() => userStore.user)
const paymentDialogVisible = ref(false)
const selectedPackageInfo = ref(null)
const selectedPaymentMethod = ref('balance')
const loading = computed(() => vipStore.loading)

// VIP等级和套餐数据
const vipLevels = computed(() => vipStore.vipLevels)
const vipPackages = computed(() => vipStore.vipPackages)

// 当前用户VIP信息
const currentVipInfo = computed(() => {
  if (!currentUser.value) return vipLevels.value['普通']
  return vipStore.getUserVipInfo(currentUser.value.level)
})

// 当前用户VIP状态
const vipStatus = computed(() => {
  if (!currentUser.value) return { isValid: false, level: '普通', expireTime: null }
  return vipStore.checkUserVipStatus(currentUser.value.id)
})

// 企业级界面辅助方法
const getParticleStyle = (index) => {
  const size = Math.random() * 6 + 2
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
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

const getDashboardClass = () => {
  if (currentVipInfo.value.level === 0) return 'normal-plan'
  if (currentVipInfo.value.level === 1) return 'vip-plan'
  return 'svip-plan'
}

const getStatusClass = () => {
  if (!vipStatus.value.isValid && currentUser.value?.level !== '普通') return 'expired'
  if (currentVipInfo.value.level === 0) return 'normal'
  if (currentVipInfo.value.level === 1) return 'vip'
  return 'svip'
}

// 选择套餐
const selectPackage = (vipType, packageType, packageData) => {
  if (!currentUser.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  selectedPackageInfo.value = {
    vipType,
    packageType,
    packageData
  }
  
  paymentDialogVisible.value = true
}

// 确认支付
const confirmPayment = async () => {
  if (!selectedPackageInfo.value || !selectedPaymentMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  const { vipType, packageType } = selectedPackageInfo.value
  
  try {
    const result = await vipStore.purchaseVip(vipType, packageType, selectedPaymentMethod.value)
    
    if (result.success) {
      ElMessage.success(result.message)
      paymentDialogVisible.value = false
      selectedPackageInfo.value = null
      
      // 刷新用户数据
      userStore.refreshCurrentUser()
      
      // 跳转到个人中心
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('购买失败，请重试')
  }
}

onMounted(() => {
  // 检查登录状态
  if (!currentUser.value) {
    ElMessageBox.confirm('请先登录后再查看VIP服务', '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      router.push('/login')
    }).catch(() => {
      router.push('/')
    })
  }
})
</script>

<style lang="scss" scoped>
.vip-purchase-page {
  min-height: 100vh;
  background: radial-gradient(ellipse at top, rgba(99, 102, 241, 0.05) 0%, transparent 70%),
              linear-gradient(135deg, #fafafc 0%, #f1f5f9 100%);
  position: relative;
  overflow-x: hidden;
}

// 高级背景装饰
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

.geometric-shape {
  position: absolute;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 69, 193, 0.06) 100%);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  filter: blur(60px);
  animation: morphing 20s ease-in-out infinite;
  
  &.shape-1 {
    width: 600px;
    height: 400px;
    top: -200px;
    right: -300px;
    animation-delay: -5s;
  }
  
  &.shape-2 {
    width: 500px;
    height: 350px;
    bottom: -150px;
    left: -250px;
    animation-delay: -10s;
  }
  
  &.shape-3 {
    width: 400px;
    height: 300px;
    top: 40%;
    left: -200px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(34, 197, 94, 0.04) 100%);
    animation-delay: -2s;
  }
  
  &.shape-4 {
    width: 350px;
    height: 250px;
    top: 60%;
    right: -150px;
    background: linear-gradient(135deg, rgba(245, 101, 101, 0.06) 0%, rgba(251, 146, 60, 0.04) 100%);
    animation-delay: -15s;
  }
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  
  .particle {
    position: absolute;
    background: rgba(99, 102, 241, 0.4);
    border-radius: 50%;
    animation: float-particle linear infinite;
    
    &:nth-child(even) {
      background: rgba(139, 69, 193, 0.3);
    }
    
    &:nth-child(3n) {
      background: rgba(16, 185, 129, 0.3);
    }
  }
}

@keyframes morphing {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: translateX(0) translateY(0) scale(1);
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
    transform: translateX(20px) translateY(-15px) scale(1.05);
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
    transform: translateX(-10px) translateY(10px) scale(0.95);
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
    transform: translateX(15px) translateY(20px) scale(1.02);
  }
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(10px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translateY(-10vh) translateX(-10px) scale(1);
  }
  100% {
    transform: translateY(-20vh) translateX(0px) scale(0);
    opacity: 0;
  }
}

// 企业级导航条
.enterprise-header {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.company-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 69, 193, 0.1) 100%);
  border-radius: 12px;
}

.logo-text {
  .company-name {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.2;
  }
  
  .company-tagline {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }
}

.user-info-compact {
  display: flex;
  align-items: center;
  gap: 12px;
}

.balance-chip {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.vip-status-chip {
  font-weight: 600 !important;
  
  &.el-tag--warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
    border-color: transparent !important;
    color: white !important;
  }
}

.vip-container {
  position: relative;
  z-index: 5;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.decoration-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
  
  &.shape-1 {
    width: 320px;
    height: 320px;
    top: -160px;
    right: -160px;
    animation: float 8s ease-in-out infinite;
  }
  
  &.shape-2 {
    width: 240px;
    height: 240px;
    bottom: -120px;
    left: -120px;
    animation: float 10s ease-in-out infinite reverse;
  }
  
  &.shape-3 {
    width: 160px;
    height: 160px;
    top: 20%;
    left: 5%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(101, 163, 13, 0.1) 100%);
    animation: float 12s ease-in-out infinite;
  }
  
  &.shape-4 {
    width: 120px;
    height: 120px;
    top: 70%;
    right: 10%;
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

// 企业级页面标题区域
.enterprise-hero {
  position: relative;
  margin: 48px 0 80px;
  padding: 80px 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 32px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.6);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      #667eea 0%, 
      #764ba2 50%, 
      #667eea 100%);
  }
  
  .hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
    z-index: 2;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.1) 0%, 
      rgba(139, 69, 193, 0.1) 100%);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    color: #4f46e5;
    margin-bottom: 32px;
    
    .badge-icon {
      color: #6366f1;
    }
  }
  
  .hero-title {
    font-size: 56px;
    font-weight: 800;
    line-height: 1.1;
    color: #1e293b;
    margin: 0 0 24px;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 36px;
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
      }
    }
  }
  
  .hero-subtitle {
    font-size: 20px;
    line-height: 1.6;
    color: #64748b;
    margin: 0 0 48px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    
    @media (max-width: 768px) {
      font-size: 16px;
      margin-bottom: 32px;
    }
  }
  
  .hero-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    margin-bottom: 32px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }
    }
    
    .stat-divider {
      width: 1px;
      height: 48px;
      background: linear-gradient(to bottom, 
        transparent 0%, 
        #e2e8f0 20%, 
        #e2e8f0 80%, 
        transparent 100%);
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  
  // 当前状态仪表板
  .status-dashboard {
    position: absolute;
    top: 40px;
    right: 40px;
    z-index: 3;
    
    @media (max-width: 1024px) {
      position: static;
      margin-top: 32px;
      display: flex;
      justify-content: center;
    }
    
    .dashboard-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 20px;
      min-width: 240px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(229, 231, 235, 0.8);
      
      &.normal-plan {
        border-left: 4px solid #6b7280;
      }
      
      &.vip-plan {
        border-left: 4px solid #f59e0b;
        background: linear-gradient(135deg, 
          rgba(255, 247, 237, 0.9) 0%, 
          rgba(254, 215, 170, 0.2) 100%);
      }
      
      &.svip-plan {
        border-left: 4px solid #9333ea;
        background: linear-gradient(135deg, 
          rgba(250, 245, 255, 0.9) 0%, 
          rgba(233, 213, 255, 0.2) 100%);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          
          &.normal { background: #6b7280; }
          &.vip { background: #f59e0b; }
          &.svip { background: #9333ea; }
          &.expired { background: #ef4444; animation: blink 2s infinite; }
        }
        
        .current-plan {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
      
      .plan-info {
        .plan-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .plan-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          
          &.expired {
            color: #ef4444;
            
            .status-icon {
              color: #ef4444;
            }
          }
          
          .status-icon {
            color: #10b981;
            flex-shrink: 0;
          }
        }
        
        .upgrade-hint {
          margin-top: 12px;
          
          .upgrade-link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
            
            &:hover {
              color: #2563eb;
            }
          }
        }
      }
    }
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.vip-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    margin-bottom: 40px;
  }
}

.header-content {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  
  .title-icon {
    color: #f39c12;
  }
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.current-status {
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 12px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  
  &.vip {
    background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
    border-color: #f97316;
    color: #ea580c;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
}

.status-info {
  flex: 1;
  min-width: 0;
}

.status-level {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.status-expire {
  font-size: 14px;
  opacity: 0.8;
  
  &.expired {
    color: #ef4444;
  }
}

// 企业级套餐选择区域
.enterprise-pricing {
  margin: 80px 0;
  
  .pricing-header {
    text-align: center;
    margin-bottom: 64px;
    
    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 50px;
      font-size: 13px;
      font-weight: 600;
      color: #4f46e5;
      margin-bottom: 20px;
      
      .badge-dot {
        width: 6px;
        height: 6px;
        background: #6366f1;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
    
    .pricing-title {
      font-size: 40px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
      
      @media (max-width: 768px) {
        font-size: 28px;
      }
    }
    
    .pricing-subtitle {
      font-size: 18px;
      color: #64748b;
      margin: 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
      
      @media (max-width: 768px) {
        font-size: 16px;
      }
    }
  }
  
  .plan-section {
    margin-bottom: 64px;
    
    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      padding: 24px 32px;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.8) 100%);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(229, 231, 235, 0.6);
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
        text-align: center;
        padding: 20px;
      }
      
      .title-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        margin-right: 16px;
        
        &.vip-icon {
          background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.1) 0%, 
            rgba(217, 119, 6, 0.1) 100%);
          color: #f59e0b;
        }
        
        &.svip-icon {
          background: linear-gradient(135deg, 
            rgba(147, 51, 234, 0.1) 0%, 
            rgba(124, 58, 237, 0.1) 100%);
          color: #9333ea;
        }
      }
      
      .title-content {
        flex: 1;
        
        h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px;
        }
        
        p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      }
      
      .discount-chip {
        padding: 8px 16px;
        border-radius: 50px;
        font-size: 13px;
        font-weight: 600;
        color: white;
        
        &.vip-discount {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        &.svip-discount {
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
        }
      }
    }
  }
  
  .enterprise-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  
  .enterprise-card {
    position: relative;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(248, 250, 252, 0.9) 100%);
    backdrop-filter: blur(30px) saturate(180%);
    border-radius: 24px;
    border: 1px solid rgba(229, 231, 235, 0.6);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.12),
        0 16px 32px rgba(0, 0, 0, 0.08);
    }
    
    &.popular {
      transform: scale(1.05);
      z-index: 2;
      
      &:hover {
        transform: translateY(-8px) scale(1.07);
      }
    }
    
    &.vip-tier {
      border-left: 4px solid #f59e0b;
      
      &:hover {
        border-color: #f59e0b;
        box-shadow: 
          0 32px 64px rgba(245, 158, 11, 0.15),
          0 16px 32px rgba(245, 158, 11, 0.1);
      }
    }
    
    &.svip-tier {
      border-left: 4px solid #9333ea;
      
      &:hover {
        border-color: #9333ea;
        box-shadow: 
          0 32px 64px rgba(147, 51, 234, 0.15),
          0 16px 32px rgba(147, 51, 234, 0.1);
      }
    }
    
    .popular-banner {
      position: absolute;
      top: 20px;
      right: -32px;
      transform: rotate(45deg);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 8px 40px;
      font-size: 12px;
      font-weight: 600;
      z-index: 3;
      
      &.svip-banner {
        background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
      }
      
      .banner-content {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    
    .card-content {
      padding: 32px;
      
      .plan-header {
        text-align: center;
        margin-bottom: 32px;
        
        .plan-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1) 0%, 
            rgba(139, 69, 193, 0.1) 100%);
          color: #6366f1;
          
          &.svip-icon {
            background: linear-gradient(135deg, 
              rgba(147, 51, 234, 0.1) 0%, 
              rgba(124, 58, 237, 0.1) 100%);
            color: #9333ea;
          }
        }
        
        .plan-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px;
        }
        
        .plan-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      }
      
      .pricing-display {
        text-align: center;
        margin-bottom: 32px;
        
        .price-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
          margin-bottom: 8px;
          
          .currency {
            font-size: 20px;
            font-weight: 600;
            color: #64748b;
          }
          
          .amount {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
            line-height: 1;
          }
          
          .decimal {
            font-size: 24px;
            font-weight: 600;
            color: #64748b;
          }
        }
        
        .price-period {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }
        
        .price-note {
          font-size: 12px;
          color: #9ca3af;
        }
      }
      
      .plan-features {
        margin-bottom: 32px;
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 14px;
          color: #4b5563;
          
          .check-icon {
            color: #10b981;
            flex-shrink: 0;
          }
        }
      }
      
      .enterprise-btn {
        width: 100%;
        height: 56px;
        border: none;
        border-radius: 16px;
        font-size: 16px;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            transparent 100%);
          transition: left 0.6s ease;
        }
        
        &:hover::before {
          left: 100%;
        }
        
        &.vip-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(245, 158, 11, 0.4);
          }
          
          &:active {
            transform: translateY(0);
          }
        }
        
        &.svip-btn {
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          box-shadow: 0 8px 24px rgba(147, 51, 234, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(147, 51, 234, 0.4);
          }
          
          &:active {
            transform: translateY(0);
          }
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          
          &:hover {
            transform: none !important;
            box-shadow: 0 8px 24px rgba(147, 51, 234, 0.3) !important;
          }
        }
        
        .loading-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          
          .loading-icon {
            animation: spin 1s linear infinite;
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.vip-comparison {
  margin: 80px 0;
  
  @media (max-width: 768px) {
    margin: 60px 0;
  }
  
  .comparison-title {
    text-align: center;
    margin-bottom: 48px;
    
    h2 {
      font-size: 36px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
      
      @media (max-width: 768px) {
        font-size: 28px;
      }
    }
    
    p {
      font-size: 18px;
      color: #64748b;
      margin: 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
      
      @media (max-width: 768px) {
        font-size: 16px;
      }
    }
  }
  
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    
    @media (max-width: 1024px) {
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  
  .level-card {
    padding: 40px 32px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(248, 250, 252, 0.9) 100%);
    backdrop-filter: blur(30px) saturate(180%);
    border-radius: 24px;
    border: 1px solid rgba(229, 231, 235, 0.6);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #e5e7eb 0%, #e5e7eb 100%);
    }
    
    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
    }
    
    &.current {
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
      
      &::before {
        background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
      }
    }
    
    &.vip {
      border-color: rgba(245, 158, 11, 0.3);
      
      &::before {
        background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
      }
      
      &:hover {
        box-shadow: 0 24px 48px rgba(245, 158, 11, 0.2);
      }
    }
    
    &.svip {
      border-color: rgba(147, 51, 234, 0.3);
      transform: scale(1.05);
      z-index: 2;
      
      &::before {
        background: linear-gradient(90deg, #9333ea 0%, #7c3aed 100%);
      }
      
      &:hover {
        transform: translateY(-8px) scale(1.07);
        box-shadow: 0 24px 48px rgba(147, 51, 234, 0.2);
      }
    }
    
    .card-header {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      
      .level-icon {
        margin-bottom: 16px;
        
        svg {
          transition: transform 0.3s ease;
        }
      }
      
      h3 {
        font-size: 22px;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
        letter-spacing: -0.01em;
      }
      
      .current-badge {
        position: absolute;
        top: -12px;
        right: -12px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
    }
    
    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .benefit-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        font-size: 15px;
        color: #4b5563;
        line-height: 1.5;
        
        .check-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
          transition: transform 0.2s ease;
        }
        
        &:hover .check-icon {
          transform: scale(1.1);
        }
      }
    }
    
    &:hover .level-icon svg {
      transform: scale(1.1) rotate(5deg);
    }
  }
}

.vip-packages {
  margin-bottom: 40px;
}

.packages-title {
  text-align: center;
  margin-bottom: 40px;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
  }
  
  p {
    font-size: 16px;
    color: #64748b;
    margin: 0;
  }
}

.package-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px 24px;
  border-radius: 12px;
  
  &.vip-header {
    background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
    
    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #ea580c;
      margin: 0;
    }
  }
  
  &.svip-header {
    background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%);
    
    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #7c3aed;
      margin: 0;
    }
  }
}

.discount-badge {
  background: #f59e0b;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  
  &.svip {
    background: #9333ea;
  }
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.package-card {
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }
  
  &.recommended {
    border-color: #10b981;
    
    &:hover {
      box-shadow: 0 12px 25px rgba(16, 185, 129, 0.3);
    }
  }
  
  &.vip-card {
    &:hover {
      border-color: #f59e0b;
      box-shadow: 0 12px 25px rgba(245, 158, 11, 0.2);
    }
  }
  
  &.svip-card {
    &:hover {
      border-color: #9333ea;
      box-shadow: 0 12px 25px rgba(147, 51, 234, 0.2);
    }
  }
}

.package-header {
  margin-bottom: 20px;
  position: relative;
  
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }
}

.recommended-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #10b981;
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  
  &.svip {
    background: #9333ea;
  }
}

.package-price {
  margin-bottom: 16px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.duration {
  font-size: 14px;
  color: #64748b;
}

.package-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.5;
}

.purchase-btn {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.vip-btn {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
    }
  }
  
  &.svip-btn {
    background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(147, 51, 234, 0.4);
    }
  }
}

.max-level-notice {
  text-align: center;
  padding: 80px 20px;
  
  .notice-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 64px 48px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(250, 245, 255, 0.9) 100%);
    backdrop-filter: blur(30px) saturate(180%);
    border-radius: 32px;
    border: 1px solid rgba(233, 213, 255, 0.6);
    box-shadow: 
      0 20px 40px rgba(147, 51, 234, 0.1),
      0 8px 16px rgba(147, 51, 234, 0.05);
    position: relative;
    overflow: hidden;
    
    @media (max-width: 768px) {
      padding: 48px 32px;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #9333ea 0%, #7c3aed 50%, #9333ea 100%);
    }
    
    .notice-icon {
      margin-bottom: 32px;
      
      svg {
        filter: drop-shadow(0 4px 8px rgba(147, 51, 234, 0.2));
        animation: gentle-bounce 3s ease-in-out infinite;
      }
    }
    
    h3 {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
      
      @media (max-width: 768px) {
        font-size: 24px;
      }
    }
    
    p {
      font-size: 18px;
      color: #64748b;
      margin: 0 0 32px;
      line-height: 1.6;
      
      @media (max-width: 768px) {
        font-size: 16px;
      }
    }
    
    .expire-info {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, 
        rgba(147, 51, 234, 0.1) 0%, 
        rgba(124, 58, 237, 0.1) 100%);
      border: 1px solid rgba(147, 51, 234, 0.2);
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      color: #9333ea;
      
      &::before {
        content: '⏰';
        font-size: 16px;
      }
    }
  }
}

@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

// 支付对话框企业级样式
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  
  .el-dialog__header {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 24px 32px;
    border-bottom: 1px solid #e2e8f0;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }
  }
  
  .el-dialog__body {
    padding: 32px;
  }
  
  .el-dialog__footer {
    padding: 24px 32px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }
}

// 支付详情优化
.payment-details {
  .package-info {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1e293b;
    }
    
    p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
  }
  
  .payment-summary {
    margin-bottom: 24px;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.total {
      font-size: 16px;
      font-weight: 600;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      margin-top: 8px;
    }
  }
  
  .price {
    color: #64748b;
  }
  
  .total-price {
    color: #ef4444;
    font-size: 18px;
  }
  
  .payment-methods {
    h5 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }
  }
  
  .payment-options {
    width: 100%;
  }
  
  .payment-option {
    width: 100%;
    margin-bottom: 12px;
    
    :deep(.el-radio__label) {
      width: 100%;
      padding-left: 12px;
    }
  }
  
  .payment-method-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #3b82f6;
    }
  }
  
  .method-name {
    font-weight: 500;
    color: #1e293b;
  }
  
  .balance-info {
    font-size: 12px;
    color: #64748b;
  }
}

.dialog-footer {
  text-align: right;
  
  .el-button {
    height: 44px;
    padding: 0 24px;
    border-radius: 12px;
    font-weight: 600;
    
    &.el-button--primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
      }
    }
  }
}

// 响应式设计优化
@media (max-width: 1024px) {
  .vip-container {
    padding: 32px 16px;
  }
  
  .enterprise-hero {
    margin: 32px 0 60px;
    padding: 60px 0;
    
    .hero-title {
      font-size: 42px;
    }
    
    .hero-subtitle {
      font-size: 18px;
    }
  }
  
  .enterprise-pricing {
    margin: 60px 0;
    
    .pricing-header {
      margin-bottom: 48px;
      
      .pricing-title {
        font-size: 32px;
      }
    }
    
    .plan-section {
      margin-bottom: 48px;
    }
  }
}

@media (max-width: 768px) {
  .enterprise-header {
    .header-container {
      height: 64px;
      padding: 0 16px;
    }
    
    .logo-text .company-name {
      font-size: 20px;
    }
    
    .header-actions {
      gap: 16px;
    }
  }
  
  .enterprise-hero {
    margin: 24px 0 48px;
    padding: 48px 0;
    border-radius: 24px;
    
    .hero-content {
      padding: 0 24px;
    }
    
    .hero-title {
      font-size: 32px;
      margin-bottom: 16px;
    }
    
    .hero-subtitle {
      font-size: 16px;
      margin-bottom: 32px;
    }
    
    .hero-stats {
      margin-bottom: 24px;
      
      .stat-item .stat-number {
        font-size: 24px;
      }
    }
  }
  
  .enterprise-pricing {
    margin: 48px 0;
    
    .pricing-header {
      margin-bottom: 32px;
      
      .pricing-title {
        font-size: 24px;
      }
      
      .pricing-subtitle {
        font-size: 14px;
      }
    }
    
    .plan-section {
      margin-bottom: 32px;
      
      .section-title {
        .title-content h3 {
          font-size: 20px;
        }
      }
    }
    
    .enterprise-card {
      .card-content {
        padding: 24px;
        
        .plan-header {
          margin-bottom: 24px;
          
          .plan-icon {
            width: 56px;
            height: 56px;
          }
          
          .plan-title {
            font-size: 18px;
          }
        }
        
        .pricing-display {
          margin-bottom: 24px;
          
          .price-main .amount {
            font-size: 40px;
          }
        }
        
        .plan-features {
          margin-bottom: 24px;
        }
        
        .enterprise-btn {
          height: 48px;
        }
      }
    }
  }
  
  .vip-comparison {
    margin: 48px 0;
    
    .comparison-title {
      margin-bottom: 32px;
      
      h2 {
        font-size: 24px;
      }
    }
    
    .level-card {
      padding: 32px 24px;
      
      .card-header {
        margin-bottom: 24px;
      }
    }
  }
}
</style>