<script setup lang="ts">
import { ref, watch } from 'vue';
import type { OtpInputProps } from './types';

const props = withDefaults(defineProps<OtpInputProps>(), {
  length: 6,
  modelValue: ''
});

const emit = defineEmits(['update:modelValue', 'finish']);

const digits = ref<string[]>(Array(props.length).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);

// Sync from modelValue if provided externally
watch(() => props.modelValue, (val) => {
  if (val !== digits.value.join('')) {
    const chars = val.split('').slice(0, props.length);
    for (let i = 0; i < props.length; i++) {
      digits.value[i] = chars[i] || '';
    }
  }
}, { immediate: true });

const focusInput = (index: number) => {
  if (inputRefs.value[index]) {
    inputRefs.value[index].focus();
  }
};

const handleInput = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement;
  const val = target.value;
  
  if (val.length > 1) {
    target.value = val.slice(0, 1);
    digits.value[index] = val.slice(0, 1);
  }

  updateModel();

  if (digits.value[index] !== '' && index < props.length - 1) {
    focusInput(index + 1);
  }
  
  checkFinish();
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Backspace') {
    if (digits.value[index] === '') {
      if (index > 0) {
        digits.value[index - 1] = '';
        focusInput(index - 1);
        e.preventDefault();
        updateModel();
      }
    } else {
      digits.value[index] = '';
      updateModel();
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1);
  } else if (e.key === 'ArrowRight' && index < props.length - 1) {
    focusInput(index + 1);
  }
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasteData = e.clipboardData?.getData('text/plain')?.trim();
  if (!pasteData) return;
  
  const chars = pasteData.split('').slice(0, props.length);
  for (let i = 0; i < props.length; i++) {
    digits.value[i] = chars[i] || '';
  }
  
  updateModel();
  
  const nextEmpty = digits.value.findIndex(d => d === '');
  if (nextEmpty !== -1) {
    focusInput(nextEmpty);
  } else {
    focusInput(props.length - 1);
  }
  checkFinish();
};

const updateModel = () => {
  const fullVal = digits.value.join('');
  emit('update:modelValue', fullVal);
};

const checkFinish = () => {
  if (digits.value.every(d => d !== '')) {
    emit('finish', digits.value.join(''));
  }
};
</script>

<template>
  <div class="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 w-full">
    <input
      v-for="(_, index) in length"
      :key="index"
      :ref="el => inputRefs[index] = el as HTMLInputElement"
      v-model="digits[index]"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      class="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all select-all flex-shrink-0"
      @input="e => handleInput(e, index)"
      @keydown="e => handleKeyDown(e, index)"
      @paste="handlePaste"
    />
  </div>
</template>
