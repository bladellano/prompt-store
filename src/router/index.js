import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blocos',
      name: 'blocos',
      component: () => import('@/views/BlocosView.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/TagsView.vue')
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('@/views/ConfiguracoesView.vue')
    }
  ]
})

export default router
