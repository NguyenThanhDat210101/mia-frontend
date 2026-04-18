import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store'
import { RouteName } from '@/router/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // User Site Routes
    {
      path: '/',
      component: () => import('@/core/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: RouteName.Home,
          component: () => import('@/sites/UserSite/modules/landing/views/HomePage.vue')
        },
        {
          path: 'signin',
          name: RouteName.SignIn,
          component: () => import('@/sites/UserSite/modules/auth/views/SignInPage.vue')
        },
        {
          path: 'signup',
          name: RouteName.SignUp,
          component: () => import('@/sites/UserSite/modules/auth/views/SignUpPage.vue')
        },
        {
          path: 'verify-otp',
          name: RouteName.VerifyOtp,
          component: () => import('@/sites/UserSite/modules/auth/views/OtpVerifyPage.vue')
        },
        {
          path: 'dashboard',
          name: RouteName.Dashboard,
          component: () => import('@/sites/UserSite/modules/store/views/DashboardPage.vue')
        },
        {
          path: 'store/products',
          name: RouteName.StoreProducts,
          component: () => import('@/sites/UserSite/modules/store/views/ProductsPage.vue')
        },
        {
          path: 'store/order',
          name: RouteName.StoreOrder,
          component: () => import('@/sites/UserSite/modules/store/views/OrderPage.vue')
        },
        {
          path: 'pricing',
          name: RouteName.Pricing,
          component: () => import('@/sites/UserSite/modules/subscription/views/PricingPage.vue')
        },
        {
          path: 'payment/momo',
          name: RouteName.MomoPayment,
          component: () => import('@/sites/UserSite/modules/subscription/views/MomoPaymentPage.vue')
        },
        {
          path: 'report',
          name: RouteName.ReportDetail,
          component: () => import('@/sites/UserSite/modules/report/views/ReportPage.vue')
        },
        {
          path: 'setup-shifts',
          name: RouteName.SetupShifts,
          component: () => import('@/sites/UserSite/modules/shift/views/SetWorkingHoursPage.vue')
        }
      ]
    },

    // Admin Site Routes
    {
      path: '/admin',
      component: () => import('@/sites/AdminSite/layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: RouteName.AdminDashboard,
          component: () => import('@/sites/AdminSite/modules/dashboard/views/DashboardPage.vue')
        },
        {
          path: 'stores',
          name: RouteName.AdminStores,
          component: () => import('@/sites/AdminSite/modules/store/views/StoreListPage.vue')
        },
        {
          path: 'users',
          name: RouteName.AdminUsers,
          component: () => import('@/sites/AdminSite/modules/user/views/UserListPage.vue')
        },
        {
          path: 'subscriptions',
          name: RouteName.AdminSubscriptions,
          component: () => import('@/sites/AdminSite/modules/subscription/views/SubscriptionPage.vue')
        },
        {
          path: 'settings',
          name: RouteName.AdminSettings,
          component: () => import('@/sites/AdminSite/modules/settings/views/SettingsPage.vue')
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
  const isAdminRoute = to.path.startsWith('/admin')

  // Khôi phục session nếu cần (chỉ chạy 1 lần khi load trang)
  await authStore.init()

  // Simple Admin Check (Có thể mở rộng sau)
  if (isAdminRoute && !authStore.isAuthenticated) {
    return { name: RouteName.SignIn }
  }

  if (!authStore.isAuthenticated && !isPublic) {
    // Nếu chưa đăng nhập và truy cập trang bảo mật -> Về SignIn
    return { name: RouteName.SignIn }
  }

  if (authStore.isAuthenticated && (isAuthPage || to.name === RouteName.Home)) {
    // Nếu đã đăng nhập mà cố vào SignIn/SignUp hoặc Home -> Sang Dashboard
    // Tuy nhiên nếu đang hướng tới Admin thì cứ để đi tiếp
    if (!isAdminRoute) {
        const redirectName = authStore.user?.role_id === 1 ? RouteName.AdminDashboard : RouteName.Dashboard
        return { name: redirectName }
    }
  }

  // Luồng Onboarding: Bắt buộc set Shift
  if (authStore.isSetupRequired && to.name !== RouteName.SetupShifts && !isAdminRoute) {
    console.warn('Onboarding: Shifts configuration required.')
    return { name: RouteName.SetupShifts }
  }
})

export default router
