<script setup lang="ts">
import { ref } from 'vue';
import Card from '../../../components/atoms/Card.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Skeleton from '../../../components/atoms/Skeleton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);

</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    
    <div class="mb-8">
      <h1 class="text-3xl font-black mb-2">Tổng quan Cửa hàng</h1>
      <p class="text-medium-emphasis">Chào mừng bạn quay lại hệ thống quản trị Store Manager.</p>
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
