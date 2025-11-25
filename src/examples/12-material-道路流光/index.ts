import * as Cesium from 'cesium'
import GUI from 'lil-gui'

import LineMaterialProperty from './lineMaterialProperty.ts'

interface IOptions {
  position1: { lon: number; lat: number }
  position2: { lon: number; lat: number }
  height: number
  num: number
}
export const init = (container: HTMLDivElement) => {
  const viewer = new Cesium.Viewer(container, {
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

  addLogic(viewer)

  return viewer
}

const addLogic = async (viewer: Cesium.Viewer) => {
  const gui = new GUI()

  const options = {
    color: '#000000',
  }

  const material = new LineMaterialProperty(
    'line',
    1000,
    './spriteline.png',
    Cesium.Color.fromCssColorString(options.color)
  )

  fetch('./route.geojson')
    .then((res) => res.json())
    .then((data) => {
      data.features.forEach((feature: any) => {
        const points: number[] = []
        feature.geometry.coordinates.forEach((positions: any) => {
          points.push(...positions)
        })
        viewer.entities.add({
          name: 'line',
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(points),
            material: material,
            width: 3,
          },
        })
      })

      viewer.zoomTo(viewer.entities)
    })
  
    gui
    .add(material, 'duration')
    .name('duration')
    .min(0)
    .max(10000)
    .step(100)
    .onChange((value: number) => {
      material.duration = value
    })
  gui
    .add(material, 'url')
    .name('url')
    .onChange((value: string) => {
      material.url = value
    })
  gui.addColor(options, 'color').onChange((value: string) => {
    material.color = Cesium.Color.fromCssColorString(value)
  })
  gui.add(material, 'repeat').name('repeat').min(1).max(10).step(1).onChange((value: number) => {
    material.repeat = value
  })

}

