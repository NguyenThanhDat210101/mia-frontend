<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteName } from '@/router/types';
import Btn from '@/components/atoms/Btn.vue';
import Icon from '@/components/atoms/Icon.vue';
import Card from '@/components/atoms/Card.vue';

const router = useRouter();

const goHome = () => {
  router.push({ name: RouteName.Home });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900 p-6 transition-colors duration-500">
    <div class="max-w-xl w-full text-center relative">
      <!-- Background Decoration -->
      <div class="absolute -top-24 -left-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <Card border class="p-12 shadow-2xl relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl">
        <div class="mb-8 flex flex-col items-center">
            <h1 class="text-9xl font-black mb-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent opacity-20">404</h1>
            <div class="absolute top-20 flex justify-center w-full">
                <div class="w-32 h-32 bg-white dark:bg-neutral-700 rounded-3xl shadow-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-500">
                    <Icon icon="mdi-map-marker-off" size="large" color="primary"></Icon>
                </div>
            </div>
        </div>

        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4">Ối! Bạn đang ở đâu thế?</h2>
        <p class="text-slate-500 dark:text-gray-400 text-lg mb-10 leading-relaxed font-medium">
          Dường như trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang một vũ trụ khác.
        </p>

        <Btn 
          color="primary" 
          size="x-large" 
          rounded="xl" 
          class="min-w-[200px] shadow-lg shadow-blue-500/30"
          @click="goHome"
        >
          QUAY VỀ TRANG CHỦ
        </Btn>
      </Card>
      
      <p class="mt-8 text-slate-400 dark:text-gray-500 text-sm font-bold tracking-widest uppercase">
          MIA-SPA • PROJECT LOST IN SPACE
      </p>
    </div>
  </div>
</template>
