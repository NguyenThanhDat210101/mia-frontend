import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginResponse, LoginCredentials, RegisterCredentials, RegisterResponse } from '../types'
import apiClient, { setAccessToken } from '@/core/api/client'
import { RoleName } from '@/core/enums/role.enum'

const STORAGE_KEY = 'active_plan'

const getStoredPlan = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const setStoredPlan = (plan: { id: number; name: string; slug: string } | null) => {
  try {
    if (plan) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isInitialized = ref(false)
  const activePlan = ref(getStoredPlan())
  
  const isAuthenticated = computed(() => !!token.value)

  const isSetupRequired = computed(() => {
    // Chỉ yêu cầu setup cho Store Manager (Role ID = 1 hoặc theo logic Role của bạn)
    // Và khi Store chưa hoàn tất thiết lập
    return isAuthenticated.value && 
           user.value?.role?.name === RoleName.SystemAdmin && 
           user.value?.store && 
           !user.value.store.is_setup_completed
  })

  async function init() {
    if (isInitialized.value) return
    
    try {
      // Thử lấy access_token mới từ refresh_token trong cookie (trình duyệt tự gửi)
      const response = await apiClient.post<LoginResponse>('/auth/refresh')
      const { access_token, user: userData } = response.data.data
      
      user.value = userData
      token.value = access_token
      setAccessToken(access_token)
      
      if (userData.store?.active_plan) {
        activePlan.value = userData.store.active_plan
        setStoredPlan(userData.store.active_plan)
      }
    } catch (error) {
      // Không có session hợp lệ hoặc refresh_token hết hạn
      user.value = null
      token.value = null
      setAccessToken(null)
      activePlan.value = null
      setStoredPlan(null)
    } finally {
      isInitialized.value = true
    }
  }

  async function login(credentials: LoginCredentials) {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
      const { access_token, user: userData } = response.data.data
      
      user.value = userData
      token.value = access_token
      setAccessToken(access_token)
      
      if (userData.store?.active_plan) {
        activePlan.value = userData.store.active_plan
        setStoredPlan(userData.store.active_plan)
      }
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', credentials)
      const { access_token, user: userData } = response.data.data
      
      user.value = userData
      token.value = access_token
      setAccessToken(access_token)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    setAccessToken(null)
    activePlan.value = null
    setStoredPlan(null)
    
    apiClient.post('/auth/logout').catch(() => {})
  }

  function setActivePlan(plan: { id: number; name: string; slug: string }) {
    activePlan.value = plan
    setStoredPlan(plan)
  }

  return {
    user,
    token,
    activePlan,
    isAuthenticated,
    isSetupRequired,
    isInitialized,
    init,
    login,
    register,
    logout,
    setActivePlan
  }
})
