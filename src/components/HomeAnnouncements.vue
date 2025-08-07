<template>
  <div class="home-announcements" v-if="announcements.length > 0">
    <div class="announcements-container">
      <!-- 公告轮播区域 -->
      <div class="announcements-carousel" v-if="announcements.length > 0">
        <el-carousel 
          :interval="8000" 
          :arrow="announcements.length > 1 ? 'hover' : 'never'"
          :indicator-position="announcements.length > 1 ? 'outside' : 'none'"
          height="auto"
          class="announcement-carousel"
        >
          <el-carousel-item 
            v-for="announcement in announcements.slice(0, 3)" 
            :key="announcement.id"
            class="carousel-item"
          >
            <div 
              class="announcement-card"
              :class="`announcement-${announcement.type}`"
            >
              <div class="announcement-icon">
                <el-icon :size="20" :color="getAnnouncementTypeColor(announcement.type)">
                  <component :is="getTypeIcon(announcement.type)" />
                </el-icon>
              </div>
              
              <div class="announcement-main">
                <div class="announcement-header">
                  <div class="announcement-title-row">
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
                    <span class="new-badge" v-if="isNewAnnouncement(announcement)">NEW</span>
                  </div>
                  
                  <h3 class="title-text">{{ announcement.title }}</h3>
                  
                  <div class="announcement-meta">
                    <span class="create-time">
                      <el-icon class="time-icon"><Clock /></el-icon>
                      {{ formatTime(announcement.createTime) }}
                    </span>
                    <span class="author">
                      <el-icon class="author-icon"><User /></el-icon>
                      {{ announcement.author }}
                    </span>
                  </div>
                </div>
                
                <div 
                  class="announcement-content" 
                  :class="{ 'expanded': expandedIds.includes(announcement.id) }"
                >
                  <div class="content-wrapper" v-html="getDisplayContent(announcement)"></div>
                  
                  <div class="content-fade" v-if="isContentTruncated(announcement.content) && !expandedIds.includes(announcement.id)"></div>
                </div>
                
                <div class="announcement-actions" v-if="isContentTruncated(announcement.content)">
                  <el-button 
                    type="primary" 
                    link
                    size="small" 
                    @click="expandAnnouncement(announcement)"
                    class="expand-btn"
                  >
                    <span>{{ expandedIds.includes(announcement.id) ? '收起' : '展开详情' }}</span>
                    <el-icon class="expand-icon" :class="{ 'rotated': expandedIds.includes(announcement.id) }">
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 更多公告入口 -->
      <div class="more-announcements" v-if="hasMoreAnnouncements">
        <el-button 
          type="primary" 
          link 
          @click="showAllAnnouncements = !showAllAnnouncements"
          class="more-btn"
        >
          <el-icon><Document /></el-icon>
          {{ showAllAnnouncements ? '收起更多公告' : `查看更多公告 (${allAnnouncements.length - 3}条)` }}
        </el-button>
      </div>
      
      <!-- 展开的公告列表 -->
      <transition name="slide-down">
        <div class="extended-announcements" v-show="showAllAnnouncements && hasMoreAnnouncements">
          <div class="extended-title">
            <h4>历史公告</h4>
            <span class="divider"></span>
          </div>
          <div class="extended-list">
            <div 
              v-for="announcement in allAnnouncements.slice(3)" 
              :key="`extended-${announcement.id}`"
              class="extended-item"
              :class="`announcement-${announcement.type}`"
            >
              <div class="extended-icon">
                <el-icon :size="16" :color="getAnnouncementTypeColor(announcement.type)">
                  <component :is="getTypeIcon(announcement.type)" />
                </el-icon>
              </div>
              <div class="extended-content">
                <div class="extended-header">
                  <span class="extended-title-text">{{ announcement.title }}</span>
                  <span class="extended-time">{{ formatTime(announcement.createTime) }}</span>
                </div>
                <div class="extended-summary" v-html="getContentSummary(announcement.content)"></div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncementStore } from '@/stores/announcement'
import { 
  Bell, Warning, InfoFilled, SuccessFilled, CircleCloseFilled,
  Clock, User, ArrowDown, Document
} from '@element-plus/icons-vue'

const router = useRouter()

const announcementStore = useAnnouncementStore()

const showAllAnnouncements = ref(false)
const expandedIds = ref([])

const allAnnouncements = ref([])

const announcements = computed(() => {
  if (showAllAnnouncements.value) {
    return allAnnouncements.value
  }
  return allAnnouncements.value.slice(0, 3) // 默认只显示前3条
})

const hasMoreAnnouncements = computed(() => {
  return allAnnouncements.value.length > 3
})

const getTagType = (type) => {
  const typeMap = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return typeMap[type] || 'primary'
}

const getAnnouncementTypeText = (type) => {
  return announcementStore.getAnnouncementTypeText(type)
}

const getAnnouncementTypeColor = (type) => {
  return announcementStore.getAnnouncementTypeColor(type)
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
  return diffInHours <= 24 // 24小时内的公告显示NEW标识
}

const getDisplayContent = (announcement) => {
  if (expandedIds.value.includes(announcement.id)) {
    return announcement.content
  }
  
  // 截取前150个字符
  const textContent = announcement.content.replace(/<[^>]*>/g, '')
  if (textContent.length <= 150) {
    return announcement.content
  }
  
  // 智能截取，保持HTML结构完整性
  let truncated = announcement.content
  if (textContent.length > 150) {
    const truncatedText = textContent.substring(0, 150)
    const lastCompleteWord = truncatedText.lastIndexOf(' ')
    const cutPoint = lastCompleteWord > 100 ? lastCompleteWord : 150
    
    // 简单的HTML标签匹配截取
    let htmlContent = announcement.content
    let textCount = 0
    let result = ''
    let inTag = false
    
    for (let i = 0; i < htmlContent.length; i++) {
      const char = htmlContent[i]
      
      if (char === '<') {
        inTag = true
        result += char
      } else if (char === '>') {
        inTag = false
        result += char
      } else if (!inTag) {
        result += char
        textCount++
        if (textCount >= cutPoint) {
          break
        }
      } else {
        result += char
      }
    }
    
    // 确保HTML标签闭合
    const openTags = result.match(/<(\w+)[^>]*>/g) || []
    const closeTags = result.match(/<\/(\w+)>/g) || []
    
    if (openTags.length > closeTags.length) {
      result += '...'
    }
    
    truncated = result
  }
  
  return truncated
}

const getContentSummary = (content) => {
  const textContent = content.replace(/<[^>]*>/g, '')
  return textContent.length > 80 ? textContent.substring(0, 80) + '...' : textContent
}

const formatTime = (timeStr) => {
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now - time
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return timeStr
  }
}

const isContentTruncated = (content) => {
  // 简单判断内容是否需要截断显示
  const textContent = content.replace(/<[^>]*>/g, '') // 移除HTML标签
  return textContent.length > 200
}

const expandAnnouncement = (announcement) => {
  const index = expandedIds.value.indexOf(announcement.id)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(announcement.id)
  }
}

const goToAnnouncementsPage = () => {
  router.push('/announcements')
}

const fetchHomeAnnouncements = () => {
  let announcements = announcementStore.getHomeAnnouncements()
  
  // 如果没有公告数据，创建一些默认公告用于展示
  if (announcements.length === 0) {
    const defaultAnnouncements = [
      {
        id: Date.now() + 1,
        title: '系统维护通知',
        content: '<p>为提升系统性能和稳定性，我们将在本周末进行系统维护升级。维护期间部分功能可能暂时不可用，请提前做好相关准备。</p><p>维护时间：本周六 02:00-06:00<br/>影响范围：卡密生成、订单查询功能</p>',
        type: 'warning',
        priority: 'high',
        status: 'published',
        showOnHome: true,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
        author: 'admin'
      },
      {
        id: Date.now() + 2,
        title: '新功能上线通知',
        content: '<p>我们很高兴地宣布，新版本的批量卡密管理功能已经上线！新功能包括：</p><ul><li>支持批量导入卡密类型配置</li><li>增强的数据统计分析</li><li>优化的用户界面体验</li></ul><p>欢迎体验新功能，如有问题请及时反馈。</p>',
        type: 'success',
        priority: 'normal',
        status: 'published',
        showOnHome: true,
        createTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        updateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        author: 'admin'
      },
      {
        id: Date.now() + 3,
        title: '欢迎使用卡密管理系统',
        content: '<p>欢迎使用我们的企业级卡密管理系统！本系统提供完整的卡密生命周期管理，包括生成、分发、统计和管理功能。</p><p>如果您是新用户，建议先阅读<strong>用户指南</strong>，或联系我们的技术支持获取帮助。</p>',
        type: 'info',
        priority: 'normal',
        status: 'published',
        showOnHome: true,
        createTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        updateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        author: 'admin'
      }
    ]
    
    // 保存默认公告到localStorage
    const existingAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
    if (existingAnnouncements.length === 0) {
      localStorage.setItem('all_announcements', JSON.stringify(defaultAnnouncements))
    }
    
    announcements = defaultAnnouncements
  }
  
  allAnnouncements.value = announcements
}

onMounted(() => {
  fetchHomeAnnouncements()
})
</script>

<style lang="scss" scoped>
.home-announcements {
  margin-bottom: 32px;
  
  .announcements-container {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%);
      border-radius: 16px 16px 0 0;
    }
  }
  
  .announcements-carousel {
    .announcement-carousel {
      border-radius: 12px;
      overflow: hidden;
      
      :deep(.el-carousel__container) {
        border-radius: 12px;
      }
      
      :deep(.el-carousel__indicators) {
        margin-top: 16px;
        
        .el-carousel__indicator {
          .el-carousel__button {
            width: 24px;
            height: 6px;
            border-radius: 3px;
            background: rgba(37, 99, 235, 0.3);
            
            &.is-active {
              background: #2563eb;
            }
          }
        }
      }
      
      :deep(.el-carousel__arrow) {
        background: rgba(255, 255, 255, 0.9);
        color: #2563eb;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        
        &:hover {
          background: white;
          color: #1d4ed8;
        }
      }
    }
    
    .carousel-item {
      padding: 4px;
      
      .announcement-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.04);
        display: flex;
        gap: 16px;
        min-height: 160px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--announcement-color, #2563eb);
        }
        
        &.announcement-info {
          --announcement-color: #2563eb;
        }
        
        &.announcement-success {
          --announcement-color: #10b981;
        }
        
        &.announcement-warning {
          --announcement-color: #f59e0b;
        }
        
        &.announcement-error {
          --announcement-color: #ef4444;
        }
        
        .announcement-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          
          .el-icon {
            transition: transform 0.3s ease;
          }
          
          &:hover .el-icon {
            transform: scale(1.1);
          }
        }
        
        .announcement-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          
          .announcement-header {
            margin-bottom: 16px;
            
            .announcement-title-row {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              flex-wrap: wrap;
              
              .type-tag {
                flex-shrink: 0;
                font-weight: 500;
                border: none;
              }
              
              .priority-tag {
                flex-shrink: 0;
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
                padding: 2px 8px;
                border-radius: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                animation: glow 2s ease-in-out infinite alternate;
                flex-shrink: 0;
              }
            }
            
            .title-text {
              font-size: 18px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 8px;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            .announcement-meta {
              display: flex;
              align-items: center;
              gap: 16px;
              
              .create-time, .author {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #6b7280;
                font-size: 13px;
                font-weight: 500;
                
                .time-icon, .author-icon {
                  font-size: 14px;
                  opacity: 0.8;
                }
              }
            }
          }
          
          .announcement-content {
            position: relative;
            flex: 1;
            min-height: 0;
            
            .content-wrapper {
              color: #4b5563;
              line-height: 1.6;
              font-size: 14px;
              
              :deep(p) {
                margin-bottom: 8px;
                
                &:last-child {
                  margin-bottom: 0;
                }
              }
              
              :deep(h1), :deep(h2), :deep(h3) {
                margin: 12px 0 8px 0;
                color: #1f2937;
                font-weight: 600;
                
                &:first-child {
                  margin-top: 0;
                }
              }
              
              :deep(ul), :deep(ol) {
                margin: 8px 0 8px 20px;
                
                li {
                  margin-bottom: 4px;
                  color: #4b5563;
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
                font-size: 13px;
                border: 1px solid #e2e8f0;
              }
            }
            
            &:not(.expanded) {
              max-height: 80px;
              overflow: hidden;
              
              .content-fade {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 24px;
                background: linear-gradient(to bottom, transparent, white);
                pointer-events: none;
              }
            }
            
            &.expanded {
              animation: expandContent 0.3s ease-out;
            }
          }
          
          .announcement-actions {
            margin-top: 12px;
            
            .expand-btn {
              font-weight: 500;
              padding: 4px 8px;
              border-radius: 6px;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              transition: all 0.2s ease;
              
              &:hover {
                background: rgba(37, 99, 235, 0.08);
              }
              
              .expand-icon {
                transition: transform 0.3s ease;
                
                &.rotated {
                  transform: rotate(180deg);
                }
              }
            }
          }
        }
      }
    }
  }
  
  .more-announcements {
    margin-top: 20px;
    text-align: center;
    
    .more-btn {
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      background: rgba(37, 99, 235, 0.04);
      border: 1px solid rgba(37, 99, 235, 0.12);
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(37, 99, 235, 0.08);
        border-color: rgba(37, 99, 235, 0.2);
        transform: translateY(-1px);
      }
      
      .el-icon {
        margin-right: 6px;
      }
    }
  }
  
  .extended-announcements {
    margin-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding-top: 24px;
    
    .extended-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      
      h4 {
        margin: 0;
        color: #374151;
        font-size: 16px;
        font-weight: 600;
      }
      
      .divider {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, rgba(37, 99, 235, 0.2) 0%, transparent 100%);
      }
    }
    
    .extended-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .extended-item {
        background: white;
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        border: 1px solid rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease;
        
        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transform: translateX(4px);
        }
        
        .extended-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(37, 99, 235, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }
        
        .extended-content {
          flex: 1;
          min-width: 0;
          
          .extended-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 4px;
            
            .extended-title-text {
              font-weight: 600;
              color: #1f2937;
              font-size: 14px;
              line-height: 1.4;
              flex: 1;
            }
            
            .extended-time {
              color: #6b7280;
              font-size: 12px;
              white-space: nowrap;
              flex-shrink: 0;
            }
          }
          
          .extended-summary {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
          }
        }
      }
    }
  }
}

// 动画效果
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
  }
  100% {
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
  }
}

@keyframes expandContent {
  from {
    opacity: 0.8;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

// 响应式设计
@media (max-width: 768px) {
  .home-announcements {
    .announcements-container {
      padding: 16px;
      border-radius: 12px;
    }
    
    .announcement-card {
      flex-direction: column;
      gap: 12px;
      min-height: auto !important;
      
      .announcement-icon {
        align-self: flex-start;
        width: 40px !important;
        height: 40px !important;
      }
      
      .announcement-main {
        .announcement-header {
          .title-text {
            font-size: 16px;
          }
          
          .announcement-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
        
        .announcement-content {
          .content-wrapper {
            font-size: 13px;
          }
        }
      }
    }
    
    .extended-item {
      flex-direction: column;
      gap: 8px;
      
      .extended-icon {
        align-self: flex-start;
      }
      
      .extended-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  }
}
</style>