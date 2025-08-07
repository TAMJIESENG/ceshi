<template>
  <div class="card-generator">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>卡密生成器</span>
          <el-button type="primary" @click="showGenerateDialog = true">
            <el-icon><plus /></el-icon>
            生成卡密
          </el-button>
        </div>
      </template>
      
      <div class="generator-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalGenerated }}</div>
              <div class="stat-label">总生成数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.unusedCount }}</div>
              <div class="stat-label">未使用</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.usedCount }}</div>
              <div class="stat-label">已使用</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ stats.expiredCount }}</div>
              <div class="stat-label">已过期</div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="quick-actions">
        <h4>快捷生成</h4>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-button 
              type="success" 
              class="quick-btn"
              @click="quickGenerate('monthly', 10)"
              :loading="loading"
            >
              生成10张月卡
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button 
              type="warning" 
              class="quick-btn"
              @click="quickGenerate('quarterly', 5)"
              :loading="loading"
            >
              生成5张季卡
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button 
              type="danger" 
              class="quick-btn"
              @click="quickGenerate('yearly', 2)"
              :loading="loading"
            >
              生成2张年卡
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    
    <!-- 生成对话框 -->
    <el-dialog 
      v-model="showGenerateDialog" 
      title="批量生成卡密" 
      width="500px"
      @close="resetForm"
    >
      <el-form :model="generateForm" :rules="rules" ref="generateFormRef" label-width="100px">
        <el-form-item label="卡密类型" prop="type">
          <el-select v-model="generateForm.type" placeholder="请选择卡密类型" class="full-width">
            <el-option 
              v-for="option in cardTypeOptions" 
              :key="option.value"
              :label="option.label" 
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="生成数量" prop="quantity">
          <el-input-number 
            v-model="generateForm.quantity" 
            :min="1" 
            :max="1000" 
            :step="1"
            class="full-width"
          />
        </el-form-item>
        
        <el-form-item label="卡密面值" prop="value">
          <el-input 
            v-model="generateForm.value" 
            placeholder="请输入面值"
            class="full-width"
          >
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="批次标识">
          <el-input 
            v-model="generateForm.batchId" 
            placeholder="可选，用于标识这批卡密"
            class="full-width"
          />
        </el-form-item>
        
        <el-form-item label="有效期">
          <el-date-picker
            v-model="generateForm.expireTime"
            type="datetime"
            placeholder="选择过期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="full-width"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="generate-preview">
            <div class="preview-info">
              <span>预计生成：</span>
              <strong>{{ generateForm.quantity }} 张{{ getCardTypeName(generateForm.type) }}</strong>
            </div>
            <div class="preview-info">
              <span>总价值：</span>
              <strong>¥{{ calculateTotalValue() }}</strong>
            </div>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleGenerate" :loading="loading">
          确认生成
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 生成结果对话框 -->
    <el-dialog 
      v-model="showResultDialog" 
      title="生成结果" 
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="generate-result">
        <div class="result-header">
          <el-icon class="success-icon" color="#67C23A"><circle-check /></el-icon>
          <h3>生成成功！</h3>
          <p>已成功生成 {{ generatedCards.length }} 张卡密</p>
        </div>
        
        <div class="result-actions">
          <el-button type="primary" @click="exportGeneratedCards">
            <el-icon><download /></el-icon>
            导出卡密
          </el-button>
          <el-button @click="copyAllCards">
            <el-icon><copy-document /></el-icon>
            复制所有
          </el-button>
        </div>
        
        <div class="card-list">
          <el-table :data="generatedCards" max-height="300">
            <el-table-column prop="cardNumber" label="卡号" />
            <el-table-column prop="cardType" label="类型" width="80" />
            <el-table-column prop="value" label="面值" width="80" />
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button 
                  type="text" 
                  size="small"
                  @click="copyCard(scope.row.cardNumber)"
                >
                  复制
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="showResultDialog = false">
          完成
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useCardStore } from '@/stores/card'
import { 
  Plus, CircleCheck, Download, CopyDocument 
} from '@element-plus/icons-vue'

const cardStore = useCardStore()

const showGenerateDialog = ref(false)
const showResultDialog = ref(false)
const generateFormRef = ref()
const loading = ref(false)
const generatedCards = ref([])

const stats = reactive({
  totalGenerated: 156,
  unusedCount: 89,
  usedCount: 52,
  expiredCount: 15
})

const generateForm = reactive({
  type: '',
  quantity: 10,
  value: '',
  batchId: '',
  expireTime: null
})

const cardTypeOptions = [
  { label: '月卡', value: 'monthly' },
  { label: '季卡', value: 'quarterly' },
  { label: '年卡', value: 'yearly' }
]

const rules = {
  type: [
    { required: true, message: '请选择卡密类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入生成数量', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入卡密面值', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' }
  ]
}

const getCardTypeName = (type) => {
  const option = cardTypeOptions.find(opt => opt.value === type)
  return option ? option.label : ''
}

const calculateTotalValue = () => {
  if (generateForm.value && generateForm.quantity) {
    return (parseFloat(generateForm.value) * generateForm.quantity).toFixed(2)
  }
  return '0.00'
}

const quickGenerate = async (type, quantity) => {
  const valueMap = {
    monthly: '29.90',
    quarterly: '79.90',
    yearly: '299.90'
  }
  
  loading.value = true
  
  try {
    const result = await cardStore.generateCards({
      type,
      quantity,
      value: valueMap[type]
    })
    
    if (result.success) {
      ElMessage.success(result.message)
      generatedCards.value = result.data.cards
      showResultDialog.value = true
      updateStats()
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    loading.value = false
  }
}

const handleGenerate = async () => {
  if (!generateFormRef.value) return
  
  await generateFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        const result = await cardStore.generateCards(generateForm)
        
        if (result.success) {
          ElMessage.success(result.message)
          generatedCards.value = result.data.cards
          showGenerateDialog.value = false
          showResultDialog.value = true
          updateStats()
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  generateForm.type = ''
  generateForm.quantity = 10
  generateForm.value = ''
  generateForm.batchId = ''
  generateForm.expireTime = null
  
  if (generateFormRef.value) {
    generateFormRef.value.clearValidate()
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

const copyAllCards = async () => {
  const cardNumbers = generatedCards.value.map(card => card.cardNumber).join('\n')
  
  try {
    await navigator.clipboard.writeText(cardNumbers)
    ElMessage.success('所有卡号已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const exportGeneratedCards = () => {
  cardStore.exportCards(generatedCards.value)
  ElMessage.success('导出成功')
}

const updateStats = () => {
  stats.totalGenerated += generatedCards.value.length
  stats.unusedCount += generatedCards.value.length
}

onMounted(() => {
  
})
</script>

<style lang="scss" scoped>
.card-generator {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .generator-stats {
    margin-bottom: 24px;
    
    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      
      .stat-number {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }
  
  .quick-actions {
    h4 {
      margin-bottom: 16px;
      color: #303133;
    }
    
    .quick-btn {
      width: 100%;
      height: 40px;
    }
  }
  
  .generate-preview {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    
    .preview-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      span {
        color: #606266;
      }
      
      strong {
        color: #409eff;
      }
    }
  }
  
  .generate-result {
    .result-header {
      text-align: center;
      margin-bottom: 24px;
      
      .success-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      h3 {
        margin: 0 0 8px 0;
        color: #303133;
      }
      
      p {
        margin: 0;
        color: #606266;
      }
    }
    
    .result-actions {
      text-align: center;
      margin-bottom: 24px;
      
      .el-button {
        margin: 0 8px;
      }
    }
    
    .card-list {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      overflow: hidden;
    }
  }
}

.full-width {
  width: 100%;
}
</style>