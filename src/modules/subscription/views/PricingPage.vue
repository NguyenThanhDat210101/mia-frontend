<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonColor: string;
  buttonVariant: "outlined" | "elevated" | "flat" | "text" | "plain" | "tonal";
  discount?: string;
}

const plans = ref<Plan[]>([
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

const selectPlan = (plan: Plan) => {
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

    <!-- Bảng giá lưới bằng Tailwind Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto relative z-10">
      
      <div 
        v-for="plan in plans" 
        :key="plan.id"
        class="flex"
      >
        <v-card
          class="w-full rounded-3xl flex flex-col relative transition-all duration-300"
          :class="[
            plan.isPopular 
              ? 'border-primary ring-2 ring-primary elevation-24 scale-100 md:scale-105 z-20 bg-grey-darken-3' 
              : 'border-white/10 elevation-6 bg-grey-darken-4 md:my-4'
          ]"
          variant="flat"
          border
        >
          <!-- Nhãn dán Phổ Biến -->
          <div v-if="plan.isPopular" class="absolute -top-5 right-6 z-30">
             <v-chip color="primary" variant="elevated" class="font-black tracking-wider shadow-lg" elevation="8" size="large">
                 <v-icon start icon="mdi-crown"></v-icon>
                 PHỔ BIẾN NHẤT
             </v-chip>
          </div>

          <!-- Header -->
          <div class="p-8 pb-4 text-center">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p class="text-medium-emphasis text-sm mb-6 min-h-[40px] px-4">{{ plan.description }}</p>

            <div class="flex items-end justify-center mb-1">
              <span class="text-5xl font-black text-white leading-none">{{ plan.price }}</span>
              <span class="text-base text-medium-emphasis font-medium ml-1 mb-1">{{ plan.duration }}</span>
            </div>

            <div class="text-success text-sm font-bold h-6 mt-2 flex items-center justify-center gap-1">
              <v-icon v-if="plan.discount" icon="mdi-tag" size="small"></v-icon>
              {{ plan.discount || '' }}
            </div>
          </div>

          <v-divider class="mx-8 mb-6 border-white/10"></v-divider>

          <!-- Danh sách tính năng -->
          <div class="flex-1 px-8 pb-8">
            <ul class="flex flex-col gap-4">
              <li v-for="(feature, i) in plan.features" :key="i" class="flex items-start text-grey-lighten-2">
                <v-icon icon="mdi-check-circle" color="primary" class="mr-3 shrink-0 mt-0.5" size="small"></v-icon>
                <span class="leading-relaxed font-medium">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Nút hành động -->
          <div class="p-8 pt-0">
             <v-btn
              block
              :color="plan.buttonColor"
              :variant="plan.buttonVariant"
              size="x-large"
              rounded="xl"
              class="font-black tracking-wider shadow-lg hover:opacity-90 active:scale-95 transition-all"
              @click="selectPlan(plan)"
            >
              CHỌN GÓI NÀY
            </v-btn>
          </div>
        </v-card>
      </div>

    </div>
  </div>
</template>
