<script setup lang="ts">
import type { WindowItemProps } from './types'

defineProps<WindowItemProps>()
</script>

<template>
  <v-window-item :value="value">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-window-item>
</template>
