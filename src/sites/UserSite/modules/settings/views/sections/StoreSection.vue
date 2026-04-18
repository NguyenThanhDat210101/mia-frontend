<script setup lang="ts">
import { ref } from 'vue'
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
  address: '', // Mocked or get from user.store if available
  description: '',
  logo_url: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const handleSave = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await settingsStore.updateStore(formData.value)
    successMessage.value = 'Cập nhật thông tin cửa hàng thành công!'
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra khi cập nhật cửa hàng.'
  }
}
</script>

<template>
  <Card class="p-6">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
        <Img v-if="formData.logo_url" :src="formData.logo_url" cover />
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
        <Input v-model="formData.logo_url" label="URL Logo" placeholder="https://..." />
      </div>

      <Input v-model="formData.address" label="Địa chỉ" placeholder="Số 1, đường ABC, quận XYZ..." />
      
      <div class="flex justify-end gap-3 pt-4">
        <Alert v-if="successMessage" type="success" variant="tonal" density="compact" class="flex-1 mr-4">{{ successMessage }}</Alert>
        <Alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="flex-1 mr-4">{{ errorMessage }}</Alert>
        <Btn type="submit" color="primary" :loading="settingsStore.loading">Lưu thay đổi</Btn>
      </div>
    </form>
  </Card>
</template>
