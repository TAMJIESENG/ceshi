import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContactStore = defineStore('contact', () => {
  const contacts = ref([])
  const loading = ref(false)

  const submitContact = async (contactData) => {
    try {
      const allContacts = JSON.parse(localStorage.getItem('all_contacts') || '[]')
      
      const newContact = {
        id: Date.now(),
        userId: contactData.userId,
        username: contactData.username,
        email: contactData.email,
        subject: contactData.subject,
        category: contactData.category,
        priority: contactData.priority || 'normal',
        message: contactData.message,
        status: 'pending', // pending, processing, resolved, closed
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
        adminReply: null,
        replyTime: null
      }
      
      allContacts.unshift(newContact)
      localStorage.setItem('all_contacts', JSON.stringify(allContacts))
      
      return { success: true, message: '消息提交成功，我们会尽快回复您', data: newContact }
    } catch (error) {
      return { success: false, message: '提交失败，请稍后重试' }
    }
  }

  const fetchContacts = async (isAdmin = false) => {
    try {
      loading.value = true
      const allContacts = JSON.parse(localStorage.getItem('all_contacts') || '[]')
      
      if (isAdmin) {
        // 管理员可以查看所有联系记录
        contacts.value = allContacts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      } else {
        // 普通用户只能查看自己的联系记录
        const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id
        contacts.value = allContacts
          .filter(contact => contact.userId === userId)
          .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, message: '获取联系记录失败' }
    } finally {
      loading.value = false
    }
  }

  const replyContact = async (contactId, replyData) => {
    try {
      const allContacts = JSON.parse(localStorage.getItem('all_contacts') || '[]')
      const contactIndex = allContacts.findIndex(c => c.id === contactId)
      
      if (contactIndex === -1) {
        return { success: false, message: '联系记录不存在' }
      }
      
      allContacts[contactIndex] = {
        ...allContacts[contactIndex],
        adminReply: replyData.reply,
        replyTime: new Date().toLocaleString('zh-CN'),
        status: replyData.status || 'resolved',
        updateTime: new Date().toLocaleString('zh-CN')
      }
      
      localStorage.setItem('all_contacts', JSON.stringify(allContacts))
      
      // 更新本地状态
      const localIndex = contacts.value.findIndex(c => c.id === contactId)
      if (localIndex !== -1) {
        contacts.value[localIndex] = allContacts[contactIndex]
      }
      
      return { success: true, message: '回复成功' }
    } catch (error) {
      return { success: false, message: '回复失败' }
    }
  }

  const updateContactStatus = async (contactId, status) => {
    try {
      const allContacts = JSON.parse(localStorage.getItem('all_contacts') || '[]')
      const contactIndex = allContacts.findIndex(c => c.id === contactId)
      
      if (contactIndex === -1) {
        return { success: false, message: '联系记录不存在' }
      }
      
      allContacts[contactIndex].status = status
      allContacts[contactIndex].updateTime = new Date().toLocaleString('zh-CN')
      
      localStorage.setItem('all_contacts', JSON.stringify(allContacts))
      
      // 更新本地状态
      const localIndex = contacts.value.findIndex(c => c.id === contactId)
      if (localIndex !== -1) {
        contacts.value[localIndex].status = status
        contacts.value[localIndex].updateTime = allContacts[contactIndex].updateTime
      }
      
      return { success: true, message: '状态更新成功' }
    } catch (error) {
      return { success: false, message: '状态更新失败' }
    }
  }

  const getStatusType = (status) => {
    const typeMap = {
      pending: 'warning',
      processing: 'primary',
      resolved: 'success',
      closed: 'info'
    }
    return typeMap[status] || 'info'
  }

  const getStatusText = (status) => {
    const textMap = {
      pending: '待处理',
      processing: '处理中',
      resolved: '已解决',
      closed: '已关闭'
    }
    return textMap[status] || '未知'
  }

  const getPriorityType = (priority) => {
    const typeMap = {
      low: 'info',
      normal: 'primary',
      high: 'warning',
      urgent: 'danger'
    }
    return typeMap[priority] || 'primary'
  }

  const getPriorityText = (priority) => {
    const textMap = {
      low: '低',
      normal: '普通',
      high: '高',
      urgent: '紧急'
    }
    return textMap[priority] || '普通'
  }

  const getCategoryText = (category) => {
    const textMap = {
      technical: '技术问题',
      account: '账户问题',
      payment: '支付问题',
      card: '卡密问题',
      suggestion: '意见建议',
      complaint: '投诉举报',
      other: '其他'
    }
    return textMap[category] || '其他'
  }

  return {
    contacts,
    loading,
    submitContact,
    fetchContacts,
    replyContact,
    updateContactStatus,
    getStatusType,
    getStatusText,
    getPriorityType,
    getPriorityText,
    getCategoryText
  }
})