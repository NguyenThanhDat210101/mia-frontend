<script setup lang="ts">
import type { ImgProps } from './types'

defineProps<ImgProps>()
</script>

<template>
  <v-img 
    :src="src" 
    :alt="alt" 
    :cover="cover" 
    :height="height" 
    :width="width" 
    :class="class"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-img>
</template>
