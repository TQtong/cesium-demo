import * as Cesium from 'cesium'

export default class LineMaterialProperty {

  isConstant: boolean = false

  name: string // 材质的名称
  definitionChanged: Cesium.Event // 定义改变事件
  url: string // 图片地址
  duration: number // 动画持续时间
  _time: number // 时间戳

  color: Cesium.Color // 颜色
  repeat: number // 重复次数

  /**
   * @description: 初始化材质
   * @param {string} name 材质名称
   * @param {number} duration 持续时间
   * @param {string} url 图片地址
   */
  constructor(name: string, duration: number, url: string, color: Cesium.Color, repeat: number = 3) {
    this.name = name

    this.definitionChanged = new Cesium.Event()
    this.url = url
    this.duration = duration || 3000
    this._time = new Date().getTime()
    this.color = color
    this.repeat = repeat
    
    Cesium.Material._materialCache.addMaterial('LineMaterialProperty', {
      fabric: {
        type: 'LineMaterialProperty',
        uniforms: {
          time: -20,
          image: this.url,
          color: this.color,
          repeat: this.repeat,
        },
        source: `
            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 st = materialInput.st;
                vec4 colorImage = texture(image, vec2(fract(st.s * repeat - time), st.t));
                
                material.diffuse = color.rgb;
                material.emission = colorImage.rgb * color.rgb;
                material.alpha = colorImage.a * color.a * 0.5;
                return material;
            }
      `,
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
    result.image = this.url
    result.color = this.color
    result.repeat = this.repeat
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration
    return result
  }

  /**
   * @description: 判断两个材质是否相等
   * @param {*} other 其他材质
   * @return {*}
   */
  equals(other: any) {
    return (
      other instanceof LineMaterialProperty && this.name === other.name
    )
  }
}
