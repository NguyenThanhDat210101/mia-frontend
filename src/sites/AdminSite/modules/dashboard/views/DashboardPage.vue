<script setup lang="ts">
import Card from '@/components/atoms/Card.vue'
import Btn from '@/components/atoms/Btn.vue'
import Icon from '@/components/atoms/Icon.vue'
import { useDashboard } from '../hooks/useDashboard'

const { stats, activities, refreshStats } = useDashboard()
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-black tracking-tight">Tổng quan hệ thống</h2>
        <p class="text-slate-500 dark:text-gray-400 mt-2 font-medium">Chào mừng trở lại, Administrator.</p>
      </div>
      <Btn variant="tonal" color="primary" prepend-icon="mdi-refresh" @click="refreshStats">Làm mới dữ liệu</Btn>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="stat in stats" :key="stat.label" class="!border-none bg-white dark:bg-neutral-900 shadow-sm p-6 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        <div class="flex justify-between items-start">
          <div :class="`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color}`">
            <Icon :icon="stat.icon" size="large" />
          </div>
          <span :class="['text-xs font-bold px-2 py-1 rounded-full', stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500']">
            {{ stat.trend }}
          </span>
        </div>
        <div class="mt-6">
          <p class="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="text-3xl font-black mt-1">{{ stat.value }}</p>
        </div>
      </Card>
    </div>

    <!-- Charts/Table Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card class="lg:col-span-2 !border-none bg-white dark:bg-neutral-900 p-8 min-h-[400px]">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-black text-xl">Biểu đồ tăng trưởng</h3>
          <div class="flex gap-2">
            <Btn variant="tonal" size="small" color="primary">Tháng này</Btn>
            <Btn variant="text" size="small">Năm nay</Btn>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center h-full text-slate-300 dark:text-neutral-700">
          <Icon icon="mdi-chart-line" size="x-large" />
          <p class="mt-4 font-bold">Dữ liệu biểu đồ đang được tải...</p>
        </div>
      </Card>

      <Card class="!border-none bg-white dark:bg-neutral-900 p-8">
        <h3 class="font-black text-xl mb-6">Hoạt động mới nhất</h3>
        <div class="space-y-6">
          <div v-for="activity in activities" :key="activity.id" class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <div>
              <p class="text-sm font-bold">{{ activity.title }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        <Btn block variant="text" class="mt-8 text-primary font-bold">Xem tất cả</Btn>
      </Card>
    </div>
  </div>
</template>
