<script setup lang="ts">
import type { DialogProps } from './types'

defineProps<DialogProps>()
defineEmits(['update:modelValue'])
</script>

<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    :max-width="maxWidth" 
    :persistent="persistent"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-dialog>
</template>
