<template>
  <div class="server-maintenance">
    <!-- 维护状态卡片 -->
    <el-row :gutter="20" class="status-row">
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="status-card">
          <div class="status-item">
            <el-icon 
              class="status-icon" 
              :color="maintenanceStatus.isActive ? '#F56C6C' : '#67C23A'"
            >
              <Tools v-if="maintenanceStatus.isActive" />
              <CircleCheck v-else />
            </el-icon>
            <div class="status-content">
              <h3>{{ maintenanceStatus.isActive ? '维护中' : '正常运行' }}</h3>
              <p>服务器状态</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="status-card">
          <div class="status-item">
            <el-icon class="status-icon" color="#409EFF"><Clock /></el-icon>
            <div class="status-content">
              <h3>{{ formatDuration(maintenanceStatus.duration) }}</h3>
              <p>{{ maintenanceStatus.isActive ? '维护时长' : '正常运行' }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="status-card">
          <div class="status-item">
            <el-icon class="status-icon" color="#E6A23C"><User /></el-icon>
            <div class="status-content">
              <h3>{{ affectedUsers }}</h3>
              <p>受影响用户</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 维护控制面板 -->
    <el-card class="maintenance-control">
      <template #header>
        <div class="card-header">
          <span>维护模式控制</span>
          <el-switch
            v-model="maintenanceStatus.isActive"
            :active-text="maintenanceStatus.isActive ? '维护中' : '启用维护'"
            :inactive-text="'正常运行'"
            active-color="#F56C6C"
            inactive-color="#67C23A"
            @change="handleMaintenanceToggle"
            :loading="toggleLoading"
          />
        </div>
      </template>

      <el-form :model="maintenanceForm" :rules="maintenanceRules" ref="maintenanceFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="维护标题" prop="title">
              <el-input 
                v-model="maintenanceForm.title" 
                placeholder="请输入维护公告标题"
                :disabled="!maintenanceStatus.isActive"
              />
            </el-form-item>
            
            <el-form-item label="维护原因" prop="reason">
              <el-select 
                v-model="maintenanceForm.reason" 
                placeholder="请选择维护原因"
                :disabled="!maintenanceStatus.isActive"
                class="full-width"
              >
                <el-option label="系统升级" value="upgrade" />
                <el-option label="安全更新" value="security" />
                <el-option label="性能优化" value="performance" />
                <el-option label="Bug修复" value="bugfix" />
                <el-option label="数据库维护" value="database" />
                <el-option label="服务器维护" value="server" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="预计时长" prop="estimatedDuration">
              <el-input-number 
                v-model="maintenanceForm.estimatedDuration" 
                :min="5" 
                :max="1440" 
                :step="5"
                placeholder="分钟"
                :disabled="!maintenanceStatus.isActive"
                class="full-width"
              />
              <span class="duration-hint">（单位：分钟，最多24小时）</span>
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :md="12">
            <el-form-item label="维护说明" prop="description">
              <el-input 
                v-model="maintenanceForm.description" 
                type="textarea" 
                :rows="4"
                placeholder="请输入维护详细说明..."
                :disabled="!maintenanceStatus.isActive"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item label="联系方式" prop="contact">
              <el-input 
                v-model="maintenanceForm.contact" 
                placeholder="客服QQ、微信或邮箱"
                :disabled="!maintenanceStatus.isActive"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="updateMaintenanceInfo"
            :loading="updateLoading"
            :disabled="!maintenanceStatus.isActive"
          >
            更新维护信息
          </el-button>
          <el-button 
            type="warning" 
            @click="previewMaintenancePage"
            :disabled="!maintenanceStatus.isActive"
          >
            预览维护页面
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 维护历史记录 -->
    <el-card class="maintenance-history">
      <template #header>
        <div class="card-header">
          <span>维护历史记录</span>
          <el-button size="small" @click="refreshHistory">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table :data="maintenanceHistory" style="width: 100%" v-loading="historyLoading">
        <el-table-column prop="title" label="维护标题" width="200" />
        
        <el-table-column prop="reason" label="维护原因" width="120">
          <template #default="scope">
            <el-tag :type="getReasonTagType(scope.row.reason)">
              {{ getReasonText(scope.row.reason) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="startTime" label="开始时间" width="160" />
        
        <el-table-column prop="endTime" label="结束时间" width="160">
          <template #default="scope">
            {{ scope.row.endTime || '进行中' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="actualDuration" label="实际时长" width="120">
          <template #default="scope">
            {{ formatDuration(scope.row.actualDuration || 0) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="operator" label="操作员" width="100" />
        
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.endTime ? 'success' : 'warning'">
              {{ scope.row.endTime ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button 
              type="info" 
              size="small"
              @click="viewMaintenanceDetail(scope.row)"
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
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 维护预览对话框 -->
    <el-dialog v-model="showPreviewDialog" title="维护页面预览" width="80%">
      <div class="maintenance-preview">
        <div class="preview-page">
          <div class="preview-header">
            <el-icon class="maintenance-icon" color="#F56C6C"><Tools /></el-icon>
            <h1>{{ maintenanceForm.title || '系统维护中' }}</h1>
          </div>
          
          <div class="preview-content">
            <div class="maintenance-info">
              <p class="reason">
                <strong>维护原因：</strong>{{ getReasonText(maintenanceForm.reason) }}
              </p>
              <p class="duration">
                <strong>预计时长：</strong>{{ maintenanceForm.estimatedDuration }} 分钟
              </p>
              <p class="description">
                <strong>维护说明：</strong>{{ maintenanceForm.description || '系统正在进行维护升级，暂时无法访问。' }}
              </p>
              <p class="contact" v-if="maintenanceForm.contact">
                <strong>联系客服：</strong>{{ maintenanceForm.contact }}
              </p>
            </div>
            
            <div class="preview-notice">
              <el-alert
                title="温馨提示"
                type="warning"
                :closable="false"
              >
                <p>• 维护期间所有功能将暂停使用</p>
                <p>• 请耐心等待维护完成</p>
                <p>• 如有紧急问题请联系客服</p>
              </el-alert>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="showPreviewDialog = false">
          关闭预览
        </el-button>
      </template>
    </el-dialog>

    <!-- 维护详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="维护详情" width="600px">
      <div v-if="currentMaintenance" class="maintenance-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="维护标题" :span="2">
            {{ currentMaintenance.title }}
          </el-descriptions-item>
          
          <el-descriptions-item label="维护原因">
            <el-tag :type="getReasonTagType(currentMaintenance.reason)">
              {{ getReasonText(currentMaintenance.reason) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="操作员">
            {{ currentMaintenance.operator }}
          </el-descriptions-item>
          
          <el-descriptions-item label="开始时间">
            {{ currentMaintenance.startTime }}
          </el-descriptions-item>
          
          <el-descriptions-item label="结束时间">
            {{ currentMaintenance.endTime || '进行中' }}
          </el-descriptions-item>
          
          <el-descriptions-item label="预计时长">
            {{ currentMaintenance.estimatedDuration }} 分钟
          </el-descriptions-item>
          
          <el-descriptions-item label="实际时长">
            {{ formatDuration(currentMaintenance.actualDuration || 0) }}
          </el-descriptions-item>
          
          <el-descriptions-item label="维护说明" :span="2">
            {{ currentMaintenance.description }}
          </el-descriptions-item>
          
          <el-descriptions-item label="联系方式" :span="2">
            {{ currentMaintenance.contact || '-' }}
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
import { useUserStore } from '@/stores/user'
import { useMaintenanceStore } from '@/stores/maintenance'
import { 
  Tools, CircleCheck, Clock, User, Refresh
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const maintenanceStore = useMaintenanceStore()

const toggleLoading = ref(false)
const updateLoading = ref(false)
const historyLoading = ref(false)
const showPreviewDialog = ref(false)
const showDetailDialog = ref(false)
const maintenanceFormRef = ref()
const currentMaintenance = ref(null)

const maintenanceStatus = reactive({
  isActive: false,
  startTime: null,
  duration: 0
})

const maintenanceForm = reactive({
  title: '系统维护升级',
  reason: 'upgrade',
  estimatedDuration: 60,
  description: '系统正在进行维护升级，预计需要1小时。维护期间所有功能将暂停使用，请耐心等待。',
  contact: 'AQ0007N'
})

const maintenanceHistory = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const maintenanceRules = {
  title: [
    { required: true, message: '请输入维护标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2到50个字符', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请选择维护原因', trigger: 'change' }
  ],
  estimatedDuration: [
    { required: true, message: '请输入预计维护时长', trigger: 'blur' },
    { type: 'number', min: 5, max: 1440, message: '维护时长应在5分钟到24小时之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入维护说明', trigger: 'blur' },
    { min: 10, max: 500, message: '说明长度在10到500个字符', trigger: 'blur' }
  ]
}

const affectedUsers = computed(() => {
  if (!maintenanceStatus.isActive) return 0
  // 模拟受影响用户数量
  const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
  return allUsers.length
})

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} 分钟`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`
  }
}

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
  return reasonMap[reason] || reason
}

const getReasonTagType = (reason) => {
  const typeMap = {
    upgrade: 'primary',
    security: 'danger',
    performance: 'success',
    bugfix: 'warning',
    database: 'info',
    server: 'danger',
    other: 'info'
  }
  return typeMap[reason] || 'info'
}

const handleMaintenanceToggle = async (value) => {
  toggleLoading.value = true
  
  try {
    if (value) {
      // 启用维护模式
      await ElMessageBox.confirm(
        '启用维护模式后，所有用户将无法正常使用系统功能。确认启用？',
        '启用维护模式',
        {
          confirmButtonText: '确认启用',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      const maintenanceRecord = {
        id: Date.now(),
        title: maintenanceForm.title,
        reason: maintenanceForm.reason,
        estimatedDuration: maintenanceForm.estimatedDuration,
        description: maintenanceForm.description,
        contact: maintenanceForm.contact,
        startTime: new Date().toLocaleString('zh-CN'),
        endTime: null,
        actualDuration: 0,
        operator: userStore.user.username
      }
      
      // 使用全局store启动维护模式
      maintenanceStore.startMaintenance({
        title: maintenanceForm.title,
        reason: maintenanceForm.reason,
        estimatedDuration: maintenanceForm.estimatedDuration,
        description: maintenanceForm.description,
        contact: maintenanceForm.contact
      })
      
      // 保存维护记录
      const history = JSON.parse(localStorage.getItem('maintenance_history') || '[]')
      history.unshift(maintenanceRecord)
      localStorage.setItem('maintenance_history', JSON.stringify(history))
      
      // 更新本地状态
      maintenanceStatus.isActive = true
      maintenanceStatus.startTime = new Date()
      
      ElMessage.success('维护模式已启用')
      loadMaintenanceHistory()
      
      // 刷新页面以触发路由守卫
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
    } else {
      // 关闭维护模式
      await ElMessageBox.confirm(
        '关闭维护模式后，用户将恢复正常访问。确认关闭？',
        '关闭维护模式',
        {
          confirmButtonText: '确认关闭',
          cancelButtonText: '取消',
          type: 'success'
        }
      )
      
      const duration = Math.floor((new Date() - maintenanceStatus.startTime) / (1000 * 60))
      
      // 更新维护记录
      const history = JSON.parse(localStorage.getItem('maintenance_history') || '[]')
      if (history.length > 0) {
        history[0].endTime = new Date().toLocaleString('zh-CN')
        history[0].actualDuration = duration
        localStorage.setItem('maintenance_history', JSON.stringify(history))
      }
      
      // 使用全局store停止维护模式
      maintenanceStore.stopMaintenance()
      
      // 更新本地状态
      maintenanceStatus.isActive = false
      maintenanceStatus.startTime = null
      maintenanceStatus.duration = 0
      
      ElMessage.success('维护模式已关闭')
      loadMaintenanceHistory()
    }
  } catch {
    // 用户取消操作，恢复开关状态
    maintenanceStatus.isActive = !value
  } finally {
    toggleLoading.value = false
  }
}

const updateMaintenanceInfo = async () => {
  if (!maintenanceFormRef.value) return
  
  await maintenanceFormRef.value.validate(async (valid) => {
    if (valid) {
      updateLoading.value = true
      
      try {
        // 更新全局store的维护信息
        maintenanceStore.startMaintenance({
          title: maintenanceForm.title,
          reason: maintenanceForm.reason,
          estimatedDuration: maintenanceForm.estimatedDuration,
          description: maintenanceForm.description,
          contact: maintenanceForm.contact
        })
        
        // 更新历史记录中的当前记录
        const history = JSON.parse(localStorage.getItem('maintenance_history') || '[]')
        if (history.length > 0 && !history[0].endTime) {
          history[0] = {
            ...history[0],
            title: maintenanceForm.title,
            reason: maintenanceForm.reason,
            estimatedDuration: maintenanceForm.estimatedDuration,
            description: maintenanceForm.description,
            contact: maintenanceForm.contact
          }
          localStorage.setItem('maintenance_history', JSON.stringify(history))
        }
        
        ElMessage.success('维护信息已更新')
        loadMaintenanceHistory()
      } finally {
        updateLoading.value = false
      }
    }
  })
}

const previewMaintenancePage = () => {
  showPreviewDialog.value = true
}

const viewMaintenanceDetail = (maintenance) => {
  currentMaintenance.value = maintenance
  showDetailDialog.value = true
}

const loadMaintenanceHistory = () => {
  historyLoading.value = true
  
  try {
    const history = JSON.parse(localStorage.getItem('maintenance_history') || '[]')
    maintenanceHistory.value = history
    pagination.total = history.length
  } finally {
    historyLoading.value = false
  }
}

const refreshHistory = () => {
  loadMaintenanceHistory()
  ElMessage.success('历史记录已刷新')
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}

// 更新维护时长计时器
const updateDuration = () => {
  if (maintenanceStatus.isActive && maintenanceStatus.startTime) {
    maintenanceStatus.duration = Math.floor((new Date() - maintenanceStatus.startTime) / (1000 * 60))
  }
}

onMounted(() => {
  // 检查全局维护状态
  const isActive = maintenanceStore.checkMaintenanceMode()
  const globalInfo = maintenanceStore.getMaintenanceInfo()
  
  // 同步本地状态
  maintenanceStatus.isActive = isActive
  maintenanceStatus.startTime = globalInfo.startTime ? new Date(globalInfo.startTime) : null
  
  // 同步表单数据
  if (globalInfo.title) maintenanceForm.title = globalInfo.title
  if (globalInfo.reason) maintenanceForm.reason = globalInfo.reason
  if (globalInfo.estimatedDuration) maintenanceForm.estimatedDuration = globalInfo.estimatedDuration
  if (globalInfo.description) maintenanceForm.description = globalInfo.description
  if (globalInfo.contact) maintenanceForm.contact = globalInfo.contact
  
  loadMaintenanceHistory()
  
  // 启动计时器
  setInterval(updateDuration, 60000) // 每分钟更新一次
  updateDuration()
})
</script>

<style lang="scss" scoped>
.server-maintenance {
  .status-row {
    margin-bottom: 20px;
    
    .status-card {
      .status-item {
        display: flex;
        align-items: center;
        
        .status-icon {
          font-size: 36px;
          margin-right: 16px;
        }
        
        .status-content {
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
  
  .maintenance-control {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .duration-hint {
      color: #909399;
      font-size: 12px;
      margin-left: 8px;
    }
  }
  
  .maintenance-history {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
  
  .maintenance-preview {
    .preview-page {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 40px;
      color: white;
      text-align: center;
      
      .preview-header {
        margin-bottom: 32px;
        
        .maintenance-icon {
          font-size: 80px;
          margin-bottom: 16px;
        }
        
        h1 {
          font-size: 32px;
          margin: 0;
          font-weight: bold;
        }
      }
      
      .preview-content {
        .maintenance-info {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          text-align: left;
          
          p {
            margin: 12px 0;
            font-size: 16px;
            line-height: 1.6;
            
            strong {
              color: #FFD700;
            }
          }
        }
        
        .preview-notice {
          .el-alert {
            background: rgba(255, 255, 255, 0.95);
            border: none;
            border-radius: 8px;
            
            p {
              margin: 4px 0;
              color: #E6A23C;
            }
          }
        }
      }
    }
  }
  
  .maintenance-detail {
    .el-descriptions {
      margin-top: 16px;
    }
  }
}

.full-width {
  width: 100%;
}

@media (max-width: 768px) {
  .server-maintenance {
    .status-row {
      .status-card {
        margin-bottom: 16px;
        
        .status-item {
          .status-icon {
            font-size: 28px;
            margin-right: 12px;
          }
          
          .status-content {
            h3 {
              font-size: 20px;
            }
          }
        }
      }
    }
    
    .maintenance-preview {
      .preview-page {
        padding: 24px;
        
        .preview-header {
          .maintenance-icon {
            font-size: 60px;
          }
          
          h1 {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>