<template>
  <div class="profile-page">
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>个人资料</h2>
          <el-button @click="$router.go(-1)">返回</el-button>
        </div>
      </el-header>
      
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <template #header>
                <span>头像信息</span>
              </template>
              
              <div class="avatar-section">
                <div class="avatar-container">
                  <el-avatar 
                    :size="120" 
                    :src="userInfo.avatar || ''"
                    class="avatar-display"
                    @click="userInfo.avatar && previewAvatar()"
                    @error="handleAvatarError"
                    :style="{ cursor: userInfo.avatar ? 'pointer' : 'default' }"
                  >
                    <el-icon v-if="!userInfo.avatar || avatarError"><User /></el-icon>
                  </el-avatar>
                  
                  <!-- 头像预览遮罩 -->
                  <div class="avatar-overlay" v-if="userInfo.avatar">
                    <el-button
                      type="danger"
                      circle
                      size="small"
                      class="remove-avatar-btn"
                      @click="removeAvatar"
                      title="删除头像"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  
                  <p v-if="userInfo.avatar" class="avatar-hint">点击头像预览</p>
                </div>
                
                <div class="avatar-actions">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleAvatarUpload"
                    style="display: none"
                  />
                  
                  <el-button 
                    type="primary" 
                    :loading="uploading"
                    :disabled="uploading"
                    class="change-avatar-btn"
                    @click="fileInput?.click()"
                  >
                    <el-icon v-if="!uploading"><Upload /></el-icon>
                    {{ uploading ? '上传中...' : (userInfo.avatar ? '更换头像' : '设置头像') }}
                  </el-button>
                  
                  <div class="avatar-tips">
                    <p>• 支持 JPG、PNG、GIF 格式</p>
                    <p>• 图片大小不超过 2MB</p>
                    <p>• 建议上传正方形图片</p>
                    <p>• 自动缩放到合适尺寸</p>
                  </div>
                </div>
              </div>
            </el-card>
            
            <el-card class="mt-20">
              <template #header>
                <span>账户统计</span>
              </template>
              
              <div class="stats-list">
                <div class="stats-item">
                  <span class="label">注册时间</span>
                  <span class="value">{{ userInfo.registerTime }}</span>
                </div>
                <div class="stats-item">
                  <span class="label">最后登录</span>
                  <span class="value">{{ userInfo.lastLogin }}</span>
                </div>
                <div class="stats-item">
                  <span class="label">累计消费</span>
                  <span class="value">¥{{ userInfo.totalSpent }}</span>
                </div>
                <div class="stats-item">
                  <span class="label">会员等级</span>
                  <el-tag :type="getLevelType(userInfo.level)">
                    {{ userInfo.level }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>基本信息</span>
                  <el-button 
                    v-if="!editing" 
                    type="primary" 
                    @click="startEdit"
                  >
                    编辑资料
                  </el-button>
                  <div v-else>
                    <el-button @click="cancelEdit">取消</el-button>
                    <el-button type="primary" @click="saveProfile">保存</el-button>
                  </div>
                </div>
              </template>
              
              <el-form :model="userInfo" label-width="100px" :disabled="!editing">
                <el-form-item label="用户名">
                  <el-input v-model="userInfo.username" disabled />
                </el-form-item>
                
                <el-form-item label="邮箱">
                  <el-input v-model="userInfo.email" />
                </el-form-item>
                
                <el-form-item label="手机号">
                  <el-input v-model="userInfo.phone" />
                </el-form-item>
                
                <el-form-item label="真实姓名">
                  <el-input v-model="userInfo.realName" />
                </el-form-item>
                
                <el-form-item label="生日">
                  <el-date-picker
                    v-model="userInfo.birthday"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                    <el-radio label="other">其他</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="个人简介">
                  <el-input
                    v-model="userInfo.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="介绍一下自己..."
                  />
                </el-form-item>
              </el-form>
            </el-card>
            
            <el-card class="mt-20">
              <template #header>
                <span>安全设置</span>
              </template>
              
              <div class="security-settings">
                <div class="security-item">
                  <div class="security-info">
                    <h4>登录密码</h4>
                    <p>定期更新密码，保护账户安全</p>
                  </div>
                  <el-button @click="showPasswordDialog = true">修改密码</el-button>
                </div>
                
                <div class="security-item">
                  <div class="security-info">
                    <h4>两步验证</h4>
                    <p>开启两步验证，提升账户安全性</p>
                  </div>
                  <el-switch
                    v-model="userInfo.twoFactorEnabled"
                    @change="handleTwoFactorChange"
                  />
                </div>
                
                <div class="security-item">
                  <div class="security-info">
                    <h4>邮箱验证</h4>
                    <p>验证邮箱，确保账户安全</p>
                  </div>
                  <el-tag v-if="userInfo.emailVerified" type="success">已验证</el-tag>
                  <el-button v-else type="warning" size="small">去验证</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    
    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="900px">
      <PasswordChange />
      
      <template #footer>
        <el-button @click="showPasswordDialog = false">关闭</el-button>
      </template>
    </el-dialog>
    
    
    <!-- 头像预览对话框 -->
    <el-dialog 
      v-model="showAvatarPreview" 
      title="头像预览" 
      width="400px"
      align-center
    >
      <div class="avatar-preview-container">
        <el-avatar :size="200" :src="userInfo.avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAvatarPreview = false">关闭</el-button>
          <el-button type="danger" @click="removeAvatar">
            <el-icon><Delete /></el-icon>
            删除头像
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Upload, Delete } from '@element-plus/icons-vue'
import PasswordChange from '@/components/PasswordChange.vue'
import { useUserStore } from '@/stores/user'

const editing = ref(false)
const showPasswordDialog = ref(false)
const showAvatarPreview = ref(false)
const uploading = ref(false)
const avatarError = ref(false)
const fileInput = ref(null)
const userStore = useUserStore()

const userInfo = reactive({
  username: '',
  email: '',
  phone: '',
  realName: '',
  birthday: '',
  gender: 'male',
  bio: '',
  avatar: '',
  registerTime: '',
  lastLogin: '',
  totalSpent: '0.00',
  level: '普通',
  twoFactorEnabled: false,
  emailVerified: false
})

const originalUserInfo = reactive({})

const getLevelType = (level) => {
  const typeMap = {
    'VIP': 'warning',
    'SVIP': 'success',
    '普通': 'info'
  }
  return typeMap[level] || 'info'
}

const startEdit = () => {
  editing.value = true
  Object.assign(originalUserInfo, userInfo)
}

const cancelEdit = () => {
  editing.value = false
  Object.assign(userInfo, originalUserInfo)
}

const saveProfile = async () => {
  try {
    // 从 localStorage 获取当前用户数据
    const savedUser = JSON.parse(localStorage.getItem('user_data') || '{}')
    
    if (!savedUser.id) {
      ElMessage.error('用户信息不完整，请重新登录')
      return
    }
    
    // 更新 all_users 中的用户数据
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    const userIndex = allUsers.findIndex(u => String(u.id) === String(savedUser.id))
    
    if (userIndex !== -1) {
      // 更新所有用户列表中的数据
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        email: userInfo.email,
        phone: userInfo.phone,
        realName: userInfo.realName,
        birthday: userInfo.birthday,
        gender: userInfo.gender,
        bio: userInfo.bio,
        avatar: userInfo.avatar,
        twoFactorEnabled: userInfo.twoFactorEnabled
      }
      localStorage.setItem('all_users', JSON.stringify(allUsers))
      
      // 更新当前用户数据
      const updatedUser = {
        ...savedUser,
        email: userInfo.email,
        phone: userInfo.phone,
        realName: userInfo.realName,
        birthday: userInfo.birthday,
        gender: userInfo.gender,
        bio: userInfo.bio,
        avatar: userInfo.avatar,
        twoFactorEnabled: userInfo.twoFactorEnabled
      }
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      
      ElMessage.success('保存成功')
      editing.value = false
      
      // 刷新用户store数据
      userStore.refreshCurrentUser()
      
      // 触发存储事件通知其他页面
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user_data', 
        newValue: JSON.stringify(updatedUser),
        url: window.location.href
      }))
    } else {
      ElMessage.error('未找到用户数据，保存失败')
    }
  } catch (error) {
    console.error('保存用户资料失败:', error)
    ElMessage.error('保存失败：' + error.message)
  }
}

// 简单的头像上传功能
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }

  // 开始上传处理
  uploading.value = true
  
  try {
    // 将文件转换为base64
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        let avatarData = e.target.result
        
        // 如果图片太大，进行简单压缩
        if (avatarData.length > 500 * 1024) { // 500KB
          avatarData = await compressImage(avatarData, 0.8)
        }
        
        await saveAvatarToStorage(avatarData)
        ElMessage.success('头像上传成功!')
      } catch (error) {
        console.error('处理头像失败:', error)
        ElMessage.error('头像上传失败: ' + error.message)
      } finally {
        uploading.value = false
      }
    }
    
    reader.onerror = () => {
      ElMessage.error('读取文件失败')
      uploading.value = false
    }
    
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传失败: ' + error.message)
    uploading.value = false
  }
  
  // 清空input的值，这样可以重复上传同一个文件
  event.target.value = ''
}

// 简单的图片压缩
const compressImage = (dataURL, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // 设置合适的尺寸
      const maxSize = 400
      let { width, height } = img
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataURL
  })
}

const saveAvatarToStorage = async (avatarData) => {
  try {
    // 验证头像数据
    if (!avatarData || !avatarData.startsWith('data:image/')) {
      throw new Error('头像数据格式无效')
    }
    
    // 检查数据大小
    const dataSizeKB = avatarData.length / 1024
    if (dataSizeKB > 2000) { // 2MB限制
      throw new Error('头像文件过大，请选择小于2MB的图片')
    }
    
    // 获取当前用户数据
    const savedUser = JSON.parse(localStorage.getItem('user_data') || '{}')
    if (!savedUser.id) {
      throw new Error('用户信息不完整，请重新登录')
    }
    
    // 更新 all_users 中的头像数据
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    const userIndex = allUsers.findIndex(u => String(u.id) === String(savedUser.id))
    
    if (userIndex === -1) {
      throw new Error('在用户列表中未找到当前用户')
    }
    
    // 更新头像数据
    allUsers[userIndex].avatar = avatarData
    localStorage.setItem('all_users', JSON.stringify(allUsers))
    
    // 更新当前用户数据
    const updatedUser = { ...savedUser, avatar: avatarData }
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
    
    // 立即更新显示
    userInfo.avatar = avatarData
    
    // 刷新用户store中的数据，确保其他页面同步
    userStore.refreshCurrentUser()
    
    // 触发存储事件通知其他页面
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user_data',
      newValue: JSON.stringify(updatedUser),
      url: window.location.href
    }))
    
  } catch (error) {
    console.error('保存头像失败:', error)
    
    if (error.name === 'QuotaExceededError') {
      ElMessage.error('浏览器存储空间不足，请清理数据后重试')
    } else {
      ElMessage.error('保存头像失败: ' + error.message)
    }
    
    throw error
  }
}


// 处理头像加载错误
const handleAvatarError = (e) => {
  console.error('头像加载失败:', e)
  avatarError.value = true
  
  // 简单的重试机制
  setTimeout(() => {
    if (userInfo.avatar) {
      avatarError.value = false
      const currentAvatar = userInfo.avatar
      userInfo.avatar = ''
      nextTick(() => {
        userInfo.avatar = currentAvatar
      })
    }
  }, 1000)
}

// 预览头像
const previewAvatar = () => {
  showAvatarPreview.value = true
}


// 删除头像
const removeAvatar = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除当前头像吗？删除后将显示默认头像。',
      '删除头像',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 清空头像数据
    userInfo.avatar = ''
    
    // 从存储中删除头像
    const savedUser = JSON.parse(localStorage.getItem('user_data') || '{}')
    
    if (savedUser.id) {
      // 更新 all_users 中的头像数据
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const userIndex = allUsers.findIndex(u => String(u.id) === String(savedUser.id))
      
      if (userIndex !== -1) {
        delete allUsers[userIndex].avatar
        localStorage.setItem('all_users', JSON.stringify(allUsers))
        
        // 更新当前用户数据
        delete savedUser.avatar
        localStorage.setItem('user_data', JSON.stringify(savedUser))
        
        // 刷新用户store中的数据
        userStore.refreshCurrentUser()
        
        ElMessage.success('头像已删除')
        
        // 关闭预览对话框
        showAvatarPreview.value = false
      }
    }
  } catch {
    // 用户取消删除
  }
}

const handleTwoFactorChange = (value) => {
  if (value) {
    ElMessage.success('两步验证已开启')
  } else {
    ElMessage.info('两步验证已关闭')
  }
}

onMounted(() => {
  // 从 localStorage 加载用户数据
  const savedUser = localStorage.getItem('user_data')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    
    // 从 all_users 中获取最新的用户数据
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    const currentUser = allUsers.find(u => String(u.id) === String(userData.id))
    
    if (currentUser) {
      // 使用 all_users 中的最新数据
      Object.assign(userInfo, {
        username: currentUser.username,
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        realName: currentUser.realName || '',
        birthday: currentUser.birthday || '',
        gender: currentUser.gender || 'male',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || '',
        registerTime: currentUser.registerTime,
        lastLogin: new Date().toLocaleString('zh-CN'),
        totalSpent: '0.00',
        level: currentUser.level || '普通',
        twoFactorEnabled: currentUser.twoFactorEnabled || false,
        emailVerified: currentUser.emailVerified || false
      })
    } else {
      // 备用：使用 user_data 中的数据
      Object.assign(userInfo, {
        username: userData.username,
        email: userData.email || '',
        phone: userData.phone || '',
        realName: userData.realName || '',
        birthday: userData.birthday || '',
        gender: userData.gender || 'male',
        bio: userData.bio || '',
        avatar: userData.avatar || '',
        registerTime: userData.registerTime,
        lastLogin: new Date().toLocaleString('zh-CN'),
        totalSpent: '0.00',
        level: userData.level || '普通',
        twoFactorEnabled: userData.twoFactorEnabled || false,
        emailVerified: userData.emailVerified || false
      })
    }
    
    // 验证头像数据有效性
    if (userInfo.avatar) {
      nextTick(() => {
        // 测试头像是否能正常加载
        const testImg = new Image()
        testImg.onload = () => {
          avatarError.value = false
        }
        testImg.onerror = () => {
          console.warn('头像数据损坏，将清除无效头像')
          avatarError.value = true
          // 如果头像无效，可以选择清除它
          // userInfo.avatar = ''
        }
        testImg.src = userInfo.avatar
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    color: #303133;
    margin: 0;
  }
}

.avatar-section {
  text-align: center;
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    
    .avatar-overlay {
      position: absolute;
      top: 0;
      right: 0;
      
      .remove-avatar-btn {
        background: rgba(245, 108, 108, 0.9);
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        
        &:hover {
          background: #f56c6c;
          transform: scale(1.1);
        }
      }
    }
    
    .avatar-display {
      transition: all 0.3s ease;
      background-color: #f5f5f5;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      // 确保头像图片正确显示
      :deep(.el-avatar__inner) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      
      // 当有src时，确保图片正确加载
      &[src] {
        :deep(.el-avatar__inner) {
          background-image: inherit;
        }
      }
    }
    
    .avatar-hint {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }
  }
  
  .avatar-actions {
    .change-avatar-btn {
      display: block;
      margin-bottom: 16px;
      min-width: 120px;
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      }
    }
    
    .avatar-tips {
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #409eff;
      
      p {
        margin: 4px 0;
        font-size: 12px;
        color: #606266;
        line-height: 1.4;
        
        &:first-child {
          margin-top: 0;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 头像预览对话框样式
.avatar-preview-container {
  text-align: center;
  padding: 20px;
  
  .el-avatar {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border: 4px solid #fff;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-list {
  .stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: #909399;
      font-size: 14px;
    }
    
    .value {
      color: #303133;
      font-weight: 500;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.security-settings {
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .security-info {
      h4 {
        margin: 0 0 4px 0;
        color: #303133;
        font-size: 16px;
      }
      
      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }
}

.mt-20 {
  margin-top: 20px;
}
</style>