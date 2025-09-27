import * as Cesium from 'cesium'

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
  // viewer.creditDisplay.container.remove()

  return viewer
}

export const addImgerTianditu = (viewer: Cesium.Viewer) => {
  const imagerLayer = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=e91172d22894b1c004e47f81452ff4bb',
    layer: '',
    style: '',
    tileMatrixSetID: '',
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
  })

  viewer.imageryLayers.addImageryProvider(imagerLayer)

  const length = viewer.imageryLayers.length
  for (let i = 0; i < length; i++) {
    const layer = viewer.imageryLayers.get(i)
    const url = layer.imageryProvider.url

    const isVectorLayer = url && url.indexOf('img_w') !== -1

    if (isVectorLayer) {
      // viewer.imageryLayers.remove(layer) // 删除
      // viewer.imageryLayers.raise(layer) // 提升一级
      viewer.imageryLayers.lower(layer) // 降低一级
    }
  }
}

export const addVectorTianditu = (viewer: Cesium.Viewer) => {
  const vectorLayer = new Cesium.UrlTemplateImageryProvider({
    url: 'https://{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=e91172d22894b1c004e47f81452ff4bb',
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
  })

  // vectorLayer.name = 'vectorLayer'

  viewer.imageryLayers.addImageryProvider(vectorLayer)

  const length = viewer.imageryLayers.length
  for (let i = 0; i < length; i++) {
    const layer = viewer.imageryLayers.get(i)
    const url = layer.imageryProvider.url

    const isVectorLayer = url && url.indexOf('vec_w') !== -1

    if (isVectorLayer) {
      // viewer.imageryLayers.remove(layer) // 删除
      // viewer.imageryLayers.raise(layer) // 提升一级
      viewer.imageryLayers.lower(layer) // 降低一级
    }
  }
}
