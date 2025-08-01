import { createRouter,  createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/toupiao.vue')
  },
  {
    path: '/H5long',
    name: 'H5long',
    component: () => import('../views/H5long.vue')
  },
  {
    path: '/ani',
    name: 'ani',
    component: () => import('../views/ani.vue')
  },
  {
    path: '/toupiao',
    name: 'toupiao',
    component: () => import('../views/toupiao.vue')
  },
  // {
  //   path: '/newH5',
  //   name: 'new',
  //   component: () => import('../views/newH5.vue')
  // },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router
