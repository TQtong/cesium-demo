import * as Cesium from 'cesium'
import GUI from 'lil-gui'

import worldImg from './world_b.jpg'

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

  const blackLayer = Cesium.ImageryLayer.fromProviderAsync(
    Cesium.IonImageryProvider.fromAssetId(3812)
  )

  blackLayer.alpha = 0.5
  blackLayer.brightness = 2.0

  viewer.imageryLayers.add(blackLayer)

  const singleProvider = await Cesium.SingleTileImageryProvider.fromUrl(
    worldImg
  )

  const singleLayer = viewer.imageryLayers.addImageryProvider(singleProvider)

  const gridProvider = new Cesium.GridImageryProvider({
    color: Cesium.Color.GRAY,
    glowColor: Cesium.Color.RED,
    glowWidth: 3,
  })

  viewer.imageryLayers.addImageryProvider(gridProvider)

  const options = {
    lower: () => {
      viewer.imageryLayers.lower(singleLayer)
    },
    raise: () => {
      viewer.imageryLayers.raise(singleLayer)
    },
    raiseToTop: () => {
      viewer.imageryLayers.raiseToTop(singleLayer)
    },
    lowerToBottom: () => {
      viewer.imageryLayers.lowerToBottom(singleLayer)
    },
    show: () => {
      singleLayer.show = true
    },
    hide: () => {
      singleLayer.show = false
    }
  }
  gui.add(options, 'lower').name('降低层级')
  gui.add(options, 'raise').name('提升层级')
  gui.add(options, 'raiseToTop').name('提升到最顶层')
  gui.add(options, 'lowerToBottom').name('降低到最底层')
  gui.add(options, 'show').name('显示')
  gui.add(options, 'hide').name('隐藏')

  gui.add(singleLayer, 'alpha').name('透明度').min(0).max(1).step(0.01).onChange((value: number) => {
    singleLayer.alpha = value
  })
  gui.add(singleLayer, 'brightness').name('亮度').min(0).max(1).step(0.01).onChange((value: number) => {
    singleLayer.brightness = value
  })
  gui.add(singleLayer, 'contrast').name('对比度').min(0).max(1).step(0.01).onChange((value: number) => {
    singleLayer.contrast = value
  })
  gui.add(singleLayer, 'hue').name('色调').min(0).max(1).step(0.01).onChange((value: number) => {
    singleLayer.hue = value
  })
  gui.add(singleLayer, 'saturation').name('饱和度').min(0).max(1).step(0.01).onChange((value: number) => {
    singleLayer.saturation = value
  })
  gui.add(singleLayer, 'gamma').name('伽马').min(0).max(1).step(0.01).onChange((value: number) => {
    singleLayer.gamma = value
  })

}


