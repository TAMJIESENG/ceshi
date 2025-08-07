<template>
  <div class="password-change">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Lock /></el-icon>
          <span>修改密码</span>
        </div>
      </template>
      
      <div class="password-form">
        <el-alert
          title="密码安全提示"
          type="info"
          description="为了您的账户安全，请定期更换密码。新密码长度至少6位，建议包含字母、数字和特殊字符。"
          show-icon
          :closable="false"
          class="security-tip"
        />
        
        <el-form 
          :model="passwordForm" 
          :rules="rules" 
          ref="passwordFormRef" 
          label-width="120px"
          class="password-form-content"
        >
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
              clearable
              @input="checkPasswordStrength"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
            
            <!-- 密码强度指示器 -->
            <div class="password-strength" v-if="passwordForm.newPassword">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="strengthClass"
                  :style="{ width: strengthPercent + '%' }"
                ></div>
              </div>
              <span class="strength-text" :class="strengthClass">
                {{ strengthText }}
              </span>
            </div>
          </el-form-item>
          
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleSubmit" 
              :loading="loading"
              size="large"
            >
              <el-icon><Check /></el-icon>
              确认修改
            </el-button>
            <el-button @click="resetForm" size="large">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 密码安全建议 -->
      <div class="security-suggestions">
        <h4>密码安全建议</h4>
        <ul>
          <li><el-icon class="tip-icon" color="#67c23a"><Check /></el-icon>密码长度至少8位字符</li>
          <li><el-icon class="tip-icon" color="#67c23a"><Check /></el-icon>包含大小写字母、数字和特殊字符</li>
          <li><el-icon class="tip-icon" color="#67c23a"><Check /></el-icon>避免使用个人信息作为密码</li>
          <li><el-icon class="tip-icon" color="#67c23a"><Check /></el-icon>定期更换密码（建议3-6个月）</li>
          <li><el-icon class="tip-icon" color="#67c23a"><Check /></el-icon>不要在多个网站使用相同密码</li>
        </ul>
      </div>
    </el-card>
    
    <!-- 修改历史 -->
    <el-card class="history-card">
      <template #header>
        <span>密码修改历史</span>
      </template>
      
      <el-table :data="passwordHistory" style="width: 100%">
        <el-table-column prop="changeTime" label="修改时间" width="180" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="device" label="设备信息" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
              {{ scope.row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="passwordHistory.length === 0" description="暂无修改记录" :image-size="80" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Lock, Key, Check, Refresh } from '@element-plus/icons-vue'

const userStore = useUserStore()

const loading = ref(false)
const passwordFormRef = ref()
const strengthLevel = ref(0)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordHistory = ref([
  {
    changeTime: '2024-01-15 10:30:00',
    ip: '192.168.1.100',
    device: 'Chrome 120.0 (Windows)',
    status: 'success'
  },
  {
    changeTime: '2023-12-01 14:20:00',
    ip: '192.168.1.100',
    device: 'Chrome 119.0 (Windows)',
    status: 'success'
  }
])

// 密码强度计算
const strengthPercent = computed(() => {
  return strengthLevel.value * 25
})

const strengthClass = computed(() => {
  const classes = ['strength-weak', 'strength-fair', 'strength-good', 'strength-strong']
  return classes[strengthLevel.value - 1] || 'strength-weak'
})

const strengthText = computed(() => {
  const texts = ['弱', '一般', '较强', '强']
  return texts[strengthLevel.value - 1] || '弱'
})

// 验证规则
const validateCurrentPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入当前密码'))
    return
  }
  
  // 验证当前密码是否正确
  const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
  const currentUser = userStore.user
  const user = allUsers.find(u => u.id === currentUser?.id)
  
  if (!user || user.password !== value) {
    callback(new Error('当前密码不正确'))
  } else {
    callback()
  }
}

const validateNewPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入新密码'))
    return
  }
  
  if (value.length < 6) {
    callback(new Error('新密码长度至少6位'))
    return
  }
  
  if (value === passwordForm.currentPassword) {
    callback(new Error('新密码不能与当前密码相同'))
    return
  }
  
  callback()
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请确认新密码'))
    return
  }
  
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
    return
  }
  
  callback()
}

const rules = {
  currentPassword: [
    { validator: validateCurrentPassword, trigger: 'blur' }
  ],
  newPassword: [
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 检查密码强度
const checkPasswordStrength = () => {
  const password = passwordForm.newPassword
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  
  strengthLevel.value = Math.max(1, strength)
}

// 提交表单
const handleSubmit = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        // 更新用户密码
        const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
        const currentUser = userStore.user
        const userIndex = allUsers.findIndex(u => u.id === currentUser?.id)
        
        if (userIndex !== -1) {
          allUsers[userIndex].password = passwordForm.newPassword
          localStorage.setItem('all_users', JSON.stringify(allUsers))
          
          // 添加修改记录
          const newRecord = {
            changeTime: new Date().toLocaleString('zh-CN'),
            ip: '192.168.1.100', // 实际项目中应该获取真实IP
            device: navigator.userAgent.split(')')[0] + ')',
            status: 'success'
          }
          passwordHistory.value.unshift(newRecord)
          
          ElMessage.success('密码修改成功')
          resetForm()
        } else {
          ElMessage.error('用户信息异常，请重新登录')
        }
      } catch (error) {
        ElMessage.error('密码修改失败')
        
        // 添加失败记录
        const newRecord = {
          changeTime: new Date().toLocaleString('zh-CN'),
          ip: '192.168.1.100',
          device: navigator.userAgent.split(')')[0] + ')',
          status: 'failed'
        }
        passwordHistory.value.unshift(newRecord)
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  strengthLevel.value = 0
  
  if (passwordFormRef.value) {
    passwordFormRef.value.clearValidate()
  }
}
</script>

<style lang="scss" scoped>
.password-change {
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #409eff;
    font-weight: bold;
    
    .header-icon {
      font-size: 18px;
    }
  }
  
  .password-form {
    .security-tip {
      margin-bottom: 24px;
    }
    
    .password-form-content {
      max-width: 500px;
      
      .password-strength {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e4e7ed;
          border-radius: 2px;
          overflow: hidden;
          
          .strength-fill {
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 2px;
            
            &.strength-weak {
              background: #f56c6c;
            }
            
            &.strength-fair {
              background: #e6a23c;
            }
            
            &.strength-good {
              background: #409eff;
            }
            
            &.strength-strong {
              background: #67c23a;
            }
          }
        }
        
        .strength-text {
          font-size: 12px;
          font-weight: 500;
          min-width: 24px;
          
          &.strength-weak {
            color: #f56c6c;
          }
          
          &.strength-fair {
            color: #e6a23c;
          }
          
          &.strength-good {
            color: #409eff;
          }
          
          &.strength-strong {
            color: #67c23a;
          }
        }
      }
    }
  }
  
  .security-suggestions {
    margin-top: 32px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #409eff;
    
    h4 {
      margin-bottom: 16px;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #606266;
        font-size: 14px;
        
        .tip-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .history-card {
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .password-change {
    .password-form {
      .password-form-content {
        max-width: 100%;
      }
    }
    
    .security-suggestions {
      padding: 16px;
      
      ul li {
        font-size: 13px;
      }
    }
  }
}
</style>