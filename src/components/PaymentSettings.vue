<template>
  <div class="payment-settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>支付设置</span>
          <el-button type="primary" @click="saveSettings" :loading="saving">
            <el-icon><Check /></el-icon>
            保存设置
          </el-button>
        </div>
      </template>

      <el-tabs type="border-card" v-model="activeTab">
        <!-- 支付宝设置 -->
        <el-tab-pane label="支付宝" name="alipay">
          <div class="payment-form">
            <el-form :model="alipaySettings" label-width="120px" ref="alipayFormRef">
              <el-form-item label="启用状态">
                <el-switch 
                  v-model="alipaySettings.enabled" 
                  active-text="启用" 
                  inactive-text="禁用"
                  @change="handleAlipayStatusChange"
                />
              </el-form-item>
              
              <div v-if="alipaySettings.enabled">
                <el-form-item label="应用ID" prop="appId" :rules="[{ required: true, message: '请输入应用ID' }]">
                  <el-input 
                    v-model="alipaySettings.appId" 
                    placeholder="请输入支付宝应用ID"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="私钥" prop="privateKey" :rules="[{ required: true, message: '请输入私钥' }]">
                  <el-input 
                    v-model="alipaySettings.privateKey" 
                    type="textarea" 
                    :rows="4"
                    placeholder="请输入应用私钥"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="支付宝公钥" prop="alipayPublicKey" :rules="[{ required: true, message: '请输入支付宝公钥' }]">
                  <el-input 
                    v-model="alipaySettings.alipayPublicKey" 
                    type="textarea" 
                    :rows="4"
                    placeholder="请输入支付宝公钥"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="网关地址">
                  <el-select v-model="alipaySettings.gateway" placeholder="选择网关地址">
                    <el-option label="正式环境" value="https://openapi.alipay.com/gateway.do" />
                    <el-option label="沙箱环境" value="https://openapi.alipaydev.com/gateway.do" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="回调地址">
                  <el-input 
                    v-model="alipaySettings.notifyUrl" 
                    placeholder="支付成功后的回调地址"
                  />
                </el-form-item>
                
                <el-form-item label="返回地址">
                  <el-input 
                    v-model="alipaySettings.returnUrl" 
                    placeholder="支付完成后用户返回的页面地址"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 微信支付设置 -->
        <el-tab-pane label="微信支付" name="wechat">
          <div class="payment-form">
            <el-form :model="wechatSettings" label-width="120px" ref="wechatFormRef">
              <el-form-item label="启用状态">
                <el-switch 
                  v-model="wechatSettings.enabled" 
                  active-text="启用" 
                  inactive-text="禁用"
                  @change="handleWechatStatusChange"
                />
              </el-form-item>
              
              <div v-if="wechatSettings.enabled">
                <el-form-item label="应用ID" prop="appId" :rules="[{ required: true, message: '请输入应用ID' }]">
                  <el-input 
                    v-model="wechatSettings.appId" 
                    placeholder="请输入微信应用ID"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="商户号" prop="mchId" :rules="[{ required: true, message: '请输入商户号' }]">
                  <el-input 
                    v-model="wechatSettings.mchId" 
                    placeholder="请输入微信商户号"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="API密钥" prop="apiKey" :rules="[{ required: true, message: '请输入API密钥' }]">
                  <el-input 
                    v-model="wechatSettings.apiKey" 
                    placeholder="请输入API密钥"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="证书路径">
                  <el-input 
                    v-model="wechatSettings.certPath" 
                    placeholder="微信支付证书文件路径（可选）"
                  />
                </el-form-item>
                
                <el-form-item label="私钥路径">
                  <el-input 
                    v-model="wechatSettings.keyPath" 
                    placeholder="微信支付私钥文件路径（可选）"
                  />
                </el-form-item>
                
                <el-form-item label="回调地址">
                  <el-input 
                    v-model="wechatSettings.notifyUrl" 
                    placeholder="支付成功后的回调地址"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 其他支付方式 -->
        <el-tab-pane label="其他支付" name="other">
          <div class="payment-form">
            <el-form :model="otherSettings" label-width="120px">
              <el-form-item label="银行卡转账">
                <el-switch 
                  v-model="otherSettings.bankTransfer.enabled" 
                  active-text="启用" 
                  inactive-text="禁用"
                />
              </el-form-item>
              
              <div v-if="otherSettings.bankTransfer.enabled">
                <el-form-item label="收款银行">
                  <el-input v-model="otherSettings.bankTransfer.bankName" placeholder="收款银行名称" />
                </el-form-item>
                
                <el-form-item label="账户名">
                  <el-input v-model="otherSettings.bankTransfer.accountName" placeholder="收款人姓名" />
                </el-form-item>
                
                <el-form-item label="银行卡号">
                  <el-input v-model="otherSettings.bankTransfer.accountNumber" placeholder="银行卡号" show-password />
                </el-form-item>
              </div>

              <el-form-item label="PayPal">
                <el-switch 
                  v-model="otherSettings.paypal.enabled" 
                  active-text="启用" 
                  inactive-text="禁用"
                />
              </el-form-item>
              
              <div v-if="otherSettings.paypal.enabled">
                <el-form-item label="Client ID">
                  <el-input v-model="otherSettings.paypal.clientId" placeholder="PayPal Client ID" show-password />
                </el-form-item>
                
                <el-form-item label="Client Secret">
                  <el-input v-model="otherSettings.paypal.clientSecret" placeholder="PayPal Client Secret" show-password />
                </el-form-item>
                
                <el-form-item label="环境">
                  <el-select v-model="otherSettings.paypal.environment">
                    <el-option label="正式环境" value="production" />
                    <el-option label="沙箱环境" value="sandbox" />
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 支付配置 -->
        <el-tab-pane label="通用配置" name="general">
          <div class="payment-form">
            <el-form :model="generalSettings" label-width="120px">
              <el-form-item label="支付超时时间">
                <el-input-number 
                  v-model="generalSettings.paymentTimeout" 
                  :min="5" 
                  :max="30" 
                  suffix="分钟"
                />
                <span class="form-tip">支付订单的有效时间（5-30分钟）</span>
              </el-form-item>
              
              <el-form-item label="最小支付金额">
                <el-input-number 
                  v-model="generalSettings.minAmount" 
                  :min="0.01" 
                  :precision="2"
                  :formatter="(value) => `¥ ${value}`"
                  :parser="(value) => value.replace(/¥\s?|(,*)/g, '')"
                />
              </el-form-item>
              
              <el-form-item label="最大支付金额">
                <el-input-number 
                  v-model="generalSettings.maxAmount" 
                  :min="1" 
                  :precision="2"
                  :formatter="(value) => `¥ ${value}`"
                  :parser="(value) => value.replace(/¥\s?|(,*)/g, '')"
                />
              </el-form-item>
              
              <el-form-item label="手续费设置">
                <el-radio-group v-model="generalSettings.feeType">
                  <el-radio label="none">免手续费</el-radio>
                  <el-radio label="fixed">固定金额</el-radio>
                  <el-radio label="percentage">按比例收取</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item v-if="generalSettings.feeType === 'fixed'" label="固定手续费">
                <el-input-number 
                  v-model="generalSettings.fixedFee" 
                  :min="0" 
                  :precision="2"
                  :formatter="(value) => `¥ ${value}`"
                  :parser="(value) => value.replace(/¥\s?|(,*)/g, '')"
                />
              </el-form-item>
              
              <el-form-item v-if="generalSettings.feeType === 'percentage'" label="手续费比例">
                <el-input-number 
                  v-model="generalSettings.feePercentage" 
                  :min="0" 
                  :max="10" 
                  :precision="2" 
                  suffix="%"
                />
              </el-form-item>
              
              <el-form-item label="自动确认">
                <el-switch 
                  v-model="generalSettings.autoConfirm" 
                  active-text="启用" 
                  inactive-text="禁用"
                />
                <span class="form-tip">收到支付回调后自动确认订单</span>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 测试连接 -->
      <div class="test-section">
        <el-divider>连接测试</el-divider>
        <div class="test-buttons">
          <el-button 
            v-if="alipaySettings.enabled" 
            type="primary" 
            @click="testAlipayConnection"
            :loading="testingAlipay"
          >
            测试支付宝连接
          </el-button>
          
          <el-button 
            v-if="wechatSettings.enabled" 
            type="success" 
            @click="testWechatConnection"
            :loading="testingWechat"
          >
            测试微信支付连接
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 支付统计 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>支付统计</span>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="今日支付订单" :value="paymentStats.todayOrders" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="今日支付金额" :value="paymentStats.todayAmount" prefix="¥" :precision="2" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本月支付订单" :value="paymentStats.monthOrders" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本月支付金额" :value="paymentStats.monthAmount" prefix="¥" :precision="2" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

const activeTab = ref('alipay')
const saving = ref(false)
const testingAlipay = ref(false)
const testingWechat = ref(false)

const alipayFormRef = ref()
const wechatFormRef = ref()

// 支付宝设置
const alipaySettings = reactive({
  enabled: false,
  appId: '',
  privateKey: '',
  alipayPublicKey: '',
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  notifyUrl: '',
  returnUrl: ''
})

// 微信支付设置
const wechatSettings = reactive({
  enabled: false,
  appId: '',
  mchId: '',
  apiKey: '',
  certPath: '',
  keyPath: '',
  notifyUrl: ''
})

// 其他支付方式设置
const otherSettings = reactive({
  bankTransfer: {
    enabled: false,
    bankName: '',
    accountName: '',
    accountNumber: ''
  },
  paypal: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    environment: 'sandbox'
  }
})

// 通用设置
const generalSettings = reactive({
  paymentTimeout: 15,
  minAmount: 0.01,
  maxAmount: 10000,
  feeType: 'none',
  fixedFee: 0,
  feePercentage: 0,
  autoConfirm: true
})

// 支付统计
const paymentStats = reactive({
  todayOrders: 0,
  todayAmount: 0,
  monthOrders: 0,
  monthAmount: 0
})

const handleAlipayStatusChange = (enabled) => {
  if (enabled) {
    ElMessage.info('请填写支付宝配置信息')
  } else {
    ElMessage.warning('支付宝支付已禁用')
  }
}

const handleWechatStatusChange = (enabled) => {
  if (enabled) {
    ElMessage.info('请填写微信支付配置信息')
  } else {
    ElMessage.warning('微信支付已禁用')
  }
}

const saveSettings = async () => {
  saving.value = true
  
  try {
    // 验证表单
    if (alipaySettings.enabled && alipayFormRef.value) {
      await alipayFormRef.value.validate()
    }
    
    if (wechatSettings.enabled && wechatFormRef.value) {
      await wechatFormRef.value.validate()
    }
    
    // 保存设置到localStorage
    const paymentConfig = {
      alipay: alipaySettings,
      wechat: wechatSettings,
      other: otherSettings,
      general: generalSettings,
      updateTime: new Date().toISOString()
    }
    
    localStorage.setItem('payment_settings', JSON.stringify(paymentConfig))
    
    // 触发自定义事件通知其他组件支付设置已更新
    window.dispatchEvent(new CustomEvent('payment-settings-updated', {
      detail: paymentConfig
    }))
    
    ElMessage.success('支付设置保存成功')
    
  } catch (error) {
    ElMessage.error('请完善必填信息')
  } finally {
    saving.value = false
  }
}

const testAlipayConnection = async () => {
  testingAlipay.value = true
  
  try {
    // 模拟测试支付宝连接
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (alipaySettings.appId && alipaySettings.privateKey) {
      ElMessage.success('支付宝连接测试成功')
    } else {
      ElMessage.error('支付宝配置不完整')
    }
  } finally {
    testingAlipay.value = false
  }
}

const testWechatConnection = async () => {
  testingWechat.value = true
  
  try {
    // 模拟测试微信支付连接
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (wechatSettings.appId && wechatSettings.mchId && wechatSettings.apiKey) {
      ElMessage.success('微信支付连接测试成功')
    } else {
      ElMessage.error('微信支付配置不完整')
    }
  } finally {
    testingWechat.value = false
  }
}

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('payment_settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      Object.assign(alipaySettings, settings.alipay || {})
      Object.assign(wechatSettings, settings.wechat || {})
      Object.assign(otherSettings, settings.other || {})
      Object.assign(generalSettings, settings.general || {})
    }
  } catch (error) {
    console.error('加载支付设置失败:', error)
  }
}

const loadPaymentStats = () => {
  try {
    // 从订单数据中计算支付统计
    const orders = JSON.parse(localStorage.getItem('all_orders') || '[]')
    const today = new Date().toDateString()
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    
    let todayOrders = 0
    let todayAmount = 0
    let monthOrders = 0
    let monthAmount = 0
    
    orders.forEach(order => {
      if (order.status === 'completed' && order.paymentTime) {
        const orderDate = new Date(order.paymentTime)
        
        // 今日统计
        if (orderDate.toDateString() === today) {
          todayOrders++
          todayAmount += order.totalAmount || 0
        }
        
        // 本月统计
        if (orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear) {
          monthOrders++
          monthAmount += order.totalAmount || 0
        }
      }
    })
    
    paymentStats.todayOrders = todayOrders
    paymentStats.todayAmount = todayAmount
    paymentStats.monthOrders = monthOrders
    paymentStats.monthAmount = monthAmount
    
  } catch (error) {
    console.error('加载支付统计失败:', error)
  }
}

onMounted(() => {
  loadSettings()
  loadPaymentStats()
})
</script>

<style lang="scss" scoped>
.payment-settings {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .payment-form {
    .form-tip {
      color: #909399;
      font-size: 12px;
      margin-left: 8px;
    }
  }
  
  .test-section {
    margin-top: 20px;
    text-align: center;
    
    .test-buttons {
      .el-button {
        margin: 0 8px;
      }
    }
  }
}
</style>