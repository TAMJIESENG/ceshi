<template>
  <div class="home">
    <!-- 专业顶部导航栏 -->
    <header class="main-header">
      <nav class="nav-container">
        <div class="brand">
          <div class="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect x="6" y="6" width="20" height="20" rx="3" fill="#2563eb" opacity="0.2"/>
              <rect x="4" y="4" width="20" height="20" rx="3" stroke="#2563eb" stroke-width="2" fill="none"/>
              <rect x="10" y="12" width="8" height="2" rx="1" fill="#2563eb"/>
              <rect x="10" y="16" width="12" height="2" rx="1" fill="#2563eb"/>
            </svg>
          </div>
          <span class="brand-text">CardKey<span class="brand-suffix">Pro</span></span>
        </div>
        
        <div class="nav-links" v-if="!isLoggedIn">
          <a href="#features" @click.prevent="scrollToSection('features')">产品功能</a>
          <a href="#announcements" @click.prevent="scrollToSection('announcements')">系统公告</a>
          <a href="#support" @click.prevent="scrollToSection('support')">技术支持</a>
        </div>
        
        <div class="nav-actions">
          <template v-if="!isLoggedIn">
            <el-button text class="login-btn" @click="$router.push('/login')">
              登录
            </el-button>
            <el-button type="primary" class="signup-btn" @click="$router.push('/register')">
              免费试用
            </el-button>
          </template>
          
          <template v-else>
            <!-- 公告按钮 -->
            <el-tooltip :content="hasNewAnnouncements ? '有新公告！点击查看' : '查看系统公告'" placement="bottom">
              <el-button 
                type="primary" 
                :icon="Bell" 
                circle 
                :class="['announcement-btn', { 'has-new': hasNewAnnouncements }]"
                @click="$router.push('/announcements')"
              />
            </el-tooltip>
            
            <!-- 用户菜单 -->
            <el-dropdown @command="handleCommand" class="user-menu">
              <div class="user-info">
                <el-avatar :size="36" :src="user?.avatar || ''" class="user-avatar">
                  <template v-if="!user?.avatar">
                    {{ user?.username?.charAt(0)?.toUpperCase() }}
                  </template>
                </el-avatar>
                <div class="user-details">
                  <span class="user-name">{{ user?.username }}</span>
                  <span class="user-role">{{ isAdmin ? '管理员' : '用户' }}</span>
                </div>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="dashboard">
                    <el-icon><Monitor /></el-icon>
                    工作台
                  </el-dropdown-item>
                  <el-dropdown-item command="cards">
                    <el-icon><ShoppingCart /></el-icon>
                    卡密商城
                  </el-dropdown-item>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人设置
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isAdmin" command="admin">
                    <el-icon><Tools /></el-icon>
                    系统管理
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 核心价值区块 -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-icon">🚀</span>
              <span>企业级卡密管理系统</span>
            </div>
            
            <h1 class="hero-title">
              安全可靠的
              <span class="title-highlight">数字卡密</span>
              管理解决方案
            </h1>
            
            <p class="hero-subtitle">
              专为企业和开发者打造的专业卡密系统，提供完整的生成、分发、统计和管理功能。
              支持多种业务场景，确保数据安全与业务稳定。
            </p>
            
            <!-- 核心数据展示 -->
            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-value">{{ formatNumber(stats.totalCards) }}</div>
                <div class="metric-label">累计卡密</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ formatNumber(stats.totalUsers) }}</div>
                <div class="metric-label">活跃用户</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">99.9%</div>
                <div class="metric-label">系统可用性</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">&lt;100ms</div>
                <div class="metric-label">响应时间</div>
              </div>
            </div>
            
            <!-- CTA按钮组 -->
            <div class="cta-group">
              <template v-if="!isLoggedIn">
                <el-button type="primary" size="large" class="primary-cta" @click="$router.push('/register')">
                  <span>立即开始</span>
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
                <el-button size="large" class="secondary-cta" @click="$router.push('/login')">
                  <el-icon><VideoPlay /></el-icon>
                  观看演示
                </el-button>
              </template>
              <template v-else>
                <el-button type="primary" size="large" class="primary-cta" @click="$router.push('/dashboard')">
                  <span>进入工作台</span>
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
                <el-button v-if="isAdmin" size="large" class="secondary-cta" @click="$router.push('/admin')">
                  <el-icon><Setting /></el-icon>
                  系统管理
                </el-button>
              </template>
            </div>
          </div>
          
          <!-- 右侧图形展示 -->
          <div class="hero-visual">
            <div class="dashboard-preview">
              <div class="preview-header">
                <div class="preview-dots">
                  <span></span><span></span><span></span>
                </div>
                <div class="preview-title">CardKey Pro Dashboard</div>
              </div>
              <div class="preview-content">
                <div class="preview-stats">
                  <div class="stat-bar" style="--width: 85%"></div>
                  <div class="stat-bar" style="--width: 92%"></div>
                  <div class="stat-bar" style="--width: 76%"></div>
                  <div class="stat-bar" style="--width: 98%"></div>
                </div>
                <div class="preview-chart">
                  <div class="chart-line"></div>
                  <div class="chart-dots">
                    <span style="--delay: 0s"></span>
                    <span style="--delay: 0.5s"></span>
                    <span style="--delay: 1s"></span>
                    <span style="--delay: 1.5s"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 公告通知区域 -->
      <section class="announcements-section" id="announcements">
        <HomeAnnouncements />
      </section>

      <!-- 核心功能模块 -->
      <section class="features-section" id="features">
        <div class="section-container">
          <div class="section-header">
            <div class="header-badge">核心功能</div>
            <h2 class="section-title">专业的卡密管理工具</h2>
            <p class="section-description">
              集成完整的卡密生命周期管理，从生成到销售再到数据分析，一站式解决您的业务需求
            </p>
          </div>

          <div class="features-grid">
            <div class="feature-card primary-feature" v-for="(feature, index) in coreFeatures" :key="index">
              <div class="feature-header">
                <div class="feature-icon-wrapper">
                  <el-icon :size="24" class="feature-icon"><component :is="feature.icon" /></el-icon>
                </div>
                <div class="feature-badge">{{ feature.badge }}</div>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
              <div class="feature-highlights">
                <span v-for="highlight in feature.highlights" :key="highlight" class="highlight-tag">
                  {{ highlight }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术优势 -->
      <section class="advantages-section" id="advantages">
        <div class="section-container">
          <div class="advantages-content">
            <div class="advantages-text">
              <div class="header-badge">技术优势</div>
              <h2 class="section-title">为什么选择 CardKey Pro</h2>
              <div class="advantages-list">
                <div class="advantage-item" v-for="(advantage, index) in technicalAdvantages" :key="index">
                  <div class="advantage-icon">
                    <el-icon><component :is="advantage.icon" /></el-icon>
                  </div>
                  <div class="advantage-content">
                    <h4>{{ advantage.title }}</h4>
                    <p>{{ advantage.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="advantages-visual">
              <div class="tech-stack">
                <div class="stack-item" v-for="(tech, index) in techStack" :key="index">
                  <div class="tech-icon">{{ tech.icon }}</div>
                  <div class="tech-name">{{ tech.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 专业页脚 -->
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand">
              <div class="brand-logo">
                <svg width="28" height="28" viewBox="0 0 32 32">
                  <rect x="6" y="6" width="20" height="20" rx="3" fill="#2563eb" opacity="0.2"/>
                  <rect x="4" y="4" width="20" height="20" rx="3" stroke="#2563eb" stroke-width="2" fill="none"/>
                  <rect x="10" y="12" width="8" height="2" rx="1" fill="#2563eb"/>
                  <rect x="10" y="16" width="12" height="2" rx="1" fill="#2563eb"/>
                </svg>
              </div>
              <span class="brand-text">CardKey<span class="brand-suffix">Pro</span></span>
            </div>
            <p class="footer-desc">企业级数字卡密管理系统，为您的业务提供安全可靠的解决方案。</p>
            <div class="footer-stats">
              <span>服务企业 500+</span>
              <span>•</span>
              <span>管理卡密 100万+</span>
            </div>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4>产品功能</h4>
              <ul>
                <li><a href="#" @click.prevent="">卡密生成</a></li>
                <li><a href="#" @click.prevent="">批量管理</a></li>
                <li><a href="#" @click.prevent="">销售统计</a></li>
                <li><a href="#" @click.prevent="">API接口</a></li>
              </ul>
            </div>
            
            <div class="link-group">
              <h4>技术支持</h4>
              <ul>
                <li><a href="#" @click.prevent="">开发文档</a></li>
                <li><a href="#" @click.prevent="">API文档</a></li>
                <li><a href="#" @click.prevent="">常见问题</a></li>
                <li><a href="#" @click.prevent="">技术博客</a></li>
              </ul>
            </div>
            
            <div class="link-group">
              <h4>关于我们</h4>
              <ul>
                <li><a href="#" @click.prevent="">公司介绍</a></li>
                <li><a href="#" @click.prevent="">联系我们</a></li>
                <li><a href="#" @click.prevent="">隐私政策</a></li>
                <li><a href="#" @click.prevent="">服务条款</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="copyright">
            <p>&copy; 2024 CardKey Pro. All rights reserved.</p>
            <p>企业级卡密管理系统解决方案</p>
          </div>
          <div class="footer-meta">
            <span>版本 v2.1.0</span>
            <span>•</span>
            <span>最后更新：{{ new Date().toLocaleDateString('zh-CN') }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  ArrowDown, ArrowRight, User, Setting, Monitor, Tools, SwitchButton,
  Key, Lock, TrendCharts, DataAnalysis, Lightning, VideoPlay,
  Document, Phone, Star, Check, ShoppingCart, Bell
} from '@element-plus/icons-vue'
import HomeAnnouncements from '@/components/HomeAnnouncements.vue'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const isAdmin = computed(() => userStore.isAdmin)
const user = computed(() => userStore.user)

// 检查是否有新公告（24小时内发布的）
const hasNewAnnouncements = computed(() => {
  try {
    const allAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
    const now = new Date()
    
    return allAnnouncements.some(announcement => {
      const createTime = new Date(announcement.createTime)
      const diffInHours = (now - createTime) / (1000 * 60 * 60)
      return diffInHours <= 24 && announcement.showOnHome
    })
  } catch {
    return false
  }
})

// 统计数据
const stats = ref({
  totalCards: 0,
  totalUsers: 0,
  todayCards: 0
})

// 核心功能
const coreFeatures = ref([
  {
    icon: markRaw(Key),
    badge: '核心',
    title: '智能卡密生成',
    description: '支持多种算法的卡密批量生成，可自定义格式、长度和有效期，确保每个卡密的唯一性和安全性。',
    highlights: ['批量生成', '自定义格式', '防重复', '有效期管理']
  },
  {
    icon: markRaw(Lock),
    badge: '安全',
    title: '数据安全保障',
    description: '企业级安全架构，数据加密传输和存储，完整的权限控制和操作审计，保障业务数据安全。',
    highlights: ['数据加密', '权限控制', '操作审计', '异常监控']
  },
  {
    icon: markRaw(TrendCharts),
    badge: '分析',
    title: '业务数据分析',
    description: '实时统计分析，多维度数据报表，帮助您深入了解卡密使用情况和业务趋势。',
    highlights: ['实时统计', '多维分析', '趋势预测', '自定义报表']
  }
])

// 技术优势
const technicalAdvantages = ref([
  {
    icon: markRaw(Lightning),
    title: '高性能架构',
    description: '采用现代化前端技术栈，响应速度快，支持大规模并发访问'
  },
  {
    icon: markRaw(Lock),
    title: '银行级安全',
    description: '多层安全防护机制，数据加密传输，确保系统和数据安全'
  },
  {
    icon: markRaw(Star),
    title: '灵活扩展',
    description: '模块化设计，支持业务定制和功能扩展，适应不同规模需求'
  },
  {
    icon: markRaw(Phone),
    title: '专业服务',
    description: '提供完整的技术文档、API接口和专业技术支持服务'
  }
])

// 技术栈展示
const techStack = ref([
  { icon: '🚀', name: 'Vue 3' },
  { icon: '⚡', name: 'Vite' },
  { icon: '🎨', name: 'Element Plus' },
  { icon: '🔒', name: 'JWT' },
  { icon: '📊', name: 'Charts' },
  { icon: '🔧', name: 'TypeScript' }
])

// 格式化数字显示
const formatNumber = (num) => {
  if (num >= 10000) {
    return Math.floor(num / 1000) + 'K+'
  }
  return num.toString()
}

// 加载统计数据
const loadStats = () => {
  try {
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    const today = new Date().toDateString()
    
    stats.value = {
      totalCards: allCards.length,
      totalUsers: allUsers.length,
      todayCards: allCards.filter(card => {
        const cardDate = new Date(card.createTime).toDateString()
        return cardDate === today
      }).length
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 滚动到指定区域
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId) || document.querySelector(`.${sectionId}-section`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'dashboard':
      router.push('/dashboard')
      break
    case 'cards':
      router.push('/cards')
      break
    case 'announcements':
      router.push('/announcements')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}

// 监听用户数据变化的处理函数
const handleStorageChange = (e) => {
  if (e.key === 'user_data') {
    // 用户数据更新，刷新用户store
    userStore.refreshCurrentUser()
  }
}

onMounted(() => {
  loadStats()
  // 定期更新统计数据
  setInterval(loadStats, 30000) // 每30秒更新一次
  
  // 监听用户数据变化，确保头像等信息实时更新
  window.addEventListener('storage', handleStorageChange)
  
  // 如果用户已登录，立即刷新用户数据确保头像等信息最新
  if (isLoggedIn.value) {
    userStore.refreshCurrentUser()
  }
})

onUnmounted(() => {
  // 组件卸载时清理监听器
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: #fafbfc;
}

// 专业顶部导航栏
.main-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  .brand-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }
  
  .brand-text {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: -0.5px;
    
    .brand-suffix {
      color: #2563eb;
      font-weight: 800;
    }
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
  
  a {
    color: #374151;
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
    transition: color 0.2s ease;
    position: relative;
    
    &:hover {
      color: #2563eb;
      
      &::after {
        width: 100%;
      }
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      height: 2px;
      width: 0;
      background: #2563eb;
      transition: width 0.3s ease;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .login-btn {
    color: #374151;
    font-weight: 500;
    
    &:hover {
      color: #2563eb;
    }
  }
  
  .signup-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    border: none;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
    
    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
  }
  
  .announcement-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    border: none;
    width: 40px;
    height: 40px;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
    }
    
    &:active {
      transform: translateY(-1px) scale(1.02);
    }
    
    // 可以添加小红点提示新公告
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
      animation: pulse 2s infinite;
      // 默认隐藏，可以通过JS控制显示
      display: none;
    }
    
    &.has-new::after {
      display: block;
    }
  }
}

.user-menu {
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f8fafc;
    }
    
    .user-avatar {
      border: 2px solid #e5e7eb;
      
      .el-avatar__inner {
        background: #2563eb;
        color: white;
        font-weight: 600;
      }
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      
      .user-name {
        font-weight: 600;
        color: #1a1a1a;
        font-size: 14px;
      }
      
      .user-role {
        font-size: 12px;
        color: #6b7280;
        margin-top: -2px;
      }
    }
    
    .dropdown-icon {
      color: #9ca3af;
      font-size: 16px;
    }
  }
}

// 主要内容区域
.main-content {
  position: relative;
}

// 核心价值区块
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(200px, -200px);
  }
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 2;
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 24px;
    border: 1px solid rgba(37, 99, 235, 0.15);
    
    .badge-icon {
      font-size: 16px;
    }
  }
  
  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    
    .title-highlight {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: #4b5563;
    line-height: 1.7;
    margin-bottom: 40px;
    max-width: 520px;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 40px;
  
  .metric-item {
    text-align: center;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    
    .metric-value {
      font-size: 2rem;
      font-weight: 800;
      color: #2563eb;
      margin-bottom: 4px;
    }
    
    .metric-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }
  }
}

.cta-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  
  .primary-cta {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    border: none;
    font-weight: 600;
    padding: 14px 28px;
    font-size: 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.25);
    }
  }
  
  .secondary-cta {
    background: white;
    border: 2px solid #e5e7eb;
    color: #374151;
    font-weight: 600;
    padding: 12px 26px;
    font-size: 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
      transform: translateY(-1px);
    }
  }
}

// 右侧图形展示
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-preview {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 100%;
  max-width: 480px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  .preview-header {
    background: #f8fafc;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid #e5e7eb;
    
    .preview-dots {
      display: flex;
      gap: 6px;
      
      span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d1d5db;
        
        &:first-child { background: #ef4444; }
        &:nth-child(2) { background: #f59e0b; }
        &:nth-child(3) { background: #10b981; }
      }
    }
    
    .preview-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
  }
  
  .preview-content {
    padding: 32px 24px;
    
    .preview-stats {
      margin-bottom: 32px;
      
      .stat-bar {
        height: 8px;
        background: #f3f4f6;
        border-radius: 4px;
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: var(--width);
          background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
          border-radius: 4px;
          animation: growBar 2s ease-out;
        }
      }
    }
    
    .preview-chart {
      position: relative;
      height: 60px;
      
      .chart-line {
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%);
        border-radius: 1px;
        position: absolute;
        top: 30px;
        animation: drawLine 3s ease-out;
      }
      
      .chart-dots {
        position: absolute;
        top: 22px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        
        span {
          width: 16px;
          height: 16px;
          background: #2563eb;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          animation: bounceIn 0.8s ease-out;
          animation-delay: var(--delay);
          animation-fill-mode: both;
          transform: scale(0);
        }
      }
    }
  }
}

@keyframes growBar {
  from { width: 0; }
  to { width: var(--width); }
}

@keyframes drawLine {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

// 公告通知区域
.announcements-section {
  padding: 60px 0;
  background: white;
}

// 核心功能模块
.features-section {
  padding: 100px 0;
  background: #f8fafc;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
  
  .header-badge {
    display: inline-block;
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    border: 1px solid rgba(37, 99, 235, 0.15);
  }
  
  .section-title {
    font-size: 2.75rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }
  
  .section-description {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 640px;
    margin: 0 auto;
    line-height: 1.7;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  }
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .feature-icon-wrapper {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .feature-icon {
      color: white;
    }
  }
  
  .feature-badge {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    border: 1px solid rgba(37, 99, 235, 0.15);
  }
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.feature-desc {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .highlight-tag {
    background: #f1f5f9;
    color: #475569;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }
}

// 技术优势
.advantages-section {
  padding: 100px 0;
  background: white;
}

.advantages-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.advantages-text {
  .header-badge {
    display: inline-block;
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    border: 1px solid rgba(37, 99, 235, 0.15);
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 40px;
    letter-spacing: -0.02em;
  }
}

.advantages-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  .advantage-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    
    .advantage-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      .el-icon {
        color: white;
        font-size: 20px;
      }
    }
    
    .advantage-content {
      h4 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 8px;
      }
      
      p {
        color: #6b7280;
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}

.advantages-visual {
  display: flex;
  justify-content: center;
  
  .tech-stack {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 300px;
    
    .stack-item {
      background: white;
      border: 2px solid #f1f5f9;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
      }
      
      .tech-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      .tech-name {
        font-size: 12px;
        font-weight: 600;
        color: #374151;
      }
    }
  }
}

// 专业页脚
.main-footer {
  background: #1f2937;
  color: #d1d5db;
  padding: 60px 0 20px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand {
  .brand {
    margin-bottom: 20px;
    
    .brand-text {
      color: white;
    }
  }
  
  .footer-desc {
    color: #9ca3af;
    line-height: 1.6;
    margin-bottom: 20px;
    max-width: 320px;
  }
  
  .footer-stats {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #6b7280;
  }
}

.footer-links {
  display: contents;
  
  .link-group {
    h4 {
      color: white;
      font-weight: 600;
      margin-bottom: 20px;
      font-size: 16px;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 12px;
        
        a {
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
          
          &:hover {
            color: #2563eb;
          }
        }
      }
    }
  }
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .copyright {
    p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
      
      &:first-child {
        margin-bottom: 4px;
      }
    }
  }
  
  .footer-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #6b7280;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
  
  .advantages-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-links {
    display: none;
  }
  
  .nav-actions {
    gap: 12px;
    
    .announcement-btn {
      width: 36px;
      height: 36px;
    }
  }
  
  .hero-content .hero-title {
    font-size: 2.5rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 0 16px;
  }
  
  .hero-container {
    padding: 0 16px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>