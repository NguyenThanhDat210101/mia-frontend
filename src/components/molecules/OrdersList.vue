<script setup lang="ts">
import type { Order } from '@/sites/UserSite/modules/store/types'
import Card from '@/components/atoms/Card.vue'
import Btn from '@/components/atoms/Btn.vue'
import Icon from '@/components/atoms/Icon.vue'
import Chip from '@/components/atoms/Chip.vue'
import Divider from '@/components/atoms/Divider.vue'
import Skeleton from '@/components/atoms/Skeleton.vue'

defineProps<{
  orders: Order[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update-status', orderId: number, status: 'completed' | 'cancelled'): void
}>()

const formatTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    case 'pending': return 'warning'
    default: return 'default'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Hoàn thành'
    case 'cancelled': return 'Đã hủy'
    case 'pending': return 'Đang chờ'
    default: return status
  }
}
</script>

<template>
  <!-- Loading Skeletons -->
  <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <Skeleton v-for="n in 8" :key="n" type="card" class="h-44 rounded-xl" />
  </div>

  <!-- Empty State -->
  <div v-else-if="orders.length === 0" class="py-12 flex flex-col items-center justify-center text-slate-400">
    <div class="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
      <Icon icon="mdi-tray-full" />
    </div>
    <p class="font-medium text-slate-500 dark:text-gray-400">Không có đơn hàng nào</p>
  </div>

  <!-- Orders Grid -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <Card 
      v-for="order in orders" 
      :key="order.id" 
      variant="flat" 
      border 
      class="rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div class="p-4 space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary">
              {{ order.table_number }}
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white">Bàn {{ order.table_number }}</h3>
              <p class="text-xs text-slate-500 dark:text-gray-400 font-medium">{{ formatTime(order.created_at) }}</p>
            </div>
          </div>
          <Chip 
            :color="getStatusColor(order.status)" 
            size="small" 
            variant="tonal"
            class="font-bold text-xs"
          >
            {{ getStatusLabel(order.status) }}
          </Chip>
        </div>

        <Divider class="!my-2" />

        <!-- Items -->
        <div class="space-y-2">
          <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded font-bold text-xs text-slate-600 dark:text-gray-300">{{ item.quantity }}</span>
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 truncate max-w-[140px]">{{ item.name || 'Sản phẩm' }}</span>
            </div>
            <span class="text-sm font-bold text-slate-900 dark:text-white">{{ item.subtotal?.toLocaleString() }}đ</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Tổng</p>
          <p class="text-lg font-black text-primary">{{ order.total_amount?.toLocaleString() }}đ</p>
        </div>
        <div v-if="order.status === 'pending'" class="flex gap-2" @click.stop>
          <Btn 
            variant="tonal" 
            color="error" 
            size="small" 
            rounded="lg"
            @click="emit('update-status', order.id!, 'cancelled')"
          >
            Hủy
          </Btn>
          <Btn 
            color="primary" 
            size="small" 
            rounded="lg"
            @click="emit('update-status', order.id!, 'completed')"
          >
            Xong
          </Btn>
        </div>
      </div>
    </Card>
  </div>
</template>