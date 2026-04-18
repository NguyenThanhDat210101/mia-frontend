<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../store/product.store";
import { useOrderStore } from "../store/order.store";
import type { Product, OrderItem, Category, CreateOrderRequest } from "../types";
import { useThemeStore } from '@/core/stores/theme';
import Card from '@/components/atoms/Card.vue';
import Btn from '@/components/atoms/Btn.vue';
import Icon from '@/components/atoms/Icon.vue';
import Input from '@/components/atoms/Input.vue';

const productStore = useProductStore();
const orderStore = useOrderStore();
const themeStore = useThemeStore();

onMounted(() => {
  productStore.fetchProducts();
});

const categories: Category[] = ["Tất cả", "Coffee", "Tea", "Juice", "Bakery"];
const activeCategory = ref<Category>("Tất cả");
const searchQuery = ref("");

const filteredProducts = computed(() => {
  return productStore.products.filter((p) => {
    const matchCategory =
      activeCategory.value === "Tất cả" || p.category === activeCategory.value;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});

const cart = ref<OrderItem[]>([]);
const selectedPaymentMethod = ref<"cash" | "momo" | "stripe">("cash");
const isProcessing = ref(false);
const showPaymentModal = ref(false);

const addToCart = (product: Product) => {
  const existing = cart.value.find((item) => item.product_id === product.id);
  if (existing) {
    existing.quantity++;
    existing.subtotal = existing.quantity * existing.price;
  } else {
    cart.value.push({
      id: product.id,
      product_id: product.id,
      name: product.name,
      quantity: 1,
      size: "M",
      price: product.price,
      subtotal: product.price,
    });
  }
};

const removeFromCart = (id: number) => {
  cart.value = cart.value.filter((item) => item.id !== id);
};

const totalAmount = computed(() =>
  cart.value.reduce((sum, item) => sum + item.subtotal, 0),
);

const updateQuantity = (id: number, delta: number) => {
  const item = cart.value.find((i) => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else item.subtotal = item.quantity * item.price;
  }
};

const checkout = async () => {
  if (cart.value.length === 0) return;

  try {
    const orderRequest: CreateOrderRequest = {
      store_id: 1, // Giả định store_id = 1, bạn có thể lấy từ store khác
      payment_method: selectedPaymentMethod.value,
      notes: "Đơn hàng từ kiosk",
      items: cart.value.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    if (selectedPaymentMethod.value === "cash") {
      await orderStore.createOrder(orderRequest);
      alert(
        `Thanh toán Tiền mặt thành công: ${totalAmount.value.toLocaleString()}đ`,
      );
      cart.value = [];
    } else {
      showPaymentModal.value = true;
      isProcessing.value = true;

      // Simulate processing for Stripe or MoMo
      await orderStore.createOrder(orderRequest);

      if (selectedPaymentMethod.value === "stripe") {
        setTimeout(() => {
          isProcessing.value = false;
        }, 3000);
      } else {
        isProcessing.value = false;
      }
    }
  } catch (err: any) {
    alert(err.response?.data?.message || "Đã có lỗi xảy ra khi tạo đơn hàng");
  }
};

const confirmPayment = () => {
  alert("Thanh toán thành công!");
  showPaymentModal.value = false;
  cart.value = [];
};
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white relative transition-colors duration-300">
    <!-- Payment Modal Overlay -->
    <div
      v-if="showPaymentModal"
      class="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 dark:bg-black/80 backdrop-blur-md"
    >
      <Card
        border
        class="w-full max-w-md p-8 text-center bg-white dark:bg-gray-900 shadow-3xl animate-in zoom-in duration-300"
      >
        <div v-if="isProcessing" class="py-12 flex flex-col items-center gap-6">
          <div
            class="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          ></div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Đang kết nối cổng Stripe...</h2>
          <p class="text-slate-500 dark:text-gray-400">Vui lòng không đóng trình duyệt</p>
        </div>

        <div
          v-else-if="selectedPaymentMethod === 'momo'"
          class="flex flex-col items-center gap-6"
        >
          <div
            class="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mb-2"
          >
            <Icon icon="mdi-wallet" color="white" size="large"></Icon>
          </div>
          <h2 class="text-2xl font-black uppercase text-pink-500">
            Thanh toán MoMo
          </h2>
          <div class="bg-white p-4 rounded-3xl shadow-2xl">
            <img
              src="/public/images/momo-qr.png"
              class="w-64 h-64 border-2 border-pink-100"
            />
          </div>
          <div class="text-center">
            <p class="text-slate-700 dark:text-gray-300 font-medium">
              Tổng tiền:
              <span class="text-2xl font-black text-pink-500"
                >{{ totalAmount.toLocaleString() }}đ</span
              >
            </p>
            <p class="text-sm text-slate-500 dark:text-gray-500 mt-2">
              Dùng ứng dụng MoMo để quét mã
            </p>
          </div>
          <div class="flex gap-4 w-full mt-4">
            <Btn block variant="tonal" @click="showPaymentModal = false"
              >HỦY BỎ</Btn
            >
            <Btn block color="primary" @click="confirmPayment"
              >XÁC NHẬN ĐÃ QUÉT</Btn
            >
          </div>
        </div>

        <div
          v-else-if="selectedPaymentMethod === 'stripe'"
          class="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4"
        >
          <div
            class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-500/40"
          >
            <Icon icon="mdi-check-circle" color="white" size="large"></Icon>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Thanh toán Stripe thành công!</h2>
          <p class="text-slate-500 dark:text-gray-400">
            Giao dịch của bạn đã được xác nhận qua thẻ.
          </p>
          <Btn
            block
            color="primary"
            @click="confirmPayment"
            size="large"
            class="mt-4"
            >HOÀN TẤT ĐƠN HÀNG</Btn
          >
        </div>
      </Card>
    </div>
    <!-- Left Sidebar: Menu -->
    <div class="flex-1 flex flex-col h-full border-r border-slate-200 dark:border-white/5">
      <!-- Search & Category -->
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-black text-slate-900 dark:text-white">Coffee Menu</h1>
          <div class="w-64">
            <Input
              v-model="searchQuery"
              placeholder="Tìm tên đồ uống..."
              icon="mdi-magnify"
            />
          </div>
        </div>

        <div
          class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
        >
          <Btn
            v-for="cat in categories"
            :key="cat"
            :variant="activeCategory === cat ? 'elevated' : 'tonal'"
            :color="activeCategory === cat ? 'primary' : 'default'"
            size="small"
            rounded="lg"
            class="dark:text-white"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </Btn>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="flex-1 overflow-y-auto p-6 pt-0">
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card
            v-for="product in filteredProducts"
            :key="product.id"
            variant="flat"
            border
            class="group cursor-pointer hover:border-primary/50 transition-all p-3 flex flex-col items-center text-center bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10"
            @click="addToCart(product)"
          >
            <div
              class="w-full aspect-square bg-slate-100 dark:bg-neutral-700/50 rounded-2xl mb-3 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform"
            >
              <Icon
                :icon="
                  product.category === 'Coffee'
                    ? 'mdi-coffee'
                    : product.category === 'Tea'
                      ? 'mdi-tea'
                      : product.category === 'Bakery'
                        ? 'mdi-bread-slice'
                        : 'mdi-glass-cocktail'
                "
                color="primary"
              ></Icon>
            </div>
            <h3 class="font-bold text-sm mb-1 line-clamp-1 text-slate-900 dark:text-white">
              {{ product.name }}
            </h3>
            <p class="text-primary font-black text-base">
              {{ product.price.toLocaleString() }}đ
            </p>
          </Card>
        </div>
      </div>
    </div>

    <!-- Right Sidebar: Cart -->
    <div
      class="w-[400px] bg-white dark:bg-black/40 backdrop-blur-xl flex flex-col h-full border-l border-slate-200 dark:border-white/5 shadow-2xl transition-colors duration-300"
    >
      <div
        class="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between"
      >
        <h2 class="text-xl font-black text-slate-900 dark:text-white">Giỏ hàng ({{ cart.length }})</h2>
        <Btn
          variant="text"
          size="small"
          color="default"
          icon="mdi-delete-outline"
          class="text-slate-500 dark:text-white"
          @click="cart = []"
          >XÓA</Btn
        >
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div
          v-if="cart.length === 0"
          class="h-full flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 opacity-50 space-y-4"
        >
          <Icon icon="mdi-cart-outline" size="text-8xl"></Icon>
          <p class="font-medium">Chưa có món nào được chọn</p>
        </div>

        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 group"
        >
          <div
            class="w-12 h-12 bg-slate-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center font-black text-primary dark:text-blue-400"
          >
            {{ item.quantity }}
          </div>
          <div class="flex-1">
            <div class="font-bold text-sm leading-tight mb-1 text-slate-900 dark:text-white">
              {{ item.name }}
            </div>
            <div class="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Size: {{ item.size }} • {{ item.price.toLocaleString() }}đ
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="font-black text-sm text-primary dark:text-blue-400">
              {{ item.subtotal.toLocaleString() }}đ
            </div>
            <div
              class="flex items-center bg-slate-200 dark:bg-black/40 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="updateQuantity(item.id!, -1)"
                class="p-1 text-slate-600 dark:text-white hover:text-red-500"
              >
                <Icon icon="mdi-minus" size="small"></Icon>
              </button>
              <button
                @click="updateQuantity(item.id!, 1)"
                class="p-1 text-slate-600 dark:text-white hover:text-green-500"
              >
                <Icon icon="mdi-plus" size="small"></Icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-neutral-900/40">
        <h3
          class="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4"
        >
          Phương thức thanh toán
        </h3>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="selectedPaymentMethod = 'cash'"
            class="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
            :class="
              selectedPaymentMethod === 'cash'
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'
            "
          >
            <Icon
              icon="mdi-cash"
              :color="selectedPaymentMethod === 'cash' ? 'primary' : 'default'"
              size="default"
              class="dark:text-white"
            ></Icon>
            <span class="text-[10px] font-bold">TIỀN MẶT</span>
          </button>
          <button
            @click="selectedPaymentMethod = 'momo'"
            class="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
            :class="
              selectedPaymentMethod === 'momo'
                ? 'bg-pink-500/10 border-pink-500 text-pink-500'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'
            "
          >
            <Icon
              icon="mdi-wallet"
              :color="selectedPaymentMethod === 'momo' ? 'pink' : 'default'"
              size="default"
              class="dark:text-white"
            ></Icon>
            <span class="text-[10px] font-bold">MOMO</span>
          </button>
          <button
            @click="selectedPaymentMethod = 'stripe'"
            class="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
            :class="
              selectedPaymentMethod === 'stripe'
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'
            "
          >
            <Icon
              icon="mdi-credit-card"
              :color="selectedPaymentMethod === 'stripe' ? 'indigo' : 'default'"
              size="default"
              class="dark:text-white"
            ></Icon>
            <span class="text-[10px] font-bold">CARD</span>
          </button>
        </div>
      </div>

      <!-- Checkout -->
      <div class="p-6 bg-slate-100 dark:bg-black/60 border-t border-slate-200 dark:border-white/5 space-y-4">
        <div
          class="flex justify-between items-center text-slate-500 dark:text-gray-400 font-bold mb-2"
        >
          <span>Tạm tính</span>
          <span class="text-slate-900 dark:text-white">{{ totalAmount.toLocaleString() }}đ</span>
        </div>
        <div class="flex justify-between items-center mb-6">
          <span class="text-xl font-black text-slate-900 dark:text-white">TỔNG TIỀN</span>
          <span class="text-3xl font-black text-primary"
            >{{ totalAmount.toLocaleString() }}đ</span
          >
        </div>
        <Btn
          block
          color="primary"
          size="x-large"
          rounded="xl"
          @click="checkout"
          :disabled="cart.length === 0"
          class="h-16 text-lg font-black tracking-widest shadow-lg shadow-primary/20"
        >
          THANH TOÁN
        </Btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
