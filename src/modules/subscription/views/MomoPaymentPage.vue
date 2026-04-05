<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '../../../components/atoms/Card.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Btn from '../../../components/atoms/Btn.vue';
import ProgressCircular from '../../../components/atoms/ProgressCircular.vue';

const route = useRoute();
const router = useRouter();

const planName = ref(route.query.name || 'Gói Dịch Vụ');
const planPrice = ref(route.query.price || '0 VNĐ');
const isChecking = ref(true);

const goBack = () => {
  router.push('/pricing');
};

const checkPaymentStatus = () => {
  // Dummy check payment status
  setTimeout(() => {
    isChecking.value = false;
  }, 5000); // Stop checking after 5 seconds for visual effect
};

onMounted(() => {
  checkPaymentStatus();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full min-h-screen flex flex-col items-center justify-center">
    
    <Card class="w-full rounded-3xl elevation-12 border border-white/10 overflow-hidden">
      <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Btn icon="mdi-arrow-left" variant="text" color="white" @click="goBack"></Btn>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-0">Thanh Toán Trực Tuyến</h2>
        </div>
        <Icon icon="mdi-shield-check" size="x-large" color="white"></Icon>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Thông tin đơn hàng -->
        <div class="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-medium-emphasis mb-6 uppercase tracking-wider">Thông tin đơn hàng</h3>
            
            <div class="flex justify-between items-center py-4 border-b border-white/10">
              <span class="text-grey-lighten-1">Sản phẩm</span>
              <span class="font-bold text-white text-lg">{{ planName }}</span>
            </div>
            
            <div class="flex justify-between items-center py-4 border-b border-white/10">
              <span class="text-grey-lighten-1">Mã đơn hàng</span>
              <span class="font-bold text-white">#MIA{{ Math.floor(Math.random() * 100000) }}KT</span>
            </div>

            <div class="flex justify-between items-center py-6 mt-4">
              <span class="text-xl text-white font-medium">Tổng thanh toán</span>
              <span class="text-3xl font-black text-pink-400">{{ planPrice }}</span>
            </div>
          </div>

          <div class="mt-8 p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
            <div class="flex items-start gap-3">
              <Icon icon="mdi-information" color="pink-lighten-2" class="mt-0.5"></Icon>
              <p class="text-sm text-pink-lighten-4 mb-0 leading-relaxed">
                Vui lòng không tắt trình duyệt trong quá trình thanh toán. Hệ thống sẽ tự động cập nhật trạng thái khi giao dịch thành công.
              </p>
            </div>
          </div>
        </div>

        <!-- QR Code Thanh Toán -->
        <div class="p-8 flex flex-col items-center justify-center bg-grey-darken-3 relative">
          <div class="mb-6 flex items-center justify-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo Logo" class="h-8 object-contain" />
            <span class="text-xl font-semibold text-white">Quét mã qua Momo</span>
          </div>

          <div class="bg-white p-4 rounded-3xl shadow-2xl relative mb-6">
            <img src="/images/momo-qr.png" alt="QR Code" class="w-64 h-64 object-cover rounded-xl" />
            
            <!-- Hiệu ứng quét line -->
            <div class="absolute top-0 left-0 w-full h-full pointer-events-none rounded-3xl overflow-hidden">
              <div class="w-full h-1 bg-pink-500/50 shadow-[0_0_15px_5px_rgba(236,72,153,0.3)] absolute animate-scan"></div>
            </div>
          </div>

          <div class="text-center h-16">
            <div v-if="isChecking" class="flex flex-col items-center gap-2">
              <ProgressCircular indeterminate color="pink" size="24"></ProgressCircular>
              <span class="text-sm text-medium-emphasis">Đang chờ thanh toán...</span>
            </div>
            <div v-else class="flex flex-col items-center gap-2 text-success">
              <Icon icon="mdi-check-circle" size="large"></Icon>
              <span class="text-sm font-bold">Thanh toán thành công!</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.animate-scan {
  animation: scan 2s linear infinite;
}
</style>
