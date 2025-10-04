<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue';
import * as Cesium from 'cesium'

import { init, addImgerTianditu, addVectorTianditu} from './index'

const cesiumContainer = useTemplateRef('cesiumContainer')

let viewer: Cesium.Viewer

onMounted(() => {
  viewer = init(cesiumContainer.value as HTMLDivElement)
})

const addImgTianditu = () => {
  addImgerTianditu(viewer)
}

const addVecTianditu = () => {
  addVectorTianditu(viewer)
}

</script>

<template>
  <div ref="cesiumContainer" id="cesiumContainer"></div>
  <div class="tool-bar">
    <el-button @click="addImgTianditu">添加影像天地图</el-button>
    <el-button @click="addVecTianditu">添加矢量天地图</el-button>
  </div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}

.tool-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
