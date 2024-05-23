// vue-router
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../Layout.vue'),
    children: [
      {
        path: '/:id',
        name: 'NewUpload',
        component: () => import('../pages/NewUpload.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../pages/About.vue')
      },
      {
        path: '/analysis',
        name: 'Analysis',
        component: () => import('../pages/Analysis/index.vue')
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/Register.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
