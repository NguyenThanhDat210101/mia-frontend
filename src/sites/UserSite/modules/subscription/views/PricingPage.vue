<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import Card from '@/components/atoms/Card.vue';
import Chip from '@/components/atoms/Chip.vue';
import Icon from '@/components/atoms/Icon.vue';
import Divider from '@/components/atoms/Divider.vue';
import Btn from '@/components/atoms/Btn.vue';
import Skeleton from '@/components/atoms/Skeleton.vue';
import type { Plan } from '../types';
import { useSubscriptionStore } from '../store/subscription.store';
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store';
import { storeToRefs } from 'pinia';
import { RouteName } from '@/router/types';

const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const authStore = useAuthStore();
const toast = useToast();
const { plans, loading: isLoading, slugDescriptions } = storeToRefs(subscriptionStore);

const currentPlanId = computed(() => authStore.activePlan?.id);

const isSubscribing = ref(false);
const currentIndex = ref(0);
const visibleCards = 3;

const maxIndex = computed(() => {
  return Math.max(0, plans.value.length - visibleCards);
});

const currentPlanIndex = computed(() => {
  if (currentPlanId.value) {
    return plans.value.findIndex(p => p.id === currentPlanId.value);
  }
  return -1;
});

const displayIndex = computed(() => {
  if (currentPlanIndex.value >= 0 && currentPlanIndex.value <= maxIndex.value) {
    return currentPlanIndex.value;
  }
  if (currentPlanIndex.value > maxIndex.value) {
    return maxIndex.value;
  }
  return 0;
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

const getDiscountLabel = (slug: string) => {
  if (slug === 'quarterly') return 'Tiết kiệm ~10%';
  if (slug === 'yearly') return 'Tiết kiệm ~20%';
  return '';
};

onMounted(async () => {
  await subscriptionStore.fetchPlans();
  if (displayIndex.value > 0) {
    currentIndex.value = displayIndex.value;
  }
});

const selectPlan = async (plan: Plan) => {
  if (plan.is_free) {
    if (isSubscribing.value) return;
    
    isSubscribing.value = true;
    try {
      await subscriptionStore.subscribePlan({
        plan_id: plan.id,
        payment_gateway: 'free'
      });
      
      toast.success('Kích hoạt gói thành công! Bạn có 1 tháng trải nghiệm miễn phí.');
      router.push({ name: RouteName.StoreOrdersManagement }); 
    } catch (err: any) {
      console.log(err);
      
      const message = err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký gói miễn phí.';
      toast.error(message);
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
      <button
        v-if="currentIndex > 0"
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-slate-200 dark:border-white/10 text-blue-500 hover:scale-110 active:scale-95 transition-all duration-200"
        @click="prev"
      >
        <Icon icon="mdi-chevron-left" size="large"></Icon>
      </button>

      <button
        v-if="currentIndex < maxIndex"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-slate-200 dark:border-white/10 text-blue-500 hover:scale-110 active:scale-95 transition-all duration-200"
        @click="next"
      >
        <Icon icon="mdi-chevron-right" size="large"></Icon>
      </button>

      <!-- Dots Indicator -->
      <div class="flex justify-center gap-3 mb-4">
        <button
          v-for="(_, idx) in Math.max(1, plans.length - visibleCards + 1)"
          :key="idx"
          class="transition-all duration-300 rounded-full"
          :class="[
            currentIndex === idx 
              ? 'w-8 bg-blue-500' 
              : 'w-2 bg-slate-300 dark:bg-white/20 hover:w-4'
          ]"
          @click="currentIndex = idx"
        />
      </div>

      <!-- Slider Viewport -->
      <div class="overflow-hidden px-1 py-16 -mt-6">
        <div 
          class="flex transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }"
        >
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="w-full md:w-1/3 shrink-0 px-4 flex"
          >
            <Card
              class="w-full rounded-3xl flex flex-col relative transition-all duration-300"
              :class="[
                plan.is_popular 
                  ? 'border-blue-500 ring-2 ring-blue-500 scale-100 md:scale-105 z-20 shadow-2xl' 
                  : 'border-slate-200 dark:border-white/10 shadow-md md:my-4'
              ]"
              variant="flat"
              border
            >
              <!-- Nhãn dán Phổ Biến HOẶC Gói Hiện Tại -->
<div v-if="plan.id === currentPlanId" class="absolute -top-5 right-6 z-30">
                  <Chip color="success" variant="elevated" class="font-black tracking-wider shadow-lg" elevation="8" size="large">
                      <Icon icon="mdi-check-decagram" class="mr-1"></Icon>
                      BẠN ĐANG DÙNG
                  </Chip>
               </div>
               <div v-else-if="plan.is_popular" class="absolute -top-5 right-6 z-30">
                 <Chip color="primary" variant="elevated" class="font-black tracking-wider shadow-lg" elevation="8" size="large">
                     <Icon icon="mdi-crown" class="mr-1"></Icon>
                     PHỔ BIẾN NHẤT
                 </Chip>
              </div>

              <!-- Header -->
              <div class="p-8 pb-4 text-center">
                <h3 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{{ plan.name }}</h3>
                <p class="text-slate-500 dark:text-gray-400 text-sm mb-6 min-h-[40px] px-4">{{ slugDescriptions[plan.slug] }}</p>

                <div class="flex items-end justify-center mb-1">
                  <span class="text-5xl font-black text-slate-900 dark:text-white leading-none">
                    {{ plan.price === 0 ? '0đ' : `${Math.floor(plan.price / 1000).toLocaleString()}K` }}
                  </span>
                  <span class="text-base text-slate-500 dark:text-gray-400 font-medium ml-1 mb-1">
                    {{ plan.duration_months === 12 ? '/ năm' : (plan.duration_months === 1 ? '/ tháng' : '/ ' + plan.duration_months + ' tháng') }}
                  </span>
                </div>

                <div class="text-green-600 dark:text-green-500 text-sm font-bold h-6 mt-2 flex items-center justify-center gap-1">
                  <Icon v-if="getDiscountLabel(plan.slug)" icon="mdi-tag" size="small"></Icon>
                  {{ getDiscountLabel(plan.slug) }}
                </div>
              </div>

              <Divider class="mx-8 mb-6 border-slate-200 dark:border-white/10"></Divider>

              <!-- Danh sách tính năng -->
              <div class="flex-1 px-8 pb-8">
                <ul class="flex flex-col gap-4">
                  <li v-for="(feature, i) in plan.description" :key="i" class="flex items-start text-slate-700 dark:text-gray-200">
                    <Icon icon="mdi-check-circle" color="primary" class="mr-3 shrink-0 mt-0.5" size="small"></Icon>
                    <span class="leading-relaxed font-medium">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Nút hành động -->
              <div class="p-8 pt-0">
                 <Btn
                  block
                  :color="plan.is_popular ? 'primary' : (plan.is_free ? 'white' : 'secondary')"
                  :variant="plan.is_popular ? 'elevated' : 'outlined'"
                  :loading="plan.is_free && isSubscribing"
                  size="x-large"
                  rounded="xl"
                  class="font-black tracking-wider hover:opacity-90 active:scale-95 transition-all text-uppercase"
                  :class="!plan.is_popular && plan.id !== currentPlanId && 'border-slate-200 dark:border-white/20 text-slate-700 dark:text-white'"
                  :disabled="plan.id === currentPlanId"
                  @click="selectPlan(plan)"
                >
                  <template v-if="plan.id === currentPlanId">GÓI HIỆN TẠI</template>
                  <template v-else-if="plan.is_free">BẮT ĐẦU MIỄN PHÍ</template>
                  <template v-else>CHỌN GÓI NÀY</template>
                </Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
