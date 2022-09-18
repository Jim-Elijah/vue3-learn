import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Vue3AudioPlayer from 'jim-audio-player-vue3'
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(Vue3AudioPlayer)
app.mount('#app')
