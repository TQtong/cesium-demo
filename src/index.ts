import * as Cesium from 'cesium'
import GUI from 'lil-gui'

const token = '	aa15d6ea7b7c3124490a7c8bd30dc114'

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

let imagerLayer: Cesium.ImageryLayer
let vectorLayer: Cesium.ImageryLayer
let vectorAnnotationLayer: Cesium.ImageryLayer

const addLogic = (viewer: Cesium.Viewer) => { 
  const gui = new GUI()
  const options = {
    image: () => {
      addImgerTianditu(viewer)
    },
    vector: () => {
      addVectorTianditu(viewer)
    },
    vectorAnnotation: () => {
      addVectorAnnotation(viewer)
    },
    removeImage: () => {
      imagerLayer && viewer.imageryLayers.remove(imagerLayer)
    },
    removeVector: () => {
      vectorLayer && viewer.imageryLayers.remove(vectorLayer)
    },
    raiseImage: () => {
      imagerLayer && viewer.imageryLayers.raise(imagerLayer)
    },
    raiseVector: () => {
      vectorLayer && viewer.imageryLayers.raise(vectorLayer)
    },
    lowerImage: () => {
      imagerLayer && viewer.imageryLayers.lower(imagerLayer)
    },
    lowerVector: () => {
      vectorLayer && viewer.imageryLayers.lower(vectorLayer)
    },
    raiseToTopImage: () => {
      imagerLayer && viewer.imageryLayers.raiseToTop(imagerLayer)
    },
    raiseToTopVector: () => {
      vectorLayer && viewer.imageryLayers.raiseToTop(vectorLayer)
    },
    lowerToBottomImage: () => {
      imagerLayer && viewer.imageryLayers.lowerToBottom(imagerLayer)
    },
    lowerToBottomVector: () => {
      vectorLayer && viewer.imageryLayers.lowerToBottom(vectorLayer)
    },
    changeVectorAlpha: 1, // 透明度
    changeVectorBrightness: 1, // 亮度
    changeVectorContrast: 1, // 对比度
    changeVectorHue: 0, // 色调
    changeVectorSaturation: 1, // 饱和度
    changeVectorGamma: 1, // 伽马
    colorToAlphaThreshold: 0.5, // 颜色到透明度阈值
  }
  gui.add(options, 'image').name('添加影像天地图')
  gui.add(options, 'vector').name('添加矢量天地图')
  gui.add(options, 'vectorAnnotation').name('添加矢量注记天地图')
  gui.add(options, 'removeImage').name('删除影像天地图')
  gui.add(options, 'removeVector').name('删除矢量天地图')
  gui.add(options, 'raiseImage').name('提升影像天地图')
  gui.add(options, 'raiseVector').name('提升矢量天地图')
  gui.add(options, 'lowerImage').name('降低影像天地图')
  gui.add(options, 'lowerVector').name('降低矢量天地图')
  gui.add(options, 'raiseToTopImage').name('提升到最顶层影像天地图')
  gui.add(options, 'raiseToTopVector').name('提升到最顶层矢量天地图')
  gui.add(options, 'lowerToBottomImage').name('降低到最底层影像天地图')
  gui.add(options, 'lowerToBottomVector').name('降低到最底层矢量天地图')
  const folder = gui.addFolder('矢量天地图属性')
  folder.add(options, 'changeVectorAlpha').name('改变矢量透明度').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.alpha = value
    }
  })
  folder.add(options, 'changeVectorBrightness').name('改变矢量亮度').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.brightness = value
    }
  })
  folder.add(options, 'changeVectorContrast').name('改变矢量对比度').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.contrast = value
    }
  })
  folder.add(options, 'changeVectorHue').name('改变矢量色调').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.hue = value
    }
  })
  folder.add(options, 'changeVectorSaturation').name('改变矢量饱和度').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.saturation = value
    }
  })
  folder.add(options, 'changeVectorGamma').name('改变矢量伽马').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.gamma = value
    }
  })
  folder.add(options, 'colorToAlphaThreshold').name('改变矢量颜色到透明度阈值').onChange((value: number) => {
    if (vectorLayer) {
      vectorLayer.colorToAlphaThreshold = value
      // 设置什么颜色变为透明
      vectorLayer.colorToAlpha = new Cesium.Color(1, 1, 1) // 默认白色(矢量地图能分割陆地)
      vectorLayer.colorToAlpha = new Cesium.Color(0.1, 0.2, 0.3) 
    }
  })

}

const addImgerTianditu = (viewer: Cesium.Viewer) => {
  const imagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=' + token,
    layer: '',
    style: '',
    tileMatrixSetID: '',
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
  })

  imagerLayer = viewer.imageryLayers.addImageryProvider(imagerLayerProvider)

}

const addVectorTianditu = (viewer: Cesium.Viewer) => {
  const vectorLayerProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=' + token,
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
  })

  vectorLayer = viewer.imageryLayers.addImageryProvider(vectorLayerProvider)
  console.log(vectorLayer);
  
}

const addVectorAnnotation = (viewer: Cesium.Viewer) => { 
  const vectorLayerProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=' + token,
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
  })

  vectorAnnotationLayer = viewer.imageryLayers.addImageryProvider(vectorLayerProvider)
}
