<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Card from '../../../components/atoms/Card.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Skeleton from '../../../components/atoms/Skeleton.vue';
import InputDate from '../../../components/atoms/InputDate.vue';
import Select from '../../../components/atoms/Select.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);

const filterDate = ref(new Date().toISOString().substr(0, 10));
const selectedStore = ref('');
const storeOptions = [
  { label: 'Chi nhánh Quận 1', value: 'q1' },
  { label: 'Chi nhánh Thủ Đức', value: 'td' },
  { label: 'Kho Tổng Hóc Môn', value: 'hm' },
];

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
        <h1 class="text-3xl font-black mb-2">Tổng quan Cửa hàng</h1>
        <p class="text-medium-emphasis">Chào mừng bạn quay lại hệ thống quản trị Store Manager.</p>
      </div>

      <!-- Quick Filter Demo -->
      <div v-if="!isLoading" class="flex flex-col sm:flex-row gap-3 min-w-[400px]">
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Ngày báo cáo</label>
          <InputDate v-model="filterDate" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Cửa hàng</label>
          <Select v-model="selectedStore" :options="storeOptions" placeholder="Chọn chi nhánh" />
        </div>
      </div>
    </div>

    <!-- Alert Requirement -->
    <div class="mb-8 p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center gap-4">
      <Icon icon="mdi-alert" color="warning" size="x-large" class="shrink-0 text-yellow-500"></Icon>
      <div class="flex-1">
        <div class="font-medium text-base text-yellow-500">
          Tài khoản của bạn hiện chưa có Gói dịch vụ (Subscription) nào. Bạn vui lòng nâng cấp để mở khóa đầy đủ tính năng.
        </div>
      </div>
      <div class="shrink-0 mt-4 md:mt-0">
        <Btn color="warning" variant="elevated" rounded="lg" @click="router.push('/pricing')">
          XEM BẢNG GIÁ
        </Btn>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-10">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi-flash" color="warning"></Icon>
        Thao tác nhanh
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="flat" border class="p-6 cursor-pointer hover:border-blue-500/50 transition-all bg-neutral-800/40 group" @click="router.push('/store/order')">
           <Icon icon="mdi-cart-plus" size="large" color="primary" class="mb-4 group-hover:scale-110 transition-transform"></Icon>
           <div class="font-bold">Màn hình Order (POS)</div>
           <div class="text-xs text-gray-500 mt-1">Bấm để bắt đầu bán hàng nhanh</div>
        </Card>
        
        <Card variant="flat" border class="p-6 cursor-pointer hover:border-indigo-500/50 transition-all bg-neutral-800/40 group" @click="router.push('/store/products')">
           <Icon icon="mdi-coffee-outline" size="large" color="secondary" class="mb-4 group-hover:scale-110 transition-transform"></Icon>
           <div class="font-bold">Quản lý Sản phẩm</div>
           <div class="text-xs text-gray-500 mt-1">Thêm đồ uống, cập nhật giá</div>
        </Card>

        <Card variant="flat" border class="p-6 cursor-pointer hover:border-green-500/50 transition-all bg-neutral-800/40 group opacity-50">
           <Icon icon="mdi-account-star-outline" size="large" color="success" class="mb-4"></Icon>
           <div class="font-bold">Khách hàng thân thiết</div>
           <div class="text-xs text-gray-500 mt-1">Coming soon...</div>
        </Card>

        <Card variant="flat" border class="p-6 cursor-pointer hover:border-pink-500/50 transition-all bg-neutral-800/40 group opacity-50">
           <Icon icon="mdi-chart-line" size="large" color="pink-lighten-2" class="mb-4"></Icon>
           <div class="font-bold">Báo cáo chi tiết</div>
           <div class="text-xs text-gray-500 mt-1">Coming soon...</div>
        </Card>
      </div>
    </div>

    <!-- Overview Stats with Tailwind Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton v-for="n in 3" :key="n" class="h-44 rounded-2xl" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="flat" border class="p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors bg-gray-900 border-white/5">
        <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <Icon icon="mdi-currency-usd" size="text-[120px]"></Icon>
        </div>
        <div class="text-gray-400 text-sm font-bold tracking-wide mb-2 uppercase">Doanh thu hôm nay</div>
        <div class="text-4xl font-black text-white">0đ</div>
      </Card>
      
      <Card variant="flat" border class="p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors bg-gray-900 border-white/5">
        <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <Icon icon="mdi-package-variant" size="text-[120px]"></Icon>
        </div>
        <div class="text-gray-400 text-sm font-bold tracking-wide mb-2 uppercase">Đơn hàng mới</div>
        <div class="text-4xl font-black text-white">0</div>
      </Card>
      
      <Card variant="flat" border class="p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-colors bg-gray-900 border-white/5">
        <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <Icon icon="mdi-account-group" size="text-[120px]"></Icon>
        </div>
        <div class="text-gray-400 text-sm font-bold tracking-wide mb-2 uppercase">Khách hàng</div>
        <div class="text-4xl font-black text-white">0</div>
      </Card>
    </div>
  </div>
</template>
