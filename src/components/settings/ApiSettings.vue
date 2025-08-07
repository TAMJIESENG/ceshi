<template>
  <div class="api-settings">
    <div class="section-header">
      <h3>🔗 API管理</h3>
      <p>管理API密钥和接口权限</p>
    </div>
    
    <div class="api-keys">
      <div class="api-key-item" v-for="key in apiKeys" :key="key.id">
        <div class="key-info">
          <div class="key-name">{{ key.name }}</div>
          <div class="key-value">{{ key.key }}</div>
          <div class="key-meta">
            <span class="create-time">创建于 {{ key.createTime }}</span>
            <span class="last-used">最后使用 {{ key.lastUsed }}</span>
            <span class="status" :class="key.status">{{ key.status === 'active' ? '活跃' : '已禁用' }}</span>
          </div>
        </div>
        <div class="key-actions">
          <el-button @click="toggleApiKey(key)" size="small" :type="key.status === 'active' ? 'warning' : 'success'">
            {{ key.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button @click="regenerateApiKey(key)" size="small">重新生成</el-button>
          <el-button @click="deleteApiKey(key)" size="small" type="danger">删除</el-button>
        </div>
      </div>
      
      <div class="create-key">
        <el-button type="primary">创建新API密钥</el-button>
      </div>
    </div>
    
    <el-form :model="settings.api" label-width="140px">
      <el-form-item label="请求限制">
        <el-input-number 
          v-model="settings.api.rateLimit" 
          :min="1" 
          :max="10000"
          @change="updateApiRateLimit"
        />
        <span class="unit">次/分钟</span>
      </el-form-item>
      
      <el-form-item label="CORS设置">
        <el-switch 
          v-model="settings.api.corsEnabled" 
          @change="updateCorsSettings"
          active-text="启用"
          inactive-text="关闭"
        />
      </el-form-item>
      
      <template v-if="settings.api.corsEnabled">
        <el-form-item label="允许域名">
          <el-input 
            v-model="settings.api.allowedOrigins" 
            type="textarea"
            placeholder="https://example.com&#10;https://app.example.com"
            @change="updateCorsSettings"
          />
        </el-form-item>
      </template>
      
      <el-form-item label="API统计">
        <div class="api-stats">
          <div class="stat-item">
            <span class="stat-label">今日请求</span>
            <span class="stat-value">{{ apiStats.todayRequests }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">成功率</span>
            <span class="stat-value">{{ apiStats.successRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">活跃应用</span>
            <span class="stat-value">{{ apiStats.activeApps }}</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const apiKeys = ref([
  {
    id: 1,
    name: '移动端应用',
    key: 'sk-live-123456789abcdef...',
    status: 'active',
    createTime: '2024-01-01',
    lastUsed: '2小时前'
  },
  {
    id: 2,
    name: '网页接口',
    key: 'sk-test-987654321fedcba...',
    status: 'inactive',
    createTime: '2024-01-10',
    lastUsed: '从未使用'
  }
])

const apiStats = reactive({
  todayRequests: 1250,
  successRate: 99.2,
  activeApps: 5
})

// API管理相关方法
const toggleApiKey = (key) => {
  key.status = key.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(`API密钥已${key.status === 'active' ? '启用' : '禁用'}`)
}

const regenerateApiKey = (key) => {
  ElMessageBox.confirm('重新生成API密钥将使旧密钥失效，确认继续？', '确认操作').then(() => {
    key.key = 'sk-' + Math.random().toString(36).substr(2, 24) + '...'
    ElMessage.success('API密钥已重新生成')
  })
}

const deleteApiKey = (key) => {
  ElMessageBox.confirm('删除API密钥后无法恢复，确认删除？', '确认删除', {
    type: 'warning'
  }).then(() => {
    const index = apiKeys.value.findIndex(k => k.id === key.id)
    if (index > -1) {
      apiKeys.value.splice(index, 1)
      ElMessage.success('API密钥已删除')
    }
  })
}

const updateApiRateLimit = (limit) => {
  settingsStore.updateApiSetting('rateLimit', limit)
  ElMessage.success('API请求限制已更新')
}

const updateCorsSettings = () => {
  settingsStore.saveApiConfig()
  ElMessage.success('CORS设置已保存')
}
</script>

<style lang="scss" scoped>
.api-settings {
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

  .api-keys {
    margin-bottom: 20px;
    
    .api-key-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 12px;
      
      .key-info {
        flex: 1;
        
        .key-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .key-value {
          font-family: monospace;
          color: #6c757d;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .key-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #6c757d;
          
          .status.active {
            color: #28a745;
          }
          
          .status.inactive {
            color: #dc3545;
          }
        }
      }
      
      .key-actions {
        display: flex;
        gap: 8px;
      }
    }
    
    .create-key {
      text-align: center;
      padding: 16px;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      
      &:hover {
        border-color: #409eff;
      }
    }
  }

  .api-stats {
    display: flex;
    gap: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-label {
        font-size: 12px;
        color: #6c757d;
        margin-bottom: 4px;
      }
      
      .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: #28a745;
      }
    }
  }

  .unit {
    margin-left: 8px;
    color: #6c757d;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .api-stats {
      flex-direction: column;
      gap: 12px;
    }
    
    .api-key-item {
      flex-direction: column;
      align-items: flex-start;
      
      .key-actions {
        margin-top: 12px;
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}
</style>