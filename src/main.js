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
      slogan: 'Comprende tu repartición de tiempo',
      by: 'Por',
      in: 'en',
      moreInfo: 'Más Información',
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
      coloredDots: 'Etapas Coloreadas'
    },
    en: {
      slogan: 'Comprehend your time allottance',
      by: 'By',
      in: 'in',
      moreInfo: 'More Information',
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
      coloredDots: 'Colored Stages'
    }
  }
})

app.use(Quasar, {
  plugins: {},
})
app.use(router)
app.use(i18n)

app.mount('#app')