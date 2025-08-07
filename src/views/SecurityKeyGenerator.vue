<template>
  <div class="security-key-generator">
    <!-- 企业级背景装饰 -->
    <div class="background-decoration">
      <div class="security-shape shape-1"></div>
      <div class="security-shape shape-2"></div>
      <div class="security-shape shape-3"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 15" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- 企业级导航条 -->
    <div class="enterprise-header">
      <div class="header-container">
        <div class="logo-section">
          <div class="security-logo">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#ef4444"/>
                  <stop offset="50%" style="stop-color:#dc2626"/>
                  <stop offset="100%" style="stop-color:#b91c1c"/>
                </linearGradient>
              </defs>
              <path d="M24 4L8 10V22C8 32 16 40.5 24 42C32 40.5 40 32 40 22V10L24 4Z" fill="url(#securityGradient)"/>
              <path d="M24 8L12 12V22C12 29.5 18 36 24 38C30 36 36 29.5 36 22V12L24 8Z" fill="rgba(255,255,255,0.2)"/>
              <circle cx="24" cy="24" r="3" fill="white"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1 class="company-name">SecureKey</h1>
            <p class="company-tagline">Admin Security Key Generator</p>
          </div>
        </div>
        
        <div class="header-actions">
          <router-link to="/login" class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            返回登录
          </router-link>
          <div class="security-status">
            <div class="status-indicator active"></div>
            <span>安全密钥系统</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 企业级标题区域 -->
      <div class="security-hero">
        <div class="hero-content">
          <div class="security-badge">
            <div class="badge-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10V11.5H13.8V10C13.8,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <span>High Security</span>
          </div>
          
          <h1 class="hero-title">
            管理员安全密钥
            <span class="gradient-text">生成器</span>
          </h1>
          
          <p class="hero-subtitle">
            为管理员账号生成一次性安全密钥，用于IP变更时的身份验证
            <br>
            每个密钥仅可使用一次，确保系统最高安全性
          </p>
          
          <div class="security-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalKeysGenerated }}</div>
              <div class="stat-label">已生成密钥</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ activeKeysCount }}</div>
              <div class="stat-label">有效密钥</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ usedKeysCount }}</div>
              <div class="stat-label">已使用</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 密钥生成区域 -->
      <div class="key-generator-section">
        <div class="generator-container">
          <div class="generator-header">
            <div class="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,14A3,3 0 0,1 10,17A3,3 0 0,1 7,20A3,3 0 0,1 4,17A3,3 0 0,1 7,14M7,18A1,1 0 0,0 8,17A1,1 0 0,0 7,16A1,1 0 0,0 6,17A1,1 0 0,0 7,18M16,6V10H14V6H16M18,11V7A2,2 0 0,0 16,5H14A2,2 0 0,0 12,7V11A1,1 0 0,0 11,12V16A1,1 0 0,0 12,17H18A1,1 0 0,0 19,16V12A1,1 0 0,0 18,11Z"/>
              </svg>
            </div>
            <div class="header-content">
              <h2>生成安全密钥</h2>
              <p>点击下方按钮生成新的管理员安全密钥</p>
            </div>
          </div>
          
          <div class="generator-controls">
            <div class="key-settings">
              <div class="setting-item">
                <label>密钥有效期：</label>
                <el-select v-model="keyExpiration" class="expiration-select">
                  <el-option label="5分钟" :value="5"></el-option>
                  <el-option label="15分钟" :value="15"></el-option>
                  <el-option label="30分钟" :value="30"></el-option>
                  <el-option label="1小时" :value="60"></el-option>
                  <el-option label="2小时" :value="120"></el-option>
                </el-select>
              </div>
              
              <div class="setting-item">
                <label>密钥强度：</label>
                <el-select v-model="keyStrength" class="strength-select">
                  <el-option label="标准 (32位)" :value="32"></el-option>
                  <el-option label="高强度 (64位)" :value="64"></el-option>
                  <el-option label="超高强度 (128位)" :value="128"></el-option>
                </el-select>
              </div>
            </div>
            
            <button 
              class="generate-button"
              @click="generateSecurityKey"
              :disabled="generating"
            >
              <span v-if="!generating" class="button-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9V17"/>
                </svg>
                生成安全密钥
              </span>
              <span v-else class="button-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="loading-icon">
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                </svg>
                生成中...
              </span>
            </button>
          </div>
          
          <!-- 生成的密钥显示 -->
          <div v-if="currentKey" class="key-display">
            <div class="key-container">
              <div class="key-header">
                <h3>🔐 安全密钥已生成</h3>
                <div class="key-status">
                  <div class="status-dot active"></div>
                  <span>有效期至: {{ formatExpirationTime(currentKey.expirationTime) }}</span>
                </div>
              </div>
              
              <div class="key-content">
                <div class="key-value">
                  <code>{{ currentKey.key }}</code>
                  <button class="copy-button" @click="copyKey" :class="{ 'copied': keyCopied }">
                    <svg v-if="!keyCopied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                    {{ keyCopied ? '已复制' : '复制' }}
                  </button>
                </div>
                
                <div class="key-info">
                  <div class="info-item">
                    <span class="label">密钥ID:</span>
                    <span class="value">{{ currentKey.id }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">生成时间:</span>
                    <span class="value">{{ formatTime(currentKey.createdTime) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">有效期:</span>
                    <span class="value">{{ keyExpiration }} 分钟</span>
                  </div>
                </div>
              </div>
              
              <div class="key-warning">
                <div class="warning-icon">⚠️</div>
                <div class="warning-text">
                  <strong>重要提示：</strong>请立即复制并保存此密钥，页面刷新后将无法再次查看。此密钥仅可使用一次。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 开发者工具：右键检查控制 -->
      <div class="dev-tools-section">
        <div class="tools-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
            </svg>
            开发者工具
          </h2>
          <div class="tools-status">
            <div class="status-indicator" :class="{ 'active': devToolsEnabled }"></div>
            <span>{{ devToolsEnabled ? '工具已启用' : '工具已禁用' }}</span>
          </div>
        </div>
        
        <div class="tools-container">
          <div class="tool-card">
            <div class="tool-header">
              <div class="tool-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12,7A6,6 0 0,0 6,13A6,6 0 0,0 12,19A6,6 0 0,0 18,13A6,6 0 0,0 12,7M12,15.5A2.5,2.5 0 0,1 9.5,13A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 14.5,13A2.5,2.5 0 0,1 12,15.5Z"/>
                </svg>
              </div>
              <div class="tool-content">
                <h3>右键检查工具</h3>
                <p>控制页面的右键菜单和F12开发者工具访问权限</p>
              </div>
            </div>
            
            <div class="tool-controls">
              <div class="control-group">
                <div class="control-item">
                  <label class="control-label">
                    <span class="label-text">禁用右键菜单</span>
                    <span class="label-desc">阻止用户通过右键访问浏览器菜单</span>
                  </label>
                  <div class="toggle-switch" :class="{ 'active': rightClickDisabled }" @click="toggleRightClick">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
                
                <div class="control-item">
                  <label class="control-label">
                    <span class="label-text">禁用F12开发者工具</span>
                    <span class="label-desc">阻止F12、Ctrl+Shift+I等快捷键</span>
                  </label>
                  <div class="toggle-switch" :class="{ 'active': devToolsDisabled }" @click="toggleDevTools">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
                
                <div class="control-item">
                  <label class="control-label">
                    <span class="label-text">禁用文本选择</span>
                    <span class="label-desc">防止用户选中和复制页面文本</span>
                  </label>
                  <div class="toggle-switch" :class="{ 'active': textSelectionDisabled }" @click="toggleTextSelection">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
                
                <div class="control-item">
                  <label class="control-label">
                    <span class="label-text">禁用拖拽保存</span>
                    <span class="label-desc">阻止用户拖拽图片等内容保存</span>
                  </label>
                  <div class="toggle-switch" :class="{ 'active': dragDisabled }" @click="toggleDrag">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
              </div>
              
              <div class="control-actions">
                <button class="action-button primary" @click="applyAllSettings">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                  </svg>
                  应用所有设置
                </button>
                
                <button class="action-button secondary" @click="resetAllSettings">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                  </svg>
                  重置设置
                </button>
                
                <button class="action-button warning" @click="testSettings">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                  </svg>
                  测试效果
                </button>
              </div>
            </div>
            
            <div v-if="testMode" class="test-area">
              <div class="test-header">
                <h4>测试区域</h4>
                <div class="test-status">
                  <span class="test-label">测试状态:</span>
                  <span class="test-value" :class="testStatusClass">{{ testStatusText }}</span>
                </div>
              </div>
              
              <div class="test-content">
                <p>这是一段测试文本，尝试右键点击或选择此文本来验证设置效果。</p>
                <img src="data:image/svg+xml,%3Csvg width='100' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='60' fill='%23e2e8f0'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='12' text-anchor='middle' fill='%23374151'%3E测试图片%3C/text%3E%3C/svg%3E" alt="测试图片" class="test-image">
                <div class="test-results">
                  <div class="result-item">
                    <span class="result-label">右键菜单:</span>
                    <span class="result-status" :class="{ 'disabled': rightClickDisabled }">
                      {{ rightClickDisabled ? '已禁用' : '正常' }}
                    </span>
                  </div>
                  <div class="result-item">
                    <span class="result-label">文本选择:</span>
                    <span class="result-status" :class="{ 'disabled': textSelectionDisabled }">
                      {{ textSelectionDisabled ? '已禁用' : '正常' }}
                    </span>
                  </div>
                  <div class="result-item">
                    <span class="result-label">拖拽保存:</span>
                    <span class="result-status" :class="{ 'disabled': dragDisabled }">
                      {{ dragDisabled ? '已禁用' : '正常' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 安全提示 -->
          <div class="security-notice">
            <div class="notice-icon">🔒</div>
            <div class="notice-content">
              <h4>安全提醒</h4>
              <p>此工具仅用于开发测试目的，过度限制可能影响用户体验。请根据实际需求合理使用这些功能。</p>
              <ul>
                <li>技术熟练的用户仍可通过其他方式访问开发者工具</li>
                <li>这些限制主要针对普通用户的基本操作</li>
                <li>建议在生产环境中谨慎使用</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 密钥历史记录 -->
      <div class="key-history-section">
        <div class="history-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
            </svg>
            密钥历史记录
          </h2>
          <button class="refresh-button" @click="loadKeyHistory">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
            </svg>
            刷新
          </button>
        </div>
        
        <div class="history-list">
          <div v-if="keyHistory.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
              </svg>
            </div>
            <p>暂无密钥历史记录</p>
          </div>
          
          <div v-else class="history-cards">
            <div 
              v-for="key in keyHistory" 
              :key="key.id" 
              class="history-card"
              :class="getKeyStatusClass(key)"
            >
              <div class="card-header">
                <div class="key-id">ID: {{ key.id.substring(0, 8) }}...</div>
                <div class="key-status-badge" :class="getKeyStatusBadgeClass(key)">
                  {{ getKeyStatusText(key) }}
                </div>
              </div>
              
              <div class="card-content">
                <div class="key-preview">
                  <code>{{ key.key.substring(0, 16) }}...</code>
                </div>
                
                <div class="key-details">
                  <div class="detail-row">
                    <span class="label">生成时间:</span>
                    <span class="value">{{ formatTime(key.createdTime) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">有效期至:</span>
                    <span class="value">{{ formatTime(key.expirationTime) }}</span>
                  </div>
                  <div v-if="key.usedTime" class="detail-row">
                    <span class="label">使用时间:</span>
                    <span class="value">{{ formatTime(key.usedTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElSelect, ElOption } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const generating = ref(false)
const currentKey = ref(null)
const keyCopied = ref(false)
const keyExpiration = ref(30) // 默认30分钟
const keyStrength = ref(64) // 默认64位
const keyHistory = ref([])

// 开发者工具相关状态
const devToolsEnabled = ref(false)
const rightClickDisabled = ref(false)
const devToolsDisabled = ref(false)
const textSelectionDisabled = ref(false)
const dragDisabled = ref(false)
const testMode = ref(false)

// 测试状态
const testStatusClass = computed(() => {
  if (rightClickDisabled.value || devToolsDisabled.value || textSelectionDisabled.value || dragDisabled.value) {
    return 'protected'
  }
  return 'normal'
})

const testStatusText = computed(() => {
  if (rightClickDisabled.value || devToolsDisabled.value || textSelectionDisabled.value || dragDisabled.value) {
    return '保护模式'
  }
  return '正常模式'
})

// 统计数据
const totalKeysGenerated = computed(() => keyHistory.value.length)
const activeKeysCount = computed(() => {
  const now = new Date().getTime()
  return keyHistory.value.filter(key => key.isActive && now <= key.expirationTime).length
})
const usedKeysCount = computed(() => keyHistory.value.filter(key => !key.isActive).length)

// 粒子动画样式
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 15 + 10
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

// 生成安全密钥
const generateSecurityKey = async () => {
  generating.value = true
  
  try {
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成密钥
    const keyId = `SK${Date.now().toString().slice(-8)}`
    const key = generateRandomKey(keyStrength.value)
    const createdTime = new Date().getTime()
    const expirationTime = createdTime + (keyExpiration.value * 60 * 1000)
    
    const newKey = {
      id: keyId,
      key: key,
      createdTime: createdTime,
      expirationTime: expirationTime,
      isActive: true,
      usedTime: null,
      usedBy: null
    }
    
    // 保存到localStorage
    const existingKeys = JSON.parse(localStorage.getItem('security_keys') || '[]')
    existingKeys.push(newKey)
    localStorage.setItem('security_keys', JSON.stringify(existingKeys))
    
    currentKey.value = newKey
    keyCopied.value = false
    
    // 更新历史记录
    loadKeyHistory()
    
    ElMessage.success('安全密钥生成成功！')
  } catch (error) {
    ElMessage.error('密钥生成失败，请重试')
  } finally {
    generating.value = false
  }
}

// 生成随机密钥
const generateRandomKey = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 复制密钥
const copyKey = async () => {
  if (currentKey.value) {
    try {
      await navigator.clipboard.writeText(currentKey.value.key)
      keyCopied.value = true
      ElMessage.success('密钥已复制到剪贴板')
      setTimeout(() => {
        keyCopied.value = false
      }, 3000)
    } catch (error) {
      ElMessage.error('复制失败，请手动复制')
    }
  }
}

// 加载密钥历史
const loadKeyHistory = () => {
  const keys = JSON.parse(localStorage.getItem('security_keys') || '[]')
  keyHistory.value = keys.sort((a, b) => b.createdTime - a.createdTime)
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

// 格式化过期时间
const formatExpirationTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = timestamp - now.getTime()
  
  if (diff <= 0) return '已过期'
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟后 (${date.toLocaleString('zh-CN')})`
  } else {
    return `${minutes}分钟后 (${date.toLocaleString('zh-CN')})`
  }
}

// 获取密钥状态类
const getKeyStatusClass = (key) => {
  const now = new Date().getTime()
  if (!key.isActive) return 'used'
  if (now > key.expirationTime) return 'expired'
  return 'active'
}

// 获取密钥状态徽章类
const getKeyStatusBadgeClass = (key) => {
  const now = new Date().getTime()
  if (!key.isActive) return 'used'
  if (now > key.expirationTime) return 'expired'
  return 'active'
}

// 获取密钥状态文本
const getKeyStatusText = (key) => {
  const now = new Date().getTime()
  if (!key.isActive) return '已使用'
  if (now > key.expirationTime) return '已过期'
  return '有效'
}

// 开发者工具控制函数
const toggleRightClick = () => {
  rightClickDisabled.value = !rightClickDisabled.value
  updateDevToolsStatus()
  
  if (rightClickDisabled.value) {
    // 禁用右键菜单
    document.addEventListener('contextmenu', preventRightClick)
  } else {
    // 启用右键菜单
    document.removeEventListener('contextmenu', preventRightClick)
  }
}

const toggleDevTools = () => {
  devToolsDisabled.value = !devToolsDisabled.value
  updateDevToolsStatus()
  
  if (devToolsDisabled.value) {
    // 禁用开发者工具快捷键
    document.addEventListener('keydown', preventDevTools)
  } else {
    // 启用开发者工具快捷键
    document.removeEventListener('keydown', preventDevTools)
  }
}

const toggleTextSelection = () => {
  textSelectionDisabled.value = !textSelectionDisabled.value
  updateDevToolsStatus()
  
  if (textSelectionDisabled.value) {
    // 禁用文本选择
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.mozUserSelect = 'none'
    document.body.style.msUserSelect = 'none'
    
    // 禁用选择事件
    document.addEventListener('selectstart', preventSelection)
    document.addEventListener('dragstart', preventSelection)
  } else {
    // 启用文本选择
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
    document.body.style.mozUserSelect = ''
    document.body.style.msUserSelect = ''
    
    // 启用选择事件
    document.removeEventListener('selectstart', preventSelection)
    document.removeEventListener('dragstart', preventSelection)
  }
}

const toggleDrag = () => {
  dragDisabled.value = !dragDisabled.value
  updateDevToolsStatus()
  
  if (dragDisabled.value) {
    // 禁用拖拽
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('drop', preventDrag)
  } else {
    // 启用拖拽
    document.removeEventListener('dragstart', preventDrag)
    document.removeEventListener('drop', preventDrag)
  }
}

// 更新工具状态
const updateDevToolsStatus = () => {
  devToolsEnabled.value = rightClickDisabled.value || devToolsDisabled.value || 
                          textSelectionDisabled.value || dragDisabled.value
}

// 事件处理函数
const preventRightClick = (e) => {
  e.preventDefault()
  e.stopPropagation()
  ElMessage.warning('右键菜单已被禁用')
  return false
}

const preventDevTools = (e) => {
  // F12
  if (e.keyCode === 123) {
    e.preventDefault()
    e.stopPropagation()
    ElMessage.warning('F12开发者工具已被禁用')
    return false
  }
  
  // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
  if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74)) {
    e.preventDefault()
    e.stopPropagation()
    ElMessage.warning('开发者工具快捷键已被禁用')
    return false
  }
  
  // Ctrl+U (查看源代码)
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault()
    e.stopPropagation()
    ElMessage.warning('查看源代码已被禁用')
    return false
  }
}

const preventSelection = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

const preventDrag = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

// 应用所有设置
const applyAllSettings = () => {
  // 保存设置到localStorage
  const settings = {
    rightClickDisabled: rightClickDisabled.value,
    devToolsDisabled: devToolsDisabled.value,
    textSelectionDisabled: textSelectionDisabled.value,
    dragDisabled: dragDisabled.value
  }
  localStorage.setItem('dev_tools_settings', JSON.stringify(settings))
  
  ElMessage.success('所有设置已应用并保存')
}

// 重置所有设置
const resetAllSettings = () => {
  // 移除所有事件监听器
  document.removeEventListener('contextmenu', preventRightClick)
  document.removeEventListener('keydown', preventDevTools)
  document.removeEventListener('selectstart', preventSelection)
  document.removeEventListener('dragstart', preventSelection)
  document.removeEventListener('dragstart', preventDrag)
  document.removeEventListener('drop', preventDrag)
  
  // 重置样式
  document.body.style.userSelect = ''
  document.body.style.webkitUserSelect = ''
  document.body.style.mozUserSelect = ''
  document.body.style.msUserSelect = ''
  
  // 重置状态
  rightClickDisabled.value = false
  devToolsDisabled.value = false
  textSelectionDisabled.value = false
  dragDisabled.value = false
  testMode.value = false
  
  updateDevToolsStatus()
  
  // 清除本地存储
  localStorage.removeItem('dev_tools_settings')
  
  ElMessage.success('所有设置已重置')
}

// 测试设置
const testSettings = () => {
  testMode.value = !testMode.value
  
  if (testMode.value) {
    ElMessage.info('测试模式已启用，尝试右键点击或选择下方测试区域的内容')
  } else {
    ElMessage.info('测试模式已关闭')
  }
}

// 加载保存的设置
const loadDevToolsSettings = () => {
  try {
    const savedSettings = localStorage.getItem('dev_tools_settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      if (settings.rightClickDisabled) {
        rightClickDisabled.value = true
        document.addEventListener('contextmenu', preventRightClick)
      }
      
      if (settings.devToolsDisabled) {
        devToolsDisabled.value = true
        document.addEventListener('keydown', preventDevTools)
      }
      
      if (settings.textSelectionDisabled) {
        textSelectionDisabled.value = true
        document.body.style.userSelect = 'none'
        document.body.style.webkitUserSelect = 'none'
        document.body.style.mozUserSelect = 'none'
        document.body.style.msUserSelect = 'none'
        document.addEventListener('selectstart', preventSelection)
        document.addEventListener('dragstart', preventSelection)
      }
      
      if (settings.dragDisabled) {
        dragDisabled.value = true
        document.addEventListener('dragstart', preventDrag)
        document.addEventListener('drop', preventDrag)
      }
      
      updateDevToolsStatus()
    }
  } catch (error) {
    console.error('加载开发者工具设置失败:', error)
  }
}

onMounted(() => {
  loadKeyHistory()
  loadDevToolsSettings()
})
</script>

<style lang="scss" scoped>
.security-key-generator {
  min-height: 100vh;
  background: radial-gradient(ellipse at top, rgba(239, 68, 68, 0.05) 0%, transparent 70%),
              linear-gradient(135deg, #fafafc 0%, #f1f5f9 100%);
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
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.06) 100%);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  filter: blur(60px);
  animation: security-morph 25s ease-in-out infinite;
  
  &.shape-1 {
    width: 500px;
    height: 350px;
    top: -150px;
    right: -250px;
    animation-delay: -8s;
  }
  
  &.shape-2 {
    width: 400px;
    height: 300px;
    bottom: -100px;
    left: -200px;
    animation-delay: -15s;
  }
  
  &.shape-3 {
    width: 350px;
    height: 250px;
    top: 50%;
    right: -150px;
    background: linear-gradient(135deg, rgba(185, 28, 28, 0.06) 0%, rgba(153, 27, 27, 0.04) 100%);
    animation-delay: -3s;
  }
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  
  .particle {
    position: absolute;
    background: rgba(239, 68, 68, 0.4);
    border-radius: 50%;
    animation: float-security-particle linear infinite;
    
    &:nth-child(even) {
      background: rgba(220, 38, 38, 0.3);
    }
    
    &:nth-child(3n) {
      background: rgba(185, 28, 28, 0.3);
    }
  }
}

@keyframes security-morph {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: translateX(0) translateY(0) scale(1);
  }
  25% {
    border-radius: 60% 40% 80% 20% / 80% 50% 50% 20%;
    transform: translateX(25px) translateY(-20px) scale(1.1);
  }
  50% {
    border-radius: 40% 60% 25% 75% / 60% 25% 75% 40%;
    transform: translateX(-15px) translateY(15px) scale(0.9);
  }
  75% {
    border-radius: 25% 75% 60% 40% / 70% 70% 30% 30%;
    transform: translateX(20px) translateY(25px) scale(1.05);
  }
}

@keyframes float-security-particle {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(15px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translateY(-10vh) translateX(-15px) scale(1);
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

.security-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.logo-text {
  .company-name {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }
}

.security-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  &.active {
    background: #ef4444;
    animation: pulse-red 2s infinite;
  }
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.main-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

// 企业级标题区域
.security-hero {
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
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      #ef4444 0%, 
      #dc2626 50%, 
      #ef4444 100%);
  }
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 32px;
  }
  
  .security-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    background: linear-gradient(135deg, 
      rgba(239, 68, 68, 0.1) 0%, 
      rgba(220, 38, 38, 0.1) 100%);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 32px;
    
    .badge-icon {
      color: #ef4444;
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
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
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
  
  .security-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
}

// 密钥生成区域
.key-generator-section {
  margin: 80px 0;
}

.generator-container {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.generator-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  
  .header-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
  }
  
  .header-content {
    flex: 1;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
    }
    
    p {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }
  }
}

.generator-controls {
  padding: 32px;
}

.key-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
  }
}

.expiration-select,
.strength-select {
  height: 44px;
}

.generate-button {
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(239, 68, 68, 0.4);
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 密钥显示
.key-display {
  margin-top: 32px;
  padding: 32px;
  border-top: 1px solid rgba(229, 231, 235, 0.6);
}

.key-container {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #bbf7d0;
  border-radius: 16px;
  overflow: hidden;
}

.key-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid #bbf7d0;
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #166534;
    margin: 0;
  }
  
  .key-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #166534;
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &.active {
        background: #22c55e;
        animation: pulse-green 2s infinite;
      }
    }
  }
}

@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.key-content {
  padding: 24px;
}

.key-value {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  margin-bottom: 20px;
  
  code {
    flex: 1;
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
    font-size: 16px;
    font-weight: 600;
    color: #166534;
    letter-spacing: 2px;
    word-break: break-all;
  }
  
  .copy-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #16a34a;
      transform: translateY(-1px);
    }
    
    &.copied {
      background: #10b981;
    }
  }
}

.key-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 8px;
    
    .label {
      font-size: 13px;
      color: #166534;
      font-weight: 500;
    }
    
    .value {
      font-size: 13px;
      color: #374151;
      font-weight: 600;
    }
  }
}

.key-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-top: 1px solid #f59e0b;
  
  .warning-icon {
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .warning-text {
    font-size: 14px;
    color: #92400e;
    line-height: 1.5;
    
    strong {
      color: #78350f;
    }
  }
}

// 开发者工具区域
.dev-tools-section {
  margin: 80px 0;
}

.tools-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  .tools-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: #2563eb;
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9ca3af;
      
      &.active {
        background: #2563eb;
        animation: pulse-blue 2s infinite;
      }
    }
  }
}

@keyframes pulse-blue {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.tools-container {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tool-card {
  padding: 32px;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  
  .tool-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563eb;
  }
  
  .tool-content {
    flex: 1;
    
    h3 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
    }
    
    p {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
  }
}

.tool-controls {
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .control-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    
    .control-label {
      flex: 1;
      
      .label-text {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 4px;
      }
      
      .label-desc {
        display: block;
        font-size: 14px;
        color: #64748b;
        line-height: 1.4;
      }
    }
    
    .toggle-switch {
      position: relative;
      width: 56px;
      height: 28px;
      background: #e5e7eb;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
      
      &:hover {
        background: #d1d5db;
      }
      
      &.active {
        background: #2563eb;
        
        &:hover {
          background: #1d4ed8;
        }
        
        .toggle-slider {
          transform: translateX(28px);
        }
      }
      
      .toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 50%;
        transition: transform 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }
  
  .control-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    
    .action-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.primary {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
        }
      }
      
      &.secondary {
        background: #f8fafc;
        color: #64748b;
        border: 1px solid #e2e8f0;
        
        &:hover {
          background: #f1f5f9;
          color: #374151;
          border-color: #d1d5db;
        }
      }
      
      &.warning {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
        }
      }
    }
  }
}

.test-area {
  margin-top: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #0ea5e9;
  border-radius: 16px;
  
  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h4 {
      font-size: 18px;
      font-weight: 700;
      color: #0c4a6e;
      margin: 0;
    }
    
    .test-status {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .test-label {
        font-size: 13px;
        color: #0369a1;
        font-weight: 500;
      }
      
      .test-value {
        font-size: 13px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
        
        &.protected {
          background: #fecaca;
          color: #dc2626;
        }
        
        &.normal {
          background: #dcfce7;
          color: #16a34a;
        }
      }
    }
  }
  
  .test-content {
    p {
      font-size: 15px;
      color: #164e63;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    
    .test-image {
      display: block;
      margin: 16px 0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .test-results {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 20px;
      
      .result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        font-size: 13px;
        
        .result-label {
          color: #0369a1;
          font-weight: 500;
        }
        
        .result-status {
          font-weight: 600;
          
          &.disabled {
            color: #dc2626;
          }
          
          &:not(.disabled) {
            color: #16a34a;
          }
        }
      }
    }
  }
}

.security-notice {
  margin-top: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 16px;
  display: flex;
  gap: 16px;
  
  .notice-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .notice-content {
    flex: 1;
    
    h4 {
      font-size: 16px;
      font-weight: 700;
      color: #92400e;
      margin: 0 0 12px;
    }
    
    p {
      font-size: 14px;
      color: #92400e;
      margin: 0 0 12px;
      line-height: 1.5;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        font-size: 13px;
        color: #78350f;
        margin-bottom: 6px;
        line-height: 1.4;
      }
    }
  }
}

// 密钥历史记录
.key-history-section {
  margin: 80px 0;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  .refresh-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #ef4444;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
    }
  }
}

.history-list {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 80px 32px;
  
  .empty-icon {
    margin-bottom: 24px;
    color: #9ca3af;
  }
  
  p {
    font-size: 16px;
    color: #64748b;
    margin: 0;
  }
}

.history-cards {
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.history-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    border-color: #22c55e;
    background: linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.6) 100%);
  }
  
  &.expired {
    border-color: #f59e0b;
    background: linear-gradient(135deg, rgba(255, 251, 235, 0.8) 0%, rgba(254, 243, 199, 0.6) 100%);
  }
  
  &.used {
    border-color: #6b7280;
    background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.6) 100%);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  
  .key-id {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .key-status-badge {
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &.active {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    
    &.expired {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    
    &.used {
      background: #f3f4f6;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }
  }
}

.card-content {
  padding: 20px;
}

.key-preview {
  margin-bottom: 16px;
  
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #6b7280;
    background: rgba(0, 0, 0, 0.05);
    padding: 8px 12px;
    border-radius: 6px;
    letter-spacing: 1px;
  }
}

.key-details {
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 13px;
    
    .label {
      color: #6b7280;
      font-weight: 500;
    }
    
    .value {
      color: #374151;
      font-weight: 600;
      font-family: monospace;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .main-content {
    padding: 32px 16px;
  }
  
  .security-hero {
    margin: 24px 0 48px;
    padding: 48px 0;
    
    .hero-content {
      padding: 0 24px;
    }
    
    .hero-title {
      font-size: 32px;
    }
    
    .hero-subtitle {
      font-size: 16px;
    }
  }
  
  .generator-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .key-settings {
    grid-template-columns: 1fr;
  }
  
  .history-cards {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  
  .history-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>