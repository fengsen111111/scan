import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

// ✅ 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('Authorization')
  // 如果没有 token 且目标不是登录页，则跳转到登录页
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next() // 放行
  }
})

export default router
