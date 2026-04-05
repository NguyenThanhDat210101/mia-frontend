<script setup lang="ts">
import { computed } from 'vue';
import type { SkeletonProps } from './types';

const props = withDefaults(defineProps<SkeletonProps>(), {
  type: 'text',
  rounded: 'md',
});

const skeletonClasses = computed(() => {
  const baseClasses = 'bg-gray-700/50 animate-pulse overflow-hidden relative';
  let typeClasses = '';
  let roundedClasses = '';

  // Type-specific logic
  switch (props.type) {
    case 'text':
      typeClasses = 'w-full h-4 my-2';
      break;
    case 'avatar':
      typeClasses = 'w-12 h-12 shrink-0';
      break;
    case 'button':
      typeClasses = 'w-32 h-10';
      break;
    case 'chip':
      typeClasses = 'w-20 h-6';
      break;
    case 'card':
      typeClasses = 'w-full h-48 p-6 flex flex-col gap-4';
      break;
    case 'image':
      typeClasses = 'w-full h-full min-h-[150px]';
      break;
  }

  // Rounded-specific logic
  switch (props.rounded) {
    case 'sm': roundedClasses = 'rounded-sm'; break;
    case 'md': roundedClasses = 'rounded-md'; break;
    case 'lg': roundedClasses = 'rounded-lg'; break;
    case 'xl': roundedClasses = 'rounded-xl'; break;
    case 'full': roundedClasses = 'rounded-full'; break;
    case 'none': roundedClasses = 'rounded-none'; break;
  }

  // Override type if avatar
  if (props.type === 'avatar') roundedClasses = 'rounded-full';

  return [baseClasses, typeClasses, roundedClasses, props.class];
});

const style = computed(() => {
  return {
    width: props.width,
    height: props.height,
  };
});
</script>

<template>
  <div v-if="type !== 'card'" :class="skeletonClasses" :style="style">
    <!-- Shimmer overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
  </div>

  <!-- Card preset for convenience -->
  <div v-else class="bg-gray-900 border border-white/5 rounded-3xl p-8 flex flex-col gap-4 animate-pulse relative overflow-hidden h-full">
     <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div class="flex-1 flex flex-col gap-2">
           <div class="w-1/2 h-4 bg-gray-700 rounded-md"></div>
           <div class="w-1/3 h-3 bg-gray-700/50 rounded-md"></div>
        </div>
     </div>
     <div class="w-full h-24 bg-gray-700/30 rounded-xl mt-4"></div>
     <div class="w-full h-10 bg-gray-700 rounded-xl mt-auto"></div>
     <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
  </div>
</template>

<style>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
