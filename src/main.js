import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import * as messages from './i18n'

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/src/css/index.sass'
import router from './router'
import App from './App.vue'

const app = createApp(App)

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'es',
  // messages
  messages: {
    es: {
      by: 'Por',
      in: 'en',
      darkMode: 'Modo Oscuro',
      english: 'Inglés',
      spanish: 'Español', 
      en: 'Inglés',
      es: 'Español',
      years: 'Años',
      months: 'Meses',
      weeks: 'Semanas',
      days: 'Días',
      from: 'desde',
      share: 'Compartir',
      byEmail: 'Eviar Por Email',
      copyLink: 'Copiar Link',
      downloadImage: 'Descargar Imágen',
      colors: 'Colores'
    },
    en: {
      by: 'By',
      in: 'in',
      darkMode: 'Dark Mode',
      english: 'English',
      spanish: 'Spanish',
      en: 'English',
      es: 'Spanish',
      years: 'Years',
      months: 'Months',
      weeks: 'Weeks',
      days: 'Days',
      from: 'from',
      share: 'Share',
      byEmail: 'Send By Email',
      copyLink: 'Copy Link',
      downloadImage: 'Download Image',
      colors: 'Colors'
    }
  }
})

app.use(Quasar, {
  plugins: {},
})
app.use(router)
app.use(i18n)

app.mount('#app')