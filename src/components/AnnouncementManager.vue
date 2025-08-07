<template>
  <div class="announcement-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>公告管理</span>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>
            发布公告
          </el-button>
        </div>
      </template>
      
      <el-table :data="announcements" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="200" />
        
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.type)">
              {{ getAnnouncementTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag 
              :type="scope.row.priority === 'high' ? 'danger' : scope.row.priority === 'normal' ? 'warning' : 'info'"
              size="small"
            >
              {{ getPriorityText(scope.row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="showOnHome" label="首页显示" width="100">
          <template #default="scope">
            <el-switch 
              v-model="scope.row.showOnHome" 
              @change="updateShowOnHome(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="author" label="作者" width="100" />
        
        <el-table-column prop="createTime" label="创建时间" width="160" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editAnnouncement(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="viewAnnouncement(scope.row)">
              查看
            </el-button>
            <el-button type="danger" size="small" @click="deleteAnnouncement(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 创建/编辑公告对话框 -->
    <el-dialog 
      v-model="showCreateDialog" 
      :title="editingAnnouncement ? '编辑公告' : '发布公告'" 
      width="700px"
      @close="resetForm"
    >
      <el-form :model="announcementForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="公告标题" prop="title">
          <el-input 
            v-model="announcementForm.title" 
            placeholder="请输入公告标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="announcementForm.type" placeholder="请选择公告类型">
            <el-option label="通知" value="info" />
            <el-option label="成功" value="success" />
            <el-option label="警告" value="warning" />
            <el-option label="错误" value="error" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="announcementForm.priority">
            <el-radio label="high">高优先级</el-radio>
            <el-radio label="normal">普通</el-radio>
            <el-radio label="low">低优先级</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="显示设置">
          <el-checkbox v-model="announcementForm.showOnHome">
            在首页显示
          </el-checkbox>
        </el-form-item>
        
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="announcementForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入公告内容，支持HTML标签"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="内容预览">
          <div class="content-preview" v-html="announcementForm.content"></div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ editingAnnouncement ? '更新' : '发布' }}
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 查看公告对话框 -->
    <el-dialog v-model="showViewDialog" title="查看公告" width="600px">
      <div v-if="viewingAnnouncement" class="announcement-view">
        <div class="announcement-header">
          <h2>{{ viewingAnnouncement.title }}</h2>
          <div class="announcement-meta">
            <el-tag :type="getTagType(viewingAnnouncement.type)">
              {{ getAnnouncementTypeText(viewingAnnouncement.type) }}
            </el-tag>
            <span class="meta-info">
              作者: {{ viewingAnnouncement.author }} | 
              发布时间: {{ viewingAnnouncement.createTime }}
            </span>
          </div>
        </div>
        
        <div class="announcement-content" v-html="viewingAnnouncement.content"></div>
      </div>
      
      <template #footer>
        <el-button @click="showViewDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAnnouncementStore } from '@/stores/announcement'
import { useUserStore } from '@/stores/user'
import { Plus } from '@element-plus/icons-vue'

const announcementStore = useAnnouncementStore()
const userStore = useUserStore()

const loading = ref(false)
const submitLoading = ref(false)
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const editingAnnouncement = ref(null)
const viewingAnnouncement = ref(null)
const formRef = ref()

const announcements = ref([])

const announcementForm = reactive({
  title: '',
  content: '',
  type: 'info',
  priority: 'normal',
  showOnHome: false
})

const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { min: 10, max: 2000, message: '内容长度在 10 到 2000 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择公告类型', trigger: 'change' }
  ]
}

const getTagType = (type) => {
  const typeMap = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return typeMap[type] || 'primary'
}

const getAnnouncementTypeText = (type) => {
  return announcementStore.getAnnouncementTypeText(type)
}

const getPriorityText = (priority) => {
  return announcementStore.getPriorityText(priority)
}

const fetchAnnouncements = async () => {
  loading.value = true
  const result = await announcementStore.fetchAnnouncements()
  if (result.success) {
    announcements.value = announcementStore.announcements
  }
  loading.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      
      try {
        const formData = {
          ...announcementForm,
          author: userStore.user?.username || 'admin'
        }
        
        let result
        if (editingAnnouncement.value) {
          result = await announcementStore.updateAnnouncement(editingAnnouncement.value.id, formData)
        } else {
          result = await announcementStore.createAnnouncement(formData)
        }
        
        if (result.success) {
          ElMessage.success(result.message)
          showCreateDialog.value = false
          fetchAnnouncements()
        } else {
          ElMessage.error(result.message)
        }
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const editAnnouncement = (announcement) => {
  editingAnnouncement.value = announcement
  Object.assign(announcementForm, {
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    priority: announcement.priority,
    showOnHome: announcement.showOnHome
  })
  showCreateDialog.value = true
}

const viewAnnouncement = (announcement) => {
  viewingAnnouncement.value = announcement
  showViewDialog.value = true
}

const deleteAnnouncement = async (announcement) => {
  try {
    await ElMessageBox.confirm(
      `确认删除公告 "${announcement.title}"？`,
      '确认删除',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await announcementStore.deleteAnnouncement(announcement.id)
    
    if (result.success) {
      ElMessage.success(result.message)
      fetchAnnouncements()
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // 用户取消删除
  }
}

const updateShowOnHome = async (announcement) => {
  const result = await announcementStore.updateAnnouncement(announcement.id, {
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    priority: announcement.priority,
    showOnHome: announcement.showOnHome
  })
  
  if (result.success) {
    ElMessage.success('设置已更新')
  } else {
    ElMessage.error(result.message)
    // 恢复原状态
    announcement.showOnHome = !announcement.showOnHome
  }
}

const resetForm = () => {
  editingAnnouncement.value = null
  Object.assign(announcementForm, {
    title: '',
    content: '',
    type: 'info',
    priority: 'normal',
    showOnHome: false
  })
  
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

onMounted(() => {
  fetchAnnouncements()
})
</script>

<style lang="scss" scoped>
.announcement-manager {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .content-preview {
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    background: #f8f9fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    
    :deep(h1), :deep(h2), :deep(h3) {
      margin-top: 16px;
      margin-bottom: 8px;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    :deep(p) {
      margin-bottom: 8px;
      line-height: 1.6;
    }
    
    :deep(ul), :deep(ol) {
      margin-left: 20px;
      margin-bottom: 8px;
    }
  }
}

.announcement-view {
  .announcement-header {
    margin-bottom: 24px;
    
    h2 {
      margin-bottom: 12px;
      color: #303133;
    }
    
    .announcement-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .meta-info {
        color: #909399;
        font-size: 14px;
      }
    }
  }
  
  .announcement-content {
    line-height: 1.8;
    color: #606266;
    
    :deep(h1), :deep(h2), :deep(h3) {
      margin-top: 24px;
      margin-bottom: 12px;
      color: #303133;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    :deep(p) {
      margin-bottom: 12px;
    }
    
    :deep(ul), :deep(ol) {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    
    :deep(code) {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    
    :deep(blockquote) {
      border-left: 4px solid #409eff;
      padding-left: 16px;
      margin: 16px 0;
      color: #606266;
      background: #f8f9fa;
      padding: 12px 16px;
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>