<script setup lang="ts">
// Span Atom
defineProps<{
  class?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | 'large';
}>();
</script>

<template>
  <span :class="[
    color ? (['primary', 'secondary', 'success', 'warning', 'error'].includes(color) ? `text-${color}` : color) : '',
    size === 'xs' ? 'text-xs' : 
    size === 'sm' ? 'text-sm' : 
    size === 'lg' ? 'text-lg' : 
    size === 'xl' ? 'text-xl' : 
    size === '2xl' ? 'text-2xl' : 
    size === '3xl' ? 'text-3xl' : 
    size === 'large' ? 'text-lg md:text-xl' : 'text-base',
    $props.class
  ]">
    <slot></slot>
  </span>
</template>
