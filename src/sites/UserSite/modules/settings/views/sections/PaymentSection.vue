<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '../../store/settings.store'
import type { PaymentGate } from '../../types'
import Btn from '@/components/atoms/Btn.vue'
import Input from '@/components/atoms/Input.vue'
import Card from '@/components/atoms/Card.vue'
import Switch from '@/components/atoms/Switch.vue'
import Icon from '@/components/atoms/Icon.vue'
import Divider from '@/components/atoms/Divider.vue'
import Alert from '@/components/atoms/Alert.vue'
import ExpandTransition from '@/components/atoms/ExpandTransition.vue'

const settingsStore = useSettingsStore()

const paymentGates = ref<PaymentGate[]>([
  {
    id: 'cash',
    name: 'Tiền mặt',
    is_enabled: true,
    description: 'Thanh toán trực tiếp tại quầy',
    config: {}
  },
  {
    id: 'momo',
    name: 'Momo',
    is_enabled: false,
    description: 'Thanh toán qua ví điện tử Momo (QR Code)',
    config: {
      partnerCode: '',
      accessKey: '',
      secretKey: ''
    }
  },
  {
    id: 'stripe',
    name: 'Stripe',
    is_enabled: false,
    description: 'Thanh toán qua thẻ quốc tế (Visa, Mastercard)',
    config: {
      publishableKey: '',
      secretKey: ''
    }
  }
])

const successMessage = ref('')
const errorMessage = ref('')

const handleSave = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await settingsStore.updatePaymentMethods({ gates: paymentGates.value })
    successMessage.value = 'Cập nhật cấu hình thanh toán thành công!'
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra khi cập nhật thanh toán.'
  }
}
</script>

<template>
  <div class="space-y-6">
    <Card  v-for="gate in paymentGates" :key="gate.id" class="p-6 transition-all duration-300" :class="{ 'ring-2 ring-primary/20': gate.is_enabled }">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icon 
              color="primary" 
              size="large"
              :icon="gate.id === 'cash' ? 'mdi-cash' : gate.id === 'momo' ? 'mdi-wallet' : 'mdi-credit-card'"
            />
          </div>
          <div>
            <h3 class="font-bold text-lg">{{ gate.name }}</h3>
            <p class="text-sm text-slate-500">{{ gate.description }}</p>
          </div>
        </div>
        <Switch v-model="gate.is_enabled" color="primary" />
      </div>

      <ExpandTransition>
        <div v-if="gate.is_enabled && Object.keys(gate.config).length > 0">
          <Divider class="mb-6" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              v-for="(value, key) in gate.config" 
              :key="key"
              v-model="gate.config[key]"
              :label="key.charAt(0).toUpperCase() + key.slice(1)"
              type="password"
              placeholder="Nhập giá trị cấu hình"
            />
          </div>
        </div>
      </ExpandTransition>
    </Card>

    <div class="flex justify-end pt-4">
      <Alert v-if="successMessage" type="success" variant="tonal" density="compact" class="flex-1 mr-4">{{ successMessage }}</Alert>
      <Alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="flex-1 mr-4">{{ errorMessage }}</Alert>
      <Btn color="primary" @click="handleSave" :loading="settingsStore.loading">Lưu thiết lập</Btn>
    </div>
  </div>
</template>
