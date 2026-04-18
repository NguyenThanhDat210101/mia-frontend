<script setup lang="ts">
import type { AppProps } from './types'

defineProps<AppProps>()
</script>

<template>
  <v-app :theme="theme">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-app>
</template>
