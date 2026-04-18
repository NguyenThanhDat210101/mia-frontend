import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store, StoreFilter } from '../interfaces'

export const useAdminStoreStore = defineStore('admin-store', () => {
  const stores = ref<Store[]>([
    { id: 1, name: 'Mia Coffee HQ', owner_name: 'Nguyen Van A', email: 'owner@mia.com', status: 'active', created_at: '2026-01-01' },
    { id: 2, name: 'The Loft', owner_name: 'Tran Thi B', email: 'loft@example.com', status: 'pending', created_at: '2026-04-10' },
  ])

  const filters = ref<StoreFilter>({
    search: '',
    status: 'all'
  })

  return {
    stores,
    filters
  }
})
