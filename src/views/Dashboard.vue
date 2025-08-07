<template>
  <div class="dashboard">
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>个人中心</h2>
          <div class="user-info">
            <div class="user-status">
              <span class="balance-display">余额: ¥{{ (user?.balance || 0).toFixed(2) }}</span>
              <el-tag 
                :type="userVipInfo.level === 0 ? 'info' : userVipInfo.level === 1 ? 'warning' : ''" 
                :color="userVipInfo.level === 2 ? '#9333ea' : ''"
                class="vip-badge"
              >
                <svg v-if="userVipInfo.level === 1" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                  <path d="M5 16L3 14l5.5-5.5L10 10l4-4L16.5 8.5L18 7l3 3-8.5 8.5L8 14l-3 2z"/>
                </svg>
                <svg v-else-if="userVipInfo.level === 2" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                  <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
                </svg>
                {{ userVipInfo.name }}
              </el-tag>
            </div>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ user?.username }}
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="home">返回首页</el-dropdown-item>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                  <el-dropdown-item v-if="isAdmin" command="admin">管理后台</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main>
        <el-row :gutter="20" class="mobile-stack">
          <el-col :xs="12" :sm="6" :md="6">
            <el-card class="info-card stats-card hover-lift">
              <div class="info-item">
                <el-icon class="info-icon" color="#409eff"><Wallet /></el-icon>
                <div class="info-content">
                  <h3>¥{{ (user?.balance || 0).toFixed(2) }}</h3>
                  <p>账户余额</p>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6" :md="6">
            <el-card class="info-card stats-card hover-lift">
              <div class="info-item">
                <el-icon class="info-icon" color="#67C23A"><Key /></el-icon>
                <div class="info-content">
                  <h3>{{ userStats.totalCards }}</h3>
                  <p>拥有卡密</p>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6" :md="6">
            <el-card class="info-card stats-card hover-lift">
              <div class="info-item">
                <el-icon class="info-icon" color="#E6A23C"><ShoppingCart /></el-icon>
                <div class="info-content">
                  <h3>{{ userStats.usedCards }}</h3>
                  <p>已使用</p>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6" :md="6">
            <el-card class="info-card stats-card hover-lift">
              <div class="info-item">
                <el-icon class="info-icon" color="#F56C6C"><Clock /></el-icon>
                <div class="info-content">
                  <h3>{{ userStats.expiredCards }}</h3>
                  <p>已过期</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" class="mt-20 mobile-stack">
          <el-col :xs="24" :md="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>功能模块</span>
                  <el-button-group>
                    <el-button 
                      :type="activeTab === 'cards' ? 'primary' : ''"
                      @click="activeTab = 'cards'"
                    >
                      卡密管理
                    </el-button>
                    <el-button 
                      :type="activeTab === 'orders' ? 'primary' : ''"
                      @click="activeTab = 'orders'"
                    >
                      订单管理
                    </el-button>
                    <el-button 
                      :type="activeTab === 'recharge' ? 'primary' : ''"
                      @click="activeTab = 'recharge'"
                    >
                      余额充值
                    </el-button>
                    <el-button 
                      v-if="isAdmin"
                      :type="activeTab === 'generator' ? 'primary' : ''"
                      @click="activeTab = 'generator'"
                    >
                      卡密生成器
                    </el-button>
                    <el-button 
                      :type="activeTab === 'query' ? 'primary' : ''"
                      @click="activeTab = 'query'"
                    >
                      卡密查询
                    </el-button>
                    <el-button 
                      :type="activeTab === 'contact' ? 'primary' : ''"
                      @click="activeTab = 'contact'"
                    >
                      联系客服
                    </el-button>
                  </el-button-group>
                </div>
              </template>
              
              <div class="tab-content">
                <!-- 卡密管理 -->
                <div v-if="activeTab === 'cards'">
                  <el-table :data="cardList" style="width: 100%">
                    <el-table-column prop="cardNumber" label="卡号" />
                    <el-table-column prop="cardType" label="类型" />
                    <el-table-column prop="value" label="面值" />
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                          {{ getStatusText(scope.row.status) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" />
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button 
                          v-if="scope.row.status === 'sold'" 
                          type="primary" 
                          size="small"
                          @click="useCard(scope.row)"
                        >
                          激活
                        </el-button>
                        <el-button 
                          v-if="scope.row.status === 'used'"
                          type="success" 
                          size="small"
                          disabled
                        >
                          已激活
                        </el-button>
                        <el-button 
                          type="info" 
                          size="small"
                          @click="viewCard(scope.row)"
                        >
                          查看
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  
                  <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    class="mt-20"
                  />
                </div>
                
                <!-- 订单管理 -->
                <div v-if="activeTab === 'orders'">
                  <OrderManagement />
                </div>
                
                <!-- 余额充值 -->
                <div v-if="activeTab === 'recharge'">
                  <BalanceRecharge />
                </div>
                
                <!-- 卡密生成器 -->
                <div v-if="activeTab === 'generator' && isAdmin">
                  <CardGenerator />
                </div>
                
                <!-- 卡密查询 -->
                <div v-if="activeTab === 'query'">
                  <CardQuery />
                </div>
                
                <!-- 联系客服 -->
                <div v-if="activeTab === 'contact'">
                  <ContactAdmin />
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :md="8">
            <el-card>
              <template #header>
                <span>快速操作</span>
              </template>
              
              <div class="quick-actions">
                <el-button type="success" @click="activeTab = 'recharge'" class="action-btn">
                  <el-icon><Wallet /></el-icon>
                  余额充值
                </el-button>
                
                <el-button type="primary" @click="$router.push('/cards')" class="action-btn">
                  <el-icon><ShoppingCart /></el-icon>
                  购买卡密
                </el-button>
                
                <el-button type="info" @click="showQueryDialog = true" class="action-btn">
                  <el-icon><Search /></el-icon>
                  查询卡密
                </el-button>
                
                <el-button 
                  :type="userVipInfo.level === 2 ? 'info' : 'primary'"
                  @click="$router.push('/vip')" 
                  class="action-btn vip-action"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                    <path v-if="userVipInfo.level === 2" d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
                    <path v-else d="M5 16L3 14l5.5-5.5L10 10l4-4L16.5 8.5L18 7l3 3-8.5 8.5L8 14l-3 2z"/>
                  </svg>
                  {{ userVipInfo.level === 2 ? 'VIP中心' : userVipInfo.level === 1 ? '升级SVIP' : '升级VIP' }}
                </el-button>
                
                <el-button type="warning" @click="$router.push('/profile')" class="action-btn">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-button>
                
                <el-button type="info" @click="$router.push('/settings')" class="action-btn">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-button>
                
                <el-button type="info" @click="activeTab = 'contact'" class="action-btn">
                  <el-icon><Service /></el-icon>
                  联系客服
                </el-button>
              </div>
            </el-card>
            
            <el-card class="mt-20">
              <template #header>
                <span>最近交易</span>
              </template>
              
              <el-timeline>
                <el-timeline-item
                  v-for="transaction in recentTransactions"
                  :key="transaction.id"
                  :timestamp="transaction.time"
                >
                  {{ transaction.description }}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    
    <!-- 查询卡密对话框 -->
    <el-dialog v-model="showQueryDialog" title="查询卡密" width="400px">
      <el-form :model="queryForm" label-width="80px">
        <el-form-item label="卡号">
          <el-input v-model="queryForm.cardNumber" placeholder="请输入卡号" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showQueryDialog = false">取消</el-button>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCardStore } from '@/stores/card'
import { useVipStore } from '@/stores/vip'
import OrderManagement from '@/components/OrderManagement.vue'
import CardGenerator from '@/components/CardGenerator.vue'
import CardQuery from '@/components/CardQuery.vue'
import ContactAdmin from '@/components/ContactAdmin.vue'
import BalanceRecharge from '@/components/BalanceRecharge.vue'
import { 
  ArrowDown, Wallet, Key, ShoppingCart, Clock, 
  Search, User, Service, Setting
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const cardStore = useCardStore()
const vipStore = useVipStore()

const user = computed(() => userStore.user)
const isAdmin = computed(() => userStore.isAdmin)

// 获取用户VIP信息
const userVipInfo = computed(() => {
  if (!user.value) return vipStore.vipLevels['普通']
  return vipStore.getUserVipInfo(user.value.level)
})

const showQueryDialog = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const activeTab = ref('cards')

const userStats = reactive({
  balance: '¥0.00',
  totalCards: 0,
  usedCards: 0,
  expiredCards: 0
})

const cardList = ref([])

const recentTransactions = ref([
  {
    id: 1,
    description: '购买月卡 x1',
    time: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    description: '使用季卡',
    time: '2024-01-02 14:30:00'
  }
])

const queryForm = reactive({
  cardNumber: ''
})

const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}

const getStatusType = (status) => {
  return cardStore.getCardStatusType(status)
}

const getStatusText = (status) => {
  return cardStore.getCardStatusText(status)
}


const handleQuery = async () => {
  if (!queryForm.cardNumber) {
    ElMessage.error('请输入卡号')
    return
  }
  
  ElMessage.success('查询功能开发中...')
  showQueryDialog.value = false
}

const useCard = async (card) => {
  try {
    await ElMessageBox.confirm(
      `确认激活卡密 ${card.cardNumber}？`,
      '确认激活',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await cardStore.activateCard(card.cardNumber, user.value.id)
    
    if (result.success) {
      ElMessage.success(result.message)
      loadUserCards() // 刷新用户卡密列表
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // 用户取消
  }
}

// 加载用户购买的卡密
const loadUserCards = async () => {
  if (!user.value) return
  
  const result = await cardStore.getUserCards(user.value.id)
  if (result.success) {
    cardList.value = result.data
    
    // 更新统计信息
    userStats.totalCards = result.data.length
    userStats.usedCards = result.data.filter(card => card.status === 'used').length
    userStats.expiredCards = result.data.filter(card => card.status === 'expired').length
  }
}

const viewCard = (card) => {
  ElMessage.info(`查看卡密: ${card.cardNumber}`)
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

onMounted(() => {
  // 刷新用户数据确保余额同步
  userStore.refreshCurrentUser()
  loadUserCards()
})
</script>

<style lang="scss" scoped>
.dashboard {
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

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  display: flex;
  align-items: center;
}

.info-card {
  .info-item {
    display: flex;
    align-items: center;
    
    .info-icon {
      font-size: 32px;
      margin-right: 16px;
    }
    
    .info-content {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .action-btn {
    width: 100%;
    height: 40px;
    justify-content: flex-start;
  }
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #E6A23C;
}

.mt-20 {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .user-status {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .balance-display {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: bold;
  }
  
  .vip-badge {
    font-size: 13px;
    font-weight: 600;
    
    &.el-tag--warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border-color: #f59e0b;
      color: white;
    }
  }
}

.balance-text {
  color: #67C23A;
  font-weight: bold;
  font-size: 16px;
}

.insufficient-balance {
  color: #F56C6C;
  font-weight: bold;
  margin-left: 8px;
}

// VIP价格显示样式
.pricing-info {
  .vip-pricing {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .original-price {
      font-size: 14px;
      color: #909399;
      
      .price-through {
        text-decoration: line-through;
        color: #909399;
      }
    }
    
    .vip-price {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      
      .price-vip {
        font-size: 18px;
        font-weight: bold;
        color: #E6A23C;
      }
    }
    
    .savings {
      font-size: 14px;
      
      .price-savings {
        font-weight: bold;
        color: #67C23A;
      }
    }
  }
  
  .normal-pricing {
    .vip-hint {
      margin-top: 8px;
      font-size: 12px;
      
      .vip-link {
        color: #409eff;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// VIP操作按钮样式
.vip-action {
  &.el-button--primary {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
    
    &:hover {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      border-color: #d97706;
    }
  }
}
</style>