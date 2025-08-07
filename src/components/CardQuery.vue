<template>
  <div class="card-query">
    <el-card>
      <template #header>
        <span>卡密查询</span>
      </template>
      
      <div class="query-form">
        <el-form :model="queryForm" :rules="rules" ref="queryFormRef" @submit.prevent="handleQuery">
          <el-form-item prop="cardNumber">
            <el-input
              v-model="queryForm.cardNumber"
              placeholder="请输入卡号进行查询"
              size="large"
              clearable
              @keyup.enter="handleQuery"
            >
              <template #prefix>
                <el-icon><key /></el-icon>
              </template>
              <template #append>
                <el-button type="primary" @click="handleQuery" :loading="loading">
                  <el-icon><Search /></el-icon>
                  查询
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 查询结果 -->
      <div v-if="queryResult" class="query-result">
        <el-result
          :icon="getResultIcon()"
          :title="getResultTitle()"
          :sub-title="getResultSubTitle()"
        >
          <template #extra>
            <div v-if="queryResult.success" class="card-details">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="卡号">
                  {{ queryResult.data.cardNumber }}
                  <el-button 
                    type="text" 
                    size="small" 
                    @click="copyCard(queryResult.data.cardNumber)"
                    style="margin-left: 8px;"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-descriptions-item>
                
                <el-descriptions-item label="类型">
                  <el-tag :type="getCardTypeTagType(queryResult.data.cardType)">
                    {{ queryResult.data.cardType }}
                  </el-tag>
                </el-descriptions-item>
                
                <el-descriptions-item label="面值">
                  <span class="value-text">{{ queryResult.data.value }}</span>
                </el-descriptions-item>
                
                <el-descriptions-item label="状态">
                  <el-tag :type="getStatusType(queryResult.data.status)">
                    {{ getStatusText(queryResult.data.status) }}
                  </el-tag>
                </el-descriptions-item>
                
                <el-descriptions-item label="创建时间">
                  {{ queryResult.data.createTime }}
                </el-descriptions-item>
                
                <el-descriptions-item label="过期时间">
                  {{ queryResult.data.expireTime || '永久有效' }}
                </el-descriptions-item>
                
                <el-descriptions-item v-if="queryResult.data.useTime" label="使用时间">
                  {{ queryResult.data.useTime }}
                </el-descriptions-item>
                
                <el-descriptions-item v-if="queryResult.data.useTime" label="使用用户">
                  {{ queryResult.data.username || '未知' }}
                </el-descriptions-item>
                
                <el-descriptions-item v-if="queryResult.data.purchaser" label="购买用户">
                  {{ queryResult.data.purchaser }}
                </el-descriptions-item>
                
                <el-descriptions-item v-if="queryResult.data.purchaseTime" label="购买时间">
                  {{ queryResult.data.purchaseTime }}
                </el-descriptions-item>
              </el-descriptions>
              
              <div class="card-actions">
                <el-button 
                  v-if="queryResult.data.status === 'unused'"
                  type="primary" 
                  @click="useCard(queryResult.data.cardNumber)"
                  :loading="useLoading"
                >
                  <el-icon><Key /></el-icon>
                  使用此卡密
                </el-button>
                
                <el-button 
                  v-if="queryResult.data.status === 'sold' && queryResult.data.purchasedBy"
                  type="success" 
                  @click="activateCard(queryResult.data.cardNumber)"
                  :loading="activateLoading"
                >
                  <el-icon><Key /></el-icon>
                  激活此卡密
                </el-button>
                
                <el-button @click="queryAnother">
                  <el-icon><Refresh /></el-icon>
                  查询其他
                </el-button>
              </div>
            </div>
            
            <div v-else class="error-actions">
              <el-button type="primary" @click="queryAnother">
                重新查询
              </el-button>
            </div>
          </template>
        </el-result>
      </div>
      
      <!-- 查询历史 -->
      <div v-if="queryHistory.length > 0" class="query-history">
        <h4>最近查询</h4>
        <div class="history-list">
          <el-tag
            v-for="(item, index) in queryHistory"
            :key="index"
            class="history-item"
            type="info"
            closable
            @close="removeFromHistory(index)"
            @click="queryFromHistory(item)"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>
    </el-card>
    
    <!-- 批量查询对话框 -->
    <el-dialog v-model="showBatchDialog" title="批量查询" width="600px">
      <div class="batch-query">
        <el-form>
          <el-form-item label="卡号列表">
            <el-input
              v-model="batchQuery.cardNumbers"
              type="textarea"
              :rows="6"
              placeholder="请输入卡号，每行一个"
            />
          </el-form-item>
        </el-form>
        
        <div v-if="batchResults.length > 0" class="batch-results">
          <h4>查询结果</h4>
          <el-table :data="batchResults" max-height="300">
            <el-table-column prop="cardNumber" label="卡号" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.success ? 'success' : 'danger'">
                  {{ scope.row.success ? '找到' : '未找到' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cardType" label="类型" />
            <el-table-column prop="value" label="面值" />
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showBatchDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleBatchQuery" :loading="batchLoading">
          批量查询
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCardStore } from '@/stores/card'
import { 
  Key, Search, CopyDocument, Refresh 
} from '@element-plus/icons-vue'

const cardStore = useCardStore()

const queryFormRef = ref()
const loading = ref(false)
const useLoading = ref(false)
const activateLoading = ref(false)
const batchLoading = ref(false)
const showBatchDialog = ref(false)
const queryResult = ref(null)
const queryHistory = ref([])
const batchResults = ref([])

const queryForm = reactive({
  cardNumber: ''
})

const batchQuery = reactive({
  cardNumbers: ''
})

const rules = {
  cardNumber: [
    { required: true, message: '请输入卡号', trigger: 'blur' },
    { min: 10, message: '卡号长度不能少于10位', trigger: 'blur' }
  ]
}

const handleQuery = async () => {
  if (!queryFormRef.value) return
  
  await queryFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        const result = await cardStore.queryCard(queryForm.cardNumber)
        
        queryResult.value = result
        
        if (result.success) {
          addToHistory(queryForm.cardNumber)
          ElMessage.success('查询成功')
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        loading.value = false
      }
    }
  })
}

const handleBatchQuery = async () => {
  if (!batchQuery.cardNumbers.trim()) {
    ElMessage.error('请输入卡号')
    return
  }
  
  const cardNumbers = batchQuery.cardNumbers
    .split('\n')
    .map(card => card.trim())
    .filter(card => card)
  
  if (cardNumbers.length === 0) {
    ElMessage.error('请输入有效的卡号')
    return
  }
  
  batchLoading.value = true
  batchResults.value = []
  
  try {
    for (const cardNumber of cardNumbers) {
      const result = await cardStore.queryCard(cardNumber)
      
      batchResults.value.push({
        cardNumber,
        success: result.success,
        cardType: result.success ? result.data.cardType : '',
        value: result.success ? result.data.value : '',
        status: result.success ? result.data.status : ''
      })
    }
    
    ElMessage.success(`批量查询完成，共查询 ${cardNumbers.length} 张卡密`)
  } finally {
    batchLoading.value = false
  }
}

const useCard = async (cardNumber) => {
  try {
    await ElMessageBox.confirm(
      `确认使用卡密 ${cardNumber}？使用后将无法撤销。`,
      '确认使用',
      {
        confirmButtonText: '确认使用',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    useLoading.value = true
    
    const result = await cardStore.useCard(cardNumber)
    
    if (result.success) {
      ElMessage.success(result.message)
      queryResult.value.data.status = 'used'
      queryResult.value.data.useTime = new Date().toLocaleString('zh-CN')
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    
  } finally {
    useLoading.value = false
  }
}

const activateCard = async (cardNumber) => {
  try {
    await ElMessageBox.confirm(
      `确认激活卡密 ${cardNumber}？激活后可正常使用。`,
      '确认激活',
      {
        confirmButtonText: '确认激活',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    activateLoading.value = true
    
    // 从用户store获取当前用户ID（如果需要验证所有权）
    const result = await cardStore.activateCard(cardNumber, queryResult.value.data.purchasedBy)
    
    if (result.success) {
      ElMessage.success(result.message)
      queryResult.value.data.status = 'used'
      queryResult.value.data.useTime = new Date().toLocaleString('zh-CN')
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    
  } finally {
    activateLoading.value = false
  }
}

const copyCard = async (cardNumber) => {
  try {
    await navigator.clipboard.writeText(cardNumber)
    ElMessage.success('卡号已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const queryAnother = () => {
  queryResult.value = null
  queryForm.cardNumber = ''
  
  if (queryFormRef.value) {
    queryFormRef.value.clearValidate()
  }
}

const queryFromHistory = (cardNumber) => {
  queryForm.cardNumber = cardNumber
  handleQuery()
}

const addToHistory = (cardNumber) => {
  if (!queryHistory.value.includes(cardNumber)) {
    queryHistory.value.unshift(cardNumber)
    
    if (queryHistory.value.length > 10) {
      queryHistory.value.pop()
    }
    
    localStorage.setItem('cardQueryHistory', JSON.stringify(queryHistory.value))
  }
}

const removeFromHistory = (index) => {
  queryHistory.value.splice(index, 1)
  localStorage.setItem('cardQueryHistory', JSON.stringify(queryHistory.value))
}

const getResultIcon = () => {
  if (!queryResult.value) return 'info'
  return queryResult.value.success ? 'success' : 'error'
}

const getResultTitle = () => {
  if (!queryResult.value) return ''
  return queryResult.value.success ? '查询成功' : '查询失败'
}

const getResultSubTitle = () => {
  if (!queryResult.value) return ''
  
  if (queryResult.value.success) {
    const data = queryResult.value.data
    return `找到卡密：${data.cardNumber}，状态：${getStatusText(data.status)}`
  } else {
    return queryResult.value.message
  }
}

const getStatusType = (status) => {
  return cardStore.getCardStatusType(status)
}

const getStatusText = (status) => {
  return cardStore.getCardStatusText(status)
}

const getCardTypeTagType = (type) => {
  const typeMap = {
    '月卡': 'success',
    '季卡': 'warning',
    '年卡': 'danger'
  }
  return typeMap[type] || 'info'
}

onMounted(() => {
  const history = localStorage.getItem('cardQueryHistory')
  if (history) {
    try {
      queryHistory.value = JSON.parse(history)
    } catch (error) {
      queryHistory.value = []
    }
  }
})
</script>

<style lang="scss" scoped>
.card-query {
  .query-form {
    margin-bottom: 24px;
  }
  
  .query-result {
    margin: 24px 0;
    
    .card-details {
      max-width: 600px;
      margin: 0 auto;
      
      .value-text {
        font-weight: bold;
        color: #E6A23C;
        font-size: 16px;
      }
      
      .card-actions {
        text-align: center;
        margin-top: 24px;
        
        .el-button {
          margin: 0 8px;
        }
      }
    }
    
    .error-actions {
      text-align: center;
    }
  }
  
  .query-history {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e4e7ed;
    
    h4 {
      margin-bottom: 16px;
      color: #303133;
    }
    
    .history-list {
      .history-item {
        margin: 0 8px 8px 0;
        cursor: pointer;
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  
  .batch-query {
    .batch-results {
      margin-top: 24px;
      
      h4 {
        margin-bottom: 16px;
        color: #303133;
      }
    }
  }
}
</style>