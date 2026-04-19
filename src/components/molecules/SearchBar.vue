<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'

const props = defineProps<{
  dateFilter: string
  tableFilter: string | number
  phoneFilter: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:dateFilter', value: string): void
  (e: 'update:tableFilter', value: string | number): void
  (e: 'update:phoneFilter', value: string): void
  (e: 'refresh'): void
  (e: 'clear'): void
}>()

const updateDate = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:dateFilter', value)
  emit('refresh')
}

const updateTable = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:tableFilter', value)
  emit('refresh')
}

const updatePhone = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:phoneFilter', value)
  emit('refresh')
}
</script>

<template>
  <div class="mb-4 -mx-4 px-4">
    <div class="flex items-center gap-3 bg-white dark:bg-neutral-800/40 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2">
      <!-- Date -->
      <div class="flex items-center gap-2">
        <Icon icon="mdi-calendar" size="small" class="text-slate-400 dark:text-gray-500" />
        <input 
          type="date" 
          :value="dateFilter"
          @input="updateDate"
          class="bg-transparent text-sm font-medium text-slate-700 dark:text-gray-300 focus:outline-none w-28"
        />
      </div>

      <div class="w-px h-6 bg-slate-200 dark:bg-white/10"></div>

      <!-- Table Number -->
      <div class="flex items-center gap-2">
        <Icon icon="mdi-table-chair" size="small" class="text-slate-400 dark:text-gray-500" />
        <input 
          type="number"
          inputmode="numeric"
          :value="tableFilter"
          @input="updateTable"
          placeholder="Bàn"
          class="bg-transparent text-sm font-medium text-slate-700 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none w-16 [appearance:textfield]"
        />
      </div>

      <!-- Phone -->
      <div class="flex items-center gap-2">
        <Icon icon="mdi-phone" size="small" class="text-slate-400 dark:text-gray-500" />
        <input 
          type="tel"
          inputmode="numeric"
          maxlength="11"
          :value="phoneFilter"
          @input="updatePhone"
          placeholder="SĐT"
          class="bg-transparent text-sm font-medium text-slate-700 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none w-24"
        />
      </div>

      <div class="ml-auto flex items-center gap-2">
        <button 
          class="p-2 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          @click="emit('clear')"
          title="Xóa lọc"
        >
          <Icon icon="mdi-filter-remove" size="small" />
        </button>
        <button 
          class="p-2 rounded-lg text-slate-400 dark:text-gray-500 hover:text-primary transition-colors"
          :class="{ 'animate-spin': loading }"
          @click="emit('refresh')"
        >
          <Icon icon="mdi-refresh" size="small" />
        </button>
      </div>
    </div>
  </div>
</template>