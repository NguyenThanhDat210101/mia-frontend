<script setup lang="ts">
import { ref } from 'vue';
import Card from '../../../components/atoms/Card.vue';
import Btn from '../../../components/atoms/Btn.vue';
import Icon from '../../../components/atoms/Icon.vue';
import Input from '../../../components/atoms/Input.vue';
import Select from '../../../components/atoms/Select.vue';
import Label from '../../../components/atoms/Label.vue';
import Chip from '../../../components/atoms/Chip.vue';
import type { Product } from '../types';

const products = ref<Product[]>([
  { id: '1', name: 'Cà phê Đen Đá', category: 'Coffee', price: 29000, status: 'active' },
  { id: '2', name: 'Bạc Xỉu', category: 'Coffee', price: 35000, status: 'active' },
  { id: '3', name: 'Trà Đào Cam Sả', category: 'Tea', price: 45000, status: 'active' },
  { id: '4', name: 'Nước Cam Ép', category: 'Juice', price: 40000, status: 'active' },
]);

const categories = [
  { label: 'Cà phê', value: 'Coffee' },
  { label: 'Trà', value: 'Tea' },
  { label: 'Nước ép', value: 'Juice' },
  { label: 'Bánh ngọt', value: 'Bakery' },
];

const newProduct = ref<Partial<Product>>({
  name: '',
  category: 'Coffee',
  price: 0,
  status: 'active'
});

const addProduct = () => {
  if (newProduct.value.name && newProduct.value.price) {
    products.value.push({
      id: Date.now().toString(),
      name: newProduct.value.name || '',
      category: newProduct.value.category || 'Coffee',
      price: Number(newProduct.value.price) || 0,
      status: 'active'
    });
    newProduct.value = { name: '', category: 'Coffee', price: 0, status: 'active' };
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-4xl font-black mb-2">Quản lý Sản phẩm</h1>
        <p class="text-gray-400">Danh mục đồ uống và thức ăn tại cửa hàng.</p>
      </div>
      <Btn color="primary" icon="mdi-plus" size="large">THÊM MỚI</Btn>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Form thêm nhanh -->
      <Card border class="p-8 h-fit lg:sticky lg:top-24">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
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

      <!-- Danh sách sản phẩm -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in products" :key="item.id" class="group">
          <Card variant="flat" border class="p-5 flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer bg-neutral-800/40">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-neutral-700 rounded-2xl flex items-center justify-center text-2xl">
                 <Icon :icon="item.category === 'Coffee' ? 'mdi-coffee' : item.category === 'Tea' ? 'mdi-tea' : 'mdi-glass-cocktail'" color="primary"></Icon>
              </div>
              <div>
                <div class="font-bold text-lg">{{ item.name }}</div>
                <div class="text-gray-500 text-sm flex items-center gap-2">
                   {{ item.category }} • <span class="text-blue-400 font-bold">{{ item.price.toLocaleString() }}đ</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Chip color="success" size="small" variant="tonal">Đang bán</Chip>
              <Btn variant="text" size="small" icon="mdi-dots-vertical"></Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
