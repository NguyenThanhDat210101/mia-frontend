<script setup lang="ts">
import { computed } from 'vue';
import type { CardProps } from './types';

const props = defineProps<CardProps>();

const cardClasses = computed(() => {
  const isOutlined = props.variant === 'outlined';
  const isFlat = props.variant === 'flat';
  
  let baseClass = 'bg-gray-900 text-white rounded-3xl overflow-hidden relative';
  
  if (isOutlined) {
    baseClass += ' border border-gray-700 bg-transparent';
  } else if (props.border || props.variant === 'flat' && !isOutlined) {
    baseClass += ' border border-white/10';
  }

  if (!isFlat && !isOutlined) {
    baseClass += ' shadow-2xl shadow-black/50';
  }

  return [baseClass];
});
</script>

<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>
