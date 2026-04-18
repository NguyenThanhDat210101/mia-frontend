<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useThemeStore } from '@/core/stores/theme';
import { useTheme } from 'vuetify';
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store';
import ProgressCircular from '@/components/atoms/ProgressCircular.vue';

const themeStore = useThemeStore();
const authStore = useAuthStore();
const theme = useTheme();

// Sync Vuetify theme with Pinia store
watch(() => themeStore.themeName, (val) => {
  theme.global.name.value = val;
}, { immediate: true });

onMounted(() => {
  // Global Reverb Connection
  if (window.Echo) {
    window.Echo.channel('system-bus')
      .listen('SystemEvent', (e: any) => {
        console.log('System event received via Reverb', e);
      });
  }
})
</script>

<template>
  <v-app :theme="themeStore.isDark ? 'dark' : 'light'">
    <!-- Global Splash Screen -->
    <transition name="fade">
      <div v-if="!authStore.isInitialized" 
           class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-900 transition-colors duration-500">
        <div class="relative flex flex-col items-center animate-out fade-out zoom-out duration-300 delay-300">
          <!-- Logo/Brand placeholder -->
          <div class="mb-8 p-4 bg-primary/10 rounded-2xl animate-pulse">
            <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <v-icon color="white" size="32">mdi-storefront</v-icon>
            </div>
          </div>
          
          <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            Mia<span class="text-primary">Manager</span>
          </h1>

          <ProgressCircular size="40" color="primary" />
          
          <p class="mt-8 text-slate-500 dark:text-gray-400 font-medium text-sm animate-pulse">
            Đang chuẩn bị không gian làm việc...
          </p>
        </div>
      </div>
    </transition>

    <router-view v-if="authStore.isInitialized" />
  </v-app>
</template>

<style>
/* Reset and base styles setup by Tailwind applied globally here if necessary */
</style>
