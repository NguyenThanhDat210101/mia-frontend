<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import Card from '@/components/atoms/Card.vue'
import Btn from '@/components/atoms/Btn.vue'
import Input from '@/components/atoms/Input.vue'
import Icon from '@/components/atoms/Icon.vue'
import Chip from '@/components/atoms/Chip.vue'
import Switch from '@/components/atoms/Switch.vue'
import Skeleton from '@/components/atoms/Skeleton.vue'
import Divider from '@/components/atoms/Divider.vue'
import { useAdminStoreStore } from '../store/store.store'
import { storeToRefs } from 'pinia'

const storeStore = useAdminStoreStore()
const { stores, loading, filters } = storeToRefs(storeStore)

const deleteDialog = ref(false)
const storeToDelete = ref<{ id: number; name: string } | null>(null)

onMounted(() => {
  storeStore.fetchStores()
})

const filteredStores = computed(() => {
  return stores.value.filter(store => {
    const search = filters.value.search.toLowerCase()
    const matchesSearch = store.name.toLowerCase().includes(search) ||
                         store.manager?.name.toLowerCase().includes(search) ||
                         store.email?.toLowerCase().includes(search)
    
    const matchesStatus = filters.value.status === 'all' || 
                         (filters.value.status === 'active' && store.is_active) ||
                         (filters.value.status === 'inactive' && !store.is_active)
    
    return matchesSearch && matchesStatus
  })
})

const confirmDelete = (id: number, name: string) => {
  storeToDelete.value = { id, name }
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (storeToDelete.value) {
    try {
      await storeStore.deleteStore(storeToDelete.value.id)
      deleteDialog.value = false
      storeToDelete.value = null
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa cửa hàng.')
    }
  }
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý cửa hàng</h2>
        <p class="text-slate-500 dark:text-gray-400 mt-1 font-medium italic text-sm">Xem và quản lý tất cả các cửa hàng trong hệ thống.</p>
      </div>
      <Btn color="primary" prepend-icon="mdi-plus" rounded="xl" shadow>Thêm cửa hàng mới</Btn>
    </div>

    <!-- Filters -->
    <Card class="p-4 border-none shadow-sm bg-white dark:bg-neutral-900">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <Input 
            v-model="filters.search" 
            placeholder="Tìm kiếm theo tên, manager, email..." 
            prepend-inner-icon="mdi-magnify"
            class="!bg-slate-50 dark:!bg-white/5"
          />
        </div>
        <div class="flex gap-2">
          <Btn 
            v-for="status in ['all', 'active', 'inactive']" 
            :key="status"
            :variant="filters.status === status ? 'elevated' : 'text'"
            :color="filters.status === status ? 'primary' : 'default'"
            size="small"
            rounded="lg"
            class="capitalize"
            @click="filters.status = status"
          >
            {{ status === 'all' ? 'Tất cả' : status === 'active' ? 'Hoạt động' : 'Tạm ngưng' }}
          </Btn>
        </div>
      </div>
    </Card>

    <!-- Table -->
    <Card class="!border-none bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading && stores.length === 0" class="p-6">
        <Skeleton v-for="n in 5" :key="n" type="list-item" class="mb-4 last:mb-0" />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredStores.length === 0" class="p-20 text-center flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400">
          <Icon icon="mdi-store-off-outline" size="large" />
        </div>
        <p class="text-slate-500 font-medium">Không tìm thấy dữ liệu cửa hàng phù hợp.</p>
        <Btn v-if="filters.search || filters.status !== 'all'" variant="text" color="primary" @click="filters.search = ''; filters.status = 'all'">Xóa bộ lọc</Btn>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100 dark:border-white/5">
            <tr>
              <th class="px-6 py-4">Tên cửa hàng</th>
              <th class="px-6 py-4">Manager / Liên hệ</th>
              <th class="px-6 py-4">Gói dịch vụ</th>
              <th class="px-6 py-4 text-center">Trạng thái</th>
              <th class="px-6 py-4">Ngày tạo</th>
              <th class="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/5">
            <tr v-for="store in filteredStores" :key="store.id" class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                    {{ store.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white">{{ store.name }}</div>
                    <div class="text-[10px] text-slate-400 uppercase font-medium">{{ store.type || 'Chưa phân loại' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ store.manager?.name || '---' }}</div>
                <div class="text-xs text-slate-400">{{ store.email || store.manager?.email }}</div>
              </td>
              <td class="px-6 py-4">
                <Chip 
                  v-if="store.active_plan" 
                  color="primary" 
                  variant="tonal" 
                  size="small" 
                  class="font-bold text-[10px]"
                >
                  {{ store.active_plan.name }}
                </Chip>
                <span v-else class="text-xs text-slate-300 italic">No plan</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center">
                  <Switch 
                    :model-value="store.is_active" 
                    class="!m-0" 
                    :loading="loading"
                    @update:model-value="storeStore.toggleStatus(store.id, $event)"
                  />
                </div>
              </td>
              <td class="px-6 py-4 text-xs text-slate-500">
                {{ new Date(store.created_at).toLocaleDateString('vi-VN') }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Btn variant="text" icon="mdi-pencil" size="small" color="default" class="hover:!text-primary" />
                  <Btn variant="text" icon="mdi-delete" size="small" color="default" class="hover:!text-red-500" @click="confirmDelete(store.id, store.name)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Delete Dialog -->
    <div v-if="deleteDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card class="max-w-md w-full p-8 text-center rounded-3xl animate-in zoom-in duration-300">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="mdi-alert-circle" size="large" />
        </div>
        <h3 class="text-2xl font-black mb-2 text-slate-900 dark:text-white">Xóa cửa hàng?</h3>
        <p class="text-slate-500 dark:text-gray-400 mb-8 leading-relaxed">
          Bạn có chắc chắn muốn xóa cửa hàng <strong>{{ storeToDelete?.name }}</strong>? Thao tác này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.
        </p>
        <div class="flex gap-4">
          <Btn block variant="tonal" color="default" rounded="xl" size="large" @click="deleteDialog = false">Hủy</Btn>
          <Btn block color="primary" class="!bg-red-600 !border-red-600" rounded="xl" size="large" :loading="loading" @click="handleDelete">Xác nhận xóa</Btn>
        </div>
      </Card>
    </div>
  </div>
</template>
