import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Plan } from '../types'
import apiClient from '@/core/api/client'

export const useSubscriptionStore = defineStore('subscription', () => {
  const plans = ref<Plan[]>([])
  const loading = ref(false)

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

  async function subscribePlan(data: { store_id: number; plan_id: number; payment_gateway: string }) {
    try {
      const response = await apiClient.post('/plans/subscribe', data)
      return response.data
    } catch (error) {
      console.error('Failed to subscribe plan', error)
      throw error
    }
  }

  return {
    plans,
    loading,
    fetchPlans,
    subscribePlan
  }
})
