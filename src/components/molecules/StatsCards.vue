<script setup lang="ts">
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'

defineProps<{
  stats: {
    total: number
    pending: number
    completed: number
    cancelled: number
    revenue: number
  }
}>()

const emit = defineEmits<{
  (e: 'click:total'): void
  (e: 'click:pending'): void
  (e: 'click:completed'): void
  (e: 'click:cancelled'): void
  (e: 'click:revenue'): void
}>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <Card 
      variant="flat" 
      border 
      class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 cursor-pointer hover:border-primary/50 transition-colors"
      @click="emit('click:total')"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon icon="mdi-receipt" color="primary" />
        </div>
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Tổng đơn</p>
          <p class="text-xl font-black text-slate-900 dark:text-white">{{ stats.total }}</p>
        </div>
      </div>
    </Card>

    <Card 
      variant="flat" 
      border 
      class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 cursor-pointer hover:border-warning/50 transition-colors"
      @click="emit('click:pending')"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
          <Icon icon="mdi-clock-outline" color="warning" />
        </div>
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Đang chờ</p>
          <p class="text-xl font-black text-warning">{{ stats.pending }}</p>
        </div>
      </div>
    </Card>

    <Card 
      variant="flat" 
      border 
      class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 cursor-pointer hover:border-success/50 transition-colors"
      @click="emit('click:completed')"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
          <Icon icon="mdi-check-circle-outline" color="success" />
        </div>
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Hoàn thành</p>
          <p class="text-xl font-black text-success">{{ stats.completed }}</p>
        </div>
      </div>
    </Card>

    <Card 
      variant="flat" 
      border 
      class="p-4 rounded-2xl bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 cursor-pointer hover:border-secondary/50 transition-colors"
      @click="emit('click:revenue')"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
          <Icon icon="mdi-currency-usd" color="secondary" />
        </div>
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Doanh thu</p>
          <p class="text-xl font-black text-secondary">{{ stats.revenue.toLocaleString() }}đ</p>
        </div>
      </div>
    </Card>
  </div>
</template>