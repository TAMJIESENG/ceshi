<template>
  <div class="zone-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>🎯 专区管理</span>
          <el-button type="primary" @click="showCreateZoneDialog = true">
            <el-icon><Plus /></el-icon>
            创建专区
          </el-button>
        </div>
      </template>

      <!-- 专区列表 -->
      <div class="zones-grid">
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="zone-card"
          :class="{ active: zone.isActive }"
        >
          <div class="zone-header">
            <div class="zone-icon">
              <!-- 显示自定义图标或emoji图标 -->
              <span v-if="!zone.customIcon || zone.customIcon.trim() === ''">{{ zone.icon || '🎯' }}</span>
              <img v-else :src="zone.customIcon" :alt="zone.name" class="custom-zone-icon" @error="handleImageError(zone)" />
            </div>
            <div class="zone-info">
              <h3>{{ zone.name }}</h3>
              <p class="zone-desc">{{ zone.description }}</p>
            </div>
            <div class="zone-actions">
              <el-dropdown trigger="click">
                <el-button type="text">
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editZone(zone)">
                      <el-icon><Edit /></el-icon>
                      编辑专区
                    </el-dropdown-item>
                    <el-dropdown-item @click="manageProducts(zone)">
                      <el-icon><Goods /></el-icon>
                      管理商品
                    </el-dropdown-item>
                    <el-dropdown-item @click="toggleZoneStatus(zone)" :divided="true">
                      <el-icon><Switch /></el-icon>
                      {{ zone.isActive ? '禁用专区' : '启用专区' }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteZone(zone)" style="color: #F56C6C;">
                      <el-icon><Delete /></el-icon>
                      删除专区
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          
          <div class="zone-stats">
            <div class="stat-item">
              <div class="stat-value">{{ zone.productCount }}</div>
              <div class="stat-label">商品数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ zone.totalSales }}</div>
              <div class="stat-label">总销量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥{{ zone.revenue.toFixed(2) }}</div>
              <div class="stat-label">营收</div>
            </div>
          </div>
          
          <!-- 用户头像区域 -->
          <div class="zone-users">
            <div class="users-header">
              <span class="users-title">👥 活跃用户</span>
              <span class="users-count">{{ getZoneUsers(zone).length }}人</span>
            </div>
            <div class="users-avatars">
              <div 
                v-for="user in getZoneUsers(zone).slice(0, 5)" 
                :key="user.id"
                class="user-avatar-wrapper"
                :title="`${user.realName || user.username}\n等级: ${user.level || '普通'}\n消费: ¥${user.totalSpent || '0.00'}`"
              >
                <el-avatar 
                  :size="32" 
                  :src="user.avatar || ''"
                  class="user-avatar"
                  @error="handleUserAvatarError(user)"
                >
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="user-level-badge" v-if="user.level && user.level !== '普通'">
                  {{ user.level }}
                </div>
              </div>
              
              <!-- 显示更多用户数量 -->
              <div 
                v-if="getZoneUsers(zone).length > 5" 
                class="more-users"
                @click="showZoneUsersDialogHandler(zone)"
              >
                +{{ getZoneUsers(zone).length - 5 }}
              </div>
              
              <!-- 没有用户时的占位符 -->
              <div v-if="getZoneUsers(zone).length === 0" class="no-users">
                <span>暂无活跃用户</span>
              </div>
            </div>
          </div>
          
          <div class="zone-status">
            <el-tag :type="zone.isActive ? 'success' : 'danger'">
              {{ zone.isActive ? '已启用' : '已禁用' }}
            </el-tag>
            <span class="update-time">{{ zone.updateTime }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 创建/编辑专区对话框 -->
    <el-dialog 
      v-model="showCreateZoneDialog" 
      :title="editingZone ? '编辑专区' : '创建专区'" 
      width="600px"
    >
      <el-form :model="zoneForm" :rules="zoneRules" ref="zoneFormRef" label-width="100px">
        <el-form-item label="专区名称" prop="name">
          <el-input 
            v-model="zoneForm.name" 
            placeholder="请输入专区名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="专区图标" prop="icon">
          <div class="icon-selector">
            <el-tabs v-model="iconType" class="icon-tabs">
              <!-- 表情符号选项卡 -->
              <el-tab-pane label="表情符号" name="emoji">
                <el-input 
                  v-model="zoneForm.icon" 
                  placeholder="选择一个表情符号"
                  maxlength="2"
                  class="icon-input"
                />
                <div class="icon-grid">
                  <div 
                    v-for="icon in availableIcons" 
                    :key="icon"
                    class="icon-option"
                    :class="{ selected: zoneForm.icon === icon }"
                    @click="selectEmojiIcon(icon)"
                  >
                    {{ icon }}
                  </div>
                </div>
              </el-tab-pane>
              
              <!-- 自定义图片选项卡 -->
              <el-tab-pane label="自定义图片" name="custom">
                <div class="custom-icon-upload">
                  <el-upload
                    ref="iconUploadRef"
                    class="icon-uploader"
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="handleIconChange"
                    :on-exceed="handleUploadExceed"
                    :limit="1"
                    @click="handleUploadClick"
                  >
                    <div class="upload-area" v-if="!zoneForm.customIcon">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                      <div class="upload-text">点击上传图标</div>
                      <div class="upload-hint">支持 JPG、PNG、SVG 格式，建议尺寸 64x64px</div>
                    </div>
                    <div class="custom-icon-preview" v-else>
                      <img :src="zoneForm.customIcon" alt="自定义图标" />
                      <div class="icon-overlay">
                        <el-button type="primary" size="small" @click.stop="removeCustomIcon">
                          <el-icon><Delete /></el-icon>
                          删除
                        </el-button>
                      </div>
                    </div>
                  </el-upload>
                </div>
              </el-tab-pane>
            </el-tabs>
            
            <!-- 图标预览 -->
            <div class="icon-preview" v-if="currentIconPreview">
              <span class="preview-label">预览：</span>
              <div class="preview-icon" v-if="iconType === 'emoji'">{{ zoneForm.icon }}</div>
              <img v-else-if="iconType === 'custom' && zoneForm.customIcon" 
                   :src="zoneForm.customIcon" 
                   alt="预览" 
                   class="preview-image" />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="专区描述" prop="description">
          <el-input 
            v-model="zoneForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入专区描述"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="排序权重">
          <el-input-number 
            v-model="zoneForm.sortOrder" 
            :min="0" 
            :max="999"
            controls-position="right"
          />
          <span class="form-tip">数值越大排序越靠前</span>
        </el-form-item>
        
        <el-form-item label="专区状态">
          <el-switch 
            v-model="zoneForm.isActive" 
            active-text="启用" 
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateZoneDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveClick" :loading="saving">
          {{ editingZone ? '保存修改' : '创建专区' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 商品管理对话框 -->
    <el-dialog 
      v-model="showProductDialog" 
      :title="`${currentZone?.name} - 商品管理`" 
      width="90%"
      top="5vh"
    >
      <div class="product-management">
        <div class="product-toolbar">
          <el-button type="primary" @click="showCreateProductDialog = true">
            <el-icon><Plus /></el-icon>
            添加商品
          </el-button>
          <el-button @click="importProducts">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <div class="toolbar-right">
            <el-input
              v-model="productSearchQuery"
              placeholder="搜索商品..."
              clearable
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        
        <el-table :data="currentZoneProducts" style="width: 100%" v-loading="loadingProducts">
          <el-table-column prop="name" label="商品名称" width="200">
            <template #default="scope">
              <div class="product-name-cell">
                <img :src="scope.row.image || '/default-product.jpg'" class="product-thumb" />
                <div>
                  <div class="product-name">{{ scope.row.name }}</div>
                  <div class="product-id">ID: {{ scope.row.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="description" label="描述" width="300">
            <template #default="scope">
              <el-tooltip :content="scope.row.description" placement="top">
                <div class="description-cell">{{ scope.row.description }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          
          <el-table-column prop="price" label="价格" width="120">
            <template #default="scope">
              <div class="price-cell">
                <span class="current-price">¥{{ scope.row.price.toFixed(2) }}</span>
                <span v-if="scope.row.originalPrice && scope.row.originalPrice > scope.row.price" class="original-price">
                  ¥{{ scope.row.originalPrice.toFixed(2) }}
                </span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="stock" label="库存" width="100">
            <template #default="scope">
              <span :class="{ 'low-stock': scope.row.stock <= 10, 'out-stock': scope.row.stock === 0 }">
                {{ scope.row.stock }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column prop="sales" label="销量" width="100" />
          
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
                {{ scope.row.isActive ? '上架' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editProduct(scope.row)">
                编辑
              </el-button>
              <el-button 
                :type="scope.row.isActive ? 'warning' : 'success'" 
                size="small" 
                @click="toggleProductStatus(scope.row)"
              >
                {{ scope.row.isActive ? '下架' : '上架' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteProduct(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="product-pagination">
          <el-pagination
            v-model:current-page="productCurrentPage"
            v-model:page-size="productPageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="currentZoneProducts.length"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </el-dialog>

    <!-- 创建/编辑商品对话框 -->
    <el-dialog 
      v-model="showCreateProductDialog" 
      :title="editingProduct ? '编辑商品' : '添加商品'" 
      width="800px"
    >
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input 
                v-model="productForm.name" 
                placeholder="请输入商品名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品类型" prop="type">
              <el-select v-model="productForm.type" placeholder="选择商品类型" style="width: 100%">
                <el-option label="游戏充值" value="游戏充值" />
                <el-option label="软件授权" value="软件授权" />
                <el-option label="会员服务" value="会员服务" />
                <el-option label="充值卡" value="充值卡" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="商品描述" prop="description">
          <el-input 
            v-model="productForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入商品描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品价格" prop="price">
              <el-input-number 
                v-model="productForm.price" 
                :min="0.01" 
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原价">
              <el-input-number 
                v-model="productForm.originalPrice" 
                :min="0.01" 
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number 
                v-model="productForm.stock" 
                :min="0" 
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="有效期" prop="validity">
              <el-input 
                v-model="productForm.validity" 
                placeholder="如：永久有效、1年、30天等"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序权重">
              <el-input-number 
                v-model="productForm.sortOrder" 
                :min="0" 
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="商品图片">
          <div class="image-upload">
            <el-upload
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload"
              action="#"
              :auto-upload="false"
              :on-change="handleImageChange"
            >
              <div v-if="productForm.image" class="image-preview">
                <img :src="productForm.image" alt="商品图片" />
                <div class="image-overlay">
                  <el-icon><Edit /></el-icon>
                  <span>更换图片</span>
                </div>
              </div>
              <div v-else class="image-placeholder">
                <el-icon><Plus /></el-icon>
                <span>上传图片</span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        
        <!-- 卡密类型管理 -->
        <el-form-item label="卡密类型">
          <div class="card-types-section">
            <div class="card-types-header">
              <span>管理商品的卡密类型</span>
              <el-button size="small" type="primary" @click="addCardType">
                <el-icon><Plus /></el-icon>
                添加类型
              </el-button>
            </div>
            
            <div class="card-types-list" v-if="productForm.cardTypes && productForm.cardTypes.length > 0">
              <div 
                v-for="(cardType, index) in productForm.cardTypes" 
                :key="index"
                class="card-type-item"
              >
                <div class="card-type-info">
                  <span class="card-type-name">{{ cardType.name }}</span>
                  <span class="card-type-desc">{{ cardType.description }}</span>
                  <div class="card-type-tags">
                    <el-tag :type="getCardTypeTagType(cardType.duration)" size="small">
                      {{ cardType.duration }}
                    </el-tag>
                    <el-tag type="success" size="small">
                      ¥{{ cardType.price?.toFixed(2) || '0.00' }}
                    </el-tag>
                  </div>
                </div>
                <div class="card-type-stats">
                  <span class="stock-count">库存: {{ getCardTypeStock(cardType.id) }}张</span>
                  <el-button 
                    size="small" 
                    type="primary" 
                    text 
                    @click="editCardType(index)"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    text 
                    @click="removeCardType(index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-card-types">
              <span>暂无卡密类型，点击上方按钮添加</span>
            </div>
          </div>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="热销标记">
              <el-switch v-model="productForm.isHot" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="新品标记">
              <el-switch v-model="productForm.isNew" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品状态">
              <el-switch 
                v-model="productForm.isActive" 
                active-text="上架" 
                inactive-text="下架"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateProductDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProduct" :loading="savingProduct">
          {{ editingProduct ? '保存修改' : '添加商品' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 卡密类型编辑对话框 -->
    <el-dialog 
      v-model="showCardTypeDialog" 
      :title="editingCardTypeIndex !== -1 ? '编辑卡密类型' : '添加卡密类型'" 
      width="500px"
    >
      <el-form :model="cardTypeForm" :rules="cardTypeRules" ref="cardTypeFormRef" label-width="100px">
        <el-form-item label="类型名称" prop="name">
          <el-input 
            v-model="cardTypeForm.name" 
            placeholder="如：月卡、季卡、年卡"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="类型描述" prop="description">
          <el-input 
            v-model="cardTypeForm.description" 
            type="textarea" 
            :rows="2"
            placeholder="请输入类型描述"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="类型价格" prop="price">
          <el-input-number 
            v-model="cardTypeForm.price" 
            :min="0.01" 
            :precision="2"
            controls-position="right"
            style="width: 100%"
            placeholder="请输入该类型的价格"
          />
          <div class="price-hint">
            <el-text type="info" size="small">设置该类型卡密的单价，购买时将按此价格计费</el-text>
          </div>
        </el-form-item>
        
        <el-form-item label="有效期" prop="duration">
          <el-select 
            v-model="cardTypeForm.duration" 
            placeholder="选择有效期" 
            style="width: 100%"
            @change="handleDurationChange"
          >
            <el-option label="7天" value="7天" />
            <el-option label="1个月" value="1个月" />
            <el-option label="3个月" value="3个月" />
            <el-option label="6个月" value="6个月" />
            <el-option label="1年" value="1年" />
            <el-option label="永久" value="永久" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        
        <!-- 自定义有效期设置 -->
        <el-form-item 
          v-if="cardTypeForm.duration === 'custom'" 
          label="自定义时间" 
          prop="customDuration"
        >
          <div class="custom-duration-input">
            <el-input-number
              v-model="cardTypeForm.customDurationValue"
              :min="1"
              :max="9999"
              placeholder="输入数值"
              style="width: 120px; margin-right: 8px;"
            />
            <el-select
              v-model="cardTypeForm.customDurationUnit"
              placeholder="选择单位"
              style="width: 100px;"
            >
              <el-option label="天" value="天" />
              <el-option label="周" value="周" />
              <el-option label="个月" value="个月" />
              <el-option label="年" value="年" />
            </el-select>
          </div>
          <div class="custom-duration-preview">
            <span v-if="customDurationPreview" class="duration-preview-text">
              预览：{{ customDurationPreview }}
            </span>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCardTypeDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCardType">
          {{ editingCardTypeIndex !== -1 ? '保存修改' : '添加类型' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 专区用户详情对话框 -->
    <el-dialog 
      v-model="showZoneUsersDialog" 
      :title="`${currentZoneForUsers?.name} - 活跃用户`" 
      width="800px"
    >
      <div class="zone-users-content">
        <div class="users-stats">
          <el-row :gutter="16">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-number">{{ getZoneUsers(currentZoneForUsers).length }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-number">{{ getActiveUsers(currentZoneForUsers).length }}</div>
                <div class="stat-label">活跃用户</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-number">¥{{ getTotalRevenue(currentZoneForUsers) }}</div>
                <div class="stat-label">总消费</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="users-list">
          <el-table :data="getZoneUsers(currentZoneForUsers)" style="width: 100%">
            <el-table-column label="用户" width="200">
              <template #default="scope">
                <div class="user-info">
                  <el-avatar 
                    :size="40" 
                    :src="scope.row.avatar || ''"
                    class="user-avatar"
                    @error="handleUserAvatarError(scope.row)"
                  >
                    <el-icon><User /></el-icon>
                  </el-avatar>
                  <div class="user-details">
                    <div class="user-name">{{ scope.row.realName || scope.row.username }}</div>
                    <div class="user-username">@{{ scope.row.username }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="level" label="等级" width="120">
              <template #default="scope">
                <el-tag :type="getLevelTagType(scope.row.level)">
                  {{ scope.row.level || '普通' }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="消费金额" width="120">
              <template #default="scope">
                <span class="amount">¥{{ scope.row.totalSpent || '0.00' }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="registerTime" label="注册时间" width="150">
              <template #default="scope">
                <span>{{ formatTime(scope.row.registerTime) }}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.isActive !== false ? 'success' : 'danger'">
                  {{ scope.row.isActive !== false ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="primary" size="small" @click="viewUserDetail(scope.row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showZoneUsersDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, More, Edit, Delete, Switch, Goods, Search, Upload, User
} from '@element-plus/icons-vue'

// 页面状态
const loading = ref(false)
const saving = ref(false)
const savingProduct = ref(false)
const loadingProducts = ref(false)

// 对话框显示状态
const showCreateZoneDialog = ref(false)
const showProductDialog = ref(false)
const showCreateProductDialog = ref(false)
const showZoneUsersDialog = ref(false)

// 编辑状态
const editingZone = ref(null)
const editingProduct = ref(null)
const currentZone = ref(null)
const currentZoneForUsers = ref(null)

// 搜索和分页
const productSearchQuery = ref('')
const productCurrentPage = ref(1)
const productPageSize = ref(20)

// 表单引用
const zoneFormRef = ref()
const productFormRef = ref()
const iconUploadRef = ref()

// 图标相关状态
const iconType = ref('emoji')

// 可选图标
const availableIcons = [
  '🎮', '💻', '👑', '💳', '📱', '🎵', '📺', '🎬', 
  '📚', '🛍️', '🎯', '⚡', '🔥', '💎', '🌟', '🚀'
]

// 专区数据
const zones = ref([
  {
    id: 1,
    name: '游戏专区',
    icon: '🎮',
    description: '热门游戏卡密和充值服务',
    isActive: true,
    productCount: 15,
    totalSales: 1250,
    revenue: 125000,
    sortOrder: 100,
    updateTime: '2024-01-13 14:30:25'
  },
  {
    id: 2,
    name: '软件专区',
    icon: '💻',
    description: '各类软件授权和订阅服务',
    isActive: true,
    productCount: 8,
    totalSales: 580,
    revenue: 89000,
    sortOrder: 90,
    updateTime: '2024-01-13 12:15:10'
  }
])

// 用户数据 (模拟数据，实际从localStorage获取)
const users = ref([
  {
    id: 1,
    username: 'gamer001',
    realName: '李小明',
    avatar: '/default-avatar.jpg', // 示例头像，使用默认图片路径
    level: '黄金会员',
    totalSpent: '2350.00',
    registerTime: '2023-08-15T10:30:00Z',
    lastLoginTime: '2024-01-13T09:20:00Z',
    favoriteZones: [1], // 经常购买游戏专区商品
    isActive: true
  },
  {
    id: 2,
    username: 'techpro',
    realName: '张雯雯',
    avatar: '', // 无头像
    level: '钻石会员',
    totalSpent: '5680.00',
    registerTime: '2023-06-20T15:45:00Z',
    lastLoginTime: '2024-01-13T11:15:00Z',
    favoriteZones: [2], // 经常购买软件专区商品
    isActive: true
  },
  {
    id: 3,
    username: 'casual_user',
    realName: '王大华',
    avatar: '',
    level: '普通',
    totalSpent: '320.00',
    registerTime: '2023-12-01T08:20:00Z',
    lastLoginTime: '2024-01-12T16:30:00Z',
    favoriteZones: [1, 2], // 两个专区都有购买
    isActive: true
  }
])

// 商品数据
const products = ref([
  {
    id: 1,
    zoneId: 1,
    name: 'Steam 钱包充值卡 100元',
    description: '全球通用，即时到账，支持所有Steam游戏购买',
    price: 100,
    originalPrice: 105,
    type: '充值卡',
    validity: '永久有效',
    stock: 150,
    sales: 520,
    isHot: true,
    isNew: false,
    isActive: true,
    sortOrder: 100,
    image: null,
    createTime: '2024-01-10 10:30:00',
    updateTime: '2024-01-13 14:25:00'
  },
  {
    id: 2,
    zoneId: 1,
    name: '原神创世结晶 6480个',
    description: '官方正版，安全可靠，支持iOS/Android/PC全平台',
    price: 648,
    originalPrice: 680,
    type: '游戏充值',
    validity: '永久有效',
    stock: 88,
    sales: 156,
    isHot: false,
    isNew: true,
    isActive: true,
    sortOrder: 95,
    image: null,
    createTime: '2024-01-12 15:20:00',
    updateTime: '2024-01-13 11:45:00'
  }
])

// 专区表单
const zoneForm = reactive({
  name: '',
  icon: '🎯',
  customIcon: '',
  iconType: 'emoji',
  description: '',
  isActive: true,
  sortOrder: 50
})

// 商品表单
const productForm = reactive({
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  type: '',
  validity: '',
  stock: 0,
  isHot: false,
  isNew: false,
  isActive: true,
  sortOrder: 50,
  image: null,
  cardTypes: []
})

// 卡密类型相关状态
const showCardTypeDialog = ref(false)
const editingCardTypeIndex = ref(-1)
const cardTypeFormRef = ref(null)
const cardTypeForm = reactive({
  name: '',
  description: '',
  price: 0,
  duration: '',
  customDurationValue: 1,
  customDurationUnit: '天'
})

const cardTypeRules = {
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入类型价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0.01', trigger: 'blur' }
  ],
  duration: [
    { required: true, message: '请选择有效期', trigger: 'change' }
  ]
}

// 自定义验证函数：确保至少有一个图标
const validateIcon = (rule, value, callback) => {
  console.log('=== 开始图标验证 ===')
  console.log('验证规则:', rule)
  console.log('当前值:', value)
  
  // 获取最新的表单数据
  console.log('表单数据快照:', {
    iconType: iconType.value,
    'zoneForm.icon': zoneForm.icon,
    'zoneForm.customIcon': zoneForm.customIcon ? '有数据(' + zoneForm.customIcon.length + '字符)' : '无数据',
    'zoneForm.iconType': zoneForm.iconType
  })
  
  // 检查是否有emoji图标或自定义图标
  const hasEmojiIcon = zoneForm.icon && typeof zoneForm.icon === 'string' && zoneForm.icon.trim() !== ''
  const hasCustomIcon = zoneForm.customIcon && typeof zoneForm.customIcon === 'string' && zoneForm.customIcon.trim() !== ''
  
  console.log('验证结果分析:', {
    hasEmojiIcon,
    hasCustomIcon,
    iconValue: zoneForm.icon,
    iconLength: zoneForm.icon ? zoneForm.icon.length : 0,
    customIconValue: hasCustomIcon ? '有数据' : '无数据',
    customIconLength: zoneForm.customIcon ? zoneForm.customIcon.length : 0
  })
  
  if (!hasEmojiIcon && !hasCustomIcon) {
    console.error('=== 图标验证失败 ===')
    console.error('原因: 既没有emoji图标也没有自定义图标')
    callback(new Error('请选择emoji图标或上传自定义图标'))
  } else {
    console.log('=== 图标验证通过 ===', hasEmojiIcon ? 'emoji图标' : '自定义图标')
    callback()
  }
}

// 表单验证规则
const zoneRules = {
  name: [
    { required: true, message: '请输入专区名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  // 移除icon字段验证，在保存时手动检查
  // icon: [{ validator: validateIcon, trigger: 'change' }],
  description: [
    { required: true, message: '请输入专区描述', trigger: 'blur' },
    { max: 100, message: '描述不能超过100个字符', trigger: 'blur' }
  ]
}

const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择商品类型', trigger: 'change' }
  ],
  validity: [
    { required: true, message: '请输入有效期', trigger: 'blur' }
  ]
}

// 计算属性
const currentZoneProducts = computed(() => {
  if (!currentZone.value) return []
  
  let filtered = products.value.filter(p => p.zoneId === currentZone.value.id)
  
  if (productSearchQuery.value) {
    const query = productSearchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const currentIconPreview = computed(() => {
  return iconType.value === 'emoji' ? zoneForm.icon : zoneForm.customIcon
})

// 方法
const editZone = (zone) => {
  editingZone.value = zone
  
  // 确定图标类型
  const isCustomIcon = zone.customIcon && zone.customIcon.trim() !== ''
  
  Object.assign(zoneForm, {
    name: zone.name,
    icon: isCustomIcon ? '' : (zone.icon || '🎯'),
    customIcon: zone.customIcon || '',
    iconType: isCustomIcon ? 'custom' : 'emoji',
    description: zone.description,
    isActive: zone.isActive,
    sortOrder: zone.sortOrder
  })
  
  iconType.value = isCustomIcon ? 'custom' : 'emoji'
  showCreateZoneDialog.value = true
}

const manageProducts = (zone) => {
  currentZone.value = zone
  showProductDialog.value = true
  loadingProducts.value = true
  // 模拟加载
  setTimeout(() => {
    loadingProducts.value = false
  }, 500)
}

const toggleZoneStatus = async (zone) => {
  try {
    await ElMessageBox.confirm(
      `确认${zone.isActive ? '禁用' : '启用'}专区 "${zone.name}"？`,
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    zone.isActive = !zone.isActive
    zone.updateTime = new Date().toLocaleString('zh-CN')
    saveZonesData()
    ElMessage.success(`专区已${zone.isActive ? '启用' : '禁用'}`)
  } catch {
    // 用户取消
  }
}

const deleteZone = async (zone) => {
  try {
    await ElMessageBox.confirm(
      `确认删除专区 "${zone.name}"？此操作将同时删除该专区下的所有商品，且不可恢复！`,
      '危险操作',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    // 删除专区
    const zoneIndex = zones.value.findIndex(z => z.id === zone.id)
    if (zoneIndex !== -1) {
      zones.value.splice(zoneIndex, 1)
    }
    
    // 删除该专区下的所有商品
    products.value = products.value.filter(p => p.zoneId !== zone.id)
    
    saveZonesData()
    saveProductsData()
    ElMessage.success('专区及其商品已删除')
  } catch {
    // 用户取消
  }
}

const saveZone = async () => {
  if (!zoneFormRef.value) return
  
  await zoneFormRef.value.validate(async (valid) => {
    console.log('基本表单验证结果:', valid)
    
    if (valid) {
      // 手动检查图标
      const hasEmojiIcon = zoneForm.icon && zoneForm.icon.trim() !== ''
      const hasCustomIcon = zoneForm.customIcon && zoneForm.customIcon.trim() !== ''
      
      console.log('手动图标检查:', {
        hasEmojiIcon,
        hasCustomIcon,
        iconValue: zoneForm.icon,
        customIconLength: zoneForm.customIcon ? zoneForm.customIcon.length : 0
      })
      
      if (!hasEmojiIcon && !hasCustomIcon) {
        console.error('图标检查失败：未选择任何图标')
        ElMessage.error('请选择emoji图标或上传自定义图标')
        return
      }
      
      console.log('图标检查通过，继续保存...')
      saving.value = true
      
      try {
        // 模拟保存延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('当前表单数据:', {
          name: zoneForm.name,
          iconType: iconType.value,
          icon: zoneForm.icon,
          customIcon: zoneForm.customIcon ? '已设置（' + zoneForm.customIcon.length + '字符）' : '未设置'
        })
        
        if (editingZone.value) {
          // 编辑现有专区
          const updateData = {
            name: zoneForm.name,
            description: zoneForm.description,
            isActive: zoneForm.isActive,
            sortOrder: zoneForm.sortOrder,
            updateTime: new Date().toLocaleString('zh-CN')
          }
          
          // 根据图标类型更新图标数据
          if (iconType.value === 'emoji') {
            updateData.icon = zoneForm.icon
            updateData.customIcon = '' // 清空自定义图标
          } else {
            updateData.icon = '' // 清空emoji图标
            updateData.customIcon = zoneForm.customIcon
          }
          
          Object.assign(editingZone.value, updateData)
          console.log('专区数据已更新:', editingZone.value)
          ElMessage.success('专区修改成功')
        } else {
          // 创建新专区
          const newZone = {
            id: Date.now(),
            name: zoneForm.name,
            description: zoneForm.description,
            isActive: zoneForm.isActive,
            productCount: 0,
            totalSales: 0,
            revenue: 0,
            sortOrder: zoneForm.sortOrder,
            updateTime: new Date().toLocaleString('zh-CN')
          }
          
          // 根据图标类型设置图标数据
          if (iconType.value === 'emoji') {
            newZone.icon = zoneForm.icon
            newZone.customIcon = ''
          } else {
            newZone.icon = ''
            newZone.customIcon = zoneForm.customIcon
          }
          zones.value.unshift(newZone)
          ElMessage.success('专区创建成功')
        }
        
        saveZonesData()
        
        // 关闭对话框
        showCreateZoneDialog.value = false
        
        // 延迟重置表单，避免与表单验证冲突
        setTimeout(() => {
          console.log('延迟重置表单...')
          resetZoneForm()
        }, 300)
        
        console.log('保存完成，当前专区数量:', zones.value.length)
      } catch (error) {
        console.error('=== 保存过程中出错 ===', error)
        ElMessage.error('保存失败: ' + error.message)
      } finally {
        console.log('设置 saving = false')
        saving.value = false
      }
    } else {
      console.error('表单验证失败')
      ElMessage.error('请检查表单数据')
    }
  })
  
  console.log('=== saveZone 函数结束 ===')
}

const editProduct = (product) => {
  editingProduct.value = product
  Object.assign(productForm, {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    type: product.type,
    validity: product.validity,
    stock: product.stock,
    isHot: product.isHot,
    isNew: product.isNew,
    isActive: product.isActive,
    sortOrder: product.sortOrder,
    image: product.image,
    cardTypes: product.cardTypes || []
  })
  showCreateProductDialog.value = true
}

const toggleProductStatus = async (product) => {
  try {
    await ElMessageBox.confirm(
      `确认${product.isActive ? '下架' : '上架'}商品 "${product.name}"？`,
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    product.isActive = !product.isActive
    product.updateTime = new Date().toLocaleString('zh-CN')
    saveProductsData()
    ElMessage.success(`商品已${product.isActive ? '上架' : '下架'}`)
  } catch {
    // 用户取消
  }
}

const deleteProduct = async (product) => {
  try {
    await ElMessageBox.confirm(
      `确认删除商品 "${product.name}"？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const productIndex = products.value.findIndex(p => p.id === product.id)
    if (productIndex !== -1) {
      products.value.splice(productIndex, 1)
      
      // 更新专区商品数量
      const zone = zones.value.find(z => z.id === product.zoneId)
      if (zone) {
        zone.productCount = Math.max(0, zone.productCount - 1)
      }
    }
    
    saveProductsData()
    saveZonesData()
    ElMessage.success('商品已删除')
  } catch {
    // 用户取消
  }
}

const saveProduct = async () => {
  if (!productFormRef.value) return
  
  await productFormRef.value.validate(async (valid) => {
    if (valid) {
      savingProduct.value = true
      
      try {
        // 模拟保存延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (editingProduct.value) {
          // 编辑现有商品
          Object.assign(editingProduct.value, {
            name: productForm.name,
            description: productForm.description,
            price: productForm.price,
            originalPrice: productForm.originalPrice,
            type: productForm.type,
            validity: productForm.validity,
            stock: productForm.stock,
            isHot: productForm.isHot,
            isNew: productForm.isNew,
            isActive: productForm.isActive,
            sortOrder: productForm.sortOrder,
            image: productForm.image,
            cardTypes: productForm.cardTypes || [],
            updateTime: new Date().toLocaleString('zh-CN')
          })
          ElMessage.success('商品修改成功')
        } else {
          // 创建新商品
          const newProduct = {
            id: Date.now(),
            zoneId: currentZone.value.id,
            name: productForm.name,
            description: productForm.description,
            price: productForm.price,
            originalPrice: productForm.originalPrice,
            type: productForm.type,
            validity: productForm.validity,
            stock: productForm.stock,
            sales: 0,
            isHot: productForm.isHot,
            isNew: productForm.isNew,
            isActive: productForm.isActive,
            sortOrder: productForm.sortOrder,
            image: productForm.image,
            cardTypes: productForm.cardTypes || [],
            createTime: new Date().toLocaleString('zh-CN'),
            updateTime: new Date().toLocaleString('zh-CN')
          }
          products.value.unshift(newProduct)
          
          // 更新专区商品数量
          currentZone.value.productCount++
          ElMessage.success('商品添加成功')
        }
        
        saveProductsData()
        saveZonesData()
        showCreateProductDialog.value = false
        resetProductForm()
      } finally {
        savingProduct.value = false
      }
    }
  })
}

const importProducts = () => {
  ElMessage.info('批量导入功能开发中...')
}

const handleImageChange = (file) => {
  if (file.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.image = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
}

const handleImageSuccess = (response, file) => {
  // 处理图片上传成功
}

const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 图标相关方法
const selectEmojiIcon = (icon) => {
  console.log('选择emoji图标:', icon)
  zoneForm.icon = icon
  zoneForm.customIcon = ''
  iconType.value = 'emoji'
}

// 上传组件事件处理
const handleUploadClick = () => {
  console.log('=== 上传组件被点击 ===')
}

const handleUploadExceed = (files, fileList) => {
  console.log('=== 上传文件数量超限 ===', files, fileList)
  ElMessage.warning('只能上传一个文件')
}

// 保存按钮点击处理
const handleSaveClick = () => {
  console.log('=== 保存按钮被点击 ===')
  
  // 详细检查表单数据
  console.log('点击时的详细数据:')
  console.log('- name:', zoneForm.name)
  console.log('- iconType:', iconType.value)
  console.log('- icon:', zoneForm.icon, '(类型:', typeof zoneForm.icon, '长度:', zoneForm.icon ? zoneForm.icon.length : 0, ')')
  console.log('- customIcon:', zoneForm.customIcon ? '有数据' : '无数据')
  if (zoneForm.customIcon) {
    console.log('  - customIcon 类型:', typeof zoneForm.customIcon)
    console.log('  - customIcon 长度:', zoneForm.customIcon.length)
    console.log('  - customIcon 前50字符:', zoneForm.customIcon.substring(0, 50))
  }
  console.log('- description:', zoneForm.description)
  console.log('- isActive:', zoneForm.isActive)
  console.log('- sortOrder:', zoneForm.sortOrder)
  
  // 检查是否满足保存条件
  const hasEmojiIcon = zoneForm.icon && zoneForm.icon.trim() !== ''
  const hasCustomIcon = zoneForm.customIcon && zoneForm.customIcon.trim() !== ''
  console.log('=== 保存条件检查 ===')
  console.log('hasEmojiIcon:', hasEmojiIcon)
  console.log('hasCustomIcon:', hasCustomIcon)
  console.log('图标条件满足:', hasEmojiIcon || hasCustomIcon)
  
  // 调用原始的保存函数
  saveZone()
}

const handleIconChange = (file) => {
  console.log('=== 图片上传开始 ===', {
    file: file,
    raw: file?.raw,
    name: file?.name,
    size: file?.raw?.size,
    type: file?.raw?.type
  })
  
  if (!file || !file.raw) {
    console.error('文件对象为空或缺少raw属性')
    ElMessage.error('文件选择失败，请重试')
    return
  }
  
  console.log('开始处理文件:', file.name, '大小:', file.raw.size, 'bytes')
  
  // 完全移除所有限制，仅保留基本检查
  if (file.raw.size === 0) {
    console.error('文件为空')
    ElMessage.error('文件为空，请选择有效文件')
    return
  }
  
  if (file.raw.size > 10 * 1024 * 1024) { // 10MB上限，防止浏览器崩溃
    console.error('文件太大:', file.raw.size)
    ElMessage.error('文件太大，请选择小于10MB的文件')
    return
  }
  
  console.log('文件验证通过，开始读取文件...')
  
  // 开始读取文件
  const reader = new FileReader()
  
  reader.onload = (e) => {
    console.log('FileReader onload 事件触发')
    try {
      const result = e.target.result
      console.log('文件读取成功，数据长度:', result.length)
      console.log('数据类型:', typeof result)
      console.log('数据前50个字符:', result.substring(0, 50))
      
      // 更新表单数据
      zoneForm.customIcon = result
      zoneForm.icon = '' // 清空emoji图标
      iconType.value = 'custom'
      zoneForm.iconType = 'custom'
      
      console.log('zoneForm.customIcon 已设置，长度:', zoneForm.customIcon.length)
      console.log('iconType.value:', iconType.value)
      console.log('zoneForm.iconType:', zoneForm.iconType)
      
      ElMessage.success('图片上传成功！现在可以保存了')
    } catch (error) {
      console.error('文件处理错误:', error)
      ElMessage.error('文件处理失败: ' + error.message)
    }
  }
  
  reader.onerror = (error) => {
    console.error('FileReader 错误:', error)
    ElMessage.error('文件读取失败，请重试')
  }
  
  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      const progress = (e.loaded / e.total) * 100
      console.log('文件读取进度:', progress.toFixed(1) + '%')
    }
  }
  
  console.log('开始调用 reader.readAsDataURL...')
  reader.readAsDataURL(file.raw)
}

const removeCustomIcon = () => {
  console.log('移除自定义图标，恢复为emoji')
  zoneForm.customIcon = ''
  zoneForm.icon = '🎯'
  iconType.value = 'emoji'
  if (iconUploadRef.value) {
    iconUploadRef.value.clearFiles()
  }
}

const resetZoneForm = () => {
  console.log('=== 重置表单 ===')
  
  // 先清空表单验证状态，避免冲突
  if (zoneFormRef.value) {
    zoneFormRef.value.clearValidate()
  }
  
  Object.assign(zoneForm, {
    name: '',
    icon: '🎯', // 默认emoji图标
    customIcon: '',
    iconType: 'emoji',
    description: '',
    isActive: true,
    sortOrder: 50
  })
  iconType.value = 'emoji'
  editingZone.value = null
  
  // 确保清空文件上传组件
  if (iconUploadRef.value) {
    iconUploadRef.value.clearFiles()
  }
  
  console.log('表单重置完成，默认图标:', zoneForm.icon)
  console.log('重置后的表单数据:', {
    name: zoneForm.name,
    icon: zoneForm.icon,
    customIcon: zoneForm.customIcon,
    iconType: iconType.value
  })
}

const resetProductForm = () => {
  Object.assign(productForm, {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    type: '',
    validity: '',
    stock: 0,
    isHot: false,
    isNew: false,
    isActive: true,
    sortOrder: 50,
    image: null,
    cardTypes: []
  })
  editingProduct.value = null
}

// 卡密类型管理方法
const resetCardTypeForm = () => {
  Object.assign(cardTypeForm, {
    name: '',
    description: '',
    price: 0,
    duration: '',
    customDurationValue: 1,
    customDurationUnit: '天'
  })
  editingCardTypeIndex.value = -1
}

// 自定义时间预览
const customDurationPreview = computed(() => {
  if (cardTypeForm.duration !== 'custom') return ''
  if (!cardTypeForm.customDurationValue || !cardTypeForm.customDurationUnit) return ''
  
  const value = cardTypeForm.customDurationValue
  const unit = cardTypeForm.customDurationUnit
  
  return `${value}${unit}`
})

// 有效期选择变化处理
const handleDurationChange = (value) => {
  if (value !== 'custom') {
    cardTypeForm.customDurationValue = 1
    cardTypeForm.customDurationUnit = '天'
  }
}

const addCardType = () => {
  resetCardTypeForm()
  showCardTypeDialog.value = true
}

const editCardType = (index) => {
  const cardType = productForm.cardTypes[index]
  
  // 处理自定义时间的回显
  if (cardType.isCustomDuration) {
    Object.assign(cardTypeForm, {
      name: cardType.name,
      description: cardType.description,
      price: cardType.price || 0,
      duration: 'custom',
      customDurationValue: cardType.customDurationValue || 1,
      customDurationUnit: cardType.customDurationUnit || '天'
    })
  } else {
    Object.assign(cardTypeForm, {
      name: cardType.name,
      description: cardType.description,
      price: cardType.price || 0,
      duration: cardType.duration,
      customDurationValue: 1,
      customDurationUnit: '天'
    })
  }
  
  console.log('编辑卡密类型，原始ID:', cardType.id, typeof cardType.id)
  
  editingCardTypeIndex.value = index
  showCardTypeDialog.value = true
}

const removeCardType = (index) => {
  productForm.cardTypes.splice(index, 1)
  ElMessage.success('删除成功')
}

const saveCardType = async () => {
  try {
    if (!cardTypeFormRef.value) return
    
    await cardTypeFormRef.value.validate()
    
    // 处理自定义时间
    let finalDuration = cardTypeForm.duration
    if (cardTypeForm.duration === 'custom') {
      if (!cardTypeForm.customDurationValue || !cardTypeForm.customDurationUnit) {
        ElMessage.error('请完善自定义时间设置')
        return
      }
      finalDuration = `${cardTypeForm.customDurationValue}${cardTypeForm.customDurationUnit}`
    }
    
    const cardTypeData = {
      id: editingCardTypeIndex.value !== -1 
        ? String(productForm.cardTypes[editingCardTypeIndex.value].id) // 确保编辑时ID也是字符串
        : String(Date.now()), // 确保ID是字符串类型
      name: cardTypeForm.name,
      description: cardTypeForm.description,
      price: Number(cardTypeForm.price) || 0, // 确保价格是数字类型
      duration: finalDuration,
      isCustomDuration: cardTypeForm.duration === 'custom',
      customDurationValue: cardTypeForm.duration === 'custom' ? cardTypeForm.customDurationValue : null,
      customDurationUnit: cardTypeForm.duration === 'custom' ? cardTypeForm.customDurationUnit : null
    }
    
    console.log('保存卡密类型数据:', cardTypeData)
    console.log('价格字段详细信息:', {
      原始价格: cardTypeForm.price,
      类型: typeof cardTypeForm.price,
      转换后价格: cardTypeData.price,
      转换后类型: typeof cardTypeData.price
    })
    
    if (editingCardTypeIndex.value !== -1) {
      // 编辑模式
      productForm.cardTypes[editingCardTypeIndex.value] = cardTypeData
      ElMessage.success('修改成功')
    } else {
      // 添加模式
      productForm.cardTypes.push(cardTypeData)
      ElMessage.success('添加成功')
    }
    
    showCardTypeDialog.value = false
    resetCardTypeForm()
  } catch (error) {
    console.error('保存卡密类型失败:', error)
  }
}

// 获取卡密类型标签颜色
const getCardTypeTagType = (duration) => {
  const typeMap = {
    '7天': 'info',
    '1个月': 'success',
    '3个月': 'warning',
    '6个月': 'danger',
    '1年': 'danger',
    '永久': 'success'
  }
  
  // 如果是预设的时间选项
  if (typeMap[duration]) {
    return typeMap[duration]
  }
  
  // 如果是自定义时间，根据数值范围判断
  const customMatch = duration.match(/^(\d+)(天|周|个月|年)$/)
  if (customMatch) {
    const value = parseInt(customMatch[1])
    const unit = customMatch[2]
    
    // 转换为天数进行比较
    let totalDays = 0
    switch (unit) {
      case '天':
        totalDays = value
        break
      case '周':
        totalDays = value * 7
        break
      case '个月':
        totalDays = value * 30
        break
      case '年':
        totalDays = value * 365
        break
    }
    
    if (totalDays <= 30) return 'info'        // 30天以内
    if (totalDays <= 90) return 'success'     // 3个月以内  
    if (totalDays <= 180) return 'warning'    // 6个月以内
    return 'danger'                           // 6个月以上
  }
  
  return 'info'
}

// 获取卡密类型库存数量
const getCardTypeStock = (cardTypeId) => {
  try {
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    const currentZone = zones.value.find(z => z.id === selectedZone.value)
    const currentProduct = currentZone?.products.find(p => p.id === editingProduct.value?.id)
    
    console.log('=== 统计卡密类型库存 ===')
    console.log('卡密类型ID:', cardTypeId)
    console.log('当前选中专区:', selectedZone.value, currentZone?.name)
    console.log('当前编辑商品:', editingProduct.value?.id, currentProduct?.name)
    console.log('所有卡密数量:', allCards.length)
    
    if (!currentProduct || !currentZone) {
      console.log('找不到当前商品或专区，返回0')
      return 0
    }
    
    // 先找到所有相关的卡密
    const relatedCards = allCards.filter(card => 
      card.zoneId === currentZone.id &&
      card.productId === currentProduct.id
    )
    
    console.log('相关商品的所有卡密:', relatedCards.length, '张')
    
    // 再找到该类型的可用卡密 - 使用字符串比较确保类型匹配
    const availableCards = relatedCards.filter(card => {
      const cardTypeIdStr = String(card.cardTypeId)
      const targetTypeIdStr = String(cardTypeId)
      const typeMatch = cardTypeIdStr === targetTypeIdStr
      const statusMatch = card.status === 'unused'
      const notPurchased = !card.purchasedBy
      
      console.log(`卡密 ${card.cardNumber} 检查:`, {
        cardTypeId: card.cardTypeId,
        cardTypeIdStr,
        targetTypeId: cardTypeId,
        targetTypeIdStr,
        typeMatch,
        statusMatch,
        notPurchased
      })
      
      return typeMatch && statusMatch && notPurchased
    })
    
    console.log('该类型可用卡密:', availableCards.length, '张')
    
    // 显示一些卡密样本用于调试
    if (relatedCards.length > 0) {
      console.log('卡密样本:', relatedCards.slice(0, 3).map(card => ({
        cardNumber: card.cardNumber,
        cardTypeId: card.cardTypeId,
        status: card.status,
        zoneId: card.zoneId,
        productId: card.productId
      })))
    }
    
    return availableCards.length
  } catch (error) {
    console.error('统计库存失败:', error)
    return 0
  }
}

const saveZonesData = () => {
  console.log('=== saveZonesData 开始 ===')
  try {
    console.log('准备保存的专区数据:', zones.value.length, '个专区')
    
    // 检查每个专区的图标数据
    zones.value.forEach((zone, index) => {
      console.log(`专区 ${index + 1}:`, {
        id: zone.id,
        name: zone.name,
        hasIcon: !!zone.icon,
        hasCustomIcon: !!zone.customIcon,
        customIconLength: zone.customIcon ? zone.customIcon.length : 0,
        customIconType: zone.customIcon ? (zone.customIcon.startsWith('data:') ? 'base64' : 'other') : 'none'
      })
    })
    
    const dataToSave = JSON.stringify(zones.value)
    console.log('序列化后的数据大小:', dataToSave.length, '字符')
    
    localStorage.setItem('card_zones', dataToSave)
    console.log('localStorage.setItem 调用完成')
    
    // 验证保存是否成功
    const savedData = localStorage.getItem('card_zones')
    if (!savedData) {
      throw new Error('保存失败：数据未成功写入localStorage')
    }
    
    console.log('验证保存成功，读取数据大小:', savedData.length, '字符')
    
    // 验证解析
    const parsedData = JSON.parse(savedData)
    console.log('解析数据成功，专区数量:', parsedData.length)
    
    console.log('=== 专区数据保存成功 ===')
    
  } catch (error) {
    console.error('=== 保存专区数据失败 ===', error)
    ElMessage.error('保存失败：' + error.message)
  }
}

const saveProductsData = () => {
  console.log('=== 保存商品数据 ===')
  console.log('商品数量:', products.value.length)
  
  // 检查每个商品的卡密类型
  products.value.forEach((product, index) => {
    console.log(`商品 ${index + 1}:`, {
      id: product.id,
      name: product.name,
      zoneId: product.zoneId,
      cardTypesCount: product.cardTypes?.length || 0,
      cardTypes: product.cardTypes
    })
  })
  
  localStorage.setItem('card_products', JSON.stringify(products.value))
  console.log('商品数据保存完成')
}

const loadData = () => {
  console.log('=== loadData 开始 ===')
  try {
    const savedZones = localStorage.getItem('card_zones')
    console.log('localStorage 中的专区数据:', savedZones ? savedZones.length + '字符' : '无数据')
    
    if (savedZones) {
      const parsedZones = JSON.parse(savedZones)
      zones.value = parsedZones
      console.log('加载专区数据成功:', parsedZones.length, '个专区')
      
      // 检查每个专区的图标数据
      parsedZones.forEach((zone, index) => {
        console.log(`加载的专区 ${index + 1}:`, {
          id: zone.id,
          name: zone.name,
          icon: zone.icon || '无',
          hasCustomIcon: !!zone.customIcon,
          customIconLength: zone.customIcon ? zone.customIcon.length : 0
        })
      })
      
      // 检查是否有自定义图标
      const customIconZones = parsedZones.filter(zone => zone.customIcon && zone.customIcon.trim() !== '')
      if (customIconZones.length > 0) {
        console.log('发现', customIconZones.length, '个专区使用了自定义图标')
        customIconZones.forEach(zone => {
          console.log(`- ${zone.name}: ${zone.customIcon.substring(0, 50)}...`)
        })
      } else {
        console.log('没有发现使用自定义图标的专区')
      }
    } else {
      console.log('未找到已保存的专区数据，使用默认数据')
    }
    
    const savedProducts = localStorage.getItem('card_products')
    if (savedProducts) {
      products.value = JSON.parse(savedProducts)
      console.log('加载商品数据成功:', products.value.length, '个商品')
      
      // 检查每个商品的卡密类型
      products.value.forEach((product, index) => {
        console.log(`加载的商品 ${index + 1}:`, {
          id: product.id,
          name: product.name,
          zoneId: product.zoneId,
          cardTypesCount: product.cardTypes?.length || 0,
          cardTypes: product.cardTypes
        })
      })
    } else {
      console.log('未找到已保存的商品数据')
    }
    
    console.log('=== loadData 完成 ===')
  } catch (error) {
    console.error('=== 加载数据失败 ===', error)
    ElMessage.error('加载数据失败，请刷新页面重试')
  }
}

// 图片加载错误处理
const handleImageError = (zone) => {
  console.warn(`专区 ${zone.name} 的自定义图标加载失败，恢复为emoji图标`)
  zone.customIcon = ''
  if (!zone.icon) {
    zone.icon = '🎯'
  }
  saveZonesData()
}

// ===== 用户相关方法 =====

// 从localStorage加载用户数据
const loadUsersData = () => {
  try {
    const savedUsers = localStorage.getItem('all_users')
    if (savedUsers) {
      users.value = JSON.parse(savedUsers)
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

// 获取指定专区的用户列表
const getZoneUsers = (zone) => {
  if (!zone) return []
  
  return users.value.filter(user => {
    // 根据用户的收藏专区或购买记录来判断
    return user.favoriteZones && user.favoriteZones.includes(zone.id)
  }).sort((a, b) => {
    // 按消费金额降序排列
    return parseFloat(b.totalSpent || 0) - parseFloat(a.totalSpent || 0)
  })
}

// 获取活跃用户 (最近30天有登录)
const getActiveUsers = (zone) => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  return getZoneUsers(zone).filter(user => {
    if (!user.lastLoginTime) return false
    return new Date(user.lastLoginTime) > thirtyDaysAgo
  })
}

// 计算专区总消费
const getTotalRevenue = (zone) => {
  const zoneUsers = getZoneUsers(zone)
  const total = zoneUsers.reduce((sum, user) => {
    return sum + parseFloat(user.totalSpent || 0)
  }, 0)
  return total.toFixed(2)
}

// 显示专区用户详情对话框
const showZoneUsersDialogHandler = (zone) => {
  currentZoneForUsers.value = zone
  showZoneUsersDialog.value = true
}

// 查看用户详情
const viewUserDetail = (user) => {
  ElMessage.info(`查看用户 ${user.realName || user.username} 的详情`)
  // 这里可以跳转到用户详情页面或打开用户详情对话框
}

// 获取用户等级对应的标签类型
const getLevelTagType = (level) => {
  const levelTypes = {
    '普通': 'info',
    '青铜会员': 'warning',
    '黄金会员': 'success', 
    '白金会员': 'primary',
    '钻石会员': 'danger'
  }
  return levelTypes[level] || 'info'
}

// 处理用户头像加载错误
const handleUserAvatarError = (user) => {
  console.warn(`用户 ${user.username} 的头像加载失败`)
  // 头像加载失败时会自动显示默认图标
}

// 格式化时间显示
const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  try {
    const date = new Date(timeStr)
    return date.toLocaleDateString('zh-CN')
  } catch (error) {
    return '-'
  }
}

onMounted(() => {
  loadData()
  loadUsersData()
})
</script>

<style lang="scss" scoped>
.zone-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    
    .zone-card {
      border: 1px solid #e4e7ed;
      border-radius: 12px;
      padding: 24px;
      background: #fff;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
      
      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }
      
      .zone-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
        
        .zone-icon {
          font-size: 48px;
          margin-right: 16px;
          flex-shrink: 0;
          
          .custom-zone-icon {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #f0f0f0;
          }
        }
        
        .zone-info {
          flex: 1;
          
          h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
            color: #303133;
          }
          
          .zone-desc {
            margin: 0;
            color: #909399;
            font-size: 14px;
            line-height: 1.5;
          }
        }
        
        .zone-actions {
          flex-shrink: 0;
        }
      }
      
      .zone-stats {
        display: flex;
        gap: 20px;
        margin-bottom: 16px;
        
        .stat-item {
          text-align: center;
          
          .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #409eff;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 12px;
            color: #909399;
          }
        }
      }
      
      // 用户头像区域样式
      .zone-users {
        margin-bottom: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .users-title {
            font-size: 13px;
            font-weight: 600;
            color: #409eff;
          }
          
          .users-count {
            font-size: 12px;
            color: #909399;
            background: rgba(64, 158, 255, 0.1);
            padding: 2px 8px;
            border-radius: 10px;
          }
        }
        
        .users-avatars {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .user-avatar-wrapper {
            position: relative;
            cursor: pointer;
            transition: transform 0.2s ease;
            
            &:hover {
              transform: scale(1.1);
              z-index: 10;
            }
            
            .user-avatar {
              border: 2px solid #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              
              :deep(.el-avatar__inner) {
                background-color: #f5f5f5;
              }
            }
            
            .user-level-badge {
              position: absolute;
              top: -4px;
              right: -4px;
              background: linear-gradient(45deg, #ff6b6b, #ffd93d);
              color: white;
              font-size: 10px;
              padding: 1px 4px;
              border-radius: 6px;
              font-weight: 600;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
              white-space: nowrap;
              max-width: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          
          .more-users {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #e9ecef;
            color: #6c757d;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid #fff;
            
            &:hover {
              background: #409eff;
              color: white;
              transform: scale(1.1);
            }
          }
          
          .no-users {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 32px;
            color: #909399;
            font-size: 12px;
          }
        }
      }
      
      .zone-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .update-time {
          font-size: 12px;
          color: #c0c4cc;
        }
      }
    }
  }
  
  .icon-selector {
    .icon-input {
      margin-bottom: 12px;
    }
    
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
      
      .icon-option {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        border: 2px solid #e4e7ed;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          border-color: #409eff;
          background: #ecf5ff;
        }
        
        &.selected {
          border-color: #409eff;
          background: #409eff;
          color: white;
        }
      }
    }
    
    .icon-tabs {
      margin-bottom: 16px;
      
      :deep(.el-tabs__header) {
        margin: 0 0 16px 0;
      }
    }
    
    .custom-icon-upload {
      .icon-uploader {
        :deep(.el-upload) {
          border: 2px dashed #d9d9d9;
          border-radius: 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          
          &:hover {
            border-color: #409eff;
          }
        }
      }
      
      .upload-area {
        width: 200px;
        height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        
        .upload-icon {
          font-size: 28px;
          color: #8c939d;
          margin-bottom: 8px;
        }
        
        .upload-text {
          color: #606266;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .upload-hint {
          color: #c0c4cc;
          font-size: 12px;
          line-height: 1.4;
        }
      }
      
      .custom-icon-preview {
        width: 200px;
        height: 120px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }
        
        .icon-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 4px;
        }
        
        &:hover .icon-overlay {
          opacity: 1;
        }
      }
    }
    
    .icon-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      
      .preview-label {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }
      
      .preview-icon {
        font-size: 24px;
      }
      
      .preview-image {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #e4e7ed;
      }
    }
  }
  
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-left: 8px;
  }
  
  .product-management {
    .product-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .toolbar-right {
        .search-input {
          width: 300px;
        }
      }
    }
    
    .product-name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .product-thumb {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 6px;
        background: #f5f7fa;
      }
      
      .product-name {
        font-weight: 600;
        color: #303133;
      }
      
      .product-id {
        font-size: 12px;
        color: #909399;
      }
    }
    
    .description-cell {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }
    
    .price-cell {
      .current-price {
        font-weight: 700;
        color: #67c23a;
      }
      
      .original-price {
        display: block;
        font-size: 12px;
        color: #909399;
        text-decoration: line-through;
      }
    }
    
    .low-stock {
      color: #e6a23c !important;
      font-weight: 600;
    }
    
    .out-stock {
      color: #f56c6c !important;
      font-weight: 600;
    }
    
    .product-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
  
  .image-upload {
    .image-preview {
      position: relative;
      width: 120px;
      height: 120px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        &:hover {
          opacity: 1;
        }
        
        span {
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }
    
    .image-placeholder {
      width: 120px;
      height: 120px;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border-color 0.3s ease;
      
      &:hover {
        border-color: #409eff;
      }
      
      .el-icon {
        font-size: 28px;
        color: #c0c4cc;
        margin-bottom: 8px;
      }
      
      span {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

@media (max-width: 768px) {
  .zone-management {
    .zones-grid {
      grid-template-columns: 1fr;
      
      .zone-card {
        .zone-stats {
          justify-content: space-around;
        }
      }
    }
    
    .product-management {
      .product-toolbar {
        flex-direction: column;
        gap: 16px;
        
        .toolbar-right {
          width: 100%;
          
          .search-input {
            width: 100%;
          }
        }
      }
    }
  }
}

// 用户详情对话框样式
.zone-users-content {
  .users-stats {
    margin-bottom: 24px;
    
    .stat-card {
      text-align: center;
      padding: 16px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 8px;
      border: 1px solid #e9ecef;
      
      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #409eff;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #6c757d;
        font-weight: 500;
      }
    }
  }
  
  .users-list {
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .user-avatar {
        flex-shrink: 0;
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .user-details {
        .user-name {
          font-weight: 600;
          color: #303133;
          margin-bottom: 2px;
        }
        
        .user-username {
          font-size: 12px;
          color: #909399;
        }
      }
    }
    
    .amount {
      font-weight: 600;
      color: #67c23a;
    }
  }
  
  // 卡密类型管理样式
  .card-types-section {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    
    .card-types-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      span {
        font-weight: 500;
        color: #606266;
      }
    }
    
    .card-types-list {
      .card-type-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #f0f0f0;
        border-radius: 6px;
        margin-bottom: 8px;
        background: #fafafa;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .card-type-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          
          .card-type-name {
            font-weight: 500;
            color: #303133;
          }
          
          .card-type-desc {
            color: #909399;
            font-size: 14px;
          }
        }
        
        .card-type-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .stock-count {
            color: #67c23a;
            font-size: 12px;
            font-weight: 500;
            margin-right: 8px;
          }
        }
      }
    }
    
    .empty-card-types {
      text-align: center;
      padding: 32px;
      color: #909399;
      font-size: 14px;
    }
  }
  
  // 自定义时间输入样式
  .custom-duration-input {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .el-input-number {
      flex-shrink: 0;
    }
    
    .el-select {
      flex-shrink: 0;
    }
  }
  
  .custom-duration-preview {
    margin-top: 8px;
    
    .duration-preview-text {
      color: #409eff;
      font-size: 12px;
      background: #ecf5ff;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
  }
}
</style>