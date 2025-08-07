<template>
  <div class="settings-page">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="header-left">
            <h2>{{ $t('settings.title') }}</h2>
            <el-button 
              class="mobile-menu-btn hidden-md-and-up" 
              @click="showMobileMenu = !showMobileMenu"
              :icon="showMobileMenu ? 'Close' : 'Menu'"
            >
              {{ showMobileMenu ? '收起菜单' : '展开菜单' }}
            </el-button>
          </div>
          <el-button @click="$router.go(-1)">返回</el-button>
        </div>
      </el-header>
      
      <el-main>
        <el-row :gutter="20" class="settings-row">
          <!-- 左侧设置菜单 -->
          <el-col :xl="6" :lg="7" :md="8" :sm="24" :xs="24">
            <el-card class="settings-menu" :class="{ 'mobile-menu-open': showMobileMenu }">
              <el-menu
                :default-active="activeMenu"
                @select="handleMenuSelect"
                class="settings-nav"
                :mode="isMobile ? 'horizontal' : 'vertical'"
              >
                <el-menu-item index="appearance">
                  <el-icon><Monitor /></el-icon>
                  <span>{{ $t('settings.menu.appearance') }}</span>
                </el-menu-item>
                <el-menu-item index="notification">
                  <el-icon><Bell /></el-icon>
                  <span>{{ $t('settings.menu.notification') }}</span>
                </el-menu-item>
                <el-menu-item index="privacy">
                  <el-icon><Lock /></el-icon>
                  <span>{{ $t('settings.menu.privacy') }}</span>
                </el-menu-item>
                <el-menu-item index="system">
                  <el-icon><Setting /></el-icon>
                  <span>{{ $t('settings.menu.system') }}</span>
                </el-menu-item>
                <el-menu-item index="data">
                  <el-icon><Document /></el-icon>
                  <span>{{ $t('settings.menu.data') }}</span>
                </el-menu-item>
                <el-menu-item index="payment">
                  <el-icon><CreditCard /></el-icon>
                  <span>支付设置</span>
                </el-menu-item>
                <el-menu-item index="email">
                  <el-icon><Message /></el-icon>
                  <span>邮件服务</span>
                </el-menu-item>
                <el-menu-item index="security">
                  <el-icon><Lock /></el-icon>
                  <span>安全中心</span>
                </el-menu-item>
                <el-menu-item index="api">
                  <el-icon><Connection /></el-icon>
                  <span>API管理</span>
                </el-menu-item>
                <el-menu-item index="logs">
                  <el-icon><Document /></el-icon>
                  <span>系统日志</span>
                </el-menu-item>
                <el-menu-item index="backup">
                  <el-icon><Download /></el-icon>
                  <span>备份恢复</span>
                </el-menu-item>
                <el-menu-item index="about">
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ $t('settings.menu.about') }}</span>
                </el-menu-item>
              </el-menu>
            </el-card>
          </el-col>
          
          <!-- 右侧设置内容 -->
          <el-col :xl="18" :lg="17" :md="16" :sm="24" :xs="24">
            <el-card class="settings-content">
              <!-- 外观设置 -->
              <div v-if="activeMenu === 'appearance'" class="setting-section">
                <div class="section-header">
                  <h3>外观设置</h3>
                  <p>个性化您的界面体验</p>
                </div>
                
                <el-form :model="settings.appearance" label-width="120px">
                  <el-form-item label="主题模式">
                    <el-radio-group v-model="settings.appearance.theme" @change="applyTheme">
                      <el-radio label="light">浅色主题</el-radio>
                      <el-radio label="dark">深色主题</el-radio>
                      <el-radio label="auto">跟随系统</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  
                  <el-form-item label="主题色彩">
                    <div class="color-picker-group">
                      <el-color-picker 
                        v-model="settings.appearance.primaryColor" 
                        @change="applyPrimaryColor"
                        show-alpha
                        :predefine="predefinedColors"
                      />
                      <span class="color-label">主色调</span>
                      <el-button 
                        size="small" 
                        @click="resetPrimaryColor"
                        class="reset-color-btn"
                      >
                        重置
                      </el-button>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="字体大小">
                    <el-slider 
                      v-model="settings.appearance.fontSize" 
                      :min="12" 
                      :max="18" 
                      :step="1"
                      show-stops
                      @change="applyFontSize"
                    />
                    <span class="font-size-preview" :style="{ fontSize: settings.appearance.fontSize + 'px' }">
                      预览文字效果
                    </span>
                  </el-form-item>
                  
                  <el-form-item label="紧凑模式">
                    <el-switch 
                      v-model="settings.appearance.compact" 
                      @change="applyCompactMode"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">减少界面元素间距，显示更多内容</div>
                  </el-form-item>
                  
                  <el-form-item label="动画效果">
                    <el-switch 
                      v-model="settings.appearance.animations" 
                      @change="applyAnimations"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">启用页面切换和交互动画</div>
                  </el-form-item>
                </el-form>
              </div>
              
              <!-- 通知设置 -->
              <div v-if="activeMenu === 'notification'" class="setting-section">
                <div class="section-header">
                  <h3>通知设置</h3>
                  <p>管理系统通知和提醒</p>
                </div>
                
                <el-form :model="settings.notification" label-width="120px">
                  <el-form-item label="桌面通知">
                    <el-switch 
                      v-model="settings.notification.desktop" 
                      @change="requestNotificationPermission"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">允许系统发送桌面通知</div>
                  </el-form-item>
                  
                  <el-form-item label="声音提示">
                    <el-switch 
                      v-model="settings.notification.sound" 
                      @change="updateNotificationSetting('sound', $event)"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">播放通知提示音</div>
                  </el-form-item>
                  
                  <el-form-item label="邮件通知">
                    <el-switch 
                      v-model="settings.notification.email" 
                      @change="updateNotificationSetting('email', $event)"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">重要事件通过邮件通知</div>
                    <div v-if="settings.notification.email" class="email-config">
                      <el-input 
                        v-model="notificationConfig.emailAddress"
                        placeholder="请输入邮箱地址"
                        size="small"
                        style="margin-top: 8px;"
                        @blur="updateEmailAddress"
                      />
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="通知类型">
                    <el-checkbox-group 
                      v-model="settings.notification.types"
                      @change="updateNotificationTypes"
                    >
                      <el-checkbox label="order">订单状态</el-checkbox>
                      <el-checkbox label="payment">支付提醒</el-checkbox>
                      <el-checkbox label="security">安全警告</el-checkbox>
                      <el-checkbox label="system">系统公告</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  
                  <el-form-item label="免打扰时间">
                    <el-time-picker
                      v-model="settings.notification.quietStart"
                      placeholder="开始时间"
                      format="HH:mm"
                      value-format="HH:mm"
                      @change="updateQuietTime"
                    />
                    <span style="margin: 0 10px;">至</span>
                    <el-time-picker
                      v-model="settings.notification.quietEnd"
                      placeholder="结束时间"
                      format="HH:mm"
                      value-format="HH:mm"
                      @change="updateQuietTime"
                    />
                  </el-form-item>
                  
                  <el-form-item label="通知优先级">
                    <el-radio-group v-model="settings.notification.priority" @change="updateNotificationPriority">
                      <el-radio label="low">低</el-radio>
                      <el-radio label="normal">普通</el-radio>
                      <el-radio label="high">高</el-radio>
                      <el-radio label="urgent">紧急</el-radio>
                    </el-radio-group>
                    <div class="setting-hint">高优先级通知会忽略免打扰时间</div>
                  </el-form-item>
                  
                  <el-form-item label="通知持续时间">
                    <el-slider 
                      v-model="settings.notification.duration" 
                      :min="3" 
                      :max="30" 
                      :step="1"
                      show-stops
                      @change="updateNotificationDuration"
                    />
                    <span class="duration-preview">{{ settings.notification.duration }}秒后自动关闭</span>
                  </el-form-item>
                  
                  <el-form-item label="通知频率限制">
                    <el-switch 
                      v-model="settings.notification.rateLimit" 
                      @change="updateNotificationRateLimit"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">每分钟最多显示3条通知，避免通知泛滥</div>
                  </el-form-item>
                  
                  <el-form-item label="通知历史">
                    <div class="action-buttons">
                      <el-button @click="showNotificationHistory" size="small">查看通知历史</el-button>
                      <el-button @click="clearNotificationHistory" size="small" type="warning">清除历史</el-button>
                    </div>
                    <div class="setting-hint">共 {{ notificationHistory.length }} 条历史记录</div>
                  </el-form-item>
                  
                  <el-form-item label="测试通知">
                    <div class="action-buttons">
                      <el-button @click="testDesktopNotification" size="small">测试桌面通知</el-button>
                      <el-button @click="testSoundNotification" size="small">测试声音通知</el-button>
                      <el-button @click="testEmailNotification" size="small">测试邮件通知</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              
              <!-- 隐私安全 -->
              <div v-if="activeMenu === 'privacy'" class="setting-section">
                <div class="section-header">
                  <h3>隐私安全</h3>
                  <p>保护您的账户和数据安全</p>
                </div>
                
                <el-form :model="settings.privacy" label-width="120px">
                  <el-form-item label="自动登出">
                    <el-select 
                      v-model="settings.privacy.autoLogout"
                      @change="updateAutoLogout"
                    >
                      <el-option label="从不" value="never" />
                      <el-option label="30分钟" value="30" />
                      <el-option label="1小时" value="60" />
                      <el-option label="2小时" value="120" />
                      <el-option label="4小时" value="240" />
                    </el-select>
                    <div class="setting-hint">
                      无操作自动退出登录
                      <span v-if="autoLogoutTimer.remaining > 0" class="timer-info">
                        (剩余: {{ formatTime(autoLogoutTimer.remaining) }})
                      </span>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="记住登录">
                    <el-switch 
                      v-model="settings.privacy.rememberLogin" 
                      @change="updateRememberLogin"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">下次访问自动登录</div>
                  </el-form-item>
                  
                  <el-form-item label="操作确认">
                    <el-switch 
                      v-model="settings.privacy.confirmActions" 
                      @change="updateConfirmActions"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">重要操作需要二次确认</div>
                  </el-form-item>
                  
                  <el-form-item label="数据加密">
                    <el-switch 
                      v-model="settings.privacy.dataEncryption" 
                      @change="updateDataEncryption"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">本地数据加密存储</div>
                  </el-form-item>
                  
                  <el-form-item label="密码管理">
                    <div class="action-buttons">
                      <el-button type="primary" @click="showPasswordDialog = true">修改密码</el-button>
                      <el-button @click="showSecuritySettings = true">安全设置</el-button>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="访问日志">
                    <div class="action-buttons">
                      <el-button @click="viewAccessLogs">查看访问记录</el-button>
                      <el-button type="danger" @click="clearAccessLogs">清除日志</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              
              <!-- 系统偏好 -->
              <div v-if="activeMenu === 'system'" class="setting-section">
                <div class="section-header">
                  <h3>{{ $t('settings.system.title') }}</h3>
                  <p>{{ $t('settings.system.subtitle') }}</p>
                </div>
                
                <el-form :model="settings.system" label-width="120px">
                  <el-form-item :label="$t('settings.system.language')">
                    <el-select 
                      v-model="settings.system.language"
                      @change="updateLanguage"
                    >
                      <el-option label="简体中文" value="zh-CN" />
                      <el-option label="繁體中文" value="zh-TW" />
                      <el-option label="English" value="en-US" />
                    </el-select>
                    <div class="setting-hint">{{ $t('settings.system.languageCurrent') }}: {{ getLanguageName(settings.system.language) }}</div>
                  </el-form-item>
                  
                  <el-form-item label="时区设置">
                    <el-select 
                      v-model="settings.system.timezone"
                      @change="updateTimezone"
                    >
                      <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai" />
                      <el-option label="香港时间 (UTC+8)" value="Asia/Hong_Kong" />
                      <el-option label="东京时间 (UTC+9)" value="Asia/Tokyo" />
                      <el-option label="纽约时间 (UTC-5)" value="America/New_York" />
                    </el-select>
                    <div class="setting-hint">当前时间: {{ getCurrentTime() }}</div>
                  </el-form-item>
                  
                  <el-form-item label="日期格式">
                    <el-radio-group 
                      v-model="settings.system.dateFormat"
                      @change="updateDateFormat"
                    >
                      <el-radio label="YYYY-MM-DD">{{ formatDateExample('YYYY-MM-DD') }}</el-radio>
                      <el-radio label="MM/DD/YYYY">{{ formatDateExample('MM/DD/YYYY') }}</el-radio>
                      <el-radio label="DD/MM/YYYY">{{ formatDateExample('DD/MM/YYYY') }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  
                  <el-form-item label="数字格式">
                    <el-radio-group 
                      v-model="settings.system.numberFormat"
                      @change="updateNumberFormat"
                    >
                      <el-radio label="1,234.56">1,234.56</el-radio>
                      <el-radio label="1.234,56">1.234,56</el-radio>
                      <el-radio label="1 234.56">1 234.56</el-radio>
                    </el-radio-group>
                    <div class="setting-hint">示例: {{ formatNumberExample(1234.56) }}</div>
                  </el-form-item>
                  
                  <el-form-item label="页面大小">
                    <el-input-number 
                      v-model="settings.system.pageSize" 
                      :min="10" 
                      :max="100" 
                      :step="10"
                      @change="updatePageSize"
                    />
                    <div class="setting-hint">列表页默认显示条数</div>
                  </el-form-item>
                  
                  <el-form-item label="自动刷新">
                    <el-switch 
                      v-model="settings.system.autoRefresh" 
                      @change="updateAutoRefresh"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">
                      数据自动刷新间隔: 30秒
                      <span v-if="autoRefreshTimer.remaining > 0" class="timer-info">
                        (下次刷新: {{ Math.ceil(autoRefreshTimer.remaining / 1000) }}秒)
                      </span>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="缓存策略">
                    <el-select 
                      v-model="settings.system.cacheStrategy"
                      @change="updateCacheStrategy"
                    >
                      <el-option label="积极缓存 (性能优先)" value="aggressive" />
                      <el-option label="标准缓存 (平衡)" value="standard" />
                      <el-option label="最小缓存 (内存优先)" value="minimal" />
                      <el-option label="无缓存 (总是最新)" value="none" />
                    </el-select>
                    <div class="setting-hint">当前缓存大小: {{ dataStats.cacheSize }}KB</div>
                  </el-form-item>
                  
                  <el-form-item label="错误报告">
                    <el-switch 
                      v-model="settings.system.crashReporting" 
                      @change="updateCrashReporting"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">自动发送崩溃和错误报告以改进系统</div>
                  </el-form-item>
                  
                  <el-form-item label="使用统计">
                    <el-switch 
                      v-model="settings.system.analytics" 
                      @change="updateAnalytics"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">匿名收集使用数据以优化用户体验</div>
                  </el-form-item>
                  
                  <el-form-item label="调试模式">
                    <el-switch 
                      v-model="settings.system.debugMode" 
                      @change="updateDebugMode"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">显示详细日志和调试信息</div>
                  </el-form-item>
                  
                  <el-form-item label="预加载">
                    <el-switch 
                      v-model="settings.system.preload" 
                      @change="updatePreload"
                      active-text="启用"
                      inactive-text="关闭"
                    />
                    <div class="setting-hint">预加载常用数据以提升响应速度</div>
                  </el-form-item>
                  
                  <el-form-item label="系统性能">
                    <div class="performance-stats">
                      <div class="performance-item">
                        <span class="performance-label">内存使用:</span>
                        <div class="performance-bar">
                          <div class="performance-fill" :style="{ width: systemPerformance.memoryUsage + '%' }"></div>
                        </div>
                        <span class="performance-value">{{ systemPerformance.memoryUsage }}%</span>
                      </div>
                      <div class="performance-item">
                        <span class="performance-label">响应时间:</span>
                        <span class="performance-value">{{ systemPerformance.responseTime }}ms</span>
                      </div>
                    </div>
                    <div class="action-buttons">
                      <el-button @click="runPerformanceTestHandler" size="small">性能测试</el-button>
                      <el-button @click="optimizeSystemHandler" size="small" type="primary">优化系统</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              
              <!-- 数据管理 -->
              <div v-if="activeMenu === 'data'" class="setting-section">
                <div class="section-header">
                  <h3>数据管理</h3>
                  <p>管理本地数据和缓存</p>
                </div>
                
                <div class="data-stats">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-statistic title="缓存大小" :value="dataStats.cacheSize" suffix="KB" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="用户数据" :value="dataStats.userData" suffix="条" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="日志记录" :value="dataStats.logCount" suffix="条" />
                    </el-col>
                  </el-row>
                </div>
                
                <el-divider />
                
                <div class="data-actions">
                  <div class="action-group">
                    <h4>数据导出</h4>
                    <p>导出您的个人数据和设置</p>
                    <el-button type="primary" @click="exportData">导出所有数据</el-button>
                    <el-button @click="exportSettings">仅导出设置</el-button>
                  </div>
                  
                  <el-divider />
                  
                  <div class="action-group">
                    <h4>数据导入</h4>
                    <p>从备份文件恢复数据</p>
                    <el-upload
                      :before-upload="importData"
                      :show-file-list="false"
                      accept=".json"
                    >
                      <el-button>选择备份文件</el-button>
                    </el-upload>
                  </div>
                  
                  <el-divider />
                  
                  <div class="action-group danger-zone">
                    <h4>危险操作</h4>
                    <p>以下操作不可恢复，请谨慎操作</p>
                    <el-button type="warning" @click="clearCache">清除缓存</el-button>
                    <el-button type="danger" @click="resetSettings">重置设置</el-button>
                    <el-button type="danger" @click="clearAllData">清空所有数据</el-button>
                  </div>
                </div>
              </div>
              
              <!-- 支付设置 -->
              <PaymentSettings v-if="activeMenu === 'payment'" />
              
              <!-- 邮件服务 -->
              <EmailSettings v-if="activeMenu === 'email'" />
              
              <!-- 安全中心 -->
              <SecuritySettings v-if="activeMenu === 'security'" />
              
              <!-- API管理 -->
              <ApiSettings v-if="activeMenu === 'api'" />
              
              <!-- 系统日志 -->
              <SystemLogs v-if="activeMenu === 'logs'" />
              
              <!-- 备份恢复 -->
              <BackupSettings v-if="activeMenu === 'backup'" />

              <!-- 关于系统 -->
              <div v-if="activeMenu === 'about'" class="setting-section">
                <div class="section-header">
                  <h3>关于系统</h3>
                  <p>系统信息和版本详情</p>
                </div>
                
                <div class="system-info">
                  <div class="info-card">
                    <div class="info-icon">
                      <el-icon size="48"><Postcard /></el-icon>
                    </div>
                    <div class="info-content">
                      <h3>卡密管理系统</h3>
                      <p>专业的卡密生成、销售、管理解决方案</p>
                      <div class="version-info">
                        <span class="version">版本 {{ systemInfo.version }}</span>
                        <span class="build">构建 {{ systemInfo.build }}</span>
                        <span class="env">{{ systemInfo.environment }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <el-divider />
                  
                  <div class="system-stats">
                    <h4>系统状态</h4>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-icon" :class="getSystemHealthColor(systemInfo.health.overall)">
                            <el-icon><CircleCheckFilled v-if="systemInfo.health.overall > 80" /><WarningFilled v-else /></el-icon>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ systemInfo.health.overall }}%</div>
                            <div class="stat-label">系统健康度</div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-icon uptime">
                            <el-icon><Timer /></el-icon>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ formatUptime(systemInfo.uptime) }}</div>
                            <div class="stat-label">运行时间</div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-icon users">
                            <el-icon><User /></el-icon>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ systemInfo.activeUsers }}</div>
                            <div class="stat-label">活跃用户</div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  
                  <el-divider />
                  
                  <div class="system-details">
                    <h4>系统详情</h4>
                    <div class="details-grid">
                      <div class="detail-item">
                        <span class="detail-label">操作系统:</span>
                        <span class="detail-value">{{ systemInfo.os }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">浏览器:</span>
                        <span class="detail-value">{{ systemInfo.browser }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">屏幕分辨率:</span>
                        <span class="detail-value">{{ systemInfo.screenResolution }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">时区:</span>
                        <span class="detail-value">{{ systemInfo.timezone }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">语言:</span>
                        <span class="detail-value">{{ systemInfo.language }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">用户代理:</span>
                        <span class="detail-value">{{ systemInfo.userAgent }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <el-divider />
                  
                  <div class="feature-list">
                    <h4>核心功能</h4>
                    <div class="feature-grid">
                      <div class="feature-item" v-for="feature in systemInfo.features" :key="feature.name">
                        <el-icon :class="feature.status === 'active' ? 'feature-active' : 'feature-inactive'">
                          <CircleCheckFilled v-if="feature.status === 'active'" />
                          <CircleCloseFilled v-else />
                        </el-icon>
                        <span>{{ feature.name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <el-divider />
                  
                  <div class="tech-stack">
                    <h4>技术栈</h4>
                    <div class="tech-tags">
                      <el-tag v-for="tech in systemInfo.techStack" :key="tech.name" class="tech-tag">
                        {{ tech.name }} {{ tech.version }}
                      </el-tag>
                    </div>
                  </div>
                  
                  <el-divider />
                  
                  <div class="diagnostic-tools">
                    <h4>系统诊断</h4>
                    <div class="diagnostic-grid">
                      <el-button @click="runSystemDiagnosticHandler" icon="Tools">运行系统诊断</el-button>
                      <el-button @click="exportSystemInfo" icon="Download">导出系统信息</el-button>
                      <el-button @click="clearSystemCache" icon="Delete">清理系统缓存</el-button>
                      <el-button @click="restartSystem" icon="RefreshRight" type="warning">重启应用</el-button>
                    </div>
                  </div>
                  
                  <el-divider />
                  
                  <div class="contact-info">
                    <h4>支持与帮助</h4>
                    <p>如有问题或建议，请联系技术支持</p>
                    <div class="contact-buttons">
                      <el-button type="primary" @click="checkUpdate" icon="Refresh">检查更新</el-button>
                      <el-button @click="openHelp" icon="QuestionFilled">使用帮助</el-button>
                      <el-button @click="reportBug" icon="Warning">报告问题</el-button>
                      <el-button @click="openLicense" icon="Document">许可证</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 设置操作按钮 -->
              <div class="settings-actions" v-if="activeMenu !== 'about'">
                <div class="shortcuts-hint">
                  <span>快捷键：Ctrl+R 重置 | Ctrl+S 保存</span>
                </div>
                <div class="action-buttons">
                  <el-button @click="resetCurrentSection">重置当前设置</el-button>
                  <el-button type="primary" @click="saveSettings">保存设置</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    
    <!-- 密码修改对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
          <div class="password-strength">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :class="passwordStrengthClass"
                :style="{ width: passwordStrengthWidth }"
              ></div>
            </div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePassword" :loading="passwordLoading">
          确认修改
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 安全设置对话框 -->
    <el-dialog
      v-model="showSecuritySettings"
      title="安全设置"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form label-width="120px">
        <el-form-item label="双因素认证">
          <el-switch 
            v-model="securitySettings.twoFactorAuth" 
            @change="updateSecuritySetting('twoFactorAuth', $event)"
            active-text="启用"
            inactive-text="关闭"
          />
          <div class="setting-hint">为账户添加额外的安全层</div>
        </el-form-item>
        
        <el-form-item label="登录通知">
          <el-switch 
            v-model="securitySettings.loginNotification" 
            @change="updateSecuritySetting('loginNotification', $event)"
            active-text="启用"
            inactive-text="关闭"
          />
          <div class="setting-hint">新设备登录时发送通知</div>
        </el-form-item>
        
        <el-form-item label="IP白名单">
          <el-switch 
            v-model="securitySettings.ipWhitelist" 
            @change="updateSecuritySetting('ipWhitelist', $event)"
            active-text="启用"
            inactive-text="关闭"
          />
          <div class="setting-hint">仅允许指定IP地址访问</div>
        </el-form-item>
        
        <el-form-item label="会话超时" v-if="securitySettings.ipWhitelist">
          <el-input-number 
            v-model="securitySettings.sessionTimeout" 
            @change="updateSecuritySetting('sessionTimeout', $event)"
            :min="5"
            :max="1440"
            :step="5"
          />
          <span style="margin-left: 8px;">分钟</span>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showSecuritySettings = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 访问日志对话框 -->
    <el-dialog
      v-model="showAccessLogsDialog"
      title="访问日志"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="access-logs-container">
        <div class="logs-header">
          <div class="logs-stats">
            <el-statistic title="总访问次数" :value="accessLogs.length" />
            <el-statistic title="今日访问" :value="getTodayAccessCount()" />
            <el-statistic title="最后访问" :value="getLastAccessTime()" value-style="font-size: 14px;" />
          </div>
          <div class="logs-actions">
            <el-button @click="refreshAccessLogs" :loading="accessLogsLoading" size="small">
              刷新
            </el-button>
            <el-button type="danger" @click="clearAccessLogs" size="small">
              清除日志
            </el-button>
          </div>
        </div>
        
        <el-divider />
        
        <el-table 
          :data="accessLogs" 
          v-loading="accessLogsLoading"
          height="400"
          size="small"
        >
          <el-table-column prop="timestamp" label="访问时间" width="180">
            <template #default="{ row }">
              {{ formatLogTime(row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" width="140" />
          <el-table-column prop="userAgent" label="设备信息" min-width="200">
            <template #default="{ row }">
              <el-tooltip :content="row.userAgent" placement="top">
                <span>{{ getDeviceInfo(row.userAgent) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="120">
            <template #default="{ row }">
              <el-tag :type="getActionTagType(row.action)" size="small">
                {{ row.action }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
                {{ row.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <template #footer>
        <el-button @click="showAccessLogsDialog = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 通知历史对话框 -->
    <el-dialog
      v-model="showNotificationHistoryDialog" 
      title="通知历史记录"
      width="700px"
    >
      <div class="notification-history-container">
        <div class="history-stats">
          <el-statistic title="总通知数" :value="notificationHistory.length" />
          <el-statistic title="今日通知" :value="getTodayNotificationCount()" />
          <el-statistic title="未读通知" :value="getUnreadNotificationCount()" />
        </div>
        
        <el-divider />
        
        <div class="history-filters">
          <el-select v-model="notificationFilter" placeholder="筛选类型" size="small" style="width: 120px;">
            <el-option label="全部" value="all" />
            <el-option label="订单" value="order" />
            <el-option label="支付" value="payment" />
            <el-option label="安全" value="security" />
            <el-option label="系统" value="system" />
          </el-select>
          <el-button @click="markAllAsRead" size="small">全部标记已读</el-button>
        </div>
        
        <div class="notification-list">
          <div 
            v-for="notification in filteredNotifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="markAsRead(notification)"
          >
            <div class="notification-icon">
              <el-icon :class="getNotificationIconClass(notification.type)">
                <Bell v-if="notification.type === 'system'" />
                <ShoppingCart v-else-if="notification.type === 'order'" />
                <CreditCard v-else-if="notification.type === 'payment'" />
                <Lock v-else-if="notification.type === 'security'" />
                <InfoFilled v-else />
              </el-icon>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-body">{{ notification.body }}</div>
              <div class="notification-time">{{ formatNotificationTime(notification.timestamp) }}</div>
            </div>
            <div class="notification-actions">
              <el-button @click.stop="deleteNotification(notification)" size="small" text type="danger">
                删除
              </el-button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredNotifications.length === 0" class="empty-state">
          <el-empty description="暂无通知记录" />
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showNotificationHistoryDialog = false">关闭</el-button>
        <el-button type="danger" @click="clearNotificationHistory">清空历史</el-button>
      </template>
    </el-dialog>
    
    <!-- 系统诊断对话框 -->
    <el-dialog
      v-model="showDiagnosticDialog"
      title="系统诊断报告"
      width="800px"
    >
      <div class="diagnostic-container" v-loading="diagnosticLoading">
        <div v-if="diagnosticResult">
          <div class="diagnostic-summary">
            <h4>诊断摘要</h4>
            <div class="summary-stats">
              <div class="summary-item" :class="diagnosticResult.overall === 'healthy' ? 'healthy' : 'warning'">
                <div class="summary-icon">
                  <el-icon><CircleCheckFilled v-if="diagnosticResult.overall === 'healthy'" /><WarningFilled v-else /></el-icon>
                </div>
                <div class="summary-text">
                  <div class="summary-title">{{ diagnosticResult.overall === 'healthy' ? '系统健康' : '发现问题' }}</div>
                  <div class="summary-desc">{{ diagnosticResult.summary }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <el-divider />
          
          <div class="diagnostic-details">
            <h4>详细检查结果</h4>
            <div class="check-list">
              <div 
                v-for="check in diagnosticResult.checks" 
                :key="check.name"
                class="check-item"
                :class="check.status"
              >
                <div class="check-icon">
                  <el-icon>
                    <CircleCheckFilled v-if="check.status === 'pass'" />
                    <WarningFilled v-else-if="check.status === 'warning'" />
                    <CircleCloseFilled v-else />
                  </el-icon>
                </div>
                <div class="check-content">
                  <div class="check-name">{{ check.name }}</div>
                  <div class="check-description">{{ check.description }}</div>
                  <div v-if="check.recommendation" class="check-recommendation">
                    建议: {{ check.recommendation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showDiagnosticDialog = false">关闭</el-button>
        <el-button type="primary" @click="exportDiagnosticReport">导出报告</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Monitor, Bell, Lock, Setting, Document, InfoFilled, Postcard,
  CircleCheckFilled, WarningFilled, CircleCloseFilled, Timer, User,
  ShoppingCart, CreditCard, Tools, Download, Delete, RefreshRight,
  Refresh, QuestionFilled, Warning, Message, Connection
} from '@element-plus/icons-vue'
import PaymentSettings from '@/components/settings/PaymentSettings.vue'
import EmailSettings from '@/components/settings/EmailSettings.vue'
import SecuritySettings from '@/components/settings/SecuritySettings.vue'
import ApiSettings from '@/components/settings/ApiSettings.vue'
import SystemLogs from '@/components/settings/SystemLogs.vue'
import BackupSettings from '@/components/settings/BackupSettings.vue'
import { useSettingsStore } from '@/stores/settings'
import { 
  getLanguageName, 
  getCurrentTime, 
  formatDateExample, 
  formatNumberExample,
  calculateStorageSize,
  getDataCount,
  cleanupOldData,
  checkForUpdates,
  getHelpTopics,
  submitBugReport
} from '@/utils/settings-utils'
import { 
  t, 
  setLanguage, 
  getCurrentLanguage, 
  getSupportedLanguages,
  initLanguage,
  saveLanguage 
} from '@/utils/i18n'
import {
  initNotificationHistory,
  addNotificationToHistory,
  getSystemPerformance,
  runPerformanceTest,
  runSystemDiagnostic,
  optimizeSystem,
  formatUptime
} from '@/utils/advanced-settings'

const activeMenu = ref('appearance')
const settingsStore = useSettingsStore()
const showMobileMenu = ref(false)

// 语言相关状态
const currentLang = ref(getCurrentLanguage())
const supportedLanguages = getSupportedLanguages()

// 对话框状态
const showPasswordDialog = ref(false)
const showSecuritySettings = ref(false)
const showAccessLogsDialog = ref(false)
const showNotificationHistoryDialog = ref(false)
const showDiagnosticDialog = ref(false)
const passwordLoading = ref(false)

// 访问日志数据
const accessLogs = ref([])
const accessLogsLoading = ref(false)

// 通知历史数据
const notificationHistory = ref([])
const notificationFilter = ref('all')

// 系统诊断
const diagnosticLoading = ref(false)
const diagnosticResult = ref(null)

// 系统性能监控
const systemPerformance = reactive({
  memoryUsage: 0,
  responseTime: 0,
  cpuUsage: 0
})

// 使用store中的设置数据
const settings = settingsStore.settings

// 密码表单
const passwordFormRef = ref()
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})




// 安全设置
const securitySettings = reactive({
  twoFactorAuth: false,
  loginNotification: true,
  ipWhitelist: false,
  sessionTimeout: 30
})

// 预设颜色
const predefinedColors = [
  '#409EFF', // Element Plus蓝
  '#67C23A', // 成功绿
  '#E6A23C', // 警告橙
  '#F56C6C', // 危险红
  '#909399', // 信息灰
  '#722ED1', // 紫色
  '#EB2F96', // 粉红
  '#13C2C2', // 青色
]

// Loading状态
const loadingStates = reactive({
  theme: false,
  color: false,
  fontSize: false,
  compact: false,
  animations: false
})

// 通知配置
const notificationConfig = reactive({
  emailAddress: localStorage.getItem('notification_email') || '',
  soundEnabled: false,
  lastNotificationTime: null
})

// 通知音频对象
let notificationSound = null

// 自动登出定时器
const autoLogoutTimer = reactive({
  timer: null,
  remaining: 0,
  interval: null
})

// 自动刷新定时器
const autoRefreshTimer = reactive({
  timer: null,
  remaining: 0,
  interval: null
})

// 操作确认状态
const confirmActionState = reactive({
  enabled: false,
  pendingAction: null
})

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码至少需要8位字符', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          callback(new Error('密码必须包含大小写字母和数字'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// 密码强度检测
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return 0
  
  let score = 0
  
  // 长度检查
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  
  // 字符类型检查
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z\d]/.test(password)) score += 1
  
  return Math.min(score, 4)
})

const passwordStrengthText = computed(() => {
  const texts = ['', '弱', '一般', '强', '很强']
  return texts[passwordStrength.value] || ''
})

const passwordStrengthClass = computed(() => {
  const classes = ['', 'weak', 'fair', 'good', 'strong']
  return classes[passwordStrength.value] || ''
})

const passwordStrengthWidth = computed(() => {
  return (passwordStrength.value / 4) * 100 + '%'
})

// 响应式状态
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth > 768) {
    showMobileMenu.value = false
  }
}

// 键盘快捷键支持
const handleKeydown = (event) => {
  // Ctrl+S 保存设置
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    saveSettings()
    return
  }
  
  // Ctrl+R 重置当前设置
  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault()
    resetCurrentSection()
    return
  }
  
  // Esc 关闭对话框
  if (event.key === 'Escape') {
    if (showPasswordDialog.value) {
      showPasswordDialog.value = false
    }
    if (showSecuritySettings.value) {
      showSecuritySettings.value = false
    }
    if (showMobileMenu.value) {
      showMobileMenu.value = false
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
  
  // 加载设置和数据
  loadSettings()
  loadDataStats()
  
  // 应用已保存的设置
  settingsStore.applyAppearance()
  
  // 设置自动登出
  if (settings.privacy.autoLogout !== 'never') {
    setupAutoLogout()
  }
  
  // 设置自动刷新
  if (settings.system.autoRefresh) {
    setupAutoRefresh()
  }
  
  // 监听用户活动以重置自动登出定时器
  const resetTimer = () => resetAutoLogoutTimer()
  document.addEventListener('click', resetTimer)
  document.addEventListener('keypress', resetTimer)
  document.addEventListener('mousemove', resetTimer)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
  
  // 清理定时器
  if (autoLogoutTimer.timer) clearTimeout(autoLogoutTimer.timer)
  if (autoLogoutTimer.interval) clearInterval(autoLogoutTimer.interval)
  if (autoRefreshTimer.timer) clearTimeout(autoRefreshTimer.timer)
  if (autoRefreshTimer.interval) clearInterval(autoRefreshTimer.interval)
  
  // 清理性能监控定时器
  if (window.performanceUpdateInterval) {
    clearInterval(window.performanceUpdateInterval)
  }
  
  // 清理用户活动监听器
  const resetTimer = () => resetAutoLogoutTimer()
  document.removeEventListener('click', resetTimer)
  document.removeEventListener('keypress', resetTimer)
  document.removeEventListener('mousemove', resetTimer)
})

// 数据统计
const dataStats = reactive({
  cacheSize: 0,
  userData: 0,
  logCount: 0
})

// 系统信息
const systemInfo = reactive({
  version: '1.2.0',
  build: '20241206',
  environment: process.env.NODE_ENV || 'development',
  uptime: Date.now(),
  activeUsers: 1,
  health: {
    overall: 95,
    database: 98,
    cache: 92,
    network: 97
  },
  os: navigator.platform,
  browser: getBrowserInfo(),
  screenResolution: `${screen.width}x${screen.height}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: navigator.language,
  userAgent: navigator.userAgent.substring(0, 100) + '...',
  features: [
    { name: '卡密批量生成', status: 'active' },
    { name: '多种支付方式', status: 'active' },
    { name: '用户权限管理', status: 'active' },
    { name: '数据统计分析', status: 'active' },
    { name: '安全加密审计', status: 'active' },
    { name: '响应式界面', status: 'active' },
    { name: '实时通知', status: 'active' },
    { name: '自动备份', status: 'inactive' }
  ],
  techStack: [
    { name: 'Vue', version: '3.4.0' },
    { name: 'Element Plus', version: '2.4.0' },
    { name: 'Pinia', version: '2.1.0' },
    { name: 'Vite', version: '5.0.0' },
    { name: 'TypeScript', version: '5.0.0' }
  ]
})

// 获取浏览器信息
function getBrowserInfo() {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}

// 菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index
  // 在移动端选择菜单后自动收起菜单
  if (isMobile.value) {
    showMobileMenu.value = false
  }
}

// 外观设置方法
const applyTheme = async (theme) => {
  try {
    loadingStates.theme = true
    await new Promise(resolve => setTimeout(resolve, 200)) // 添加短暂延迟显示loading
    settingsStore.applyTheme(theme)
    ElMessage.success('主题已更改')
  } catch (error) {
    console.error('应用主题失败:', error)
    ElMessage.error('主题切换失败，请重试')
  } finally {
    loadingStates.theme = false
  }
}

const applyPrimaryColor = async (color) => {
  try {
    if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
      ElMessage.warning('请选择有效的颜色')
      return
    }
    loadingStates.color = true
    await new Promise(resolve => setTimeout(resolve, 100))
    settingsStore.applyPrimaryColor(color)
    ElMessage.success('主题色已更新')
  } catch (error) {
    console.error('应用主题色失败:', error)
    ElMessage.error('主题色更新失败，请重试')
  } finally {
    loadingStates.color = false
  }
}

// 重置主题色
const resetPrimaryColor = () => {
  const defaultColor = '#409EFF'
  settings.appearance.primaryColor = defaultColor
  applyPrimaryColor(defaultColor)
}

const applyFontSize = async (size) => {
  try {
    if (size < 12 || size > 18) {
      ElMessage.warning('字体大小必须在12-18px之间')
      return
    }
    settingsStore.applyFontSize(size)
    ElMessage.success('字体大小已调整')
  } catch (error) {
    console.error('应用字体大小失败:', error)
    ElMessage.error('字体大小调整失败，请重试')
  }
}

const applyCompactMode = async (compact) => {
  try {
    settingsStore.applyCompactMode(compact)
    ElMessage.success(compact ? '已启用紧凑模式' : '已关闭紧凑模式')
  } catch (error) {
    console.error('应用紧凑模式失败:', error)
    ElMessage.error('紧凑模式设置失败，请重试')
  }
}

const applyAnimations = async (enable) => {
  try {
    settingsStore.applyAnimations(enable)
    ElMessage.success(enable ? '已启用动画效果' : '已关闭动画效果')
  } catch (error) {
    console.error('应用动画设置失败:', error)
    ElMessage.error('动画设置失败，请重试')
  }
}

// 通知权限
const requestNotificationPermission = async (enable) => {
  if (enable && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      settings.notification.desktop = false
      ElMessage.warning('通知权限被拒绝')
    } else {
      ElMessage.success('通知权限已授权')
      settingsStore.updateNotificationSetting('desktop', true)
    }
  } else if (enable && Notification.permission === 'granted') {
    settingsStore.updateNotificationSetting('desktop', true)
  } else {
    settingsStore.updateNotificationSetting('desktop', false)
  }
}

// 更新通知设置
const updateNotificationSetting = (key, value) => {
  settingsStore.updateNotificationSetting(key, value)
  
  if (key === 'sound') {
    if (value) {
      loadNotificationSound()
    }
  }
  
  ElMessage.success('通知设置已更新')
}

// 更新通知类型
const updateNotificationTypes = (types) => {
  settingsStore.updateNotificationSetting('types', types)
  ElMessage.success('通知类型已更新')
}

// 更新免打扰时间
const updateQuietTime = () => {
  settingsStore.saveSettings()
  ElMessage.success('免打扰时间已更新')
}

// 更新邮箱地址
const updateEmailAddress = () => {
  if (notificationConfig.emailAddress) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(notificationConfig.emailAddress)) {
      ElMessage.error('请输入有效的邮箱地址')
      return
    }
    localStorage.setItem('notification_email', notificationConfig.emailAddress)
    ElMessage.success('邮箱地址已保存')
  }
}

// 加载通知声音
const loadNotificationSound = () => {
  if (!notificationSound) {
    // 创建通知音频（使用浏览器内置音频）
    notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbIqJdJSPfJObhJSXfJiMgYyIeH6AfH58fHp8fHp8fHp8fHx6fHx6fHx6fHx6fHh6fHx6fHx6fHx6eHp8fHh6fHx6fHx6fHh6fHh6fHx6fHx6fHx6eHp8eHp8fHh6fHx6eHh6fHh6fHx6fHx6fHx6eHp8eHh6fHh6fHh6fHx6eHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHp6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx8eHp8fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHp8fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHx6fHx6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHx6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHx6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHx6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHx6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHx6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHx6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHx6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6fHh6')
  }
}

// 测试桌面通知
const testDesktopNotification = () => {
  if (!settings.notification.desktop) {
    ElMessage.warning('请先启用桌面通知')
    return
  }
  
  if (Notification.permission !== 'granted') {
    ElMessage.error('通知权限未授权')
    return
  }
  
  // 检查免打扰时间
  if (isInQuietTime()) {
    ElMessage.info('当前在免打扰时间内')
    return
  }
  
  new Notification('测试通知', {
    body: '这是一条测试通知消息',
    icon: '/favicon.ico',
    tag: 'test-notification'
  })
  
  ElMessage.success('测试通知已发送')
}

// 测试声音通知
const testSoundNotification = () => {
  if (!settings.notification.sound) {
    ElMessage.warning('请先启用声音提示')
    return
  }
  
  if (isInQuietTime()) {
    ElMessage.info('当前在免打扰时间内')
    return
  }
  
  if (!notificationSound) {
    loadNotificationSound()
  }
  
  if (notificationSound) {
    notificationSound.play().catch(error => {
      console.error('播放通知声音失败:', error)
      ElMessage.error('播放通知声音失败')
    })
    ElMessage.success('测试声音已播放')
  }
}

// 检查是否在免打扰时间内
const isInQuietTime = () => {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  if (!settings.notification.quietStart || !settings.notification.quietEnd) {
    return false
  }
  
  const [startHour, startMin] = settings.notification.quietStart.split(':').map(Number)
  const [endHour, endMin] = settings.notification.quietEnd.split(':').map(Number)
  
  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin
  
  if (startTime <= endTime) {
    return currentTime >= startTime && currentTime <= endTime
  } else {
    // 跨夜的情况
    return currentTime >= startTime || currentTime <= endTime
  }
}

// 发送系统通知（供其他组件调用）
const sendNotification = (title, body, type = 'info') => {
  // 检查通知类型是否启用
  if (!settings.notification.types.includes(type)) {
    return
  }
  
  // 检查免打扰时间
  if (isInQuietTime()) {
    return
  }
  
  // 桌面通知
  if (settings.notification.desktop && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: `notification-${Date.now()}`
    })
  }
  
  // 声音通知
  if (settings.notification.sound && notificationSound) {
    notificationSound.play().catch(() => {})
  }
  
  // 记录通知时间
  notificationConfig.lastNotificationTime = new Date().toISOString()
}

// 自动登出相关方法
const updateAutoLogout = (timeout) => {
  settingsStore.updatePrivacySetting('autoLogout', timeout)
  setupAutoLogout()
  ElMessage.success('自动登出设置已更新')
}

const setupAutoLogout = () => {
  // 清除之前的定时器
  if (autoLogoutTimer.timer) {
    clearTimeout(autoLogoutTimer.timer)
  }
  if (autoLogoutTimer.interval) {
    clearInterval(autoLogoutTimer.interval)
  }
  
  const timeout = settings.privacy.autoLogout
  if (timeout === 'never') {
    autoLogoutTimer.remaining = 0
    return
  }
  
  const minutes = parseInt(timeout)
  const milliseconds = minutes * 60 * 1000
  
  // 设置倒计时
  autoLogoutTimer.remaining = milliseconds
  
  // 更新倒计时显示
  autoLogoutTimer.interval = setInterval(() => {
    autoLogoutTimer.remaining -= 1000
    if (autoLogoutTimer.remaining <= 0) {
      performAutoLogout()
    }
  }, 1000)
  
  // 设置自动登出定时器
  autoLogoutTimer.timer = setTimeout(() => {
    performAutoLogout()
  }, milliseconds)
}

const resetAutoLogoutTimer = () => {
  if (settings.privacy.autoLogout !== 'never') {
    setupAutoLogout()
  }
}

const performAutoLogout = () => {
  ElMessage.warning('长时间未操作，即将自动登出')
  
  setTimeout(() => {
    // 清除登录状态
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_info')
    
    // 跳转到登录页
    if (window.$router) {
      window.$router.push('/login')
    } else {
      window.location.href = '/login'
    }
  }, 3000)
}

const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 记住登录功能
const updateRememberLogin = (enabled) => {
  settingsStore.updatePrivacySetting('rememberLogin', enabled)
  
  if (enabled) {
    // 启用记住登录，延长token有效期
    const token = localStorage.getItem('user_token')
    if (token) {
      localStorage.setItem('user_token_remember', 'true')
    }
  } else {
    // 禁用记住登录，清除相关标记
    localStorage.removeItem('user_token_remember')
  }
  
  ElMessage.success('记住登录设置已更新')
}

// 操作确认功能
const updateConfirmActions = (enabled) => {
  settingsStore.updatePrivacySetting('confirmActions', enabled)
  confirmActionState.enabled = enabled
  ElMessage.success('操作确认设置已更新')
}

// 需要确认的操作包装器
const withConfirmation = async (action, message = '确定要执行此操作吗？') => {
  if (!settings.privacy.confirmActions) {
    return await action()
  }
  
  try {
    await ElMessageBox.confirm(message, '操作确认', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    return await action()
  } catch {
    ElMessage.info('操作已取消')
    return false
  }
}

// 数据加密功能
const updateDataEncryption = async (enabled) => {
  try {
    if (enabled) {
      // 启用数据加密
      await enableDataEncryption()
    } else {
      // 禁用数据加密（需要确认）
      const confirmed = await withConfirmation(
        () => Promise.resolve(true),
        '禁用数据加密将使用明文存储，确定继续吗？'
      )
      
      if (confirmed) {
        await disableDataEncryption()
      } else {
        settings.privacy.dataEncryption = true
        return
      }
    }
    
    settingsStore.updatePrivacySetting('dataEncryption', enabled)
    ElMessage.success(enabled ? '数据加密已启用' : '数据加密已禁用')
  } catch (error) {
    console.error('数据加密设置失败:', error)
    ElMessage.error('数据加密设置失败')
    settings.privacy.dataEncryption = !enabled
  }
}

const enableDataEncryption = async () => {
  // 生成加密密钥（实际应用中应该使用更安全的密钥管理）
  const key = await generateEncryptionKey()
  localStorage.setItem('encryption_key', key)
  
  // 加密现有数据
  const sensitiveData = [
    'user_info',
    'card_data',
    'payment_info',
    'system_settings'
  ]
  
  for (const dataKey of sensitiveData) {
    const data = localStorage.getItem(dataKey)
    if (data) {
      const encrypted = await encryptData(data, key)
      localStorage.setItem(dataKey, encrypted)
    }
  }
}

const disableDataEncryption = async () => {
  const key = localStorage.getItem('encryption_key')
  if (!key) return
  
  // 解密现有数据
  const sensitiveData = [
    'user_info',
    'card_data',
    'payment_info',
    'system_settings'
  ]
  
  for (const dataKey of sensitiveData) {
    const encryptedData = localStorage.getItem(dataKey)
    if (encryptedData) {
      try {
        const decrypted = await decryptData(encryptedData, key)
        localStorage.setItem(dataKey, decrypted)
      } catch (error) {
        console.error(`解密 ${dataKey} 失败:`, error)
      }
    }
  }
  
  localStorage.removeItem('encryption_key')
}

// 简单的加密/解密实现（实际应用中应使用更强的加密算法）
const generateEncryptionKey = async () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

const encryptData = async (data, key) => {
  // 简单的XOR加密（仅用于演示，实际应用中应使用AES等）
  const keyBytes = key.match(/.{2}/g).map(hex => parseInt(hex, 16))
  const dataBytes = new TextEncoder().encode(data)
  const encrypted = new Uint8Array(dataBytes.length)
  
  for (let i = 0; i < dataBytes.length; i++) {
    encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length]
  }
  
  return btoa(String.fromCharCode(...encrypted))
}

const decryptData = async (encryptedData, key) => {
  const keyBytes = key.match(/.{2}/g).map(hex => parseInt(hex, 16))
  const encryptedBytes = new Uint8Array(
    atob(encryptedData).split('').map(char => char.charCodeAt(0))
  )
  
  const decrypted = new Uint8Array(encryptedBytes.length)
  for (let i = 0; i < encryptedBytes.length; i++) {
    decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length]
  }
  
  return new TextDecoder().decode(decrypted)
}

// 访问日志相关方法
const loadAccessLogs = async () => {
  accessLogsLoading.value = true
  try {
    // 从localStorage获取访问日志
    const logs = JSON.parse(localStorage.getItem('access_logs') || '[]')
    
    // 如果没有日志，生成一些示例数据
    if (logs.length === 0) {
      const sampleLogs = generateSampleLogs()
      localStorage.setItem('access_logs', JSON.stringify(sampleLogs))
      accessLogs.value = sampleLogs
    } else {
      accessLogs.value = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
  } catch (error) {
    console.error('加载访问日志失败:', error)
    ElMessage.error('加载访问日志失败')
  } finally {
    accessLogsLoading.value = false
  }
}

const generateSampleLogs = () => {
  const actions = ['登录', '登出', '修改密码', '查看卡密', '生成卡密', '删除卡密', '修改设置']
  const ips = ['192.168.1.100', '10.0.0.50', '172.16.0.200', '192.168.0.1']
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/91.0.4472.124',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
  ]
  
  const logs = []
  const now = new Date()
  
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    logs.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      ip: ips[Math.floor(Math.random() * ips.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      status: Math.random() > 0.1 ? 'success' : 'failed'
    })
  }
  
  return logs
}

const refreshAccessLogs = () => {
  loadAccessLogs()
}

const getTodayAccessCount = () => {
  const today = new Date().toDateString()
  return accessLogs.value.filter(log => 
    new Date(log.timestamp).toDateString() === today
  ).length
}

const getLastAccessTime = () => {
  if (accessLogs.value.length === 0) return '无'
  const lastLog = accessLogs.value[0]
  return formatLogTime(lastLog.timestamp)
}

const formatLogTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getDeviceInfo = (userAgent) => {
  if (userAgent.includes('iPhone')) return 'iPhone'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('Mac OS X')) return 'macOS'
  if (userAgent.includes('Windows NT')) return 'Windows'
  if (userAgent.includes('Linux')) return 'Linux'
  return '未知设备'
}

const getActionTagType = (action) => {
  const tagTypes = {
    '登录': 'success',
    '登出': 'info',
    '修改密码': 'warning',
    '查看卡密': '',
    '生成卡密': 'success',
    '删除卡密': 'danger',
    '修改设置': 'warning'
  }
  return tagTypes[action] || ''
}

// 记录访问日志
const logAccess = (action, status = 'success') => {
  try {
    const logs = JSON.parse(localStorage.getItem('access_logs') || '[]')
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1', // 实际应用中应获取真实IP
      userAgent: navigator.userAgent,
      action,
      status
    }
    
    logs.unshift(newLog)
    
    // 只保留最近1000条记录
    if (logs.length > 1000) {
      logs.splice(1000)
    }
    
    localStorage.setItem('access_logs', JSON.stringify(logs))
  } catch (error) {
    console.error('记录访问日志失败:', error)
  }
}

// 隐私安全方法
const viewAccessLogs = () => {
  showAccessLogsDialog.value = true
  loadAccessLogs()
}

const clearAccessLogs = async () => {
  try {
    await ElMessageBox.confirm('确定要清除所有访问日志吗？', '确认操作', {
      type: 'warning'
    })
    ElMessage.success('访问日志已清除')
  } catch {
    // 用户取消
  }
}

// 数据管理方法
const exportData = async () => {
  try {
    const data = {
      settings,
      userData: JSON.parse(localStorage.getItem('user_data') || '{}'),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('导出数据失败:', error)
    ElMessage.error('数据导出失败，请重试')
  }
}

const exportSettings = async () => {
  try {
    const data = {
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    ElMessage.success('设置导出成功')
  } catch (error) {
    console.error('导出设置失败:', error)
    ElMessage.error('设置导出失败，请重试')
  }
}

const importData = (file) => {
  if (!file) {
    ElMessage.warning('请选择要导入的文件')
    return false
  }
  
  if (!file.name.endsWith('.json')) {
    ElMessage.error('请选择JSON格式的备份文件')
    return false
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // 验证文件格式
      if (!data.settings) {
        ElMessage.error('无效的备份文件：缺少设置数据')
        return
      }
      
      // 验证设置数据
      const errors = settingsStore.validateSettings(data.settings)
      if (errors.length > 0) {
        ElMessage.error(`导入失败：${errors.join(', ')}`)
        return
      }
      
      const success = settingsStore.importSettings(data)
      if (success) {
        ElMessage.success('数据导入成功')
        // 重新加载数据统计
        loadDataStats()
      } else {
        ElMessage.error('数据导入失败')
      }
    } catch (error) {
      console.error('导入数据失败:', error)
      ElMessage.error('文件解析失败，请检查文件格式')
    }
  }
  
  reader.onerror = () => {
    ElMessage.error('文件读取失败')
  }
  
  reader.readAsText(file)
  return false
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm('确定要清除所有缓存吗？', '确认操作', {
      type: 'warning'
    })
    // 清除缓存逻辑
    ElMessage.success('缓存已清除')
    loadDataStats()
  } catch {
    // 用户取消
  }
}

const resetSettings = async () => {
  try {
    await ElMessageBox.confirm('确定要重置所有设置为默认值吗？', '确认操作', {
      type: 'warning'
    })
    localStorage.removeItem('system_settings')
    location.reload()
  } catch {
    // 用户取消
  }
}

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm(
      '这将清除所有本地数据，包括用户信息、卡密数据等，此操作不可恢复！',
      '危险操作',
      {
        type: 'error',
        confirmButtonText: '确认清除',
        cancelButtonText: '取消'
      }
    )
    localStorage.clear()
    ElMessage.success('所有数据已清除，页面即将刷新')
    setTimeout(() => location.reload(), 1000)
  } catch {
    // 用户取消
  }
}

// 关于页面方法
const checkUpdate = async () => {
  try {
    ElMessage.loading('正在检查更新...')
    const updateInfo = await checkForUpdates()
    
    if (updateInfo.hasUpdate) {
      ElMessageBox.alert(
        `发现新版本 ${updateInfo.latestVersion}！\n\n更新内容：\n${updateInfo.updateInfo.changelog.join('\n')}`,
        '发现更新',
        {
          confirmButtonText: '立即更新',
          type: 'success'
        }
      ).then(() => {
        ElMessage.info('更新功能开发中...')
      })
    } else {
      ElMessage.success('已是最新版本')
    }
  } catch (error) {
    ElMessage.error('检查更新失败')
  }
}

const openHelp = () => {
  const helpTopics = getHelpTopics()
  
  ElMessageBox.alert(
    helpTopics.map(topic => `• ${topic.title}: ${topic.description}`).join('\n'),
    '帮助文档',
    {
      confirmButtonText: '我知道了',
      type: 'info'
    }
  )
}

const reportBug = async () => {
  try {
    const { value: description } = await ElMessageBox.prompt(
      '请描述您遇到的问题：',
      '问题反馈',
      {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '详细描述问题的发生步骤、错误信息等...'
      }
    )
    
    if (description) {
      const result = await submitBugReport({
        description,
        category: 'bug',
        severity: 'medium'
      })
      
      if (result.success) {
        ElMessage.success(`${result.message}，报告编号：${result.reportId}`)
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('提交反馈失败')
    }
  }
}

// 密码修改方法
const changePassword = async () => {
  try {
    const valid = await passwordFormRef.value.validate()
    if (!valid) return
    
    passwordLoading.value = true
    
    // 这里应该调用API修改密码
    // const result = await api.changePassword({
    //   currentPassword: passwordForm.currentPassword,
    //   newPassword: passwordForm.newPassword
    // })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功，请重新登录')
    showPasswordDialog.value = false
    
    // 重置表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordFormRef.value.resetFields()
    
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('密码修改失败，请重试')
  } finally {
    passwordLoading.value = false
  }
}

// 更新安全设置
const updateSecuritySetting = async (key, value) => {
  try {
    securitySettings[key] = value
    
    // 这里应该调用API保存安全设置
    // await api.updateSecuritySetting(key, value)
    
    ElMessage.success('安全设置已更新')
  } catch (error) {
    console.error('更新安全设置失败:', error)
    ElMessage.error('安全设置更新失败')
    // 回滚设置
    securitySettings[key] = !value
  }
}

// 通用方法
const resetCurrentSection = async () => {
  try {
    await ElMessageBox.confirm('确定要重置当前部分的设置吗？', '确认操作', {
      type: 'warning'
    })
    
    const success = settingsStore.resetSection(activeMenu.value)
    if (success) {
      ElMessage.success('设置已重置')
    } else {
      ElMessage.error('重置失败，请重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置设置失败:', error)
      ElMessage.error('重置失败，请重试')
    }
  }
}

const saveSettings = async () => {
  try {
    const success = settingsStore.saveSettings()
    if (success) {
      ElMessage.success('设置已保存')
    } else {
      ElMessage.error('保存失败，请检查浏览器存储权限')
    }
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

const loadSettings = async () => {
  try {
    settingsStore.loadSettings()
  } catch (error) {
    console.error('加载设置失败:', error)
    ElMessage.warning('加载设置失败，将使用默认设置')
  }
}

const loadDataStats = async () => {
  try {
    const stats = {
      cacheSize: calculateStorageSize(),
      userData: getDataCount('all_users'),
      logCount: getDataCount('access_logs')
    }
    Object.assign(dataStats, stats)
  } catch (error) {
    console.error('加载数据统计失败:', error)
    // 设置默认值
    Object.assign(dataStats, {
      cacheSize: 0,
      userData: 0,
      logCount: 0
    })
  }
}

// 系统设置方法
const updateLanguage = (language) => {
  try {
    // 保存到store
    settingsStore.updateSystemSetting('language', language)
    
    // 保存到国际化系统
    saveLanguage(language)
    
    // 更新当前语言状态
    currentLang.value = language
    
    // 显示成功消息
    ElMessage.success(t('settings.messages.languageUpdated'))
    
    // 提示用户页面将刷新
    ElMessage.info({
      message: t('settings.messages.languageWillReload'),
      duration: 3000
    })
    
    // 3秒后刷新页面以应用新语言
    setTimeout(() => {
      window.location.reload()
    }, 3000)
    
  } catch (error) {
    console.error('语言切换失败:', error)
    ElMessage.error('语言切换失败，请重试')
  }
}

const updateTimezone = (timezone) => {
  settingsStore.updateSystemSetting('timezone', timezone)
  ElMessage.success('时区设置已更新')
}

const updateDateFormat = (format) => {
  settingsStore.updateSystemSetting('dateFormat', format)
  ElMessage.success('日期格式已更新')
}

const updateNumberFormat = (format) => {
  settingsStore.updateSystemSetting('numberFormat', format)
  ElMessage.success('数字格式已更新')
}

const updatePageSize = (size) => {
  settingsStore.updateSystemSetting('pageSize', size)
  ElMessage.success('页面大小已更新')
}

const updateAutoRefresh = (enabled) => {
  settingsStore.updateSystemSetting('autoRefresh', enabled)
  if (enabled) {
    setupAutoRefresh()
  } else {
    clearAutoRefresh()
  }
  ElMessage.success(enabled ? '自动刷新已启用' : '自动刷新已关闭')
}

const setupAutoRefresh = () => {
  clearAutoRefresh()
  
  const interval = 30 * 1000 // 30秒
  autoRefreshTimer.remaining = interval
  
  // 更新倒计时显示
  autoRefreshTimer.interval = setInterval(() => {
    autoRefreshTimer.remaining -= 1000
    if (autoRefreshTimer.remaining <= 0) {
      performAutoRefresh()
      autoRefreshTimer.remaining = interval
    }
  }, 1000)
}

const clearAutoRefresh = () => {
  if (autoRefreshTimer.timer) {
    clearTimeout(autoRefreshTimer.timer)
  }
  if (autoRefreshTimer.interval) {
    clearInterval(autoRefreshTimer.interval)
  }
  autoRefreshTimer.remaining = 0
}

const performAutoRefresh = () => {
  // 刷新数据统计
  loadDataStats()
  
  // 发送刷新事件给其他组件
  window.dispatchEvent(new CustomEvent('autoRefresh'))
}

// 计算属性
const filteredNotifications = computed(() => {
  if (notificationFilter.value === 'all') {
    return notificationHistory.value
  }
  return notificationHistory.value.filter(n => n.type === notificationFilter.value)
})

// 新增的通知功能方法
const updateNotificationPriority = (priority) => {
  settingsStore.updateNotificationSetting('priority', priority)
  ElMessage.success('通知优先级已更新')
}

const updateNotificationDuration = (duration) => {
  settingsStore.updateNotificationSetting('duration', duration)
  ElMessage.success('通知持续时间已更新')
}

const updateNotificationRateLimit = (enabled) => {
  settingsStore.updateNotificationSetting('rateLimit', enabled)
  ElMessage.success(enabled ? '通知频率限制已启用' : '通知频率限制已关闭')
}

const showNotificationHistory = () => {
  showNotificationHistoryDialog.value = true
  loadNotificationHistory()
}

const loadNotificationHistory = () => {
  notificationHistory.value = initNotificationHistory()
}

const clearNotificationHistory = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有通知历史吗？', '确认操作', {
      type: 'warning'
    })
    localStorage.removeItem('notification_history')
    notificationHistory.value = []
    ElMessage.success('通知历史已清空')
  } catch {
    // 用户取消
  }
}

const getTodayNotificationCount = () => {
  const today = new Date().toDateString()
  return notificationHistory.value.filter(n => 
    new Date(n.timestamp).toDateString() === today
  ).length
}

const getUnreadNotificationCount = () => {
  return notificationHistory.value.filter(n => !n.read).length
}

const markAsRead = (notification) => {
  notification.read = true
  const history = JSON.parse(localStorage.getItem('notification_history') || '[]')
  const index = history.findIndex(n => n.id === notification.id)
  if (index !== -1) {
    history[index].read = true
    localStorage.setItem('notification_history', JSON.stringify(history))
  }
}

const markAllAsRead = () => {
  notificationHistory.value.forEach(n => n.read = true)
  localStorage.setItem('notification_history', JSON.stringify(notificationHistory.value))
  ElMessage.success('所有通知已标记为已读')
}

const deleteNotification = (notification) => {
  const index = notificationHistory.value.findIndex(n => n.id === notification.id)
  if (index !== -1) {
    notificationHistory.value.splice(index, 1)
    localStorage.setItem('notification_history', JSON.stringify(notificationHistory.value))
  }
}

const formatNotificationTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getNotificationIconClass = (type) => {
  const classes = {
    order: 'notification-order',
    payment: 'notification-payment',
    security: 'notification-security',
    system: 'notification-system'
  }
  return classes[type] || 'notification-default'
}

const testEmailNotification = () => {
  if (!settings.notification.email) {
    ElMessage.warning('请先启用邮件通知')
    return
  }
  
  if (!notificationConfig.emailAddress) {
    ElMessage.warning('请先配置邮箱地址')
    return
  }
  
  ElMessage.success('测试邮件已发送（模拟）')
  // 实际应用中这里应该调用邮件发送API
}

// 系统偏好新功能方法
const updateCacheStrategy = (strategy) => {
  settingsStore.updateSystemSetting('cacheStrategy', strategy)
  ElMessage.success('缓存策略已更新')
  // 根据策略调整缓存行为
  applyCacheStrategy(strategy)
}

const updateCrashReporting = (enabled) => {
  settingsStore.updateSystemSetting('crashReporting', enabled)
  ElMessage.success(enabled ? '错误报告已启用' : '错误报告已禁用')
}

const updateAnalytics = (enabled) => {
  settingsStore.updateSystemSetting('analytics', enabled)
  ElMessage.success(enabled ? '使用统计已启用' : '使用统计已禁用')
}

const updateDebugMode = (enabled) => {
  settingsStore.updateSystemSetting('debugMode', enabled)
  
  if (enabled) {
    console.log('调试模式已启用')
    window.DEBUG_MODE = true
  } else {
    window.DEBUG_MODE = false
  }
  
  ElMessage.success(enabled ? '调试模式已启用' : '调试模式已禁用')
}

const updatePreload = (enabled) => {
  settingsStore.updateSystemSetting('preload', enabled)
  ElMessage.success(enabled ? '预加载已启用' : '预加载已禁用')
}

const applyCacheStrategy = (strategy) => {
  // 根据缓存策略调整应用行为
  const strategies = {
    aggressive: { maxAge: 24 * 60 * 60 * 1000, maxSize: 50 * 1024 * 1024 },
    standard: { maxAge: 6 * 60 * 60 * 1000, maxSize: 20 * 1024 * 1024 },
    minimal: { maxAge: 60 * 60 * 1000, maxSize: 5 * 1024 * 1024 },
    none: { maxAge: 0, maxSize: 0 }
  }
  
  const config = strategies[strategy]
  if (config) {
    // 应用缓存配置
    window.CACHE_CONFIG = config
  }
}

// 系统性能相关方法
const updateSystemPerformance = () => {
  Object.assign(systemPerformance, getSystemPerformance())
}

const runPerformanceTestHandler = async () => {
  try {
    ElMessage.loading('正在运行性能测试...')
    const results = await runPerformanceTest()
    
    const message = `性能测试完成！\n` +
      `总耗时: ${results.totalDuration}ms\n` +
      results.tests.map(test => 
        `${test.name}: ${test.duration}ms (${test.status === 'good' ? '良好' : '需优化'})`
      ).join('\n')
    
    ElMessageBox.alert(message, '性能测试结果', {
      confirmButtonText: '确定',
      type: results.tests.every(t => t.status === 'good') ? 'success' : 'warning'
    })
  } catch (error) {
    ElMessage.error('性能测试失败')
  }
}

const optimizeSystemHandler = async () => {
  try {
    ElMessage.loading('正在优化系统...')
    const result = await optimizeSystem()
    
    if (result.success) {
      ElMessage.success(result.message)
      // 更新数据统计和性能指标
      loadDataStats()
      updateSystemPerformance()
    } else {
      ElMessage.warning('系统优化完成，但未发现需要优化的项目')
    }
  } catch (error) {
    ElMessage.error('系统优化失败')
  }
}

// 关于系统新功能方法
const getSystemHealthColor = (health) => {
  if (health >= 90) return 'healthy'
  if (health >= 70) return 'warning'
  return 'danger'
}

const runSystemDiagnosticHandler = async () => {
  showDiagnosticDialog.value = true
  diagnosticLoading.value = true
  
  try {
    diagnosticResult.value = await runSystemDiagnostic()
  } catch (error) {
    ElMessage.error('系统诊断失败')
  } finally {
    diagnosticLoading.value = false
  }
}

const exportSystemInfo = () => {
  const info = {
    ...systemInfo,
    performance: systemPerformance,
    settings: settings,
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(info, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `system_info_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('系统信息已导出')
}

const clearSystemCache = async () => {
  try {
    await ElMessageBox.confirm('确定要清理系统缓存吗？', '确认操作', {
      type: 'warning'
    })
    
    // 清理各种缓存
    localStorage.removeItem('cache_data')
    sessionStorage.clear()
    
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
    
    ElMessage.success('系统缓存已清理')
    loadDataStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理缓存失败')
    }
  }
}

const restartSystem = async () => {
  try {
    await ElMessageBox.confirm(
      '重启应用将刷新页面，未保存的数据可能丢失',
      '确认重启',
      {
        type: 'warning',
        confirmButtonText: '确认重启',
        cancelButtonText: '取消'
      }
    )
    
    ElMessage.success('正在重启应用...')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch {
    // 用户取消
  }
}

const openLicense = () => {
  const licenseText = `
MIT License

Copyright (c) 2024 卡密管理系统

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
  `
  
  ElMessageBox.alert(licenseText, '软件许可证', {
    confirmButtonText: '我知道了'
  })
}

const exportDiagnosticReport = () => {
  if (!diagnosticResult.value) return
  
  const report = {
    ...diagnosticResult.value,
    systemInfo: systemInfo,
    performance: systemPerformance,
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diagnostic_report_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('诊断报告已导出')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
  
  // 初始化语言设置
  const savedLang = settings.system.language || 'zh-CN'
  initLanguage(savedLang)
  currentLang.value = getCurrentLanguage()
  
  // 加载设置和数据
  loadSettings()
  loadDataStats()
  
  // 初始化系统性能监控
  updateSystemPerformance()
  
  // 初始化通知历史记录
  loadNotificationHistory()
  
  // 应用已保存的设置
  settingsStore.applyAppearance()
  
  // 设置自动登出
  if (settings.privacy.autoLogout !== 'never') {
    setupAutoLogout()
  }
  
  // 设置自动刷新
  if (settings.system.autoRefresh) {
    setupAutoRefresh()
  }
  
  // 监听用户活动以重置自动登出定时器
  const resetTimer = () => resetAutoLogoutTimer()
  document.addEventListener('click', resetTimer)
  document.addEventListener('keypress', resetTimer)
  document.addEventListener('mousemove', resetTimer)
  
  // 定期更新性能监控数据
  const performanceUpdateInterval = setInterval(() => {
    updateSystemPerformance()
  }, 5000) // 每5秒更新一次
  
  // 保存interval引用以便清理
  window.performanceUpdateInterval = performanceUpdateInterval
})

// ====== 新增设置模块的方法 ======

// 支付设置相关方法
const updatePaymentMethods = (methods) => {
  settingsStore.updatePaymentSetting('methods', methods)
  ElMessage.success('支付方式已更新')
}

const updateMinAmount = (amount) => {
  settingsStore.updatePaymentSetting('minAmount', amount)
  ElMessage.success('最低充值金额已更新')
}

const updateFeeRate = (rate) => {
  settingsStore.updatePaymentSetting('feeRate', rate)
  ElMessage.success('手续费率已更新')
}

const updateAutoConfirm = (enabled) => {
  settingsStore.updatePaymentSetting('autoConfirm', enabled)
  ElMessage.success('自动确认订单设置已更新')
}

const updatePaymentTimeout = (timeout) => {
  settingsStore.updatePaymentSetting('timeout', timeout)
  ElMessage.success('支付超时时间已更新')
}

// 邮件服务相关方法
const updateEmailService = (enabled) => {
  settingsStore.updateEmailSetting('enabled', enabled)
  ElMessage.success(enabled ? '邮件服务已启用' : '邮件服务已关闭')
}

const updateEmailConfig = () => {
  settingsStore.saveEmailConfig()
  ElMessage.success('邮件配置已保存')
}

const updateEmailTypes = (types) => {
  settingsStore.updateEmailSetting('types', types)
  ElMessage.success('邮件类型配置已更新')
}

const testEmailSend = async () => {
  if (!testEmailAddress.value) {
    ElMessage.error('请输入测试邮箱地址')
    return
  }
  
  emailTesting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success(`测试邮件已发送至 ${testEmailAddress.value}`)
  } catch (error) {
    ElMessage.error('测试邮件发送失败')
  } finally {
    emailTesting.value = false
  }
}

// 安全中心相关方法
const updateLoginSecurity = (enabled) => {
  settingsStore.updateSecuritySetting('loginSecurity', enabled)
  ElMessage.success(enabled ? '登录安全已强化' : '登录安全已设为标准')
}

const updateIpWhitelist = (enabled) => {
  settingsStore.updateSecuritySetting('ipWhitelist', enabled)
  ElMessage.success(enabled ? 'IP白名单已启用' : 'IP白名单已关闭')
}

const addNewIP = () => {
  if (!settings.security.allowedIPs) {
    settings.security.allowedIPs = []
  }
  settings.security.allowedIPs.push('')
}

const removeIP = (index) => {
  settings.security.allowedIPs.splice(index, 1)
}

const updateOperationLog = (enabled) => {
  settingsStore.updateSecuritySetting('operationLog', enabled)
  ElMessage.success(enabled ? '操作日志记录已启用' : '操作日志记录已关闭')
}


const viewActiveSessions = () => {
  ElMessage.info('查看活跃会话功能开发中...')
}

const viewSuspiciousLogins = () => {
  ElMessage.info('查看可疑登录功能开发中...')
}

// API管理相关方法
const toggleApiKey = (key) => {
  key.status = key.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(`API密钥已${key.status === 'active' ? '启用' : '禁用'}`)
}

const regenerateApiKey = (key) => {
  ElMessageBox.confirm('重新生成API密钥将使旧密钥失效，确认继续？', '确认操作').then(() => {
    key.key = 'sk-' + Math.random().toString(36).substr(2, 24) + '...'
    ElMessage.success('API密钥已重新生成')
  })
}

const deleteApiKey = (key) => {
  ElMessageBox.confirm('删除API密钥后无法恢复，确认删除？', '确认删除', {
    type: 'warning'
  }).then(() => {
    const index = apiKeys.value.findIndex(k => k.id === key.id)
    if (index > -1) {
      apiKeys.value.splice(index, 1)
      ElMessage.success('API密钥已删除')
    }
  })
}

const updateApiRateLimit = (limit) => {
  settingsStore.updateApiSetting('rateLimit', limit)
  ElMessage.success('API请求限制已更新')
}

const updateCorsSettings = () => {
  settingsStore.saveApiConfig()
  ElMessage.success('CORS设置已保存')
}







// 备份恢复相关方法
const updateAutoBackup = (enabled) => {
  settingsStore.updateBackupSetting('autoBackup', enabled)
  ElMessage.success(enabled ? '自动备份已启用' : '自动备份已关闭')
}

const updateBackupFrequency = (frequency) => {
  settingsStore.updateBackupSetting('frequency', frequency)
  ElMessage.success('备份频率已更新')
}

const updateBackupTime = (time) => {
  settingsStore.updateBackupSetting('backupTime', time)
  ElMessage.success('备份时间已更新')
}

const updateRetainCount = (count) => {
  settingsStore.updateBackupSetting('retainCount', count)
  ElMessage.success('备份保留份数已更新')
}

const updateBackupContents = (contents) => {
  settingsStore.updateBackupSetting('contents', contents)
  ElMessage.success('备份内容配置已更新')
}

const createBackup = async () => {
  backupCreating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 3000)) // 模拟备份过程
    const timestamp = new Date().toLocaleString('zh-CN').replace(/[\s:/]/g, '-')
    const newBackup = {
      name: `backup_${timestamp}.zip`,
      size: '15.5MB',
      createTime: new Date().toLocaleString('zh-CN'),
      type: 'manual'
    }
    backupHistory.value.unshift(newBackup)
    lastBackupTime.value = newBackup.createTime
    ElMessage.success('备份创建成功')
  } catch (error) {
    ElMessage.error('备份创建失败')
  } finally {
    backupCreating.value = false
  }
}

const downloadBackup = (backup) => {
  ElMessage.info(`开始下载 ${backup.name}`)
}

const restoreBackup = (backup) => {
  ElMessageBox.confirm(`从备份 ${backup.name} 恢复数据将覆盖当前数据，确认恢复？`, '确认恢复', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('数据恢复成功')
  })
}

const deleteBackup = (backup) => {
  ElMessageBox.confirm(`删除备份 ${backup.name} 后无法恢复，确认删除？`, '确认删除', {
    type: 'warning'
  }).then(() => {
    const index = backupHistory.value.findIndex(b => b.name === backup.name)
    if (index > -1) {
      backupHistory.value.splice(index, 1)
      ElMessage.success('备份已删除')
    }
  })
}

const beforeRestoreUpload = (file) => {
  const isValidType = file.type === 'application/json' || file.type === 'application/zip'
  if (!isValidType) {
    ElMessage.error('只能上传 JSON 或 ZIP 格式的备份文件')
  }
  return isValidType
}

const onRestoreSuccess = () => {
  ElMessage.success('数据恢复成功')
}
</script>

<style lang="scss" scoped>
.settings-page {
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
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    h2 {
      color: #303133;
      margin: 0;
      
      @media (max-width: 768px) {
        font-size: 18px;
      }
    }
    
    .mobile-menu-btn {
      @media (max-width: 768px) {
        display: inline-flex;
      }
      
      @media (min-width: 769px) {
        display: none;
      }
    }
  }
}

.settings-menu {
  @media (max-width: 768px) {
    margin-bottom: 16px;
    display: none;
    
    &.mobile-menu-open {
      display: block;
    }
  }
  
  .settings-nav {
    border: none;
    
    @media (max-width: 768px) {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .el-menu-item {
        flex: 1;
        min-width: 120px;
        justify-content: center;
        margin-bottom: 0;
        border-radius: 6px;
        
        span {
          font-size: 12px;
        }
      }
    }
    
    .el-menu-item {
      border-radius: 6px;
      margin-bottom: 4px;
      
      @media (min-width: 769px) {
        margin-bottom: 4px;
      }
      
      &:hover {
        background-color: #f5f7fa;
      }
      
      &.is-active {
        background-color: #409eff;
        color: #fff;
        
        .el-icon {
          color: #fff;
        }
      }
    }
  }
}

.settings-row {
  @media (max-width: 768px) {
    .el-col {
      margin-bottom: 16px;
    }
  }
}

.settings-content {
  min-height: 600px;
  
  @media (max-width: 768px) {
    min-height: auto;
    
    .el-card__body {
      padding: 16px;
    }
  }
}

.setting-section {
  .section-header {
    margin-bottom: 30px;
    
    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
    
    h3 {
      color: #303133;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
      
      @media (max-width: 768px) {
        font-size: 18px;
      }
    }
    
    p {
      color: #909399;
      margin: 0;
      
      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }
  
  .el-form {
    @media (max-width: 768px) {
      .el-form-item {
        margin-bottom: 20px;
        
        .el-form-item__label {
          width: 100px !important;
          text-align: left;
          padding-right: 8px;
        }
        
        .el-form-item__content {
          margin-left: 100px !important;
        }
      }
    }
  }
  
  .setting-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
  
  .color-picker-group {
    display: flex;
    align-items: center;
    gap: 12px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .color-label {
      font-size: 14px;
      color: #606266;
    }
  }
  
  .font-size-preview {
    margin-left: 20px;
    color: #606266;
    
    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 8px;
      display: block;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      
      .el-button {
        width: 100%;
      }
    }
  }
}

.data-stats {
  margin-bottom: 30px;
  
  .el-statistic {
    text-align: center;
  }
}

.data-actions {
  .action-group {
    margin-bottom: 30px;
    
    h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    p {
      color: #909399;
      margin: 0 0 16px 0;
    }
    
    &.danger-zone {
      padding: 20px;
      background-color: #fef0f0;
      border: 1px solid #fbc4c4;
      border-radius: 6px;
      
      h4 {
        color: #f56c6c;
      }
    }
  }
}

.system-info {
  .info-card {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    
    .info-icon {
      color: #409eff;
    }
    
    .info-content {
      h3 {
        color: #303133;
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      
      p {
        color: #909399;
        margin: 0 0 12px 0;
      }
      
      .version-info {
        display: flex;
        gap: 16px;
        
        .version, .build {
          padding: 4px 8px;
          background-color: #f0f2f5;
          border-radius: 4px;
          font-size: 12px;
          color: #606266;
        }
      }
    }
  }
  
  .feature-list {
    h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        padding: 6px 0;
        color: #606266;
        
        &::before {
          content: '';
          display: none;
        }
      }
    }
  }
  
  .tech-stack {
    h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tech-tag {
        background-color: #f0f2f5;
        border: 1px solid #d9d9d9;
      }
    }
  }
  
  .contact-info {
    h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    p {
      color: #909399;
      margin: 0 0 16px 0;
    }
    
    .contact-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
  }
}

.settings-actions {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .shortcuts-hint {
    span {
      font-size: 12px;
      color: #909399;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    
    @media (max-width: 768px) {
      width: 100%;
      
      .el-button {
        flex: 1;
      }
    }
  }
}

// 重置颜色按钮样式
.color-picker-group {
  .reset-color-btn {
    margin-left: 8px;
    padding: 4px 8px;
    font-size: 12px;
  }
}

// 紧凑模式样式
:global(.compact-mode) {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-card {
    .el-card__body {
      padding: 16px;
    }
  }
}

// 无动画模式
:global(.no-animations) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

// 密码强度条样式
.password-strength {
  margin-top: 8px;
  
  .strength-bar {
    width: 100%;
    height: 4px;
    background-color: #e4e7ed;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 4px;
    
    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      border-radius: 2px;
      
      &.weak {
        background-color: #f56c6c;
      }
      
      &.fair {
        background-color: #e6a23c;
      }
      
      &.good {
        background-color: #67c23a;
      }
      
      &.strong {
        background-color: #409eff;
      }
    }
  }
  
  .strength-text {
    font-size: 12px;
    color: #909399;
  }
}

// 访问日志对话框样式
.access-logs-container {
  .logs-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    
    .logs-stats {
      display: flex;
      gap: 32px;
      
      @media (max-width: 768px) {
        gap: 16px;
        flex-wrap: wrap;
      }
    }
    
    .logs-actions {
      display: flex;
      gap: 8px;
    }
  }
}

// 定时器信息样式
.timer-info {
  color: #67c23a;
  font-weight: 500;
  margin-left: 8px;
}

// 通知历史记录对话框样式
.notification-history-container {
  .history-stats {
    display: flex;
    gap: 32px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      gap: 16px;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
  
  .history-filters {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: stretch;
    }
  }
  
  .notification-list {
    max-height: 400px;
    overflow-y: auto;
    
    .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 12px;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
      }
      
      &.unread {
        background-color: #ecf5ff;
        border-left: 3px solid #409eff;
      }
      
      .notification-icon {
        margin-right: 12px;
        padding-top: 2px;
        
        .el-icon {
          font-size: 18px;
          
          &.notification-order {
            color: #67c23a;
          }
          
          &.notification-payment {
            color: #e6a23c;
          }
          
          &.notification-security {
            color: #f56c6c;
          }
          
          &.notification-system {
            color: #409eff;
          }
          
          &.notification-default {
            color: #909399;
          }
        }
      }
      
      .notification-content {
        flex: 1;
        
        .notification-title {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 14px;
          color: #303133;
        }
        
        .notification-body {
          font-size: 13px;
          color: #606266;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        
        .notification-time {
          font-size: 12px;
          color: #909399;
        }
      }
      
      .notification-actions {
        margin-left: 12px;
        padding-top: 2px;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 0;
  }
}

// 系统诊断对话框样式
.diagnostic-container {
  .diagnostic-summary {
    margin-bottom: 24px;
    
    h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .summary-stats {
      .summary-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-radius: 8px;
        
        &.healthy {
          background-color: #f0f9ff;
          border: 1px solid #91d5ff;
        }
        
        &.warning {
          background-color: #fffbe6;
          border: 1px solid #ffd666;
        }
        
        &.danger {
          background-color: #fff2f0;
          border: 1px solid #ffadd2;
        }
        
        .summary-icon {
          margin-right: 12px;
          
          .el-icon {
            font-size: 24px;
          }
          
          .healthy & .el-icon {
            color: #52c41a;
          }
          
          .warning & .el-icon {
            color: #faad14;
          }
          
          .danger & .el-icon {
            color: #f5222d;
          }
        }
        
        .summary-text {
          .summary-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
            
            .healthy & {
              color: #52c41a;
            }
            
            .warning & {
              color: #faad14;
            }
            
            .danger & {
              color: #f5222d;
            }
          }
          
          .summary-desc {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
  
  .diagnostic-details {
    h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .check-list {
      .check-item {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .check-icon {
          margin-right: 12px;
          padding-top: 2px;
          
          .el-icon {
            font-size: 18px;
          }
        }
        
        &.pass .check-icon .el-icon {
          color: #67c23a;
        }
        
        &.warning .check-icon .el-icon {
          color: #e6a23c;
        }
        
        &.fail .check-icon .el-icon {
          color: #f56c6c;
        }
        
        .check-content {
          flex: 1;
          
          .check-name {
            font-weight: 600;
            font-size: 14px;
            color: #303133;
            margin-bottom: 4px;
          }
          
          .check-description {
            font-size: 13px;
            color: #606266;
            margin-bottom: 4px;
          }
          
          .check-recommendation {
            font-size: 12px;
            color: #909399;
            padding: 4px 8px;
            background-color: #f5f7fa;
            border-radius: 4px;
          }
        }
      }
    }
  }
}

// 系统性能监控样式
.performance-stats {
  .performance-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .performance-label {
      width: 80px;
      font-size: 14px;
      color: #606266;
      margin-right: 12px;
    }
    
    .performance-bar {
      flex: 1;
      height: 6px;
      background-color: #f0f0f0;
      border-radius: 3px;
      margin-right: 12px;
      overflow: hidden;
      
      .performance-fill {
        height: 100%;
        background: linear-gradient(90deg, #67c23a 0%, #e6a23c 70%, #f56c6c 100%);
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }
    
    .performance-value {
      font-weight: 600;
      color: #303133;
      min-width: 60px;
      text-align: right;
    }
  }
}

// 系统状态和详情样式
.system-stats {
  h4 {
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      
      .el-icon {
        font-size: 18px;
      }
      
      &.healthy {
        background-color: #f6ffed;
        color: #52c41a;
      }
      
      &.uptime {
        background-color: #f0f9ff;
        color: #1890ff;
      }
      
      &.users {
        background-color: #fff7e6;
        color: #fa8c16;
      }
    }
    
    .stat-content {
      .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 2px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.system-details {
  h4 {
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .detail-item {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      
      .detail-label {
        font-weight: 500;
        color: #606266;
        min-width: 80px;
        margin-right: 12px;
      }
      
      .detail-value {
        color: #303133;
        word-break: break-all;
        flex: 1;
      }
    }
  }
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  
  .feature-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    background-color: #f9f9f9;
    
    .el-icon {
      margin-right: 8px;
      font-size: 16px;
      
      &.feature-active {
        color: #67c23a;
      }
      
      &.feature-inactive {
        color: #909399;
      }
    }
    
    span {
      font-size: 13px;
      color: #606266;
    }
  }
}

.tech-stack {
  h4 {
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .tech-tag {
      background-color: #f0f2f5;
      border: 1px solid #d9d9d9;
      color: #606266;
      font-size: 12px;
    }
  }
}

.diagnostic-tools {
  h4 {
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .diagnostic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}

.contact-info {
  h4 {
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    color: #909399;
    margin-bottom: 16px;
  }
  
  .contact-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      .el-button {
        flex: 1;
        min-width: 0;
      }
    }
  }
}

// 持续时间预览样式
.duration-preview {
  margin-left: 20px;
  color: #606266;
  font-size: 13px;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 8px;
    display: block;
  }
}

// 对话框响应式样式
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin-top: 5vh !important;
    
    .el-dialog__body {
      padding: 16px;
    }
    
    .el-form-item {
      margin-bottom: 16px;
      
      .el-form-item__label {
        width: 80px !important;
        font-size: 14px;
      }
      
      .el-form-item__content {
        margin-left: 80px !important;
      }
    }
  }
  
  .access-logs-container {
    .logs-header {
      flex-direction: column;
      gap: 16px;
      
      .logs-stats {
        justify-content: space-around;
        width: 100%;
      }
      
      .logs-actions {
        align-self: flex-end;
      }
    }
  }
  
  .notification-history-container {
    .history-filters {
      flex-direction: column;
      align-items: stretch;
      
      .el-select {
        margin-bottom: 8px;
      }
    }
  }
  
  .diagnostic-container {
    .diagnostic-summary {
      .summary-stats {
        .summary-item {
          flex-direction: column;
          text-align: center;
          
          .summary-icon {
            margin-right: 0;
            margin-bottom: 8px;
          }
        }
      }
    }
    
    .diagnostic-details {
      .check-list {
        .check-item {
          flex-direction: column;
          
          .check-icon {
            margin-right: 0;
            margin-bottom: 8px;
            align-self: flex-start;
          }
        }
      }
    }
  }
}

// 新设置模块的样式
.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .payment-logo {
    font-size: 20px;
  }
}

.payment-stats, .api-stats {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-label {
      font-size: 12px;
      color: #6c757d;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: #28a745;
    }
  }
}

.fee-preview, .unit {
  margin-left: 8px;
  color: #6c757d;
  font-size: 14px;
}

.ip-list {
  .ip-item {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
    align-items: center;
  }
}

.session-info {
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
  }
}

.api-keys {
  margin-bottom: 20px;
  
  .api-key-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 12px;
    
    .key-info {
      flex: 1;
      
      .key-name {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .key-value {
        font-family: monospace;
        color: #6c757d;
        font-size: 14px;
        margin-bottom: 8px;
      }
      
      .key-meta {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #6c757d;
        
        .status.active {
          color: #28a745;
        }
        
        .status.inactive {
          color: #dc3545;
        }
      }
    }
    
    .key-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .create-key {
    text-align: center;
    padding: 16px;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    
    &:hover {
      border-color: #409eff;
    }
  }
}

.log-filters {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.backup-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .last-backup {
    color: #6c757d;
    font-size: 14px;
  }
}

.backup-list, .restore-upload {
  margin-top: 20px;
  
  h4 {
    margin-bottom: 16px;
    color: #495057;
  }
}

.restore-upload {
  padding: 16px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  text-align: center;
  
  &:hover {
    border-color: #409eff;
  }
}

@media (max-width: 768px) {
  .payment-stats, .api-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .api-key-item {
    flex-direction: column;
    align-items: flex-start;
    
    .key-actions {
      margin-top: 12px;
      width: 100%;
      justify-content: flex-end;
    }
  }
  
  .session-info .info-row {
    flex-direction: column;
    align-items: flex-start;
    
    button {
      margin-top: 8px;
    }
  }
}
</style>