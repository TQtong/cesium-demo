import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'cesium/Build/Cesium/Widgets/widgets.css'

createApp(App).use(ElementPlus).mount('#app')
