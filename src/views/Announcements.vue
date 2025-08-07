<template>
  <div class="announcements-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-background">
        <div class="background-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      
      <div class="header-content">
        <div class="header-main">
          <div class="header-icon">
            <el-icon :size="48"><Bell /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">系统公告</h1>
            <p class="page-subtitle">掌握最新动态，了解系统状态</p>
          </div>
        </div>
        
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-value">{{ totalAnnouncements }}</div>
            <div class="stat-label">总公告数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ newAnnouncementsCount }}</div>
            <div class="stat-label">本周新增</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ importantCount }}</div>
            <div class="stat-label">重要公告</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 公告内容区域 -->
    <div class="announcements-content">
      <div class="content-container">
        <!-- 筛选和搜索栏 -->
        <div class="filter-section">
          <div class="filter-left">
            <el-input
              v-model="searchQuery"
              placeholder="搜索公告标题或内容..."
              :prefix-icon="Search"
              clearable
              class="search-input"
              @input="handleSearch"
            />
          </div>
          
          <div class="filter-right">
            <el-select
              v-model="selectedType"
              placeholder="公告类型"
              clearable
              class="type-filter"
              @change="handleTypeFilter"
            >
              <el-option label="全部类型" value="" />
              <el-option label="通知" value="info" />
              <el-option label="成功" value="success" />
              <el-option label="警告" value="warning" />
              <el-option label="错误" value="error" />
            </el-select>
            
            <el-select
              v-model="selectedPriority"
              placeholder="优先级"
              clearable
              class="priority-filter"
              @change="handlePriorityFilter"
            >
              <el-option label="全部优先级" value="" />
              <el-option label="高优先级" value="high" />
              <el-option label="普通" value="normal" />
              <el-option label="低优先级" value="low" />
            </el-select>
            
            <el-button
              type="primary"
              :icon="Refresh"
              @click="refreshAnnouncements"
              class="refresh-btn"
            >
              刷新
            </el-button>
          </div>
        </div>

        <!-- 公告列表 -->
        <div class="announcements-list" v-loading="loading">
          <transition-group name="list" tag="div" class="announcement-grid">
            <div
              v-for="announcement in paginatedAnnouncements"
              :key="announcement.id"
              class="announcement-card"
              :class="[
                `announcement-${announcement.type}`,
                { 'is-important': announcement.priority === 'high' },
                { 'is-new': isNewAnnouncement(announcement) }
              ]"
            >
              <!-- 卡片顶部装饰 -->
              <div class="card-decoration">
                <div class="decoration-line"></div>
                <div class="decoration-dot"></div>
              </div>
              
              <!-- 卡片内容 -->
              <div class="card-header">
                <div class="header-left">
                  <div class="announcement-icon">
                    <el-icon :size="24" :color="getAnnouncementTypeColor(announcement.type)">
                      <component :is="getTypeIcon(announcement.type)" />
                    </el-icon>
                  </div>
                  
                  <div class="header-info">
                    <div class="title-row">
                      <h3 class="announcement-title">{{ announcement.title }}</h3>
                      <div class="badges">
                        <el-tag
                          :type="getTagType(announcement.type)"
                          size="small"
                          class="type-tag"
                          effect="light"
                        >
                          {{ getAnnouncementTypeText(announcement.type) }}
                        </el-tag>
                        
                        <el-tag
                          v-if="announcement.priority === 'high'"
                          type="danger"
                          size="small"
                          class="priority-tag"
                          effect="dark"
                        >
                          <el-icon class="priority-icon"><Warning /></el-icon>
                          重要
                        </el-tag>
                        
                        <span class="new-badge" v-if="isNewAnnouncement(announcement)">
                          NEW
                        </span>
                      </div>
                    </div>
                    
                    <div class="meta-info">
                      <span class="publish-time">
                        <el-icon><Clock /></el-icon>
                        {{ formatTime(announcement.createTime) }}
                      </span>
                      <span class="author">
                        <el-icon><User /></el-icon>
                        {{ announcement.author }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="header-actions">
                  <el-button
                    type="primary"
                    link
                    @click="viewAnnouncement(announcement)"
                    class="view-btn"
                  >
                    查看详情
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
              
              <div class="card-content">
                <div class="content-preview" v-html="getContentPreview(announcement.content)"></div>
                
                <div class="content-actions">
                  <el-button
                    type="text"
                    size="small"
                    @click="toggleExpand(announcement.id)"
                    class="expand-toggle"
                  >
                    <span>{{ expandedIds.includes(announcement.id) ? '收起' : '展开' }}</span>
                    <el-icon class="expand-icon" :class="{ 'rotated': expandedIds.includes(announcement.id) }">
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                </div>
                
                <transition name="expand">
                  <div v-show="expandedIds.includes(announcement.id)" class="full-content">
                    <div class="content-divider"></div>
                    <div class="full-text" v-html="announcement.content"></div>
                  </div>
                </transition>
              </div>
              
              <!-- 卡片底部 -->
              <div class="card-footer">
                <div class="footer-left">
                  <span class="read-count">
                    <el-icon><View /></el-icon>
                    {{ announcement.readCount || 0 }} 次查看
                  </span>
                </div>
                <div class="footer-right">
                  <el-button
                    type="text"
                    size="small"
                    @click="shareAnnouncement(announcement)"
                    class="share-btn"
                  >
                    <el-icon><Share /></el-icon>
                    分享
                  </el-button>
                </div>
              </div>
            </div>
          </transition-group>
          
          <!-- 空状态 -->
          <div v-if="filteredAnnouncements.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">
              <el-icon :size="80"><Document /></el-icon>
            </div>
            <h3 class="empty-title">暂无公告</h3>
            <p class="empty-description">当前没有符合条件的公告信息</p>
            <el-button type="primary" @click="refreshAnnouncements">
              <el-icon><Refresh /></el-icon>
              刷新页面
            </el-button>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section" v-if="filteredAnnouncements.length > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[6, 12, 24, 48]"
            :total="filteredAnnouncements.length"
            layout="total, sizes, prev, pager, next, jumper"
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 公告详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="currentAnnouncement?.title"
      width="80%"
      class="announcement-dialog"
      :close-on-click-modal="false"
    >
      <div v-if="currentAnnouncement" class="announcement-detail">
        <div class="detail-header">
          <div class="detail-meta">
            <el-tag
              :type="getTagType(currentAnnouncement.type)"
              class="detail-type-tag"
            >
              {{ getAnnouncementTypeText(currentAnnouncement.type) }}
            </el-tag>
            
            <el-tag
              v-if="currentAnnouncement.priority === 'high'"
              type="danger"
              class="detail-priority-tag"
            >
              <el-icon><Warning /></el-icon>
              重要公告
            </el-tag>
            
            <span class="detail-new-badge" v-if="isNewAnnouncement(currentAnnouncement)">
              NEW
            </span>
          </div>
          
          <div class="detail-info">
            <div class="info-item">
              <el-icon><Clock /></el-icon>
              <span>发布时间：{{ formatDetailTime(currentAnnouncement.createTime) }}</span>
            </div>
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>发布者：{{ currentAnnouncement.author }}</span>
            </div>
            <div class="info-item">
              <el-icon><View /></el-icon>
              <span>查看次数：{{ currentAnnouncement.readCount || 0 }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="content-body" v-html="currentAnnouncement.content"></div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button type="primary" @click="shareAnnouncement(currentAnnouncement)">
            <el-icon><Share /></el-icon>
            分享公告
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncementStore } from '@/stores/announcement'
import { ElMessage } from 'element-plus'
import {
  Bell, Search, Refresh, Warning, InfoFilled, SuccessFilled, 
  CircleCloseFilled, Clock, User, ArrowRight, ArrowDown, 
  View, Share, Document
} from '@element-plus/icons-vue'

const router = useRouter()
const announcementStore = useAnnouncementStore()

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedPriority = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const expandedIds = ref([])
const showDetailDialog = ref(false)
const currentAnnouncement = ref(null)
const allAnnouncements = ref([])

// 计算属性
const totalAnnouncements = computed(() => allAnnouncements.value.length)

const newAnnouncementsCount = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return allAnnouncements.value.filter(announcement => {
    const createTime = new Date(announcement.createTime)
    return createTime >= oneWeekAgo
  }).length
})

const importantCount = computed(() => {
  return allAnnouncements.value.filter(a => a.priority === 'high').length
})

const filteredAnnouncements = computed(() => {
  let filtered = allAnnouncements.value

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    filtered = filtered.filter(announcement =>
      announcement.title.toLowerCase().includes(query) ||
      announcement.content.toLowerCase().includes(query)
    )
  }

  // 类型筛选
  if (selectedType.value) {
    filtered = filtered.filter(announcement => announcement.type === selectedType.value)
  }

  // 优先级筛选
  if (selectedPriority.value) {
    filtered = filtered.filter(announcement => announcement.priority === selectedPriority.value)
  }

  return filtered.sort((a, b) => {
    // 先按优先级排序
    const priorityOrder = { high: 3, normal: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    // 再按时间排序
    return new Date(b.createTime) - new Date(a.createTime)
  })
})

const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAnnouncements.value.slice(start, end)
})

// 工具函数
const getAnnouncementTypeColor = (type) => {
  return announcementStore.getAnnouncementTypeColor(type)
}

const getAnnouncementTypeText = (type) => {
  return announcementStore.getAnnouncementTypeText(type)
}

const getTagType = (type) => {
  const typeMap = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return typeMap[type] || 'primary'
}

const getTypeIcon = (type) => {
  const iconMap = {
    info: markRaw(InfoFilled),
    success: markRaw(SuccessFilled),
    warning: markRaw(Warning),
    error: markRaw(CircleCloseFilled)
  }
  return iconMap[type] || markRaw(InfoFilled)
}

const isNewAnnouncement = (announcement) => {
  const now = new Date()
  const createTime = new Date(announcement.createTime)
  const diffInHours = (now - createTime) / (1000 * 60 * 60)
  return diffInHours <= 72 // 72小时内显示NEW
}

const formatTime = (timeStr) => {
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now - time
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return minutes <= 0 ? '刚刚发布' : `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return time.toLocaleDateString('zh-CN')
  }
}

const formatDetailTime = (timeStr) => {
  const time = new Date(timeStr)
  return time.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long'
  })
}

const getContentPreview = (content) => {
  const textContent = content.replace(/<[^>]*>/g, '')
  return textContent.length > 200 ? textContent.substring(0, 200) + '...' : textContent
}

// 事件处理
const handleSearch = () => {
  currentPage.value = 1
}

const handleTypeFilter = () => {
  currentPage.value = 1
}

const handlePriorityFilter = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const toggleExpand = (id) => {
  const index = expandedIds.value.indexOf(id)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(id)
  }
}

const viewAnnouncement = (announcement) => {
  currentAnnouncement.value = announcement
  showDetailDialog.value = true
  
  // 增加查看次数
  announcement.readCount = (announcement.readCount || 0) + 1
}

const shareAnnouncement = (announcement) => {
  const shareUrl = `${window.location.origin}/announcements?id=${announcement.id}`
  const shareText = `【系统公告】${announcement.title}`
  
  if (navigator.share) {
    navigator.share({
      title: shareText,
      url: shareUrl
    }).catch(() => {
      // 降级到复制链接
      navigator.clipboard.writeText(shareUrl)
      ElMessage.success('公告链接已复制到剪贴板')
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl).then(() => {
      ElMessage.success('公告链接已复制到剪贴板')
    }).catch(() => {
      ElMessage.error('复制失败，请手动复制链接')
    })
  }
}

const refreshAnnouncements = async () => {
  loading.value = true
  
  try {
    await loadAnnouncements()
    ElMessage.success('公告列表已更新')
  } catch (error) {
    ElMessage.error('刷新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const loadAnnouncements = async () => {
  // 从store获取公告数据
  let announcements = announcementStore.getHomeAnnouncements()
  
  // 如果没有数据，创建示例数据
  if (announcements.length === 0) {
    const sampleAnnouncements = [
      {
        id: Date.now() + 1,
        title: '系统维护升级通知',
        content: `<h3>尊敬的用户：</h3>
        <p>为了提供更好的服务体验，我们将于本周末进行系统维护升级。</p>
        <h4>维护详情：</h4>
        <ul>
          <li><strong>维护时间：</strong>2024年8月10日 02:00 - 06:00</li>
          <li><strong>影响范围：</strong>卡密生成、订单查询、用户登录</li>
          <li><strong>预计时长：</strong>4小时</li>
        </ul>
        <h4>升级内容：</h4>
        <ul>
          <li>优化系统性能，提升响应速度</li>
          <li>增强数据安全防护机制</li>
          <li>修复已知问题和漏洞</li>
          <li>新增批量操作功能</li>
        </ul>
        <p><strong>温馨提示：</strong>维护期间系统将暂停服务，请您提前做好相关准备。给您带来的不便，敬请谅解！</p>
        <p>如有紧急问题，请联系技术支持：<code>support@cardkey.com</code></p>`,
        type: 'warning',
        priority: 'high',
        status: 'published',
        showOnHome: true,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
        author: '系统管理员',
        readCount: 156
      },
      {
        id: Date.now() + 2,
        title: '新功能发布：批量卡密管理',
        content: `<h3>功能亮点</h3>
        <p>我们很高兴地宣布，全新的批量卡密管理功能现已上线！这项功能将大幅提升您的工作效率。</p>
        <h4>新增功能：</h4>
        <ol>
          <li><strong>批量生成：</strong>支持一次性生成大量卡密</li>
          <li><strong>模板导入：</strong>支持Excel模板批量导入卡密信息</li>
          <li><strong>智能分类：</strong>自动按类型和区域分类管理</li>
          <li><strong>批量操作：</strong>支持批量激活、禁用、删除等操作</li>
          <li><strong>导出功能：</strong>支持多种格式导出卡密数据</li>
        </ol>
        <h4>使用指南：</h4>
        <p>登录系统后，在"卡密管理"页面即可体验新功能。详细操作指南请查看<a href="#">用户手册</a>。</p>
        <p>感谢您的支持，我们将持续优化产品体验！</p>`,
        type: 'success',
        priority: 'normal',
        status: 'published',
        showOnHome: true,
        createTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        updateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        author: '产品团队',
        readCount: 89
      },
      {
        id: Date.now() + 3,
        title: '安全提醒：加强账户保护',
        content: `<h3>重要安全提醒</h3>
        <p>近期我们检测到一些异常登录尝试，为了保障您的账户安全，请注意以下事项：</p>
        <h4>安全建议：</h4>
        <ul>
          <li>定期更换登录密码，建议使用强密码</li>
          <li>启用双因素认证（2FA）</li>
          <li>不要在公共网络环境下登录账户</li>
          <li>及时退出登录，特别是在共享设备上</li>
          <li>定期检查登录日志，发现异常及时联系客服</li>
        </ul>
        <h4>如何启用双因素认证：</h4>
        <ol>
          <li>进入"个人设置" → "安全设置"</li>
          <li>点击"启用双因素认证"</li>
          <li>使用手机扫描二维码绑定</li>
          <li>输入验证码完成绑定</li>
        </ol>
        <p><strong>重要：</strong>如发现账户异常，请立即联系客服：400-123-4567</p>`,
        type: 'error',
        priority: 'high',
        status: 'published',
        showOnHome: true,
        createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        updateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        author: '安全团队',
        readCount: 234
      },
      {
        id: Date.now() + 4,
        title: '用户服务协议更新',
        content: `<p>根据相关法律法规要求，我们对《用户服务协议》进行了更新。</p>
        <h4>主要更新内容：</h4>
        <ul>
          <li>完善了用户隐私保护条款</li>
          <li>明确了数据处理和存储规范</li>
          <li>优化了服务条款表述</li>
          <li>增加了争议解决机制</li>
        </ul>
        <p>新版协议将于2024年8月15日生效，请您仔细阅读。继续使用我们的服务即表示您同意新版协议。</p>
        <p><a href="#">查看完整协议内容</a></p>`,
        type: 'info',
        priority: 'normal',
        status: 'published',
        showOnHome: true,
        createTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        updateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        author: '法务部',
        readCount: 45
      },
      {
        id: Date.now() + 5,
        title: '系统性能优化完成',
        content: `<p>经过持续的性能优化工作，系统运行效率得到显著提升：</p>
        <ul>
          <li>页面加载速度提升60%</li>
          <li>数据库查询优化，响应时间缩短50%</li>
          <li>服务器稳定性增强</li>
          <li>并发处理能力提升300%</li>
        </ul>
        <p>感谢您的耐心等待，现在可以享受更快速流畅的使用体验！</p>`,
        type: 'success',
        priority: 'low',
        status: 'published',
        showOnHome: true,
        createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        updateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        author: '技术团队',
        readCount: 67
      }
    ]
    
    // 保存到localStorage
    const existingAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
    if (existingAnnouncements.length === 0) {
      localStorage.setItem('all_announcements', JSON.stringify(sampleAnnouncements))
    }
    
    announcements = sampleAnnouncements
  }
  
  allAnnouncements.value = announcements
}

// 监听路由参数
watch(() => router.currentRoute.value.query.id, (id) => {
  if (id) {
    const announcement = allAnnouncements.value.find(a => a.id.toString() === id)
    if (announcement) {
      viewAnnouncement(announcement)
    }
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  loadAnnouncements()
})
</script>

<style lang="scss" scoped>
.announcements-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

// 页面头部样式
.page-header {
  position: relative;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
  color: white;
  overflow: hidden;
  
  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    
    .background-shapes {
      position: relative;
      width: 100%;
      height: 100%;
      
      .shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        
        &.shape-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -150px;
          animation: float 20s infinite linear;
        }
        
        &.shape-2 {
          width: 200px;
          height: 200px;
          bottom: -100px;
          left: -100px;
          animation: float 25s infinite linear reverse;
        }
        
        &.shape-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 15s infinite;
        }
      }
    }
  }
  
  .header-content {
    position: relative;
    z-index: 2;
    max-width: 1400px;
    margin: 0 auto;
    padding: 60px 24px 40px;
    
    .header-main {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 40px;
      
      .header-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .header-text {
        .page-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .page-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }
      }
    }
    
    .header-stats {
      display: flex;
      align-items: center;
      gap: 32px;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
      
      .stat-divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// 内容区域样式
.announcements-content {
  padding: 40px 0 80px;
  
  .content-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
  }
}

// 筛选栏样式
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  
  .filter-left {
    flex: 1;
    
    .search-input {
      max-width: 400px;
      
      :deep(.el-input__wrapper) {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
    }
  }
  
  .filter-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .type-filter,
    .priority-filter {
      width: 140px;
      
      :deep(.el-select__wrapper) {
        border-radius: 8px;
      }
    }
    
    .refresh-btn {
      border-radius: 8px;
      font-weight: 600;
    }
  }
}

// 公告网格样式
.announcement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

// 公告卡片样式
.announcement-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  }
  
  &.is-important {
    border-left: 4px solid #ef4444;
    
    .card-decoration .decoration-line {
      background: #ef4444;
    }
  }
  
  &.is-new {
    &::before {
      content: '';
      position: absolute;
      top: 16px;
      right: 16px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }
  
  .card-decoration {
    height: 6px;
    background: linear-gradient(90deg, var(--el-color-primary) 0%, transparent 100%);
    position: relative;
    
    .decoration-line {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 60px;
      background: var(--el-color-primary);
      border-radius: 0 3px 3px 0;
    }
    
    .decoration-dot {
      position: absolute;
      top: 50%;
      left: 50px;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: var(--el-color-primary);
      border-radius: 50%;
      opacity: 0.6;
    }
  }
  
  .card-header {
    padding: 24px 24px 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .header-left {
      flex: 1;
      display: flex;
      gap: 16px;
      
      .announcement-icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: var(--el-color-primary-light-9);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 4px;
      }
      
      .header-info {
        flex: 1;
        min-width: 0;
        
        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          
          .announcement-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
            line-height: 1.4;
            flex: 1;
            min-width: 0;
          }
          
          .badges {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
            
            .type-tag {
              font-weight: 500;
            }
            
            .priority-tag {
              animation: pulse 2s infinite;
              font-weight: 600;
              
              .priority-icon {
                margin-right: 4px;
              }
            }
            
            .new-badge {
              background: linear-gradient(45deg, #ef4444, #f97316);
              color: white;
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
          }
        }
        
        .meta-info {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .publish-time,
          .author {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #6b7280;
            font-size: 0.875rem;
            
            .el-icon {
              font-size: 14px;
              opacity: 0.8;
            }
          }
        }
      }
    }
    
    .header-actions {
      .view-btn {
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 6px;
        
        .el-icon {
          margin-left: 4px;
        }
      }
    }
  }
  
  .card-content {
    padding: 0 24px 16px;
    
    .content-preview {
      color: #4b5563;
      line-height: 1.6;
      font-size: 0.875rem;
      margin-bottom: 12px;
    }
    
    .content-actions {
      .expand-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
        
        .expand-icon {
          transition: transform 0.3s ease;
          
          &.rotated {
            transform: rotate(180deg);
          }
        }
      }
    }
    
    .full-content {
      .content-divider {
        height: 1px;
        background: linear-gradient(90deg, var(--el-color-primary) 0%, transparent 100%);
        margin: 16px 0;
      }
      
      .full-text {
        color: #374151;
        line-height: 1.6;
        font-size: 0.875rem;
        
        :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
          color: #1f2937;
          margin: 16px 0 8px 0;
          font-weight: 600;
        }
        
        :deep(ul), :deep(ol) {
          margin: 12px 0 12px 20px;
          
          li {
            margin-bottom: 6px;
          }
        }
        
        :deep(p) {
          margin-bottom: 12px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
        
        :deep(strong) {
          color: #1f2937;
          font-weight: 600;
        }
        
        :deep(code) {
          background: #f1f5f9;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.8125rem;
        }
        
        :deep(a) {
          color: var(--el-color-primary);
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  .card-footer {
    padding: 16px 24px;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .footer-left {
      .read-count {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #6b7280;
        font-size: 0.875rem;
        
        .el-icon {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
    
    .footer-right {
      .share-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #6b7280;
        font-size: 0.875rem;
        
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
}

// 空状态样式
.empty-state {
  text-align: center;
  padding: 80px 20px;
  
  .empty-icon {
    color: #d1d5db;
    margin-bottom: 24px;
  }
  
  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  .empty-description {
    color: #6b7280;
    margin-bottom: 24px;
  }
}

// 分页样式
.pagination-section {
  display: flex;
  justify-content: center;
  padding-top: 40px;
  
  .pagination {
    :deep(.el-pagination__total) {
      color: #6b7280;
    }
  }
}

// 详情对话框样式
.announcement-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e5e7eb;
    
    .el-dialog__title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }
  }
  
  .announcement-detail {
    .detail-header {
      margin-bottom: 32px;
      
      .detail-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        
        .detail-type-tag {
          font-weight: 600;
        }
        
        .detail-priority-tag {
          font-weight: 600;
        }
        
        .detail-new-badge {
          background: linear-gradient(45deg, #ef4444, #f97316);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
      }
      
      .detail-info {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 0.875rem;
          
          .el-icon {
            font-size: 16px;
            opacity: 0.8;
          }
        }
      }
    }
    
    .detail-content {
      .content-body {
        color: #374151;
        line-height: 1.7;
        font-size: 1rem;
        
        :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
          color: #1f2937;
          margin: 24px 0 12px 0;
          font-weight: 600;
          
          &:first-child {
            margin-top: 0;
          }
        }
        
        :deep(p) {
          margin-bottom: 16px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
        
        :deep(ul), :deep(ol) {
          margin: 16px 0 16px 24px;
          
          li {
            margin-bottom: 8px;
          }
        }
        
        :deep(strong) {
          color: #1f2937;
          font-weight: 600;
        }
        
        :deep(code) {
          background: #f1f5f9;
          color: #1e40af;
          padding: 3px 8px;
          border-radius: 6px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.875rem;
          border: 1px solid #e2e8f0;
        }
        
        :deep(a) {
          color: var(--el-color-primary);
          text-decoration: none;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .el-button {
      border-radius: 8px;
      font-weight: 600;
    }
  }
}

// 动画效果
@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

// 响应式设计
@media (max-width: 1200px) {
  .announcement-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      padding: 40px 16px 30px;
      
      .header-main {
        flex-direction: column;
        text-align: center;
        margin-bottom: 30px;
        
        .header-icon {
          width: 60px;
          height: 60px;
        }
        
        .page-title {
          font-size: 2rem;
        }
        
        .page-subtitle {
          font-size: 1rem;
        }
      }
      
      .header-stats {
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        
        .stat-divider {
          display: none;
        }
      }
    }
  }
  
  .announcements-content {
    padding: 20px 0 60px;
    
    .content-container {
      padding: 0 16px;
    }
  }
  
  .filter-section {
    flex-direction: column;
    gap: 16px;
    
    .filter-left {
      width: 100%;
      
      .search-input {
        max-width: none;
        width: 100%;
      }
    }
    
    .filter-right {
      width: 100%;
      justify-content: flex-end;
      flex-wrap: wrap;
      
      .type-filter,
      .priority-filter {
        width: 120px;
      }
    }
  }
  
  .announcement-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .announcement-card {
    .card-header {
      padding: 20px 20px 12px;
      
      .header-left {
        .header-info {
          .title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            
            .badges {
              align-self: flex-start;
            }
          }
          
          .meta-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      }
      
      .header-actions {
        .view-btn {
          font-size: 0.875rem;
          padding: 4px 8px;
        }
      }
    }
    
    .card-content {
      padding: 0 20px 12px;
    }
    
    .card-footer {
      padding: 12px 20px;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
  }
}
</style>