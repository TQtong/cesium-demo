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

  const center = { lon: 100.973227, lat: 22.776595 }
  const cities = [
    { lon: 101.04524, lat: 23.062507 },
    { lon: 101.687606, lat: 23.428165 },
    { lon: 100.840011, lat: 24.448523 },
    { lon: 100.701425, lat: 23.500278 },
    { lon: 101.108512, lat: 24.005712 },
    { lon: 101.859144, lat: 22.58336 },
    { lon: 99.585406, lat: 22.325924 },
    { lon: 99.931201, lat: 22.553083 },
    { lon: 99.594372, lat: 22.644423 },
  ]

  const material = new LineMaterialProperty(
    'line',
    1000,
    './airplane.png',
    Cesium.Color.fromCssColorString(options.color)
  )

  cities.forEach((city, index) => {
    const points = setPositions({
      position1: center,
      position2: city,
      height: 10000,
      num: 100,
    })
    const positions = []
    for (let i = 0; i < points.length; i++) {
      positions.push(points[i][0], points[i][1], points[i][2])
    }

    viewer.entities.add({
      name: `line-${index}`,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        material: material,
        width: 50,
      },
    })
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

  viewer.zoomTo(viewer.entities)
}

const setPositions = (options: IOptions) => {
  // 抛物线方程 y=-(4h/L^2)*x^2+h，其中 h:顶点高度 L：横纵间距较大者
  // 设置抛物线的高度，最小为5000米
  const h = options.height && options.height > 5000 ? options.height : 5000
  // 计算起点和终点之间的最大距离（经度差或纬度差中较大的）
  const L =
    Math.abs(options.position1.lon - options.position2.lon) >
    Math.abs(options.position1.lat - options.position2.lat)
      ? Math.abs(options.position1.lon - options.position2.lon) // 经度差较大，使用经度差
      : Math.abs(options.position1.lat - options.position2.lat) // 纬度差较大，使用纬度差
  // 设置抛物线分段数量，最小为50段
  const num = options.num && options.num > 50 ? options.num : 50
  // 存储抛物线上所有点的坐标数组
  const result = []
  // 计算主要变化方向上每段的增量
  let dlt = L / num
  // 判断经度差是否大于纬度差
  if (
    Math.abs(options.position1.lon - options.position2.lon) >
    Math.abs(options.position1.lat - options.position2.lat)
  ) {
    // 经度差较大，经度为主要变化方向，计算纬度的每段增量
    const delLat = (options.position2.lat - options.position1.lat) / num
    // 如果起点经度大于终点经度，增量改为负值（向西移动）
    if (options.position1.lon - options.position2.lon > 0) {
      dlt = -dlt
    }
    // 循环生成抛物线上的每个点
    for (let i = 0; i < num; i++) {
      // 根据抛物线方程计算当前点的高度，i 越接近 num/2 时高度越高
      const tempH =
        h - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) / Math.pow(L, 2)
      // 计算当前点的经度（主要变化方向）
      const lon = options.position1.lon + dlt * i
      // 计算当前点的纬度（次要变化方向，线性插值）
      const lat = options.position1.lat + delLat * i
      // 将坐标点添加到结果数组 [经度, 纬度, 高度]
      result.push([lon, lat, tempH])
    }
  } else {
    // 纬度差较大，纬度为主要变化方向，计算经度的每段增量
    const delLon = (options.position2.lon - options.position1.lon) / num
    // 如果起点纬度大于终点纬度，增量改为负值（向南移动）
    if (options.position1.lat - options.position2.lat > 0) {
      dlt = -dlt
    }
    // 循环生成抛物线上的每个点
    for (let i = 0; i < num; i++) {
      // 根据抛物线方程计算当前点的高度，i 越接近 num/2 时高度越高
      const tempH =
        h - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) / Math.pow(L, 2)
      // 计算当前点的经度（次要变化方向，线性插值）
      const lon = options.position1.lon + delLon * i
      // 计算当前点的纬度（主要变化方向）
      const lat = options.position1.lat + dlt * i
      // 将坐标点添加到结果数组 [经度, 纬度, 高度]
      result.push([lon, lat, tempH])
    }
  }
  // 返回抛物线上所有点的坐标数组
  return result
}
