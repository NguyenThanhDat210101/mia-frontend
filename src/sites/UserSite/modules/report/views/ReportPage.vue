<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/atoms/Card.vue';
import Icon from '@/components/atoms/Icon.vue';
import Btn from '@/components/atoms/Btn.vue';
import Chip from '@/components/atoms/Chip.vue';
import Skeleton from '@/components/atoms/Skeleton.vue';
import InputDate from '@/components/atoms/InputDate.vue';
import Select from '@/components/atoms/Select.vue';
import { useReportStore } from '../store/report.store';
import { useOrderStore } from '../../store/order.store';
import { storeToRefs } from 'pinia';
import type { ReportPeriod } from '../types';

const router = useRouter();
const reportStore = useReportStore();
const orderStore = useOrderStore();
const { periodOptions } = storeToRefs(reportStore);
const { storeOptions: rawStoreOptions } = storeToRefs(orderStore);

const storeOptions = computed(() => [
  { label: 'Tất cả chi nhánh', value: '' },
  ...rawStoreOptions.value
]);

const activePeriod = computed(() => reportStore.filters.period);

function selectPeriod(p: ReportPeriod) {
  reportStore.setPeriod(p);
}

// ─── Chart helpers ─────────────────────────────────────────────────────────
const maxRevenue = computed(() =>
  Math.max(...(reportStore.revenueChart.map((d) => d.revenue) || [1])),
);
const maxOrders = computed(() =>
  Math.max(...(reportStore.hourlyDistribution.map((d) => d.orders) || [1])),
);

function barHeight(value: number, max: number): number {
  return max === 0 ? 0 : Math.round((value / max) * 100);
}

// ─── Formatters ────────────────────────────────────────────────────────────
function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(0) + 'K';
  }
  return value.toLocaleString('vi-VN') + 'đ';
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// ─── Growth badge ──────────────────────────────────────────────────────────
function growthColor(value: number) {
  return value >= 0 ? 'success' : 'error';
}
function growthIcon(value: number) {
  return value >= 0 ? 'mdi-trending-up' : 'mdi-trending-down';
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  reportStore.fetchReport();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

    <!-- ── HEADER ─────────────────────────────────────────────────────────── -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <Btn
          variant="flat"
          color="default"
          rounded="lg"
          class="!p-2 shrink-0"
          @click="router.push('/dashboard')"
        >
          <Icon icon="mdi-arrow-left" size="large" />
        </Btn>
        <div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-1">
            Báo cáo chi tiết
          </h1>
          <p class="text-slate-500 dark:text-gray-400 font-medium text-sm">
            Phân tích doanh thu, đơn hàng và hiệu suất kinh doanh.
          </p>
        </div>
      </div>

      <!-- Export button -->
      <Btn variant="outlined" color="default" rounded="lg" class="shrink-0 gap-2">
        <Icon icon="mdi-download-outline" />
        Xuất báo cáo
      </Btn>
    </div>

    <!-- ── FILTER BAR ─────────────────────────────────────────────────────── -->
    <Card variant="flat" border class="p-4 mb-8 bg-white dark:bg-neutral-900 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Period tabs -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="p in periodOptions"
            :key="p.value"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="
              activePeriod === p.value
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
            "
            @click="selectPeriod(p.value)"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

        <!-- Custom date range -->
        <div class="flex items-center gap-2 flex-wrap">
          <div>
            <label class="block text-xs font-bold text-slate-400 dark:text-gray-500 uppercase mb-1 ml-1">
              Từ ngày
            </label>
            <InputDate
              :model-value="reportStore.filters.startDate"
              @update:model-value="(v) => reportStore.setFilters({ startDate: v, period: 'custom' })"
            />
          </div>
          <div class="mt-5 text-slate-400 dark:text-gray-500 font-bold">—</div>
          <div>
            <label class="block text-xs font-bold text-slate-400 dark:text-gray-500 uppercase mb-1 ml-1">
              Đến ngày
            </label>
            <InputDate
              :model-value="reportStore.filters.endDate"
              @update:model-value="(v) => reportStore.setFilters({ endDate: v, period: 'custom' })"
            />
          </div>
        </div>

        <div class="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

        <!-- Store picker -->
        <div class="min-w-[180px]">
          <label class="block text-xs font-bold text-slate-400 dark:text-gray-500 uppercase mb-1 ml-1">
            Chi nhánh
          </label>
          <Select
            :model-value="reportStore.filters.storeId"
            :options="storeOptions"
            placeholder="Tất cả"
            @update:model-value="(v) => reportStore.setFilters({ storeId: v })"
          />
        </div>
      </div>
    </Card>

    <!-- ── KPI CARDS ──────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <template v-if="reportStore.isLoading">
        <Skeleton v-for="n in 4" :key="n" class="h-36 rounded-2xl" />
      </template>

      <template v-else-if="reportStore.summary">
        <!-- Doanh thu -->
        <Card variant="flat" border class="p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon icon="mdi-cash-multiple" size="text-[90px]" class="text-blue-400" />
          </div>
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 rounded-xl bg-blue-500/10">
              <Icon icon="mdi-cash-multiple" color="primary" size="large" />
            </div>
            <Chip :color="growthColor(reportStore.summary.revenueGrowth)" variant="tonal" size="small">
              <Icon :icon="growthIcon(reportStore.summary.revenueGrowth)" size="small" class="mr-1" />
              {{ Math.abs(reportStore.summary.revenueGrowth) }}%
            </Chip>
          </div>
          <div class="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">
            Doanh thu
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">
            {{ formatCurrency(reportStore.summary.totalRevenue) }}
          </div>
        </Card>

        <!-- Đơn hàng -->
        <Card variant="flat" border class="p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon icon="mdi-receipt-text" size="text-[90px]" class="text-indigo-400" />
          </div>
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 rounded-xl bg-indigo-500/10">
              <Icon icon="mdi-receipt-text" color="secondary" size="large" />
            </div>
            <Chip :color="growthColor(reportStore.summary.ordersGrowth)" variant="tonal" size="small">
              <Icon :icon="growthIcon(reportStore.summary.ordersGrowth)" size="small" class="mr-1" />
              {{ Math.abs(reportStore.summary.ordersGrowth) }}%
            </Chip>
          </div>
          <div class="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">
            Đơn hàng
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">
            {{ reportStore.summary.totalOrders }}
          </div>
        </Card>

        <!-- Khách hàng -->
        <Card variant="flat" border class="p-5 rounded-2xl relative overflow-hidden group hover:border-green-500/40 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon icon="mdi-account-group" size="text-[90px]" class="text-green-400" />
          </div>
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 rounded-xl bg-green-500/10">
              <Icon icon="mdi-account-group" color="success" size="large" />
            </div>
            <Chip :color="growthColor(reportStore.summary.customersGrowth)" variant="tonal" size="small">
              <Icon :icon="growthIcon(reportStore.summary.customersGrowth)" size="small" class="mr-1" />
              {{ Math.abs(reportStore.summary.customersGrowth) }}%
            </Chip>
          </div>
          <div class="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">
            Khách hàng
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">
            {{ reportStore.summary.totalCustomers }}
          </div>
        </Card>

        <!-- Giá trị TB -->
        <Card variant="flat" border class="p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon icon="mdi-cart-arrow-up" size="text-[90px]" class="text-amber-400" />
          </div>
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 rounded-xl bg-amber-500/10">
              <Icon icon="mdi-cart-arrow-up" color="warning" size="large" />
            </div>
            <Chip :color="growthColor(reportStore.summary.avgOrderGrowth)" variant="tonal" size="small">
              <Icon :icon="growthIcon(reportStore.summary.avgOrderGrowth)" size="small" class="mr-1" />
              {{ Math.abs(reportStore.summary.avgOrderGrowth) }}%
            </Chip>
          </div>
          <div class="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">
            Giá trị trung bình
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">
            {{ formatCurrency(reportStore.summary.averageOrderValue) }}
          </div>
        </Card>
      </template>
    </div>

    <!-- ── CHARTS ROW ─────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

      <!-- Revenue Bar Chart (span 2) -->
      <Card variant="flat" border class="xl:col-span-2 p-6 bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">Doanh thu theo ngày</h3>
            <p class="text-sm text-slate-400 dark:text-gray-500 mt-0.5">So sánh doanh thu & đơn hàng</p>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
              Doanh thu
            </span>
            <span class="flex items-center gap-1.5 text-slate-400 dark:text-gray-500">
              <span class="w-3 h-3 rounded-sm bg-indigo-400/50 inline-block" />
              Đơn hàng
            </span>
          </div>
        </div>

        <template v-if="reportStore.isLoading">
          <div class="flex items-end gap-3 h-48">
            <Skeleton v-for="n in 7" :key="n" class="flex-1 rounded-xl" :style="{ height: (40 + n * 10) + '%' }" />
          </div>
        </template>

        <template v-else>
          <div class="flex items-end gap-2 sm:gap-3 h-48">
            <div
              v-for="(point, idx) in reportStore.revenueChart"
              :key="idx"
              class="flex-1 flex flex-col items-center gap-1 group/bar"
            >
              <!-- Tooltip -->
              <div class="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -mt-14 pointer-events-none z-10
                          bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg px-2 py-1.5 whitespace-nowrap shadow-xl">
                <div class="font-bold">{{ formatFullCurrency(point.revenue) }}</div>
                <div class="text-slate-300">{{ point.orders }} đơn</div>
              </div>

              <!-- Revenue bar -->
              <div class="relative w-full flex flex-col justify-end h-full">
                <div
                  class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 group-hover/bar:from-blue-500 group-hover/bar:to-blue-300 transition-all duration-300"
                  :style="{ height: barHeight(point.revenue, maxRevenue) + '%' }"
                />
              </div>
              <span class="text-xs text-slate-400 dark:text-gray-500 font-medium mt-1">{{ point.label }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Hourly Distribution Chart -->
      <Card variant="flat" border class="p-6 bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="mb-6">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">Giờ cao điểm</h3>
          <p class="text-sm text-slate-400 dark:text-gray-500 mt-0.5">Phân bố đơn theo giờ trong ngày</p>
        </div>

        <template v-if="reportStore.isLoading">
          <div class="space-y-2">
            <Skeleton v-for="n in 8" :key="n" class="h-5 rounded-lg" />
          </div>
        </template>

        <template v-else>
          <div class="space-y-2 overflow-y-auto max-h-52 pr-1">
            <div
              v-for="(h, idx) in reportStore.hourlyDistribution"
              :key="idx"
              class="flex items-center gap-3 group/row"
            >
              <span class="text-xs font-semibold text-slate-400 dark:text-gray-500 w-8 shrink-0 text-right">{{ h.hour }}</span>
              <div class="flex-1 h-5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 group-hover/row:from-indigo-400 group-hover/row:to-blue-300 transition-all duration-500"
                  :style="{ width: barHeight(h.orders, maxOrders) + '%' }"
                />
              </div>
              <span class="text-xs font-bold text-slate-600 dark:text-gray-300 w-6 shrink-0">{{ h.orders }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- ── BOTTOM ROW ─────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <!-- Top Products -->
      <Card variant="flat" border class="p-6 bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">Top sản phẩm</h3>
            <p class="text-sm text-slate-400 dark:text-gray-500 mt-0.5">Bán chạy nhất trong kỳ</p>
          </div>
          <Chip variant="tonal" color="primary" size="small">
            <Icon icon="mdi-fire" size="small" class="mr-1" />
            HOT
          </Chip>
        </div>

        <template v-if="reportStore.isLoading">
          <div class="space-y-4">
            <div v-for="n in 5" :key="n" class="flex items-center gap-3">
              <Skeleton class="w-8 h-8 rounded-full" />
              <Skeleton class="flex-1 h-4 rounded-lg" />
              <Skeleton class="w-20 h-4 rounded-lg" />
            </div>
          </div>
        </template>

        <template v-else>
          <div class="space-y-4">
            <div
              v-for="(product, idx) in reportStore.topProducts"
              :key="product.id"
              class="group/item"
            >
              <div class="flex items-center gap-3 mb-1.5">
                <!-- Rank badge -->
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  :class="idx === 0 ? 'bg-yellow-400 text-yellow-900'
                        : idx === 1 ? 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-white'
                        : idx === 2 ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500'"
                >
                  {{ idx + 1 }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {{ product.name }}
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <div class="text-sm font-bold text-slate-900 dark:text-white">
                    {{ formatCurrency(product.revenue) }}
                  </div>
                  <div class="text-xs text-slate-400 dark:text-gray-500">{{ product.quantity }} ly</div>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="ml-10 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-600' : 'bg-blue-400'"
                  :style="{ width: product.percentage + '%' }"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Payment Methods -->
      <Card variant="flat" border class="p-6 bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="mb-6">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">Phương thức thanh toán</h3>
          <p class="text-sm text-slate-400 dark:text-gray-500 mt-0.5">Tỷ lệ phân bổ theo loại</p>
        </div>

        <template v-if="reportStore.isLoading">
          <div class="space-y-5">
            <Skeleton v-for="n in 3" :key="n" class="h-16 rounded-xl" />
          </div>
        </template>

        <template v-else>
          <!-- Donut chart (CSS-only) -->
          <div class="flex items-center justify-center mb-6">
            <div class="relative w-32 h-32">
              <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke-width="3"
                  class="stroke-slate-100 dark:stroke-white/5" />
                <!-- Tiền mặt 53% -->
                <circle cx="18" cy="18" r="15.9" fill="none" stroke-width="3"
                  stroke-dasharray="53 47" stroke-linecap="round"
                  class="stroke-blue-500" />
                <!-- Chuyển khoản 34% -->
                <circle cx="18" cy="18" r="15.9" fill="none" stroke-width="3"
                  stroke-dasharray="34 66" stroke-linecap="round"
                  stroke-dashoffset="-53"
                  class="stroke-indigo-400" />
                <!-- Momo 13% -->
                <circle cx="18" cy="18" r="15.9" fill="none" stroke-width="3"
                  stroke-dasharray="13 87" stroke-linecap="round"
                  stroke-dashoffset="-87"
                  class="stroke-pink-400" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-2xl font-black text-slate-900 dark:text-white">{{ reportStore.summary?.totalOrders }}</span>
                <span class="text-xs text-slate-400 dark:text-gray-500">đơn</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="(pm, idx) in reportStore.paymentMethods"
              :key="idx"
              class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                :class="idx === 0 ? 'bg-blue-500/10' : idx === 1 ? 'bg-indigo-500/10' : 'bg-pink-500/10'"
              >
                <Icon
                  :icon="pm.icon"
                  size="large"
                  :color="idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'pink-lighten-2'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ pm.method }}</div>
                <div class="text-xs text-slate-400 dark:text-gray-500">{{ pm.count }} giao dịch</div>
              </div>
              <div class="text-right shrink-0">
                <div class="text-sm font-bold text-slate-900 dark:text-white">{{ formatCurrency(pm.revenue) }}</div>
                <Chip
                  variant="tonal"
                  :color="idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'primary'"
                  size="small"
                >
                  {{ pm.percentage }}%
                </Chip>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

  </div>
</template>
