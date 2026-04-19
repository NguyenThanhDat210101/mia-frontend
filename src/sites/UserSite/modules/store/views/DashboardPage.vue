<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../store/order.store'
import { useToast } from '@/composables/useToast'
import { RoutePath } from '@/router/types'
import Btn from '@/components/atoms/Btn.vue'
import StatsCards from '@/components/molecules/StatsCards.vue'
import SearchBar from '@/components/molecules/SearchBar.vue'
import OrdersList from '@/components/molecules/OrdersList.vue'

const router = useRouter()
const orderStore = useOrderStore()
const toast = useToast()

const tableFilter = ref<number | string>('')
const phoneFilter = ref('')
const statusFilter = ref<'all' | 'pending' | 'completed' | 'cancelled'>('all')
const dateFilter = ref(new Date().toISOString().substr(0, 10))
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null)

const isLoading = computed(() => orderStore.loading)

const fetchOrders = async () => {
  const table_number = tableFilter.value ? Number(tableFilter.value) : undefined
  const phone = phoneFilter.value || undefined
  const date = dateFilter.value || undefined
  await orderStore.fetchOrders({ table_number, phone, date })
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

const handleStatsClick = (status: 'all' | 'pending' | 'completed' | 'cancelled') => {
  statusFilter.value = status
}

onMounted(() => {
  fetchOrders()
  refreshInterval.value = setInterval(fetchOrders, 60000)
})

onUnmounted(() => {
  if (refreshInterval.value) clearInterval(refreshInterval.value)
})

const todayStats = computed(() => {
  return orderStore.orders.reduce((acc, order) => {
    acc.total++
    if (order.status === 'pending') acc.pending++
    if (order.status === 'completed') {
      acc.completed++
      acc.revenue += (order.total_amount || 0)
    }
    if (order.status === 'cancelled') acc.cancelled++
    return acc
  }, { total: 0, pending: 0, completed: 0, cancelled: 0, revenue: 0 })
})

const clearFilters = () => {
  tableFilter.value = ''
  phoneFilter.value = ''
  dateFilter.value = new Date().toISOString().substr(0, 10)
  statusFilter.value = 'all'
  fetchOrders()
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Tổng quan</h1>
        <p class="text-sm text-slate-500 dark:text-gray-400 font-medium">Quản lý đơn hàng và bán hàng</p>
      </div>
      <div class="flex items-center gap-2">
        <Btn color="primary" variant="outlined" icon="mdi-coffee-outline" rounded="lg" size="small" @click="router.push(RoutePath.StoreProducts)">
          Sản phẩm
        </Btn>
        <Btn color="primary" icon="mdi-plus" rounded="lg" size="small" @click="router.push(RoutePath.StoreOrder)">
          Tạo Order
        </Btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <StatsCards 
      :stats="todayStats" 
      @click:total="handleStatsClick('all')"
      @click:pending="handleStatsClick('pending')"
      @click:completed="handleStatsClick('completed')"
      @click:revenue="router.push(RoutePath.ReportDetail)"
    />

    <!-- Search Bar -->
    <SearchBar
      v-model:dateFilter="dateFilter"
      v-model:tableFilter="tableFilter"
      v-model:phoneFilter="phoneFilter"
      :loading="isLoading"
      @refresh="fetchOrders"
      @clear="clearFilters"
    />

    <!-- Orders List -->
    <OrdersList
      :orders="filteredOrders"
      :loading="isLoading"
      @update-status="handleStatusUpdate"
    />
  </div>
</template>