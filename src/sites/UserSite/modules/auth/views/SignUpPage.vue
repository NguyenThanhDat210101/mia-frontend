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
import { RouteName, RoutePath } from '@/router/types';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const isLoading = ref(false);
const error = ref('');

const handleSignUp = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Mật khẩu xác nhận không khớp.';
    return;
  }

  isLoading.value = true;
  error.value = '';
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    });

    // Role-based redirection
    if (authStore.user?.role_id === 1) {
      router.push({ name: RouteName.AdminDashboard });
    } else {
      router.push({ name: RouteName.Dashboard });
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
};

const goToSignin = () => router.push(RoutePath.SignIn);
</script>

<template>
  <div class="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Abstract blurred shapes -->
    <div class="absolute bottom-[10%] left-[10%] w-[30%] h-[40%] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <Card class="w-full max-w-md p-8 md:p-10 border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl relative z-10" border>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Bắt đầu dùng thử</h2>
        <Span size="sm" class="text-slate-500 dark:text-gray-400 mt-2">Tạo tài khoản Store Manager miễn phí</Span>
      </div>

      <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center border-solid">
        {{ error }}
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <div>
          <Label>Tên cửa hàng</Label>
          <Input 
            v-model="name" 
            type="text" 
            required 
            icon="mdi-store"
            placeholder="Cửa hàng của tôi"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input 
            v-model="email" 
            type="email" 
            required 
            icon="mdi-email-outline"
            placeholder="admin@mia.com"
          />
        </div>

        <div>
          <Label>Mật khẩu</Label>
          <Input 
            v-model="password" 
            type="password" 
            required 
            icon="mdi-lock-outline"
            placeholder="••••••••"
          />
        </div>

        <div>
          <Label>Xác nhận mật khẩu</Label>
          <Input 
            v-model="passwordConfirmation" 
            type="password" 
            required 
            icon="mdi-lock-check-outline"
            placeholder="••••••••"
          />
        </div>

        <Btn 
          type="submit" 
          block 
          color="primary" 
          size="large" 
          rounded="lg" 
          class="mt-6"
          :loading="isLoading"
        >
          ĐĂNG KÝ TÀI KHOẢN
        </Btn>
      </form>

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <Divider class="border-slate-200 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <Span class="px-2 bg-white dark:bg-gray-900 text-slate-500 dark:text-gray-400">Đã có tài khoản?</Span>
          </div>
        </div>
        
        <div class="mt-6">
          <Btn variant="outlined" block color="secondary" rounded="lg" @click="goToSignin">
            ĐĂNG NHẬP NGAY
          </Btn>
        </div>
      </div>
    </Card>
  </div>
</template>
