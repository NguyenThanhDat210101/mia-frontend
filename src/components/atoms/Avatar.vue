<script setup lang="ts">
import { computed } from 'vue';
import type { AvatarProps } from './types';
import Img from './Img.vue';
import Icon from './Icon.vue';

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'default',
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
    <Img v-if="src" :src="src" :alt="alt" />
    <Icon v-else-if="icon" :icon="icon" color="white" :size="iconSize" />
    <slot v-else></slot>
  </v-avatar>
</template>
