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
          name: 'Home',
          component: () => import('../modules/landing/views/HomePage.vue')
        },
        {
          path: 'signin',
          name: 'SignIn',
          component: () => import('../modules/auth/views/SignInPage.vue')
        },
        {
          path: 'signup',
          name: 'SignUp',
          component: () => import('../modules/auth/views/SignUpPage.vue')
        },
        {
          path: 'verify-otp',
          name: 'VerifyOtp',
          component: () => import('../modules/auth/views/OtpVerifyPage.vue')
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../modules/store/views/DashboardPage.vue')
        },
        {
          path: 'store/products',
          name: 'StoreProducts',
          component: () => import('../modules/store/views/ProductsPage.vue')
        },
        {
          path: 'store/order',
          name: 'StoreOrder',
          component: () => import('../modules/store/views/OrderPage.vue')
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
