import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store, StoreFilter, StoreResponse, SingleStoreResponse } from '../interfaces'
import apiClient from '@/core/api/client'

export const useAdminStoreStore = defineStore('admin-store', () => {
  const stores = ref<Store[]>([])
  const loading = ref(false)
  const filters = ref<StoreFilter>({
    search: '',
    status: 'all'
  })

  async function fetchStores() {
    loading.value = true
    try {
      const response = await apiClient.get<StoreResponse>('/admin/stores')
      stores.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch stores:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id: number, isActive: boolean) {
    loading.value = true
    try {
      const response = await apiClient.patch<SingleStoreResponse>(`/admin/stores/${id}/status`, {
        is_active: isActive
      })
      // Update local state
      const index = stores.value.findIndex(s => s.id === id)
      if (index !== -1) {
        stores.value[index] = response.data.data
      }
    } catch (error) {
      console.error('Failed to toggle store status:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteStore(id: number) {
    loading.value = true
    try {
      await apiClient.delete(`/admin/stores/${id}`)
      stores.value = stores.value.filter(s => s.id !== id)
    } catch (error) {
      console.error('Failed to delete store:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    stores,
    loading,
    filters,
    fetchStores,
    toggleStatus,
    deleteStore
  }
})
