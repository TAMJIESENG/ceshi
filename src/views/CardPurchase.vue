<template>
  <div class="card-purchase">
    <!-- 企业级导航栏 -->
    <div class="enterprise-navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-text">CardKey<span class="pro-suffix">Enterprise</span></span>
        </div>
        <div class="nav-search">
          <el-input
            v-model="searchQuery"
            placeholder="搜索企业级数字商品..."
            clearable
            class="enterprise-search"
            size="large"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="nav-actions">
          <div class="user-badge">
            <el-avatar :size="32" class="user-avatar">
              {{ userStore.user?.username?.charAt(0)?.toUpperCase() || 'U' }}
            </el-avatar>
            <span class="user-name">{{ userStore.user?.username || 'Guest' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-background">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">
            <span class="badge-icon">🏢</span>
            <span>Enterprise Digital Commerce</span>
          </div>
          <h1 class="hero-title">
            专业级数字卡密
            <span class="title-gradient">交易平台</span>
          </h1>
          <p class="hero-subtitle">
            为企业客户提供安全、高效、专业的数字商品交易服务
            <br/>支持批量采购、企业级安全认证、实时API对接
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">企业客户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1M+</div>
              <div class="stat-label">成功交易</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.99%</div>
              <div class="stat-label">系统可用性</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 企业级分类导航 -->
    <div class="category-navigation">
      <div class="nav-container">
        <div class="category-header">
          <h2>产品分类</h2>
          <p>选择您的业务需求分类</p>
        </div>
        <div class="category-grid">
          <div
            v-for="zone in zones"
            :key="zone.id"
            class="category-card"
            :class="{ active: activeZone === zone.id }"
            @click="switchZone(zone.id)"
          >
            <div class="category-icon">
              <div class="icon-wrapper">
                <!-- 显示自定义图标或emoji图标 -->
                <span v-if="!zone.customIcon || zone.customIcon.trim() === ''">{{ zone.icon || '🎯' }}</span>
                <img v-else :src="zone.customIcon" :alt="zone.name" class="custom-zone-icon" @error="handleIconError(zone)" />
              </div>
            </div>
            <div class="category-info">
              <h3>{{ zone.name }}</h3>
              <p class="category-desc">{{ zone.description || '专业数字商品解决方案' }}</p>
              <div class="category-meta">
                <span class="product-count">{{ zone.productCount }} 款产品</span>
                <span class="availability">现货充足</span>
              </div>
            </div>
            <div class="category-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 企业级筛选器 -->
    <div class="enterprise-filters">
      <div class="filters-container">
        <div class="filters-left">
          <div class="filter-section">
            <h3>价格范围</h3>
            <el-select v-model="priceFilter" placeholder="选择价格范围" clearable size="large">
              <el-option label="全部价格" value="" />
              <el-option label="¥0-50" value="0-50" />
              <el-option label="¥50-100" value="50-100" />
              <el-option label="¥100-500" value="100-500" />
              <el-option label="¥500+" value="500+" />
            </el-select>
          </div>
          
          <div class="filter-section">
            <h3>排序方式</h3>
            <el-select v-model="sortOrder" placeholder="选择排序" size="large">
              <el-option label="智能推荐" value="recommended" />
              <el-option label="价格优先" value="price-asc" />
              <el-option label="高端优先" value="price-desc" />
              <el-option label="最新上架" value="newest" />
              <el-option label="热销精选" value="sales" />
            </el-select>
          </div>
        </div>
        
        <div class="filters-right">
          <div class="results-summary">
            <div class="summary-badge">
              <span class="count">{{ filteredProducts.length }}</span>
              <span class="label">款企业级产品</span>
            </div>
            <div class="quality-badge">
              <span class="icon">✓</span>
              <span>全部现货</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 企业级产品展示 -->
    <div class="products-showcase">
      <div class="showcase-container">
        <div class="products-grid" v-loading="loading">
          <div 
            v-for="product in paginatedProducts" 
            :key="product.id"
            class="enterprise-product-card"
            :class="{ 'out-of-stock': product.stock === 0 }"
          >
            <div class="card-image-section">
              <div class="image-container">
                <img 
                  :src="product.image || '/default-product.jpg'" 
                  :alt="product.name"
                  @error="handleImageError"
                />
                <div class="image-overlay">
                  <div class="overlay-content">
                    <el-button type="primary" size="large" circle @click="showProductDetails(product)">
                      <el-icon><View /></el-icon>
                    </el-button>
                    <span class="overlay-text">查看详情</span>
                  </div>
                </div>
              </div>
              
              <div class="status-badges">
                <div v-if="product.isHot" class="status-badge hot">
                  <span class="badge-icon">🔥</span>
                  <span class="badge-text">企业热销</span>
                </div>
                <div v-if="product.isNew" class="status-badge new">
                  <span class="badge-icon">✨</span>
                  <span class="badge-text">新品上市</span>
                </div>
                <div v-if="product.stock === 0" class="status-badge sold-out">
                  <span class="badge-text">暂时售罄</span>
                </div>
                <div v-if="product.stock > 0 && product.stock <= 10" class="status-badge limited">
                  <span class="badge-text">优先供应</span>
                </div>
              </div>
            </div>
            
            <div class="card-content-section">
              <div class="content-header">
                <div class="product-title-area">
                  <h3 class="product-title" :title="product.name">{{ product.name }}</h3>
                  <div class="title-underline"></div>
                </div>
                <div class="product-rating">
                  <el-rate 
                    v-model="product.rating" 
                    disabled 
                    show-score 
                    text-color="#f59e0b"
                    score-template="{value}"
                    size="small"
                  />
                </div>
              </div>
              
              <p class="product-summary">{{ product.description }}</p>
              
              <div class="product-specifications">
                <div class="spec-grid">
                  <div class="spec-card">
                    <div class="spec-icon">💼</div>
                    <div class="spec-details">
                      <div class="spec-label">产品类型</div>
                      <div class="spec-value">{{ product.type }}</div>
                    </div>
                  </div>
                  <div class="spec-card">
                    <div class="spec-icon">⏰</div>
                    <div class="spec-details">
                      <div class="spec-label">服务周期</div>
                      <div class="spec-value">{{ product.validity }}</div>
                    </div>
                  </div>
                  <div class="spec-card">
                    <div class="spec-icon">📦</div>
                    <div class="spec-details">
                      <div class="spec-label">库存情况</div>
                      <div class="spec-value" :class="{ 'limited-stock': product.stock <= 10 }">
                        {{ product.stock }} 件
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="pricing-section">
                <div class="enterprise-pricing">
                  <div v-if="userVipInfo.level > 0" class="vip-pricing">
                    <div class="pricing-header">
                      <span class="pricing-label">VIP企业价</span>
                      <el-tag 
                        size="small" 
                        :type="userVipInfo.level === 1 ? 'warning' : ''"
                        :color="userVipInfo.level === 2 ? '#9333ea' : ''"
                        class="discount-tag"
                      >
                        {{ userVipInfo.name }}{{ (10 - userVipInfo.discount * 10).toFixed(1) }}折
                      </el-tag>
                    </div>
                    <div class="pricing-main">
                      <div class="current-price">¥{{ calculateProductPrice(product, 1).finalTotal.toFixed(2) }}</div>
                      <div class="price-comparison">
                        <span class="original-price">原价: ¥{{ calculateProductPrice(product, 1).actualPrice.toFixed(2) }}</span>
                        <span class="savings-badge">省¥{{ calculateProductPrice(product, 1).totalSavings.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="standard-pricing">
                    <div class="pricing-main">
                      <div class="current-price">¥{{ product.price.toFixed(2) }}</div>
                      <div class="upgrade-prompt">
                        <router-link to="/vip" class="upgrade-link">
                          <span class="icon">⭐</span>
                          升级VIP享优惠
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="action-controls">
                  <div class="quantity-selector">
                    <label class="quantity-label">数量：</label>
                    <el-input-number
                      v-model="product.quantity"
                      :min="1"
                      :max="Math.min(product.stock || 99, 99)"
                      :disabled="!product.stock || product.stock === 0"
                      size="large"
                      class="quantity-input"
                    />
                  </div>
                  
                  <div class="action-buttons">
                    <el-button 
                      @click="showProductDetails(product)"
                      size="large"
                      class="enterprise-btn detail-btn"
                    >
                      <el-icon><View /></el-icon>
                      查看详情
                    </el-button>
                    <el-button 
                      type="primary" 
                      @click="addToCart(product)"
                      :disabled="product.stock === 0"
                      size="large"
                      class="enterprise-btn cart-btn"
                    >
                      <el-icon><ShoppingCart /></el-icon>
                      加入购物车
                    </el-button>
                    <el-button 
                      type="success" 
                      @click="buyNow(product)"
                      :disabled="product.stock === 0"
                      size="large"
                      class="enterprise-btn buy-btn"
                    >
                      立即购买
                    </el-button>
                    <el-button 
                      type="warning" 
                      @click="openReviewDialog(product)"
                      size="large"
                      class="enterprise-btn review-btn"
                    >
                      <el-icon><Edit /></el-icon>
                      评价商品
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        <!-- 空状态 -->
        <div v-if="filteredProducts.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>暂无商品</h3>
          <p>当前专区暂时没有商品，请切换到其他专区查看</p>
        </div>
      </div>
    </div>
  </div>

    <!-- 分页器 -->
    <div class="pagination-container" v-if="filteredProducts.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 48, 96]"
        :total="filteredProducts.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 购物车侧边栏 -->
    <div class="cart-sidebar" :class="{ active: showCartSidebar }">
      <div class="cart-header">
        <h3>🛒 购物车 ({{ cartItems.length }})</h3>
        <el-button 
          type="text" 
          @click="showCartSidebar = false"
          class="close-cart-btn"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <div class="empty-cart-icon">🛒</div>
          <p>购物车是空的</p>
        </div>
        
        <div v-else class="cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="cart-item"
          >
            <img :src="item.image || '/default-product.jpg'" :alt="item.name" class="cart-item-image" />
            <div class="cart-item-info">
              <h4 class="cart-item-name">{{ item.name }}</h4>
              <div class="cart-item-controls">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="item.stock || 99"
                  size="small"
                  @change="updateCartItem(item)"
                />
                <span class="cart-item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                <el-button 
                  type="text" 
                  size="small" 
                  @click="removeFromCart(item.id)"
                  class="remove-item-btn"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <span class="total-label">总计：</span>
          <span class="total-amount">¥{{ cartTotal.toFixed(2) }}</span>
        </div>
        <el-button 
          type="primary" 
          @click="proceedToCheckout"
          class="checkout-btn"
          size="large"
        >
          立即结算
        </el-button>
      </div>
    </div>

    <!-- 购物车遮罩 -->
    <div 
      v-if="showCartSidebar" 
      class="cart-overlay"
      @click="showCartSidebar = false"
    ></div>

    <!-- 购物车浮动按钮 -->
    <div class="floating-cart" @click="showCartSidebar = true">
      <el-badge :value="cartItems.length" :hidden="cartItems.length === 0">
        <el-button type="primary" size="large" circle>
          <el-icon><ShoppingCart /></el-icon>
        </el-button>
      </el-badge>
    </div>

    <!-- 商品详情弹窗 -->
    <el-dialog 
      v-model="showProductDetailDialog" 
      :title="currentDetailProduct?.name || '商品详情'" 
      width="90%"
      :max-width="1200"
      class="product-detail-dialog"
      :before-close="closeProductDetail"
    >
      <div v-if="currentDetailProduct" class="product-detail-content">
        <!-- 详情头部 -->
        <div class="detail-header">
          <div class="detail-images">
            <div class="main-image">
              <img 
                :src="currentDetailImage || currentDetailProduct.image || '/default-product.jpg'" 
                :alt="currentDetailProduct.name"
                @error="handleImageError"
              />
            </div>
            <div class="image-thumbnails">
              <div 
                v-for="(image, index) in getProductImages(currentDetailProduct)" 
                :key="index"
                class="thumbnail"
                :class="{ active: currentDetailImage === image }"
                @click="currentDetailImage = image"
              >
                <img :src="image" :alt="`${currentDetailProduct.name} 图片 ${index + 1}`" />
              </div>
            </div>
          </div>
          
          <div class="detail-info">
            <div class="product-title-section">
              <h1>{{ currentDetailProduct.name }}</h1>
              <div class="product-badges">
                <el-tag v-if="currentDetailProduct.isHot" type="danger" size="small">🔥 企业热销</el-tag>
                <el-tag v-if="currentDetailProduct.isNew" type="primary" size="small">✨ 新品上市</el-tag>
                <el-tag v-if="currentDetailProduct.stock <= 10" type="warning" size="small">📦 优先供应</el-tag>
              </div>
            </div>
            
            <div class="rating-section">
              <el-rate 
                v-model="currentDetailProduct.rating" 
                disabled 
                show-score 
                text-color="#f59e0b"
                score-template="{value} 分"
              />
              <span class="review-count">({{ currentDetailProduct.reviewCount || 128 }}条评价)</span>
            </div>
            
            <div class="price-section-detail">
              <div v-if="userVipInfo.level > 0" class="vip-price-detail">
                <div class="price-main">
                  <span class="current-price">¥{{ calculateProductPrice(currentDetailProduct, 1).finalTotal.toFixed(2) }}</span>
                  <span class="original-price">原价: ¥{{ calculateProductPrice(currentDetailProduct, 1).actualPrice.toFixed(2) }}</span>
                </div>
                <div class="vip-benefits">
                  <el-tag type="success" size="small">
                    {{ userVipInfo.name }}专享 {{ (10 - userVipInfo.discount * 10).toFixed(1) }}折优惠
                  </el-tag>
                  <span class="savings">立省 ¥{{ calculateProductPrice(currentDetailProduct, 1).totalSavings.toFixed(2) }}</span>
                </div>
              </div>
              <div v-else class="standard-price-detail">
                <span class="current-price">¥{{ currentDetailProduct.price.toFixed(2) }}</span>
                <div class="upgrade-hint">
                  <router-link to="/vip" class="vip-upgrade">
                    <el-icon><Star /></el-icon>
                    升级VIP享受企业级优惠
                  </router-link>
                </div>
              </div>
            </div>
            
            <div class="stock-section">
              <div class="stock-info">
                <span class="stock-label">库存状态:</span>
                <span class="stock-value" :class="{ 'low-stock': currentDetailProduct.stock <= 10 }">
                  {{ currentDetailProduct.stock > 0 ? `现货${currentDetailProduct.stock}件` : '暂时缺货' }}
                </span>
              </div>
              <div class="delivery-info">
                <el-icon><Check /></el-icon>
                <span>企业级服务 • 即时交付 • 7×24技术支持</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 详情标签页 -->
        <div class="detail-tabs">
          <el-tabs v-model="activeDetailTab" class="detail-tab-container">
            <el-tab-pane label="产品详情" name="details">
              <div class="product-details">
                <div class="detail-section">
                  <h3>产品描述</h3>
                  <p>{{ currentDetailProduct.description || '专业的企业级数字商品解决方案，为您的业务提供安全、可靠、高效的服务体验。' }}</p>
                </div>
                
                <div class="detail-section">
                  <h3>产品规格</h3>
                  <div class="specs-table">
                    <div class="spec-row">
                      <span class="spec-key">产品类型</span>
                      <span class="spec-value">{{ currentDetailProduct.type || '企业级数字商品' }}</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-key">服务周期</span>
                      <span class="spec-value">{{ currentDetailProduct.validity || '长期有效' }}</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-key">交付方式</span>
                      <span class="spec-value">即时自动交付</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-key">技术支持</span>
                      <span class="spec-value">7×24小时在线服务</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-key">安全保障</span>
                      <span class="spec-value">企业级安全认证</span>
                    </div>
                  </div>
                </div>
                
                <div class="detail-section">
                  <h3>服务优势</h3>
                  <div class="advantages-list">
                    <div class="advantage-item">
                      <el-icon><Lock /></el-icon>
                      <div>
                        <h4>安全可靠</h4>
                        <p>采用银行级安全标准，确保数据安全和交易可靠性</p>
                      </div>
                    </div>
                    <div class="advantage-item">
                      <el-icon><Setting /></el-icon>
                      <div>
                        <h4>即时交付</h4>
                        <p>自动化处理系统，支付成功后立即交付产品</p>
                      </div>
                    </div>
                    <div class="advantage-item">
                      <el-icon><Tools /></el-icon>
                      <div>
                        <h4>专业服务</h4>
                        <p>7×24小时技术支持，专业团队为您提供优质服务</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="用户评价" name="reviews">
              <div class="product-reviews">
                <div class="reviews-summary">
                  <div class="rating-overview">
                    <div class="rating-score">
                      <span class="score">{{ currentDetailProduct.rating || 4.8 }}</span>
                      <el-rate 
                        v-model="currentDetailProduct.rating" 
                        disabled 
                        size="large"
                      />
                    </div>
                    <div class="rating-stats">
                      <div class="stat-item">
                        <span class="stars">5星</span>
                        <div class="progress-bar"><div class="progress" style="width: 75%"></div></div>
                        <span class="count">96</span>
                      </div>
                      <div class="stat-item">
                        <span class="stars">4星</span>
                        <div class="progress-bar"><div class="progress" style="width: 20%"></div></div>
                        <span class="count">26</span>
                      </div>
                      <div class="stat-item">
                        <span class="stars">3星</span>
                        <div class="progress-bar"><div class="progress" style="width: 3%"></div></div>
                        <span class="count">4</span>
                      </div>
                      <div class="stat-item">
                        <span class="stars">2星</span>
                        <div class="progress-bar"><div class="progress" style="width: 1%"></div></div>
                        <span class="count">1</span>
                      </div>
                      <div class="stat-item">
                        <span class="stars">1星</span>
                        <div class="progress-bar"><div class="progress" style="width: 1%"></div></div>
                        <span class="count">1</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="reviews-list">
                  <div v-if="!currentDetailProduct?.reviews || currentDetailProduct.reviews.length === 0" class="no-reviews">
                    <p>暂无评价，来写第一条评价吧！</p>
                    <el-button type="primary" @click="openReviewDialog(currentDetailProduct)">
                      <el-icon><Edit /></el-icon>
                      写评价
                    </el-button>
                  </div>
                  <div class="review-item" v-for="review in currentDetailProduct?.reviews || []" :key="review.id">
                    <div class="reviewer-info">
                      <el-avatar :size="40" :src="review.avatar">{{ review.userName?.charAt(0) || 'U' }}</el-avatar>
                      <div class="reviewer-details">
                        <h4>{{ review.userName || '匿名用户' }}</h4>
                        <div class="review-meta">
                          <el-rate :model-value="review.rating" disabled size="small" />
                          <span class="review-time">{{ formatTime(review.date) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="review-content">
                      <p>{{ review.content }}</p>
                      <div v-if="review.images && review.images.length > 0" class="review-images">
                        <img v-for="(image, index) in review.images" :key="index" :src="image" :alt="`评价图片${index + 1}`" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="购买须知" name="notice">
              <div class="purchase-notice">
                <div class="notice-section">
                  <h3>🔒 安全保障</h3>
                  <ul>
                    <li>所有交易均采用SSL加密传输，确保支付安全</li>
                    <li>产品均通过企业级安全检测，品质有保障</li>
                    <li>支持7天无理由退换，消费者权益得到充分保护</li>
                  </ul>
                </div>
                
                <div class="notice-section">
                  <h3>📦 交付说明</h3>
                  <ul>
                    <li>支付成功后系统将自动发送产品信息到您的邮箱</li>
                    <li>卡密信息也会在用户中心的订单详情中显示</li>
                    <li>请妥善保管卡密信息，避免泄露给他人</li>
                  </ul>
                </div>
                
                <div class="notice-section">
                  <h3>💝 售后服务</h3>
                  <ul>
                    <li>7×24小时在线客服支持，随时为您解答疑问</li>
                    <li>专业技术团队提供使用指导和技术支持</li>
                    <li>企业客户享受专属客户经理一对一服务</li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      
      <template #footer>
        <div class="detail-footer-actions">
          <div class="quantity-section">
            <span class="quantity-label">购买数量:</span>
            <el-input-number
              v-model="detailQuantity"
              :min="1"
              :max="Math.min(currentDetailProduct?.stock || 99, 99)"
              :disabled="!currentDetailProduct?.stock"
              size="large"
            />
          </div>
          <div class="action-buttons">
            <el-button size="large" @click="closeProductDetail">
              取消
            </el-button>
            <el-button 
              type="primary" 
              size="large"
              @click="addToCartFromDetail"
              :disabled="!currentDetailProduct?.stock"
            >
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button 
              type="success" 
              size="large"
              @click="buyNowFromDetail"
              :disabled="!currentDetailProduct?.stock"
            >
              立即购买
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 评价弹窗 -->
    <el-dialog 
      v-model="showReviewDialog" 
      :title="`评价商品 - ${currentReviewProduct?.name || ''}`"
      width="600px"
      class="review-dialog"
      @close="closeReviewDialog"
    >
      <div v-if="currentReviewProduct" class="review-form">
        <!-- 产品信息 -->
        <div class="review-product-info">
          <img 
            :src="currentReviewProduct.image || '/default-product.jpg'" 
            :alt="currentReviewProduct.name" 
            class="review-product-image"
          />
          <div class="review-product-details">
            <h3>{{ currentReviewProduct.name }}</h3>
            <p class="product-price">¥{{ currentReviewProduct.price }}</p>
          </div>
        </div>

        <!-- 评分 -->
        <div class="review-rating">
          <label>评分：</label>
          <el-rate 
            v-model="newReview.rating" 
            :max="5"
            show-text
            :texts="['极差', '较差', '一般', '推荐', '力荐']"
            size="large"
            style="--el-rate-icon-size: 20px;"
          />
        </div>

        <!-- 评价内容 -->
        <div class="review-content">
          <label>评价内容：</label>
          <el-input
            v-model="newReview.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您对这款产品的使用体验..."
            maxlength="500"
            show-word-limit
          />
        </div>

        <!-- 用户信息显示 -->
        <div class="reviewer-info">
          <div class="reviewer-avatar">
            <el-icon><UserFilled /></el-icon>
          </div>
          <span class="reviewer-name">{{ userStore.user?.name || '匿名用户' }}</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="closeReviewDialog" size="large">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="submitReview" 
          size="large"
          :disabled="!newReview.content.trim()"
        >
          <el-icon><Plus /></el-icon>
          提交评价
        </el-button>
      </template>
    </el-dialog>

    <!-- 购买确认对话框 -->
    <el-dialog v-model="showPurchaseDialog" title="确认购买" width="500px">
      <div v-if="currentProduct" class="purchase-confirmation">
        <div class="product-summary">
          <img :src="currentProduct.image || '/default-product.jpg'" :alt="currentProduct.name" class="summary-image" />
          <div class="summary-info">
            <h4>{{ currentProduct.name }}</h4>
            
            <!-- 卡密类型选择 -->
            <div class="card-type-selection" v-if="availableCardTypes.length > 0">
              <h4>选择卡密类型：</h4>
              <div class="card-type-grid">
                <div 
                  v-for="cardType in availableCardTypes" 
                  :key="cardType.id"
                  class="card-type-option"
                  :class="{ active: selectedCardType?.id === cardType.id }"
                  @click="selectCardType(cardType)"
                >
                  <div class="card-type-header">
                    <span class="card-type-name">{{ cardType.name }}</span>
                    <div class="card-type-tags">
                      <el-tag :type="getCardTypeTagType(cardType.duration)" size="small">
                        {{ cardType.duration }}
                      </el-tag>
                      <el-tag type="success" size="small">
                        ¥{{ cardType.price?.toFixed(2) || '0.00' }}
                      </el-tag>
                    </div>
                  </div>
                  <p class="card-type-desc">{{ cardType.description }}</p>
                  <div class="card-type-stock">
                    <span class="stock-label">库存: {{ getCardTypeStock(cardType.id) }}张</span>
                  </div>
                </div>
              </div>
              
              <!-- 无卡密类型提示 -->
              <div v-if="selectedCardType && getCardTypeStock(selectedCardType.id) === 0" class="no-stock-warning">
                <el-alert
                  title="该类型卡密暂时缺货"
                  type="warning"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>
            
            <!-- 数量选择 -->
            <div class="quantity-selection">
              <label>购买数量：</label>
              <el-input-number 
                v-model="purchaseQuantity" 
                :min="1" 
                :max="getMaxQuantity()"
                size="default"
              />
              <span class="quantity-hint">
                (最多可购买 {{ getMaxQuantity() }} 张)
              </span>
            </div>
            
            <div v-if="userVipInfo.level > 0" class="vip-summary-pricing">
              <p class="summary-original">原价：¥{{ calculateFinalPrice(currentProduct.price, purchaseQuantity, true).actualPrice.toFixed(2) }} × {{ purchaseQuantity }}</p>
              <p class="summary-discount">
                {{ userVipInfo.name }}优惠：{{ (10 - userVipInfo.discount * 10).toFixed(1) }}折
                <el-tag 
                  size="small" 
                  :type="userVipInfo.level === 1 ? 'warning' : ''"
                  :color="userVipInfo.level === 2 ? '#9333ea' : ''"
                  style="margin-left: 8px;"
                >
                  -¥{{ calculateFinalPrice(currentProduct.price, purchaseQuantity, true).totalSavings.toFixed(2) }}
                </el-tag>
              </p>
              <p class="summary-total vip-total">实付：¥{{ calculateFinalPrice(currentProduct.price, purchaseQuantity, true).finalTotal.toFixed(2) }}</p>
            </div>
            <div v-else>
              <p class="summary-price">单价：¥{{ calculateFinalPrice(currentProduct.price, 1, true).actualPrice.toFixed(2) }}</p>
              <p class="summary-quantity">数量：{{ purchaseQuantity }} 张</p>
              <p class="summary-total">总计：¥{{ calculateFinalPrice(currentProduct.price, purchaseQuantity, true).finalTotal.toFixed(2) }}</p>
              <div class="vip-promotion">
                <router-link to="/vip" style="color: #409eff; font-size: 12px;">
                  升级VIP/SVIP享受购买优惠 →
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <div class="payment-method-selection">
          <h4>选择支付方式：</h4>
          <el-radio-group v-model="selectedPaymentMethod">
            <el-radio v-if="availablePaymentMethods.alipay" label="alipay">
              <el-icon><Money /></el-icon>
              支付宝
            </el-radio>
            <el-radio v-if="availablePaymentMethods.wechat" label="wechat">
              <el-icon><Money /></el-icon>
              微信支付
            </el-radio>
            <el-radio label="balance">
              <el-icon><Wallet /></el-icon>
              账户余额 (¥{{ userStore.user?.balance?.toFixed(2) || '0.00' }})
            </el-radio>
          </el-radio-group>
          
          <!-- 余额不足提示 -->
          <div v-if="selectedPaymentMethod === 'balance' && (userStore.user?.balance || 0) < calculateFinalPrice(currentProduct.price, purchaseQuantity, true).finalTotal" class="insufficient-balance">
            <el-alert
              title="余额不足"
              type="warning"
              :closable="false"
            >
              <div>
                <p>需要支付：¥{{ calculateFinalPrice(currentProduct.price, purchaseQuantity, true).finalTotal.toFixed(2) }}</p>
                <p>当前余额：¥{{ (userStore.user?.balance || 0).toFixed(2) }}</p>
                <p>请先充值或选择其他支付方式</p>
              </div>
            </el-alert>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showPurchaseDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmPurchase" 
          :loading="purchasing"
          :disabled="!canProceedPurchase"
        >
          确认购买
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useVipStore } from '@/stores/vip'
import { 
  Search, ShoppingCart, Close, Delete, Money, Wallet, ArrowRight, View,
  Star, Check, Lock, Setting, Tools, Edit, Plus, UserFilled
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const vipStore = useVipStore()

// 页面状态
const loading = ref(false)
const searchQuery = ref('')
const activeZone = ref(1)
const priceFilter = ref('')
const sortOrder = ref('recommended')
const currentPage = ref(1)
const pageSize = ref(12)

// 购物车状态
const showCartSidebar = ref(false)
const cartItems = ref([])

// 商品详情弹窗
const showProductDetailDialog = ref(false)
const currentDetailProduct = ref(null)
const currentDetailImage = ref('')
const activeDetailTab = ref('details')
const detailQuantity = ref(1)

// 评价功能
const showReviewDialog = ref(false)
const currentReviewProduct = ref(null)
const newReview = reactive({
  rating: 5,
  content: '',
  images: []
})

// 购买对话框
const showPurchaseDialog = ref(false)
const currentProduct = ref(null)
const purchaseQuantity = ref(1)
const selectedPaymentMethod = ref('balance')
const purchasing = ref(false)

// 卡密类型相关
const selectedCardType = ref(null)
const availableCardTypes = computed(() => {
  const types = currentProduct.value?.cardTypes || []
  console.log('可用卡密类型:', types)
  
  // 从卡密记录中获取真实价格
  const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
  
  const typesWithRealPrices = types.map(type => {
    // 查找该类型的卡密记录
    const typeCards = allCards.filter(card => 
      card.status === 'unused' && 
      !card.purchasedBy && 
      String(card.zoneId) === String(currentProduct.value?.zoneId) && 
      String(card.productId) === String(currentProduct.value?.id) &&
      String(card.cardTypeId) === String(type.id)
    )
    
    if (typeCards.length > 0) {
      // 从第一张卡密获取真实面值
      const firstCard = typeCards[0]
      let realPrice = 0
      
      if (firstCard.cardTypePrice) {
        // 如果卡密有 cardTypePrice 字段，使用它
        realPrice = firstCard.cardTypePrice
      } else if (firstCard.value) {
        // 从 value 字段解析价格 (格式如: "¥15" 或 "15")
        const valueStr = String(firstCard.value).replace('¥', '').replace('元', '')
        realPrice = parseFloat(valueStr) || 0
      }
      
      // 更新类型的价格
      type.price = realPrice
      console.log(`从卡密记录获取价格: ${type.name} -> ¥${realPrice} (来源: ${typeCards.length}张卡密)`)
    } else {
      console.warn(`卡密类型 ${type.name} 没有找到可用卡密，无法获取价格`)
      type.price = 0
    }
    
    return type
  })
  
  return typesWithRealPrices
})


// 支付方式可用性
const availablePaymentMethods = ref({
  alipay: false,
  wechat: false,
  bankTransfer: false,
  paypal: false
})

// 专区数据
const zones = ref([])

// 商品数据
const products = ref([])

// 模拟评价数据
const mockReviews = ref([
  {
    id: 1,
    username: '企业用户A***',
    rating: 5,
    time: '2024-01-15',
    content: '非常专业的企业级解决方案，交付及时，服务优质，强烈推荐给其他企业用户。',
    tags: ['服务专业', '交付及时', '质量优秀']
  },
  {
    id: 2,
    username: '商务客户B***',
    rating: 5,
    time: '2024-01-10',
    content: '产品质量很好，客服响应迅速，解决问题很及时，会继续合作。',
    tags: ['质量可靠', '客服优秀', '响应迅速']
  },
  {
    id: 3,
    username: '技术总监C***',
    rating: 4,
    time: '2024-01-08',
    content: '整体使用体验不错，技术支持很到位，有小问题但很快就解决了。',
    tags: ['技术支持好', '使用方便']
  },
  {
    id: 4,
    username: '采购经理D***',
    rating: 5,
    time: '2024-01-05',
    content: '采购流程简单，价格透明，VIP服务很贴心，为公司节省了不少成本。',
    tags: ['流程简单', '价格透明', 'VIP服务']
  }
])

// 用户VIP信息
const user = computed(() => userStore.user)
const userVipInfo = computed(() => {
  if (!user.value) return vipStore.vipLevels['普通']
  return vipStore.getUserVipInfo(user.value.level || '普通')
})

// 计算属性
const currentZoneProducts = computed(() => {
  return products.value.filter(p => p.zoneId === activeZone.value)
})

const filteredProducts = computed(() => {
  let filtered = currentZoneProducts.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  // 价格过滤
  if (priceFilter.value) {
    const [min, max] = priceFilter.value.split('-').map(v => v === '+' ? Infinity : parseInt(v))
    filtered = filtered.filter(p => p.price >= min && (max === undefined || p.price <= max))
  }

  // 排序
  switch (sortOrder.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
    case 'sales':
      filtered.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0))
      break
    default:
      // 推荐排序：热销 > 新品 > 评分
      filtered.sort((a, b) => {
        if (a.isHot && !b.isHot) return -1
        if (!a.isHot && b.isHot) return 1
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return b.rating - a.rating
      })
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const canProceedPurchase = computed(() => {
  if (!currentProduct.value) return false
  
  // 如果商品有卡密类型，必须选择卡密类型
  if (availableCardTypes.value.length > 0 && !selectedCardType.value) {
    return false
  }
  
  // 如果选择了卡密类型，检查库存
  if (selectedCardType.value && getCardTypeStock(selectedCardType.value.id) < purchaseQuantity.value) {
    return false
  }
  
  if (selectedPaymentMethod.value === 'balance') {
    const totalCost = calculateFinalPrice(currentProduct.value.price, purchaseQuantity.value, true).finalTotal
    return (userStore.user?.balance || 0) >= totalCost
  }
  return true
})

// VIP价格计算函数 - 用于特定商品的价格计算
const calculateProductPrice = (product, quantity = 1) => {
  let actualPrice = product.price
  console.log('=== 计算商品价格 ===', product.name, '基础价格:', actualPrice)
  
  // 如果商品有卡密类型，使用第一个有库存的卡密类型价格
  if (product.cardTypes && product.cardTypes.length > 0) {
    console.log('商品有', product.cardTypes.length, '个卡密类型')
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    
    // 找到第一个有库存的卡密类型
    const availableCardType = product.cardTypes.find(cardType => {
      const availableCards = allCards.filter(card => 
        card.status === 'unused' && 
        !card.purchasedBy && 
        String(card.zoneId) === String(product.zoneId) && 
        String(card.productId) === String(product.id) &&
        String(card.cardTypeId) === String(cardType.id)
      )
      return availableCards.length > 0
    })
    
    if (availableCardType) {
      // 从卡密记录中获取真实价格
      const availableCards = allCards.filter(card => 
        card.status === 'unused' && 
        !card.purchasedBy && 
        String(card.zoneId) === String(product.zoneId) && 
        String(card.productId) === String(product.id) &&
        String(card.cardTypeId) === String(availableCardType.id)
      )
      
      console.log('找到可用卡密', availableCards.length, '张，第一张价格:', availableCards[0]?.cardTypePrice)
      if (availableCards.length > 0) {
        // 优先使用 cardTypePrice 字段
        if (availableCards[0].cardTypePrice) {
          actualPrice = availableCards[0].cardTypePrice
          console.log('商品', product.name, '使用卡密记录价格(cardTypePrice):', actualPrice)
        } else if (availableCards[0].value) {
          // 从 value 字段解析价格
          const valueStr = String(availableCards[0].value).replace('¥', '').replace('元', '')
          actualPrice = parseFloat(valueStr) || actualPrice
          console.log('商品', product.name, '使用卡密记录价格(value):', actualPrice)
        }
      } else if (availableCardType.price) {
        actualPrice = availableCardType.price
        console.log('商品', product.name, '使用卡密类型配置价格:', actualPrice)
      }
    } else {
      console.log('没有找到有库存的卡密类型，使用基础价格:', actualPrice)
    }
  }
  
  const originalTotal = actualPrice * quantity
  const userLevel = user.value?.level || '普通'
  const discountInfo = vipStore.calculateDiscountPrice(actualPrice, userLevel)
  const finalTotal = discountInfo.finalPrice * quantity
  const totalSavings = discountInfo.savings * quantity
  
  return {
    originalTotal: parseFloat(originalTotal.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    hasDiscount: discountInfo.discount > 0,
    discount: discountInfo.discount,
    discountPercent: Math.round((1 - (1 - discountInfo.discount)) * 10),
    actualPrice: parseFloat(actualPrice.toFixed(2))
  }
}

// VIP价格计算函数 - 用于当前选择的卡密类型
const calculateFinalPrice = (basePrice, quantity = 1, useCardTypePrice = false) => {
  let actualPrice = basePrice
  
  // 如果选择了卡密类型且启用类型价格，使用类型价格
  if (useCardTypePrice && selectedCardType.value) {
    console.log('计算最终价格 - 选择的卡密类型:', selectedCardType.value.name, '价格:', selectedCardType.value.price)
    // 优先从卡密记录中获取真实价格
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    const availableCards = allCards.filter(card => 
      card.status === 'unused' && 
      !card.purchasedBy && 
      card.zoneId === currentProduct.value?.zoneId && 
      card.productId === currentProduct.value?.id &&
      card.cardTypeId === selectedCardType.value.id
    )
    
    if (availableCards.length > 0) {
      // 优先使用 cardTypePrice 字段
      if (availableCards[0].cardTypePrice) {
        actualPrice = availableCards[0].cardTypePrice
        console.log('使用卡密记录中的价格(cardTypePrice):', actualPrice, '原商品价格:', basePrice)
      } else if (availableCards[0].value) {
        // 从 value 字段解析价格
        const valueStr = String(availableCards[0].value).replace('¥', '').replace('元', '')
        actualPrice = parseFloat(valueStr) || basePrice
        console.log('使用卡密记录中的价格(value):', actualPrice, '原商品价格:', basePrice)
      }
    } else if (selectedCardType.value.price) {
      actualPrice = selectedCardType.value.price
      console.log('使用卡密类型配置价格:', actualPrice, '原商品价格:', basePrice)
    }
  }
  
  const originalTotal = actualPrice * quantity
  const userLevel = user.value?.level || '普通'
  const discountInfo = vipStore.calculateDiscountPrice(actualPrice, userLevel)
  const finalTotal = discountInfo.finalPrice * quantity
  const totalSavings = discountInfo.savings * quantity
  
  return {
    originalTotal: parseFloat(originalTotal.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    hasDiscount: discountInfo.discount > 0,
    discount: discountInfo.discount,
    discountPercent: Math.round((1 - (1 - discountInfo.discount)) * 10), // 计算折扣 (如0.05 -> 9.5折)
    actualPrice: parseFloat(actualPrice.toFixed(2)) // 实际使用的单价
  }
}

// 方法
const switchZone = (zoneId) => {
  activeZone.value = zoneId
  currentPage.value = 1
}

// 图片加载错误处理
const handleIconError = (zone) => {
  console.warn(`专区 ${zone.name} 的自定义图标加载失败，恢复为emoji图标`)
  zone.customIcon = ''
  if (!zone.icon) {
    zone.icon = '🎯'
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const addToCart = (product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    if (existingItem.quantity + product.quantity <= product.stock) {
      existingItem.quantity += product.quantity
      ElMessage.success('商品已添加到购物车')
    } else {
      ElMessage.warning('库存不足')
    }
  } else {
    cartItems.value.push({
      ...product,
      quantity: product.quantity
    })
    ElMessage.success('商品已添加到购物车')
  }
  
  // 重置商品数量
  product.quantity = 1
}

const updateCartItem = (item) => {
  // 购物车商品数量更新逻辑已在 v-model 中处理
}

const removeFromCart = (productId) => {
  const index = cartItems.value.findIndex(item => item.id === productId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
    ElMessage.success('商品已从购物车移除')
  }
}

const buyNow = (product) => {
  currentProduct.value = product
  purchaseQuantity.value = product.quantity || 1
  selectedPaymentMethod.value = 'balance'
  selectedCardType.value = null // 重置卡密类型选择
  showPurchaseDialog.value = true
  
  // 如果商品有卡密类型，自动选择第一个有库存的类型
  if (product.cardTypes && product.cardTypes.length > 0) {
    const firstAvailableType = product.cardTypes.find(type => getCardTypeStock(type.id) > 0)
    if (firstAvailableType) {
      selectedCardType.value = firstAvailableType
      // 确保购买数量不超过库存
      const maxQty = getMaxQuantity()
      purchaseQuantity.value = Math.min(purchaseQuantity.value, maxQty)
    }
  }
}

const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车是空的')
    return
  }
  
  // 批量购买逻辑
  ElMessage.info('批量购买功能开发中...')
}

// 选择卡密类型
const selectCardType = (cardType) => {
  selectedCardType.value = cardType
  // 重新计算最大购买数量
  const maxQty = getMaxQuantity()
  if (purchaseQuantity.value > maxQty) {
    purchaseQuantity.value = Math.max(1, maxQty) // 确保购买数量至少为1
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
    const matchingCards = allCards.filter(card => 
      String(card.zoneId) === String(currentProduct.value?.zoneId) &&
      String(card.productId) === String(currentProduct.value?.id) &&
      String(card.cardTypeId) === String(cardTypeId) &&
      card.status === 'unused' &&
      !card.purchasedBy
    )
    
    console.log(`库存查询 - 卡密类型ID: ${cardTypeId}, 找到: ${matchingCards.length} 张`)
    console.log('库存查询条件:', {
      专区ID: currentProduct.value?.zoneId,
      商品ID: currentProduct.value?.id,
      卡密类型ID: cardTypeId,
      总卡密数: allCards.length
    })
    
    return matchingCards.length
  } catch (error) {
    console.error('库存查询出错:', error)
    return 0
  }
}

// 获取最大购买数量
const getMaxQuantity = () => {
  if (!currentProduct.value) return 1
  
  let maxStock = 0
  
  if (selectedCardType.value) {
    maxStock = getCardTypeStock(selectedCardType.value.id)
  } else {
    maxStock = currentProduct.value.stock || 0
  }
  
  // 确保最大值至少为1，避免 min > max 的错误
  return Math.max(1, Math.min(maxStock, 99))
}

const confirmPurchase = async () => {
  if (!currentProduct.value) return
  
  purchasing.value = true
  
  try {
    console.log('🛒 开始购买流程:', currentProduct.value.name, purchaseQuantity.value, '张')
    
    // 从卡密管理中获取可用卡密
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    let availableCards
    
    if (selectedCardType.value) {
      // 如果选择了卡密类型，只获取该类型的卡密
      availableCards = allCards.filter(card => 
        card.status === 'unused' && 
        !card.purchasedBy && 
        String(card.zoneId) === String(currentProduct.value.zoneId) && 
        String(card.productId) === String(currentProduct.value.id) &&
        String(card.cardTypeId) === String(selectedCardType.value.id)
      )
      console.log('🎯 按类型筛选卡密:', selectedCardType.value.name, availableCards.length, '张')
      console.log('筛选条件:', {
        卡密类型ID: selectedCardType.value.id,
        专区ID: currentProduct.value.zoneId,
        商品ID: currentProduct.value.id,
        查找的卡密总数: allCards.length
      })
    } else {
      // 兼容没有卡密类型的商品
      availableCards = allCards.filter(card => 
        card.status === 'unused' && 
        !card.purchasedBy && 
        String(card.zoneId) === String(currentProduct.value.zoneId) && 
        String(card.productId) === String(currentProduct.value.id)
      )
    }
    
    console.log('📦 找到可用卡密:', availableCards.length, '张')
    
    // 检查库存是否足够
    if (availableCards.length < purchaseQuantity.value) {
      ElMessage.error(`库存不足！当前只有 ${availableCards.length} 张可用卡密`)
      return
    }
    
    // 模拟购买处理
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 使用VIP折扣计算最终价格
    const priceInfo = calculateFinalPrice(currentProduct.value.price, purchaseQuantity.value, true)
    const totalCost = priceInfo.finalTotal
    const orderNumber = generateOrderNumber()
    const purchaseTime = new Date().toLocaleString('zh-CN')
    
    // 取出需要的卡密数量
    const purchasedCards = availableCards.slice(0, purchaseQuantity.value)
    console.log('💳 取出卡密:', purchasedCards.map(c => c.cardNumber))
    
    // 更新这些卡密的状态为已购买
    const cardIndices = []
    purchasedCards.forEach(purchasedCard => {
      const cardIndex = allCards.findIndex(card => card.id === purchasedCard.id)
      if (cardIndex !== -1) {
        allCards[cardIndex].status = 'sold'
        allCards[cardIndex].purchasedBy = userStore.user.id
        allCards[cardIndex].purchaser = userStore.user.username
        allCards[cardIndex].purchaseTime = purchaseTime
        cardIndices.push(cardIndex)
      }
    })
    
    // 保存更新后的卡密数据
    localStorage.setItem('all_cards', JSON.stringify(allCards))
    console.log('✅ 已更新', cardIndices.length, '张卡密状态为已购买')
    
    // 创建订单记录
    const order = {
      id: Date.now(),
      orderNumber,
      userId: userStore.user.id,
      username: userStore.user.username,
      productId: currentProduct.value.id,
      productName: currentProduct.value.name,
      zoneId: currentProduct.value.zoneId,
      zoneName: zones.value.find(z => z.id === currentProduct.value.zoneId)?.name || '',
      quantity: purchaseQuantity.value,
      unitPrice: priceInfo.actualPrice, // 使用实际单价（可能是卡密类型价格）
      originalAmount: priceInfo.originalTotal, // 原价总额
      totalAmount: totalCost, // 实际支付金额
      discount: priceInfo.discount, // 折扣率
      savings: priceInfo.totalSavings, // 节省金额
      userLevel: user.value?.level || '普通', // 用户等级
      paymentMethod: selectedPaymentMethod.value,
      status: 'completed',
      createTime: purchaseTime,
      completeTime: purchaseTime,
      cardKeys: purchasedCards.map(card => card.cardNumber), // 使用真实的卡号
      cardIds: purchasedCards.map(card => card.id), // 保存卡密ID用于后续操作
      cardTypeId: selectedCardType.value?.id || null, // 卡密类型ID
      cardTypeName: selectedCardType.value?.name || null, // 卡密类型名称
      cardTypePrice: selectedCardType.value?.price || null // 卡密类型价格
    }
    
    // 保存订单
    const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]')
    allOrders.unshift(order)
    localStorage.setItem('all_orders', JSON.stringify(allOrders))
    
    // 如果使用余额支付，扣除余额
    if (selectedPaymentMethod.value === 'balance') {
      const newBalance = (userStore.user.balance || 0) - totalCost
      await userStore.updateUserBalance(
        userStore.user.id,
        newBalance,
        `购买商品：${currentProduct.value.name}`
      )
      await userStore.refreshCurrentUser()
    }
    
    // 重新加载数据以更新库存显示
    loadData()
    
    // 显示购买成功消息，包含VIP优惠信息
    const successMessage = priceInfo.hasDiscount 
      ? `购买成功！${userVipInfo.value.name}优惠省了¥${priceInfo.totalSavings.toFixed(2)}，实付¥${totalCost.toFixed(2)}`
      : `购买成功！实付¥${totalCost.toFixed(2)}`
    
    ElMessage.success(successMessage)
    showPurchaseDialog.value = false
    
    // 显示真实的卡密信息
    showCardKeys(order.cardKeys)
    
    console.log('🎉 购买流程完成')
    
  } catch (error) {
    console.error('购买失败:', error)
    ElMessage.error('购买失败，请重试')
  } finally {
    purchasing.value = false
  }
}

const generateOrderNumber = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6)
  return `CD${year}${month}${day}${timestamp}`
}

// generateCardKeys 函数已删除，现在使用真实的卡密数据

const showCardKeys = (cardKeys) => {
  ElMessageBox.alert(
    `<div style="max-height: 300px; overflow-y: auto;">
      <p style="margin-bottom: 16px;"><strong>您的卡密信息：</strong></p>
      ${cardKeys.map(key => `<div style="margin: 8px 0; padding: 8px; background: #f5f7fa; border-radius: 4px; font-family: monospace;">${key}</div>`).join('')}
      <p style="margin-top: 16px; color: #E6A23C;"><strong>请妥善保管卡密，系统不会再次显示！</strong></p>
    </div>`,
    '卡密信息',
    {
      confirmButtonText: '我已保存',
      dangerouslyUseHTMLString: true
    }
  )
}

const handleImageError = (event) => {
  event.target.src = '/default-product.jpg'
}

// 商品详情相关方法
const showProductDetails = (product) => {
  currentDetailProduct.value = product
  currentDetailImage.value = product.image || '/default-product.jpg'
  detailQuantity.value = 1
  activeDetailTab.value = 'details'
  showProductDetailDialog.value = true
}

const closeProductDetail = () => {
  showProductDetailDialog.value = false
  currentDetailProduct.value = null
  currentDetailImage.value = ''
}

// 评价功能方法
const openReviewDialog = (product) => {
  currentReviewProduct.value = product
  newReview.rating = 5
  newReview.content = ''
  newReview.images = []
  showReviewDialog.value = true
}

const closeReviewDialog = () => {
  showReviewDialog.value = false
  currentReviewProduct.value = null
}

const submitReview = async () => {
  if (!newReview.content.trim()) {
    ElMessage.warning('请填写评价内容')
    return
  }

  try {
    // 模拟提交评价到后端
    const review = {
      id: Date.now(),
      productId: currentReviewProduct.value.id,
      userId: userStore.user.id,
      userName: userStore.user.name,
      avatar: userStore.user.avatar || '/default-avatar.jpg',
      rating: newReview.rating,
      content: newReview.content,
      images: newReview.images,
      date: new Date().toISOString(),
      likes: 0,
      isHelpful: false
    }

    // 将评价添加到产品的评价列表中
    if (!currentReviewProduct.value.reviews) {
      currentReviewProduct.value.reviews = []
    }
    currentReviewProduct.value.reviews.unshift(review)
    
    // 更新产品评分
    updateProductRating(currentReviewProduct.value)
    
    // 保存评论数据到localStorage
    saveReviewsData()

    ElMessage.success('评价提交成功')
    closeReviewDialog()
  } catch (error) {
    ElMessage.error('提交评价失败')
  }
}

const updateProductRating = (product) => {
  if (!product.reviews || product.reviews.length === 0) return
  
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
  product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1))
  product.reviewCount = product.reviews.length
}

// 保存评论数据到localStorage
const saveReviewsData = () => {
  try {
    console.log('=== 保存评论数据 ===')
    
    // 收集所有产品的评论数据
    const allReviewsData = {}
    
    // 从 products 数组中收集评论
    products.value.forEach(product => {
      if (product.reviews && product.reviews.length > 0) {
        allReviewsData[product.id] = {
          reviews: product.reviews,
          rating: product.rating,
          reviewCount: product.reviewCount
        }
      }
    })
    
    // 保存到localStorage
    localStorage.setItem('product_reviews', JSON.stringify(allReviewsData))
    console.log('评论数据保存成功，共', Object.keys(allReviewsData).length, '个产品有评论')
    
    // 调试日志
    Object.entries(allReviewsData).forEach(([productId, data]) => {
      console.log(`产品 ${productId}: ${data.reviewCount} 条评论，评分 ${data.rating}`)
    })
    
  } catch (error) {
    console.error('保存评论数据失败:', error)
    ElMessage.error('保存评论失败')
  }
}

// 从 localStorage 加载评论数据
const loadReviewsData = () => {
  try {
    console.log('=== 加载评论数据 ===')
    
    const savedReviews = localStorage.getItem('product_reviews')
    if (!savedReviews) {
      console.log('未找到已保存的评论数据')
      return
    }
    
    const reviewsData = JSON.parse(savedReviews)
    console.log('加载到', Object.keys(reviewsData).length, '个产品的评论数据')
    
    // 将评论数据分配给对应的产品
    products.value.forEach(product => {
      if (reviewsData[product.id]) {
        const reviewData = reviewsData[product.id]
        product.reviews = reviewData.reviews
        product.rating = reviewData.rating
        product.reviewCount = reviewData.reviewCount
        console.log(`恢复产品 ${product.id} (“${product.name}”) 的评论:`, product.reviewCount, '条')
      }
    })
    
    console.log('评论数据加载完成')
    
  } catch (error) {
    console.error('加载评论数据失败:', error)
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return diffMinutes <= 0 ? '刚刚' : `${diffMinutes}分钟前`
    }
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const getProductImages = (product) => {
  // 返回产品的所有图片，如果没有额外图片就返回主图片
  const images = [product.image || '/default-product.jpg']
  // 可以添加更多产品图片，这里模拟几张图片
  if (product.gallery && product.gallery.length > 0) {
    return [...images, ...product.gallery]
  }
  // 模拟多张图片
  return images.concat([
    '/default-product.jpg',
    '/default-product.jpg'
  ].slice(1)) // 避免重复显示相同图片
}

const addToCartFromDetail = () => {
  if (!currentDetailProduct.value) return
  
  // 设置商品数量
  currentDetailProduct.value.quantity = detailQuantity.value
  
  // 调用原有的加入购物车方法
  addToCart(currentDetailProduct.value)
  
  // 可选择关闭详情弹窗
  // closeProductDetail()
}

const buyNowFromDetail = () => {
  if (!currentDetailProduct.value) return
  
  // 设置商品数量
  currentDetailProduct.value.quantity = detailQuantity.value
  
  // 关闭详情弹窗
  closeProductDetail()
  
  // 调用原有的立即购买方法
  buyNow(currentDetailProduct.value)
}

const loadPaymentSettings = () => {
  try {
    const savedSettings = localStorage.getItem('payment_settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      availablePaymentMethods.value.alipay = settings.alipay?.enabled || false
      availablePaymentMethods.value.wechat = settings.wechat?.enabled || false
      availablePaymentMethods.value.bankTransfer = settings.other?.bankTransfer?.enabled || false
      availablePaymentMethods.value.paypal = settings.other?.paypal?.enabled || false
    }
  } catch (error) {
    console.error('加载支付设置失败:', error)
  }
}

const loadData = () => {
  try {
    // 加载专区数据
    const savedZones = localStorage.getItem('card_zones')
    if (savedZones) {
      const allZones = JSON.parse(savedZones)
      zones.value = allZones.filter(zone => zone.isActive)
      
      console.log('📱 购买页面加载专区数据:', zones.value.length, '个活跃专区')
      
      // 检查每个专区的图标数据
      zones.value.forEach((zone, index) => {
        console.log(`专区 ${index + 1}:`, {
          id: zone.id,
          name: zone.name,
          icon: zone.icon || '无',
          hasCustomIcon: !!zone.customIcon,
          customIconLength: zone.customIcon ? zone.customIcon.length : 0
        })
      })
    } else {
      // 如果没有专区数据，创建默认专区
      zones.value = [
        {
          id: 1,
          name: '默认专区',
          icon: '🎯',
          description: '默认商品专区',
          productCount: 0,
          isActive: true
        }
      ]
    }
    
    // 加载商品数据并从卡密管理中统计实际库存
    const savedProducts = localStorage.getItem('card_products')
    const allCards = JSON.parse(localStorage.getItem('all_cards') || '[]')
    
    console.log('📦 开始统计卡密库存，总卡密数量:', allCards.length)
    
    // 按专区+商品统计可用卡密数量
    const stockStats = {}
    
    allCards.forEach(card => {
      // 只统计未使用且未被购买的卡密作为可用库存
      if (card.status === 'unused' && !card.purchasedBy && card.zoneId && card.productId) {
        const key = `${card.zoneId}-${card.productId}`
        if (!stockStats[key]) {
          stockStats[key] = 0
        }
        stockStats[key]++
      }
    })
    
    console.log('📊 库存统计结果:', stockStats)
    
    if (savedProducts) {
      products.value = JSON.parse(savedProducts)
        .filter(product => product.isActive)
        .map(product => {
          // 从卡密管理中获取实际库存
          const stockKey = `${product.zoneId}-${product.id}`
          const actualStock = stockStats[stockKey] || 0
          
          console.log(`商品 ${product.name} (${stockKey}): 实际库存 ${actualStock}`)
          
          return {
            ...product,
            stock: actualStock, // 使用实际的卡密库存
            quantity: 1, // 添加默认购买数量
            rating: product.rating || 4.5 // 添加默认评分
          }
        })
      
      console.log('✅ 商品库存统计完成，共', products.value.length, '个商品')
      products.value.forEach(p => {
        console.log(`- ${p.name}: ${p.stock} 张可用卡密`)
      })
    } else {
      products.value = []
    }
    
    // 如果有专区但没有对应的活跃专区，设置第一个专区为活跃
    if (zones.value.length > 0) {
      activeZone.value = zones.value[0].id
    }
    
    console.log('💳 购买页面数据加载完成，专区数量:', zones.value.length)
    
    // 在所有数据加载完成后加载评论数据
    setTimeout(() => {
      loadReviewsData()
    }, 100)
    console.log('📦 已加载商品数据:', products.value)
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadPaymentSettings()
  
  // 加载专区和商品数据
  loading.value = true
  loadData()
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style lang="scss" scoped>
.card-purchase {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  position: relative;
  
  // 微妙的渐变纹理
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
      linear-gradient(45deg, rgba(6, 182, 212, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
    pointer-events: none;
  }
  
  // 企业级导航栏
  .enterprise-navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      align-items: center;
      height: 80px;
      gap: 32px;
      
      .nav-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        
        .brand-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 10px;
          color: white;
          
          svg {
            width: 20px;
            height: 20px;
          }
        }
        
        .brand-text {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.025em;
          
          .pro-suffix {
            color: #6366f1;
            font-size: 14px;
            font-weight: 600;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
      }
      
      .nav-search {
        flex: 1;
        max-width: 500px;
        
        .enterprise-search {
          :deep(.el-input__wrapper) {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
            
            &:hover {
              border-color: #c7d2fe;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            &.is-focus {
              border-color: #6366f1;
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
          }
          
          :deep(.el-input__inner) {
            color: #1e293b;
            font-size: 15px;
            
            &::placeholder {
              color: #64748b;
            }
          }
        }
      }
      
      .nav-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .user-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50px;
          
          .user-avatar {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            font-weight: 600;
            font-size: 14px;
          }
          
          .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
          }
        }
      }
    }
  }
  
  // 页面英雄区域
  .page-hero {
    position: relative;
    min-height: 320px;
    display: flex;
    align-items: center;
    overflow: hidden;
    
    .hero-background {
      position: absolute;
      inset: 0;
      
      .hero-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: 
          radial-gradient(circle at 25px 25px, #6366f1 2px, transparent 2px);
        background-size: 50px 50px;
      }
      
      .hero-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.1) 0%,
          rgba(139, 92, 246, 0.1) 50%,
          rgba(59, 130, 246, 0.1) 100%
        );
      }
    }
    
    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 80px 32px;
      position: relative;
      z-index: 2;
      
      .hero-text {
        max-width: 800px;
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #6366f1;
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          
          .badge-icon {
            font-size: 16px;
          }
        }
        
        .hero-title {
          font-size: 56px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          
          .title-gradient {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
        
        .hero-subtitle {
          font-size: 18px;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 48px;
          font-weight: 400;
        }
        
        .hero-stats {
          display: flex;
          gap: 48px;
          
          .stat-item {
            text-align: center;
            
            .stat-number {
              font-size: 32px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 8px;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .stat-label {
              font-size: 14px;
              color: #64748b;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
          }
        }
      }
    }
  }
  
  // 企业级筛选器
  .enterprise-filters {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(15, 23, 42, 0.08);
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    
    .filters-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .filters-left {
        display: flex;
        gap: 32px;
        align-items: center;
        
        .filter-section {
          h3 {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          :deep(.el-select) {
            width: 180px;
            
            .el-input__wrapper {
              border-radius: 10px;
              border: 1px solid #e5e7eb;
              transition: all 0.2s ease;
              
              &:hover {
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
              }
              
              &.is-focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
              }
            }
          }
        }
      }
      
      .filters-right {
        .results-summary {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .summary-badge {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.25);
            
            .count {
              font-size: 20px;
              font-weight: 700;
            }
            
            .label {
              font-size: 14px;
            }
          }
          
          .quality-badge {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            color: #059669;
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            
            .icon {
              font-weight: 800;
              color: #10b981;
            }
          }
        }
      }
    }
  }
  
  // 企业级分类导航
  .category-navigation {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(15, 23, 42, 0.08);
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 64px 32px;
      
      .category-header {
        text-align: center;
        margin-bottom: 48px;
        
        h2 {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.025em;
        }
        
        p {
          font-size: 18px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }
      }
      
      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 24px;
        
        .category-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 20px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          overflow: hidden;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-color: rgba(99, 102, 241, 0.2);
            
            &::before {
              transform: translateX(0);
            }
            
            .category-icon .icon-wrapper {
              transform: scale(1.1) rotate(5deg);
            }
          }
          
          &.active {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%);
            border-color: #6366f1;
            box-shadow: 
              0 10px 15px -3px rgba(99, 102, 241, 0.1),
              0 4px 6px -2px rgba(99, 102, 241, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            
            &::before {
              transform: translateX(0);
            }
            
            .category-info h3 {
              color: #6366f1;
            }
          }
          
          .category-icon {
            flex-shrink: 0;
            
            .icon-wrapper {
              width: 72px;
              height: 72px;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border: 1px solid rgba(15, 23, 42, 0.1);
              border-radius: 16px;
              
              // 自定义图标样式
              .custom-zone-icon {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 16px;
              }
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
          }
          
          .category-info {
            flex: 1;
            
            h3 {
              font-size: 20px;
              font-weight: 600;
              color: #1e293b;
              margin: 0 0 8px 0;
              letter-spacing: -0.01em;
              transition: color 0.3s ease;
            }
            
            .category-desc {
              color: #64748b;
              font-size: 14px;
              line-height: 1.5;
              margin: 0 0 12px 0;
            }
            
            .category-meta {
              display: flex;
              align-items: center;
              gap: 16px;
              font-size: 12px;
              
              .product-count {
                color: #6366f1;
                font-weight: 600;
                background: rgba(99, 102, 241, 0.1);
                padding: 4px 8px;
                border-radius: 6px;
              }
              
              .availability {
                color: #059669;
                font-weight: 500;
                position: relative;
                
                &::before {
                  content: '•';
                  color: #10b981;
                  margin-right: 4px;
                }
              }
            }
          }
          
          .category-arrow {
            color: #94a3b8;
            font-size: 18px;
            transition: all 0.3s ease;
            
            .category-card:hover & {
              color: #6366f1;
              transform: translateX(4px);
            }
          }
        }
      }
    }
  }
  
  .product-filters {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px 32px;
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .filter-label {
        color: #e2e8f0;
        font-weight: 500;
        font-size: 15px;
        white-space: nowrap;
        letter-spacing: 0.01em;
      }
      
      :deep(.el-select) {
        .el-input__wrapper {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 10px;
          min-width: 160px;
          transition: all 0.3s ease;
          
          &:hover {
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          }
          
          &.is-focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        }
        
        .el-input__inner {
          color: #f8fafc;
          font-size: 14px;
        }
        
        .el-select__caret {
          color: #64748b;
        }
      }
    }
    
    .filter-stats {
      margin-left: auto;
      
      .stats-text {
        color: #94a3b8;
        font-size: 15px;
        font-weight: 500;
        padding: 8px 16px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 8px;
        backdrop-filter: blur(12px);
      }
    }
  }
  
  // 产品展示区域
  .products-showcase {
    background: transparent;
    padding: 48px 0 80px;
    
    .showcase-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
      
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
        gap: 32px;
        
        .enterprise-product-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }
          
          &:hover {
            transform: translateY(-8px);
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(99, 102, 241, 0.1);
            border-color: rgba(99, 102, 241, 0.2);
            
            &::before {
              transform: scaleX(1);
            }
            
            .image-overlay {
              opacity: 1;
            }
          }
          
          &.out-of-stock {
            opacity: 0.6;
            
            &:hover {
              transform: none;
              box-shadow: none;
              
              .image-overlay {
                opacity: 0;
              }
            }
          }
          
          .card-image-section {
            position: relative;
            height: 240px;
            overflow: hidden;
            
            .image-container {
              position: relative;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.4s ease;
              }
              
              .image-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                
                .overlay-content {
                  text-align: center;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 8px;
                  
                  .el-button {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: none;
                    color: #6366f1;
                    font-size: 20px;
                    
                    &:hover {
                      background: white;
                      transform: scale(1.1);
                    }
                  }
                  
                  .overlay-text {
                    color: white;
                    font-size: 12px;
                    font-weight: 500;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                  }
                }
              }
            }
            
            .status-badges {
              position: absolute;
              top: 16px;
              right: 16px;
              display: flex;
              flex-direction: column;
              gap: 8px;
              z-index: 10;
              
              .status-badge {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(15, 23, 42, 0.1);
                border-radius: 50px;
                padding: 6px 12px;
                font-size: 11px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 4px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                
                &.hot {
                  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%);
                  color: white;
                  border-color: rgba(239, 68, 68, 0.3);
                }
                
                &.new {
                  background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%);
                  color: white;
                  border-color: rgba(99, 102, 241, 0.3);
                }
                
                &.sold-out {
                  background: linear-gradient(135deg, rgba(71, 85, 105, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
                  color: white;
                  border-color: rgba(71, 85, 105, 0.3);
                }
                
                &.limited {
                  background: linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%);
                  color: white;
                  border-color: rgba(245, 158, 11, 0.3);
                }
              }
            }
          }
          
          .card-content-section {
            padding: 32px;
            
            .content-header {
              margin-bottom: 20px;
              
              .product-title-area {
                margin-bottom: 12px;
                
                .product-title {
                  font-size: 20px;
                  font-weight: 600;
                  color: #0f172a;
                  margin: 0;
                  line-height: 1.3;
                  letter-spacing: -0.01em;
                }
                
                .title-underline {
                  height: 2px;
                  width: 40px;
                  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
                  border-radius: 1px;
                  margin-top: 8px;
                }
              }
              
              .product-rating {
                :deep(.el-rate) {
                  .el-rate__item {
                    margin-right: 2px;
                  }
                }
              }
            }
            
            .product-summary {
              color: #64748b;
              font-size: 14px;
              line-height: 1.6;
              margin: 0 0 24px 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            .product-specifications {
              margin-bottom: 32px;
              
              .spec-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                
                .spec-card {
                  background: #f8fafc;
                  border: 1px solid #e5e7eb;
                  border-radius: 12px;
                  padding: 12px;
                  text-align: center;
                  transition: all 0.2s ease;
                  
                  &:hover {
                    background: #f1f5f9;
                    border-color: #d1d5db;
                    transform: translateY(-1px);
                  }
                  
                  .spec-icon {
                    font-size: 20px;
                    margin-bottom: 6px;
                  }
                  
                  .spec-details {
                    .spec-label {
                      font-size: 10px;
                      color: #6b7280;
                      font-weight: 500;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      margin-bottom: 2px;
                    }
                    
                    .spec-value {
                      font-size: 12px;
                      color: #374151;
                      font-weight: 600;
                      
                      &.limited-stock {
                        color: #f59e0b;
                      }
                    }
                  }
                }
              }
            }
            
            .pricing-section {
              margin-bottom: 24px;
              
              .enterprise-pricing {
                .vip-pricing {
                  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
                  border: 1px solid rgba(16, 185, 129, 0.2);
                  border-radius: 16px;
                  padding: 20px;
                  
                  .pricing-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    
                    .pricing-label {
                      font-size: 12px;
                      color: #059669;
                      font-weight: 600;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                    }
                    
                    .discount-tag {
                      font-size: 11px;
                      padding: 4px 8px;
                    }
                  }
                  
                  .pricing-main {
                    .current-price {
                      font-size: 32px;
                      font-weight: 700;
                      color: #059669;
                      margin-bottom: 8px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    }
                    
                    .price-comparison {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      
                      .original-price {
                        font-size: 14px;
                        color: #6b7280;
                        text-decoration: line-through;
                      }
                      
                      .savings-badge {
                        background: rgba(220, 38, 38, 0.1);
                        border: 1px solid rgba(220, 38, 38, 0.2);
                        color: #dc2626;
                        padding: 4px 8px;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: 600;
                      }
                    }
                  }
                }
                
                .standard-pricing {
                  .pricing-main {
                    .current-price {
                      font-size: 32px;
                      font-weight: 700;
                      color: #6366f1;
                      margin-bottom: 8px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    }
                    
                    .upgrade-prompt {
                      .upgrade-link {
                        text-decoration: none;
                        color: #6366f1;
                        font-size: 12px;
                        font-weight: 500;
                        padding: 4px 8px;
                        background: rgba(99, 102, 241, 0.1);
                        border: 1px solid rgba(99, 102, 241, 0.2);
                        border-radius: 6px;
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        transition: all 0.2s ease;
                        
                        &:hover {
                          background: rgba(99, 102, 241, 0.2);
                          transform: translateY(-1px);
                        }
                        
                        .icon {
                          font-size: 10px;
                        }
                      }
                    }
                  }
                }
              }
            }
            
            .action-controls {
              display: flex;
              flex-direction: column;
              gap: 16px;
              
              .quantity-selector {
                display: flex;
                align-items: center;
                gap: 12px;
                
                .quantity-label {
                  font-size: 14px;
                  font-weight: 500;
                  color: #374151;
                  min-width: 50px;
                }
                
                .quantity-input {
                  flex: 1;
                  max-width: 120px;
                  
                  :deep(.el-input-number) {
                    width: 100%;
                    
                    .el-input__wrapper {
                      border-radius: 8px;
                    }
                  }
                }
              }
              
              .action-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 8px;
                
                .enterprise-btn {
                  border-radius: 12px;
                  font-weight: 600;
                  padding: 12px 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                  transition: all 0.3s ease;
                  
                  &.cart-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    border: none;
                    
                    &:hover {
                      background: linear-gradient(135deg, #5855eb 0%, #7c3aed 100%);
                      transform: translateY(-2px);
                      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
                    }
                  }
                  
                  &.detail-btn {
                    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                    border: none;
                    color: white;
                    
                    &:hover {
                      background: linear-gradient(135deg, #475569 0%, #334155 100%);
                      transform: translateY(-2px);
                      box-shadow: 0 8px 25px rgba(100, 116, 139, 0.25);
                    }
                  }
                  
                  &.buy-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border: none;
                    
                    &:hover {
                      background: linear-gradient(135deg, #059669 0%, #047857 100%);
                      transform: translateY(-2px);
                      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  // 商品详情弹窗样式
  .product-detail-dialog {
    :deep(.el-dialog) {
      border-radius: 20px;
      overflow: hidden;
      
      .el-dialog__header {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 20px 24px;
        margin: 0;
        
        .el-dialog__title {
          font-size: 20px;
          font-weight: 600;
        }
        
        .el-dialog__headerbtn {
          .el-dialog__close {
            color: white;
            font-size: 20px;
            
            &:hover {
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }
      }
      
      .el-dialog__body {
        padding: 0;
      }
      
      .el-dialog__footer {
        background: #f8fafc;
        border-top: 1px solid #e5e7eb;
        padding: 20px 24px;
        margin: 0;
      }
    }
    
    .product-detail-content {
      .detail-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        padding: 32px;
        background: white;
        
        .detail-images {
          .main-image {
            width: 100%;
            height: 400px;
            background: #f8fafc;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 16px;
            border: 1px solid #e5e7eb;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          
          .image-thumbnails {
            display: flex;
            gap: 8px;
            
            .thumbnail {
              width: 60px;
              height: 60px;
              border-radius: 8px;
              overflow: hidden;
              border: 2px solid transparent;
              cursor: pointer;
              transition: all 0.2s ease;
              
              &.active {
                border-color: #6366f1;
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
              }
              
              &:hover {
                border-color: #6366f1;
                transform: scale(1.05);
              }
              
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
        
        .detail-info {
          .product-title-section {
            margin-bottom: 16px;
            
            h1 {
              font-size: 28px;
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 12px 0;
              line-height: 1.2;
            }
            
            .product-badges {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            }
          }
          
          .rating-section {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
            
            .review-count {
              color: #6b7280;
              font-size: 14px;
            }
          }
          
          .price-section-detail {
            margin-bottom: 24px;
            padding: 20px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            
            .vip-price-detail,
            .standard-price-detail {
              .price-main {
                display: flex;
                align-items: baseline;
                gap: 12px;
                margin-bottom: 12px;
                
                .current-price {
                  font-size: 32px;
                  font-weight: 700;
                  color: #059669;
                }
                
                .original-price {
                  font-size: 16px;
                  color: #6b7280;
                  text-decoration: line-through;
                }
              }
              
              .vip-benefits {
                display: flex;
                align-items: center;
                gap: 12px;
                
                .savings {
                  color: #dc2626;
                  font-weight: 600;
                  font-size: 14px;
                }
              }
              
              .upgrade-hint {
                .vip-upgrade {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  text-decoration: none;
                  color: #6366f1;
                  font-size: 14px;
                  font-weight: 500;
                  padding: 8px 12px;
                  background: rgba(99, 102, 241, 0.1);
                  border: 1px solid rgba(99, 102, 241, 0.2);
                  border-radius: 8px;
                  transition: all 0.2s ease;
                  
                  &:hover {
                    background: rgba(99, 102, 241, 0.2);
                    transform: translateY(-1px);
                  }
                }
              }
            }
          }
          
          .stock-section {
            .stock-info {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              
              .stock-label {
                color: #6b7280;
                font-weight: 500;
              }
              
              .stock-value {
                color: #059669;
                font-weight: 600;
                
                &.low-stock {
                  color: #f59e0b;
                }
              }
            }
            
            .delivery-info {
              display: flex;
              align-items: center;
              gap: 8px;
              color: #6366f1;
              font-size: 14px;
              font-weight: 500;
            }
          }
        }
      }
      
      .detail-tabs {
        border-top: 1px solid #e5e7eb;
        
        :deep(.el-tabs) {
          .el-tabs__header {
            margin: 0;
            background: #f8fafc;
            
            .el-tabs__nav-wrap {
              padding: 0 32px;
              
              .el-tabs__nav {
                .el-tabs__item {
                  height: 50px;
                  line-height: 50px;
                  font-weight: 500;
                  color: #6b7280;
                  
                  &.is-active {
                    color: #6366f1;
                    font-weight: 600;
                  }
                }
              }
            }
            
            .el-tabs__active-bar {
              background-color: #6366f1;
              height: 3px;
            }
          }
          
          .el-tabs__content {
            padding: 32px;
            
            .el-tab-pane {
              .detail-section {
                margin-bottom: 32px;
                
                h3 {
                  font-size: 18px;
                  font-weight: 600;
                  color: #0f172a;
                  margin: 0 0 16px 0;
                  padding-bottom: 8px;
                  border-bottom: 2px solid #e5e7eb;
                }
                
                p {
                  color: #4b5563;
                  line-height: 1.6;
                  margin: 0;
                }
                
                .specs-table {
                  .spec-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #f3f4f6;
                    
                    &:last-child {
                      border-bottom: none;
                    }
                    
                    .spec-key {
                      color: #6b7280;
                      font-weight: 500;
                    }
                    
                    .spec-value {
                      color: #0f172a;
                      font-weight: 600;
                    }
                  }
                }
                
                .advantages-list {
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
                  
                  .advantage-item {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    
                    .el-icon {
                      color: #6366f1;
                      font-size: 24px;
                      flex-shrink: 0;
                      margin-top: 2px;
                    }
                    
                    h4 {
                      font-size: 16px;
                      font-weight: 600;
                      color: #0f172a;
                      margin: 0 0 6px 0;
                    }
                    
                    p {
                      margin: 0;
                      font-size: 14px;
                    }
                  }
                }
              }
              
              .reviews-summary {
                margin-bottom: 32px;
                padding: 24px;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
                
                .rating-overview {
                  display: flex;
                  gap: 40px;
                  align-items: center;
                  
                  .rating-score {
                    text-align: center;
                    
                    .score {
                      font-size: 48px;
                      font-weight: 700;
                      color: #f59e0b;
                      display: block;
                      margin-bottom: 8px;
                    }
                  }
                  
                  .rating-stats {
                    flex: 1;
                    
                    .stat-item {
                      display: flex;
                      align-items: center;
                      gap: 12px;
                      margin-bottom: 6px;
                      
                      .stars {
                        min-width: 32px;
                        font-size: 12px;
                        color: #6b7280;
                      }
                      
                      .progress-bar {
                        flex: 1;
                        height: 6px;
                        background: #e5e7eb;
                        border-radius: 3px;
                        overflow: hidden;
                        
                        .progress {
                          height: 100%;
                          background: #f59e0b;
                          transition: width 0.3s ease;
                        }
                      }
                      
                      .count {
                        min-width: 24px;
                        font-size: 12px;
                        color: #6b7280;
                        text-align: right;
                      }
                    }
                  }
                }
              }
              
              .reviews-list {
                .review-item {
                  padding: 20px 0;
                  border-bottom: 1px solid #f3f4f6;
                  
                  &:last-child {
                    border-bottom: none;
                  }
                  
                  .reviewer-info {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 12px;
                    
                    .reviewer-details {
                      flex: 1;
                      
                      h4 {
                        font-size: 14px;
                        font-weight: 600;
                        color: #0f172a;
                        margin: 0 0 4px 0;
                      }
                      
                      .review-meta {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        
                        .review-time {
                          color: #6b7280;
                          font-size: 12px;
                        }
                      }
                    }
                  }
                  
                  .review-content {
                    margin-left: 52px;
                    
                    p {
                      margin: 0 0 12px 0;
                      font-size: 14px;
                      line-height: 1.5;
                    }
                    
                    .review-tags {
                      display: flex;
                      gap: 6px;
                      flex-wrap: wrap;
                    }
                  }
                }
              }
              
              .purchase-notice {
                .notice-section {
                  margin-bottom: 24px;
                  
                  h3 {
                    font-size: 16px;
                    color: #0f172a;
                    margin-bottom: 12px;
                  }
                  
                  ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    
                    li {
                      padding: 8px 0;
                      color: #4b5563;
                      position: relative;
                      padding-left: 20px;
                      
                      &::before {
                        content: '•';
                        color: #6366f1;
                        font-weight: bold;
                        position: absolute;
                        left: 0;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    .detail-footer-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .quantity-section {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .quantity-label {
          font-weight: 500;
          color: #374151;
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 12px;
        
        .el-button {
          padding: 12px 24px;
          font-weight: 600;
          border-radius: 8px;
          
          &.el-button--success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            
            &:hover {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
            }
          }
          
          &.el-button--primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            
            &:hover {
              background: linear-gradient(135deg, #5855eb 0%, #7c3aed 100%);
            }
          }
        }
      }
    }
  }
  
  .old-products-grid {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px 64px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 32px;
    position: relative;
    z-index: 2;
    
    .product-card {
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
      backdrop-filter: blur(24px);
      border-radius: 24px;
      border: 1px solid rgba(59, 130, 246, 0.2);
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 
          0 32px 64px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(59, 130, 246, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border-color: rgba(59, 130, 246, 0.4);
        
        &::before {
          opacity: 1;
        }
        
        .product-image img {
          transform: scale(1.05);
        }
      }
      
      &.out-of-stock {
        opacity: 0.5;
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.6) 100%);
        
        &:hover {
          transform: none;
          box-shadow: none;
          border-color: rgba(59, 130, 246, 0.2);
          
          &::before {
            opacity: 0;
          }
          
          .product-image img {
            transform: none;
          }
        }
      }
      
      .product-image {
        position: relative;
        height: 240px;
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          position: relative;
          z-index: 1;
        }
        
        .product-badges {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 2;
          
          .badge {
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 600;
            text-align: center;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            
            &.hot {
              background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
              color: white;
              border-color: rgba(239, 68, 68, 0.3);
            }
            
            &.new {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
              color: white;
              border-color: rgba(59, 130, 246, 0.3);
            }
            
            &.sold-out {
              background: linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%);
              color: #e2e8f0;
              border-color: rgba(71, 85, 105, 0.3);
            }
            
            &.low-stock {
              background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
              color: white;
              border-color: rgba(245, 158, 11, 0.3);
            }
          }
        }
      }
      
      .product-content {
        padding: 32px;
        
        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          
          .product-name {
            font-size: 20px;
            font-weight: 600;
            color: #f8fafc;
            margin: 0;
            flex: 1;
            margin-right: 20px;
            line-height: 1.3;
            letter-spacing: -0.01em;
          }
        }
        
        .product-description {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 24px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: 0.01em;
        }
        
        .product-specs {
          margin-bottom: 24px;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(59, 130, 246, 0.1);
          
          .spec-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .spec-label {
              color: #64748b;
              font-weight: 500;
            }
            
            .spec-value {
              color: #e2e8f0;
              font-weight: 600;
              
              &.low-stock {
                color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
                padding: 2px 8px;
                border-radius: 6px;
                font-size: 12px;
              }
            }
          }
        }
        
        .product-footer {
          .price-section {
            margin-bottom: 16px;
            
            .vip-pricing {
              background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
              border: 1px solid rgba(34, 197, 94, 0.2);
              border-radius: 16px;
              padding: 16px;
              
              .price-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                
                .original-price-small {
                  font-size: 14px;
                  color: #64748b;
                  text-decoration: line-through;
                  font-weight: 500;
                }
              }
              
              .vip-price-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                .current-price {
                  font-size: 28px;
                  font-weight: 700;
                  color: #22c55e;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                  letter-spacing: -0.02em;
                }
                
                .savings {
                  font-size: 12px;
                  color: #dc2626;
                  font-weight: 600;
                  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
                  border: 1px solid rgba(220, 38, 38, 0.2);
                  padding: 4px 10px;
                  border-radius: 12px;
                  backdrop-filter: blur(8px);
                }
              }
            }
            
            .normal-pricing {
              .current-price {
                font-size: 28px;
                font-weight: 700;
                color: #22c55e;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                letter-spacing: -0.02em;
                margin-bottom: 8px;
                display: block;
              }
              
              .vip-upgrade-hint {
                .upgrade-link {
                  font-size: 13px;
                  color: #60a5fa;
                  text-decoration: none;
                  padding: 4px 8px;
                  background: rgba(59, 130, 246, 0.1);
                  border: 1px solid rgba(59, 130, 246, 0.2);
                  border-radius: 8px;
                  font-weight: 500;
                  transition: all 0.2s ease;
                  display: inline-block;
                  
                  &:hover {
                    background: rgba(59, 130, 246, 0.2);
                    border-color: rgba(59, 130, 246, 0.3);
                    transform: translateY(-1px);
                  }
                }
              }
            }
            
            .original-price {
              font-size: 16px;
              color: rgba(255, 255, 255, 0.6);
              text-decoration: line-through;
              margin-left: 8px;
            }
          }
          
          .purchase-actions {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
            
            .quantity-input {
              width: 80px;
            }
            
            .add-to-cart-btn,
            .buy-now-btn {
              flex: 1;
              min-width: 120px;
            }
          }
        }
      }
    }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 20px;
      color: rgba(255, 255, 255, 0.8);
      
      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }
      
      h3 {
        color: white;
        margin: 0 0 8px 0;
      }
      
      p {
        margin: 0;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  .pagination-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px 48px;
    text-align: center;
  }
  
  .cart-sidebar {
    position: fixed;
    right: -400px;
    top: 0;
    width: 400px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    z-index: 1000;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
    
    &.active {
      right: 0;
    }
    
    .cart-header {
      padding: 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 {
        margin: 0;
        color: #333;
      }
    }
    
    .cart-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      
      .cart-empty {
        text-align: center;
        padding: 60px 20px;
        color: #999;
        
        .empty-cart-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
      }
      
      .cart-items {
        .cart-item {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          
          .cart-item-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            background: #f5f5f5;
          }
          
          .cart-item-info {
            flex: 1;
            
            .cart-item-name {
              font-size: 14px;
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #333;
            }
            
            .cart-item-controls {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .cart-item-price {
                font-weight: 600;
                color: #00b894;
              }
            }
          }
        }
      }
    }
    
    .cart-footer {
      padding: 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      
      .cart-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        font-size: 18px;
        
        .total-label {
          font-weight: 500;
        }
        
        .total-amount {
          font-weight: 900;
          color: #00b894;
        }
      }
      
      .checkout-btn {
        width: 100%;
      }
    }
  }
  
  .cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  
  .floating-cart {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1001;
  }
  
  .purchase-confirmation {
    .product-summary {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      
      .summary-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        background: #e9ecef;
      }
      
      .summary-info {
        flex: 1;
        
        h4 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .vip-summary-pricing {
          .summary-original {
            margin: 4px 0;
            color: #999;
            font-size: 14px;
            text-decoration: line-through;
          }
          
          .summary-discount {
            margin: 4px 0;
            color: #666;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .summary-total.vip-total {
            font-weight: 700;
            color: #00b894;
            font-size: 18px;
            margin: 8px 0 4px 0;
          }
        }
        
        p {
          margin: 4px 0;
          color: #666;
          
          &.summary-total {
            font-weight: 700;
            color: #00b894;
            font-size: 16px;
          }
        }
        
        .vip-promotion {
          margin-top: 8px;
          padding: 8px;
          background: #e8f4fd;
          border-radius: 4px;
          text-align: center;
        }
        
        // 卡密类型选择样式
        .card-type-selection {
          margin: 20px 0;
          
          h4 {
            margin: 0 0 16px 0;
            color: #333;
            font-size: 14px;
          }
          
          .card-type-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
            
            .card-type-option {
              border: 2px solid #e4e7ed;
              border-radius: 8px;
              padding: 12px;
              cursor: pointer;
              transition: all 0.3s ease;
              background: #fff;
              
              &:hover {
                border-color: #409eff;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
              }
              
              &.active {
                border-color: #409eff;
                background: #ecf5ff;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
              }
              
              .card-type-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                
                .card-type-name {
                  font-weight: 500;
                  color: #303133;
                }
              }
              
              .card-type-desc {
                color: #909399;
                font-size: 12px;
                margin: 0 0 8px 0;
                line-height: 1.4;
              }
              
              .card-type-stock {
                .stock-label {
                  color: #67c23a;
                  font-size: 12px;
                  font-weight: 500;
                }
              }
            }
          }
          
          .no-stock-warning {
            margin-top: 12px;
          }
        }
        
        // 数量选择样式
        .quantity-selection {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
          
          label {
            font-size: 14px;
            color: #606266;
            font-weight: 500;
          }
          
          .quantity-hint {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
    
    .payment-method-selection {
      h4 {
        margin: 0 0 16px 0;
        color: #333;
      }
      
      .insufficient-balance {
        margin-top: 16px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .card-purchase {
    .enterprise-navbar {
      .nav-container {
        padding: 0 20px;
        
        .nav-search {
          max-width: 400px;
        }
      }
    }
    
    .hero-content {
      padding: 60px 20px;
      
      .hero-title {
        font-size: 48px;
      }
    }
    
    .category-navigation {
      .nav-container {
        padding: 48px 20px;
        
        .category-grid {
          grid-template-columns: 1fr;
        }
      }
    }
    
    .products-showcase {
      .showcase-container {
        padding: 0 20px;
        
        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .card-purchase {
    .enterprise-navbar {
      .nav-container {
        flex-direction: column;
        height: auto;
        padding: 16px;
        gap: 16px;
        
        .nav-search {
          width: 100%;
          max-width: none;
        }
        
        .nav-actions .user-badge {
          justify-content: center;
        }
      }
    }
    
    .page-hero {
      min-height: 240px;
      
      .hero-content {
        padding: 40px 16px;
        
        .hero-text {
          text-align: center;
          
          .hero-title {
            font-size: 36px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 24px;
            
            .stat-item {
              .stat-number {
                font-size: 24px;
              }
            }
          }
        }
      }
    }
    
    .category-navigation {
      .nav-container {
        padding: 32px 16px;
        
        .category-header {
          h2 {
            font-size: 28px;
          }
          
          p {
            font-size: 16px;
          }
        }
        
        .category-grid {
          .category-card {
            flex-direction: column;
            text-align: center;
            padding: 24px;
            
            .category-icon {
              margin-bottom: 16px;
            }
            
            .category-arrow {
              display: none;
            }
          }
        }
      }
    }
    
    .enterprise-filters {
      .filters-container {
        flex-direction: column;
        gap: 20px;
        padding: 20px 16px;
        
        .filters-left {
          flex-direction: column;
          gap: 16px;
          width: 100%;
          
          .filter-section {
            width: 100%;
            
            :deep(.el-select) {
              width: 100%;
            }
          }
        }
        
        .filters-right {
          .results-summary {
            flex-direction: column;
            gap: 12px;
            
            .summary-badge {
              justify-content: center;
            }
          }
        }
      }
    }
    
    .products-showcase {
      padding: 32px 0 60px;
      
      .showcase-container {
        padding: 0 16px;
        
        .products-grid {
          grid-template-columns: 1fr;
          gap: 24px;
          
          .enterprise-product-card {
            .card-content-section {
              padding: 24px;
              
              .product-specifications {
                .spec-grid {
                  grid-template-columns: 1fr;
                  
                  .spec-card {
                    display: flex;
                    align-items: center;
                    text-align: left;
                    gap: 12px;
                    padding: 16px;
                    
                    .spec-icon {
                      font-size: 24px;
                      margin-bottom: 0;
                    }
                    
                    .spec-details {
                      flex: 1;
                    }
                  }
                }
              }
              
              .action-controls {
                .quantity-selector {
                  justify-content: space-between;
                }
                
                .action-buttons {
                  grid-template-columns: 1fr;
                  gap: 8px;
                  
                  .enterprise-btn {
                    padding: 16px 24px;
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    .cart-sidebar {
      width: 100vw;
      right: -100vw;
    }
    
    .floating-cart {
      bottom: 20px;
      right: 20px;
    }
    
    // 详情弹窗响应式
    .product-detail-dialog {
      :deep(.el-dialog) {
        width: 95% !important;
        margin: 20px auto;
        max-height: 90vh;
        overflow-y: auto;
      }
      
      .detail-header {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
        padding: 20px !important;
        
        .detail-images {
          .main-image {
            height: 300px;
          }
        }
      }
      
      .detail-tabs {
        :deep(.el-tabs) {
          .el-tabs__header {
            .el-tabs__nav-wrap {
              padding: 0 16px;
            }
          }
          
          .el-tabs__content {
            padding: 20px 16px;
          }
        }
      }
      
      .detail-footer-actions {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
        
        .quantity-section {
          justify-content: center;
        }
        
        .action-buttons {
          .el-button {
            flex: 1;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .card-purchase {
    .hero-content {
      padding: 32px 12px;
      
      .hero-text {
        .hero-title {
          font-size: 28px;
        }
        
        .hero-subtitle {
          font-size: 14px;
        }
      }
    }
    
    .enterprise-filters {
      .filters-container {
        padding: 16px 12px;
      }
    }
    
    .products-showcase {
      .showcase-container {
        padding: 0 12px;
      }
    }
    
    .pagination-container {
      padding: 0 12px 32px;
      
      :deep(.el-pagination) {
        justify-content: center;
        
        .el-pagination__sizes {
          display: none;
        }
        
        .el-pagination__jump {
          display: none;
        }
      }
    }
    
    // 小屏幕详情弹窗优化
    .product-detail-dialog {
      :deep(.el-dialog) {
        width: 100% !important;
        margin: 0 !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
      }
      
      .detail-header {
        .detail-info {
          .product-title-section h1 {
            font-size: 22px;
          }
          
          .price-section-detail {
            padding: 16px;
            
            .vip-price-detail,
            .standard-price-detail {
              .price-main .current-price {
                font-size: 28px;
              }
            }
          }
        }
      }
      
      .detail-tabs {
        :deep(.el-tabs) {
          .el-tabs__content {
            padding: 16px 12px;
            
            .reviews-summary {
              padding: 16px;
              
              .rating-overview {
                flex-direction: column;
                gap: 20px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}

// 评价弹窗样式
.review-dialog {
  :deep(.el-dialog__body) {
    padding: 30px;
  }

  .review-form {
    .review-product-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;

      .review-product-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        border: 2px solid #e2e8f0;
      }

      .review-product-details {
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
        }

        .product-price {
          color: #dc2626;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }
      }
    }

    .review-rating {
      margin-bottom: 24px;
      
      label {
        display: block;
        margin-bottom: 12px;
        color: #374151;
        font-weight: 600;
        font-size: 16px;
      }

      :deep(.el-rate) {
        .el-rate__text {
          color: #6b7280;
          font-weight: 500;
        }
      }
    }

    .review-content {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 12px;
        color: #374151;
        font-weight: 600;
        font-size: 16px;
      }

      :deep(.el-textarea__inner) {
        border-radius: 8px;
        border: 1px solid #d1d5db;
        padding: 12px;
        font-size: 15px;
        line-height: 1.6;
        resize: vertical;
        min-height: 120px;

        &:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;

      .reviewer-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      }

      .reviewer-name {
        color: #374151;
        font-weight: 500;
        font-size: 15px;
      }
    }
  }

  :deep(.el-dialog__footer) {
    padding: 20px 30px 30px;
    text-align: right;

    .el-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border: none;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        
        &:hover {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }
      }
    }
  }
}

/* 评价按钮样式 */
.review-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3) !important;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
    transform: translateY(-1px) !important;
  }
}

/* 评价列表样式优化 */
.no-reviews {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  
  p {
    margin-bottom: 16px;
    font-size: 16px;
  }
}

.review-images {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  
  img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>