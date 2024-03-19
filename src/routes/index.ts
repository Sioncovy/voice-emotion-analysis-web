// vue-router
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    children: [
      {
        path: '/:id',
        name: 'NewUpload',
        component: () => import('../pages/NewUpload.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
