<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../../../components/atoms/Card.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Divider from '../../../components/atoms/Divider.vue';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleSignUp = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push('/dashboard');
  }, 1000);
};

const goToSignin = () => router.push('/signin');
</script>

<template>
  <div class="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Abstract blurred shapes -->
    <div class="absolute bottom-[10%] left-[10%] w-[30%] h-[40%] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <Card class="w-full max-w-md p-8 md:p-10 border border-white/5 bg-gray-900/80 backdrop-blur-xl shadow-2xl relative z-10" border>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-black text-white">Bắt đầu dùng thử</h2>
        <p class="text-gray-400 mt-2 text-sm">Tạo tài khoản Store Manager miễn phí</p>
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Tên cửa hàng</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi-store" size="small" color="secondary"></Icon>
            </div>
            <input 
              v-model="name" 
              type="text" 
              required 
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Cửa hàng của tôi"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
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
          <label class="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
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
          class="mt-6"
          :class="{ 'opacity-70 pointer-events-none': isLoading }"
        >
          <span v-if="!isLoading">ĐĂNG KÝ TÀI KHOẢN</span>
          <span v-else class="flex items-center gap-2">
            <Icon icon="mdi-loading" class="animate-spin"></Icon> ĐANG TẠO...
          </span>
        </Btn>
      </form>

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <Divider class="border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-900 text-gray-400">Đã có tài khoản?</span>
          </div>
        </div>
        
        <div class="mt-6">
          <Btn variant="outlined" block color="white" rounded="lg" @click="goToSignin">
            ĐĂNG NHẬP NGAY
          </Btn>
        </div>
      </div>
    </Card>
  </div>
</template>
