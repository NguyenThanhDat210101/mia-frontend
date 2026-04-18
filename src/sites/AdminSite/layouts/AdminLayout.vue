<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/core/stores/theme'
import Icon from '@/components/atoms/Icon.vue'
import Btn from '@/components/atoms/Btn.vue'
import Avatar from '@/components/atoms/Avatar.vue'

const router = useRouter()
const themeStore = useThemeStore()

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin' },
  { title: 'Quản lý cửa hàng', icon: 'mdi-store', to: '/admin/stores' },
  { title: 'Người dùng', icon: 'mdi-account-group', to: '/admin/users' },
  { title: 'Gói dịch vụ', icon: 'mdi-package-variant', to: '/admin/subscriptions' },
  { title: 'Cấu hình hệ thống', icon: 'mdi-cog', to: '/admin/settings' },
]

const handleLogout = () => {
  // Logic logout cho admin
  router.push('/signin')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white flex font-sans transition-colors duration-300">
    
    <!-- Sidebar -->
    <aside class="w-72 bg-white dark:bg-neutral-900 border-r border-slate-200 dark:border-white/5 flex flex-col sticky top-0 h-screen z-50">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <v-icon color="white">mdi-shield-check</v-icon>
        </div>
        <div>
          <h1 class="font-black text-lg tracking-tight leading-none">
            Mia<span class="text-primary">Admin</span>
          </h1>
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Control Panel</p>
        </div>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1">
        <div v-for="item in menuItems" :key="item.to">
          <router-link :to="item.to" v-slot="{ isActive }">
            <button
              @click="router.push(item.to)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
              ]"
            >
              <v-icon :color="isActive ? 'primary' : ''" :class="!isActive && 'group-hover:text-primary'">{{ item.icon }}</v-icon>
              <span class="font-semibold text-sm">{{ item.title }}</span>
            </button>
          </router-link>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-200 dark:border-white/5">
        <button 
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold text-sm"
        >
          <v-icon color="error">mdi-logout</v-icon>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <header class="h-16 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
        <div class="flex items-center gap-4 text-slate-400">
          <span class="text-sm font-medium">Hệ thống</span>
          <v-icon size="small">mdi-chevron-right</v-icon>
          <span class="text-sm font-bold text-slate-900 dark:text-white">Admin Dashboard</span>
        </div>

        <div class="flex items-center gap-4">
          <Btn
            icon
            variant="text"
            color="default"
            class="text-slate-600 dark:text-gray-400"
            @click="themeStore.toggleTheme"
          >
            <Icon :icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
          </Btn>
          
          <div class="h-8 w-[1px] bg-slate-200 dark:bg-white/10"></div>
          
          <div class="flex items-center gap-3 pl-2">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold leading-none">Administrator</p>
              <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Super Admin</p>
            </div>
            <Avatar icon="mdi-shield-account" color="primary" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
