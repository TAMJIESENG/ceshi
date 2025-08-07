import { ref, reactive } from 'vue'
import { t, setLanguage, getCurrentLanguage, initLanguage } from '@/utils/i18n'

// 创建响应式的语言状态
const currentLanguage = ref('')
const isReady = ref(false)

// 全局翻译函数
const $t = (key, params) => {
  return t(key, params)
}

// 切换语言
const switchLanguage = (lang) => {
  if (setLanguage(lang)) {
    currentLanguage.value = lang
    return true
  }
  return false
}

// 初始化国际化
const initI18n = (defaultLang = 'zh-CN') => {
  const lang = initLanguage(defaultLang)
  currentLanguage.value = lang
  isReady.value = true
  return lang
}

// Vue插件
export default {
  install(app) {
    // 注册全局属性
    app.config.globalProperties.$t = $t
    app.config.globalProperties.$currentLanguage = currentLanguage
    app.config.globalProperties.$switchLanguage = switchLanguage
    
    // 提供inject/provide
    app.provide('$t', $t)
    app.provide('$currentLanguage', currentLanguage)
    app.provide('$switchLanguage', switchLanguage)
    app.provide('$isI18nReady', isReady)
  }
}

// 导出工具函数
export {
  $t,
  currentLanguage,
  switchLanguage,
  initI18n,
  isReady
}