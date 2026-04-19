<script setup lang="ts">
import Icon from './Icon.vue';

const props = withDefaults(defineProps<{
  modelValue?: string | number | null;
  placeholder?: string;
  icon?: string;
  inputmode?: 'numeric' | 'tel' | 'decimal';
  maxlength?: number;
  class?: any;
}>(), {
  inputmode: 'numeric'
});

const emit = defineEmits(['update:modelValue', 'input']);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
};
</script>

<template>
  <div class="relative w-full">
    <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon :icon="icon" size="small" color="secondary"></Icon>
    </div>
    <input 
      :value="modelValue"
      @input="handleInput"
      type="number"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :class="[
        'block w-full py-2.5 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner [appearance:textfield]',
        icon ? 'pl-10 pr-3' : 'px-4',
        props.class
      ]"
    />
  </div>
</template>