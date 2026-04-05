<script setup lang="ts">
import Icon from './Icon.vue';
import type { InputProps } from './types';

withDefaults(defineProps<InputProps>(), {
  type: 'text',
  required: false
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full">
    <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon :icon="icon" size="small" color="secondary"></Icon>
    </div>
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :type="type" 
      :required="required" 
      :placeholder="placeholder"
      :class="[
        'block w-full py-2.5 bg-neutral-800 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner',
        icon ? 'pl-10 pr-3' : 'px-4',
        error ? 'border-red-500 focus:ring-red-500/50' : '',
        $props.class
      ]"
    />
    <p v-if="error" class="mt-1 text-xs text-red-500 px-1">{{ error }}</p>
  </div>
</template>
