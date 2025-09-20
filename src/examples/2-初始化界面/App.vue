<script setup lang="ts">
import * as Cesium from 'cesium'

import { useTemplateRef, onMounted } from 'vue';

const cesiumContainer = useTemplateRef('cesiumContainer')

onMounted(() => {
  const viewer = new Cesium.Viewer(cesiumContainer.value as HTMLDivElement, {
    animation: false, // 左下角，动画控制按钮（罗盘）
    baseLayerPicker: false, // 底图切换
    fullscreenButton: false, // 全屏按钮
    geocoder: false, // 搜索按钮（地名查询）
    homeButton: false, // 初始位置按钮
    infoBox: false, // 信息框(点击要素后显示的相关信息)
    sceneModePicker: false, // 场景模式切换（2D、3D）
    timeline: false, // 时间轴
    navigationHelpButton: false, // 帮助按钮
  })

  viewer.creditDisplay.container.style.display = 'none'
  // viewer.creditDisplay.container.remove()

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
