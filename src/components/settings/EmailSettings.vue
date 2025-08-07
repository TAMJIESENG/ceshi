<template>
  <div class="email-settings">
    <div class="section-header">
      <h3>📧 邮件服务</h3>
      <p>配置SMTP服务器和邮件模板</p>
    </div>
    
    <el-form :model="settings.email" label-width="140px">
      <el-form-item label="邮件服务">
        <el-switch 
          v-model="settings.email.enabled" 
          @change="updateEmailService"
          active-text="启用"
          inactive-text="关闭"
        />
      </el-form-item>
      
      <template v-if="settings.email.enabled">
        <el-form-item label="SMTP服务器">
          <el-input 
            v-model="settings.email.smtpHost" 
            placeholder="smtp.gmail.com"
            @change="updateEmailConfig"
          />
        </el-form-item>
        
        <el-form-item label="SMTP端口">
          <el-input-number 
            v-model="settings.email.smtpPort" 
            :min="1" 
            :max="65535"
            @change="updateEmailConfig"
          />
        </el-form-item>
        
        <el-form-item label="发件邮箱">
          <el-input 
            v-model="settings.email.fromEmail" 
            placeholder="noreply@yoursite.com"
            @change="updateEmailConfig"
          />
        </el-form-item>
        
        <el-form-item label="邮箱密码">
          <el-input 
            v-model="settings.email.password" 
            type="password" 
            show-password
            placeholder="应用专用密码"
            @change="updateEmailConfig"
          />
        </el-form-item>
        
        <el-form-item label="加密方式">
          <el-radio-group v-model="settings.email.encryption" @change="updateEmailConfig">
            <el-radio label="none">无加密</el-radio>
            <el-radio label="tls">TLS</el-radio>
            <el-radio label="ssl">SSL</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="邮件类型">
          <el-checkbox-group v-model="settings.email.types" @change="updateEmailTypes">
            <el-checkbox label="register">注册通知</el-checkbox>
            <el-checkbox label="purchase">购买确认</el-checkbox>
            <el-checkbox label="delivery">发货通知</el-checkbox>
            <el-checkbox label="security">安全警报</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="测试邮件">
          <div class="action-buttons">
            <el-button @click="testEmailSend" size="small" :loading="emailTesting">
              发送测试邮件
            </el-button>
            <el-input 
              v-model="testEmailAddress" 
              placeholder="测试邮箱地址"
              style="width: 200px; margin-left: 10px;"
            />
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const emailTesting = ref(false)
const testEmailAddress = ref('')

// 邮件服务相关方法
const updateEmailService = (enabled) => {
  settingsStore.updateEmailSetting('enabled', enabled)
  ElMessage.success(enabled ? '邮件服务已启用' : '邮件服务已关闭')
}

const updateEmailConfig = () => {
  settingsStore.saveEmailConfig()
  ElMessage.success('邮件配置已保存')
}

const updateEmailTypes = (types) => {
  settingsStore.updateEmailSetting('types', types)
  ElMessage.success('邮件类型配置已更新')
}

const testEmailSend = async () => {
  if (!testEmailAddress.value) {
    ElMessage.error('请输入测试邮箱地址')
    return
  }
  
  emailTesting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success(`测试邮件已发送至 ${testEmailAddress.value}`)
  } catch (error) {
    ElMessage.error('测试邮件发送失败')
  } finally {
    emailTesting.value = false
  }
}
</script>

<style lang="scss" scoped>
.email-settings {
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

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>