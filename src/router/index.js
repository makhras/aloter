import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Pixi from '../components/Pixi.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/pixi', name: 'Pixi', component: Pixi },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router