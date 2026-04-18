<script setup lang="ts">
import type { AlertProps } from './types'

defineProps<AlertProps>()
</script>

<template>
  <v-alert 
    :type="type"
    :variant="variant"
    :density="density"
    :closable="closable"
    :class="class"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-alert>
</template>
