<template>
  <div class="vip-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="header-icon">
              <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
            </svg>
            VIP会员管理
          </h3>
          <el-button 
            type="primary" 
            @click="refreshStats"
            :loading="loading"
          >
            刷新数据
          </el-button>
        </div>
      </template>

      <!-- VIP统计概览 -->
      <div class="stats-section">
        <h4>会员统计</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2M4 18v-6h3v6h2v-7.5c0-1.1.9-2 2-2s2 .9 2 2V18h2v-6h3l-2.54-7.63A1.5 1.5 0 0 0 14.18 3H9.82c-.69 0-1.31.45-1.49 1.1L5.81 12H9v6H4Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ vipStats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon normal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7H3V9C3 13.4 6.6 17 11 17V21H13V17C17.4 17 21 13.4 21 9Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ vipStats.normalUsers }}</div>
              <div class="stat-label">普通用户</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon vip">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 14l5.5-5.5L10 10l4-4L16.5 8.5L18 7l3 3-8.5 8.5L8 14l-3 2z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ vipStats.vipUsers }}</div>
              <div class="stat-label">VIP用户</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon svip">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ vipStats.svipUsers }}</div>
              <div class="stat-label">SVIP用户</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon active">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ vipStats.activeVipUsers }}</div>
              <div class="stat-label">活跃VIP</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">¥{{ vipStats.totalRevenue.toFixed(2) }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIP价格管理 -->
      <div class="pricing-section">
        <h4>VIP价格管理</h4>
        
        <!-- VIP价格设置 -->
        <div class="pricing-group">
          <div class="group-header">
            <h5>VIP会员价格</h5>
            <div class="discount-info">用户购买享受95折优惠</div>
          </div>
          <div class="pricing-grid">
            <div v-for="(pkg, key) in vipPackages.VIP" :key="key" class="pricing-card">
              <div class="package-name">{{ pkg.name }}</div>
              <div class="price-input-group">
                <label>价格：</label>
                <el-input-number
                  v-model="pkg.currentPrice"
                  :min="0"
                  :precision="2"
                  :step="1"
                  size="small"
                  class="price-input"
                />
              </div>
              <div class="package-duration">{{ pkg.duration }}天</div>
              <el-button 
                type="primary" 
                size="small"
                @click="updatePrice('VIP', key, pkg.currentPrice)"
                :loading="loading"
              >
                更新
              </el-button>
            </div>
          </div>
        </div>

        <!-- SVIP价格设置 -->
        <div class="pricing-group">
          <div class="group-header">
            <h5>SVIP超级会员价格</h5>
            <div class="discount-info svip">用户购买享受90折优惠</div>
          </div>
          <div class="pricing-grid">
            <div v-for="(pkg, key) in vipPackages.SVIP" :key="key" class="pricing-card svip">
              <div class="package-name">{{ pkg.name }}</div>
              <div class="price-input-group">
                <label>价格：</label>
                <el-input-number
                  v-model="pkg.currentPrice"
                  :min="0"
                  :precision="2"
                  :step="1"
                  size="small"
                  class="price-input"
                />
              </div>
              <div class="package-duration">{{ pkg.duration }}天</div>
              <el-button 
                type="primary" 
                size="small"
                @click="updatePrice('SVIP', key, pkg.currentPrice)"
                :loading="loading"
              >
                更新
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIP订单列表 -->
      <div class="orders-section">
        <div class="section-header">
          <h4>VIP订单管理</h4>
          <el-button type="success" size="small" @click="exportVipOrders">
            导出订单
          </el-button>
        </div>
        
        <el-table
          :data="paginatedVipOrders"
          class="vip-orders-table"
          stripe
          :loading="loading"
        >
          <el-table-column prop="orderNumber" label="订单号" width="140"/>
          <el-table-column prop="username" label="用户" width="120"/>
          <el-table-column prop="packageName" label="套餐" width="120"/>
          <el-table-column prop="duration" label="时长" width="80" align="center">
            <template #default="scope">
              {{ scope.row.duration }}天
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="100" align="right">
            <template #default="scope">
              ¥{{ scope.row.amount }}
            </template>
          </el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" width="100" align="center">
            <template #default="scope">
              <el-tag size="small">{{ getPaymentMethodName(scope.row.paymentMethod) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getOrderStatusType(scope.row.status)" size="small">
                {{ getOrderStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="140"/>
          <el-table-column prop="completedTime" label="完成时间" width="140">
            <template #default="scope">
              {{ scope.row.completedTime || '-' }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="vipOrders.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useVipStore } from '@/stores/vip'

const vipStore = useVipStore()

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// VIP数据
const vipStats = computed(() => vipStore.getVipStats())
const vipPackages = computed(() => vipStore.vipPackages)
const vipOrders = ref([])

// 分页的VIP订单
const paginatedVipOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return vipOrders.value.slice(start, end)
})

// 刷新统计数据
const refreshStats = async () => {
  loading.value = true
  try {
    // 重新计算统计数据
    vipOrders.value = vipStore.getVipOrders()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

// 更新价格
const updatePrice = async (vipType, packageType, newPrice) => {
  loading.value = true
  try {
    const result = vipStore.updateVipPricing(vipType, packageType, newPrice)
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('价格更新失败')
  } finally {
    loading.value = false
  }
}

// 订单状态相关
const getOrderStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

const getOrderStatusText = (status) => {
  const textMap = {
    pending: '待支付',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || '未知'
}

const getPaymentMethodName = (method) => {
  const methodMap = {
    balance: '余额',
    alipay: '支付宝',
    wechat: '微信',
    bank: '银行卡'
  }
  return methodMap[method] || method
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 导出VIP订单
const exportVipOrders = () => {
  try {
    const csvContent = [
      ['订单号', '用户名', '套餐名称', '时长(天)', '金额', '支付方式', '状态', '创建时间', '完成时间'].join(','),
      ...vipOrders.value.map(order => [
        order.orderNumber,
        order.username,
        order.packageName,
        order.duration,
        order.amount,
        getPaymentMethodName(order.paymentMethod),
        getOrderStatusText(order.status),
        order.createTime,
        order.completedTime || ''
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `vip_orders_${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('订单导出成功')
  } catch (error) {
    ElMessage.error('订单导出失败')
  }
}

onMounted(() => {
  refreshStats()
})
</script>

<style lang="scss" scoped>
.vip-management {
  .management-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
        
        .header-icon {
          color: #9333ea;
        }
      }
    }
  }
}

.stats-section {
  margin-bottom: 32px;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  
  &.total {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }
  
  &.normal {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
  }
  
  &.vip {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }
  
  &.svip {
    background: linear-gradient(135deg, #9333ea, #7c3aed);
    color: white;
  }
  
  &.active {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }
  
  &.revenue {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
  }
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.pricing-section {
  margin-bottom: 32px;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 24px 0;
  }
}

.pricing-group {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  
  h5 {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
}

.discount-info {
  font-size: 12px;
  color: #f59e0b;
  background: #fef3c7;
  padding: 4px 8px;
  border-radius: 4px;
  
  &.svip {
    color: #9333ea;
    background: #f3e8ff;
  }
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.pricing-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  }
  
  &.svip {
    &:hover {
      border-color: #9333ea;
      box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
    }
  }
}

.package-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.price-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  
  label {
    font-size: 13px;
    color: #64748b;
    white-space: nowrap;
  }
  
  .price-input {
    flex: 1;
  }
}

.package-duration {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 16px;
}

.orders-section {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }
}

.vip-orders-table {
  margin-bottom: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

// 响应式设计
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .group-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>