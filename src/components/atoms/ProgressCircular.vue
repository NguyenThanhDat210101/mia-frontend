<script setup lang="ts">
import { computed } from 'vue';
import type { ProgressCircularProps } from './types';

const props = withDefaults(defineProps<ProgressCircularProps>(), {
  color: 'primary',
  size: 24,
  indeterminate: true
});

const sizeStyle = computed(() => {
  const s = typeof props.size === 'number' || !isNaN(Number(props.size)) ? `${props.size}px` : props.size;
  return { width: s, height: s };
});

const colorClass = computed(() => {
  const colorMap: Record<string, string> = {
    primary: 'border-blue-500',
    pink: 'border-pink-500',
    white: 'border-white',
  };
  return colorMap[props.color] || props.color; // Mặc định trả về prop nếu không match chuẩn màu
});
</script>

<template>
  <div 
    v-if="indeterminate"
    class="rounded-full border-2 border-t-transparent animate-spin inline-block"
    :class="[colorClass]"
    :style="sizeStyle"
  ></div>
  <div v-else :class="['rounded-full border-2 inline-block', colorClass]" :style="sizeStyle"></div>
</template>
