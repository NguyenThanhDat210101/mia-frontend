<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RoutePath } from '@/router/types';
import Card from '@/components/atoms/Card.vue';
import Btn from '@/components/atoms/Btn.vue';
import Icon from '@/components/atoms/Icon.vue';

import { LANDING_FEATURES } from '@/core/constants';

const router = useRouter();
const goToPricing = () => router.push(RoutePath.Pricing);
const goToSignup = () => router.push(RoutePath.SignUp);

const features = LANDING_FEATURES;
</script>

<template>
  <div class="flex-1 w-full flex flex-col justify-center items-center overflow-hidden relative py-12">
    <!-- Hero Background Effects -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10 text-center flex-1 flex flex-col justify-center">
      <h1 class="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-tight drop-shadow-lg">
        Giải pháp Quản lý Kho <br/>
        <span class="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Dành cho Nhà bán lẻ</span>
      </h1>
      <p class="text-xl md:text-2xl text-slate-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
        Hệ thống tự động hoá quy trình bán hàng đa kênh, kiểm soát tồn kho và tối ưu tài chính với tốc độ hiển thị Real-time.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <Btn color="primary" size="x-large" rounded="xl" @click="goToSignup" icon="mdi-rocket" class="shadow-lg shadow-blue-500/20">
          <span class="ml-2">Bắt đầu Miễn phí</span>
        </Btn>
        <Btn color="secondary" variant="outlined" size="x-large" rounded="xl" @click="goToPricing">
          Xem Bảng Giá
        </Btn>
      </div>
    </div>

    <!-- Feature Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="(feat, idx) in features" :key="idx" variant="flat" class="p-8 hover:-translate-y-2 transition-transform duration-300 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 group cursor-default shadow-sm dark:shadow-none" border>
          <div class="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon :icon="feat.icon" size="large" color="primary"></Icon>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{{ feat.title }}</h3>
          <p class="text-slate-500 dark:text-gray-400 leading-relaxed text-sm font-medium">{{ feat.description }}</p>
        </Card>
      </div>
    </div>
  </div>
</template>
