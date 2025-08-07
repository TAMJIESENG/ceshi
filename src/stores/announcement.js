import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref([])
  const loading = ref(false)

  const fetchAnnouncements = async () => {
    try {
      loading.value = true
      const allAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
      announcements.value = allAnnouncements.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      return { success: true }
    } catch (error) {
      return { success: false, message: '获取公告失败' }
    } finally {
      loading.value = false
    }
  }

  const createAnnouncement = async (announcementData) => {
    try {
      const allAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
      
      const newAnnouncement = {
        id: Date.now(),
        title: announcementData.title,
        content: announcementData.content,
        type: announcementData.type || 'info', // info, warning, success, error
        priority: announcementData.priority || 'normal', // high, normal, low
        status: 'published',
        showOnHome: announcementData.showOnHome || false,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
        author: announcementData.author || 'admin'
      }
      
      allAnnouncements.unshift(newAnnouncement)
      localStorage.setItem('all_announcements', JSON.stringify(allAnnouncements))
      
      announcements.value.unshift(newAnnouncement)
      
      return { success: true, message: '公告创建成功', data: newAnnouncement }
    } catch (error) {
      return { success: false, message: '创建公告失败' }
    }
  }

  const updateAnnouncement = async (id, announcementData) => {
    try {
      const allAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
      const announcementIndex = allAnnouncements.findIndex(a => a.id === id)
      
      if (announcementIndex === -1) {
        return { success: false, message: '公告不存在' }
      }
      
      allAnnouncements[announcementIndex] = {
        ...allAnnouncements[announcementIndex],
        title: announcementData.title,
        content: announcementData.content,
        type: announcementData.type,
        priority: announcementData.priority,
        showOnHome: announcementData.showOnHome,
        updateTime: new Date().toLocaleString('zh-CN')
      }
      
      localStorage.setItem('all_announcements', JSON.stringify(allAnnouncements))
      
      // 更新本地状态
      const localIndex = announcements.value.findIndex(a => a.id === id)
      if (localIndex !== -1) {
        announcements.value[localIndex] = allAnnouncements[announcementIndex]
      }
      
      return { success: true, message: '公告更新成功' }
    } catch (error) {
      return { success: false, message: '更新公告失败' }
    }
  }

  const deleteAnnouncement = async (id) => {
    try {
      const allAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
      const filteredAnnouncements = allAnnouncements.filter(a => a.id !== id)
      
      localStorage.setItem('all_announcements', JSON.stringify(filteredAnnouncements))
      
      // 更新本地状态
      announcements.value = announcements.value.filter(a => a.id !== id)
      
      return { success: true, message: '公告删除成功' }
    } catch (error) {
      return { success: false, message: '删除公告失败' }
    }
  }

  const getHomeAnnouncements = () => {
    const allAnnouncements = JSON.parse(localStorage.getItem('all_announcements') || '[]')
    return allAnnouncements
      .filter(a => a.showOnHome && a.status === 'published')
      .sort((a, b) => {
        // 按优先级排序：high > normal > low
        const priorityOrder = { high: 3, normal: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        // 相同优先级按时间排序
        return new Date(b.createTime) - new Date(a.createTime)
      })
  }

  const getAnnouncementTypeColor = (type) => {
    const colorMap = {
      info: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      error: '#f56c6c'
    }
    return colorMap[type] || '#409eff'
  }

  const getAnnouncementTypeText = (type) => {
    const textMap = {
      info: '通知',
      success: '成功',
      warning: '警告',
      error: '错误'
    }
    return textMap[type] || '通知'
  }

  const getPriorityText = (priority) => {
    const textMap = {
      high: '高',
      normal: '普通',
      low: '低'
    }
    return textMap[priority] || '普通'
  }

  return {
    announcements,
    loading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getHomeAnnouncements,
    getAnnouncementTypeColor,
    getAnnouncementTypeText,
    getPriorityText
  }
})