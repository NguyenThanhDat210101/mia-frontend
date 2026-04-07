<script setup lang="ts">
import { computed } from 'vue';
import type { CardProps } from './types';

const props = defineProps<CardProps>();

const cardClasses = computed(() => {
  const isOutlined = props.variant === 'outlined';
  const isFlat = props.variant === 'flat';
  
  let baseClass = 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white rounded-3xl overflow-hidden relative transition-colors duration-300';
  
  if (isOutlined) {
    baseClass += ' border border-slate-200 dark:border-gray-700 bg-transparent';
  } else if (props.border || props.variant === 'flat' && !isOutlined) {
    baseClass += ' border border-slate-200 dark:border-white/10';
  }

  if (!isFlat && !isOutlined) {
    baseClass += ' shadow-xl shadow-slate-200 dark:shadow-black/50';
  }

  return [baseClass];
});
</script>

<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>
