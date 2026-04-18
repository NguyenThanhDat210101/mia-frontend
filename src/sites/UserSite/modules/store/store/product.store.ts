import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types'
import type { Category, CategoryCreateRequest } from '@/sites/UserSite/modules/store/types/category'
import apiClient from '@/core/api/client'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const categories = ref<string[]>(["Tất cả", "Coffee", "Tea", "Juice", "Bakery"])
  const apiCategories = ref<Category[]>([])
  const labeledCategories = ref<{ label: string; value: string }[]>([
    { label: 'Cà phê', value: 'Coffee' },
    { label: 'Trà', value: 'Tea' },
    { label: 'Nước ép', value: 'Juice' },
    { label: 'Bánh ngọt', value: 'Bakery' },
  ])

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

  async function fetchCategories() {
    try {
      const response = await apiClient.get<{ data: Category[] }>('/categories')
      apiCategories.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch categories', error)
    }
  }

  async function createCategory(data: CategoryCreateRequest) {
    try {
      const response = await apiClient.post<{ data: Category }>('/categories', data)
      apiCategories.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create category', error)
      throw error
    }
  }

  async function updateCategory(id: number, data: Partial<CategoryCreateRequest>) {
    try {
      const response = await apiClient.put<{ data: Category }>(`/categories/${id}`, data)
      const index = apiCategories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        apiCategories.value[index] = response.data.data
      }
      return response.data.data
    } catch (error) {
      console.error('Failed to update category', error)
      throw error
    }
  }

  async function deleteCategory(id: number) {
    try {
      await apiClient.delete(`/categories/${id}`)
      apiCategories.value = apiCategories.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Failed to delete category', error)
      throw error
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
    categories,
    apiCategories,
    labeledCategories,
    fetchProducts,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    addProduct
  }
})
