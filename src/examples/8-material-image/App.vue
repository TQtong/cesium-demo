<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue';

import { init} from './index'

const cesiumContainer = useTemplateRef('cesiumContainer')


onMounted(() => {
  init(cesiumContainer.value as HTMLDivElement)
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
