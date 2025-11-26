import * as Cesium from 'cesium'
import GUI from 'lil-gui'

import LineMaterialProperty from './lineMaterialProperty'

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
    color: '#ffff00',
  }

  const material = new LineMaterialProperty('line', 10000, './flowLine.png', Cesium.Color.fromCssColorString(options.color), 1024)

  // fetch('./思茅区.geojson')
  // .then(res => res.json())
  //   .then(data => {
  //     console.log(data);
  //     const points:number[] = []
  //     data.features.forEach((feature: any) => {
  //       feature.geometry.coordinates.forEach((positions: any) => {
  //         positions.forEach((position: any) => {
  //           position.forEach((p: any) => {
  //             points.push(...p)
  //           })
  //         })
  //       })
  //     })
      
  //     viewer.entities.add({
  //       name: 'line',
  //       polyline: {
  //         positions: Cesium.Cartesian3.fromDegreesArray(points),
  //         material: material,
  //         width: 50,
  //       },
  //     })


  //     viewer.zoomTo(viewer.entities)
  //   })
  
  const data = await Cesium.GeoJsonDataSource.load('./思茅区-line.geojson', {
    clampToGround: true,
  })

  data.entities.values.forEach((entity: any) => {
    entity.polyline.material = material
    entity.polyline.width = 20
  })

  gui.add(material, 'duration').name('duration').min(0).max(10000).step(100).onChange((value: number) => {
    material.duration = value
  })
  gui.add(material, 'url').name('url').onChange((value: string) => {
    material.url = value
  })
  
  gui.add(material, 'dashLength').name('dashLength').min(0).max(4096).step(10).onChange((value: number) => {
    material.dashLength = value
  })

  gui.addColor(options, 'color').name('color').onChange((value: string) => {
    material.color = Cesium.Color.fromCssColorString(value)
  })

  viewer.dataSources.add(data)

  viewer.zoomTo(data)
}


