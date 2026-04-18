<script setup lang="ts">
import { ref } from 'vue'
import ProfileSection from './sections/ProfileSection.vue'
import StoreSection from './sections/StoreSection.vue'
import PaymentSection from './sections/PaymentSection.vue'
import Icon from '@/components/atoms/Icon.vue'
import Window from '@/components/atoms/Window.vue'
import WindowItem from '@/components/atoms/WindowItem.vue'

const activeTab = ref(0)

const tabs = [
  { title: 'Tài khoản', icon: 'mdi-account-outline' },
  { title: 'Cửa hàng', icon: 'mdi-storefront-outline' },
  { title: 'Thanh toán', icon: 'mdi-credit-card-outline' }
]
</script>

<template>
  <div class="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Cài đặt</h1>
      <p class="text-slate-500 dark:text-gray-400">Quản lý hồ sơ cá nhân và cấu hình cửa hàng của bạn</p>
    </div>

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar Tabs -->
      <div class="w-full md:w-64 shrink-0">
        <div class="bg-white dark:bg-white/5 rounded-2xl p-2 border border-slate-200 dark:border-white/10 sticky top-24">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            @click="activeTab = index"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 last:mb-0',
              activeTab === index 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'
            ]"
          >
            <Icon :icon="tab.icon" :color="activeTab === index ? 'white' : ''" size="small" />
            <span class="font-bold text-sm">{{ tab.title }}</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 min-w-0">
        <Window v-model="activeTab" class="bg-transparent">
          <WindowItem :value="0">
            <ProfileSection />
          </WindowItem>
          
          <WindowItem :value="1">
            <StoreSection />
          </WindowItem>

          <WindowItem :value="2">
            <PaymentSection />
          </WindowItem>
        </Window>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom transitions for v-window if needed */
</style>
