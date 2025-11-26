import * as Cesium from 'cesium'

import fragment from './fragment.glsl?raw'

export default class LineMaterialProperty {
  name: string // 材质的名称
  definitionChanged: Cesium.Event // 定义改变事件
  url: string // 图片地址
  duration: number // 动画持续时间
  _time: number // 时间戳
  isConstant: boolean = false

  customColor: Cesium.Color // 颜色
  dashLength: number // 虚线长度
  /**
   * @description: 初始化材质
   * @param {string} name 材质名称
   * @param {number} duration 持续时间
   * @param {string} url 图片地址
   */
  constructor(name: string, duration: number, url: string, color: Cesium.Color, dashLength: number = 100) {
    this.name = name

    this.definitionChanged = new Cesium.Event()
    this.url = url
    this.duration = duration || 3000
    this._time = new Date().getTime()
    this.customColor = color
    this.dashLength = dashLength

    Cesium.Material._materialCache.addMaterial('LineMaterialProperty', {
      fabric: {
        type: 'LineMaterialProperty',
        uniforms: {
          time: -20,
          image: this.url,
          dashLength: this.dashLength,
          color: this.customColor,
        },
        source: fragment,
      },
      translucent: function (material: any) {
        return true
      },
    })
  }

  /**
   * @description: 返回材质类型
   * @return {*}
   */
  getType() {
    return 'LineMaterialProperty'
  }

  /**
   * @description: 返回材质值
   * @return {*}
   */
  getValue(time: any, result: any) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = this.customColor
    result.image = this.url
    result.dashLength = this.dashLength
    result.time = (Date.now() / this.duration) % 1
    return result
  }

  /**
   * @description: 判断两个材质是否相等
   * @param {*} other 其他材质
   * @return {*}
   */
  equals(other: any) {
    return other instanceof LineMaterialProperty && this.name === other.name
  }
}
