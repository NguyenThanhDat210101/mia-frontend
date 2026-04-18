<script setup lang="ts">
import Card from '@/components/atoms/Card.vue'
import Btn from '@/components/atoms/Btn.vue'
import { useAdminStoreStore } from '../store/store.store'

const storeStore = useAdminStoreStore()
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-black tracking-tight">Quản lý cửa hàng</h2>
        <p class="text-slate-500 dark:text-gray-400 mt-2 font-medium">Xem và quản lý tất cả các cửa hàng trong hệ thống.</p>
      </div>
      <Btn color="primary" prepend-icon="mdi-plus">Thêm cửa hàng mới</Btn>
    </div>

    <Card class="!border-none bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      <div v-if="storeStore.stores.length === 0" class="p-12 text-center text-slate-400">
        Chưa có dữ liệu cửa hàng.
      </div>
      <table v-else class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
          <tr>
            <th class="px-6 py-4">Tên cửa hàng</th>
            <th class="px-6 py-4">Chủ sở hữu</th>
            <th class="px-6 py-4">Trạng thái</th>
            <th class="px-6 py-4">Ngày tạo</th>
            <th class="px-6 py-4">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="store in storeStore.stores" :key="store.id" class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-bold">{{ store.name }}</td>
            <td class="px-6 py-4 text-sm">{{ store.owner_name }}</td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 rounded-full text-[10px] font-bold uppercase', store.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500']">
                {{ store.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">{{ store.created_at }}</td>
            <td class="px-6 py-4">
              <Btn variant="text" size="small" color="primary">Chi tiết</Btn>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>
