<script setup lang="ts">
import type { LabelProps } from './types';
defineProps<LabelProps>();
</script>

<template>
  <label :class="['block text-sm font-medium text-gray-300 mb-1', $props.class]">
    <slot></slot>
  </label>
</template>
