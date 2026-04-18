<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import Card from '@/components/atoms/Card.vue';
import Btn from '@/components/atoms/Btn.vue';
import Icon from '@/components/atoms/Icon.vue';
import Divider from '@/components/atoms/Divider.vue';
import Label from '@/components/atoms/Label.vue';
import Input from '@/components/atoms/Input.vue';
import Span from '@/components/atoms/Span.vue';
import { RouteName } from '@/router/types';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const handleSignIn = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    });
    
    // Role-based redirection
    if (authStore.user?.role_id === 1) {
      router.push({ name: RouteName.AdminDashboard });
    } else {
      router.push({ name: RouteName.Dashboard });
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
  } finally {
    isLoading.value = false;
  }
};

const goToSignup = () => router.push('/signup');
</script>

<template>
  <div class="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Abstract blurred shapes -->
    <div class="absolute top-[10%] right-[10%] w-[30%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
    
    <Card class="w-full max-w-md p-8 md:p-10 border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl relative z-10" border>
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 mb-4">
          <Icon icon="mdi-storefront" size="x-large"></Icon>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Đăng nhập</h2>
        <Span size="sm" class="text-slate-500 dark:text-gray-400 mt-2">Quản lý cửa hàng của bạn ngay hôm nay</Span>
      </div>

      <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center border-solid">
        {{ error }}
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-5">
        <div>
          <Label>Email / Tài khoản</Label>
          <Input 
            v-model="email" 
            type="email" 
            required 
            icon="mdi-email-outline"
            placeholder="admin@mia.com"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <Label class="mb-0">Mật khẩu</Label>
            <a href="#" class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Quên mật khẩu?</a>
          </div>
          <Input 
            v-model="password" 
            type="password" 
            required 
            icon="mdi-lock-outline"
            placeholder="••••••••"
          />
        </div>

        <Btn 
          type="submit" 
          block 
          color="primary" 
          size="large" 
          rounded="lg" 
          class="mt-8"
          :loading="isLoading"
        >
          ĐĂNG NHẬP
        </Btn>
      </form>

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <Divider class="border-slate-200 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <Span class="px-2 bg-white dark:bg-gray-900 text-slate-500 dark:text-gray-400">Chưa có tài khoản?</Span>
          </div>
        </div>
        
        <div class="mt-6">
          <Btn variant="outlined" block color="secondary" rounded="lg" @click="goToSignup">
            ĐĂNG KÝ MIỄN PHÍ
          </Btn>
        </div>
      </div>
    </Card>
  </div>
</template>
