import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'element-plus/dist/index.css'
import '@/style/index.scss'

import MapSwitch from '@/components/MapSwitch.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 组件
app.component('map-switch', MapSwitch)

app.mount('#app')
