import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store'
import { RouteName, RoutePath } from '@/router/types'
import { RoleName } from '@/core/enums/role.enum'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // User Site Routes
    {
      path: RoutePath.Home,
      component: () => import('@/core/layouts/MainLayout.vue'),
      children: [
        {
          path: RoutePath.Home,
          name: RouteName.Home,
          component: () => import('@/sites/UserSite/modules/landing/views/HomePage.vue')
        },
        {
          path: RoutePath.SignIn,
          name: RouteName.SignIn,
          component: () => import('@/sites/UserSite/modules/auth/views/SignInPage.vue')
        },
        {
          path: RoutePath.SignUp,
          name: RouteName.SignUp,
          component: () => import('@/sites/UserSite/modules/auth/views/SignUpPage.vue')
        },
        {
          path: RoutePath.VerifyOtp,
          name: RouteName.VerifyOtp,
          component: () => import('@/sites/UserSite/modules/auth/views/OtpVerifyPage.vue')
        },
        {
          path: RoutePath.Dashboard,
          name: RouteName.Dashboard,
          component: () => import('@/sites/UserSite/modules/store/views/DashboardPage.vue')
        },
        {
          path: RoutePath.StoreProducts,
          name: RouteName.StoreProducts,
          component: () => import('@/sites/UserSite/modules/store/views/ProductsPage.vue')
        },
        {
          path: RoutePath.StoreOrder,
          name: RouteName.StoreOrder,
          component: () => import('@/sites/UserSite/modules/store/views/OrderPage.vue')
        },
        {
          path: RoutePath.Pricing,
          name: RouteName.Pricing,
          component: () => import('@/sites/UserSite/modules/subscription/views/PricingPage.vue')
        },
        {
          path: RoutePath.MomoPayment,
          name: RouteName.MomoPayment,
          component: () => import('@/sites/UserSite/modules/subscription/views/MomoPaymentPage.vue')
        },
        {
          path: RoutePath.ReportDetail,
          name: RouteName.ReportDetail,
          component: () => import('@/sites/UserSite/modules/report/views/ReportPage.vue')
        },
        {
          path: RoutePath.SetupShifts,
          name: RouteName.SetupShifts,
          component: () => import('@/sites/UserSite/modules/shift/views/SetWorkingHoursPage.vue')
        },
        {
          path: RoutePath.Settings,
          name: RouteName.Settings,
          component: () => import('@/sites/UserSite/modules/settings/views/SettingsPage.vue')
        }
      ]
    },

    // Admin Site Routes
    {
      path: RoutePath.Admin,
      component: () => import('@/sites/AdminSite/layouts/AdminLayout.vue'),
      children: [
        {
          path: RoutePath.AdminDashboard,
          name: RouteName.AdminDashboard,
          component: () => import('@/sites/AdminSite/modules/dashboard/views/DashboardPage.vue')
        },
        {
          path: RoutePath.AdminStores,
          name: RouteName.AdminStores,
          component: () => import('@/sites/AdminSite/modules/store/views/StoreListPage.vue')
        },
        {
          path: RoutePath.AdminUsers,
          name: RouteName.AdminUsers,
          component: () => import('@/sites/AdminSite/modules/user/views/UserListPage.vue')
        },
        {
          path: RoutePath.AdminSubscriptions,
          name: RouteName.AdminSubscriptions,
          component: () => import('@/sites/AdminSite/modules/subscription/views/SubscriptionPage.vue')
        },
        {
          path: RoutePath.AdminSettings,
          name: RouteName.AdminSettings,
          component: () => import('@/sites/AdminSite/modules/settings/views/SettingsPage.vue')
        }
      ]
    },
    // Redirect /store/orders to Dashboard
    {
      path: '/store/orders',
      redirect: RoutePath.Dashboard
    },
    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: RouteName.NotFound,
      component: () => import('@/core/views/NotFoundPage.vue')
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

  // Admin Route Protection (Chỉ cho phép System Admin)
  if (isAdminRoute) {
    if (!authStore.isAuthenticated) {
      return { name: RouteName.SignIn }
    }
    if (authStore.user?.role?.name !== RoleName.SystemAdmin) {
      // Nếu không phải System Admin mà vào /admin -> Về Dashboard của manager/user
      return { name: RouteName.Dashboard }
    }
  }

  if (!authStore.isAuthenticated && !isPublic) {
    // Nếu chưa đăng nhập và truy cập trang bảo mật -> Về SignIn
    return { name: RouteName.SignIn }
  }

  if (authStore.isAuthenticated && (isAuthPage || to.name === RouteName.Home)) {
    // Nếu đã đăng nhập mà cố vào SignIn/SignUp hoặc Home -> Sang Dashboard
    // Tuy nhiên nếu đang hướng tới Admin thì cứ để đi tiếp
    if (!isAdminRoute) {
        const redirectName = authStore.user?.role?.name === RoleName.SystemAdmin ? RouteName.AdminDashboard : RouteName.Dashboard
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
