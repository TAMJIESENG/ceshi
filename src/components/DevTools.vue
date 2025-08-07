<template>
  <div 
    class="dev-tools" 
    v-if="showDevTools" 
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    :class="{ dragging: isDragging }"
    ref="devToolsRef"
  >
    <el-card class="dev-tools-panel">
      <template #header>
        <div 
          class="dev-tools-header"
          @mousedown="startDrag"
          :class="{ dragging: isDragging }"
        >
          <span>🛠️ 开发工具</span>
          <div class="header-controls">
            <span class="drag-hint">拖动移动</span>
            <el-button size="small" @click="toggleDevTools">
              <el-icon><close /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="dev-tools-content">
        <el-row :gutter="16">
          <el-col :span="8">
            <h4>数据管理</h4>
            <div class="tool-group">
              <el-button size="small" type="primary" @click="showDataStats">
                📊 查看统计
              </el-button>
              <el-button size="small" type="warning" @click="exportData">
                📤 导出数据
              </el-button>
              <el-upload
                :show-file-list="false"
                :before-upload="importData"
                accept=".json"
              >
                <el-button size="small" type="success">
                  📥 导入数据
                </el-button>
              </el-upload>
              <el-button size="small" type="danger" @click="resetData">
                🗑️ 重置数据
              </el-button>
            </div>
          </el-col>
          
          <el-col :span="8">
            <h4>快速操作</h4>
            <div class="tool-group">
              <el-button size="small" @click="generateTestCards">
                🎯 生成测试卡密
              </el-button>
              <el-button size="small" @click="createTestOrder">
                🛒 创建测试订单
              </el-button>
              <el-button size="small" @click="toggleAdminRole">
                👑 切换管理员权限
              </el-button>
            </div>
          </el-col>
          
          <el-col :span="8">
            <h4>测试账号</h4>
            <div class="account-list">
              <div class="account-item">
                <strong>管理员:</strong> admin/admin123
                <el-button size="small" @click="quickLogin('admin', 'admin123')">
                  快速登录
                </el-button>
              </div>
              <div class="account-item">
                <strong>测试用户:</strong> testuser/123456
                <el-button size="small" @click="quickLogin('testuser', '123456')">
                  快速登录
                </el-button>
              </div>
              <div class="account-item">
                <strong>演示用户:</strong> demo/demo123
                <el-button size="small" @click="quickLogin('demo', 'demo123')">
                  快速登录
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
  
  <!-- 悬浮按钮 -->
  <div 
    class="dev-tools-trigger" 
    v-if="!showDevTools" 
    :style="{ left: triggerPosition.x + 'px', top: triggerPosition.y + 'px' }"
    :class="{ dragging: isTriggerDragging }"
    @mousedown="startTriggerDrag"
    @click="handleTriggerClick"
    ref="triggerRef"
  >
    🛠️
  </div>
  
  <!-- 数据统计对话框 -->
  <el-dialog v-model="showStatsDialog" title="数据统计" width="600px">
    <div class="data-stats">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户总数">
          {{ dataStats.users }}
        </el-descriptions-item>
        <el-descriptions-item label="卡密总数">
          {{ dataStats.cards }}
        </el-descriptions-item>
        <el-descriptions-item label="未使用卡密">
          {{ dataStats.unusedCards }}
        </el-descriptions-item>
        <el-descriptions-item label="已使用卡密">
          {{ dataStats.usedCards }}
        </el-descriptions-item>
        <el-descriptions-item label="订单总数">
          {{ dataStats.orders }}
        </el-descriptions-item>
        <el-descriptions-item label="完成订单">
          {{ dataStats.completedOrders }}
        </el-descriptions-item>
      </el-descriptions>
      
      <div class="storage-info">
        <h4>存储信息</h4>
        <p>localStorage 使用: {{ storageUsage }}</p>
        <p>数据大小: {{ dataSize }}</p>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="showStatsDialog = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCardStore } from '@/stores/card'
import { useOrderStore } from '@/stores/order'
import { resetAllData, exportAllData, importData as importDataUtil } from '@/utils/initialize'
import { Close } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const cardStore = useCardStore()
const orderStore = useOrderStore()

const showDevTools = ref(false)
const showStatsDialog = ref(false)
const devToolsRef = ref(null)
const triggerRef = ref(null)

// 面板拖动相关数据
const isDragging = ref(false)
const position = reactive({
  x: 20, // 初始位置
  y: 20
})
const dragStart = reactive({
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0
})

// 悬浮按钮拖动相关数据
const isTriggerDragging = ref(false)
const triggerPosition = reactive({
  x: window.innerWidth - 70, // 右下角初始位置
  y: window.innerHeight - 120
})
const triggerDragStart = reactive({
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0
})
const triggerClickPrevented = ref(false)

const dataStats = reactive({
  users: 0,
  cards: 0,
  unusedCards: 0,
  usedCards: 0,
  orders: 0,
  completedOrders: 0
})

const storageUsage = computed(() => {
  let totalSize = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length
    }
  }
  return `${(totalSize / 1024).toFixed(2)} KB`
})

const dataSize = computed(() => {
  const users = localStorage.getItem('all_users')
  const cards = localStorage.getItem('all_cards')
  const orders = localStorage.getItem('all_orders')
  
  const totalSize = (users?.length || 0) + (cards?.length || 0) + (orders?.length || 0)
  return `${(totalSize / 1024).toFixed(2)} KB`
})

const toggleDevTools = () => {
  showDevTools.value = !showDevTools.value
  if (showDevTools.value) {
    // 恢复保存的位置
    const savedPosition = localStorage.getItem('devtools_position')
    if (savedPosition) {
      const pos = JSON.parse(savedPosition)
      position.x = pos.x
      position.y = pos.y
    }
  }
}

// 拖动处理函数
const startDrag = (e) => {
  isDragging.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.elementX = position.x
  dragStart.elementY = position.y
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

const handleDrag = (e) => {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - dragStart.x
  const deltaY = e.clientY - dragStart.y
  
  let newX = dragStart.elementX + deltaX
  let newY = dragStart.elementY + deltaY
  
  // 确保不拖出屏幕边界
  const maxX = window.innerWidth - 400 // 工具面板宽度约400px
  const maxY = window.innerHeight - 300 // 工具面板高度约300px
  
  newX = Math.max(0, Math.min(newX, maxX))
  newY = Math.max(0, Math.min(newY, maxY))
  
  position.x = newX
  position.y = newY
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  // 保存位置到localStorage
  localStorage.setItem('devtools_position', JSON.stringify({
    x: position.x,
    y: position.y
  }))
}

// 悬浮按钮拖动处理函数
const startTriggerDrag = (e) => {
  isTriggerDragging.value = true
  triggerClickPrevented.value = false
  
  triggerDragStart.x = e.clientX
  triggerDragStart.y = e.clientY
  triggerDragStart.elementX = triggerPosition.x
  triggerDragStart.elementY = triggerPosition.y
  
  document.addEventListener('mousemove', handleTriggerDrag)
  document.addEventListener('mouseup', stopTriggerDrag)
  e.preventDefault()
  e.stopPropagation()
}

const handleTriggerDrag = (e) => {
  if (!isTriggerDragging.value) return
  
  triggerClickPrevented.value = true // 标记已拖动，阻止点击
  
  const deltaX = e.clientX - triggerDragStart.x
  const deltaY = e.clientY - triggerDragStart.y
  
  let newX = triggerDragStart.elementX + deltaX
  let newY = triggerDragStart.elementY + deltaY
  
  // 确保不拖出屏幕边界
  const triggerSize = 50
  const maxX = window.innerWidth - triggerSize
  const maxY = window.innerHeight - triggerSize
  
  newX = Math.max(0, Math.min(newX, maxX))
  newY = Math.max(0, Math.min(newY, maxY))
  
  triggerPosition.x = newX
  triggerPosition.y = newY
}

const stopTriggerDrag = () => {
  isTriggerDragging.value = false
  document.removeEventListener('mousemove', handleTriggerDrag)
  document.removeEventListener('mouseup', stopTriggerDrag)
  
  // 保存悬浮按钮位置到localStorage
  localStorage.setItem('devtools_trigger_position', JSON.stringify({
    x: triggerPosition.x,
    y: triggerPosition.y
  }))
  
  // 延迟重置点击阻止标志，避免拖动结束时触发点击
  setTimeout(() => {
    triggerClickPrevented.value = false
  }, 100)
}

const handleTriggerClick = (e) => {
  // 如果刚刚拖动过，阻止点击事件
  if (triggerClickPrevented.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  
  toggleDevTools()
}

const showDataStats = () => {
  const users = JSON.parse(localStorage.getItem('all_users') || '[]')
  const cards = JSON.parse(localStorage.getItem('all_cards') || '[]')
  const orders = JSON.parse(localStorage.getItem('all_orders') || '[]')
  
  dataStats.users = users.length
  dataStats.cards = cards.length
  dataStats.unusedCards = cards.filter(c => c.status === 'unused').length
  dataStats.usedCards = cards.filter(c => c.status === 'used').length
  dataStats.orders = orders.length
  dataStats.completedOrders = orders.filter(o => o.status === 'completed').length
  
  showStatsDialog.value = true
}

const exportData = () => {
  exportAllData()
  ElMessage.success('数据导出成功')
}

const importData = async (file) => {
  try {
    const message = await importDataUtil(file)
    ElMessage.success(message)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    ElMessage.error(error)
  }
  return false // 阻止上传
}

const resetData = () => {
  resetAllData()
}

const generateTestCards = async () => {
  const result = await cardStore.generateCards({
    type: 'monthly',
    quantity: 5,
    value: '29.90'
  })
  
  if (result.success) {
    ElMessage.success('测试卡密生成成功')
  } else {
    ElMessage.error(result.message)
  }
}

const createTestOrder = async () => {
  const result = await orderStore.createOrder({
    cardType: 'monthly',
    quantity: 1,
    paymentMethod: 'balance'
  })
  
  if (result.success) {
    ElMessage.success('测试订单创建成功')
  } else {
    ElMessage.error(result.message)
  }
}

const toggleAdminRole = () => {
  const currentUser = userStore.user
  if (!currentUser) {
    ElMessage.error('请先登录')
    return
  }
  
  const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
  const userIndex = allUsers.findIndex(u => u.id === currentUser.id)
  
  if (userIndex !== -1) {
    const newRole = allUsers[userIndex].role === 'admin' ? 'user' : 'admin'
    allUsers[userIndex].role = newRole
    localStorage.setItem('all_users', JSON.stringify(allUsers))
    
    // 更新当前用户数据
    const updatedUser = { ...currentUser, role: newRole }
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
    
    ElMessage.success(`权限已切换为: ${newRole === 'admin' ? '管理员' : '普通用户'}`)
    
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

const quickLogin = async (username, password) => {
  try {
    const result = await userStore.login({ username, password })
    
    if (result.success) {
      ElMessage.success(`已登录: ${username}`)
      showDevTools.value = false
      router.push('/dashboard')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('登录失败')
  }
}

// 生命周期钩子
onMounted(() => {
  // 加载保存的面板位置
  const savedPosition = localStorage.getItem('devtools_position')
  if (savedPosition) {
    const pos = JSON.parse(savedPosition)
    position.x = pos.x
    position.y = pos.y
  }
  
  // 加载保存的悬浮按钮位置
  const savedTriggerPosition = localStorage.getItem('devtools_trigger_position')
  if (savedTriggerPosition) {
    const pos = JSON.parse(savedTriggerPosition)
    triggerPosition.x = pos.x
    triggerPosition.y = pos.y
  } else {
    // 如果没有保存的位置，使用默认的右下角位置
    triggerPosition.x = window.innerWidth - 70
    triggerPosition.y = window.innerHeight - 120
  }
})

onUnmounted(() => {
  // 清理事件监听器
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', handleTriggerDrag)
  document.removeEventListener('mouseup', stopTriggerDrag)
})

// 开发环境下自动显示
if (import.meta.env.DEV) {
  // 可以根据需要自动显示
}
</script>

<style lang="scss" scoped>
.dev-tools {
  position: fixed;
  z-index: 9999;
  max-width: 800px;
  min-width: 400px;
  transition: box-shadow 0.3s ease;
  
  .dev-tools-panel {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 2px solid #409eff;
    transition: box-shadow 0.3s ease;
  }
  
  &.dragging .dev-tools-panel {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
    transform: scale(1.02);
  }
  
  .dev-tools-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
    padding: 8px 16px;
    background: linear-gradient(135deg, #409eff, #67c23a);
    color: white;
    border-radius: 4px 4px 0 0;
    position: relative;
    
    &.dragging {
      cursor: grabbing;
      background: linear-gradient(135deg, #337ecc, #529b2e);
    }
    
    &:hover {
      background: linear-gradient(135deg, #337ecc, #529b2e);
    }
    
    span {
      font-weight: bold;
      color: white;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .drag-hint {
      font-size: 12px;
      opacity: 0.8;
      color: white;
    }
  }
  
  .dev-tools-content {
    h4 {
      margin-bottom: 12px;
      color: #303133;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 4px;
    }
    
    .tool-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .el-button {
        justify-content: flex-start;
      }
    }
    
    .account-list {
      .account-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 4px;
        font-size: 12px;
        
        strong {
          color: #409eff;
        }
      }
    }
  }
}

.dev-tools-trigger {
  position: fixed;
  width: 50px;
  height: 50px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  font-size: 20px;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  z-index: 9998;
  transition: all 0.3s ease;
  user-select: none;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
    background: #337ecc;
  }
  
  &.dragging {
    cursor: grabbing;
    transform: scale(1.15);
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.5);
    background: #337ecc;
    z-index: 9999;
  }
  
  &:active {
    cursor: grabbing;
  }
}

.data-stats {
  .storage-info {
    margin-top: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      margin-bottom: 12px;
      color: #303133;
    }
    
    p {
      margin: 4px 0;
      color: #606266;
    }
  }
}

@media (max-width: 768px) {
  .dev-tools {
    min-width: 280px;
    max-width: calc(100vw - 20px);
    
    .dev-tools-header {
      .drag-hint {
        display: none; // 手机端隐藏拖动提示
      }
    }
  }
  
  .dev-tools-trigger {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>