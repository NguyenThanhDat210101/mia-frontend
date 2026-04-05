import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../core/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../modules/store/views/DashboardPage.vue')
        },
        {
          path: 'pricing',
          name: 'Pricing',
          // Route level code-splitting
          component: () => import('../modules/subscription/views/PricingPage.vue')
        },
        {
          path: 'payment/momo',
          name: 'MomoPayment',
          component: () => import('../modules/subscription/views/MomoPaymentPage.vue')
        }
      ]
    }
  ]
})

export default router
