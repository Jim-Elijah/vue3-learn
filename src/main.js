import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import AudioPlayer from 'jim-audio-player'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(AudioPlayer)
app.mount('#app')
