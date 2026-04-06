import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types'
import apiClient from '../../../core/api/client'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)

  async function fetchProducts() {
    loading.value = true
    try {
      const response = await apiClient.get<{ data: Product[] }>('/products')
      products.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch products', error)
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product: Partial<Product>) {
    try {
      const response = await apiClient.post<{ data: Product }>('/products', product)
      products.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Failed to add product', error)
      throw error
    }
  }

  return {
    products,
    loading,
    fetchProducts,
    addProduct
  }
})
