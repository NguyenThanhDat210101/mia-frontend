import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProfileUpdateRequest, StoreUpdateRequest, PaymentSettingsRequest } from '../types'
import apiClient from '@/core/api/client'
import { useAuthStore } from '../../auth/store/auth.store'

export const useSettingsStore = defineStore('settings', () => {
  const loading = ref(false)
  const authStore = useAuthStore()

  const tabs = ref([
    { id: 'profile', title: 'Cá nhân', icon: 'mdi-account-circle' },
    { id: 'store', title: 'Cửa hàng', icon: 'mdi-storefront' },
    { id: 'payment', title: 'Thanh toán', icon: 'mdi-credit-card' },
    { id: 'security', title: 'Bảo mật', icon: 'mdi-shield-lock' },
    { id: 'preferences', title: 'Tùy chỉnh', icon: 'mdi-tune' }
  ])

  async function updateProfile(data: ProfileUpdateRequest) {
    loading.value = true
    try {
      const response = await apiClient.patch('/profile', data)
      // Update global auth store with new user data
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...response.data.data }
      }
      return response.data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateStore(data: StoreUpdateRequest) {
    loading.value = true
    try {
      const response = await apiClient.patch('/my-store', data)
      // Update global auth store with new store data
      if (authStore.user?.store) {
        authStore.user.store = { ...authStore.user.store, ...response.data.data }
      }
      return response.data
    } catch (error) {
      console.error('Failed to update store:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentMethods(data: PaymentSettingsRequest) {
    loading.value = true
    try {
      const response = await apiClient.patch('/my-store/payment-methods', data)
      return response.data
    } catch (error) {
      console.error('Failed to update payment methods:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    tabs,
    updateProfile,
    updateStore,
    updatePaymentMethods
  }
})
