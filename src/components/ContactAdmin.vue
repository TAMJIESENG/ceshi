<template>
  <div class="contact-admin">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Service /></el-icon>
          <span>联系管理员</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 提交新请求 -->
        <el-tab-pane label="提交问题" name="submit">
          <div class="submit-form">
            <el-form :model="contactForm" :rules="rules" ref="contactFormRef" label-width="100px">
              <el-form-item label="问题类别" prop="category">
                <el-select v-model="contactForm.category" placeholder="请选择问题类别">
                  <el-option label="技术问题" value="technical" />
                  <el-option label="账户问题" value="account" />
                  <el-option label="支付问题" value="payment" />
                  <el-option label="卡密问题" value="card" />
                  <el-option label="意见建议" value="suggestion" />
                  <el-option label="投诉举报" value="complaint" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="优先级" prop="priority">
                <el-radio-group v-model="contactForm.priority">
                  <el-radio label="low">一般</el-radio>
                  <el-radio label="normal">普通</el-radio>
                  <el-radio label="high">紧急</el-radio>
                  <el-radio label="urgent">非常紧急</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="问题标题" prop="subject">
                <el-input 
                  v-model="contactForm.subject" 
                  placeholder="请简要描述您的问题"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="详细描述" prop="message">
                <el-input
                  v-model="contactForm.message"
                  type="textarea"
                  :rows="6"
                  placeholder="请详细描述您遇到的问题，包括具体操作步骤、错误信息等"
                  maxlength="1000"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="联系邮箱" prop="email">
                <el-input 
                  v-model="contactForm.email" 
                  placeholder="用于接收回复通知"
                  :disabled="true"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
                  <el-icon><Message /></el-icon>
                  提交问题
                </el-button>
                <el-button @click="resetForm">
                  <el-icon><Refresh /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        
        <!-- 我的提交记录 -->
        <el-tab-pane label="提交记录" name="history">
          <div class="contact-history">
            <el-table :data="contacts" style="width: 100%" v-loading="loading">
              <el-table-column prop="subject" label="问题标题" min-width="200" />
              
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
              
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewDetail(scope.row)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 详情查看对话框 -->
    <el-dialog v-model="showDetailDialog" title="问题详情" width="700px">
      <div v-if="viewingContact" class="contact-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="问题标题" :span="2">
            {{ viewingContact.subject }}
          </el-descriptions-item>
          
          <el-descriptions-item label="类别">
            {{ getCategoryText(viewingContact.category) }}
          </el-descriptions-item>
          
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(viewingContact.priority)" size="small">
              {{ getPriorityText(viewingContact.priority) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(viewingContact.status)">
              {{ getStatusText(viewingContact.status) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="提交时间">
            {{ viewingContact.createTime }}
          </el-descriptions-item>
          
          <el-descriptions-item label="问题描述" :span="2">
            <div class="message-content">{{ viewingContact.message }}</div>
          </el-descriptions-item>
        </el-descriptions>
        
        <!-- 管理员回复 -->
        <div v-if="viewingContact.adminReply" class="admin-reply">
          <h4>管理员回复</h4>
          <div class="reply-content">
            <div class="reply-meta">
              <span class="reply-time">回复时间: {{ viewingContact.replyTime }}</span>
            </div>
            <div class="reply-message">{{ viewingContact.adminReply }}</div>
          </div>
        </div>
        
        <div v-else class="no-reply">
          <el-empty description="暂无回复" :image-size="80" />
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useContactStore } from '@/stores/contact'
import { useUserStore } from '@/stores/user'
import { Service, Message, Refresh } from '@element-plus/icons-vue'

const contactStore = useContactStore()
const userStore = useUserStore()

const activeTab = ref('submit')
const submitLoading = ref(false)
const showDetailDialog = ref(false)
const viewingContact = ref(null)
const contactFormRef = ref()

const contacts = computed(() => contactStore.contacts)
const loading = computed(() => contactStore.loading)

const contactForm = reactive({
  category: '',
  priority: 'normal',
  subject: '',
  message: '',
  email: ''
})

const rules = {
  category: [
    { required: true, message: '请选择问题类别', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  subject: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请详细描述问题', trigger: 'blur' },
    { min: 10, max: 1000, message: '描述长度在 10 到 1000 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!contactFormRef.value) return
  
  await contactFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      
      try {
        const currentUser = userStore.user
        if (!currentUser) {
          ElMessage.error('请先登录')
          return
        }
        
        const submitData = {
          ...contactForm,
          userId: currentUser.id,
          username: currentUser.username
        }
        
        const result = await contactStore.submitContact(submitData)
        
        if (result.success) {
          ElMessage.success(result.message)
          resetForm()
          activeTab.value = 'history'
          fetchContacts()
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const resetForm = () => {
  Object.assign(contactForm, {
    category: '',
    priority: 'normal',
    subject: '',
    message: '',
    email: userStore.user?.email || ''
  })
  
  if (contactFormRef.value) {
    contactFormRef.value.clearValidate()
  }
}

const viewDetail = (contact) => {
  viewingContact.value = contact
  showDetailDialog.value = true
}

const fetchContacts = async () => {
  await contactStore.fetchContacts(false) // false 表示普通用户
}

const getStatusType = (status) => {
  return contactStore.getStatusType(status)
}

const getStatusText = (status) => {
  return contactStore.getStatusText(status)
}

const getPriorityType = (priority) => {
  return contactStore.getPriorityType(priority)
}

const getPriorityText = (priority) => {
  return contactStore.getPriorityText(priority)
}

const getCategoryText = (category) => {
  return contactStore.getCategoryText(category)
}

onMounted(() => {
  // 设置默认邮箱
  contactForm.email = userStore.user?.email || ''
  
  // 获取历史记录
  fetchContacts()
})
</script>

<style lang="scss" scoped>
.contact-admin {
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
  
  .submit-form {
    padding: 20px;
  }
  
  .contact-history {
    min-height: 400px;
  }
  
  .contact-detail {
    .message-content {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      white-space: pre-wrap;
      line-height: 1.6;
      border-left: 3px solid #409eff;
    }
    
    .admin-reply {
      margin-top: 24px;
      
      h4 {
        color: #303133;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ebeef5;
      }
      
      .reply-content {
        background: #f0f9ff;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #d1ecf1;
        
        .reply-meta {
          margin-bottom: 12px;
          
          .reply-time {
            color: #909399;
            font-size: 12px;
          }
        }
        
        .reply-message {
          color: #303133;
          line-height: 1.6;
          white-space: pre-wrap;
        }
      }
    }
    
    .no-reply {
      margin-top: 24px;
      text-align: center;
      padding: 20px;
      background: #fafafa;
      border-radius: 8px;
    }
  }
}

.el-tabs {
  :deep(.el-tabs__content) {
    padding: 0;
  }
}
</style>