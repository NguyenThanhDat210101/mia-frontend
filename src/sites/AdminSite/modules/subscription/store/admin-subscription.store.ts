import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Plan, PlanRequest } from '../types'
import apiClient from '@/core/api/client'

export const useAdminSubscriptionStore = defineStore('admin-subscription', () => {
  const plans = ref<Plan[]>([])
  const loading = ref(false)

  async function fetchPlans() {
    loading.value = true
    try {
      const response = await apiClient.get<{ success: boolean; data: Plan[] }>('/admin/plans')
      if (response.data?.data) {
        plans.value = response.data.data
      }
    } catch (error) {
      console.error('Failed to fetch plans', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createPlan(data: PlanRequest) {
    loading.value = true
    try {
      const response = await apiClient.post<{ data: Plan }>('/admin/plans', data)
      if (response.data?.data) {
        plans.value.push(response.data.data)
      }
      return response.data
    } catch (error) {
      console.error('Failed to create plan', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePlan(id: number, data: PlanRequest) {
    loading.value = true
    try {
      const response = await apiClient.put<{ data: Plan }>(`/admin/plans/${id}`, data)
      if (response.data?.data) {
        const index = plans.value.findIndex((p) => p.id === id)
        if (index !== -1) {
          plans.value[index] = response.data.data
        }
      }
      return response.data
    } catch (error) {
      console.error('Failed to update plan', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deletePlan(id: number) {
    loading.value = true
    try {
      await apiClient.delete(`/admin/plans/${id}`)
      plans.value = plans.value.filter((p) => p.id !== id)
    } catch (error) {
      console.error('Failed to delete plan', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    plans,
    loading,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan
  }
})
