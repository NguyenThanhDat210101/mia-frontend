import type { App } from 'vue'
import { vuetify } from './vuetify'
import { registerPinia } from './pinia'
import './echo'

export function registerPlugins(app: App) {
  app.use(vuetify)
  registerPinia(app)
}
