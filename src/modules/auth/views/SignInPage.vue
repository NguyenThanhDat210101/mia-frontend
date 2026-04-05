<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../../../components/atoms/Card.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Divider from '../../../components/atoms/Divider.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleSignIn = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push({ path: '/verify-otp', query: { email: email.value } });
  }, 1000);
};

const goToSignup = () => router.push('/signup');
</script>

<template>
  <div class="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Abstract blurred shapes -->
    <div class="absolute top-[10%] right-[10%] w-[30%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
    
    <Card class="w-full max-w-md p-8 md:p-10 border border-white/5 bg-gray-900/80 backdrop-blur-xl shadow-2xl relative z-10" border>
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 mb-4">
          <Icon icon="mdi-storefront" size="x-large"></Icon>
        </div>
        <h2 class="text-2xl font-black text-white">Đăng nhập</h2>
        <p class="text-gray-400 mt-2 text-sm">Quản lý cửa hàng của bạn ngay hôm nay</p>
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email / Tài khoản</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi-email-outline" size="small" color="secondary"></Icon>
            </div>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="admin@mia.com"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-300">Mật khẩu</label>
            <a href="#" class="text-xs text-blue-400 hover:text-blue-300">Quên mật khẩu?</a>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi-lock-outline" size="small" color="secondary"></Icon>
            </div>
            <input 
              v-model="password" 
              type="password" 
              required 
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Btn 
          type="submit" 
          block 
          color="primary" 
          size="large" 
          rounded="lg" 
          class="mt-8"
          :class="{ 'opacity-70 pointer-events-none': isLoading }"
        >
          <span v-if="!isLoading">ĐĂNG NHẬP</span>
          <span v-else class="flex items-center gap-2">
            <Icon icon="mdi-loading" class="animate-spin"></Icon> ĐANG XỬ LÝ...
          </span>
        </Btn>
      </form>

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <Divider class="border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-900 text-gray-400">Chưa có tài khoản?</span>
          </div>
        </div>
        
        <div class="mt-6">
          <Btn variant="outlined" block color="white" rounded="lg" @click="goToSignup">
            ĐĂNG KÝ MIỄN PHÍ
          </Btn>
        </div>
      </div>
    </Card>
  </div>
</template>
