import { createRouter, createWebHashHistory } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import AudioPlayer from '../components/audioDemo.vue'
import AudioEasyPlayer from '../components/audioEasyDemo.vue'
import AudioDrag from '../components/audioDrag/AudioDrag.vue'
import JimsAudioPlayer from '../components/jimsPlugin/JimsAudioPlayer.vue'
import draggableDemo from '../components/draggableDemo.vue'
import lottieDemo from '../components/lottie-demo/index.vue'
import CarouselDemo from '../components/carouselDemo/index.vue'
import animationImage from '../components/carouselDemo/animationImage.vue'
import radarDemo from '../components/canvasDemo/Radar.vue'


const routes = [
  {
    path: '/',
    component: HelloWorld,
  },
  {
    path: '/AudioPlayer',
    component: AudioPlayer,
  },
  {
    path: '/AudioDrag',
    component: AudioDrag,
  },
  {
    path: '/AudioEasyPlayer',
    component: AudioEasyPlayer,
  },
  {
    path: '/JimsAudioPlayer',
    component: JimsAudioPlayer,
  },
  {
    path: '/draggableDemo',
    component: draggableDemo,
  },
  {
    path: '/lottieDemo',
    component: lottieDemo,
  },
  {
    path: '/CarouselDemo',
    component: CarouselDemo,
  },
  {
    path: '/animationImage',
    component: animationImage,
  },
  {
    path: '/radarDemo',
    component: radarDemo,
  },
]

const router = createRouter(
  {
    history: createWebHashHistory(),
    routes,
  }
)

export default router