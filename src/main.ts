import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './routes'
import { i18n } from './locale'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
app.mount('#app')
