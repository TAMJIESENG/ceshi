<template>
  <div class="system-logs">
    <div class="section-header">
      <h3>📋 系统日志</h3>
      <p>查看和管理系统操作日志</p>
    </div>
    
    <div class="log-controls">
      <el-form inline>
        <el-form-item label="日志级别">
          <el-select v-model="logFilter.level" @change="filterLogs" placeholder="选择级别">
            <el-option label="全部" value="all" />
            <el-option label="信息" value="info" />
            <el-option label="警告" value="warning" />
            <el-option label="错误" value="error" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="logFilter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="filterLogs"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button @click="refreshLogs" :loading="refreshing">刷新</el-button>
          <el-button @click="exportLogs" type="primary">导出日志</el-button>
          <el-button @click="clearLogs" type="danger">清空日志</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="log-table">
      <el-table :data="filteredLogs" style="width: 100%" max-height="400">
        <el-table-column prop="time" label="时间" width="180">
          <template #default="scope">
            <span>{{ formatTime(scope.row.time) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="level" label="级别" width="80">
          <template #default="scope">
            <el-tag 
              :type="getLogLevelType(scope.row.level)" 
              size="small"
            >
              {{ scope.row.level.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="message" label="消息" min-width="200" />
        <el-table-column prop="user" label="用户" width="100" />
        <el-table-column prop="ip" label="IP地址" width="120" />
        
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button 
              @click="viewLogDetail(scope.row)" 
              size="small" 
              type="primary"
              link
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="logs.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 16px;"
      />
    </div>
    
    <!-- 日志详情对话框 -->
    <el-dialog v-model="logDetailVisible" title="日志详情" width="60%">
      <div v-if="selectedLog" class="log-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="时间">{{ formatTime(selectedLog.time) }}</el-descriptions-item>
          <el-descriptions-item label="级别">
            <el-tag :type="getLogLevelType(selectedLog.level)">{{ selectedLog.level.toUpperCase() }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="模块">{{ selectedLog.module }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ selectedLog.user }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="用户代理" span="2">{{ selectedLog.userAgent }}</el-descriptions-item>
          <el-descriptions-item label="消息" span="2">{{ selectedLog.message }}</el-descriptions-item>
          <el-descriptions-item label="详细信息" span="2">
            <pre>{{ selectedLog.details }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const refreshing = ref(false)
const logDetailVisible = ref(false)
const selectedLog = ref(null)

const logFilter = reactive({
  level: 'all',
  dateRange: null
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20
})

// 模拟日志数据
const logs = ref([
  {
    id: 1,
    time: new Date('2024-08-07 14:30:25'),
    level: 'info',
    module: '用户管理',
    message: '用户登录成功',
    user: 'admin',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: '{"action":"login","success":true,"loginMethod":"password"}'
  },
  {
    id: 2,
    time: new Date('2024-08-07 14:25:10'),
    level: 'warning',
    module: '支付系统',
    message: '支付超时',
    user: 'user123',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
    details: '{"orderId":"ORD20240807001","amount":99.00,"timeout":1800}'
  },
  {
    id: 3,
    time: new Date('2024-08-07 14:20:05'),
    level: 'error',
    module: '数据库',
    message: '数据库连接失败',
    user: 'system',
    ip: '127.0.0.1',
    userAgent: 'Internal System',
    details: '{"error":"Connection timeout","host":"localhost:3306","retries":3}'
  },
  {
    id: 4,
    time: new Date('2024-08-07 14:15:30'),
    level: 'info',
    module: '卡密管理',
    message: '批量生成卡密',
    user: 'admin',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: '{"count":100,"category":"月卡","value":30.00}'
  }
])

// 过滤后的日志数据
const filteredLogs = computed(() => {
  let result = logs.value
  
  // 按级别过滤
  if (logFilter.level !== 'all') {
    result = result.filter(log => log.level === logFilter.level)
  }
  
  // 按日期范围过滤
  if (logFilter.dateRange && logFilter.dateRange.length === 2) {
    const startDate = new Date(logFilter.dateRange[0])
    const endDate = new Date(logFilter.dateRange[1])
    endDate.setHours(23, 59, 59, 999)
    
    result = result.filter(log => {
      const logTime = new Date(log.time)
      return logTime >= startDate && logTime <= endDate
    })
  }
  
  // 分页
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  
  return result.slice(start, end)
})

// 系统日志相关方法
const filterLogs = () => {
  pagination.currentPage = 1
}

const refreshLogs = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('日志已刷新')
  } finally {
    refreshing.value = false
  }
}

const exportLogs = () => {
  ElMessage.info('导出日志功能开发中...')
}

const clearLogs = () => {
  ElMessageBox.confirm('清空日志后无法恢复，确认清空？', '确认清空', {
    type: 'warning'
  }).then(() => {
    logs.value = []
    ElMessage.success('日志已清空')
  })
}

const viewLogDetail = (log) => {
  selectedLog.value = log
  logDetailVisible.value = true
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getLogLevelType = (level) => {
  const types = {
    info: '',
    warning: 'warning',
    error: 'danger'
  }
  return types[level] || ''
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
}

onMounted(() => {
  // 初始化时可以加载更多日志
})
</script>

<style lang="scss" scoped>
.system-logs {
  .section-header {
    margin-bottom: 30px;
    
    h3 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 20px;
    }
    
    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }

  .log-controls {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .log-table {
    .el-table {
      border: 1px solid #ebeef5;
      border-radius: 8px;
    }
  }

  .log-detail {
    pre {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.4;
      max-height: 200px;
      overflow-y: auto;
    }
  }

  @media (max-width: 768px) {
    .log-controls {
      .el-form--inline .el-form-item {
        display: block;
        margin-right: 0;
        margin-bottom: 16px;
      }
    }
  }
}
</style>