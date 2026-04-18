import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'
import apiClient from '@/core/api/client'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      const response = await apiClient.get<{ data: User[] }>('/users')
      users.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(id: number) {
    try {
      const response = await apiClient.get<{ data: User }>(`/users/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch user', error)
      throw error
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    fetchUser
  }
})
