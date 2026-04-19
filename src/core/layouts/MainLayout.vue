<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/sites/UserSite/modules/auth/store/auth.store";
import { useThemeStore } from "@/core/stores/theme";
import { RouteName, RoutePath } from "@/router/types";
import Icon from "@/components/atoms/Icon.vue";
import Btn from "@/components/atoms/Btn.vue";
import UserMenu from "./components/UserMenu.vue";

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300"
  >
    <!-- Navbar Tailwind -->
    <header
      class="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-md sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div
            class="flex items-center gap-2 cursor-pointer"
            @click="router.push(RoutePath.Home)"
          >
            <Icon icon="mdi-storefront" color="primary" size="large"></Icon>
            <span
              class="font-black text-xl tracking-tight text-slate-900 dark:text-white"
            >
              Store<span class="text-primary">Manager</span>
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <Btn
              variant="text"
              color="default"
              class="hidden sm:flex text-slate-600 dark:text-gray-400"
              @click="router.push(RoutePath.Pricing)"
            >
              Bảng giá
            </Btn>

            <!-- Theme Toggle Atom -->
            <Btn
              icon
              variant="text"
              color="default"
              class="text-slate-600 dark:text-gray-400"
              @click="themeStore.toggleTheme"
            >
              <Icon
                :icon="
                  themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'
                "
              />
            </Btn>
            <!-- User Menu or Login Button -->
            <template v-if="!authStore.isAuthenticated">
              <Btn
                color="primary"
                icon="mdi-login"
                @click="router.push({ name: RouteName.SignIn })"
              >
                Đăng nhập
              </Btn>
            </template>
            <template v-else>
              <UserMenu />
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content (Router View) -->
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Connection Badge -->
    <div class="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div
        class="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl shadow-2xl backdrop-blur-xl pointer-events-auto"
      >
        <div class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
          ></span>
        </div>
        <span class="text-green-500 font-bold text-sm"
          >Trực tuyến (Reverb)</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
