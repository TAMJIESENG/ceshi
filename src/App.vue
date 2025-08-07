<template>
  <div id="app">
    <router-view />
    <DevTools v-if="showDevTools" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import DevTools from '@/components/DevTools.vue'

const userStore = useUserStore()

// 只有开发环境且用户是管理员才显示开发工具
const showDevTools = computed(() => {
  return import.meta.env.DEV && userStore.isAdmin
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>