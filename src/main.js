import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { getQueryVariable } from '@/util/common.js'
import vConsole from 'vconsole';

import 'element-plus/dist/index.css'
import '@/style/index.scss'

import MapSwitch from '@/components/MapSwitch.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 调试模式
if (getQueryVariable("debug") === "true") {
  new vConsole()
}

// 组件
app.component('map-switch', MapSwitch)

app.mount('#app')
