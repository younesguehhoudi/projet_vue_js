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
      path: '/mars/:roverName',
      name: 'mars',
      component: () => import('../views/MarsView.vue'),
    },
    {
      path: '/favoris',
      name: 'favoris',
      component: () => import('../views/FavoriteView.vue'),
    },
  ],
})

export default router
