<script setup lang="ts">
import Icon from './Icon.vue';
import type { InputDateProps } from './types';

withDefaults(defineProps<InputDateProps>(), {
  icon: 'mdi-calendar',
  required: false
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full group">
    <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors z-10">
      <Icon :icon="icon" size="small"></Icon>
    </div>
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="date" 
      :required="required" 
      class="block w-full py-2.5 bg-neutral-800 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner appearance-none custom-date-input relative"
      :class="[
        icon ? 'pl-10 pr-3' : 'px-4',
        $props.class
      ]"
    />
  </div>
</template>

<style scoped>
.custom-date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
  opacity: 0.6;
  position: absolute;
  right: 12px;
}
.custom-date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
