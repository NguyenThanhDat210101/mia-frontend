<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Card from '@/components/atoms/Card.vue';
import Icon from '@/components/atoms/Icon.vue';
import Btn from '@/components/atoms/Btn.vue';
import Skeleton from '@/components/atoms/Skeleton.vue';
import InputDate from '@/components/atoms/InputDate.vue';
import Select from '@/components/atoms/Select.vue';
import { useOrderStore } from '../store/order.store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const orderStore = useOrderStore();
const { storeOptions } = storeToRefs(orderStore);

const isLoading = ref(true);
const filterDate = ref(new Date().toISOString().substr(0, 10));
const selectedStore = ref('');

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});

</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black mb-2 text-slate-900 dark:text-white">Tổng quan Cửa hàng</h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium">Chào mừng bạn quay lại hệ thống quản trị Store Manager.</p>
      </div>

      <!-- Quick Filter Demo -->
      <div v-if="!isLoading" class="flex flex-col sm:flex-row gap-3 min-w-[400px]">
        <div class="flex-1">
          <label class="block text-xs font-bold text-slate-400 dark:text-gray-500 uppercase mb-1 ml-1">Ngày báo cáo</label>
          <InputDate v-model="filterDate" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-slate-400 dark:text-gray-500 uppercase mb-1 ml-1">Cửa hàng</label>
          <Select v-model="selectedStore" :options="storeOptions" placeholder="Chọn chi nhánh" />
        </div>
      </div>
    </div>

    <!-- Alert Requirement -->
    <div class="mb-8 p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm flex flex-col md:flex-row items-center gap-4">
      <Icon icon="mdi-alert" color="warning" size="x-large" class="shrink-0"></Icon>
      <div class="flex-1 text-center md:text-left">
        <div class="font-bold text-base text-yellow-700 dark:text-yellow-500">
          Tài khoản chưa có Gói dịch vụ. Vui lòng nâng cấp để mở khóa tính năng.
        </div>
      </div>
      <Btn color="warning" variant="elevated" rounded="lg" @click="router.push('/pricing')">
        XEM BẢNG GIÁ
      </Btn>
    </div>

    <!-- Quick Actions -->
    <div class="mb-10">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
        <Icon icon="mdi-flash" color="warning"></Icon>
        Thao tác nhanh
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="flat" border class="p-6 cursor-pointer hover:border-blue-500/50 transition-all bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 group shadow-sm dark:shadow-none" @click="router.push('/store/order')">
           <Icon icon="mdi-cart-plus" size="large" color="primary" class="mb-4 group-hover:scale-110 transition-transform"></Icon>
           <div class="font-bold text-slate-900 dark:text-white">Màn hình Order (POS)</div>
           <div class="text-xs text-slate-500 dark:text-gray-500 mt-1">Bấm để bắt đầu bán hàng nhanh</div>
        </Card>
        
        <Card variant="flat" border class="p-6 cursor-pointer hover:border-indigo-500/50 transition-all bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 group shadow-sm dark:shadow-none" @click="router.push('/store/products')">
           <Icon icon="mdi-coffee-outline" size="large" color="secondary" class="mb-4 group-hover:scale-110 transition-transform"></Icon>
           <div class="font-bold text-slate-900 dark:text-white">Quản lý Sản phẩm</div>
           <div class="text-xs text-slate-500 dark:text-gray-500 mt-1">Thêm đồ uống, cập nhật giá</div>
        </Card>

        <Card variant="flat" border class="p-6 cursor-pointer hover:border-green-500/50 transition-all bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 group opacity-50 shadow-sm dark:shadow-none">
           <Icon icon="mdi-account-star-outline" size="large" color="success" class="mb-4"></Icon>
           <div class="font-bold text-slate-900 dark:text-white">Khách hàng thân thiết</div>
           <div class="text-xs text-slate-500 dark:text-gray-500 mt-1">Coming soon...</div>
        </Card>

        <Card variant="flat" border class="p-6 cursor-pointer hover:border-pink-500/50 transition-all bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 group shadow-sm dark:shadow-none" @click="router.push('/report')">
           <Icon icon="mdi-chart-line" size="large" color="pink-lighten-2" class="mb-4 group-hover:scale-110 transition-transform"></Icon>
           <div class="font-bold text-slate-900 dark:text-white">Báo cáo chi tiết</div>
           <div class="text-xs text-slate-500 dark:text-gray-500 mt-1">Xem doanh thu &amp; phân tích</div>
        </Card>
      </div>
    </div>

    <!-- Overview Stats -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton v-for="n in 3" :key="n" class="h-44 rounded-2xl" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="flat" border class="p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
           <Icon icon="mdi-currency-usd" size="text-[120px]" class="text-slate-200 dark:text-white"></Icon>
        </div>
        <div class="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-wide mb-2 uppercase">Doanh thu hôm nay</div>
        <div class="text-4xl font-black text-slate-900 dark:text-white">0đ</div>
      </Card>
      
      <Card variant="flat" border class="p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
           <Icon icon="mdi-package-variant" size="text-[120px]" class="text-slate-200 dark:text-white"></Icon>
        </div>
        <div class="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-wide mb-2 uppercase">Đơn hàng mới</div>
        <div class="text-4xl font-black text-slate-900 dark:text-white">0</div>
      </Card>
      
      <Card variant="flat" border class="p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-colors bg-white dark:bg-gray-900 border-slate-200 dark:border-white/5 shadow-md dark:shadow-none">
        <div class="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
           <Icon icon="mdi-account-group" size="text-[120px]" class="text-slate-200 dark:text-white"></Icon>
        </div>
        <div class="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-wide mb-2 uppercase">Khách hàng</div>
        <div class="text-4xl font-black text-slate-900 dark:text-white">0</div>
      </Card>
    </div>
  </div>
</template>
