<template>
  <div class="security-settings">
    <div class="section-header">
      <h3>🛡️ 安全中心</h3>
      <p>系统安全策略和访问控制</p>
    </div>
    
    <el-form :model="settings.security" label-width="140px">
      <el-form-item label="登录安全">
        <el-switch 
          v-model="settings.security.loginSecurity" 
          @change="updateLoginSecurity"
          active-text="强化"
          inactive-text="标准"
        />
        <div class="setting-hint">启用密码复杂度验证和登录尝试限制</div>
      </el-form-item>
      
      <el-form-item label="IP白名单">
        <el-switch 
          v-model="settings.security.ipWhitelist" 
          @change="updateIpWhitelist"
          active-text="启用"
          inactive-text="关闭"
        />
        <div class="setting-hint">只允许白名单IP访问管理后台</div>
      </el-form-item>
      
      <template v-if="settings.security.ipWhitelist">
        <el-form-item label="白名单列表">
          <div class="ip-list">
            <div v-for="(ip, index) in settings.security.allowedIPs" :key="index" class="ip-item">
              <el-input v-model="settings.security.allowedIPs[index]" placeholder="192.168.1.1" />
              <el-button @click="removeIP(index)" type="danger" size="small">删除</el-button>
            </div>
            <el-button @click="addNewIP" size="small">添加IP</el-button>
          </div>
        </el-form-item>
      </template>
      
      <el-form-item label="操作日志">
        <el-switch 
          v-model="settings.security.operationLog" 
          @change="updateOperationLog"
          active-text="记录"
          inactive-text="关闭"
        />
        <div class="setting-hint">记录所有敏感操作，便于审计</div>
      </el-form-item>
      
      <el-form-item label="数据加密">
        <el-switch 
          v-model="settings.security.dataEncryption" 
          @change="updateDataEncryption"
          active-text="启用"
          inactive-text="关闭"
        />
        <div class="setting-hint">敏感数据存储时进行AES加密</div>
      </el-form-item>
      
      <el-form-item label="会话管理">
        <div class="session-info">
          <div class="info-row">
            <span>当前会话数: {{ securityStats.activeSessions }}</span>
            <el-button @click="viewActiveSessions" size="small">查看详情</el-button>
          </div>
          <div class="info-row">
            <span>可疑登录: {{ securityStats.suspiciousLogins }}</span>
            <el-button @click="viewSuspiciousLogins" size="small" type="warning">查看详情</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const securityStats = reactive({
  activeSessions: 3,
  suspiciousLogins: 1
})

// 安全中心相关方法
const updateLoginSecurity = (enabled) => {
  settingsStore.updateSecuritySetting('loginSecurity', enabled)
  ElMessage.success(enabled ? '登录安全已强化' : '登录安全已设为标准')
}

const updateIpWhitelist = (enabled) => {
  settingsStore.updateSecuritySetting('ipWhitelist', enabled)
  ElMessage.success(enabled ? 'IP白名单已启用' : 'IP白名单已关闭')
}

const addNewIP = () => {
  if (!settings.security.allowedIPs) {
    settings.security.allowedIPs = []
  }
  settings.security.allowedIPs.push('')
}

const removeIP = (index) => {
  settings.security.allowedIPs.splice(index, 1)
}

const updateOperationLog = (enabled) => {
  settingsStore.updateSecuritySetting('operationLog', enabled)
  ElMessage.success(enabled ? '操作日志记录已启用' : '操作日志记录已关闭')
}

const updateDataEncryption = (enabled) => {
  settingsStore.updateSecuritySetting('dataEncryption', enabled)
  ElMessage.success(enabled ? '数据加密已启用' : '数据加密已关闭')
}

const viewActiveSessions = () => {
  ElMessage.info('查看活跃会话功能开发中...')
}

const viewSuspiciousLogins = () => {
  ElMessage.info('查看可疑登录功能开发中...')
}
</script>

<style lang="scss" scoped>
.security-settings {
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

  .ip-list {
    .ip-item {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
      align-items: center;
    }
  }

  .session-info {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 4px;
    }
  }

  @media (max-width: 768px) {
    .session-info .info-row {
      flex-direction: column;
      align-items: flex-start;
      
      button {
        margin-top: 8px;
      }
    }
  }
}
</style>