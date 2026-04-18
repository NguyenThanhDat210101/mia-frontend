<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store'
import apiClient from '@/core/api/client'
import { DAY_NAMES } from '@/core/constants'

// Atoms
import Btn from '@/components/atoms/Btn.vue'
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'
import Label from '@/components/atoms/Label.vue'
import Switch from '@/components/atoms/Switch.vue'

const router = useRouter()
const authStore = useAuthStore()
const isSubmitting = ref(false)
const isLoading = ref(true)

const dayNames = DAY_NAMES

const schedule = ref<any[]>([])

async function fetchShifts() {
  try {
    const response = await apiClient.get('/shifts')
    const apiShifts = response.data.data

    if (apiShifts && apiShifts.length > 0) {
      schedule.value = apiShifts.map((shift: any) => ({
        id: shift.id,
        name: dayNames[shift.day_of_week] || `Day ${shift.day_of_week}`,
        active: shift.day_of_week <= 5, // Default weekdays to active
        startTime: shift.start_time || (shift.day_of_week <= 5 ? '08:00' : '09:00'),
        endTime: shift.end_time || (shift.day_of_week <= 5 ? '18:00' : '12:00')
      }))
    }
  } catch (error) {
    console.error('Failed to fetch shifts:', error)
    // Fallback to static data if API fails
    schedule.value = [
      { id: 1, name: DAY_NAMES[1], active: true, startTime: '08:00', endTime: '18:00' },
      { id: 2, name: DAY_NAMES[2], active: true, startTime: '08:00', endTime: '18:00' },
      { id: 3, name: DAY_NAMES[3], active: true, startTime: '08:00', endTime: '18:00' },
      { id: 4, name: DAY_NAMES[4], active: true, startTime: '08:00', endTime: '18:00' },
      { id: 5, name: DAY_NAMES[5], active: true, startTime: '08:00', endTime: '18:00' },
      { id: 6, name: DAY_NAMES[6], active: false, startTime: '09:00', endTime: '12:00' },
      { id: 7, name: DAY_NAMES[0], active: false, startTime: '09:00', endTime: '12:00' },
    ]
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchShifts()
})

async function handleSave() {
  isSubmitting.value = true
  try {
    const activeShifts = schedule.value
      .filter(day => day.active)
      .map(day => ({
        day_of_week: day.name,
        start_time: day.startTime,
        end_time: day.endTime
      }))

    if (activeShifts.length === 0) {
      alert('Please select at least one working day.')
      return
    }

    await apiClient.post('/shifts', { shifts: activeShifts })
    
    if (authStore.user?.store) {
      authStore.user.store.is_setup_completed = true
    }
    
    router.push({ name: 'Dashboard' })
  } catch (error) {
    console.error('Failed to save shifts:', error)
    alert('Failed to save working hours. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-8 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_30%)]">
    <Card class="max-w-[680px] w-full p-8 md:p-12 !bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-fade-in">
      
      <div class="text-center mb-10">
        <div class="w-[72px] h-[72px] bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 text-white">
          <Icon icon="mdi-clock-outline" size="x-large" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold mb-3 text-white">Set Your Working Hours</h1>
        <p class="text-gray-400 text-base leading-relaxed">Let's personalize Mia for your store. Configure your typical weekly schedule to get started with bookings and management.</p>
      </div>

      <div class="flex flex-col gap-3 mb-10 min-h-[400px]">
        <template v-if="isLoading">
          <div v-for="i in 7" :key="i" class="h-16 bg-white/5 rounded-xl border border-white/[0.05] animate-pulse"></div>
        </template>
        <template v-else>
          <div v-for="day in schedule" :key="day.id" 
               class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] transition-all hover:bg-white/[0.05]"
               :class="{ 'opacity-50': !day.active }">
            
            <div class="flex items-center gap-2 mb-3 md:mb-0">
              <Switch v-model="day.active" color="primary"></Switch>
              <Label class="!mb-0 w-24 text-white !text-base">{{ day.name }}</Label>
            </div>
  
            <div class="flex items-center gap-3" v-if="day.active">
              <input type="time" v-model="day.startTime" 
                     class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors">
              <div class="text-[10px] uppercase tracking-wider text-gray-500 font-bold">to</div>
              <input type="time" v-model="day.endTime" 
                     class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors">
            </div>
            <div class="text-gray-500 italic text-sm" v-else>
              Closed
            </div>
          </div>
        </template>
      </div>

      <div class="text-center">
        <Btn color="primary" block size="x-large" rounded="lg" 
             icon="mdi-arrow-right"
             :loading="isSubmitting"
             @click="handleSave">
          Get Started
        </Btn>
        <div class="mt-5 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Icon icon="mdi-sparkles" size="small" color="primary" />
          <span>You can always fine-tune these hours later in Settings.</span>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
