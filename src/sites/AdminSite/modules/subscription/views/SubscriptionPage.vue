<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import Card from "@/components/atoms/Card.vue";
import Btn from "@/components/atoms/Btn.vue";
import Icon from "@/components/atoms/Icon.vue";
import Chip from "@/components/atoms/Chip.vue";
import Divider from "@/components/atoms/Divider.vue";
import Skeleton from "@/components/atoms/Skeleton.vue";
import Input from "@/components/atoms/Input.vue";
import Switch from "@/components/atoms/Switch.vue";
import type { Plan, PlanRequest } from "../types";
import { useAdminSubscriptionStore } from "../store/admin-subscription.store";
import { storeToRefs } from "pinia";

const adminSubscriptionStore = useAdminSubscriptionStore();
const { plans, loading: isLoading } = storeToRefs(adminSubscriptionStore);

const deleteDialog = ref(false);
const planToDelete = ref<Plan | null>(null);

// Inline Editing State
const editingId = ref<number | null>(null); // null: none, -1: new, >0: specific plan
const editingForm = reactive<PlanRequest>({
  name: "",
  slug: "",
  description: [],
  price: 0,
  duration_months: 1,
  is_active: true,
  is_popular: false,
});

const newFeature = ref("");

const resetForm = () => {
  editingForm.name = "";
  editingForm.slug = "";
  editingForm.description = [];
  editingForm.price = 0;
  editingForm.duration_months = 1;
  editingForm.is_active = true;
  editingForm.is_popular = false;
  newFeature.value = "";
  editingId.value = null;
};

const startEditing = (plan: Plan) => {
  editingId.value = plan.id;
  editingForm.name = plan.name;
  editingForm.slug = plan.slug;
  editingForm.description = [...plan.description];
  editingForm.price = plan.price;
  editingForm.duration_months = plan.duration_months;
  editingForm.is_active = plan.is_active;
  editingForm.is_popular = plan.is_popular;
  newFeature.value = "";
};

const startCreating = () => {
  resetForm();
  editingId.value = -1; // -1 represents a new plan being created
};

const cancelEditing = () => {
  resetForm();
};

const addFeature = () => {
  if (newFeature.value.trim()) {
    editingForm.description.push(newFeature.value.trim());
    newFeature.value = "";
  }
};

const removeFeature = (index: number) => {
  editingForm.description.splice(index, 1);
};

const savePlan = async () => {
  addFeature(); // Ensure pending feature is added before saving
  try {
    if (editingId.value && editingId.value > 0) {
      await adminSubscriptionStore.updatePlan(editingId.value, {
        ...editingForm,
      });
    } else if (editingId.value === -1) {
      await adminSubscriptionStore.createPlan({ ...editingForm });
    }
    resetForm();
  } catch (err) {
    alert("Có lỗi xảy ra khi lưu gói dịch vụ.");
  }
};

const confirmDelete = (plan: Plan) => {
  planToDelete.value = plan;
  deleteDialog.value = true;
};

const deletePlan = async () => {
  if (planToDelete.value) {
    try {
      await adminSubscriptionStore.deletePlan(planToDelete.value.id);
      deleteDialog.value = false;
      planToDelete.value = null;
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa gói dịch vụ.");
    }
  }
};

onMounted(() => {
  adminSubscriptionStore.fetchPlans();
});

const SLUG_DESCRIPTIONS: Record<string, string> = {
  free: "Trải nghiệm đầy đủ tính năng trong 1 tháng",
  monthly: "Thanh toán linh hoạt từng tháng",
  quarterly: "Chống gián đoạn, tiết kiệm hơn",
  yearly: "Đầu tư dài hạn, tối ưu mọi chi phí",
};
</script>

<template>
  <div class="space-y-8 pb-12 w-full">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Quản lý Gói dịch vụ
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          Sửa đổi thông tin trực tiếp trên bảng giá.
        </p>
      </div>
      <Btn
        v-if="editingId === null"
        icon="mdi-plus"
        color="primary"
        size="large"
        rounded="lg"
        class="shadow-lg shadow-blue-500/20"
        :loading="isLoading"
        @click="startCreating"
      >
        Tạo gói mới
      </Btn>
    </div>

    <!-- Main Content (Skeleton) -->
    <div
      v-if="isLoading && plans.length === 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Skeleton v-for="n in 3" :key="n" type="card" class="h-[500px]" />
    </div>

    <!-- Grid Container -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
    >
      <!-- List Plans -->
      <template v-for="plan in plans" :key="plan.id">
        <!-- VIEW MODE -->
        <Card
          v-if="editingId !== plan.id"
          class="rounded-3xl flex flex-col relative transition-all duration-300 group h-full"
          :class="[
            plan.is_popular
              ? 'border-blue-500 ring-2 ring-blue-500 z-10 shadow-xl'
              : 'border-slate-200 dark:border-white/10 shadow-md',
          ]"
          variant="flat"
          border
        >
          <div v-if="plan.is_popular" class="absolute -top-3 right-6 z-20">
            <Chip color="primary" variant="elevated" size="small" class="font-bold">PHỔ BIẾN</Chip>
          </div>
          <div v-if="!plan.is_active" class="absolute -top-3 left-6 z-20">
            <Chip color="secondary" variant="elevated" size="small" class="font-bold">TẠM NGƯNG</Chip>
          </div>

          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Btn
              icon="mdi-pencil"
              size="small"
              color="white"
              rounded="full"
              class="shadow-sm"
              :loading="isLoading"
              @click="startEditing(plan)"
            />
            <Btn
              icon="mdi-delete"
              size="small"
              color="white"
              rounded="full"
              class="shadow-sm !text-red-500"
              :loading="isLoading"
              @click="confirmDelete(plan)"
            />
          </div>

          <div class="p-6 pb-4 text-center">
            <h3 class="text-xl font-bold mb-1 text-slate-900 dark:text-white">{{ plan.name }}</h3>
            <p class="text-slate-500 dark:text-slate-400 text-xs mb-4 min-h-[32px]">
              {{ SLUG_DESCRIPTIONS[plan.slug] || plan.slug }}
            </p>

            <div class="flex items-end justify-center">
              <span class="text-4xl font-black text-slate-900 dark:text-white leading-none">
                {{ plan.price === 0 ? "0đ" : `${Math.floor(plan.price / 1000).toLocaleString()}K` }}
              </span>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 mb-1">
                {{
                  plan.duration_months === 12
                    ? "/ năm"
                    : plan.duration_months === 1
                      ? "/ tháng"
                      : "/ " + plan.duration_months + " tháng"
                }}
              </span>
            </div>
          </div>

          <Divider class="mx-6 mb-4 border-slate-100 dark:border-white/5"></Divider>

          <div class="flex-1 px-6 pb-6 overflow-hidden">
            <ul class="flex flex-col gap-3">
              <li
                v-for="(feature, i) in plan.description"
                :key="i"
                class="flex items-start text-slate-700 dark:text-slate-200 text-sm"
              >
                <Icon icon="mdi-check-circle" color="primary" class="mr-2 shrink-0 mt-0.5" size="small"></Icon>
                <span class="leading-relaxed">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </Card>

        <!-- EDIT MODE -->
        <Card
          v-else
          class="rounded-3xl flex flex-col relative z-20 border-blue-500 ring-4 ring-blue-500/20 shadow-2xl h-full bg-blue-50/10"
          variant="flat"
          border
        >
          <div class="p-6 space-y-4 flex-1">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-blue-500 uppercase ml-1">Tên & Slug</label>
              <div class="flex gap-2">
                <Input v-model="editingForm.name" placeholder="Tên" class="!py-1.5 text-sm" />
                <Input v-model="editingForm.slug" placeholder="Slug" class="!py-1.5 text-sm" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-blue-500 uppercase ml-1">Giá & Thời hạn</label>
              <div class="flex gap-2">
                <Input v-model.number="editingForm.price" type="number" placeholder="Giá" class="!py-1.5 text-sm" />
                <Input v-model.number="editingForm.duration_months" type="number" placeholder="Tháng" class="!py-1.5 text-sm" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-blue-500 uppercase ml-1">Tính năng</label>
              <div class="flex gap-1">
                <Input v-model="newFeature" placeholder="Thêm..." class="!py-1 !text-xs" @keyup.enter="addFeature" />
                <Btn icon="mdi-plus" color="primary" size="small" rounded="lg" :loading="isLoading" @click="addFeature" />
              </div>
              <div class="mt-2 space-y-1 max-h-[150px] overflow-y-auto pr-1">
                <div v-for="(feat, idx) in editingForm.description" :key="idx" class="flex items-start justify-between p-1.5 bg-white dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span class="text-[11px] leading-tight mr-1">{{ feat }}</span>
                  <Btn icon="mdi-close" variant="text" size="small" class="!text-red-500 !p-0 !min-w-0 h-4 w-4" :loading="isLoading" @click="removeFeature(idx)" />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 pt-2">
              <Switch v-model="editingForm.is_active" label="Kích hoạt" class="!m-0" />
              <Switch v-model="editingForm.is_popular" label="Phổ biến/Hot" />
            </div>
          </div>

          <Divider class="border-blue-100 dark:border-blue-900/30"></Divider>

          <div class="p-4 flex gap-2">
            <Btn block variant="outlined" color="secondary" size="small" rounded="lg" :loading="isLoading" @click="cancelEditing">Hủy</Btn>
            <Btn block color="primary" size="small" rounded="lg" :loading="isLoading" @click="savePlan">Lưu</Btn>
          </div>
        </Card>
      </template>

      <!-- NEW PLAN CARD -->
      <template v-if="editingId === -1">
        <Card
          class="rounded-3xl flex flex-col relative z-20 border-green-500 ring-4 ring-green-500/20 shadow-2xl h-full bg-green-50/10"
          variant="flat"
          border
        >
          <div class="p-6 space-y-4 flex-1">
            <h4 class="text-sm font-black text-green-600 uppercase">Gói mới</h4>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Tên & Slug</label>
              <div class="flex gap-2">
                <Input v-model="editingForm.name" placeholder="Tên" class="!py-1.5 text-sm" />
                <Input v-model="editingForm.slug" placeholder="Slug" class="!py-1.5 text-sm" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Giá & Thời hạn</label>
              <div class="flex gap-2">
                <Input v-model.number="editingForm.price" type="number" placeholder="Giá" class="!py-1.5 text-sm" />
                <Input v-model.number="editingForm.duration_months" type="number" placeholder="Tháng" class="!py-1.5 text-sm" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Tính năng</label>
              <div class="flex gap-1">
                <Input v-model="newFeature" placeholder="Thêm..." class="!py-1 !text-xs" @keyup.enter="addFeature" />
                <Btn icon="mdi-plus" color="success" size="small" rounded="lg" :loading="isLoading" @click="addFeature" />
              </div>
              <div class="mt-2 space-y-1 max-h-[150px] overflow-y-auto pr-1">
                <div v-for="(feat, idx) in editingForm.description" :key="idx" class="flex items-start justify-between p-1.5 bg-white dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span class="text-[11px] leading-tight mr-1">{{ feat }}</span>
                  <Btn icon="mdi-close" variant="text" size="small" class="!text-red-500 !p-0 !min-w-0 h-4 w-4" :loading="isLoading" @click="removeFeature(idx)" />
                </div>
              </div>
            </div>
          </div>
          <Divider class="border-green-100 dark:border-green-900/30"></Divider>
          <div class="p-4 flex gap-2">
            <Btn block variant="outlined" color="secondary" size="small" rounded="lg" :loading="isLoading" @click="cancelEditing">Hủy</Btn>
            <Btn block color="success" size="small" rounded="lg" :loading="isLoading" @click="savePlan">Tạo ngay</Btn>
          </div>
        </Card>
      </template>

      <!-- ADD NEW TRIGGER -->
      <div 
        v-else-if="editingId === null"
        class="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-slate-400 hover:text-blue-500 h-full min-h-[500px]"
        @click="startCreating"
      >
        <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
          <Icon icon="mdi-plus" size="large" />
        </div>
        <span class="font-bold text-lg">Thêm gói mới</span>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <Card class="rounded-3xl p-8 text-center" variant="flat">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi-alert-circle" size="large" />
        </div>
        <h3 class="text-xl font-bold mb-2">Xác nhận xóa?</h3>
        <p class="text-slate-500 mb-6">Bạn có chắc chắn muốn xóa gói <strong>{{ planToDelete?.name }}</strong>?</p>
        <div class="flex gap-3">
          <Btn block variant="outlined" color="secondary" rounded="xl" :loading="isLoading" @click="deleteDialog = false">Hủy</Btn>
          <Btn block color="primary" class="!bg-red-600 !border-red-600" rounded="xl" :loading="isLoading" @click="deletePlan">Xóa ngay</Btn>
        </div>
      </Card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Minimalist scrollbar for features list */
.overflow-y-auto::-webkit-scrollbar {
  width: 3px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>
