// 从顶点着色器传入的折线角度，用于对齐纹理
in float v_polylineAngle;

/**
* 创建2D旋转矩阵
* @param rad 旋转角度（弧度）
* @return 2x2旋转变换矩阵
*/
mat2 rotate(float rad){
    float c=cos(rad);  // 余弦值
    float s=sin(rad);  // 正弦值
    // 返回标准的2D旋转矩阵
    return mat2(
        c,s,
        -s,c
    );
}

/**
* Cesium材质着色器主函数
* 实现流动线效果：通过旋转和相位偏移使纹理沿着折线方向流动
* @param materialInput Cesium提供的材质输入参数
* @return 计算后的材质属性
*/
czm_material czm_getMaterial(czm_materialInput materialInput){
    // 获取Cesium默认材质
    czm_material material=czm_getDefaultMaterial(materialInput);
    
    // 获取纹理坐标（s: 水平方向 0-1, t: 垂直方向 0-1）
    vec2 st=materialInput.st;
    
    // 将片段坐标旋转到与折线对齐的坐标系
    vec2 pos=rotate(v_polylineAngle)*gl_FragCoord.xy;
    
    // Get the relative position within the dash from 0 to 1
    float dashPosition=fract(pos.x/(dashLength*czm_pixelRatio));
    
    // 从纹理中采样颜色，使用计算后的水平坐标和原始的垂直坐标
    vec4 fragColor=texture(image,vec2(fract(dashPosition-time),st.t));
    
    fragColor=czm_gammaCorrect(fragColor);
    
    // 设置材质漫反射颜色：增强亮度（×3）并确保最小亮度
    material.diffuse=mix(color.rgb,fragColor.rgb,fragColor.a).rgb*3.;
    // material.emission=fragColor.rgb;
    // 设置材质透明度：纹理透明度 × 颜色透明度
    material.alpha=fragColor.a;
    
    return material;
}