<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../store/order.store'
import { useToast } from '@/composables/useToast'
import { RoutePath } from '@/router/types'
import Card from '@/components/atoms/Card.vue'
import Btn from '@/components/atoms/Btn.vue'
import Icon from '@/components/atoms/Icon.vue'
import Input from '@/components/atoms/Input.vue'
import InputDate from '@/components/atoms/InputDate.vue'
import Chip from '@/components/atoms/Chip.vue'
import Divider from '@/components/atoms/Divider.vue'
import Skeleton from '@/components/atoms/Skeleton.vue'

const router = useRouter()
const orderStore = useOrderStore()
const toast = useToast()
const tableFilter = ref<number | string>('')
const statusFilter = ref<'all' | 'pending' | 'completed' | 'cancelled'>('pending')
const dateFilter = ref(new Date().toISOString().substr(0, 10))
const refreshInterval = ref<any>(null)

const isLoading = computed(() => orderStore.loading)

const fetchOrders = async () => {
  const table_number = tableFilter.value ? Number(tableFilter.value) : undefined
  const date = dateFilter.value || undefined

  await orderStore.fetchOrders({ table_number, date })
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
    toast.error('Không thể cập nhật trạng thái đơn hàng')
  }
}

onMounted(() => {
  fetchOrders()
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Hoàn thành'
    case 'cancelled': return 'Đã hủy'
    case 'pending': return 'Đang chờ'
    default: return status
  }
}

const todayStats = computed(() => {
  const orders = orderStore.orders
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount || 0), 0)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <Btn
          variant="flat"
          color="default"
          rounded="lg"
          class="!p-2 shrink-0"
          @click="router.push(RoutePath.Dashboard)"
        >
          <Icon icon="mdi-arrow-left" size="large" />
        </Btn>
        <div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-1">
            Quản lý Đơn hàng
          </h1>
          <p class="text-slate-500 dark:text-gray-400 font-medium text-sm">
            Theo dõi và quản lý đơn hàng tại bàn
          </p>
        </div>
      </div>
      <Btn color="primary" icon="mdi-plus" rounded="xl" @click="router.push(RoutePath.StoreOrder)">
        Tạo Order
      </Btn>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card variant="flat" border class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon icon="mdi-receipt" color="primary" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Tổng đơn</p>
            <p class="text-xl font-black text-slate-900 dark:text-white">{{ todayStats.total }}</p>
          </div>
        </div>
      </Card>
      <Card variant="flat" border class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Icon icon="mdi-clock-outline" color="warning" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Đang chờ</p>
            <p class="text-xl font-black text-warning">{{ todayStats.pending }}</p>
          </div>
        </div>
      </Card>
      <Card variant="flat" border class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Icon icon="mdi-check-circle-outline" color="success" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Hoàn thành</p>
            <p class="text-xl font-black text-success">{{ todayStats.completed }}</p>
          </div>
        </div>
      </Card>
      <Card variant="flat" border class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Icon icon="mdi-currency-usd" color="secondary" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Doanh thu</p>
            <p class="text-xl font-black text-secondary">{{ todayStats.revenue.toLocaleString() }}đ</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Filters -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <!-- Date & Table Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <InputDate v-model="dateFilter" @update:model-value="fetchOrders" />
        <div class="w-28">
          <Input 
            v-model="tableFilter" 
            placeholder="Bàn..." 
            icon="mdi-table-chair" 
            @input="fetchOrders" 
          />
        </div>
        <Btn 
          variant="tonal" 
          color="primary" 
          icon="mdi-refresh" 
          :loading="isLoading" 
          @click="fetchOrders"
          class="!hidden sm:!flex"
        >
          Làm mới
        </Btn>
      </div>

      <!-- Status Tabs -->
      <div class="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
        <Btn 
          v-for="status in (['pending', 'completed', 'cancelled', 'all'] as const)" 
          :key="status"
          :variant="statusFilter === status ? 'elevated' : 'text'"
          :color="statusFilter === status ? 'primary' : 'default'"
          size="small"
          rounded="lg"
          @click="statusFilter = status"
        >
          {{ status === 'all' ? 'Tất cả' : status === 'pending' ? 'Chờ' : status === 'completed' ? 'Xong' : 'Hủy' }}
        </Btn>
      </div>
    </div>

    <!-- Orders List -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton v-for="n in 6" :key="n" type="card" class="h-48 rounded-2xl" />
    </div>

    <div v-else-if="filteredOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card 
        v-for="order in filteredOrders" 
        :key="order.id" 
        variant="flat" 
        border 
        class="rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        <div class="p-5 space-y-4">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary">
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

          <Divider class="!my-3" />

          <!-- Items -->
          <div class="space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded font-bold text-xs text-slate-600 dark:text-gray-300">{{ item.quantity }}</span>
                <span class="text-sm font-medium text-slate-700 dark:text-gray-300 truncate max-w-[120px]">{{ item.name || 'Sản phẩm' }}</span>
              </div>
              <span class="text-sm font-bold text-slate-900 dark:text-white">{{ item.subtotal?.toLocaleString() }}đ</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
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
              @click="handleStatusUpdate(order.id!, 'cancelled')"
            >
              Hủy
            </Btn>
            <Btn 
              color="primary" 
              size="small" 
              rounded="lg"
              @click="handleStatusUpdate(order.id!, 'completed')"
            >
              Xong
            </Btn>
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 flex flex-col items-center justify-center text-slate-400">
      <div class="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Icon icon="mdi-tray-full" size="large" />
      </div>
      <p class="font-bold text-lg text-slate-500 dark:text-gray-400 mb-2">Không có đơn hàng nào</p>
      <p class="text-sm text-slate-400 dark:text-gray-500">Chọn ngày khác để xem đơn hàng</p>
    </div>
  </div>
</template>