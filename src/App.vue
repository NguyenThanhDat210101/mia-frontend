<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useThemeStore } from './core/stores/theme';
import { useTheme } from 'vuetify';

const themeStore = useThemeStore();
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
    <router-view />
  </v-app>
</template>

<style>
/* Reset and base styles setup by Tailwind applied globally here if necessary */
</style>
