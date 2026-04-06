<script setup lang="ts">
import { computed } from 'vue';
import type { AvatarProps } from './types';

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 40,
  color: 'primary',
});

const avatarClasses = computed(() => {
  return [
    props.class,
    'shadow-sm overflow-hidden'
  ];
});

const iconSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size * 0.6;
  }
  return 'default';
});
</script>

<template>
  <v-avatar
    :size="size"
    :color="color"
    :class="avatarClasses"
  >
    <v-img v-if="src" :src="src" :alt="alt"></v-img>
    <v-icon v-else-if="icon" color="white" :size="iconSize">{{ icon }}</v-icon>
    <slot v-else></slot>
  </v-avatar>
</template>
