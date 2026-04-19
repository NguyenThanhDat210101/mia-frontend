import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Plan } from '../types'
import apiClient from '@/core/api/client'
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store'

export const useSubscriptionStore = defineStore('subscription', () => {
  const plans = ref<Plan[]>([])
  const loading = ref(false)
  const slugDescriptions = ref<Record<string, string>>({
    'free': 'Trải nghiệm đầy đủ tính năng trong 1 tháng',
    'monthly': 'Thanh toán linh hoạt từng tháng',
    'quarterly': 'Chống gián đoạn, tiết kiệm hơn',
    'yearly': 'Đầu tư dài hạn, tối ưu mọi chi phí'
  })

  async function fetchPlans() {
    loading.value = true
    try {
      const response = await apiClient.get<{ success: boolean; data: Plan[] }>('/plans')
      if (response.data?.data) {
        plans.value = response.data.data
      }
    } catch (error) {
      console.error('Failed to fetch plans', error)
    } finally {
      loading.value = false
    }
  }

  async function subscribePlan(data: { plan_id: number; payment_gateway: string }) {
    try {
      const response = await apiClient.post('/plans/subscribe', data)
      
      if (response.data?.data?.plan) {
        const authStore = useAuthStore()
        authStore.setActivePlan(response.data.data.plan)
      }
      
      return response.data
    } catch (error) {
      console.error('Failed to subscribe plan', error)
      throw error
    }
  }

  return {
    plans,
    loading,
    slugDescriptions,
    fetchPlans,
    subscribePlan
  }
})
