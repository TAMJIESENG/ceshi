<template>
  <div class="balance-recharge">
    <!-- 当前余额显示 -->
    <el-card class="balance-card">
      <div class="balance-info">
        <div class="current-balance">
          <el-icon class="balance-icon"><Wallet /></el-icon>
          <div class="balance-content">
            <h3>当前余额</h3>
            <div class="balance-amount">¥{{ (userStore.user?.balance || 0).toFixed(2) }}</div>
          </div>
        </div>
        <div class="recharge-buttons">
          <el-button 
            type="primary" 
            @click="showRechargeDialog = true"
            :disabled="!hasAvailablePaymentMethods"
          >
            <el-icon><Plus /></el-icon>
            在线充值
          </el-button>
          <el-button type="success" @click="showWechatDialog = true">
            <el-icon><ChatDotRound /></el-icon>
            微信充值
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 充值记录 -->
    <el-card class="recharge-history-card">
      <template #header>
        <div class="card-header">
          <span>充值记录</span>
          <el-button size="small" @click="refreshHistory">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table :data="rechargeHistory" style="width: 100%" v-loading="historyLoading">
        <el-table-column prop="orderNumber" label="充值订单号" width="180" />
        
        <el-table-column prop="amount" label="充值金额" width="120">
          <template #default="scope">
            <span class="amount-text">+¥{{ scope.row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="paymentMethod" label="支付方式" width="120">
          <template #default="scope">
            <el-tag :type="getPaymentMethodType(scope.row.paymentMethod)">
              {{ getPaymentMethodName(scope.row.paymentMethod) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="160" />
        
        <el-table-column prop="completeTime" label="完成时间" width="160">
          <template #default="scope">
            {{ scope.row.completeTime || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'pending'"
              type="primary" 
              size="small"
              @click="processRecharge(scope.row)"
            >
              完成支付
            </el-button>
            
            <el-button 
              v-if="scope.row.status === 'pending'"
              type="danger" 
              size="small"
              @click="cancelRecharge(scope.row)"
            >
              取消
            </el-button>
            
            <el-button 
              type="info" 
              size="small"
              @click="viewRechargeDetail(scope.row)"
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

    <!-- 充值对话框 -->
    <el-dialog v-model="showRechargeDialog" title="账户充值" width="500px">
      <el-form :model="rechargeForm" :rules="rechargeRules" ref="rechargeFormRef" label-width="100px">
        <el-form-item label="充值金额" prop="amount">
          <el-input 
            v-model="rechargeForm.amount" 
            placeholder="请输入充值金额"
            type="number"
            min="0.01"
            step="0.01"
          >
            <template #prepend>¥</template>
          </el-input>
          <div class="quick-amount">
            <span>快速选择：</span>
            <el-button 
              v-for="amount in quickAmounts" 
              :key="amount"
              size="small" 
              @click="rechargeForm.amount = amount"
            >
              ¥{{ amount }}
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-radio-group v-model="rechargeForm.paymentMethod">
            <el-radio v-if="availablePaymentMethods.alipay" label="alipay">
              <el-icon><Money /></el-icon>
              支付宝
            </el-radio>
            <el-radio v-if="availablePaymentMethods.wechat" label="wechat">
              <el-icon><Money /></el-icon>
              微信支付
            </el-radio>
            <el-radio v-if="availablePaymentMethods.bankTransfer" label="bank">
              <el-icon><CreditCard /></el-icon>
              银行转账
            </el-radio>
            <el-radio v-if="availablePaymentMethods.paypal" label="paypal">
              <el-icon><Money /></el-icon>
              PayPal
            </el-radio>
          </el-radio-group>
          
          <!-- 无可用支付方式时的提示 -->
          <div v-if="!hasAvailablePaymentMethods" class="no-payment-methods">
            <el-alert
              title="暂无可用支付方式"
              type="warning"
              :closable="false"
            >
              管理员尚未启用任何在线支付方式，请使用其他充值方式或联系客服。
            </el-alert>
          </div>
        </el-form-item>
        
        <el-form-item>
          <div class="recharge-summary">
            <div class="summary-item">
              <span>充值金额：</span>
              <span class="amount">¥{{ parseFloat(rechargeForm.amount || 0).toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>到账金额：</span>
              <span class="amount final-amount">¥{{ parseFloat(rechargeForm.amount || 0).toFixed(2) }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showRechargeDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleRecharge" 
          :loading="rechargeLoading"
          :disabled="!hasAvailablePaymentMethods"
        >
          确认充值
        </el-button>
      </template>
    </el-dialog>

    <!-- 充值详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="充值详情" width="500px">
      <div v-if="currentRecharge" class="recharge-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="充值订单号">
            {{ currentRecharge.orderNumber }}
          </el-descriptions-item>
          
          <el-descriptions-item label="充值金额">
            <span class="amount-text">¥{{ currentRecharge.amount.toFixed(2) }}</span>
          </el-descriptions-item>
          
          <el-descriptions-item label="支付方式">
            <el-tag :type="getPaymentMethodType(currentRecharge.paymentMethod)">
              {{ getPaymentMethodName(currentRecharge.paymentMethod) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentRecharge.status)">
              {{ getStatusText(currentRecharge.status) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="创建时间">
            {{ currentRecharge.createTime }}
          </el-descriptions-item>
          
          <el-descriptions-item label="完成时间">
            {{ currentRecharge.completeTime || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="showDetailDialog = false">
          关闭
        </el-button>
      </template>
    </el-dialog>

    <!-- 支付确认对话框 -->
    <el-dialog v-model="showPaymentDialog" title="支付确认" width="400px">
      <div v-if="currentRecharge" class="payment-confirmation">
        <div class="payment-info">
          <h4>请确认支付信息</h4>
          <div class="info-item">
            <span>充值金额：</span>
            <span class="amount">¥{{ currentRecharge.amount.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span>支付方式：</span>
            <span>{{ getPaymentMethodName(currentRecharge.paymentMethod) }}</span>
          </div>
        </div>
        
        <div class="payment-notice">
          <el-alert
            title="支付说明"
            type="info"
            :closable="false"
          >
            <p>这是演示系统，点击"确认支付"将直接完成充值。</p>
            <p>实际系统中会跳转到第三方支付平台。</p>
          </el-alert>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showPaymentDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmPayment" :loading="paymentLoading">
          确认支付
        </el-button>
      </template>
    </el-dialog>

    <!-- 微信客服充值对话框 -->
    <el-dialog v-model="showWechatDialog" title="微信客服充值" width="500px">
      <div class="wechat-recharge">
        <div class="wechat-info">
          <div class="wechat-header">
            <el-icon class="wechat-icon" color="#07C160"><ChatDotRound /></el-icon>
            <h3>添加客服微信进行充值</h3>
          </div>
          
          <div class="wechat-details">
            <el-card class="wechat-card">
              <div class="wechat-id-section">
                <div class="wechat-id">
                  <span class="label">客服微信号：</span>
                  <span class="wechat-number">AQ0007N</span>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="copyWechatId"
                    class="copy-btn"
                  >
                    <el-icon><CopyDocument /></el-icon>
                    复制
                  </el-button>
                </div>
                
                <div class="wechat-qr">
                  <div class="qr-code">
                    <img 
                      src="/weixin/b89592612409de7b5878f9f32fdee8a4.jpg" 
                      alt="客服微信二维码"
                      class="qr-image"
                      @error="handleImageError"
                      @dblclick="showImagePreview = true"
                      title="双击放大查看"
                    />
                    <p>扫码添加客服微信</p>
                    <small>微信号：AQ0007N</small>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          
          <div class="recharge-steps">
            <h4>充值步骤：</h4>
            <el-steps direction="vertical" :active="4">
              <el-step title="复制微信号" description="点击上方按钮复制客服微信号：AQ0007N" />
              <el-step title="添加客服" description="在微信中搜索并添加客服微信" />
              <el-step title="发送充值信息" description="告知客服您的用户名和充值金额" />
              <el-step title="完成转账" description="按客服指引完成微信转账" />
              <el-step title="等待到账" description="客服确认后将为您充值到账" />
            </el-steps>
          </div>
          
          <div class="recharge-notice">
            <el-alert
              title="充值说明"
              type="warning"
              :closable="false"
            >
              <ul>
                <li>添加客服微信时请备注"充值"</li>
                <li>请提供正确的用户名：<strong>{{ userStore.user?.username }}</strong></li>
                <li>转账时请备注充值金额，便于客服快速处理</li>
                <li>微信充值通常在1-10分钟内到账</li>
                <li>如有疑问请联系客服咨询</li>
              </ul>
            </el-alert>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="wechat-footer">
          <el-button @click="showWechatDialog = false">关闭</el-button>
          <el-button type="success" @click="copyWechatId">
            <el-icon><CopyDocument /></el-icon>
            复制微信号
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog 
      v-model="showImagePreview" 
      title="微信二维码" 
      width="90%" 
      :show-close="true"
      center
    >
      <div class="image-preview">
        <img 
          src="/weixin/b89592612409de7b5878f9f32fdee8a4.jpg" 
          alt="客服微信二维码 - 放大版"
          class="preview-image"
        />
        
        <div class="preview-info">
          <p><strong>客服微信号：AQ0007N</strong></p>
          <p>扫描二维码或搜索微信号添加客服</p>
          <el-button type="success" @click="copyWechatId" class="copy-in-preview">
            <el-icon><CopyDocument /></el-icon>
            复制微信号
          </el-button>
        </div>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="showImagePreview = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { 
  Wallet, Plus, Refresh, Money, CreditCard, ChatDotRound, 
  CopyDocument, Position
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 支付设置
 const availablePaymentMethods = ref({
  alipay: false,
  wechat: false,
  bankTransfer: false,
  paypal: false
})

// 计算是否有可用支付方式
const hasAvailablePaymentMethods = computed(() => {
  return Object.values(availablePaymentMethods.value).some(enabled => enabled)
})

const showRechargeDialog = ref(false)
const showDetailDialog = ref(false)
const showPaymentDialog = ref(false)
const showWechatDialog = ref(false)
const showImagePreview = ref(false)
const rechargeLoading = ref(false)
const paymentLoading = ref(false)
const historyLoading = ref(false)
const rechargeFormRef = ref()
const currentRecharge = ref(null)

const rechargeHistory = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const rechargeForm = reactive({
  amount: '',
  paymentMethod: 'alipay'
})

const quickAmounts = [10, 50, 100, 200, 500, 1000]

const rechargeRules = {
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        const amount = parseFloat(value)
        if (isNaN(amount) || amount <= 0) {
          callback(new Error('充值金额必须大于0'))
        } else if (amount < 0.01) {
          callback(new Error('最小充值金额为0.01元'))
        } else if (amount > 50000) {
          callback(new Error('单次充值金额不能超过50000元'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

const generateRechargeOrder = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6)
  return `RCH${year}${month}${day}${timestamp}`
}

const handleRecharge = async () => {
  if (!rechargeFormRef.value) return
  
  await rechargeFormRef.value.validate(async (valid) => {
    if (valid) {
      rechargeLoading.value = true
      
      try {
        const amount = parseFloat(rechargeForm.amount)
        const orderNumber = generateRechargeOrder()
        
        const rechargeRecord = {
          id: Date.now(),
          orderNumber,
          userId: userStore.user.id,
          username: userStore.user.username,
          amount,
          paymentMethod: rechargeForm.paymentMethod,
          status: 'pending',
          createTime: new Date().toLocaleString('zh-CN'),
          completeTime: null
        }
        
        // 保存充值记录
        const allRecharges = JSON.parse(localStorage.getItem('all_recharges') || '[]')
        allRecharges.unshift(rechargeRecord)
        localStorage.setItem('all_recharges', JSON.stringify(allRecharges))
        
        // 更新本地数据
        rechargeHistory.value.unshift(rechargeRecord)
        pagination.total++
        
        ElMessage.success('充值订单创建成功')
        showRechargeDialog.value = false
        
        // 重置表单
        resetRechargeForm()
        
        // 自动跳转到支付确认
        currentRecharge.value = rechargeRecord
        showPaymentDialog.value = true
        
      } finally {
        rechargeLoading.value = false
      }
    }
  })
}

const processRecharge = (recharge) => {
  currentRecharge.value = recharge
  showPaymentDialog.value = true
}

const confirmPayment = async () => {
  paymentLoading.value = true
  
  try {
    // 模拟支付处理时间
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const rechargeId = currentRecharge.value.id
    const amount = currentRecharge.value.amount
    
    // 更新充值记录状态
    const allRecharges = JSON.parse(localStorage.getItem('all_recharges') || '[]')
    const rechargeIndex = allRecharges.findIndex(r => r.id === rechargeId)
    
    if (rechargeIndex !== -1) {
      allRecharges[rechargeIndex].status = 'completed'
      allRecharges[rechargeIndex].completeTime = new Date().toLocaleString('zh-CN')
      localStorage.setItem('all_recharges', JSON.stringify(allRecharges))
      
      // 更新本地显示
      const localIndex = rechargeHistory.value.findIndex(r => r.id === rechargeId)
      if (localIndex !== -1) {
        rechargeHistory.value[localIndex].status = 'completed'
        rechargeHistory.value[localIndex].completeTime = allRecharges[rechargeIndex].completeTime
      }
    }
    
    // 更新用户余额
    const result = await userStore.updateUserBalance(
      userStore.user.id,
      (userStore.user.balance || 0) + amount,
      `充值到账：${currentRecharge.value.orderNumber}`
    )
    
    if (result.success) {
      ElMessage.success(`充值成功！余额已增加 ¥${amount.toFixed(2)}`)
      showPaymentDialog.value = false
      
      // 刷新用户数据
      await userStore.refreshCurrentUser()
    } else {
      ElMessage.error('余额更新失败')
    }
    
  } finally {
    paymentLoading.value = false
  }
}

const cancelRecharge = async (recharge) => {
  try {
    await ElMessageBox.confirm(
      `确认取消充值订单 ${recharge.orderNumber}？`,
      '确认取消',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 更新充值记录状态
    const allRecharges = JSON.parse(localStorage.getItem('all_recharges') || '[]')
    const rechargeIndex = allRecharges.findIndex(r => r.id === recharge.id)
    
    if (rechargeIndex !== -1) {
      allRecharges[rechargeIndex].status = 'cancelled'
      allRecharges[rechargeIndex].completeTime = new Date().toLocaleString('zh-CN')
      localStorage.setItem('all_recharges', JSON.stringify(allRecharges))
      
      // 更新本地显示
      const localIndex = rechargeHistory.value.findIndex(r => r.id === recharge.id)
      if (localIndex !== -1) {
        rechargeHistory.value[localIndex].status = 'cancelled'
        rechargeHistory.value[localIndex].completeTime = allRecharges[rechargeIndex].completeTime
      }
    }
    
    ElMessage.success('充值订单已取消')
  } catch {
    // 用户取消操作
  }
}

const viewRechargeDetail = (recharge) => {
  currentRecharge.value = recharge
  showDetailDialog.value = true
}

const getPaymentMethodType = (method) => {
  const typeMap = {
    alipay: 'primary',
    wechat: 'success',
    bank: 'warning'
  }
  return typeMap[method] || 'info'
}

const getPaymentMethodName = (method) => {
  const nameMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行转账',
    paypal: 'PayPal'
  }
  return nameMap[method] || method
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger',
    failed: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    pending: '待支付',
    completed: '已完成',
    cancelled: '已取消',
    failed: '支付失败'
  }
  return textMap[status] || '未知'
}

const loadRechargeHistory = () => {
  historyLoading.value = true
  
  try {
    const allRecharges = JSON.parse(localStorage.getItem('all_recharges') || '[]')
    // 过滤当前用户的充值记录
    const userRecharges = allRecharges.filter(r => r.userId === userStore.user?.id)
    
    rechargeHistory.value = userRecharges
    pagination.total = userRecharges.length
  } finally {
    historyLoading.value = false
  }
}

const refreshHistory = () => {
  loadRechargeHistory()
  ElMessage.success('充值记录已刷新')
}

const resetRechargeForm = () => {
  rechargeForm.amount = ''
  // 设置为第一个可用的支付方式
  const firstAvailable = Object.entries(availablePaymentMethods.value)
    .find(([key, enabled]) => enabled)
  rechargeForm.paymentMethod = firstAvailable ? firstAvailable[0] : 'alipay'
}

// 加载支付设置
const loadPaymentSettings = () => {
  try {
    const savedSettings = localStorage.getItem('payment_settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      // 更新可用支付方式
      availablePaymentMethods.value.alipay = settings.alipay?.enabled || false
      availablePaymentMethods.value.wechat = settings.wechat?.enabled || false
      availablePaymentMethods.value.bankTransfer = settings.other?.bankTransfer?.enabled || false
      availablePaymentMethods.value.paypal = settings.other?.paypal?.enabled || false
      
      console.log('💳 已加载支付设置:', availablePaymentMethods.value)
      
      // 检查是否所有支付方式都被禁用
      const hasAnyEnabled = Object.values(availablePaymentMethods.value).some(enabled => enabled)
      if (!hasAnyEnabled) {
        console.warn('⚠️ 所有支付方式都已禁用，充值功能受限')
      }
    } else {
      console.log('⚠️ 未找到支付设置，使用默认配置')
      // 默认启用支付宝，避免完全无法充值
      availablePaymentMethods.value.alipay = true
    }
  } catch (error) {
    console.error('加载支付设置失败:', error)
    ElMessage.warning('加载支付设置失败，可能影响充值功能')
  }
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}

const copyWechatId = async () => {
  const wechatId = 'AQ0007N'
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(wechatId)
      ElMessage.success('微信号已复制到剪贴板')
    } else {
      // 兼容性处理：使用传统方法复制
      const textArea = document.createElement('textarea')
      textArea.value = wechatId
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          ElMessage.success('微信号已复制到剪贴板')
        } else {
          throw new Error('复制失败')
        }
      } catch (err) {
        ElMessage.warning(`请手动复制微信号：${wechatId}`)
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (error) {
    ElMessage.warning(`请手动复制微信号：${wechatId}`)
  }
}

const handleImageError = (event) => {
  // 如果图片加载失败，显示备用内容
  const img = event.target
  const parent = img.parentElement
  
  parent.innerHTML = `
    <div class="qr-fallback">
      <el-icon size="60" color="#909399"><Position /></el-icon>
      <p>二维码加载失败</p>
      <small>请手动搜索微信号：AQ0007N</small>
    </div>
  `
}

// 监听支付设置变化（跨标签页）
const handleStorageChange = (event) => {
  if (event.key === 'payment_settings') {
    console.log('💳 检测到支付设置变更（跨标签页），重新加载...')
    loadPaymentSettings()
    resetRechargeForm()
    ElMessage.info('支付设置已更新')
  }
}

// 监听支付设置变化（同一标签页）
const handlePaymentSettingsUpdate = (event) => {
  console.log('💳 检测到支付设置变更（同标签页），重新加载...', event.detail)
  loadPaymentSettings()
  resetRechargeForm()
  ElMessage.info('支付设置已更新')
}

onMounted(() => {
  if (userStore.user) {
    loadRechargeHistory()
  }
  
  // 加载支付设置
  loadPaymentSettings()
  
  // 设置初始支付方式
  resetRechargeForm()
  
  // 监听localStorage变化（跨标签页）
  window.addEventListener('storage', handleStorageChange)
  
  // 监听自定义事件（同一标签页）
  window.addEventListener('payment-settings-updated', handlePaymentSettingsUpdate)
})

// 组件卸载时清理监听器
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('payment-settings-updated', handlePaymentSettingsUpdate)
})
</script>

<style lang="scss" scoped>
.balance-recharge {
  .balance-card {
    margin-bottom: 20px;
    
    .balance-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .current-balance {
        display: flex;
        align-items: center;
        
        .balance-icon {
          font-size: 48px;
          color: #67C23A;
          margin-right: 20px;
        }
        
        .balance-content {
          h3 {
            margin: 0 0 8px 0;
            color: #303133;
            font-size: 18px;
          }
          
          .balance-amount {
            font-size: 32px;
            font-weight: bold;
            color: #67C23A;
            font-family: 'Courier New', monospace;
          }
        }
      }
    }
  }
  
  .recharge-history-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .amount-text {
      font-weight: bold;
      color: #67C23A;
    }
    
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
  
  .quick-amount {
    margin-top: 8px;
    
    span {
      color: #909399;
      font-size: 12px;
      margin-right: 8px;
    }
    
    .el-button {
      margin-right: 8px;
      margin-bottom: 4px;
    }
  }
  
  .recharge-summary {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .amount {
        font-weight: bold;
        color: #E6A23C;
        
        &.final-amount {
          color: #67C23A;
          font-size: 18px;
        }
      }
    }
  }
  
  .recharge-detail {
    .amount-text {
      font-weight: bold;
      color: #67C23A;
      font-size: 16px;
    }
  }
  
  .payment-confirmation {
    .payment-info {
      margin-bottom: 20px;
      
      h4 {
        margin-bottom: 16px;
        color: #303133;
      }
      
      .info-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .amount {
          font-weight: bold;
          color: #E6A23C;
          font-size: 16px;
        }
      }
    }
    
    .payment-notice {
      .el-alert {
        p {
          margin: 4px 0;
          font-size: 13px;
        }
      }
    }
  }
  
  .recharge-buttons {
    display: flex;
    gap: 12px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .wechat-recharge {
    .wechat-header {
      text-align: center;
      margin-bottom: 24px;
      
      .wechat-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }
      
      h3 {
        margin: 0;
        color: #303133;
        font-size: 18px;
      }
    }
    
    .wechat-details {
      margin-bottom: 24px;
      
      .wechat-card {
        .wechat-id-section {
          .wechat-id {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            
            .label {
              font-size: 16px;
              color: #606266;
              margin-right: 8px;
            }
            
            .wechat-number {
              font-size: 20px;
              font-weight: bold;
              color: #07C160;
              font-family: 'Courier New', monospace;
              margin-right: 12px;
              background: #fff;
              padding: 4px 8px;
              border-radius: 4px;
              border: 2px solid #07C160;
            }
            
            .copy-btn {
              flex-shrink: 0;
            }
          }
          
          .wechat-qr {
            .qr-code {
              text-align: center;
              padding: 20px;
              background: #fff;
              border: 1px solid #e4e7ed;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              
              .qr-image {
                width: 200px;
                height: 200px;
                object-fit: contain;
                border-radius: 8px;
                margin-bottom: 12px;
                border: 2px solid #07C160;
                cursor: pointer;
                transition: transform 0.2s ease;
                
                &:hover {
                  transform: scale(1.05);
                  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
                }
              }
              
              p {
                margin: 8px 0 4px 0;
                color: #303133;
                font-size: 16px;
                font-weight: 500;
              }
              
              small {
                color: #07C160;
                font-size: 14px;
                font-weight: bold;
              }
            }
            
            .qr-fallback {
              text-align: center;
              padding: 40px 20px;
              background: #f5f7fa;
              border: 2px dashed #d3d4d6;
              border-radius: 8px;
              
              p {
                margin: 12px 0 4px 0;
                color: #606266;
                font-size: 16px;
              }
              
              small {
                color: #909399;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    
    .recharge-steps {
      margin-bottom: 24px;
      
      h4 {
        margin-bottom: 16px;
        color: #303133;
        font-size: 16px;
      }
      
      .el-steps {
        max-height: 300px;
        overflow-y: auto;
      }
    }
    
    .recharge-notice {
      .el-alert {
        ul {
          margin: 8px 0 0 0;
          padding-left: 20px;
          
          li {
            margin-bottom: 4px;
            color: #E6A23C;
            font-size: 13px;
            
            strong {
              color: #409eff;
            }
          }
        }
      }
    }
  }
  
  .wechat-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .image-preview {
    text-align: center;
    
    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      margin-bottom: 24px;
      border: 3px solid #07C160;
    }
    
    .preview-info {
      p {
        margin: 8px 0;
        font-size: 16px;
        color: #303133;
        
        strong {
          color: #07C160;
          font-size: 20px;
        }
      }
      
      .copy-in-preview {
        margin-top: 16px;
        padding: 12px 24px;
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .balance-recharge {
    .balance-card {
      .balance-info {
        flex-direction: column;
        text-align: center;
        gap: 16px;
        
        .current-balance {
          .balance-icon {
            font-size: 40px;
            margin-right: 16px;
          }
          
          .balance-content {
            .balance-amount {
              font-size: 28px;
            }
          }
        }
      }
    }
  }
}
</style>