<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="240px">
        <div class="sidebar">
          <div class="sidebar-header">
            <h3>管理后台</h3>
          </div>
          
          <el-menu
            :default-active="activeMenu"
            class="sidebar-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="dashboard">
              <el-icon><Odometer /></el-icon>
              <span>数据概览</span>
            </el-menu-item>
            
            <el-menu-item index="users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            
            <el-menu-item index="zones">
              <el-icon><Box /></el-icon>
              <span>专区管理</span>
            </el-menu-item>
            
            <el-menu-item index="cards">
              <el-icon><Key /></el-icon>
              <span>卡密管理</span>
            </el-menu-item>
            
            <el-menu-item index="orders">
              <el-icon><ShoppingCart /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            
            <el-menu-item index="vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M6,2L8,6L12,7L8,8L6,12L4,8L0,7L4,6L6,2M12,8L13.5,11L17,12L13.5,13L12,16L10.5,13L7,12L10.5,11L12,8M19,2L20.5,5L24,6L20.5,7L19,10L17.5,7L14,6L17.5,5L19,2Z"/>
              </svg>
              <span>VIP管理</span>
            </el-menu-item>
            
            <el-menu-item index="announcements">
              <el-icon><Bell /></el-icon>
              <span>公告管理</span>
            </el-menu-item>
            
            <el-menu-item index="contacts">
              <el-icon><Service /></el-icon>
              <span>用户反馈</span>
            </el-menu-item>
            
            <el-menu-item index="finance">
              <el-icon><Wallet /></el-icon>
              <span>财务管理</span>
            </el-menu-item>
            
            <el-menu-item index="payment">
              <el-icon><CreditCard /></el-icon>
              <span>支付设置</span>
            </el-menu-item>
            
            <el-menu-item index="maintenance">
              <el-icon><Tools /></el-icon>
              <span>服务器维护</span>
            </el-menu-item>
            
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>安全监控</span>
            </el-menu-item>
            
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      
      <el-container>
        <el-header>
          <div class="header-content">
            <h2>{{ getPageTitle() }}</h2>
            <div class="header-actions">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  管理员
                  <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="home">返回首页</el-dropdown-item>
                    <el-dropdown-item command="dashboard">个人中心</el-dropdown-item>
                    <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        
        <el-main>
          <!-- 数据概览 -->
          <div v-if="activeMenu === 'dashboard'" class="admin-content">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="stats-card">
                  <div class="stats-item">
                    <el-icon class="stats-icon" color="#409eff"><User /></el-icon>
                    <div class="stats-content">
                      <h3>{{ adminStats.totalUsers }}</h3>
                      <p>总用户数</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="6">
                <el-card class="stats-card">
                  <div class="stats-item">
                    <el-icon class="stats-icon" color="#67C23A"><Key /></el-icon>
                    <div class="stats-content">
                      <h3>{{ adminStats.totalCards }}</h3>
                      <p>总卡密数</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="6">
                <el-card class="stats-card">
                  <div class="stats-item">
                    <el-icon class="stats-icon" color="#E6A23C"><ShoppingCart /></el-icon>
                    <div class="stats-content">
                      <h3>{{ adminStats.totalOrders }}</h3>
                      <p>总订单数</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="6">
                <el-card class="stats-card">
                  <div class="stats-item">
                    <el-icon class="stats-icon" color="#F56C6C"><Wallet /></el-icon>
                    <div class="stats-content">
                      <h3>¥{{ adminStats.totalRevenue }}</h3>
                      <p>总收入</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            
            <el-row :gutter="20" class="mt-20">
              <el-col :span="12">
                <el-card>
                  <template #header>
                    <span>最近订单</span>
                  </template>
                  
                  <el-table :data="recentOrders" style="width: 100%">
                    <el-table-column prop="id" label="订单号" width="120" />
                    <el-table-column prop="username" label="用户" />
                    <el-table-column prop="amount" label="金额" />
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag :type="getOrderStatusType(scope.row.status)">
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
              
              <el-col :span="12">
                <el-card>
                  <template #header>
                    <span>系统日志</span>
                  </template>
                  
                  <el-timeline>
                    <el-timeline-item
                      v-for="log in systemLogs"
                      :key="log.id"
                      :timestamp="log.time"
                      :type="getLogType(log.level)"
                    >
                      {{ log.message }}
                    </el-timeline-item>
                  </el-timeline>
                </el-card>
              </el-col>
            </el-row>
          </div>
          
          <!-- 用户管理 -->
          <div v-if="activeMenu === 'users'" class="admin-content">
            <UserManagement />
          </div>
          
          <!-- 专区管理 -->
          <div v-if="activeMenu === 'zones'" class="admin-content">
            <ZoneManagement />
          </div>
          
          <!-- 卡密管理 -->
          <div v-if="activeMenu === 'cards'" class="admin-content">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>卡密列表</span>
                  <div class="header-actions">
                    <el-button 
                      v-if="selectedCards.length > 0"
                      type="danger" 
                      @click="handleBatchDelete"
                      :loading="batchDeleteLoading"
                    >
                      <el-icon><Delete /></el-icon>
                      批量删除 ({{ selectedCards.length }})
                    </el-button>
                    <el-button type="success" @click="showImportDialog = true">
                      <el-icon><Upload /></el-icon>
                      导入卡密
                    </el-button>
                    <el-button type="primary" @click="showGenerateDialog = true">
                      <el-icon><Plus /></el-icon>
                      批量生成
                    </el-button>
                    <el-button type="info" @click="exportAllCards">
                      <el-icon><Download /></el-icon>
                      导出卡密
                    </el-button>
                  </div>
                </div>
              </template>
              
              <el-table 
                :data="cardList" 
                style="width: 100%"
                @selection-change="handleSelectionChange"
                ref="cardTableRef"
              >
                <el-table-column 
                  type="selection" 
                  width="55"
                  :selectable="row => row.status === 'unused'"
                />
                <el-table-column prop="cardNumber" label="卡号" width="180" />
                <el-table-column prop="cardType" label="类型" width="100" />
                <el-table-column prop="value" label="面值" width="100" />
                <el-table-column prop="zoneName" label="所属专区" width="120" />
                <el-table-column prop="productName" label="关联商品" width="160" />
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag :type="getCardStatusType(scope.row.status)">
                      {{ getCardStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="useTime" label="使用时间" />
                <el-table-column label="操作" width="150">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="viewCard(scope.row)">
                      查看
                    </el-button>
                    <el-button 
                      v-if="scope.row.status === 'unused'"
                      type="danger" 
                      size="small"
                      @click="deleteCard(scope.row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <!-- 批量操作提示 -->
              <div v-if="selectedCards.length > 0" class="batch-operation-tip">
                <el-alert
                  :title="'已选择 ' + selectedCards.length + ' 个卡密，只有未使用状态的卡密可以删除'"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <div class="batch-tip-actions">
                      <el-button size="small" @click="selectAllUnused">选择所有未使用</el-button>
                      <el-button size="small" @click="clearSelection">清空选择</el-button>
                    </div>
                  </template>
                </el-alert>
              </div>
            </el-card>
          </div>
          
          <!-- 订单管理 -->
          <div v-if="activeMenu === 'orders'" class="admin-content">
            <OrderManagement />
          </div>
          
          <!-- VIP管理 -->
          <div v-if="activeMenu === 'vip'" class="admin-content">
            <VipManagement />
          </div>
          
          <!-- 公告管理 -->
          <div v-if="activeMenu === 'announcements'" class="admin-content">
            <AnnouncementManager />
          </div>
          
          <!-- 用户反馈 -->
          <div v-if="activeMenu === 'contacts'" class="admin-content">
            <ContactManagement />
          </div>
          
          <!-- 服务器维护 -->
          <div v-if="activeMenu === 'maintenance'" class="admin-content">
            <ServerMaintenance />
          </div>
          
          <!-- 安全监控 -->
          <div v-if="activeMenu === 'security'" class="admin-content">
            <SecurityDashboard />
          </div>
          
          <!-- 财务管理 -->
          <div v-if="activeMenu === 'finance'" class="admin-content">
            <el-card>
              <template #header>
                <span>财务管理</span>
              </template>
              
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-card class="stats-card">
                    <div class="stats-item">
                      <el-icon class="stats-icon" color="#67C23A"><Wallet /></el-icon>
                      <div class="stats-content">
                        <h3>¥{{ financeStats.totalRevenue }}</h3>
                        <p>总收入</p>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                
                <el-col :span="6">
                  <el-card class="stats-card">
                    <div class="stats-item">
                      <el-icon class="stats-icon" color="#E6A23C"><Wallet /></el-icon>
                      <div class="stats-content">
                        <h3>¥{{ financeStats.todayRevenue }}</h3>
                        <p>今日收入</p>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                
                <el-col :span="6">
                  <el-card class="stats-card">
                    <div class="stats-item">
                      <el-icon class="stats-icon" color="#409EFF"><ShoppingCart /></el-icon>
                      <div class="stats-content">
                        <h3>{{ financeStats.totalTransactions }}</h3>
                        <p>总交易数</p>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                
                <el-col :span="6">
                  <el-card class="stats-card">
                    <div class="stats-item">
                      <el-icon class="stats-icon" color="#F56C6C"><Wallet /></el-icon>
                      <div class="stats-content">
                        <h3>¥{{ financeStats.pendingAmount }}</h3>
                        <p>待结算</p>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              
              <div class="finance-content">
                <p style="text-align: center; color: #909399; margin: 40px 0;">
                  财务详细功能开发中...
                </p>
              </div>
            </el-card>
          </div>
          
          <!-- 支付设置 -->
          <div v-if="activeMenu === 'payment'" class="admin-content">
            <PaymentSettings />
          </div>
          
          <!-- 系统设置 -->
          <div v-if="activeMenu === 'settings'" class="admin-content">
            <el-card>
              <template #header>
                <span>系统设置</span>
              </template>
              
              <el-tabs type="border-card">
                <el-tab-pane label="基础设置">
                  <el-form :model="systemSettings" label-width="120px">
                    <el-form-item label="网站名称">
                      <el-input v-model="systemSettings.siteName" />
                    </el-form-item>
                    
                    <el-form-item label="网站描述">
                      <el-input v-model="systemSettings.siteDescription" type="textarea" />
                    </el-form-item>
                    
                    <el-form-item label="允许注册">
                      <el-switch v-model="systemSettings.allowRegister" />
                    </el-form-item>
                    
                    <el-form-item label="邮箱验证">
                      <el-switch v-model="systemSettings.emailVerification" />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="价格设置">
                  <el-form :model="priceSettings" label-width="120px">
                    <el-form-item label="月卡价格">
                      <el-input-number v-model="priceSettings.monthlyPrice" :precision="2" :min="0" />
                    </el-form-item>
                    
                    <el-form-item label="季卡价格">
                      <el-input-number v-model="priceSettings.quarterlyPrice" :precision="2" :min="0" />
                    </el-form-item>
                    
                    <el-form-item label="年卡价格">
                      <el-input-number v-model="priceSettings.yearlyPrice" :precision="2" :min="0" />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="安全设置">
                  <div class="security-settings">
                    <el-alert
                      title="安全功能已启用"
                      type="success"
                      :closable="false"
                      show-icon
                    >
                      <template #default>
                        <p>系统已集成多层安全保护功能：</p>
                        <ul>
                          <li>密码哈希加密 (PBKDF2)</li>
                          <li>登录限流机制</li>
                          <li>输入数据验证和过滤</li>
                          <li>CSRF保护</li>
                          <li>操作日志记录</li>
                        </ul>
                        <div style="margin-top: 16px;">
                          <el-button type="primary" @click="activeMenu = 'security'">
                            查看安全监控
                          </el-button>
                        </div>
                      </template>
                    </el-alert>
                  </div>
                </el-tab-pane>
              </el-tabs>
              
              <div class="settings-actions">
                <el-button type="primary" @click="saveSettings">
                  保存设置
                </el-button>
                <el-button @click="resetSettings">
                  重置设置
                </el-button>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
    
    <!-- 添加用户对话框 -->
    <el-dialog v-model="showAddUserDialog" title="添加用户" width="500px">
      <el-form :model="newUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newUser.email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newUser.password" type="password" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="newUser.role">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddUserDialog = false">取消</el-button>
        <el-button type="primary" @click="addUser">确认</el-button>
      </template>
    </el-dialog>
    
    <!-- 批量生成卡密对话框 -->
    <el-dialog v-model="showGenerateDialog" title="批量生成卡密" width="600px">
      <el-form :model="generateForm" label-width="100px">
        <el-form-item label="选择专区" required>
          <div style="display: flex; gap: 10px;">
            <el-select 
              v-model="generateForm.zoneId" 
              placeholder="请选择专区"
              @change="handleZoneChange"
              style="flex: 1"
            >
              <el-option 
                v-for="zone in availableZones" 
                :key="zone.id" 
                :label="zone.name + (zone.isDetected ? ` (检测到${zone.cardCount}张卡密)` : ' (默认)')" 
                :value="zone.id" 
              />
            </el-select>
            <el-button 
              @click="refreshZonesAndProducts"
              :loading="refreshLoading"
              title="重新检测现有专区和商品"
              size="default"
            >
              <el-icon><RefreshRight /></el-icon>
              刷新检测
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="选择商品" required>
          <el-select 
            v-model="generateForm.productId" 
            placeholder="请先选择专区"
            :disabled="!generateForm.zoneId"
            @change="handleProductChange"
            style="width: 100%"
          >
            <el-option 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :label="product.name + ' (¥' + product.price + ')' + (product.isDetected ? ` - 检测到${product.cardCount}张卡密` : ' - 默认')" 
              :value="product.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="卡密类型" required>
          <el-select 
            v-model="generateForm.cardTypeId" 
            placeholder="请先选择商品"
            :disabled="!generateForm.productId || !currentProductCardTypes.length"
            style="width: 100%"
          >
            <el-option 
              v-for="cardType in currentProductCardTypes" 
              :key="cardType.id" 
              :label="`${cardType.name} (${cardType.duration}) - 库存: ${getCardTypeStock(cardType.id)}张`" 
              :value="cardType.id" 
            />
          </el-select>
          <div v-if="generateForm.productId && !currentProductCardTypes.length" class="empty-card-types-hint">
            <el-text type="warning" size="small">该商品尚未配置卡密类型，请前往专区管理中配置</el-text>
          </div>
        </el-form-item>
        
        <el-form-item label="生成数量">
          <el-input-number 
            v-model="generateForm.quantity" 
            :min="1" 
            :max="1000" 
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="面值">
          <el-input 
            v-model="generateForm.value" 
            placeholder="请输入面值金额"
            style="width: 100%"
          />
        </el-form-item>
        
        <!-- 预览信息 -->
        <el-form-item v-if="generateForm.zoneId && generateForm.productId">
          <div class="generate-preview">
            <el-alert 
              :title="getGeneratePreviewText()" 
              type="info" 
              :closable="false"
            />
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="generateCards"
          :disabled="!canGenerateCards"
        >
          确认生成
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 导入卡密对话框 -->
    <el-dialog v-model="showImportDialog" title="导入卡密" width="700px">
      <div class="import-section">
        <!-- 导入方式选择 -->
        <div class="import-method-selector">
          <el-radio-group v-model="importMethod" @change="handleImportMethodChange">
            <el-radio label="file">文件导入</el-radio>
            <el-radio label="manual">手动输入</el-radio>
          </el-radio-group>
        </div>
        
        <!-- 文件导入模式 -->
        <div v-if="importMethod === 'file'">
          <el-alert
            title="文件导入说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div class="import-tips">
                <p>支持CSV格式文件导入，文件应包含以下列：</p>
                <ul>
                  <li><strong>卡号</strong>（必填）：唯一的卡密标识</li>
                  <li><strong>类型</strong>（必填）：月卡、季卡、年卡</li>
                  <li><strong>面值</strong>（必填）：如 ¥29.90</li>
                  <li><strong>状态</strong>（可选）：未使用、已购买、已激活、已过期</li>
                  <li><strong>专区ID</strong>（可选）：专区标识，如果不填写将使用默认专区</li>
                  <li><strong>专区名称</strong>（可选）：专区名称</li>
                  <li><strong>商品ID</strong>（可选）：商品标识，如果不填写将使用默认商品</li>
                  <li><strong>商品名称</strong>（可选）：商品名称</li>
                  <li><strong>创建时间</strong>（可选）：YYYY-MM-DD HH:mm:ss</li>
                  <li><strong>使用时间</strong>（可选）：YYYY-MM-DD HH:mm:ss</li>
                </ul>
              </div>
            </template>
          </el-alert>
          
          <div class="file-upload">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :show-file-list="true"
              :on-change="handleFileChange"
              :before-remove="handleFileRemove"
              accept=".csv"
              drag
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将CSV文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传CSV文件，且不超过2MB
                </div>
              </template>
            </el-upload>
          </div>
        </div>
        
        <!-- 手动输入模式 -->
        <div v-if="importMethod === 'manual'">
          <el-alert
            title="手动输入说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <p><strong>简化输入模式</strong>：每行只需要输入卡号即可，其他信息通过下方选择器设定</p>
              <p><strong>示例</strong>：</p>
              <p>CARD123456789<br/>CARD987654321<br/>CARD555666777</p>
              <p>卡密类型、面值、专区、商品等信息将使用下方的默认设置统一应用</p>
            </template>
          </el-alert>
          
          <div class="manual-input">
            <el-form :model="manualInputForm" label-width="100px">
              <!-- 卡密设置选项 -->
              <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="6">
                  <el-form-item label="卡密类型" required>
                    <el-select v-model="manualInputForm.cardType" placeholder="选择类型" style="width: 100%">
                      <el-option label="月卡" value="monthly" />
                      <el-option label="季卡" value="quarterly" />  
                      <el-option label="年卡" value="yearly" />
                      <el-option label="体验卡" value="trial" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="卡密面值" required>
                    <el-input v-model="manualInputForm.cardValue" placeholder="如：¥29.90" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="初始状态">
                    <el-select v-model="manualInputForm.cardStatus" placeholder="选择状态" style="width: 100%">
                      <el-option label="未使用" value="unused" />
                      <el-option label="已购买" value="sold" />
                      <el-option label="已激活" value="used" />
                      <el-option label="已过期" value="expired" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="生成数量">
                    <el-input-number 
                      v-model="manualInputForm.autoGenerate" 
                      :min="0" 
                      :max="1000"
                      controls-position="right"
                      style="width: 100%"
                    />
                    <div style="font-size: 12px; color: #999; margin-top: 2px;">0表示手动输入</div>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <!-- 自动生成模式 -->
              <div v-if="manualInputForm.autoGenerate > 0" class="auto-generate-mode">
                <el-alert
                  title="自动生成模式"
                  type="success"
                  :closable="false"
                  show-icon
                  style="margin-bottom: 15px;"
                >
                  <template #default>
                    将自动生成 <strong>{{ manualInputForm.autoGenerate }}</strong> 个卡号，格式：CARD + 时间戳 + 随机数
                  </template>
                </el-alert>
              </div>
              
              <!-- 手动输入模式 -->
              <div v-else class="manual-input-mode">
                <el-form-item label="批量输入">
                  <el-input
                    v-model="manualInputForm.cardData"
                    type="textarea"
                    :rows="8"
                    placeholder="每行输入一个卡号，如：&#10;CARD123456789&#10;CARD987654321&#10;CARD555666777&#10;&#10;留空将自动生成卡号"
                    show-word-limit
                  />
                </el-form-item>
              </div>
              
              <el-form-item>
                <el-button type="primary" @click="parseManualInput">
                  <el-icon><DocumentChecked /></el-icon>
                  {{ manualInputForm.autoGenerate > 0 ? '生成卡密' : '解析数据' }}
                </el-button>
                <el-button @click="clearManualInput">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        
        <div class="import-options">
          <!-- 专区和商品选择 -->
          <div class="zone-product-selector" style="margin-bottom: 20px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="默认专区">
                  <div style="display: flex; gap: 8px;">
                    <el-select 
                      v-model="importForm.defaultZoneId" 
                      placeholder="选择默认专区"
                      @change="handleImportZoneChange"
                      style="flex: 1"
                    >
                      <el-option 
                        v-for="zone in availableZones" 
                        :key="zone.id" 
                        :label="zone.name + (zone.isDetected ? ` (${zone.cardCount}张)` : ' (默认)')" 
                        :value="zone.id" 
                      />
                    </el-select>
                    <el-button 
                      @click="refreshZonesAndProducts"
                      :loading="refreshLoading"
                      title="重新检测"
                      size="small"
                    >
                      <el-icon><RefreshRight /></el-icon>
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="默认商品">
                  <el-select 
                    v-model="importForm.defaultProductId" 
                    placeholder="选择默认商品"
                    :disabled="!importForm.defaultZoneId"
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="product in filteredImportProducts" 
                      :key="product.id" 
                      :label="product.name + ' (¥' + product.price + ')' + (product.isDetected ? ` - ${product.cardCount}张` : ' - 默认')" 
                      :value="product.id" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-alert 
              title="说明：导入的卡密如果没有指定专区和商品信息，将使用上面选择的默认值"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 15px;"
            />
          </div>
          
          <el-checkbox v-model="importOptions.overwriteExisting">
            覆盖已存在的卡密（相同卡号）
          </el-checkbox>
        </div>
        
        <div class="file-upload">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleFileChange"
            :before-remove="handleFileRemove"
            accept=".csv"
            drag
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将CSV文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传CSV文件，且不超过2MB
              </div>
            </template>
          </el-upload>
        </div>
        
        <!-- 预览数据 -->
        <div v-if="previewData.length > 0" class="preview-section">
          <h4>预览数据（前10条）</h4>
          <el-table :data="previewData.slice(0, 10)" border style="width: 100%">
            <el-table-column prop="cardNumber" label="卡号" width="150" />
            <el-table-column prop="cardType" label="类型" width="80" />
            <el-table-column prop="value" label="面值" width="100" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="scope">
                <el-tag :type="getCardStatusType(scope.row.status)" size="small">
                  {{ getCardStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
          </el-table>
          <p class="preview-info">
            共 {{ previewData.length }} 条数据待导入
          </p>
        </div>
        
        <!-- 导入结果 -->
        <div v-if="importResult" class="import-result">
          <el-alert
            :title="importResult.success ? '导入成功' : '导入失败'"
            :type="importResult.success ? 'success' : 'error'"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>{{ importResult.message }}</p>
              <div v-if="importResult.data && importResult.data.errors.length > 0" class="error-list">
                <p><strong>错误详情：</strong></p>
                <ul>
                  <li v-for="error in importResult.data.errors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </template>
          </el-alert>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="handleImportCancel">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleImport"
          :loading="importLoading"
          :disabled="previewData.length === 0"
        >
          确认导入
        </el-button>
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
import UserManagement from '@/components/UserManagement.vue'
import ZoneManagement from '@/components/ZoneManagement.vue'
import OrderManagement from '@/components/OrderManagement.vue'
import VipManagement from '@/components/admin/VipManagement.vue'
import AnnouncementManager from '@/components/AnnouncementManager.vue'
import ContactManagement from '@/components/ContactManagement.vue'
import ServerMaintenance from '@/components/ServerMaintenance.vue'
import SecurityDashboard from '@/components/SecurityDashboard.vue'
import PaymentSettings from '@/components/PaymentSettings.vue'
import {
  ArrowDown, User, Key, ShoppingCart, Wallet, Setting,
  Odometer, Bell, Service, Upload, Download, Plus, UploadFilled,
  DocumentChecked, Delete, Tools, Lock, CreditCard, Box
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const cardStore = useCardStore()

const activeMenu = ref('dashboard')
const showAddUserDialog = ref(false)
const showGenerateDialog = ref(false)
const showImportDialog = ref(false)
const uploadRef = ref()
const importLoading = ref(false)
const previewData = ref([])
const importResult = ref(null)
const importMethod = ref('file')
const cardTableRef = ref()
const selectedCards = ref([])
const batchDeleteLoading = ref(false)

const manualInputForm = reactive({
  cardData: '',
  cardType: 'monthly',
  cardValue: '¥29.90',
  cardStatus: 'unused',
  autoGenerate: 0
})

const adminStats = reactive({
  totalUsers: 0,
  totalCards: 0,
  totalOrders: 0,
  totalRevenue: '0.00'
})

const recentOrders = ref([])

const systemLogs = ref([])

const userList = ref([])
const cardList = ref([])

const userPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

const newUser = reactive({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

const generateForm = reactive({
  type: '',
  quantity: 10,
  value: '',
  zoneId: '',
  productId: '',
  cardTypeId: ''
})

// 专区和商品数据
const availableZones = ref([])
const availableProducts = ref([])
const refreshLoading = ref(false)

// 根据选中的专区过滤商品
const filteredProducts = computed(() => {
  if (!generateForm.zoneId) return []
  return availableProducts.value.filter(product => product.zoneId === generateForm.zoneId)
})

const filteredImportProducts = computed(() => {
  if (!importForm.defaultZoneId) return []
  return availableProducts.value.filter(product => product.zoneId === importForm.defaultZoneId)
})

// 专区变化时重置商品选择
const handleZoneChange = () => {
  generateForm.productId = ''
  generateForm.cardTypeId = ''
}

// 当前商品的卡密类型
const currentProductCardTypes = computed(() => {
  if (!generateForm.productId) return []
  const currentProduct = availableProducts.value.find(p => p.id === generateForm.productId)
  const cardTypes = currentProduct?.cardTypes || []
  
  // 调试信息
  console.log('=== 卡密类型检查 ===')
  console.log('商品ID:', generateForm.productId)
  console.log('找到的商品:', currentProduct)
  console.log('商品的卡密类型:', cardTypes)
  console.log('卡密类型数量:', cardTypes.length)
  
  return cardTypes
})

// 商品变化时重置卡密类型选择
const handleProductChange = () => {
  generateForm.cardTypeId = ''
}

// 获取卡密类型库存数量
const getCardTypeStock = (cardTypeId) => {
  try {
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    return allCards.filter(card => 
      String(card.zoneId) === String(generateForm.zoneId) &&
      String(card.productId) === String(generateForm.productId) &&
      String(card.cardTypeId) === String(cardTypeId) &&
      card.status === 'unused' &&
      !card.purchasedBy
    ).length
  } catch (error) {
    return 0
  }
}

// 是否可以生成卡密
const canGenerateCards = computed(() => {
  // 基本字段检查
  if (!generateForm.zoneId || !generateForm.productId || !generateForm.value) {
    return false
  }
  
  // 如果商品有卡密类型，必须选择卡密类型
  if (currentProductCardTypes.value.length > 0 && !generateForm.cardTypeId) {
    return false
  }
  
  return true
})

// 导入专区变化时重置商品选择
const handleImportZoneChange = () => {
  importForm.defaultProductId = null
}

// 手动刷新专区和商品检测
const refreshZonesAndProducts = async () => {
  refreshLoading.value = true
  try {
    ElMessage.info('正在重新检测现有专区和商品...')
    
    // 手动检查localStorage中的数据
    console.log('=== 手动检查localStorage数据 ===')
    const rawZones = localStorage.getItem('card_zones')
    const rawProducts = localStorage.getItem('card_products')
    
    if (rawZones) {
      const zones = JSON.parse(rawZones)
      console.log('专区数据:', zones.length, '个专区')
      zones.forEach((zone, i) => {
        console.log(`专区 ${i+1}:`, zone.name, zone.products?.length || 0, '个商品')
        if (zone.products) {
          zone.products.forEach(p => {
            console.log(`  商品: ${p.name}, 卡密类型: ${p.cardTypes?.length || 0}`)
          })
        }
      })
    }
    
    if (rawProducts) {
      const products = JSON.parse(rawProducts)
      console.log('商品数据:', products.length, '个商品')
      products.forEach((product, i) => {
        console.log(`商品 ${i+1}:`, product.name, '卡密类型:', product.cardTypes?.length || 0)
        if (product.cardTypes) {
          product.cardTypes.forEach(ct => console.log(`  类型: ${ct.name} (${ct.duration})`))
        }
      })
    }
    
    await loadZonesAndProducts()
  } finally {
    refreshLoading.value = false
  }
}

// 生成预览文本
const getGeneratePreviewText = () => {
  const zone = availableZones.value.find(z => z.id === generateForm.zoneId)
  const product = availableProducts.value.find(p => p.id === generateForm.productId)
  if (zone && product) {
    return `将为专区「${zone.name}」的商品「${product.name}」生成 ${generateForm.quantity} 张卡密`
  }
  return ''
}

// 根据商品名称和专区名称推断商品类型
const inferProductType = (productName, zoneName) => {
  const name = (productName || '').toLowerCase()
  const zone = (zoneName || '').toLowerCase()
  
  // 游戏相关关键词
  if (name.includes('游戏') || name.includes('steam') || name.includes('原神') || 
      name.includes('王者') || name.includes('lol') || name.includes('cf') || 
      name.includes('dnf') || zone.includes('游戏')) {
    return 'game'
  }
  
  // 软件相关关键词
  if (name.includes('office') || name.includes('adobe') || name.includes('photoshop') || 
      name.includes('软件') || name.includes('许可') || zone.includes('软件')) {
    return 'software'
  }
  
  // 会员相关关键词
  if (name.includes('vip') || name.includes('会员') || name.includes('月卡') || 
      name.includes('年卡') || name.includes('季卡') || zone.includes('会员')) {
    return 'vip'
  }
  
  // 影音相关关键词
  if (name.includes('netflix') || name.includes('爱奇艺') || name.includes('腾讯视频') || 
      name.includes('优酷') || name.includes('音乐') || name.includes('qq音乐') || 
      name.includes('网易云') || zone.includes('影音') || zone.includes('视频')) {
    return 'media'
  }
  
  return 'general'
}

// 加载专区和商品数据
const loadZonesAndProducts = async () => {
  try {
    console.log('=== 开始从专区管理中加载专区和商品 ===')
    
    // 从专区管理数据中读取专区
    const savedZones = JSON.parse(localStorage.getItem('card_zones') || '[]')
    console.log(`专区管理中的专区数量: ${savedZones.length}`)
    
    // 从专区管理数据中读取商品
    const savedProducts = JSON.parse(localStorage.getItem('card_products') || '[]')  
    console.log(`专区管理中的商品数量: ${savedProducts.length}`)
    
    // 从卡密管理中统计实际卡密数量
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    console.log(`卡密管理中的卡密数量: ${allCards.length}`)
    
    // 统计每个专区的卡密数量
    const zoneCardStats = {}
    // 统计每个商品的卡密数量  
    const productCardStats = {}
    
    allCards.forEach(card => {
      if (card.zoneId && card.productId) {
        // 统计专区卡密数量
        if (!zoneCardStats[card.zoneId]) {
          zoneCardStats[card.zoneId] = 0
        }
        zoneCardStats[card.zoneId]++
        
        // 统计商品卡密数量
        const productKey = `${card.zoneId}-${card.productId}`
        if (!productCardStats[productKey]) {
          productCardStats[productKey] = 0
        }
        productCardStats[productKey]++
      }
    })
    
    console.log('=== 卡密统计结果 ===')
    console.log('专区卡密统计:', zoneCardStats)
    console.log('商品卡密统计:', productCardStats)
    
    // 处理专区数据，加上实际卡密统计
    const detectedZonesList = savedZones
      .filter(zone => zone.isActive !== false) // 只加载启用的专区
      .map(zone => ({
        id: zone.id,
        name: zone.name,
        description: zone.description || `专区：${zone.name}`,
        createdAt: zone.updateTime || new Date().toISOString(),
        isDetected: true,
        cardCount: zoneCardStats[zone.id] || 0, // 使用实际的卡密统计
        icon: zone.icon,
        customIcon: zone.customIcon
      }))
      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0) || a.id - b.id)
    
    // 处理商品数据，加上实际卡密统计
    const detectedProductsList = savedProducts
      .filter(product => product.isActive !== false) // 只加载上架的商品
      .map(product => {
        const productKey = `${product.zoneId}-${product.id}`
        const actualCardCount = productCardStats[productKey] || 0
        
        return {
          id: product.id,
          zoneId: product.zoneId,
          name: product.name,
          price: product.price ? product.price.toString() : '0.00',
          type: product.type || 'general',
          description: product.description || `商品：${product.name}`,
          createdAt: product.updateTime || product.createTime || new Date().toISOString(),
          isDetected: true,
          cardCount: actualCardCount, // 使用实际的卡密统计
          stock: product.stock || 0,
          validity: product.validity,
          cardTypes: product.cardTypes || [] // 包含卡密类型数据
        }
      })
      .sort((a, b) => a.zoneId - b.zoneId || (b.sortOrder || 0) - (a.sortOrder || 0) || a.id - b.id)
    
    console.log('=== 加载结果 ===')
    console.log('专区列表:', detectedZonesList.map(z => `${z.name}: ${z.cardCount}张卡密`))
    console.log('商品列表:', detectedProductsList.map(p => `${p.name}: ${p.cardCount}张卡密, 卡密类型: ${p.cardTypes?.length || 0}个`))
    
    // 详细显示每个商品的卡密类型
    detectedProductsList.forEach(product => {
      if (product.cardTypes && product.cardTypes.length > 0) {
        console.log(`商品「${product.name}」的卡密类型:`, product.cardTypes)
      }
    })
    
    // 如果没有检测到数据，提供提示信息
    if (detectedZonesList.length === 0) {
      console.log('专区管理中没有专区数据')
      ElMessage.warning('专区管理中没有找到专区，请先在专区管理中创建专区')
      availableZones.value = []
    } else {
      availableZones.value = detectedZonesList
    }
    
    if (detectedProductsList.length === 0) {
      console.log('专区管理中没有商品数据')
      ElMessage.warning('专区管理中没有找到商品，请先在专区管理中创建商品')
      availableProducts.value = []
    } else {
      availableProducts.value = detectedProductsList
    }
    
    // 显示统计信息
    if (detectedZonesList.length > 0 || detectedProductsList.length > 0) {
      const totalCards = Object.values(zoneCardStats).reduce((sum, count) => sum + count, 0)
      const successMsg = `加载完成：${detectedZonesList.length} 个专区，${detectedProductsList.length} 个商品，共 ${totalCards} 张卡密`
      console.log('=== ' + successMsg + ' ===')
      ElMessage.success(successMsg)
    }
    
  } catch (error) {
    console.error('加载专区商品数据失败:', error)
    ElMessage.error('加载专区商品数据失败: ' + error.message)
    
    // 错误时清空数据
    availableZones.value = []
    availableProducts.value = []
  }
}

const financeStats = reactive({
  totalRevenue: '0.00',
  todayRevenue: '0.00',
  totalTransactions: 0,
  pendingAmount: '0.00'
})

const systemSettings = reactive({
  siteName: '卡密系统',
  siteDescription: '专业的卡密销售管理系统',
  allowRegister: true,
  emailVerification: false
})

const priceSettings = reactive({
  monthlyPrice: 29.90,
  quarterlyPrice: 79.90,
  yearlyPrice: 299.90
})

const importOptions = reactive({
  overwriteExisting: false
})

const importForm = reactive({
  defaultZoneId: null,
  defaultProductId: null
})

const getPageTitle = () => {
  const titleMap = {
    dashboard: '数据概览',
    users: '用户管理',
    zones: '专区管理',
    cards: '卡密管理',
    orders: '订单管理',
    vip: 'VIP管理',
    announcements: '公告管理',
    contacts: '用户反馈',
    finance: '财务管理',
    payment: '支付设置',
    maintenance: '服务器维护',
    security: '安全监控',
    settings: '系统设置'
  }
  return titleMap[activeMenu.value] || '管理后台'
}

const handleMenuSelect = (index) => {
  activeMenu.value = index
  // 当切换到数据概览时刷新数据
  if (index === 'dashboard') {
    loadRealData()
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/')
      break
    case 'dashboard':
      router.push('/dashboard')
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}

const getOrderStatusType = (status) => {
  const typeMap = {
    '已完成': 'success',
    '处理中': 'warning',
    '已取消': 'info'
  }
  return typeMap[status] || 'info'
}

const getLogType = (level) => {
  const typeMap = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return typeMap[level] || 'primary'
}

const getCardStatusType = (status) => {
  const typeMap = {
    unused: 'success',
    sold: 'warning',
    used: 'info',
    expired: 'danger'
  }
  return typeMap[status] || 'info'
}

const getCardStatusText = (status) => {
  const textMap = {
    unused: '未使用',
    sold: '已购买',
    used: '已激活',
    expired: '已过期'
  }
  return textMap[status] || '未知'
}

const editUser = (user) => {
  ElMessage.info(`编辑用户: ${user.username}`)
}

const toggleUserStatus = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确认${user.status === 'active' ? '禁用' : '启用'}用户 ${user.username}？`,
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    user.status = user.status === 'active' ? 'disabled' : 'active'
    ElMessage.success('操作成功')
  } catch {
    
  }
}

const addUser = () => {
  if (!newUser.username || !newUser.email || !newUser.password) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  ElMessage.success('用户添加成功')
  showAddUserDialog.value = false
  
  newUser.username = ''
  newUser.email = ''
  newUser.password = ''
  newUser.role = 'user'
}

const viewCard = (card) => {
  ElMessage.info(`查看卡密: ${card.cardNumber}`)
}

const deleteCard = async (card) => {
  try {
    await ElMessageBox.confirm(
      `确认删除卡密 ${card.cardNumber}？`,
      '确认删除',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await cardStore.deleteCard(card.id)
    
    if (result.success) {
      ElMessage.success(result.message)
      // 刷新数据
      await loadRealData()
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // 用户取消删除
  }
}

const generateCards = async () => {
  if (!generateForm.zoneId || !generateForm.productId || !generateForm.cardTypeId || !generateForm.value) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  try {
    // 获取选中的专区、商品和卡密类型信息
    const selectedZone = availableZones.value.find(zone => zone.id === generateForm.zoneId)
    const selectedProduct = availableProducts.value.find(product => product.id === generateForm.productId)
    const selectedCardType = currentProductCardTypes.value.find(type => type.id === generateForm.cardTypeId)
    
    console.log('=== 生成卡密请求参数 ===')
    console.log('选中的卡密类型ID:', generateForm.cardTypeId)
    console.log('选中的卡密类型对象:', selectedCardType)
    console.log('类型ID类型:', typeof generateForm.cardTypeId)
    console.log('卡密类型价格:', selectedCardType?.price)
    console.log('表单价格:', generateForm.value)
    console.log('最终使用的价格:', selectedCardType?.price || generateForm.value)
    
    const result = await cardStore.generateCards({
      type: generateForm.type,
      quantity: generateForm.quantity,
      value: selectedCardType?.price || generateForm.value, // 使用卡密类型价格，如果没有则使用表单价格
      zoneId: String(generateForm.zoneId), // 确保ID是字符串
      zoneName: selectedZone?.name || '',
      productId: String(generateForm.productId), // 确保ID是字符串
      productName: selectedProduct?.name || '',
      cardTypeId: String(generateForm.cardTypeId), // 确保ID是字符串
      cardTypeName: selectedCardType?.name || '',
      cardTypeDuration: selectedCardType?.duration || ''
    })
    
    if (result.success) {
      ElMessage.success(result.message)
      showGenerateDialog.value = false
      
      // 重置表单
      generateForm.type = ''
      generateForm.quantity = 10
      generateForm.value = ''
      generateForm.zoneId = ''
      generateForm.productId = ''
      generateForm.cardTypeId = ''
      
      // 刷新数据
      await loadRealData()
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('生成失败')
  }
}

const saveSettings = () => {
  try {
    localStorage.setItem('system_settings', JSON.stringify(systemSettings))
    localStorage.setItem('price_settings', JSON.stringify(priceSettings))
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('设置保存失败')
  }
}

const resetSettings = () => {
  Object.assign(systemSettings, {
    siteName: '卡密系统',
    siteDescription: '专业的卡密销售管理系统',
    allowRegister: true,
    emailVerification: false
  })
  
  Object.assign(priceSettings, {
    monthlyPrice: 29.90,
    quarterlyPrice: 79.90,
    yearlyPrice: 299.90
  })
  
  ElMessage.info('设置已重置')
}

// 加载真实数据的函数
const loadRealData = () => {
  try {
    // 加载用户数据
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
    userList.value = allUsers
    adminStats.totalUsers = allUsers.length
    
    // 加载卡密数据
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    cardList.value = allCards
    adminStats.totalCards = allCards.length
    
    // 加载订单数据
    const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]')
    adminStats.totalOrders = allOrders.length
    
    // 计算总收入
    const totalRevenue = allOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    adminStats.totalRevenue = totalRevenue.toFixed(2)
    
    // 更新财务统计
    financeStats.totalRevenue = totalRevenue.toFixed(2)
    financeStats.totalTransactions = allOrders.filter(order => order.status === 'completed').length
    
    // 计算今日收入
    const today = new Date().toLocaleDateString('zh-CN')
    const todayRevenue = allOrders
      .filter(order => order.status === 'completed' && 
        new Date(order.paymentTime || order.createTime).toLocaleDateString('zh-CN') === today)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    financeStats.todayRevenue = todayRevenue.toFixed(2)
    
    // 计算待结算金额（待支付订单）
    const pendingAmount = allOrders
      .filter(order => order.status === 'pending')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    financeStats.pendingAmount = pendingAmount.toFixed(2)
    
    // 获取最近5个订单
    const sortedOrders = allOrders
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      .slice(0, 5)
      .map(order => ({
        id: order.orderNumber,
        username: order.username || '未知用户',
        amount: `¥${order.totalAmount?.toFixed(2) || '0.00'}`,
        status: getOrderStatusText(order.status)
      }))
    recentOrders.value = sortedOrders
    
    // 生成系统日志
    const logs = []
    
    // 添加用户注册日志
    allUsers.slice(-3).forEach(user => {
      logs.push({
        id: logs.length + 1,
        message: `用户 ${user.username} 注册系统`,
        time: user.registerTime,
        level: 'info'
      })
    })
    
    // 添加订单日志
    allOrders.slice(-2).forEach(order => {
      logs.push({
        id: logs.length + 1,
        message: `订单 ${order.orderNumber} 状态更新为${getOrderStatusText(order.status)}`,
        time: order.createTime,
        level: order.status === 'completed' ? 'success' : 'info'
      })
    })
    
    // 添加系统日志
    logs.push({
      id: logs.length + 1,
      message: '管理员查看数据概览',
      time: new Date().toLocaleString('zh-CN'),
      level: 'info'
    })
    
    systemLogs.value = logs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
    
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  }
}

const getOrderStatusText = (status) => {
  const statusMap = {
    'pending': '待支付',
    'completed': '已完成',
    'cancelled': '已取消',
    'failed': '失败'
  }
  return statusMap[status] || status
}

// 导入相关方法
const handleFileChange = (file) => {
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过2MB')
    return false
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const csvText = e.target.result
    const parseResult = cardStore.parseCSV(csvText)
    
    if (parseResult.success) {
      previewData.value = parseResult.data
      importResult.value = null
      ElMessage.success(`文件解析成功，共 ${parseResult.data.length} 条数据`)
    } else {
      ElMessage.error(`文件解析失败：${parseResult.message}`)
      previewData.value = []
    }
  }
  
  reader.readAsText(file.raw, 'UTF-8')
}

const handleFileRemove = () => {
  previewData.value = []
  importResult.value = null
}

const handleImport = async () => {
  if (previewData.value.length === 0) {
    ElMessage.error('请先选择文件')
    return
  }
  
  importLoading.value = true
  importResult.value = null
  
  try {
    // 获取默认专区和商品信息
    const defaultZone = availableZones.value.find(z => z.id === importForm.defaultZoneId)
    const defaultProduct = availableProducts.value.find(p => p.id === importForm.defaultProductId)
    
    // 为导入的卡密补充专区和商品信息
    const enrichedCards = previewData.value.map(card => ({
      ...card,
      // 如果卡密没有专区信息，使用默认专区
      zoneId: card.zoneId || importForm.defaultZoneId,
      zoneName: card.zoneName || (defaultZone ? defaultZone.name : ''),
      // 如果卡密没有商品信息，使用默认商品
      productId: card.productId || importForm.defaultProductId,
      productName: card.productName || (defaultProduct ? defaultProduct.name : ''),
      // 确保包含所有必要的字段
      createTime: card.createTime || new Date().toLocaleString('zh-CN'),
      useTime: card.useTime || null,
      expireTime: card.expireTime || null
    }))
    
    const result = await cardStore.importCards({
      cards: enrichedCards,
      overwriteExisting: importOptions.overwriteExisting,
      defaultZoneInfo: defaultZone ? { id: defaultZone.id, name: defaultZone.name } : null,
      defaultProductInfo: defaultProduct ? { id: defaultProduct.id, name: defaultProduct.name } : null
    })
    
    importResult.value = result
    
    if (result.success) {
      ElMessage.success(result.message)
      // 刷新卡密列表
      await loadRealData()
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    importLoading.value = false
  }
}

const handleImportCancel = () => {
  showImportDialog.value = false
  previewData.value = []
  importResult.value = null
  importOptions.overwriteExisting = false
  importMethod.value = 'file'
  manualInputForm.cardData = ''
  
  // 重置导入表单
  importForm.defaultZoneId = null
  importForm.defaultProductId = null
  
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

const exportAllCards = () => {
  if (cardList.value.length === 0) {
    ElMessage.warning('没有卡密数据可导出')
    return
  }
  
  cardStore.exportCards(cardList.value)
  ElMessage.success('导出成功')
}

// 手动输入相关方法
const handleImportMethodChange = () => {
  // 切换导入方式时清空数据
  previewData.value = []
  importResult.value = null
  manualInputForm.cardData = ''
  
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

const parseManualInput = () => {
  // 验证必需字段
  if (!manualInputForm.cardType) {
    ElMessage.error('请选择卡密类型')
    return
  }
  
  if (!manualInputForm.cardValue) {
    ElMessage.error('请输入卡密面值')
    return
  }
  
  let cardNumbers = []
  
  // 自动生成模式
  if (manualInputForm.autoGenerate > 0) {
    for (let i = 0; i < manualInputForm.autoGenerate; i++) {
      const timestamp = Date.now().toString()
      const random = Math.random().toString(36).substring(2, 8).toUpperCase()
      cardNumbers.push(`CARD${timestamp}${random}`)
    }
  } else {
    // 手动输入模式
    if (!manualInputForm.cardData.trim()) {
      ElMessage.error('请输入卡号或设置自动生成数量')
      return
    }
    
    // 解析输入的卡号（每行一个）
    cardNumbers = manualInputForm.cardData
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    if (cardNumbers.length === 0) {
      ElMessage.error('没有找到有效的卡号')
      return
    }
  }
  
  // 获取类型显示名称
  const typeDisplayNames = {
    'monthly': '月卡',
    'quarterly': '季卡', 
    'yearly': '年卡',
    'trial': '体验卡'
  }
  
  // 构建卡密数据
  const parsedCards = cardNumbers.map((cardNumber, index) => ({
    cardNumber: cardNumber,
    cardType: typeDisplayNames[manualInputForm.cardType] || '月卡',
    value: manualInputForm.cardValue,
    status: manualInputForm.cardStatus || 'unused',
    createTime: new Date().toLocaleString('zh-CN'),
    useTime: null,
    expireTime: null,
    // 专区和商品信息将由默认选择器填充
    zoneId: null,
    zoneName: null,
    productId: null,
    productName: null
  }))
  
  previewData.value = parsedCards
  importResult.value = null
  
  const genMode = manualInputForm.autoGenerate > 0 ? '自动生成' : '手动输入'
  ElMessage.success(`${genMode}解析成功，共 ${parsedCards.length} 条卡密数据`)
}

const clearManualInput = () => {
  manualInputForm.cardData = ''
  manualInputForm.cardType = 'monthly'
  manualInputForm.cardValue = '¥29.90'
  manualInputForm.cardStatus = 'unused'
  manualInputForm.autoGenerate = 0
  previewData.value = []
  importResult.value = null
}

// 批量删除相关方法
const handleSelectionChange = (selection) => {
  selectedCards.value = selection
}

const selectAllUnused = () => {
  if (!cardTableRef.value) return
  
  // 选择所有未使用状态的卡密
  const unusedCards = cardList.value.filter(card => card.status === 'unused')
  unusedCards.forEach(card => {
    cardTableRef.value.toggleRowSelection(card, true)
  })
}

const clearSelection = () => {
  if (cardTableRef.value) {
    cardTableRef.value.clearSelection()
  }
}

const handleBatchDelete = async () => {
  if (selectedCards.value.length === 0) {
    ElMessage.error('请选择要删除的卡密')
    return
  }

  // 检查选中的卡密状态
  const unusedCards = selectedCards.value.filter(card => card.status === 'unused')
  const otherCards = selectedCards.value.filter(card => card.status !== 'unused')

  let confirmMessage = `确认删除选中的 ${selectedCards.value.length} 个卡密？`
  if (otherCards.length > 0) {
    confirmMessage += `\n\n注意：其中 ${otherCards.length} 个卡密因已被使用或购买将被跳过，只会删除 ${unusedCards.length} 个未使用的卡密。`
  }

  try {
    await ElMessageBox.confirm(
      confirmMessage,
      '批量删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    )

    batchDeleteLoading.value = true

    const cardIds = selectedCards.value.map(card => card.id)
    const result = await cardStore.batchDeleteCards(cardIds)

    if (result.success) {
      ElMessage.success(result.message)
      
      // 显示详细结果
      if (result.data && result.data.errors.length > 0) {
        ElMessageBox.alert(
          `删除结果：\n成功删除：${result.data.deleteCount} 个\n跳过：${result.data.skipCount} 个\n\n${result.data.errors.join('\n')}`,
          '删除详情',
          {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
          }
        )
      }
      
      // 清空选择并刷新数据
      clearSelection()
      await loadRealData()
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // 用户取消删除
  } finally {
    batchDeleteLoading.value = false
  }
}

onMounted(() => {
  // 加载系统设置
  try {
    const savedSystemSettings = localStorage.getItem('system_settings')
    if (savedSystemSettings) {
      Object.assign(systemSettings, JSON.parse(savedSystemSettings))
    }
    
    const savedPriceSettings = localStorage.getItem('price_settings')
    if (savedPriceSettings) {
      Object.assign(priceSettings, JSON.parse(savedPriceSettings))
    }
  } catch (error) {
    console.warn('加载设置失败:', error)
  }
  
  // 加载真实数据
  loadRealData()
  loadZonesAndProducts()
})
</script>

<style lang="scss" scoped>
.admin-layout {
  height: 100vh;
  
  .el-aside {
    background-color: #304156;
  }
  
  .sidebar {
    height: 100%;
    
    .sidebar-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #434a5a;
      
      h3 {
        color: #fff;
        margin: 0;
      }
    }
    
    .sidebar-menu {
      border: none;
      background-color: transparent;
      
      .el-menu-item {
        color: #bfcbd9;
        
        &:hover {
          background-color: #434a5a;
          color: #fff;
        }
        
        &.is-active {
          background-color: #409eff;
          color: #fff;
        }
      }
    }
  }
  
  .el-header {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      
      h2 {
        color: #303133;
        margin: 0;
      }
    }
  }
  
  .el-main {
    background-color: #f5f5f5;
    padding: 20px;
  }
}

.admin-content {
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
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  display: flex;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}

.finance-content {
  margin-top: 24px;
}

.settings-actions {
  margin-top: 24px;
  text-align: right;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  
  .el-button {
    margin-left: 12px;
  }
}

.security-settings {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 生成卡密对话框样式 */
.generate-preview {
  margin-top: 16px;
  
  .el-alert {
    border-radius: 8px;
    
    :deep(.el-alert__content) {
      color: #606266;
      font-size: 14px;
    }
  }
}

/* 卡密表格样式优化 */
:deep(.el-table) {
  .el-table__cell {
    padding: 12px 0;
    
    &.el-table-column--selection {
      text-align: center;
    }
  }
  
  .el-tag {
    border-radius: 4px;
    font-size: 12px;
  }
}

/* 批量操作提示样式 */
.batch-operation-tip {
  margin-top: 16px;
  
  .batch-tip-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    
    .el-button {
      margin-right: 8px;
    }
  }
}

.import-section {
  .import-method-selector {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .import-tips {
    ul {
      margin: 8px 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 4px;
        line-height: 1.5;
      }
    }
  }
  
  .import-options {
    margin: 16px 0;
  }
  
  .file-upload {
    margin: 20px 0;
  }
  
  .manual-input {
    margin: 20px 0;
    
    .el-textarea {
      font-family: 'Courier New', monospace;
    }
  }
  
  .preview-section {
    margin-top: 20px;
    
    h4 {
      margin-bottom: 12px;
      color: #303133;
    }
    
    .preview-info {
      margin-top: 12px;
      color: #606266;
      font-size: 14px;
    }
  }
  
  .import-result {
    margin-top: 20px;
    
    .error-list {
      margin-top: 12px;
      
      ul {
        margin: 8px 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 4px;
          color: #f56c6c;
          font-size: 13px;
        }
      }
    }
  }
  
  // 生成卡密相关样式
  .generate-preview {
    margin-top: 16px;
  }
  
  .empty-card-types-hint {
    margin-top: 8px;
    
    .el-text {
      display: block;
      text-align: center;
      padding: 8px;
      background-color: #fdf6ec;
      border: 1px solid #f5dab1;
      border-radius: 4px;
    }
  }
}
</style>