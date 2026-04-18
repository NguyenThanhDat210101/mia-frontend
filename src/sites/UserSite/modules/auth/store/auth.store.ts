import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginResponse, LoginCredentials, RegisterCredentials, RegisterResponse } from '../types'
import apiClient, { setAccessToken } from '@/core/api/client'
import { RoleName } from '@/core/enums/role.enum'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isInitialized = ref(false)
  
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
    } catch (error) {
      // Không có session hợp lệ hoặc refresh_token hết hạn
      user.value = null
      token.value = null
      setAccessToken(null)
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
    try {
      await apiClient.post('/auth/logout')
    } finally {
      user.value = null
      token.value = null
      setAccessToken(null)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isSetupRequired,
    isInitialized,
    init,
    login,
    register,
    logout
  }
})
