<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '../../../components/atoms/Card.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Icon from '../../../components/atoms/Icon.vue';
import OtpInput from '../../../components/atoms/OtpInput.vue';
import Span from '../../../components/atoms/Span.vue';

const router = useRouter();
const route = useRoute();
const email = ref(route.query.email || 'admin@mia.com');

const otpValue = ref('');
const isLoading = ref(false);
const isResending = ref(false);

const handleVerify = () => {
  if (otpValue.value.length < 6) return;
  isLoading.value = true;
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false;
    router.push('/dashboard');
  }, 1000);
};

const handleResend = () => {
  isResending.value = true;
  setTimeout(() => {
    isResending.value = false;
  }, 2000);
};
</script>

<template>
  <div class="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Abstract blurred shapes -->
    <div class="absolute top-[20%] right-[30%] w-[30%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <Card class="w-full max-w-lg p-8 md:p-10 border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl relative z-10" border>
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 mb-4">
          <Icon icon="mdi-shield-lock" size="x-large"></Icon>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Xác thực OTP</h2>
        <Span size="sm" class="text-slate-500 dark:text-gray-400 mt-3 block leading-relaxed max-w-[280px] mx-auto">
          Mã xác nhận 6 số đã được gửi tới email <br/>
          <Span class="text-slate-900 dark:text-white" weight="bold">{{ email }}</Span>
        </Span>
      </div>

      <form @submit.prevent="handleVerify" class="space-y-8 mt-8">
        <div class="flex justify-center flex-col items-center gap-2">
          <OtpInput v-model="otpValue" @finish="handleVerify" :length="6" />
        </div>

        <Btn 
          type="submit" 
          block 
          color="primary" 
          size="large" 
          rounded="lg" 
          :disabled="otpValue.length < 6"
          :class="{ 'opacity-70 pointer-events-none': isLoading }"
        >
          <span v-if="!isLoading">XÁC NHẬN</span>
          <span v-else class="flex items-center gap-2 relative z-10 w-full justify-center">
            <Icon icon="mdi-loading" class="animate-spin relative top-0"></Icon> <span class="pl-2">ĐANG XỬ LÝ...</span>
          </span>
        </Btn>
      </form>

      <div class="mt-8 text-center pt-2">
        <Span size="sm" class="text-slate-500 dark:text-gray-400 mb-2 block font-medium">Chưa nhận được mã?</Span>
        <Btn variant="text" color="primary" @click="handleResend" :class="{ 'pointer-events-none opacity-50': isResending }" class="uppercase text-xs font-black w-full mx-auto justify-center">
          <span v-if="!isResending">Gửi lại mã</span>
          <span v-else>Đã gửi lại ✔</span>
        </Btn>
      </div>
    </Card>
  </div>
</template>
