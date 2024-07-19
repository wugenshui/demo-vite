import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { getQueryVariable } from '@/util/common.js'
import eruda from 'eruda'

import 'element-plus/dist/index.css'
import '@/style/index.scss'

import MapSwitch from '@/components/MapSwitch.vue'

import 'virtual:uno.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 调试模式
if (getQueryVariable("debug") === "true") {
  eruda.init();
}

// 组件
app.component('map-switch', MapSwitch)

app.mount('#app')
