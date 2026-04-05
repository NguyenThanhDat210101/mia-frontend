import type { App } from 'vue'
import { vuetify } from './vuetify'
import './echo'

export function registerPlugins(app: App) {
  app.use(vuetify)
}
