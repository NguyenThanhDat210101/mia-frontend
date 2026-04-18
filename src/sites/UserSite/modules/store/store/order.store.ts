import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, CreateOrderRequest } from '../types'
import apiClient from '@/core/api/client'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchOrders() {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<{ data: Order[] }>('/orders')
      orders.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      console.error('Failed to fetch orders', err)
    } finally {
      loading.value = false
    }
  }

  async function createOrder(orderRequest: CreateOrderRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post<{ data: Order }>('/orders', orderRequest)
      const newOrder = response.data.data
      orders.value.unshift(newOrder)
      return newOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create order'
      console.error('Failed to create order', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder
  }
})
