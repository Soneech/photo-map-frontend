import './assets/main.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import './assets/forms.css'
import './assets/marks.css'
import './assets/profile.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
