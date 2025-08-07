<template>
  <div class="security-dashboard">
    <!-- 安全概览 -->
    <el-row :gutter="20" class="security-stats">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#67C23A"><Tools /></el-icon>
            <div class="stats-content">
              <h3>{{ securityStats.totalLogins }}</h3>
              <p>总登录次数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#F56C6C"><Warning /></el-icon>
            <div class="stats-content">
              <h3>{{ securityStats.failedLogins }}</h3>
              <p>登录失败次数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#E6A23C"><Lock /></el-icon>
            <div class="stats-content">
              <h3>{{ securityStats.blockedAttempts }}</h3>
              <p>被阻止的尝试</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#409EFF"><Monitor /></el-icon>
            <div class="stats-content">
              <h3>{{ securityStats.totalEvents }}</h3>
              <p>安全事件总数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 安全事件日志 -->
    <el-card class="events-card">
      <template #header>
        <div class="card-header">
          <span>安全事件日志</span>
          <div class="header-actions">
            <el-button size="small" @click="refreshLogs">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button size="small" type="warning" @click="clearLogs">
              <el-icon><Delete /></el-icon>
              清空日志
            </el-button>
            <el-button size="small" type="success" @click="exportLogs">
              <el-icon><Download /></el-icon>
              导出日志
            </el-button>
          </div>
        </div>
      </template>

      <!-- 筛选条件 -->
      <div class="filter-bar">
        <el-form :model="filterForm" inline>
          <el-form-item label="事件类型">
            <el-select v-model="filterForm.action" placeholder="所有事件" clearable>
              <el-option label="登录成功" value="login_success" />
              <el-option label="登录失败" value="login_failed" />
              <el-option label="登录被阻止" value="login_blocked" />
              <el-option label="管理员登录成功" value="admin_login_success" />
              <el-option label="管理员登录失败" value="admin_login_failed" />
              <el-option label="注册成功" value="register_success" />
              <el-option label="注册失败" value="register_failed" />
              <el-option label="登出" value="logout" />
              <el-option label="数据读取" value="storage_read" />
              <el-option label="数据写入" value="storage_write" />
              <el-option label="数据删除" value="storage_delete" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="用户名">
            <el-input 
              v-model="filterForm.username" 
              placeholder="输入用户名"
              clearable
            />
          </el-form-item>
          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="applyFilter">
              <el-icon><Search /></el-icon>
              筛选
            </el-button>
            <el-button @click="resetFilter">
              <el-icon><RefreshLeft /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 事件列表 -->
      <el-table :data="filteredLogs" style="width: 100%" v-loading="loading">
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="scope">
            {{ formatTimestamp(scope.row.timestamp) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="action" label="事件类型" width="150">
          <template #default="scope">
            <el-tag :type="getEventType(scope.row.action)">
              {{ getEventName(scope.row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="username" label="用户" width="120">
          <template #default="scope">
            {{ scope.row.details?.username || scope.row.username || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="details" label="详情" min-width="200">
          <template #default="scope">
            <div class="event-details">
              <div v-if="scope.row.details?.reason">
                原因: {{ getReasonText(scope.row.details.reason) }}
              </div>
              <div v-if="scope.row.details?.errors">
                错误: {{ scope.row.details.errors.join(', ') }}
              </div>
              <div v-if="scope.row.details?.blockTimeMinutes">
                阻止时间: {{ scope.row.details.blockTimeMinutes }} 分钟
              </div>
              <div v-if="scope.row.details?.key">
                存储键: {{ scope.row.details.key }}
              </div>
              <div v-if="scope.row.details?.securityMode">
                安全模式: {{ getSecurityModeText(scope.row.details.securityMode) }}
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="userAgent" label="用户代理" width="200" show-overflow-tooltip />
        
        <el-table-column prop="url" label="页面" width="150" show-overflow-tooltip />
        
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button 
              type="info" 
              size="small"
              @click="viewEventDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[20, 50, 100, 200]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 事件详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="事件详情" width="600px">
      <div v-if="currentEvent" class="event-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="事件ID">
            {{ currentEvent.id }}
          </el-descriptions-item>
          
          <el-descriptions-item label="时间">
            {{ formatTimestamp(currentEvent.timestamp) }}
          </el-descriptions-item>
          
          <el-descriptions-item label="事件类型">
            <el-tag :type="getEventType(currentEvent.action)">
              {{ getEventName(currentEvent.action) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="用户ID">
            {{ currentEvent.userId || '-' }}
          </el-descriptions-item>
          
          <el-descriptions-item label="用户名">
            {{ currentEvent.username || '-' }}
          </el-descriptions-item>
          
          <el-descriptions-item label="URL">
            {{ currentEvent.url }}
          </el-descriptions-item>
          
          <el-descriptions-item label="用户代理">
            {{ currentEvent.userAgent }}
          </el-descriptions-item>
          
          <el-descriptions-item label="详细信息">
            <pre>{{ JSON.stringify(currentEvent.details, null, 2) }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="showDetailDialog = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AuditLogger } from '@/utils/security'
import { 
  Warning, Lock, Monitor, Refresh, Delete, Download,
  Search, RefreshLeft, Tools
} from '@element-plus/icons-vue'

const loading = ref(false)
const showDetailDialog = ref(false)
const currentEvent = ref(null)
const auditLogs = ref([])

const filterForm = reactive({
  action: '',
  username: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const securityStats = computed(() => {
  const stats = {
    totalLogins: 0,
    failedLogins: 0,
    blockedAttempts: 0,
    totalEvents: auditLogs.value.length
  }

  auditLogs.value.forEach(log => {
    if (log.action === 'login_success') stats.totalLogins++
    if (log.action === 'login_failed') stats.failedLogins++
    if (log.action === 'login_blocked') stats.blockedAttempts++
  })

  return stats
})

const filteredLogs = computed(() => {
  let filtered = auditLogs.value

  if (filterForm.action) {
    filtered = filtered.filter(log => log.action === filterForm.action)
  }

  if (filterForm.username) {
    filtered = filtered.filter(log => 
      (log.username && log.username.toLowerCase().includes(filterForm.username.toLowerCase())) ||
      (log.details?.username && log.details.username.toLowerCase().includes(filterForm.username.toLowerCase()))
    )
  }

  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.dateRange
    filtered = filtered.filter(log => {
      const logTime = new Date(log.timestamp).getTime()
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()
      return logTime >= start && logTime <= end
    })
  }

  pagination.total = filtered.length

  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filtered.slice(start, end)
})

const getEventType = (action) => {
  const typeMap = {
    login_success: 'success',
    login_failed: 'danger',
    login_blocked: 'warning',
    admin_login_success: 'success',
    admin_login_failed: 'warning',
    register_success: 'success',
    register_failed: 'danger',
    logout: 'info',
    storage_read: 'info',
    storage_write: 'primary',
    storage_delete: 'warning'
  }
  return typeMap[action] || 'info'
}

const getEventName = (action) => {
  const nameMap = {
    login_success: '登录成功',
    login_failed: '登录失败',
    login_blocked: '登录被阻止',
    admin_login_success: '管理员登录成功',
    admin_login_failed: '管理员登录失败',
    login_attempt_invalid_username: '用户名格式错误',
    register_success: '注册成功',
    register_failed: '注册失败',
    register_attempt_invalid_username: '注册用户名错误',
    register_attempt_invalid_email: '注册邮箱错误',
    register_attempt_weak_password: '密码强度不足',
    logout: '用户登出',
    storage_read: '数据读取',
    storage_write: '数据写入',
    storage_delete: '数据删除'
  }
  return nameMap[action] || action
}

const getReasonText = (reason) => {
  const reasonMap = {
    user_not_found: '用户不存在',
    invalid_password: '密码错误',
    rate_limit: '频率限制',
    user_exists: '用户已存在'
  }
  return reasonMap[reason] || reason
}

const getSecurityModeText = (mode) => {
  const modeMap = {
    enabled: '已启用',
    disabled: '已禁用',
    disabled_during_login: '登录时禁用'
  }
  return modeMap[mode] || mode
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const loadLogs = () => {
  loading.value = true
  
  try {
    auditLogs.value = AuditLogger.getLogs(1000)
  } finally {
    loading.value = false
  }
}

const refreshLogs = () => {
  loadLogs()
  ElMessage.success('日志已刷新')
}

const clearLogs = async () => {
  try {
    await ElMessageBox.confirm(
      '确认清空所有安全事件日志？此操作不可恢复。',
      '清空确认',
      {
        confirmButtonText: '确认清空',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    AuditLogger.clearLogs()
    auditLogs.value = []
    ElMessage.success('日志已清空')
    
  } catch {
    // 用户取消操作
  }
}

const exportLogs = () => {
  const csvContent = [
    ['时间', '事件类型', '用户名', '详情', '用户代理', 'URL'].join(','),
    ...filteredLogs.value.map(log => [
      formatTimestamp(log.timestamp),
      getEventName(log.action),
      log.username || log.details?.username || '',
      JSON.stringify(log.details).replace(/,/g, ';'),
      (log.userAgent || '').replace(/,/g, ';'),
      log.url || ''
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `security_logs_${new Date().getTime()}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('日志导出成功')
}

const applyFilter = () => {
  pagination.currentPage = 1
}

const resetFilter = () => {
  filterForm.action = ''
  filterForm.username = ''
  filterForm.dateRange = []
  pagination.currentPage = 1
}

const viewEventDetail = (event) => {
  currentEvent.value = event
  showDetailDialog.value = true
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}

onMounted(() => {
  loadLogs()
})
</script>

<style lang="scss" scoped>
.security-dashboard {
  .security-stats {
    margin-bottom: 20px;
    
    .stats-card {
      .stats-item {
        display: flex;
        align-items: center;
        
        .stats-icon {
          font-size: 36px;
          margin-right: 16px;
        }
        
        .stats-content {
          h3 {
            margin: 0 0 4px 0;
            font-size: 24px;
            color: #303133;
          }
          
          p {
            margin: 0;
            color: #909399;
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .events-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        .el-button {
          margin-left: 8px;
        }
      }
    }
    
    .filter-bar {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .event-details {
      font-size: 13px;
      
      div {
        margin-bottom: 2px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
  
  .event-detail {
    pre {
      background: #f5f7fa;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}

@media (max-width: 768px) {
  .security-dashboard {
    .security-stats {
      .stats-card {
        margin-bottom: 16px;
        
        .stats-item {
          .stats-icon {
            font-size: 28px;
            margin-right: 12px;
          }
          
          .stats-content {
            h3 {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}
</style>