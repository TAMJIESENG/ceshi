import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const maintenanceStatus = reactive({
    isActive: false,
    title: '',
    reason: '',
    description: '',
    contact: '',
    startTime: null,
    estimatedDuration: 0
  })

  const checkMaintenanceMode = () => {
    const savedStatus = localStorage.getItem('maintenance_status')
    if (savedStatus) {
      const status = JSON.parse(savedStatus)
      Object.assign(maintenanceStatus, status)
      return status.isActive
    }
    return false
  }

  const getMaintenanceInfo = () => {
    return { ...maintenanceStatus }
  }

  const isMaintenanceActive = () => {
    return maintenanceStatus.isActive
  }

  const startMaintenance = (config) => {
    maintenanceStatus.isActive = true
    maintenanceStatus.title = config.title || '系统维护中'
    maintenanceStatus.reason = config.reason || 'upgrade'
    maintenanceStatus.description = config.description || '系统正在进行维护升级'
    maintenanceStatus.contact = config.contact || ''
    maintenanceStatus.startTime = new Date().toISOString()
    maintenanceStatus.estimatedDuration = config.estimatedDuration || 60

    // 保存到localStorage
    localStorage.setItem('maintenance_status', JSON.stringify(maintenanceStatus))
    return true
  }

  const stopMaintenance = () => {
    Object.assign(maintenanceStatus, {
      isActive: false,
      title: '',
      reason: '',
      description: '',
      contact: '',
      startTime: null,
      estimatedDuration: 0
    })

    // 清除localStorage
    localStorage.removeItem('maintenance_status')
    return true
  }

  return {
    maintenanceStatus,
    checkMaintenanceMode,
    getMaintenanceInfo,
    isMaintenanceActive,
    startMaintenance,
    stopMaintenance
  }
})