import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMaintenanceStore } from '@/stores/maintenance'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vip',
    name: 'VipPurchase',
    component: () => import('@/views/VipPurchase.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cards',
    name: 'CardPurchase',
    component: () => import('@/views/CardPurchase.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/Maintenance.vue')
  },
  {
    path: '/security-key-generator',
    name: 'SecurityKeyGenerator',
    component: () => import('@/views/SecurityKeyGenerator.vue')
  },
  {
    path: '/security-verification',
    name: 'SecurityVerification',
    component: () => import('@/views/SecurityVerification.vue')
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: () => import('@/views/Announcements.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/ceshi/'),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const maintenanceStore = useMaintenanceStore()
  
  // 检查维护模式
  const isMaintenanceActive = maintenanceStore.checkMaintenanceMode()
  
  // 如果系统在维护中且用户不是管理员，且不是访问维护页面、管理页面、登录页面、注册页面或安全相关页面
  if (isMaintenanceActive && 
      !userStore.isAdmin && 
      to.name !== 'Maintenance' && 
      to.name !== 'Admin' &&
      to.name !== 'Login' &&
      to.name !== 'Register' &&
      to.name !== 'SecurityKeyGenerator' &&
      to.name !== 'SecurityVerification') {
    next('/maintenance')
    return
  }
  
  // 如果系统不在维护中但访问维护页面，重定向到首页
  if (!isMaintenanceActive && to.name === 'Maintenance') {
    next('/')
    return
  }
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router