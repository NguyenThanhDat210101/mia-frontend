<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/sites/UserSite/modules/auth/store/auth.store'
import { useSettingsStore } from '../../store/settings.store'
import Btn from '@/components/atoms/Btn.vue'
import Input from '@/components/atoms/Input.vue'
import Card from '@/components/atoms/Card.vue'
import Icon from '@/components/atoms/Icon.vue'
import Img from '@/components/atoms/Img.vue'
import Alert from '@/components/atoms/Alert.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const formData = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.userInfo?.phone || '',
  address: authStore.user?.userInfo?.address || '',
  avatar: authStore.user?.userInfo?.avatar || ''
})

const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    await settingsStore.fetchProfile()
    if (settingsStore.profile) {
      formData.value.name = settingsStore.profile.name || formData.value.name
    }
  } catch (e) {
    console.error('Failed to load profile:', e)
  }
})

const handleSave = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await settingsStore.updateProfile(formData.value)
    successMessage.value = 'Cập nhật thông tin cá nhân thành công!'
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra khi cập nhật thông tin.'
  }
}
</script>

<template>
  <Card class="p-6">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
        <Img v-if="formData.avatar" :src="formData.avatar" cover />
        <Icon v-else icon="mdi-account" size="large" color="primary" />
      </div>
      <div>
        <h3 class="text-lg font-bold">Thông tin cá nhân</h3>
        <p class="text-sm text-slate-500">Quản lý các thông tin cơ bản của bạn</p>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input v-model="formData.name" label="Họ và tên" placeholder="Nhập họ và tên của bạn" required />
        <Input v-model="formData.email" label="Email" placeholder="email@example.com" disabled />
        <Input v-model="formData.phone" label="Số điện thoại" placeholder="0xxx xxx xxx" />
        <Input v-model="formData.avatar" label="URL Ảnh đại diện" placeholder="https://..." />
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <Alert v-if="successMessage" type="success" variant="tonal" density="compact" class="flex-1 mr-4">{{ successMessage }}</Alert>
        <Alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="flex-1 mr-4">{{ errorMessage }}</Alert>
        <Btn type="submit" color="primary" :loading="settingsStore.loading">Lưu thay đổi</Btn>
      </div>
    </form>
  </Card>
</template>
