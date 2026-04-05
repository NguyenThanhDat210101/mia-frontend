<script setup lang="ts">
import { computed, useSlots } from 'vue';
import Icon from './Icon.vue';
import type { BtnProps } from './types';

const props = withDefaults(defineProps<BtnProps>(), {
  variant: 'elevated',
  size: 'default',
});

const emit = defineEmits(['click']);

const btnClasses = computed(() => {
  const isOutlined = props.variant === 'outlined';
  const isText = props.variant === 'text' || props.variant === 'plain';
  
  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let hoverClass = '';

  const colorMap: Record<string, { bg: string, text: string, border: string, bgHover: string, textHover: string }> = {
    primary: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600', bgHover: 'hover:bg-blue-700', textHover: 'text-blue-500' },
    secondary: { bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-500', bgHover: 'hover:bg-gray-600', textHover: 'text-gray-300' },
    white: { bg: 'bg-white', text: 'text-gray-900', border: 'border-white', bgHover: 'hover:bg-gray-100', textHover: 'text-white' },
    success: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600', bgHover: 'hover:bg-green-700', textHover: 'text-green-500' },
  };

  const scheme = colorMap[props.color || 'primary'] || { 
    bg: `bg-${props.color}-600`, text: 'text-white', border: `border-${props.color}-600`, bgHover: `hover:bg-${props.color}-700`, textHover: `text-${props.color}-500` 
  };

  if (isOutlined) {
    bgClass = 'bg-transparent';
    textClass = scheme.textHover;
    borderClass = `border-2 ${scheme.border}`;
    hoverClass = `hover:bg-gray-800/50`;
  } else if (isText) {
    bgClass = 'bg-transparent';
    textClass = props.color === 'white' ? 'text-white' : scheme.textHover;
    hoverClass = 'hover:bg-white/10';
  } else {
    bgClass = scheme.bg;
    textClass = scheme.text;
    hoverClass = scheme.bgHover;
  }

  const isIconOnly = !!props.icon && props.icon !== true && !props.block;
  
  let sizeClass = '';
  if (isIconOnly && !slotsUsed()) {
    sizeClass = props.size === 'small' ? 'p-1' : props.size === 'large' ? 'p-3' : 'p-2';
  } else {
    sizeClass = props.size === 'x-large' ? 'px-8 py-4 text-lg' 
              : props.size === 'large' ? 'px-6 py-3 text-base' 
              : props.size === 'small' ? 'px-3 py-1.5 text-sm' 
              : 'px-4 py-2 text-sm';
  }

  const blockClass = props.block ? 'w-full flex' : 'inline-flex';
  
  let roundedClass = 'rounded-md';
  if (props.rounded === 'xl' || props.rounded === true || (isIconOnly && !slotsUsed())) {
    roundedClass = 'rounded-full';
  } else if (props.rounded === 'lg') {
    roundedClass = 'rounded-lg';
  }
  
  const shadowClass = props.variant === 'elevated' ? 'shadow-md' : '';

  return [bgClass, textClass, borderClass, hoverClass, sizeClass, blockClass, roundedClass, shadowClass, 'items-center justify-center font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'];
});

const slots = useSlots();
const slotsUsed = () => {
    return !!slots.default;
}

</script>

<template>
  <button :class="btnClasses" @click="$emit('click')">
    <Icon v-if="typeof icon === 'string' && !slotsUsed()" :icon="icon" :size="size === 'x-large' ? 'large' : 'default'" class="shrink-0" />
    <span v-if="typeof icon === 'string' && slotsUsed()" class="mr-2">
      <Icon :icon="icon" :size="size === 'x-large' ? 'large' : 'default'" />
    </span>
    <slot></slot>
  </button>
</template>
