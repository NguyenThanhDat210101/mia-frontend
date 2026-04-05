<script setup lang="ts">
import { computed } from 'vue';
import type { ChipProps } from './types';

const props = withDefaults(defineProps<ChipProps>(), {
  color: 'primary',
  variant: 'elevated',
  size: 'default',
});

const chipClasses = computed(() => {
  const isElevated = props.variant === 'elevated';
  const isOutlined = props.variant === 'outlined';
  
  let bgClass = '';
  let textClass = 'text-white';
  let borderClass = '';

  const colorMap: Record<string, { bg: string, text: string, border: string, bgOp: string, textOp: string }> = {
    primary: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500', bgOp: 'bg-blue-600/10', textOp: 'text-blue-500' },
    secondary: { bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-500', bgOp: 'bg-gray-600/10', textOp: 'text-gray-400' },
    success: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-500', bgOp: 'bg-green-500/10', textOp: 'text-green-500' },
  };

  const scheme = colorMap[props.color] || colorMap['primary'];

  if (isElevated) {
    bgClass = scheme.bg;
    textClass = scheme.text;
  } else if (isOutlined) {
    bgClass = 'bg-transparent';
    textClass = scheme.textOp;
    borderClass = `border ${scheme.border}`;
  } else {
    bgClass = scheme.bgOp;
    textClass = scheme.textOp;
  }

  const sizeClass = props.size === 'small' ? 'px-2 py-0.5 text-xs' 
                  : props.size === 'large' ? 'px-4 py-1.5 text-base' 
                  : 'px-3 py-1 text-sm';

  let elevationClass = '';
  if (isElevated) {
    elevationClass = props.elevation && Number(props.elevation) > 4 ? 'shadow-lg' : 'shadow-sm';
  }

  return [bgClass, textClass, borderClass, sizeClass, elevationClass, 'rounded-full inline-flex items-center justify-center font-medium transition-colors'];
});
</script>

<template>
  <span :class="chipClasses">
    <slot></slot>
  </span>
</template>
