<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../../../components/atoms/Card.vue';
import Chip from '../../../components/atoms/Chip.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Divider from '../../../components/atoms/Divider.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Skeleton from '../../../components/atoms/Skeleton.vue';
import type { Plan } from '../types';

import apiClient from '../../../core/api/client';

const router = useRouter();
const isLoading = ref(true);
const isSubscribing = ref(false);
const currentIndex = ref(0);

const maxIndex = computed(() => {
  // Assuming 3 visible items on desktop
  return Math.max(0, plans.value.length - 3);
});

const next = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++;
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});

const plans = ref<Plan[]>([
  {
    id: 'free',
    name: 'Dùng Thử',
    price: '0đ',
    duration: '/ tháng',
    description: 'Trải nghiệm đầy đủ tính năng trong 1 tháng',
    features: [
      'Quản lý kho hàng cơ bản',
      'Đồng bộ đơn hàng tự động',
      'Hỗ trợ qua email'
    ],
    isFree: true,
    isPopular: false,
    buttonColor: 'white',
    buttonVariant: 'outlined',
  },
  {
    id: 'monthly',
    name: '1 Tháng',
    price: '299K',
    duration: '/ tháng',
    description: 'Thanh toán linh hoạt từng tháng',
    features: [
      'Quản lý kho hàng cơ bản',
      'Đồng bộ đơn hàng tự động',
      'Báo cáo doanh thu',
      'Hỗ trợ qua email'
    ],
    isPopular: false,
    buttonColor: 'secondary',
    buttonVariant: 'outlined',
  },
  {
    id: 'quarterly',
    name: '3 Tháng',
    price: '799K',
    duration: '/ 3 tháng',
    description: 'Chống gián đoạn, tiết kiệm hơn',
    features: [
      'Tất cả tính năng gói 1 tháng',
      'Quản lý nhiều chi nhánh (Tối đa 3)',
      'Phân quyền nhân viên (Tối đa 10)',
      'Hỗ trợ trực tuyến giờ hành chính'
    ],
    isPopular: true,
    buttonColor: 'primary',
    buttonVariant: 'elevated',
    discount: 'Tiết kiệm ~10%'
  },
  {
    id: 'yearly',
    name: '1 Năm',
    price: '2,899K',
    duration: '/ năm',
    description: 'Đầu tư dài hạn, tối ưu mọi chi phí',
    features: [
      'Tất cả tính năng gói 3 tháng',
      'Không giới hạn cửa hàng',
      'Tích hợp API vận chuyển',
      'Hỗ trợ kỹ thuật 24/7',
      'Báo cáo đa chiều nâng cao'
    ],
    isPopular: false,
    buttonColor: 'secondary',
    buttonVariant: 'outlined',
    discount: 'Tiết kiệm ~20%'
  }
]);

const selectPlan = async (plan: Plan) => {
  if (plan.isFree) {
    if (isSubscribing.value) return;
    
    isSubscribing.value = true;
    try {
      // Hardcoded store_id: 1 for consistency with other modules
      await apiClient.post('/v1/plans/subscribe', {
        store_id: 1,
        plan_id: plan.id,
        payment_gateway: 'free'
      });
      
      alert('Kích hoạt gói thành công! Bạn có 1 tháng trải nghiệm miễn phí.');
      router.push('/store/orders'); // Redirect to orders after success
    } catch (err: any) {
      const message = err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký gói miễn phí.';
      alert(message);
    } finally {
      isSubscribing.value = false;
    }
    return;
  }

  router.push({
    path: '/payment/momo',
    query: {
      name: plan.name,
      price: plan.price
    }
  });
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
    
    <!-- Tiêu đề -->
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block pb-1">
        Đăng ký Dịch vụ
      </h2>
      <p class="text-medium-emphasis text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        Bắt buộc mua gói subscription để kích hoạt kho lưu trữ. Khởi đầu với sự linh hoạt, dễ dàng thay đổi bất cứ khi nào!
      </p>
    </div>

    <!-- Bảng giá dạng Slider -->
    <!-- Pricing Cards với Skeleton Loading -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
       <Skeleton v-for="n in 3" :key="n" type="card" class="h-[600px]" />
    </div>

    <div v-else class="relative max-w-6xl mx-auto group">
      <!-- Navigation Buttons -->
      <div 
        v-if="currentIndex > 0"
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-40 transition-all opacity-0 group-hover:opacity-100"
      >
        <Btn 
          icon="mdi-chevron-left" 
          rounded="full" 
          size="large" 
          color="white" 
          class="shadow-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-500"
          @click="prev"
        />
      </div>

      <div 
        v-if="currentIndex < maxIndex"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-40 transition-all opacity-0 group-hover:opacity-100"
      >
        <Btn 
          icon="mdi-chevron-right" 
          rounded="full" 
          size="large" 
          color="white" 
          class="shadow-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-500"
          @click="next"
        />
      </div>

      <!-- Slider Viewport -->
      <div class="overflow-hidden px-1 py-10">
        <div 
          class="flex transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentIndex * (100 / (plans.length > 3 ? 3 : plans.length))}%)` }"
        >
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="w-full md:w-1/3 shrink-0 px-4 flex"
          >
            <Card
              class="w-full rounded-3xl flex flex-col relative transition-all duration-300"
              :class="[
                plan.isPopular 
                  ? 'border-blue-500 ring-2 ring-blue-500 scale-100 md:scale-105 z-20 shadow-2xl' 
                  : 'border-slate-200 dark:border-white/10 shadow-md md:my-4'
              ]"
              variant="flat"
              border
            >
              <!-- Nhãn dán Phổ Biến -->
              <div v-if="plan.isPopular" class="absolute -top-5 right-6 z-30">
                 <Chip color="primary" variant="elevated" class="font-black tracking-wider shadow-lg" elevation="8" size="large">
                     <Icon icon="mdi-crown" class="mr-1"></Icon>
                     PHỔ BIẾN NHẤT
                 </Chip>
              </div>

              <!-- Header -->
              <div class="p-8 pb-4 text-center">
                <h3 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{{ plan.name }}</h3>
                <p class="text-slate-500 dark:text-gray-400 text-sm mb-6 min-h-[40px] px-4">{{ plan.description }}</p>

                <div class="flex items-end justify-center mb-1">
                  <span class="text-5xl font-black text-slate-900 dark:text-white leading-none">{{ plan.price }}</span>
                  <span class="text-base text-slate-500 dark:text-gray-400 font-medium ml-1 mb-1">{{ plan.duration }}</span>
                </div>

                <div class="text-green-600 dark:text-green-500 text-sm font-bold h-6 mt-2 flex items-center justify-center gap-1">
                  <Icon v-if="plan.discount" icon="mdi-tag" size="small"></Icon>
                  {{ plan.discount || '' }}
                </div>
              </div>

              <Divider class="mx-8 mb-6 border-slate-200 dark:border-white/10"></Divider>

              <!-- Danh sách tính năng -->
              <div class="flex-1 px-8 pb-8">
                <ul class="flex flex-col gap-4">
                  <li v-for="(feature, i) in plan.features" :key="i" class="flex items-start text-slate-700 dark:text-gray-200">
                    <Icon icon="mdi-check-circle" color="primary" class="mr-3 shrink-0 mt-0.5" size="small"></Icon>
                    <span class="leading-relaxed font-medium">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Nút hành động -->
              <div class="p-8 pt-0">
                 <Btn
                  block
                  :color="plan.isPopular ? 'primary' : 'default'"
                  :variant="plan.buttonVariant"
                  :loading="plan.isFree && isSubscribing"
                  size="x-large"
                  rounded="xl"
                  class="font-black tracking-wider hover:opacity-90 active:scale-95 transition-all text-uppercase"
                  :class="!plan.isPopular && 'border-slate-200 dark:border-white/20 text-slate-700 dark:text-white'"
                  @click="selectPlan(plan)"
                >
                  {{ plan.isFree ? 'BẮT ĐẦU MIỄN PHÍ' : 'CHỌN GÓI NÀY' }}
                </Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
