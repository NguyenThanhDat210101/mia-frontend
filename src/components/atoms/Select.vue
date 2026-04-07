<script setup lang="ts">
import Icon from './Icon.vue';
import type { SelectProps } from './types';

withDefaults(defineProps<SelectProps>(), {
  icon: 'mdi-chevron-down',
  placeholder: 'Chọn một giá trị'
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full group">
    <div v-if="leftIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors z-10">
      <Icon :icon="leftIcon" size="small"></Icon>
    </div>

    <select 
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="block w-full py-2.5 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700/50 rounded-xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner cursor-pointer"
      :class="[
        leftIcon ? 'pl-10' : 'px-4',
        'pr-10',
        $props.class
      ]"
    >
      <option value="" disabled selected>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value" class="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
        {{ opt.label }}
      </option>
    </select>
    
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-500 group-hover:text-blue-500 transition-colors">
       <Icon :icon="icon" class="text-xl"></Icon>
    </div>
  </div>
</template>
