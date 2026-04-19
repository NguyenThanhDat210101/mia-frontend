import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, CreateOrderRequest } from '../types'
import apiClient from '@/core/api/client'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  
  const storeOptions = ref([
    { label: 'Chi nhánh Quận 1', value: 'q1' },
    { label: 'Chi nhánh Thủ Đức', value: 'td' },
    { label: 'Kho Tổng Hóc Môn', value: 'hm' },
  ])
  const error = ref<string | null>(null)

  async function fetchOrders(params?: { store_id?: number, table_number?: number, phone?: string, date?: string, limit?: number }) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<{ data: Order[] }>('/orders', { params })
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

  async function updateOrderStatus(id: number, status: 'pending' | 'completed' | 'cancelled') {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put<{ data: Order }>(`/orders/${id}`, { status })
      const updatedOrder = response.data.data
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
      return updatedOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update order status'
      console.error('Failed to update order status', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    storeOptions,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus
  }
})
