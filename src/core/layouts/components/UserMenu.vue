<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/sites/UserSite/modules/auth/store/auth.store";
import { RouteName, RoutePath } from "@/router/types";
import { RoleName } from "@/core/enums/role.enum";
import Menu from "@/components/atoms/Menu.vue";
import Btn from "@/components/atoms/Btn.vue";
import Avatar from "@/components/atoms/Avatar.vue";
import Card from "@/components/atoms/Card.vue";
import Divider from "@/components/atoms/Divider.vue";
import Chip from "@/components/atoms/Chip.vue";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  router.push(RoutePath.Home);
  authStore.logout();
};
</script>

<template>
  <Menu min-width="220px">
    <template v-slot:activator="{ props }">
      <Btn variant="text" rounded v-bind="props">
        <Avatar icon="mdi-account" color="primary" />
      </Btn>
    </template>

    <Card
      class="p-4 mt-2 border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md"
      variant="flat"
    >
      <div class="flex flex-col items-center">
        <Avatar icon="mdi-account" color="primary" class="mb-2" :size="48" />
        <h3 class="text-slate-900 dark:text-white font-bold text-center">
          {{ authStore.user?.name || "Người dùng" }}
        </h3>
        <p class="text-slate-500 dark:text-gray-400 text-xs mt-0.5">
          {{ authStore.user?.email }}
        </p>

        <div v-if="authStore.user?.store?.active_plan" class="mt-3">
          <Chip
            :color="
              authStore.user.store.active_plan.slug === 'free'
                ? 'secondary'
                : 'primary'
            "
            size="small"
            variant="tonal"
          >
            {{ authStore.user.store.active_plan.name }}
          </Chip>
        </div>

        <Divider class="my-4" />

        <div class="w-full space-y-1">
          <Btn
            variant="text"
            color="default"
            block
            icon="mdi-view-dashboard-outline"
            class="!justify-start !text-slate-700 dark:!text-gray-300 hover:!text-primary transition-colors"
            @click="
              router.push({
                name:
                  authStore.user?.role?.name === RoleName.SystemAdmin
                    ? RouteName.AdminDashboard
                    : RouteName.Dashboard,
              })
            "
          >
            Dashboard
          </Btn>

          <Btn
            variant="text"
            color="default"
            block
            icon="mdi-cog-outline"
            class="!justify-start !text-slate-700 dark:!text-gray-300 hover:!text-primary transition-colors"
            @click="router.push({ name: RouteName.Settings })"
          >
            Cài đặt
          </Btn>

          <Btn
            variant="text"
            color="default"
            block
            icon="mdi-logout"
            class="!justify-start !text-red-500 hover:!text-red-400"
            @click="handleLogout"
          >
            Đăng xuất
          </Btn>
        </div>
      </div>
    </Card>
  </Menu>
</template>
