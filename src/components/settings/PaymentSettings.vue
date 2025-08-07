<template>
  <div class="payment-settings">
    <div class="section-header">
      <h3>💳 支付设置</h3>
      <p>配置支付方式和相关参数</p>
    </div>
    
    <el-form :model="settings.payment" label-width="140px">
      <el-form-item label="支付方式">
        <el-checkbox-group v-model="settings.payment.methods" @change="updatePaymentMethods">
          <el-checkbox label="alipay">
            <div class="payment-option">
              <span class="payment-logo">💰</span>
              <span>支付宝</span>
            </div>
          </el-checkbox>
          <el-checkbox label="wechat">
            <div class="payment-option">
              <span class="payment-logo">💚</span>
              <span>微信支付</span>
            </div>
          </el-checkbox>
          <el-checkbox label="bank">
            <div class="payment-option">
              <span class="payment-logo">🏦</span>
              <span>银行卡</span>
            </div>
          </el-checkbox>
          <el-checkbox label="crypto">
            <div class="payment-option">
              <span class="payment-logo">₿</span>
              <span>数字货币</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item label="最低充值金额">
        <el-input-number 
          v-model="settings.payment.minAmount" 
          :min="1" 
          :max="10000"
          @change="updateMinAmount"
        />
        <span class="unit">元</span>
      </el-form-item>
      
      <el-form-item label="手续费率">
        <el-slider 
          v-model="settings.payment.feeRate" 
          :min="0" 
          :max="10" 
          :step="0.1"
          show-tooltip
          @change="updateFeeRate"
        />
        <span class="fee-preview">{{ settings.payment.feeRate }}%</span>
      </el-form-item>
      
      <el-form-item label="自动确认订单">
        <el-switch 
          v-model="settings.payment.autoConfirm" 
          @change="updateAutoConfirm"
          active-text="启用"
          inactive-text="手动"
        />
        <div class="setting-hint">支付成功后自动确认订单并发货</div>
      </el-form-item>
      
      <el-form-item label="支付超时时间">
        <el-select v-model="settings.payment.timeout" @change="updatePaymentTimeout">
          <el-option label="5分钟" value="300" />
          <el-option label="15分钟" value="900" />
          <el-option label="30分钟" value="1800" />
          <el-option label="1小时" value="3600" />
        </el-select>
        <div class="setting-hint">超时未支付的订单将被自动取消</div>
      </el-form-item>
      
      <el-form-item label="支付统计">
        <div class="payment-stats">
          <div class="stat-item">
            <span class="stat-label">今日交易</span>
            <span class="stat-value">¥{{ paymentStats.todayAmount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">成功率</span>
            <span class="stat-value">{{ paymentStats.successRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总手续费</span>
            <span class="stat-value">¥{{ paymentStats.totalFee }}</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const paymentStats = reactive({
  todayAmount: '12,586.00',
  successRate: 98.5,
  totalFee: '1,258.60'
})

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
</script>

<style lang="scss" scoped>
.payment-settings {
  .section-header {
    margin-bottom: 30px;
    
    h3 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 20px;
    }
    
    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }

  .payment-option {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .payment-logo {
      font-size: 20px;
    }
  }

  .payment-stats {
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

  .setting-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    .payment-stats {
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>