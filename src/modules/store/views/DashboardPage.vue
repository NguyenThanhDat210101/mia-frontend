<script setup lang="ts">
// Dashboard View
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    
    <div class="mb-8">
      <h1 class="text-3xl font-black mb-2">Tổng quan Cửa hàng</h1>
      <p class="text-medium-emphasis">Chào mừng bạn quay lại hệ thống quản trị Store Manager.</p>
    </div>

    <!-- Alert Requirement -->
    <v-alert
      color="warning"
      variant="tonal"
      icon="mdi-alert"
      class="mb-8 rounded-xl border border-warning/30 bg-warning/5 backdrop-blur-sm"
      prominent
    >
      <div class="font-medium text-base">
        Tài khoản của bạn hiện chưa có Gói dịch vụ (Subscription) nào. Bạn vui lòng nâng cấp để mở khóa đầy đủ tính năng.
      </div>
      
      <template v-slot:append>
        <v-btn color="warning" variant="elevated" to="/pricing" class="font-black ml-4 text-none tracking-wide rounded-lg" elevation="4">
          XEM BẢNG GIÁ
        </v-btn>
      </template>
    </v-alert>

    <!-- Overview Stats with Tailwind Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <v-card variant="flat" color="grey-darken-4" class="p-6 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <v-icon icon="mdi-currency-usd" size="120"></v-icon>
        </div>
        <div class="text-medium-emphasis text-sm font-bold tracking-wide mb-2 uppercase">Doanh thu hôm nay</div>
        <div class="text-4xl font-black text-white">0đ</div>
      </v-card>
      
      <v-card variant="flat" color="grey-darken-4" class="p-6 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-info/50 transition-colors">
        <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <v-icon icon="mdi-package-variant" size="120"></v-icon>
        </div>
        <div class="text-medium-emphasis text-sm font-bold tracking-wide mb-2 uppercase">Đơn hàng mới</div>
        <div class="text-4xl font-black text-white">0</div>
      </v-card>
      
      <v-card variant="flat" color="grey-darken-4" class="p-6 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-success/50 transition-colors">
        <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
           <v-icon icon="mdi-account-group" size="120"></v-icon>
        </div>
        <div class="text-medium-emphasis text-sm font-bold tracking-wide mb-2 uppercase">Khách hàng</div>
        <div class="text-4xl font-black text-white">0</div>
      </v-card>
      
    </div>
  </div>
</template>
