<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  color?: string;
  size?: 'small' | 'default' | 'large' | 'x-large' | string;
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small': return 'text-sm';
    case 'large': return 'text-2xl';
    case 'x-large': return 'text-4xl';
    default: return typeof props.size === 'string' && props.size.startsWith('text-') ? '' : 'text-base';
  }
});

const colorClass = computed(() => {
  if (!props.color) return '';
  const colorMap: Record<string, string> = {
    primary: 'text-blue-500',
    secondary: 'text-indigo-400',
    success: 'text-green-500',
    white: 'text-white',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    'pink-lighten-2': 'text-pink-400'
  };
  return colorMap[props.color] || props.color;
});
</script>

<template>
  <i :class="['mdi', icon, sizeClasses, colorClass]" aria-hidden="true"></i>
</template>
