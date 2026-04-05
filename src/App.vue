<script setup lang="ts">
import { onMounted } from 'vue';

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
  <router-view />
</template>

<style>
/* Reset and base styles setup by Tailwind applied globally here if necessary */
</style>
