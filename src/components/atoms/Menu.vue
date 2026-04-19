<script setup lang="ts">
import { useThemeStore } from '@/core/stores/theme';
import type { MenuProps } from './types';

const themeStore = useThemeStore();

withDefaults(defineProps<MenuProps>(), {
  minWidth: '200px',
  rounded: true,
  offset: 8,
});
</script>

<template>
  <v-menu
    :theme="themeStore.themeName"
    :min-width="minWidth"
    :rounded="rounded"
    :offset="offset"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps"></slot>
    </template>
    
    <slot></slot>
  </v-menu>
</template>
