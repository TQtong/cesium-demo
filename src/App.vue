<script setup lang="ts">
import * as Cesium from 'cesium'

import { useTemplateRef, onMounted } from 'vue';

const cesiumContainer = useTemplateRef('cesiumContainer')

onMounted(() => {
  const viewer = new Cesium.Viewer(cesiumContainer.value as HTMLDivElement)
})
</script>

<template>
  <div ref="cesiumContainer" id="cesiumContainer"></div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
