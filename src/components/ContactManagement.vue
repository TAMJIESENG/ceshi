<template>
  <div class="contact-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户联系管理</span>
          <div class="stats-summary">
            <el-tag type="warning">待处理: {{ pendingCount }}</el-tag>
            <el-tag type="primary">处理中: {{ processingCount }}</el-tag>
            <el-tag type="success">已解决: {{ resolvedCount }}</el-tag>
          </div>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <div class="filter-bar">
        <el-form :model="filterForm" inline>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已解决" value="resolved" />
              <el-option label="已关闭" value="closed" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="类别">
            <el-select v-model="filterForm.category" placeholder="全部类别" clearable>
              <el-option label="技术问题" value="technical" />
              <el-option label="账户问题" value="account" />
              <el-option label="支付问题" value="payment" />
              <el-option label="卡密问题" value="card" />
              <el-option label="意见建议" value="suggestion" />
              <el-option label="投诉举报" value="complaint" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="优先级">
            <el-select v-model="filterForm.priority" placeholder="全部优先级" clearable>
              <el-option label="一般" value="low" />
              <el-option label="普通" value="normal" />
              <el-option label="紧急" value="high" />
              <el-option label="非常紧急" value="urgent" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="搜索">
            <el-input 
              v-model="filterForm.keyword" 
              placeholder="标题或用户名"
              clearable
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleFilter">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetFilter">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 联系列表 -->
      <el-table :data="filteredContacts" style="width: 100%" v-loading="loading">
        <el-table-column prop="subject" label="问题标题" min-width="200" />
        
        <el-table-column prop="username" label="提交用户" width="120" />
        
        <el-table-column prop="category" label="类别" width="120">
          <template #default="scope">
            {{ getCategoryText(scope.row.category) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag :type="getPriorityType(scope.row.priority)" size="small">
              {{ getPriorityText(scope.row.priority) }}
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
        
        <el-table-column prop="createTime" label="提交时间" width="160" />
        
        <el-table-column prop="replyTime" label="回复时间" width="160">
          <template #default="scope">
            {{ scope.row.replyTime || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="handleContact(scope.row)"
            >
              {{ scope.row.adminReply ? '查看回复' : '立即处理' }}
            </el-button>
            <el-button 
              type="warning" 
              size="small" 
              @click="changeStatus(scope.row)"
              v-if="scope.row.status !== 'closed'"
            >
              更改状态
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
    
    <!-- 处理联系对话框 -->
    <el-dialog 
      v-model="showReplyDialog" 
      :title="currentContact ? `处理用户问题 - ${currentContact.subject}` : '处理问题'" 
      width="800px"
    >
      <div v-if="currentContact" class="reply-dialog-content">
        <!-- 问题信息 -->
        <div class="contact-info">
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="提交用户">
              {{ currentContact.username }}
            </el-descriptions-item>
            
            <el-descriptions-item label="联系邮箱">
              {{ currentContact.email }}
            </el-descriptions-item>
            
            <el-descriptions-item label="问题类别">
              {{ getCategoryText(currentContact.category) }}
            </el-descriptions-item>
            
            <el-descriptions-item label="优先级">
              <el-tag :type="getPriorityType(currentContact.priority)" size="small">
                {{ getPriorityText(currentContact.priority) }}
              </el-tag>
            </el-descriptions-item>
            
            <el-descriptions-item label="提交时间" :span="2">
              {{ currentContact.createTime }}
            </el-descriptions-item>
            
            <el-descriptions-item label="问题描述" :span="2">
              <div class="problem-description">{{ currentContact.message }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 回复表单 -->
        <div class="reply-form">
          <h4>管理员回复</h4>
          <el-form :model="replyForm" :rules="replyRules" ref="replyFormRef" label-width="100px">
            <el-form-item label="处理状态" prop="status">
              <el-radio-group v-model="replyForm.status">
                <el-radio label="processing">处理中</el-radio>
                <el-radio label="resolved">已解决</el-radio>
                <el-radio label="closed">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="回复内容" prop="reply">
              <el-input
                v-model="replyForm.reply"
                type="textarea"
                :rows="6"
                placeholder="请输入详细的回复内容..."
                maxlength="1000"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 历史回复 -->
        <div v-if="currentContact.adminReply" class="reply-history">
          <h4>历史回复</h4>
          <div class="history-item">
            <div class="history-meta">
              <span class="reply-time">{{ currentContact.replyTime }}</span>
            </div>
            <div class="history-content">{{ currentContact.adminReply }}</div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showReplyDialog = false">取消</el-button>
        <el-button type="primary" @click="submitReply" :loading="replyLoading">
          提交回复
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 状态更改对话框 -->
    <el-dialog v-model="showStatusDialog" title="更改状态" width="400px">
      <el-form label-width="80px">
        <el-form-item label="当前状态" v-if="currentContact">
          <el-tag :type="getStatusType(currentContact.status)">
            {{ getStatusText(currentContact.status) }}
          </el-tag>
        </el-form-item>
        
        <el-form-item label="新状态">
          <el-radio-group v-model="newStatus">
            <el-radio label="pending">待处理</el-radio>
            <el-radio label="processing">处理中</el-radio>
            <el-radio label="resolved">已解决</el-radio>
            <el-radio label="closed">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showStatusDialog = false">取消</el-button>
        <el-button type="primary" @click="updateStatus" :loading="statusLoading">
          确认更改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useContactStore } from '@/stores/contact'
import { Search, Refresh } from '@element-plus/icons-vue'

const contactStore = useContactStore()

const loading = ref(false)
const replyLoading = ref(false)
const statusLoading = ref(false)
const showReplyDialog = ref(false)
const showStatusDialog = ref(false)
const currentContact = ref(null)
const newStatus = ref('')
const replyFormRef = ref()

const contacts = computed(() => contactStore.contacts)

const filterForm = reactive({
  status: '',
  category: '',
  priority: '',
  keyword: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const replyForm = reactive({
  status: 'processing',
  reply: ''
})

const replyRules = {
  status: [
    { required: true, message: '请选择处理状态', trigger: 'change' }
  ],
  reply: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '回复内容长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 统计数据
const pendingCount = computed(() => 
  contacts.value.filter(c => c.status === 'pending').length
)

const processingCount = computed(() => 
  contacts.value.filter(c => c.status === 'processing').length
)

const resolvedCount = computed(() => 
  contacts.value.filter(c => c.status === 'resolved').length
)

// 筛选后的联系记录
const filteredContacts = computed(() => {
  let filtered = contacts.value
  
  if (filterForm.status) {
    filtered = filtered.filter(contact => contact.status === filterForm.status)
  }
  
  if (filterForm.category) {
    filtered = filtered.filter(contact => contact.category === filterForm.category)
  }
  
  if (filterForm.priority) {
    filtered = filtered.filter(contact => contact.priority === filterForm.priority)
  }
  
  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase()
    filtered = filtered.filter(contact => 
      contact.subject.toLowerCase().includes(keyword) ||
      contact.username.toLowerCase().includes(keyword)
    )
  }
  
  pagination.total = filtered.length
  
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  
  return filtered.slice(start, end)
})

const handleFilter = () => {
  pagination.currentPage = 1
}

const resetFilter = () => {
  filterForm.status = ''
  filterForm.category = ''
  filterForm.priority = ''
  filterForm.keyword = ''
  pagination.currentPage = 1
}

const handleContact = (contact) => {
  currentContact.value = contact
  
  if (contact.adminReply) {
    // 如果已有回复，显示查看模式
    replyForm.status = contact.status
    replyForm.reply = ''
  } else {
    // 首次处理
    replyForm.status = 'processing'
    replyForm.reply = ''
  }
  
  showReplyDialog.value = true
}

const submitReply = async () => {
  if (!replyFormRef.value) return
  
  await replyFormRef.value.validate(async (valid) => {
    if (valid) {
      replyLoading.value = true
      
      try {
        const result = await contactStore.replyContact(currentContact.value.id, replyForm)
        
        if (result.success) {
          ElMessage.success(result.message)
          showReplyDialog.value = false
          fetchContacts()
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        replyLoading.value = false
      }
    }
  })
}

const changeStatus = (contact) => {
  currentContact.value = contact
  newStatus.value = contact.status
  showStatusDialog.value = true
}

const updateStatus = async () => {
  if (!newStatus.value || newStatus.value === currentContact.value.status) {
    ElMessage.warning('请选择不同的状态')
    return
  }
  
  statusLoading.value = true
  
  try {
    const result = await contactStore.updateContactStatus(currentContact.value.id, newStatus.value)
    
    if (result.success) {
      ElMessage.success(result.message)
      showStatusDialog.value = false
      fetchContacts()
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    statusLoading.value = false
  }
}

const fetchContacts = async () => {
  await contactStore.fetchContacts(true) // true 表示管理员模式
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}

// Store 方法代理
const getStatusType = (status) => contactStore.getStatusType(status)
const getStatusText = (status) => contactStore.getStatusText(status)
const getPriorityType = (priority) => contactStore.getPriorityType(priority)
const getPriorityText = (priority) => contactStore.getPriorityText(priority)
const getCategoryText = (category) => contactStore.getCategoryText(category)

onMounted(() => {
  fetchContacts()
})
</script>

<style lang="scss" scoped>
.contact-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .stats-summary {
      display: flex;
      gap: 12px;
    }
  }
  
  .filter-bar {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  
  .reply-dialog-content {
    .contact-info {
      margin-bottom: 24px;
      
      .problem-description {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 4px;
        white-space: pre-wrap;
        line-height: 1.6;
        border-left: 3px solid #e6a23c;
        max-height: 200px;
        overflow-y: auto;
      }
    }
    
    .reply-form {
      margin-bottom: 24px;
      
      h4 {
        color: #303133;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ebeef5;
      }
    }
    
    .reply-history {
      h4 {
        color: #303133;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ebeef5;
      }
      
      .history-item {
        background: #f0f9ff;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #d1ecf1;
        
        .history-meta {
          margin-bottom: 12px;
          
          .reply-time {
            color: #909399;
            font-size: 12px;
          }
        }
        
        .history-content {
          color: #303133;
          line-height: 1.6;
          white-space: pre-wrap;
        }
      }
    }
  }
}
</style>