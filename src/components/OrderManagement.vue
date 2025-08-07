<template>
  <div class="order-management">
    <!-- 订单统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#409eff"><shopping-cart /></el-icon>
            <div class="stats-content">
              <h3>{{ orderStats.totalOrders }}</h3>
              <p>总订单数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#E6A23C"><clock /></el-icon>
            <div class="stats-content">
              <h3>{{ orderStats.pendingOrders }}</h3>
              <p>待支付</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#67C23A"><circle-check /></el-icon>
            <div class="stats-content">
              <h3>{{ orderStats.completedOrders }}</h3>
              <p>已完成</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon" color="#F56C6C"><wallet /></el-icon>
            <div class="stats-content">
              <h3>¥{{ orderStats.totalAmount.toFixed(2) }}</h3>
              <p>总收入</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 订单列表 -->
    <el-card class="order-list-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-actions">
            <el-button type="success" @click="exportOrders">
              <el-icon><download /></el-icon>
              导出订单
            </el-button>
            <el-button v-if="isAdmin" type="primary" @click="showCreateDialog = true">
              <el-icon><plus /></el-icon>
              创建订单
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <div class="filter-bar">
        <el-form :model="filterForm" inline>
          <el-form-item label="订单状态">
            <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
              <el-option label="待支付" value="pending" />
              <el-option label="已支付" value="paid" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="卡密类型">
            <el-select v-model="filterForm.cardType" placeholder="全部类型" clearable>
              <el-option label="月卡" value="monthly" />
              <el-option label="季卡" value="quarterly" />
              <el-option label="年卡" value="yearly" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="订单号">
            <el-input 
              v-model="filterForm.orderNumber" 
              placeholder="请输入订单号"
              clearable
            />
          </el-form-item>
          
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleFilter">
              <el-icon><search /></el-icon>
              筛选
            </el-button>
            <el-button @click="resetFilter">
              <el-icon><refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 订单表格 -->
      <el-table 
        :data="filteredOrders" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="orderNumber" label="订单号" width="180" />
        
        <el-table-column v-if="isAdmin" prop="username" label="用户" width="120" />
        
        <el-table-column prop="cardType" label="卡密类型" width="100">
          <template #default="scope">
            <el-tag :type="getCardTypeTagType(scope.row.cardType)">
              {{ getCardTypeName(scope.row.cardType) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="quantity" label="数量" width="80" />
        
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">
            <span class="amount-text">¥{{ scope.row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="paymentMethod" label="支付方式" width="120">
          <template #default="scope">
            {{ getPaymentMethodName(scope.row.paymentMethod) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ getOrderStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="160" />
        
        <el-table-column v-if="isAdmin" prop="paymentTime" label="支付时间" width="160">
          <template #default="scope">
            {{ scope.row.paymentTime || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'pending'"
              type="primary" 
              size="small"
              @click="payOrder(scope.row)"
            >
              支付
            </el-button>
            
            <el-button 
              v-if="scope.row.status === 'pending'"
              type="danger" 
              size="small"
              @click="cancelOrder(scope.row)"
            >
              取消
            </el-button>
            
            <el-button 
              type="info" 
              size="small"
              @click="viewOrderDetail(scope.row)"
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
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    
    <!-- 创建订单对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建订单" width="500px">
      <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="100px">
        <el-form-item label="卡密类型" prop="cardType">
          <el-select v-model="createForm.cardType" placeholder="请选择卡密类型" class="full-width">
            <el-option label="月卡 - ¥29.90" value="monthly" />
            <el-option label="季卡 - ¥79.90" value="quarterly" />
            <el-option label="年卡 - ¥299.90" value="yearly" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="购买数量" prop="quantity">
          <el-input-number 
            v-model="createForm.quantity" 
            :min="1" 
            :max="100" 
            class="full-width"
          />
        </el-form-item>
        
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-radio-group v-model="createForm.paymentMethod">
            <el-radio label="balance">余额支付</el-radio>
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <div class="order-summary">
            <div class="summary-item">
              <span>商品总价：</span>
              <span class="price">¥{{ calculateOrderTotal() }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrder" :loading="createLoading">
          创建订单
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 支付对话框 -->
    <el-dialog v-model="showPayDialog" title="订单支付" width="400px">
      <div class="payment-info">
        <h4>订单信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">
            {{ currentOrder?.orderNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="商品">
            {{ getCardTypeName(currentOrder?.cardType) }} × {{ currentOrder?.quantity }}
          </el-descriptions-item>
          <el-descriptions-item label="应付金额">
            <span class="amount-text">¥{{ currentOrder?.totalAmount.toFixed(2) }}</span>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="payment-methods">
          <h4>选择支付方式</h4>
          <el-radio-group v-model="paymentForm.method">
            <el-radio label="balance">
              <el-icon><wallet /></el-icon>
              余额支付
            </el-radio>
            <el-radio label="alipay">
              <el-icon><money /></el-icon>
              支付宝
            </el-radio>
            <el-radio label="wechat">
              <el-icon><money /></el-icon>
              微信支付
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showPayDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePayment" :loading="payLoading">
          确认支付
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 订单详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="订单详情" width="600px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号" :span="2">
            {{ currentOrder.orderNumber }}
          </el-descriptions-item>
          
          <el-descriptions-item label="卡密类型">
            <el-tag :type="getCardTypeTagType(currentOrder.cardType)">
              {{ getCardTypeName(currentOrder.cardType) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="购买数量">
            {{ currentOrder.quantity }}
          </el-descriptions-item>
          
          <el-descriptions-item label="单价">
            ¥{{ currentOrder.unitPrice.toFixed(2) }}
          </el-descriptions-item>
          
          <el-descriptions-item label="总金额">
            <span class="amount-text">¥{{ currentOrder.totalAmount.toFixed(2) }}</span>
          </el-descriptions-item>
          
          <el-descriptions-item label="支付方式">
            {{ getPaymentMethodName(currentOrder.paymentMethod) }}
          </el-descriptions-item>
          
          <el-descriptions-item label="订单状态">
            <el-tag :type="getOrderStatusType(currentOrder.status)">
              {{ getOrderStatusText(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="创建时间">
            {{ currentOrder.createTime }}
          </el-descriptions-item>
          
          <el-descriptions-item label="支付时间">
            {{ currentOrder.paymentTime || '-' }}
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
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { 
  ShoppingCart, Clock, CircleCheck, Wallet, Plus, Download,
  Search, Refresh, Money
} from '@element-plus/icons-vue'

const orderStore = useOrderStore()
const userStore = useUserStore()

const loading = ref(false)
const createLoading = ref(false)
const payLoading = ref(false)
const showCreateDialog = ref(false)
const showPayDialog = ref(false)
const showDetailDialog = ref(false)
const createFormRef = ref()
const currentOrder = ref(null)

const filterForm = reactive({
  status: '',
  cardType: '',
  orderNumber: '',
  dateRange: null
})

const createForm = reactive({
  cardType: '',
  quantity: 1,
  paymentMethod: 'balance'
})

const paymentForm = reactive({
  method: 'balance'
})

const createRules = {
  cardType: [
    { required: true, message: '请选择卡密类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入购买数量', trigger: 'blur' }
  ],
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

const orders = computed(() => orderStore.orders)
const pagination = computed(() => orderStore.pagination)
const isAdmin = computed(() => userStore.isAdmin)

const orderStats = computed(() => {
  return orderStore.calculateOrderStats()
})

const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (filterForm.status) {
    filtered = filtered.filter(order => order.status === filterForm.status)
  }
  
  if (filterForm.cardType) {
    filtered = filtered.filter(order => order.cardType === filterForm.cardType)
  }
  
  if (filterForm.orderNumber) {
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(filterForm.orderNumber.toLowerCase())
    )
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.dateRange
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createTime).toISOString().split('T')[0]
      return orderDate >= startDate && orderDate <= endDate
    })
  }
  
  return filtered
})

const getOrderStatusType = (status) => {
  return orderStore.getOrderStatusType(status)
}

const getOrderStatusText = (status) => {
  return orderStore.getOrderStatusText(status)
}

const getCardTypeName = (type) => {
  return orderStore.getCardTypeName(type)
}

const getPaymentMethodName = (method) => {
  return orderStore.getPaymentMethodName(method)
}

const getCardTypeTagType = (type) => {
  const typeMap = {
    monthly: 'success',
    quarterly: 'warning',
    yearly: 'danger'
  }
  return typeMap[type] || 'info'
}

const calculateOrderTotal = () => {
  const priceMap = {
    monthly: 29.90,
    quarterly: 79.90,
    yearly: 299.90
  }
  
  if (createForm.cardType && createForm.quantity) {
    return (priceMap[createForm.cardType] * createForm.quantity).toFixed(2)
  }
  
  return '0.00'
}

const handleFilter = () => {
  ElMessage.success('筛选功能开发中...')
}

const resetFilter = () => {
  filterForm.status = ''
  filterForm.cardType = ''
  filterForm.orderNumber = ''
  filterForm.dateRange = null
}

const handleCreateOrder = async () => {
  if (!createFormRef.value) return
  
  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      createLoading.value = true
      
      try {
        const result = await orderStore.createOrder(createForm)
        
        if (result.success) {
          ElMessage.success(result.message)
          showCreateDialog.value = false
          resetCreateForm()
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        createLoading.value = false
      }
    }
  })
}

const payOrder = (order) => {
  currentOrder.value = order
  paymentForm.method = order.paymentMethod || 'balance'
  showPayDialog.value = true
}

const handlePayment = async () => {
  payLoading.value = true
  
  try {
    const result = await orderStore.payOrder(currentOrder.value.id, {
      paymentMethod: paymentForm.method
    })
    
    if (result.success) {
      ElMessage.success(result.message)
      showPayDialog.value = false
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    payLoading.value = false
  }
}

const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确认取消订单 ${order.orderNumber}？`,
      '确认取消',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await orderStore.cancelOrder(order.id)
    
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    
  }
}

const viewOrderDetail = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

const exportOrders = () => {
  orderStore.exportOrders(filteredOrders.value)
  ElMessage.success('导出成功')
}

const resetCreateForm = () => {
  createForm.cardType = ''
  createForm.quantity = 1
  createForm.paymentMethod = 'balance'
}

const handleSizeChange = (val) => {
  pagination.value.pageSize = val
}

const handleCurrentChange = (val) => {
  pagination.value.currentPage = val
}

onMounted(() => {
  orderStore.fetchOrders()
})
</script>

<style lang="scss" scoped>
.order-management {
  .stats-row {
    margin-bottom: 20px;
    
    .stats-card {
      .stats-item {
        display: flex;
        align-items: center;
        
        .stats-icon {
          font-size: 32px;
          margin-right: 16px;
        }
        
        .stats-content {
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
  
  .order-list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        .el-button {
          margin-left: 8px;
        }
      }
    }
    
    .filter-bar {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .amount-text {
      font-weight: bold;
      color: #E6A23C;
    }
    
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
  
  .order-summary {
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
      
      .price {
        font-weight: bold;
        color: #E6A23C;
        font-size: 16px;
      }
    }
  }
  
  .payment-info {
    .payment-methods {
      margin-top: 24px;
      
      h4 {
        margin-bottom: 16px;
        color: #303133;
      }
      
      .el-radio {
        display: block;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .order-detail {
    .amount-text {
      font-weight: bold;
      color: #E6A23C;
      font-size: 16px;
    }
  }
}

.full-width {
  width: 100%;
}
</style>