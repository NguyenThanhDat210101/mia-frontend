<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useOrderStore } from '../store/order.store'
import type { Order } from '../types'
import Card from '@/components/atoms/Card.vue'
import Btn from '@/components/atoms/Btn.vue'
import Icon from '@/components/atoms/Icon.vue'
import Input from '@/components/atoms/Input.vue'
import Chip from '@/components/atoms/Chip.vue'
import Divider from '@/components/atoms/Divider.vue'
import Alert from '@/components/atoms/Alert.vue'

const orderStore = useOrderStore()
const tableFilter = ref<number | string>('')
const statusFilter = ref<'all' | 'pending' | 'completed' | 'cancelled'>('pending')
const refreshInterval = ref<any>(null)

const fetchOrders = async () => {
  const params: any = { store_id: 1 } // Set your store_id here
  if (tableFilter.value) params.table_number = Number(tableFilter.value)
  await orderStore.fetchOrders(params)
}

const filteredOrders = computed(() => {
  return orderStore.orders.filter(order => {
    if (statusFilter.value === 'all') return true
    return order.status === statusFilter.value
  })
})

const handleStatusUpdate = async (orderId: number, status: 'completed' | 'cancelled') => {
  try {
    await orderStore.updateOrderStatus(orderId, status)
  } catch (error) {
    alert('Không thể cập nhật trạng thái đơn hàng')
  }
}

onMounted(() => {
  fetchOrders()
  // Auto refresh every 60 seconds
  refreshInterval.value = setInterval(fetchOrders, 60000)
})

onUnmounted(() => {
  if (refreshInterval.value) clearInterval(refreshInterval.value)
})

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
</script>

<template>
  <div class="px-4 py-8 max-w-7xl mx-auto space-y-8">
    <!-- Header & Filters -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">Quản lý Đơn hàng</h1>
        <p class="text-slate-500 font-medium">Theo dõi và hoàn thành đơn hàng tại bàn</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="w-32">
          <Input v-model="tableFilter" placeholder="Số bàn..." icon="mdi-table-chair" @input="fetchOrders" />
        </div>
        <Btn variant="tonal" color="primary" icon="mdi-refresh" :loading="orderStore.loading" @click="fetchOrders">Làm mới</Btn>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
      <Btn 
        v-for="status in (['pending', 'completed', 'cancelled', 'all'] as const)" 
        :key="status"
        :variant="statusFilter === status ? 'elevated' : 'text'"
        :color="statusFilter === status ? 'primary' : 'default'"
        size="small"
        rounded="xl"
        class="min-w-[100px]"
        @click="statusFilter = status"
      >
        {{ status === 'all' ? 'Tất cả' : status === 'pending' ? 'Đang chờ' : status === 'completed' ? 'Xong' : 'Đã hủy' }}
      </Btn>
    </div>

    <!-- Orders Grid -->
    <div v-if="filteredOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="order in filteredOrders" 
        :key="order.id" 
        border 
        class="flex flex-col h-full hover:shadow-xl transition-all duration-300"
      >
        <div class="p-6 flex-1 space-y-4">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                {{ order.table_number }}
              </div>
              <div>
                <h3 class="font-black text-lg">Bàn số {{ order.table_number }}</h3>
                <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">{{ formatTime(order.created_at) }}</p>
              </div>
            </div>
            <Chip :color="getStatusColor(order.status)" size="small" class="font-black uppercase tracking-tighter">
              {{ order.status }}
            </Chip>
          </div>

          <Divider />

          <div class="space-y-3">
            <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-md font-bold text-xs">{{ item.quantity }}x</span>
                <span class="font-medium text-slate-700 dark:text-gray-300">{{ item.name || 'Sản phẩm' }}</span>
              </div>
              <span class="font-bold">{{ item.subtotal?.toLocaleString() }}đ</span>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 rounded-b-3xl">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Tổng cộng</span>
            <span class="text-lg font-black text-primary">{{ order.total_amount?.toLocaleString() }}đ</span>
          </div>
          
          <div v-if="order.status === 'pending'" class="flex gap-2">
            <Btn block variant="tonal" color="error" size="small" @click="handleStatusUpdate(order.id!, 'cancelled')">HỦY</Btn>
            <Btn block color="primary" size="small" @click="handleStatusUpdate(order.id!, 'completed')">HOÀN THÀNH</Btn>
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
      <div class="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-4xl">
        <Icon icon="mdi-tray-full" />
      </div>
      <p class="font-bold text-lg text-slate-500">Không có đơn hàng nào</p>
    </div>
  </div>
</template>
