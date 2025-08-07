<template>
  <div class="enterprise-maintenance">
    <!-- 动态背景 -->
    <div class="background-layer">
      <div class="particles-container">
        <div 
          v-for="i in 50" 
          :key="i" 
          class="particle"
          :style="{ 
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 10 + 's',
            animationDuration: (8 + Math.random() * 4) + 's'
          }"
        ></div>
      </div>
      
      <div class="gradient-overlay"></div>
      <div class="geometric-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部导航栏 -->
      <header class="enterprise-header">
        <div class="header-content">
          <div class="brand-section">
            <div class="brand-logo">
              <el-icon class="logo-icon"><Setting /></el-icon>
            </div>
            <div class="brand-info">
              <h4>Enterprise System</h4>
              <span>卡密管理系统</span>
            </div>
          </div>
          
          <div class="header-status">
            <div class="status-indicator">
              <div class="status-dot maintenance"></div>
              <span>维护模式</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容 -->
      <main class="main-content">
        <div class="maintenance-hero">
          <div class="hero-icon">
            <div class="icon-container">
              <el-icon class="primary-icon"><Tools /></el-icon>
              <div class="icon-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
                <div class="ring ring-3"></div>
              </div>
            </div>
          </div>
          
          <div class="hero-content">
            <h1 class="hero-title">{{ maintenanceInfo.title || '系统维护升级中' }}</h1>
            <p class="hero-subtitle">
              我们正在对系统进行重要更新，以为您提供更好的服务体验
            </p>
            <div class="status-badge">
              <el-tag type="warning" size="large" effect="dark">
                <el-icon><Warning /></el-icon>
                正在维护
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 信息卡片区域 -->
        <div class="info-cards-section">
          <div class="section-header">
            <h2>维护详情</h2>
            <p>详细的维护信息和预计完成时间</p>
          </div>
          
          <div class="cards-grid">
            <!-- 维护原因卡片 -->
            <div class="info-card reason-card">
              <div class="card-header">
                <div class="card-icon reason-icon">
                  <el-icon><DocumentChecked /></el-icon>
                </div>
                <div class="card-title">
                  <h3>维护类型</h3>
                  <span>Maintenance Type</span>
                </div>
              </div>
              <div class="card-content">
                <div class="reason-tag">
                  <el-tag :type="getReasonTagType(maintenanceInfo.reason)" size="large">
                    {{ getReasonText(maintenanceInfo.reason) }}
                  </el-tag>
                </div>
                <p class="reason-desc">{{ getReasonDescription(maintenanceInfo.reason) }}</p>
              </div>
            </div>

            <!-- 时间信息卡片 -->
            <div class="info-card time-card">
              <div class="card-header">
                <div class="card-icon time-icon">
                  <el-icon><Clock /></el-icon>
                </div>
                <div class="card-title">
                  <h3>时间安排</h3>
                  <span>Time Schedule</span>
                </div>
              </div>
              <div class="card-content">
                <div class="time-stats">
                  <div class="time-stat">
                    <span class="stat-label">预计时长</span>
                    <span class="stat-value">{{ formatDuration(maintenanceInfo.estimatedDuration || 60) }}</span>
                  </div>
                  <div class="time-stat" v-if="maintenanceInfo.startTime">
                    <span class="stat-label">已用时长</span>
                    <span class="stat-value">{{ formatDuration(elapsedTime) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系方式卡片 -->
            <div class="info-card contact-card">
              <div class="card-header">
                <div class="card-icon contact-icon">
                  <el-icon><Service /></el-icon>
                </div>
                <div class="card-title">
                  <h3>技术支持</h3>
                  <span>Technical Support</span>
                </div>
              </div>
              <div class="card-content">
                <div class="contact-info">
                  <div class="contact-item">
                    <el-icon><Phone /></el-icon>
                    <span>{{ maintenanceInfo.contact || '400-xxx-xxxx' }}</span>
                  </div>
                  <div class="contact-item">
                    <el-icon><Message /></el-icon>
                    <span>support@company.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 进度区域 -->
        <div class="progress-section" v-if="maintenanceInfo.startTime">
          <div class="section-header">
            <h2>维护进度</h2>
            <p>实时维护进度和预计完成时间</p>
          </div>
          
          <div class="progress-container">
            <div class="progress-info">
              <div class="progress-stats">
                <div class="stat-item">
                  <div class="stat-icon">
                    <el-icon><Timer /></el-icon>
                  </div>
                  <div class="stat-content">
                    <span class="stat-number">{{ formatDuration(elapsedTime) }}</span>
                    <span class="stat-label">已维护时长</span>
                  </div>
                </div>
                
                <div class="stat-divider"></div>
                
                <div class="stat-item" v-if="remainingTime > 0">
                  <div class="stat-icon">
                    <el-icon><Clock /></el-icon>
                  </div>
                  <div class="stat-content">
                    <span class="stat-number">{{ formatDuration(remainingTime) }}</span>
                    <span class="stat-label">预计剩余</span>
                  </div>
                </div>
              </div>
              
              <div class="progress-bar-container">
                <div class="progress-header">
                  <span class="progress-label">维护进度</span>
                  <span class="progress-percentage">{{ progressPercentage.toFixed(1) }}%</span>
                </div>
                <el-progress 
                  :percentage="progressPercentage" 
                  :stroke-width="12"
                  :show-text="false"
                  status="success"
                  striped
                  striped-flow
                  class="enterprise-progress"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 公告区域 -->
        <div class="announcement-section">
          <div class="announcement-card">
            <div class="announcement-header">
              <el-icon class="announcement-icon"><Bell /></el-icon>
              <h3>重要公告</h3>
            </div>
            <div class="announcement-content">
              <p>{{ maintenanceInfo.description || '我们正在进行系统升级，以提升性能和安全性。维护期间所有服务将暂时不可用，预计很快恢复正常。感谢您的耐心等待。' }}</p>
              
              <div class="notice-list">
                <div class="notice-item">
                  <el-icon class="notice-icon"><InfoFilled /></el-icon>
                  <span>维护期间所有功能将暂停使用</span>
                </div>
                <div class="notice-item">
                  <el-icon class="notice-icon"><WarningFilled /></el-icon>
                  <span>数据安全得到完全保障</span>
                </div>
                <div class="notice-item">
                  <el-icon class="notice-icon"><CircleCheckFilled /></el-icon>
                  <span>服务将在维护完成后立即恢复</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="actions-section">
          <div class="actions-container">
            <el-button 
              type="primary" 
              size="large"
              @click="refreshPage" 
              :loading="refreshing"
              class="action-btn primary-btn"
            >
              <el-icon><Refresh /></el-icon>
              检查状态
            </el-button>
            
            <el-button 
              v-if="userStore.isAdmin" 
              type="success" 
              size="large"
              @click="goToAdmin"
              class="action-btn admin-btn"
            >
              <el-icon><Tools /></el-icon>
              管理控制台
            </el-button>
            
            <el-button 
              type="info" 
              size="large"
              @click="goHome"
              class="action-btn home-btn"
            >
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
          </div>
        </div>
      </main>

      <!-- 企业级页脚 -->
      <footer class="enterprise-footer">
        <div class="footer-content">
          <div class="footer-info">
            <p>&copy; 2024 Enterprise Card System. All rights reserved.</p>
            <p>专业的卡密管理解决方案 | 企业级安全保障</p>
          </div>
          
          <div class="footer-links">
            <a href="#" class="footer-link">服务条款</a>
            <a href="#" class="footer-link">隐私政策</a>
            <a href="#" class="footer-link">技术支持</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '@/stores/maintenance'
import { useUserStore } from '@/stores/user'
import { 
  Tools, Warning, Clock, Service, Refresh, House, Setting,
  DocumentChecked, Phone, Message, Timer, Bell,
  InfoFilled, WarningFilled, CircleCheckFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const userStore = useUserStore()

const refreshing = ref(false)
const elapsedTime = ref(0)
const timer = ref(null)

const maintenanceInfo = computed(() => {
  return maintenanceStore.getMaintenanceInfo()
})

const remainingTime = computed(() => {
  if (!maintenanceInfo.value.estimatedDuration) return 0
  const estimated = maintenanceInfo.value.estimatedDuration
  const elapsed = elapsedTime.value
  return Math.max(0, estimated - elapsed)
})

const progressPercentage = computed(() => {
  if (!maintenanceInfo.value.estimatedDuration) return 0
  const percentage = (elapsedTime.value / maintenanceInfo.value.estimatedDuration) * 100
  return Math.min(100, Math.max(0, percentage))
})

const getReasonText = (reason) => {
  const reasonMap = {
    upgrade: '系统升级',
    security: '安全更新',
    performance: '性能优化',
    bugfix: 'Bug修复',
    database: '数据库维护',
    server: '服务器维护',
    other: '其他'
  }
  return reasonMap[reason] || '系统维护'
}

const getReasonTagType = (reason) => {
  const tagTypeMap = {
    upgrade: 'primary',
    security: 'danger',
    performance: 'success',
    bugfix: 'warning',
    database: 'info',
    server: 'warning',
    other: 'info'
  }
  return tagTypeMap[reason] || 'info'
}

const getReasonDescription = (reason) => {
  const descriptionMap = {
    upgrade: '正在进行系统版本升级，增加新功能和改进用户体验',
    security: '进行重要的安全补丁更新，确保系统安全性',
    performance: '优化系统性能，提升响应速度和稳定性',
    bugfix: '修复已知问题，改善系统功能和稳定性',
    database: '进行数据库优化和维护，确保数据安全',
    server: '服务器硬件维护，提升系统可靠性',
    other: '进行必要的系统维护工作'
  }
  return descriptionMap[reason] || '正在进行系统维护，以确保最佳服务质量'
}

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} 分钟`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`
  }
}

const updateElapsedTime = () => {
  if (maintenanceInfo.value.startTime) {
    const startTime = new Date(maintenanceInfo.value.startTime)
    const now = new Date()
    elapsedTime.value = Math.floor((now - startTime) / (1000 * 60))
  }
}

const refreshPage = () => {
  refreshing.value = true
  
  // 检查维护状态
  const isActive = maintenanceStore.checkMaintenanceMode()
  
  setTimeout(() => {
    if (!isActive) {
      // 维护结束，跳转到首页
      router.push('/')
    } else {
      refreshing.value = false
    }
  }, 1000)
}

const goToAdmin = () => {
  router.push('/admin')
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  // 更新维护信息
  maintenanceStore.checkMaintenanceMode()
  
  // 启动计时器
  updateElapsedTime()
  timer.value = setInterval(updateElapsedTime, 60000) // 每分钟更新
  
  // 如果不是维护模式，跳转到首页
  if (!maintenanceStore.isMaintenanceActive()) {
    router.push('/')
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style lang="scss" scoped>
// 企业级维护页面样式
.enterprise-maintenance {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

// 动态背景层
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  // 渐变背景
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #667eea 0%,
      #764ba2 25%,
      #667eea 50%,
      #f093fb 75%,
      #f5576c 100%
    );
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
  }
  
  // 粒子效果
  .particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: particleFloat linear infinite;
      
      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        animation: particlePulse 2s ease-in-out infinite;
      }
    }
  }
  
  // 几何形状装饰
  .geometric-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .shape {
      position: absolute;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(2px);
      animation: shapeFloat 20s ease-in-out infinite;
      
      &.shape-1 {
        width: 200px;
        height: 200px;
        top: 10%;
        left: -50px;
        transform: rotate(45deg);
        animation-delay: 0s;
      }
      
      &.shape-2 {
        width: 150px;
        height: 150px;
        bottom: 20%;
        right: -30px;
        transform: rotate(-30deg);
        animation-delay: 7s;
      }
      
      &.shape-3 {
        width: 100px;
        height: 100px;
        top: 60%;
        left: 5%;
        transform: rotate(60deg);
        animation-delay: 14s;
      }
    }
  }
}

// 内容包装器
.content-wrapper {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// 企业级顶部导航
.enterprise-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .brand-logo {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #409EFF, #67C23A);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
        
        .logo-icon {
          font-size: 24px;
          color: white;
        }
      }
      
      .brand-info {
        h4 {
          margin: 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }
      }
    }
    
    .header-status {
      .status-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          
          &.maintenance {
            background: #F56C6C;
            animation: statusPulse 2s ease-in-out infinite;
          }
        }
        
        span {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
}

// 主内容区域
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px;
  width: 100%;
}

// Hero区域
.maintenance-hero {
  text-align: center;
  margin-bottom: 64px;
  
  .hero-icon {
    margin-bottom: 32px;
    
    .icon-container {
      position: relative;
      display: inline-block;
      
      .primary-icon {
        font-size: 80px;
        color: white;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        animation: iconRotate 6s linear infinite;
      }
      
      .icon-rings {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        .ring {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: ringExpand 3s ease-in-out infinite;
          
          &.ring-1 {
            width: 120px;
            height: 120px;
            margin: -60px 0 0 -60px;
            animation-delay: 0s;
          }
          
          &.ring-2 {
            width: 160px;
            height: 160px;
            margin: -80px 0 0 -80px;
            animation-delay: 1s;
          }
          
          &.ring-3 {
            width: 200px;
            height: 200px;
            margin: -100px 0 0 -100px;
            animation-delay: 2s;
          }
        }
      }
    }
  }
  
  .hero-content {
    .hero-title {
      font-size: 48px;
      font-weight: 700;
      color: white;
      margin: 0 0 16px 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }
    
    .hero-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 24px 0;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .status-badge {
      display: inline-block;
      
      .el-tag {
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 30px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// 信息卡片区域
.info-cards-section {
  margin-bottom: 64px;
  
  .section-header {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    
    .info-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 32px;
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        
        .card-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          
          &.reason-icon {
            background: linear-gradient(135deg, #409EFF, #67C23A);
            box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
          }
          
          &.time-icon {
            background: linear-gradient(135deg, #E6A23C, #F56C6C);
            box-shadow: 0 4px 16px rgba(245, 108, 108, 0.3);
          }
          
          &.contact-icon {
            background: linear-gradient(135deg, #67C23A, #85CE61);
            box-shadow: 0 4px 16px rgba(103, 194, 58, 0.3);
          }
          
          .el-icon {
            font-size: 24px;
            color: white;
          }
        }
        
        .card-title {
          h3 {
            margin: 0 0 4px 0;
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          span {
            font-size: 12px;
            color: #8c8c8c;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        }
      }
      
      .card-content {
        .reason-tag {
          margin-bottom: 12px;
          
          .el-tag {
            font-weight: 600;
          }
        }
        
        .reason-desc {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }
        
        .time-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
          
          .time-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .stat-label {
              color: #8c8c8c;
              font-size: 14px;
            }
            
            .stat-value {
              color: #1a1a1a;
              font-size: 18px;
              font-weight: 600;
            }
          }
        }
        
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 12px;
            
            .el-icon {
              color: #409EFF;
              font-size: 16px;
            }
            
            span {
              color: #1a1a1a;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}

// 进度区域
.progress-section {
  margin-bottom: 64px;
  
  .section-header {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  }
  
  .progress-container {
    .progress-info {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 24px;
      padding: 40px;
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      .progress-stats {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 32px;
        gap: 40px;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .stat-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #409EFF, #67C23A);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .el-icon {
              font-size: 20px;
              color: white;
            }
          }
          
          .stat-content {
            display: flex;
            flex-direction: column;
            
            .stat-number {
              font-size: 24px;
              font-weight: 700;
              color: #1a1a1a;
              line-height: 1;
            }
            
            .stat-label {
              font-size: 14px;
              color: #8c8c8c;
              margin-top: 4px;
            }
          }
        }
        
        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e5e5e5;
        }
      }
      
      .progress-bar-container {
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          .progress-label {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .progress-percentage {
            font-size: 20px;
            font-weight: 700;
            color: #409EFF;
          }
        }
        
        .enterprise-progress {
          .el-progress-bar__outer {
            background-color: #f0f0f0;
          }
        }
      }
    }
  }
}

// 公告区域
.announcement-section {
  margin-bottom: 64px;
  
  .announcement-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 40px;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    .announcement-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      
      .announcement-icon {
        font-size: 24px;
        color: #409EFF;
        margin-right: 12px;
      }
      
      h3 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
      }
    }
    
    .announcement-content {
      p {
        color: #666;
        line-height: 1.8;
        margin: 0 0 24px 0;
        font-size: 16px;
      }
      
      .notice-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .notice-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #f8f9fa;
          border-radius: 16px;
          border-left: 4px solid #409EFF;
          
          .notice-icon {
            font-size: 18px;
            color: #409EFF;
            flex-shrink: 0;
          }
          
          span {
            color: #1a1a1a;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 操作按钮区域
.actions-section {
  margin-bottom: 40px;
  
  .actions-container {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    
    .action-btn {
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 16px;
      min-width: 160px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &.primary-btn:hover {
        box-shadow: 0 8px 24px rgba(64, 158, 255, 0.4);
      }
      
      &.admin-btn:hover {
        box-shadow: 0 8px 24px rgba(103, 194, 58, 0.4);
      }
      
      &.home-btn:hover {
        box-shadow: 0 8px 24px rgba(144, 147, 153, 0.4);
      }
    }
  }
}

// 企业级页脚
.enterprise-footer {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .footer-info {
      p {
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        
        &:first-child {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        &:last-child {
          font-size: 12px;
        }
      }
    }
    
    .footer-links {
      display: flex;
      gap: 24px;
      
      .footer-link {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 14px;
        transition: color 0.3s ease;
        
        &:hover {
          color: white;
        }
      }
    }
  }
}

// 动画定义
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes particleFloat {
  from {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    transform: translateY(-10vh) translateX(100px);
    opacity: 0;
  }
}

@keyframes particlePulse {
  0%, 100% { 
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% { 
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes shapeFloat {
  0%, 100% { transform: translateY(0px) rotate(45deg); }
  33% { transform: translateY(-30px) rotate(90deg); }
  66% { transform: translateY(-15px) rotate(135deg); }
}

@keyframes statusPulse {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 8px #F56C6C;
  }
  50% { 
    opacity: 0.6;
    box-shadow: 0 0 16px #F56C6C;
  }
}

@keyframes iconRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .main-content {
    padding: 32px 24px;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .progress-stats {
    flex-direction: column;
    gap: 24px !important;
    
    .stat-divider {
      width: 40px !important;
      height: 1px !important;
    }
  }
}

@media (max-width: 768px) {
  .enterprise-header .header-content {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
  }
  
  .main-content {
    padding: 24px 20px;
  }
  
  .hero-content .hero-title {
    font-size: 36px;
  }
  
  .section-header h2 {
    font-size: 28px;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .info-card {
    padding: 24px !important;
  }
  
  .actions-container {
    flex-direction: column;
    
    .action-btn {
      width: 100%;
    }
  }
  
  .enterprise-footer .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-content .hero-title {
    font-size: 28px;
  }
  
  .progress-info {
    padding: 24px !important;
  }
  
  .announcement-card {
    padding: 24px !important;
  }
}
</style>