<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '../../store/settings.store'
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store'
import Btn from '@/components/atoms/Btn.vue'
import Input from '@/components/atoms/Input.vue'
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'
import Img from '@/components/atoms/Img.vue'
import Alert from '@/components/atoms/Alert.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const formData = ref({
  name: authStore.user?.store?.name || '',
  address: authStore.user?.store?.address || '',
  prefecture: authStore.user?.store?.prefecture || '',
  city: authStore.user?.store?.city || '',
  phone: authStore.user?.store?.phone || '',
  email: authStore.user?.store?.email || '',
  description: authStore.user?.store?.description || '',
  avatar: authStore.user?.store?.avatar || '',
  timezone: authStore.user?.store?.timezone || 'Asia/Ho_Chi_Minh'
})

const successMessage = ref('')
const errorMessage = ref('')
const openingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const openingHours = ref<Array<{ day: string; open: string; close: string }>>([])

onMounted(async () => {
  const storeId = authStore.user?.store?.id
  if (storeId) {
    try {
      await settingsStore.fetchStoreProfile(storeId)
      if (settingsStore.profile) {
        formData.value = {
          name: settingsStore.profile.name || formData.value.name,
          address: settingsStore.profile.address || '',
          prefecture: settingsStore.profile.prefecture || '',
          city: settingsStore.profile.city || '',
          phone: settingsStore.profile.phone || '',
          email: settingsStore.profile.email || '',
          description: settingsStore.profile.description || '',
          avatar: settingsStore.profile.avatar || '',
          timezone: settingsStore.profile.timezone || 'Asia/Ho_Chi_Minh'
        }
        openingHours.value = settingsStore.profile.opening_hours || []
      }
    } catch (e) {
      console.error('Failed to load store profile:', e)
    }
  }
})

const handleSave = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await settingsStore.updateStore({
      ...formData.value,
      opening_hours: openingHours.value
    })
    successMessage.value = 'Cập nhật thông tin cửa hàng thành công!'
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra khi cập nhật cửa hàng.'
  }
}

const addOpeningHours = () => {
  openingHours.value.push({ day: 'Monday', open: '08:00', close: '22:00' })
}

const removeOpeningHours = (index: number) => {
  openingHours.value.splice(index, 1)
}
</script>

<template>
  <Card class="p-6">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
        <Img v-if="formData.avatar" :src="formData.avatar" cover />
        <Icon v-else icon="mdi-storefront" size="large" color="primary" />
      </div>
      <div>
        <h3 class="text-lg font-bold">Thông tin cửa hàng</h3>
        <p class="text-sm text-slate-500">Thiết lập các thông tin công khai của thương hiệu</p>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input v-model="formData.name" label="Tên cửa hàng" placeholder="Ví dụ: Mia Cafe" required />
        <Input v-model="formData.avatar" label="URL Avatar/Logo" placeholder="https://..." />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input v-model="formData.phone" label="Số điện thoại" placeholder="0xxx xxx xxx" />
        <Input v-model="formData.email" label="Email" placeholder="store@example.com" />
      </div>

      <Input v-model="formData.address" label="Địa chỉ" placeholder="Số 1, đường ABC, quận XYZ..." />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input v-model="formData.prefecture" label="Quận/Huyện" placeholder="Quận 1" />
        <Input v-model="formData.city" label="Thành phố" placeholder="Hồ Chí Minh" />
      </div>

      <Input v-model="formData.description" label="Mô tả" placeholder="Mô tả về cửa hàng..." />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input v-model="formData.timezone" label="Múi giờ" placeholder="Asia/Ho_Chi_Minh" />
      </div>

      <div class="border-t border-slate-200 dark:border-white/10 pt-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold">Giờ mở cửa</h4>
          <Btn type="button" variant="tonal" size="small" @click="addOpeningHours">Thêm ngày</Btn>
        </div>

        <div v-if="openingHours.length === 0" class="text-slate-500 text-sm">
          Chưa có giờ mở cửa. Nhấn "Thêm ngày" để thiết lập.
        </div>

        <div v-for="(hours, index) in openingHours" :key="index" class="flex items-center gap-3 mb-3">
          <select v-model="hours.day" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
            <option v-for="day in openingDays" :key="day" :value="day">{{ day }}</option>
          </select>
          <Input v-model="hours.open" type="time" class="w-32" />
          <span class="text-slate-500">-</span>
          <Input v-model="hours.close" type="time" class="w-32" />
          <Btn type="button" variant="text" size="small" color="error" @click="removeOpeningHours(index)">
            <Icon icon="mdi-delete" />
          </Btn>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 pt-4">
        <Alert v-if="successMessage" type="success" variant="tonal" density="compact" class="flex-1 mr-4">{{ successMessage }}</Alert>
        <Alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="flex-1 mr-4">{{ errorMessage }}</Alert>
        <Btn type="submit" color="primary" :loading="settingsStore.loading">Lưu thay đổi</Btn>
      </div>
    </form>
  </Card>
</template>
