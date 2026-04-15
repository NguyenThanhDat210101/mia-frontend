<script setup lang="ts">
import { computed } from 'vue';
import type { SwitchProps } from './types';

const props = withDefaults(defineProps<SwitchProps>(), {
  color: 'primary',
  hideDetails: true
});

const emit = defineEmits(['update:modelValue']);

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<template>
  <v-switch
    v-model="modelValue"
    :label="label"
    :color="color"
    :disabled="disabled"
    :hide-details="hideDetails"
    class="custom-switch"
  ></v-switch>
</template>

<style scoped>
:deep(.v-selection-control) {
  min-height: auto;
}
:deep(.v-label) {
  font-weight: 600;
  opacity: 1;
  font-size: 0.9375rem;
}
</style>
