import { createRouter, createWebHistory } from 'vue-router'
import { readSessionUser } from '../utils/sessionAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const user = readSessionUser()
  if (to.name === 'login' && user) return { path: '/' }
  if (to.meta.public) return true
  if (!user) return { name: 'login', query: { redirect: to.fullPath } }
  return true
})

export default router
