import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { ThemeMode } from '../enums/theme.enum'

export const useThemeStore = defineStore('theme', () => {
  // Initialize from localStorage or fallback to system preference
  const getInitialMode = (): ThemeMode => {
    const saved = localStorage.getItem('theme_mode')
    if (saved !== null) return parseInt(saved) as ThemeMode
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? ThemeMode.DARK 
      : ThemeMode.LIGHT
  }

  const currentMode = ref<ThemeMode>(getInitialMode())
  
  const isDark = computed(() => currentMode.value === ThemeMode.DARK)
  const themeName = computed(() => isDark.value ? 'dark' : 'light')

  const toggleTheme = () => {
    currentMode.value = isDark.value ? ThemeMode.LIGHT : ThemeMode.DARK
  }

  const setTheme = (mode: ThemeMode) => {
    currentMode.value = mode
  }

  // Effect: Sync state to LocalStorage and DOM (Tailwind class)
  watch(currentMode, (mode) => {
    localStorage.setItem('theme_mode', mode.toString())
    
    if (mode === ThemeMode.DARK) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    currentMode,
    isDark,
    themeName,
    toggleTheme,
    setTheme,
  }
})
