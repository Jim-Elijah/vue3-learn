import { createRouter, createWebHashHistory } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import DeptName from '../components/DeptName.vue'
import TreeMenu from '../components/TreeMenu.vue'
import AudioPlayer from '../components/audioDemo.vue'
import AudioDrag from '../components/audioDrag/AudioDrag.vue'

const routes = [
  {
    path: '/',
    component: HelloWorld,
  },
  {
    path: '/dept',
    component: DeptName,
  },
  {
    path: '/TreeMenu',
    component: TreeMenu,
  },
  {
    path: '/AudioPlayer',
    component: AudioPlayer,
  },
  {
    path: '/AudioDrag',
    component: AudioDrag,
  },
]

const router = createRouter(
  {
    history: createWebHashHistory(),
    routes,
  }
)

export default router