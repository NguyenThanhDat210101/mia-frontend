import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProfileUpdateRequest, StoreUpdateRequest, PaymentSettingsRequest } from '../types'
import apiClient from '@/core/api/client'
import { useAuthStore } from '../../auth/store/auth.store'

interface StoreProfile {
  id: number;
  name: string;
  address?: string;
  prefecture?: string;
  city?: string;
  phone?: string;
  email?: string;
  description?: string;
  avatar?: string;
  timezone?: string;
  opening_hours?: Array<{ day: string; open: string; close: string }>;
  is_active: boolean;
}

interface PaymentConfig {
  gateway: string;
  is_enabled: boolean;
  config: Record<string, unknown>;
}

export const useSettingsStore = defineStore('settings', () => {
  const loading = ref(false)
  const authStore = useAuthStore()
  const profile = ref<StoreProfile | null>(null)
  const paymentConfigs = ref<PaymentConfig[]>([])

  const tabs = ref([
    { id: 'profile', title: 'Cá nhân', icon: 'mdi-account-circle' },
    { id: 'store', title: 'Cửa hàng', icon: 'mdi-storefront' },
    { id: 'payment', title: 'Thanh toán', icon: 'mdi-credit-card' },
    { id: 'security', title: 'Bảo mật', icon: 'mdi-shield-lock' },
    { id: 'preferences', title: 'Tùy chỉnh', icon: 'mdi-tune' }
  ])

  async function fetchProfile() {
    loading.value = true
    try {
      const response = await apiClient.get<{ data: StoreProfile }>('/profile')
      profile.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: ProfileUpdateRequest) {
    loading.value = true
    try {
      const response = await apiClient.put<{ data: StoreProfile }>('/profile', data)
      profile.value = response.data.data
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

  async function fetchStoreProfile(storeId: number) {
    loading.value = true
    try {
      const response = await apiClient.get<{ data: StoreProfile }>(`/v1/stores/${storeId}/profile`)
      profile.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch store profile:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateStore(data: StoreUpdateRequest) {
    loading.value = true
    try {
      const storeId = authStore.user?.store?.id
      if (!storeId) throw new Error('Store not found')
      const response = await apiClient.put<{ data: StoreProfile }>(`/v1/stores/${storeId}/profile`, data)
      profile.value = response.data.data
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

  async function fetchPaymentConfigs() {
    loading.value = true
    try {
      const response = await apiClient.get<{ data: PaymentConfig[] }>('/v1/my/payment-configs')
      paymentConfigs.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch payment configs:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentMethods(data: PaymentSettingsRequest) {
    loading.value = true
    try {
      const response = await apiClient.put<{ data: PaymentConfig[] }>('/v1/my/payment-configs', {
        configs: data.gates
      })
      paymentConfigs.value = response.data.data
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
    profile,
    paymentConfigs,
    tabs,
    fetchProfile,
    updateProfile,
    fetchStoreProfile,
    updateStore,
    fetchPaymentConfigs,
    updatePaymentMethods
  }
})
