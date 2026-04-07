import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#4F46E5', // Indigo 600
    secondary: '#0F172A', // Slate 900
    accent: '#8B5CF6', // Violet 500
    error: '#EF4444', // Red 500
    info: '#3B82F6', // Blue 500
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
  },
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#6366F1', // Indigo 500
    secondary: '#94A3B8', // Slate 400
    accent: '#A78BFA', // Violet 400
    error: '#F87171', // Red 400
    info: '#60A5FA', // Blue 400
    success: '#34D399', // Emerald 400
    warning: '#FBBF24', // Amber 400
    background: '#0F172A', // Slate 900
    surface: '#1E293B', // Slate 800
  },
}

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})
