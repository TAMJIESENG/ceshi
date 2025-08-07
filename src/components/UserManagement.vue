<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><UserFilled /></el-icon>
            添加用户
          </el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <div class="filter-bar">
        <el-form :model="filterForm" inline>
          <el-form-item label="用户角色">
            <el-select v-model="filterForm.role" placeholder="全部角色" clearable>
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="账户状态">
            <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
              <el-option label="正常" value="active" />
              <el-option label="禁用" value="disabled" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="搜索用户">
            <el-input 
              v-model="filterForm.keyword" 
              placeholder="用户名或邮箱"
              clearable
              @keyup.enter="handleFilter"
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
      
      <!-- 用户表格 -->
      <el-table :data="filteredUsers" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column prop="username" label="用户名" min-width="120" />
        
        <el-table-column prop="email" label="邮箱" min-width="180" />
        
        <el-table-column prop="realName" label="真实姓名" width="120">
          <template #default="scope">
            {{ scope.row.realName || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getUserStatusType(scope.row.status)">
              {{ getUserStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="scope">
            <span class="balance-text">¥{{ (scope.row.balance || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="registerTime" label="注册时间" width="160" />
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editUser(scope.row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="editBalance(scope.row)">
              余额
            </el-button>
            <el-button type="warning" size="small" @click="resetPassword(scope.row)">
              重置密码
            </el-button>
            <el-button 
              :type="scope.row.status === 'active' ? 'danger' : 'success'"
              size="small"
              @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button 
              type="info" 
              size="small"
              @click="viewUserDetail(scope.row)"
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
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="editingUser ? '编辑用户' : '添加用户'" 
      width="600px"
      @close="resetUserForm"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="userForm.username" 
            placeholder="请输入用户名"
            :disabled="!!editingUser"
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input 
            v-model="userForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="真实姓名">
          <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        
        <el-form-item label="用户角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio label="user">普通用户</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="账户状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="初始余额" v-if="!editingUser">
          <el-input-number 
            v-model="userForm.balance" 
            :min="0" 
            :precision="2"
            placeholder="请输入初始余额"
          />
        </el-form-item>
        
        <el-form-item label="会员等级">
          <el-select v-model="userForm.level" placeholder="请选择会员等级">
            <el-option label="普通" value="普通" />
            <el-option label="VIP" value="VIP" />
            <el-option label="SVIP" value="SVIP" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUserSubmit" :loading="submitLoading">
          {{ editingUser ? '更新' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 余额管理对话框 -->
    <el-dialog v-model="showBalanceDialog" title="用户余额管理" width="600px">
      <div v-if="balanceUser" class="balance-management">
        <div class="current-balance">
          <h3>当前余额信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ balanceUser.username }}</el-descriptions-item>
            <el-descriptions-item label="当前余额">
              <span class="balance-text">¥{{ (balanceUser.balance || 0).toFixed(2) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="上次更新">{{ balanceUser.lastBalanceUpdate || '从未更新' }}</el-descriptions-item>
            <el-descriptions-item label="会员等级">{{ balanceUser.level || '普通' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="balance-operation">
          <h3>余额操作</h3>
          <el-form :model="balanceForm" label-width="100px">
            <el-form-item label="操作类型">
              <el-radio-group v-model="balanceForm.operationType">
                <el-radio label="set">设置余额</el-radio>
                <el-radio label="add">增加余额</el-radio>
                <el-radio label="subtract">扣除余额</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="金额">
              <el-input-number 
                v-model="balanceForm.amount" 
                :min="0" 
                :precision="2"
                placeholder="请输入金额"
                style="width: 200px;"
              />
              <span v-if="balanceForm.operationType === 'set'" style="margin-left: 10px; color: #909399;">
                最终余额: ¥{{ balanceForm.amount ? balanceForm.amount.toFixed(2) : '0.00' }}
              </span>
              <span v-else-if="balanceForm.operationType === 'add'" style="margin-left: 10px; color: #67C23A;">
                最终余额: ¥{{ ((balanceUser.balance || 0) + (balanceForm.amount || 0)).toFixed(2) }}
              </span>
              <span v-else-if="balanceForm.operationType === 'subtract'" style="margin-left: 10px; color: #F56C6C;">
                最终余额: ¥{{ Math.max(0, (balanceUser.balance || 0) - (balanceForm.amount || 0)).toFixed(2) }}
              </span>
            </el-form-item>
            
            <el-form-item label="变更原因">
              <el-input 
                v-model="balanceForm.reason" 
                type="textarea"
                :rows="3"
                placeholder="请输入余额变更原因（必填）"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
        
        <div class="balance-history">
          <h3>最近余额变更记录</h3>
          <el-table :data="userBalanceHistory" style="width: 100%" max-height="300">
            <el-table-column prop="createTime" label="时间" width="160" />
            <el-table-column prop="oldBalance" label="原余额" width="100">
              <template #default="scope">
                ¥{{ scope.row.oldBalance.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="newBalance" label="新余额" width="100">
              <template #default="scope">
                ¥{{ scope.row.newBalance.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="change" label="变更" width="100">
              <template #default="scope">
                <span :class="{ 'positive-change': scope.row.change > 0, 'negative-change': scope.row.change < 0 }">
                  {{ scope.row.change > 0 ? '+' : '' }}{{ scope.row.change.toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" />
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showBalanceDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleBalanceUpdate"
          :loading="balanceLoading"
          :disabled="!balanceForm.amount || !balanceForm.reason"
        >
          确认更新
        </el-button>
      </template>
    </el-dialog>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="用户详情" width="700px">
      <div v-if="viewingUser" class="user-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">
            {{ viewingUser.id }}
          </el-descriptions-item>
          
          <el-descriptions-item label="用户名">
            {{ viewingUser.username }}
          </el-descriptions-item>
          
          <el-descriptions-item label="邮箱">
            {{ viewingUser.email }}
          </el-descriptions-item>
          
          <el-descriptions-item label="真实姓名">
            {{ viewingUser.realName || '-' }}
          </el-descriptions-item>
          
          <el-descriptions-item label="手机号">
            {{ viewingUser.phone || '-' }}
          </el-descriptions-item>
          
          <el-descriptions-item label="用户角色">
            <el-tag :type="viewingUser.role === 'admin' ? 'danger' : 'primary'">
              {{ viewingUser.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="账户状态">
            <el-tag :type="getUserStatusType(viewingUser.status)">
              {{ getUserStatusText(viewingUser.status) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="账户余额">
            <span class="balance-text">¥{{ (viewingUser.balance || 0).toFixed(2) }}</span>
          </el-descriptions-item>
          
          <el-descriptions-item label="会员等级">
            <el-tag :type="getLevelType(viewingUser.level)">
              {{ viewingUser.level || '普通' }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="邮箱验证">
            <el-tag :type="viewingUser.emailVerified ? 'success' : 'warning'">
              {{ viewingUser.emailVerified ? '已验证' : '未验证' }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="两步验证">
            <el-tag :type="viewingUser.twoFactorEnabled ? 'success' : 'info'">
              {{ viewingUser.twoFactorEnabled ? '已开启' : '未开启' }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="注册时间">
            {{ viewingUser.registerTime }}
          </el-descriptions-item>
          
          <el-descriptions-item label="个人简介" :span="2">
            {{ viewingUser.bio || '暂无个人简介' }}
          </el-descriptions-item>
        </el-descriptions>
        
        <!-- 用户操作历史 -->
        <div class="user-history">
          <h4>操作记录</h4>
          <el-table :data="userHistory" style="width: 100%">
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="time" label="时间" />
          </el-table>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { UserFilled, Search, Refresh } from '@element-plus/icons-vue'

const userStore = useUserStore()

const loading = ref(false)
const submitLoading = ref(false)
const balanceLoading = ref(false)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const showBalanceDialog = ref(false)
const editingUser = ref(null)
const viewingUser = ref(null)
const balanceUser = ref(null)
const userFormRef = ref()

const users = ref([])
const userHistory = ref([])
const userBalanceHistory = ref([])

const filterForm = reactive({
  role: '',
  status: '',
  keyword: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const userForm = reactive({
  username: '',
  email: '',
  password: '',
  realName: '',
  phone: '',
  role: 'user',
  status: 'active',
  balance: 0,
  level: '普通'
})

const balanceForm = reactive({
  operationType: 'set',
  amount: 0,
  reason: ''
})

const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择账户状态', trigger: 'change' }
  ]
}

const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (filterForm.role) {
    filtered = filtered.filter(user => user.role === filterForm.role)
  }
  
  if (filterForm.status) {
    filtered = filtered.filter(user => user.status === filterForm.status)
  }
  
  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      (user.realName && user.realName.toLowerCase().includes(keyword))
    )
  }
  
  pagination.total = filtered.length
  
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  
  return filtered.slice(start, end)
})

const getUserStatusType = (status) => {
  return status === 'active' ? 'success' : 'danger'
}

const getUserStatusText = (status) => {
  return status === 'active' ? '正常' : '禁用'
}

const getLevelType = (level) => {
  const typeMap = {
    'VIP': 'warning',
    'SVIP': 'success',
    '普通': 'info'
  }
  return typeMap[level] || 'info'
}

const fetchUsers = () => {
  loading.value = true
  
  try {
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    users.value = allUsers
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  pagination.currentPage = 1
}

const resetFilter = () => {
  filterForm.role = ''
  filterForm.status = ''
  filterForm.keyword = ''
  pagination.currentPage = 1
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username,
    email: user.email,
    realName: user.realName || '',
    phone: user.phone || '',
    role: user.role,
    status: user.status || 'active',
    level: user.level || '普通'
  })
  showAddDialog.value = true
}

const handleUserSubmit = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      
      try {
        const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
        
        if (editingUser.value) {
          // 编辑用户
          const userIndex = allUsers.findIndex(u => String(u.id) === String(editingUser.value.id))
          if (userIndex !== -1) {
            allUsers[userIndex] = {
              ...allUsers[userIndex],
              email: userForm.email,
              realName: userForm.realName,
              phone: userForm.phone,
              role: userForm.role,
              status: userForm.status,
              level: userForm.level
            }
            
            // 如果修改的是当前登录用户，同时更新 user_data
            const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
            if (currentUser.id && String(currentUser.id) === String(editingUser.value.id)) {
              const updatedCurrentUser = {
                ...currentUser,
                email: userForm.email,
                realName: userForm.realName,
                phone: userForm.phone,
                role: userForm.role,
                status: userForm.status,
                level: userForm.level
              }
              localStorage.setItem('user_data', JSON.stringify(updatedCurrentUser))
            }
            
            ElMessage.success('用户更新成功')
          } else {
            ElMessage.error('未找到要编辑的用户')
            return
          }
        } else {
          // 添加用户
          const existingUser = allUsers.find(u => 
            u.username === userForm.username || u.email === userForm.email
          )
          
          if (existingUser) {
            ElMessage.error('用户名或邮箱已存在')
            return
          }
          
          const newUser = {
            id: Date.now(),
            username: userForm.username,
            email: userForm.email,
            password: userForm.password,
            realName: userForm.realName,
            phone: userForm.phone,
            role: userForm.role,
            status: userForm.status,
            balance: userForm.balance,
            level: userForm.level,
            registerTime: new Date().toLocaleString('zh-CN'),
            twoFactorEnabled: false,
            emailVerified: false
          }
          
          allUsers.push(newUser)
          ElMessage.success('用户添加成功')
        }
        
        localStorage.setItem('all_users', JSON.stringify(allUsers))
        showAddDialog.value = false
        fetchUsers()
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const resetPassword = async (user) => {
  try {
    const { value: newPassword } = await ElMessageBox.prompt(
      `为用户 "${user.username}" 设置新密码:`,
      '重置密码',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /.{6,}/,
        inputErrorMessage: '密码长度至少 6 个字符'
      }
    )
    
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    const userIndex = allUsers.findIndex(u => String(u.id) === String(user.id))
    
    if (userIndex !== -1) {
      allUsers[userIndex].password = newPassword
      localStorage.setItem('all_users', JSON.stringify(allUsers))
      
      // 如果修改的是当前登录用户的密码，需要提示重新登录
      const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
      if (currentUser.id && String(currentUser.id) === String(user.id)) {
        ElMessage.warning('您的密码已被重置，请重新登录')
      } else {
        ElMessage.success('密码重置成功')
      }
    } else {
      ElMessage.error('未找到要重置密码的用户')
    }
  } catch {
    // 用户取消操作
  }
}

const toggleUserStatus = async (user) => {
  try {
    const action = user.status === 'active' ? '禁用' : '启用'
    await ElMessageBox.confirm(
      `确认${action}用户 "${user.username}"？`,
      `确认${action}`,
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    const userIndex = allUsers.findIndex(u => String(u.id) === String(user.id))
    
    if (userIndex !== -1) {
      const newStatus = user.status === 'active' ? 'disabled' : 'active'
      allUsers[userIndex].status = newStatus
      localStorage.setItem('all_users', JSON.stringify(allUsers))
      
      // 如果修改的是当前登录用户，同时更新 user_data
      const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
      if (currentUser.id && String(currentUser.id) === String(user.id)) {
        const updatedCurrentUser = {
          ...currentUser,
          status: newStatus
        }
        localStorage.setItem('user_data', JSON.stringify(updatedCurrentUser))
        
        if (newStatus === 'disabled') {
          ElMessage.warning('您的账户已被禁用，请联系管理员')
        }
      }
      
      // 更新本地显示
      user.status = newStatus
      ElMessage.success(`用户${action}成功`)
    } else {
      ElMessage.error('未找到要修改状态的用户')
    }
  } catch {
    // 用户取消操作
  }
}

const viewUserDetail = (user) => {
  viewingUser.value = user
  
  // 模拟用户操作历史
  userHistory.value = [
    {
      action: '登录',
      description: '用户登录系统',
      time: new Date().toLocaleString('zh-CN')
    },
    {
      action: '修改资料',
      description: '更新个人信息',
      time: new Date(Date.now() - 86400000).toLocaleString('zh-CN')
    }
  ]
  
  showDetailDialog.value = true
}

const editBalance = (user) => {
  balanceUser.value = user
  balanceForm.operationType = 'set'
  balanceForm.amount = user.balance || 0
  balanceForm.reason = ''
  
  // 获取用户余额历史
  userBalanceHistory.value = userStore.getBalanceHistory(user.id)
  
  showBalanceDialog.value = true
}

const handleBalanceUpdate = async () => {
  if (!balanceForm.amount || !balanceForm.reason) {
    ElMessage.error('请填写完整信息')
    return
  }

  balanceLoading.value = true
  
  try {
    let newBalance = 0
    const currentBalance = balanceUser.value.balance || 0
    
    switch (balanceForm.operationType) {
      case 'set':
        newBalance = balanceForm.amount
        break
      case 'add':
        newBalance = currentBalance + balanceForm.amount
        break
      case 'subtract':
        newBalance = Math.max(0, currentBalance - balanceForm.amount)
        break
    }
    
    const result = await userStore.updateUserBalance(
      balanceUser.value.id, 
      newBalance, 
      balanceForm.reason
    )
    
    if (result.success) {
      ElMessage.success(result.message)
      
      // 更新本地用户数据
      balanceUser.value.balance = newBalance
      const userIndex = users.value.findIndex(u => u.id === balanceUser.value.id)
      if (userIndex !== -1) {
        users.value[userIndex].balance = newBalance
      }
      
      // 如果修改的是当前登录用户的余额，需要刷新当前用户数据
      if (userStore.user && String(userStore.user.id) === String(balanceUser.value.id)) {
        userStore.refreshCurrentUser()
      }
      
      // 刷新余额历史
      userBalanceHistory.value = userStore.getBalanceHistory(balanceUser.value.id)
      
      showBalanceDialog.value = false
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('更新余额失败')
  } finally {
    balanceLoading.value = false
  }
}

const resetUserForm = () => {
  editingUser.value = null
  Object.assign(userForm, {
    username: '',
    email: '',
    password: '',
    realName: '',
    phone: '',
    role: 'user',
    status: 'active',
    balance: 0,
    level: '普通'
  })
  
  if (userFormRef.value) {
    userFormRef.value.clearValidate()
  }
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped>
.user-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .filter-bar {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .balance-text {
    font-weight: bold;
    color: #E6A23C;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  
  .user-detail {
    .user-history {
      margin-top: 24px;
      
      h4 {
        margin-bottom: 16px;
        color: #303133;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 8px;
      }
    }
  }
  
  .balance-management {
    .current-balance, .balance-operation, .balance-history {
      margin-bottom: 24px;
      
      h3 {
        margin-bottom: 16px;
        color: #303133;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 8px;
      }
    }
    
    .positive-change {
      color: #67C23A;
      font-weight: bold;
    }
    
    .negative-change {
      color: #F56C6C;
      font-weight: bold;
    }
  }
}
</style>