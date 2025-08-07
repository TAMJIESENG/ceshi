<template>
  <div class="backup-settings">
    <div class="section-header">
      <h3>💾 备份恢复</h3>
      <p>数据备份和恢复管理</p>
    </div>
    
    <el-form :model="settings.backup" label-width="140px">
      <el-form-item label="自动备份">
        <el-switch 
          v-model="settings.backup.enabled" 
          @change="updateBackupEnabled"
          active-text="启用"
          inactive-text="关闭"
        />
        <div class="setting-hint">定期自动备份重要数据</div>
      </el-form-item>
      
      <template v-if="settings.backup.enabled">
        <el-form-item label="备份频率">
          <el-select v-model="settings.backup.frequency" @change="updateBackupFrequency">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备份时间">
          <el-time-picker
            v-model="settings.backup.time"
            format="HH:mm"
            placeholder="选择备份时间"
            @change="updateBackupTime"
          />
          <div class="setting-hint">系统将在指定时间执行备份</div>
        </el-form-item>
        
        <el-form-item label="保留份数">
          <el-input-number 
            v-model="settings.backup.keepCount" 
            :min="1" 
            :max="30"
            @change="updateBackupKeepCount"
          />
          <span class="unit">个</span>
          <div class="setting-hint">超过此数量的备份文件将被自动删除</div>
        </el-form-item>
      </template>
      
      <el-form-item label="手动操作">
        <div class="backup-actions">
          <el-button 
            @click="createBackup" 
            type="primary" 
            :loading="backupLoading"
          >
            立即备份
          </el-button>
          <el-button @click="showRestoreDialog">恢复数据</el-button>
        </div>
      </el-form-item>
    </el-form>
    
    <!-- 备份历史 -->
    <div class="backup-history">
      <h4>备份历史</h4>
      <el-table :data="backupHistory" style="width: 100%">
        <el-table-column prop="filename" label="文件名" min-width="200" />
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'auto' ? '' : 'success'" size="small">
              {{ scope.row.type === 'auto' ? '自动' : '手动' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              @click="downloadBackup(scope.row)" 
              size="small"
              type="primary"
              link
            >
              下载
            </el-button>
            <el-button 
              @click="restoreBackup(scope.row)" 
              size="small"
              type="warning"
            >
              恢复
            </el-button>
            <el-button 
              @click="deleteBackup(scope.row)" 
              size="small"
              type="danger"
              link
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 恢复对话框 -->
    <el-dialog v-model="restoreDialogVisible" title="恢复数据" width="50%">
      <div class="restore-content">
        <el-alert
          title="注意"
          description="恢复数据将覆盖当前所有数据，此操作无法撤销！"
          type="warning"
          show-icon
          :closable="false"
        />
        
        <div class="restore-options" style="margin-top: 20px;">
          <el-radio-group v-model="restoreOption">
            <el-radio label="file">从备份文件恢复</el-radio>
            <el-radio label="upload">上传备份文件</el-radio>
          </el-radio-group>
        </div>
        
        <div v-if="restoreOption === 'file'" style="margin-top: 16px;">
          <el-select v-model="selectedBackup" placeholder="选择备份文件" style="width: 100%;">
            <el-option 
              v-for="backup in backupHistory" 
              :key="backup.id"
              :label="`${backup.filename} (${formatTime(backup.createTime)})`"
              :value="backup.id"
            />
          </el-select>
        </div>
        
        <div v-if="restoreOption === 'upload'" style="margin-top: 16px;">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="true"
            accept=".json,.sql"
            :limit="1"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 json/sql 文件，且不超过 50MB
              </div>
            </template>
          </el-upload>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="restoreDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="confirmRestore"
            :loading="restoreLoading"
          >
            确认恢复
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const backupLoading = ref(false)
const restoreLoading = ref(false)
const restoreDialogVisible = ref(false)
const restoreOption = ref('file')
const selectedBackup = ref('')
const uploadRef = ref()

// 备份历史数据
const backupHistory = ref([
  {
    id: 1,
    filename: 'backup_20240807_143025.json',
    size: '2.5MB',
    createTime: new Date('2024-08-07 14:30:25'),
    type: 'auto'
  },
  {
    id: 2,
    filename: 'backup_20240806_143025.json',
    size: '2.3MB',
    createTime: new Date('2024-08-06 14:30:25'),
    type: 'auto'
  },
  {
    id: 3,
    filename: 'manual_backup_20240805.json',
    size: '2.1MB',
    createTime: new Date('2024-08-05 10:15:30'),
    type: 'manual'
  }
])

// 备份恢复相关方法
const updateBackupEnabled = (enabled) => {
  settingsStore.updateBackupSetting('enabled', enabled)
  ElMessage.success(enabled ? '自动备份已启用' : '自动备份已关闭')
}

const updateBackupFrequency = (frequency) => {
  settingsStore.updateBackupSetting('frequency', frequency)
  ElMessage.success('备份频率已更新')
}

const updateBackupTime = (time) => {
  settingsStore.updateBackupSetting('time', time)
  ElMessage.success('备份时间已更新')
}

const updateBackupKeepCount = (count) => {
  settingsStore.updateBackupSetting('keepCount', count)
  ElMessage.success('备份保留份数已更新')
}

const createBackup = async () => {
  backupLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const now = new Date()
    const filename = `manual_backup_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.json`
    
    // 添加到备份历史
    backupHistory.value.unshift({
      id: Date.now(),
      filename,
      size: '2.4MB',
      createTime: now,
      type: 'manual'
    })
    
    ElMessage.success('备份创建成功')
  } catch (error) {
    ElMessage.error('备份创建失败')
  } finally {
    backupLoading.value = false
  }
}

const showRestoreDialog = () => {
  restoreDialogVisible.value = true
  restoreOption.value = 'file'
  selectedBackup.value = ''
}

const confirmRestore = async () => {
  if (restoreOption.value === 'file' && !selectedBackup.value) {
    ElMessage.error('请选择要恢复的备份文件')
    return
  }
  
  if (restoreOption.value === 'upload' && (!uploadRef.value || uploadRef.value.uploadFiles.length === 0)) {
    ElMessage.error('请选择要上传的备份文件')
    return
  }
  
  try {
    await ElMessageBox.confirm('确认要恢复数据吗？此操作将覆盖当前所有数据且无法撤销！', '确认恢复', {
      type: 'warning',
      confirmButtonText: '确认恢复',
      cancelButtonText: '取消'
    })
    
    restoreLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    ElMessage.success('数据恢复成功，请重新登录')
    restoreDialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('数据恢复失败')
    }
  } finally {
    restoreLoading.value = false
  }
}

const downloadBackup = (backup) => {
  ElMessage.success(`正在下载 ${backup.filename}`)
}

const restoreBackup = async (backup) => {
  try {
    await ElMessageBox.confirm(`确认要恢复备份文件 "${backup.filename}" 吗？`, '确认恢复', {
      type: 'warning'
    })
    
    restoreLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('数据恢复成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('数据恢复失败')
    }
  } finally {
    restoreLoading.value = false
  }
}

const deleteBackup = async (backup) => {
  try {
    await ElMessageBox.confirm(`确认删除备份文件 "${backup.filename}" 吗？`, '确认删除', {
      type: 'warning'
    })
    
    const index = backupHistory.value.findIndex(item => item.id === backup.id)
    if (index > -1) {
      backupHistory.value.splice(index, 1)
      ElMessage.success('备份文件已删除')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 初始化时可以加载备份历史
})
</script>

<style lang="scss" scoped>
.backup-settings {
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

  .setting-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  .unit {
    margin-left: 8px;
    color: #6c757d;
    font-size: 14px;
  }

  .backup-actions {
    display: flex;
    gap: 12px;
  }

  .backup-history {
    margin-top: 30px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
    }
    
    .el-table {
      border: 1px solid #ebeef5;
      border-radius: 8px;
    }
  }

  .restore-content {
    .restore-options {
      .el-radio {
        display: block;
        margin: 8px 0;
      }
    }
  }

  @media (max-width: 768px) {
    .backup-actions {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>