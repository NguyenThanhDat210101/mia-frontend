<script setup lang="ts">
// Main Layout
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white flex flex-col font-sans">
    
    <!-- Navbar Tailwind -->
    <header class="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer" @click="$router.push('/')">
            <v-icon icon="mdi-storefront" color="primary"></v-icon>
            <span class="font-black text-xl tracking-tight">
              Store<span class="text-primary">Manager</span>
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <v-btn variant="text" to="/pricing" class="hidden sm:flex text-none font-medium text-grey-lighten-1" hover>
              Bảng giá
            </v-btn>
            <v-btn class="text-none font-bold tracking-wide" variant="flat" color="primary" prepend-icon="mdi-login">
              Đăng nhập
            </v-btn>
          </div>
          
        </div>
      </div>
    </header>

    <!-- Page Content (Router View) -->
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Connection Badge -->
    <div class="fixed bottom-6 right-6 z-50 pointer-events-none">
      <v-alert
        color="success"
        variant="outlined"
        class="text-left font-bold backdrop-blur-xl bg-success/10 border-success/30 rounded-xl shadow-2xl pointer-events-auto"
        density="compact"
      >
        Trực tuyến (Reverb)
        <template v-slot:prepend>
          <div class="relative flex h-3 w-3 mr-3 mt-1">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </div>
        </template>
      </v-alert>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
