import * as Cesium from 'cesium'
import GUI from 'lil-gui'

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


  // flyTo
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(110.511154, 29.362943, 10000000),
    duration: 5,
    orientation: {
      heading: Cesium.Math.toRadians(348.3),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0),
    },
    complete: () => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(101.74352, 25.16168, 1000000),
        duration: 5,
        orientation: {
          heading: Cesium.Math.toRadians(348.3),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0),
        },
        complete: () => {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(101.74352, 25.16168, 10000),
            duration: 5,
            orientation: {
              heading: Cesium.Math.toRadians(348.3),
              pitch: Cesium.Math.toRadians(-90),
              roll: Cesium.Math.toRadians(0),
            },
          })
        }
      })
    }
  })

  // setView
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(110.511154, 29.362943, 10000000),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(348.3),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // })

  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(101.74352, 25.16168, 1000000),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(348.3),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(-45),
  //   },
  // })
}


