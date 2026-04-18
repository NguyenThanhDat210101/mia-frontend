<script setup lang="ts">
import type { WindowProps } from './types'

defineProps<WindowProps>()
defineEmits(['update:modelValue'])
</script>

<template>
  <v-window 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    :class="class"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-window>
</template>
