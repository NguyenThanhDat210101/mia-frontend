<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '../store/product.store';
import Card from '../../../components/atoms/Card.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Input from '../../../components/atoms/Input.vue';
import Select from '../../../components/atoms/Select.vue';
import Label from '../../../components/atoms/Label.vue';
import Chip from '../../../components/atoms/Chip.vue';
import type { Product, Category } from '../types';

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts();
});

const categories: { label: string; value: Category }[] = [
  { label: 'Cà phê', value: 'Coffee' },
  { label: 'Trà', value: 'Tea' },
  { label: 'Nước ép', value: 'Juice' },
  { label: 'Bánh ngọt', value: 'Bakery' },
];

const newProduct = ref<Partial<Product>>({
  name: '',
  category: 'Coffee',
  price: 0,
  is_active: true
});

const addProduct = async () => {
  if (newProduct.value.name && newProduct.value.price) {
    try {
      await productStore.addProduct({
        name: newProduct.value.name,
        category: newProduct.value.category,
        price: Number(newProduct.value.price),
        is_active: true
      });
      newProduct.value = { name: '', category: 'Coffee', price: 0, is_active: true };
    } catch (error) {
      alert('Lỗi khi thêm sản phẩm');
    }
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-4xl font-black mb-2 text-slate-900 dark:text-white">Quản lý Sản phẩm</h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium">Danh mục đồ uống và thức ăn tại cửa hàng.</p>
      </div>
      <Btn color="primary" icon="mdi-plus" size="large">THÊM MỚI</Btn>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Form thêm nhanh -->
      <Card border class="p-8 h-fit lg:sticky lg:top-24 shadow-sm dark:shadow-none bg-white dark:bg-gray-900">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <Icon icon="mdi-pencil-plus" color="primary"></Icon>
          Thêm Sản phẩm Mới
        </h2>
        
        <div class="space-y-5">
          <div>
            <Label>Tên đồ uống</Label>
            <Input v-model="newProduct.name as string" placeholder="Ví dụ: Cà phê Muối" />
          </div>
          <div>
            <Label>Danh mục</Label>
            <Select v-model="newProduct.category" :options="categories" />
          </div>
          <div>
            <Label>Giá bán (VNĐ)</Label>
            <Input v-model="newProduct.price as number" type="number" placeholder="30000" />
          </div>
          <Btn block color="primary" class="mt-4" @click="addProduct">LƯU SẢN PHẨM</Btn>
        </div>
      </Card>

      <div class="lg:col-span-2 space-y-4">
        <div v-if="productStore.loading" class="text-center py-10 text-slate-500 dark:text-gray-400 font-medium">Đang tải...</div>
        <div v-for="item in productStore.products" :key="item.id" class="group">
          <Card variant="flat" border class="p-5 flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-slate-100 dark:bg-neutral-700 rounded-2xl flex items-center justify-center text-2xl">
                 <Icon :icon="item.category === 'Coffee' ? 'mdi-coffee' : item.category === 'Tea' ? 'mdi-tea' : 'mdi-glass-cocktail'" color="primary"></Icon>
              </div>
              <div>
                <div class="font-bold text-lg text-slate-900 dark:text-white">{{ item.name }}</div>
                <div class="text-slate-500 dark:text-gray-500 text-sm flex items-center gap-2">
                   {{ item.category }} • <span class="text-blue-600 dark:text-blue-400 font-bold">{{ item.price.toLocaleString() }}đ</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Chip :color="item.is_active ? 'success' : 'error'" size="small" variant="tonal">
                {{ item.is_active ? 'Đang bán' : 'Ngừng bán' }}
              </Chip>
              <Btn variant="text" size="small" icon="mdi-dots-vertical" color="default" class="text-slate-400 dark:text-white"></Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
