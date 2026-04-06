<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../modules/auth/store/auth.store'
import { RouteName } from '../../router/types'
import Icon from '../../components/atoms/Icon.vue'
import Btn from '../../components/atoms/Btn.vue'
import Avatar from '../../components/atoms/Avatar.vue'
import Menu from '../../components/atoms/Menu.vue'
import Card from '../../components/atoms/Card.vue'
import Divider from '../../components/atoms/Divider.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: RouteName.SignIn })
}
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white flex flex-col font-sans">
    
    <!-- Navbar Tailwind -->
    <header class="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/')">
            <Icon icon="mdi-storefront" color="primary" size="large"></Icon>
            <span class="font-black text-xl tracking-tight">
              Store<span class="text-primary">Manager</span>
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <Btn variant="text" color="white" class="hidden sm:flex text-gray-400" @click="router.push('/pricing')">
              Bảng giá
            </Btn>
            <!-- User Menu or Login Button -->
            <template v-if="!authStore.isAuthenticated">
              <Btn color="primary" icon="mdi-login" @click="router.push({ name: RouteName.SignIn })">
                Đăng nhập
              </Btn>
            </template>
            <template v-else>
              <Menu min-width="220px">
                <template v-slot:activator="{ props }">
                  <Btn variant="text" rounded v-bind="props">
                    <Avatar icon="mdi-account" color="primary" />
                  </Btn>
                </template>
                
                <Card class="p-4 mt-2 border border-white/10" variant="flat">
                  <div class="flex flex-col items-center">
                    <Avatar icon="mdi-account" color="primary" class="mb-2" :size="48" />
                    <h3 class="text-white font-bold text-center">{{ authStore.user?.name || 'Người dùng' }}</h3>
                    <p class="text-gray-400 text-xs mt-0.5">{{ authStore.user?.email }}</p>
                    
                    <Divider class="my-4" />
                    
                    <div class="w-full space-y-1">
                      <Btn
                        variant="text"
                        block
                        icon="mdi-view-dashboard-outline"
                        class="!justify-start text-gray-300 hover:!text-white"
                        @click="router.push({ name: RouteName.Dashboard })"
                      >
                        Dashboard
                      </Btn>
                      
                      <Btn
                        variant="text"
                        block
                        icon="mdi-logout"
                        class="!justify-start text-red-400 hover:!text-red-300"
                        @click="handleLogout"
                      >
                        Đăng xuất
                      </Btn>
                    </div>
                  </div>
                </Card>
              </Menu>
            </template>
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
      <div class="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl shadow-2xl backdrop-blur-xl pointer-events-auto">
        <div class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        <span class="text-green-500 font-bold text-sm">Trực tuyến (Reverb)</span>
      </div>
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
