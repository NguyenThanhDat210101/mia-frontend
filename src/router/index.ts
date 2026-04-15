import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/auth/store/auth.store'
import { RouteName } from './types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../core/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: RouteName.Home,
          component: () => import('../modules/landing/views/HomePage.vue')
        },
        {
          path: 'signin',
          name: RouteName.SignIn,
          component: () => import('../modules/auth/views/SignInPage.vue')
        },
        {
          path: 'signup',
          name: RouteName.SignUp,
          component: () => import('../modules/auth/views/SignUpPage.vue')
        },
        {
          path: 'verify-otp',
          name: RouteName.VerifyOtp,
          component: () => import('../modules/auth/views/OtpVerifyPage.vue')
        },
        {
          path: 'dashboard',
          name: RouteName.Dashboard,
          component: () => import('../modules/store/views/DashboardPage.vue')
        },
        {
          path: 'store/products',
          name: RouteName.StoreProducts,
          component: () => import('../modules/store/views/ProductsPage.vue')
        },
        {
          path: 'store/order',
          name: RouteName.StoreOrder,
          component: () => import('../modules/store/views/OrderPage.vue')
        },
        {
          path: 'pricing',
          name: RouteName.Pricing,
          // Route level code-splitting
          component: () => import('../modules/subscription/views/PricingPage.vue')
        },
        {
          path: 'payment/momo',
          name: RouteName.MomoPayment,
          component: () => import('../modules/subscription/views/MomoPaymentPage.vue')
        },
        {
          path: 'report',
          name: RouteName.ReportDetail,
          component: () => import('../modules/report/views/ReportPage.vue')
        },
        {
          path: 'setup-shifts',
          name: RouteName.SetupShifts,
          component: () => import('../modules/shift/views/SetWorkingHoursPage.vue')
        }
      ]
    }
  ]
})

// Navigation Guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  // Danh sách các route công khai
  const publicPages: string[] = [
    RouteName.Home, 
    RouteName.SignIn, 
    RouteName.SignUp, 
    RouteName.VerifyOtp, 
    RouteName.ForgotPassword, 
    RouteName.ResetPassword, 
    RouteName.ChangePassword, 
    RouteName.Pricing
  ]
  const authPages: string[] = [RouteName.SignIn, RouteName.SignUp]
  
  const isPublic = publicPages.includes(to.name as string)
  const isAuthPage = authPages.includes(to.name as string)

  // Khôi phục session nếu cần (chỉ chạy 1 lần khi load trang)
  await authStore.init()

  if (!authStore.isAuthenticated && !isPublic) {
    // Nếu chưa đăng nhập và truy cập trang bảo mật -> Về SignIn
    return { name: RouteName.SignIn }
  }

  if (authStore.isAuthenticated && isAuthPage) {
    // Nếu đã đăng nhập mà cố vào SignIn/SignUp -> Sang Dashboard
    return { name: RouteName.Dashboard }
  }

  // Luồng Onboarding: Bắt buộc set Shift
  if (authStore.isSetupRequired && to.name !== RouteName.SetupShifts) {
    console.warn('Onboarding: Shifts configuration required.')
    return { name: RouteName.SetupShifts }
  }
})

export default router
