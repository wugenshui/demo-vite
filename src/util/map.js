/**
 * 该工具类封装OpenLayers一些基础操作
 */
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import TileWMS from 'ol/source/TileWMS'
import WMTS from 'ol/source/WMTS'
import XYZ from 'ol/source/XYZ'
import Vector from 'ol/source/Vector'
import Raster from 'ol/source/Raster'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { Feature } from 'ol'
import { get, fromLonLat } from 'ol/proj'
import ImageLayer from 'ol/layer/Image'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style'
import { getWidth, getTopLeft } from 'ol/extent'
import marker from '@/assets/marker.png'

/**
 * 创建 WMS Layer
 * @param {*} url WMS 图层地址
 * @param {*} layers 访问视图
 * @param {*} projection 坐标系,不填写则默认采用地图View相同坐标系
 * @returns WMS Layer
 */
function createWMSLayer(url, layers, projection) {
  return new TileLayer({
    source: new TileWMS({
      url,
      crossOrigin: 'anonymous',
      wrapX: true,
      params: {
        FORMAT: 'image/jpeg',
        VERSION: '1.1.1',
        LAYERS: layers
      },
      projection
    })
  })
}

/**
 * 创建 WMTS Layer
 * @param {*} url WMTS 图层地址
 * @param {*} projection 坐标系,不填写则默认采用地图View相同坐标系
 * @returns WMTS Layer
 */
function createWMTSLayer(url, projection = 'EPSG:4326') {
  const projections = get(projection)
  const projectionExtent = projections.getExtent()
  const size = getWidth(projectionExtent) / 256
  const resolutions = new Array(19)
  const matrixIds = new Array(19)
  for (let z = 0; z < 19; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z)
    matrixIds[z] = z
  }

  return new TileLayer({
    source: new WMTS({
      url,
      crossOrigin: 'anonymous',
      layer: 'vec',
      version: '1.0.0',
      style: 'default',
      matrixSet: 'c',
      format: 'tiles',
      wrapX: true,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      })
    })
  })
}

/**
 * 创建 XYZ Layer
 * @param {*} url XYZ 图层地址
 * @param {*} projection 坐标系,不填写则默认采用地图View相同坐标系
 * @returns XYZ Layer
 */
function createXYZLayer(url, projection) {
  return new TileLayer({
    source: new XYZ({
      url,
      crossOrigin: 'anonymous',
      projection
    })
  })
}

/**
 * 将基础图层转化为灰色
 * @param {*} baseMapLayer 转化的基础图层
 * @returns
 */
function ColorTranGray(baseMapLayer) {
  return new ImageLayer({
    source: new Raster({
      sources: [baseMapLayer],
      // 这里设置为image类型，与官方示例不同，优化速度
      operationType: 'image',
      operation: function (pixels, data) {
        // 执行颜色转换方法
        let pixelsTemp = pixels[0].data
        for (var i = 0; i < pixelsTemp.length; i += 4) {
          var r = pixelsTemp[i]
          var g = pixelsTemp[i + 1]
          var b = pixelsTemp[i + 2]
          //运用图像学公式，设置灰度值
          var grey = r * 0.3 + g * 0.59 + b * 0.11
          //将rgb的值替换为灰度值
          pixelsTemp[i] = grey
          pixelsTemp[i + 1] = grey
          pixelsTemp[i + 2] = grey
        }
        return pixels[0]
      },
      // 线程数量
      threads: 10
    })
  })
}

/**
 * 将基础图层转化为黑色
 * @param {*} baseMapLayer 转化的基础图层
 * @returns
 */
function ColorTranBlack(baseMapLayer) {
  return new ImageLayer({
    source: new Raster({
      sources: [baseMapLayer],
      // 这里设置为image类型，与官方示例不同，优化速度
      operationType: 'image',
      operation: function (pixels, data) {
        // 执行颜色转换方法
        let pixelsTemp = pixels[0].data
        for (var i = 0; i < pixelsTemp.length; i += 4) {
          var r = pixelsTemp[i]
          var g = pixelsTemp[i + 1]
          var b = pixelsTemp[i + 2]
          //运用图像学公式，设置灰度值
          var grey = r * 0.3 + g * 0.59 + b * 0.11
          //将rgb的值替换为灰度值
          pixelsTemp[i] = grey
          pixelsTemp[i + 1] = grey
          pixelsTemp[i + 2] = grey

          //黑色，依赖上边的灰色
          pixelsTemp[i] = 255 - pixelsTemp[i]
          pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
          pixelsTemp[i + 2] = 255 - pixelsTemp[i + 2]
        }
        return pixels[0]
      },
      // 线程数量
      threads: 10
    })
  })
}

/**
 * 将基础图层转化为蓝色
 * @param {*} baseMapLayer 转化的基础图层
 * @returns
 */
function ColorTranBlue(baseMapLayer) {
  return new ImageLayer({
    source: new Raster({
      sources: [baseMapLayer],
      // 这里设置为image类型，与官方示例不同，优化速度
      operationType: 'image',
      operation: function (pixels, data) {
        // 执行颜色转换方法
        let pixelsTemp = pixels[0].data
        for (var i = 0; i < pixelsTemp.length; i += 4) {
          var r = pixelsTemp[i]
          var g = pixelsTemp[i + 1]
          var b = pixelsTemp[i + 2]
          //运用图像学公式，设置灰度值
          var grey = r * 0.3 + g * 0.59 + b * 0.11
          //将rgb的值替换为灰度值
          pixelsTemp[i] = grey
          pixelsTemp[i + 1] = grey
          pixelsTemp[i + 2] = grey

          pixelsTemp[i] = 55 - pixelsTemp[i]
          pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
          pixelsTemp[i + 2] = 305 - pixelsTemp[i + 2]
        }
        return pixels[0]
      },
      // 线程数量
      threads: 10
    })
  })
}

/**
 * 将基础图层转化为反转色
 * @param {*} baseMapLayer 转化的基础图层
 * @returns
 */
function ColorTranReversal(baseMapLayer) {
  return new ImageLayer({
    source: new Raster({
      sources: [baseMapLayer],
      // 这里设置为image类型，与官方示例不同，优化速度
      operationType: 'image',
      operation: function (pixels, data) {
        // 执行颜色转换方法
        let pixelsTemp = pixels[0].data
        for (var i = 0; i < pixelsTemp.length; i += 4) {
          pixelsTemp[i] = 255 - pixelsTemp[i]
          pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
          pixelsTemp[i + 2] = 255 - pixelsTemp[i + 2]
        }
        return pixels[0]
      },
      // 线程数量
      threads: 10
    })
  })
}

/**
 * 添加单个图标
 * @param {Object} vectorLayer 矢量图层
 * @param {Array} point 点, eg: [lon,lat]
 * @param {string} iconSrc 点路径 eg: import marker from '@/assets/marker.png'
 */
function addIcon(vectorLayer, point, iconSrc = marker) {
  if (vectorLayer == null) {
    return
  }
  // 创建 feature
  let feature = new Feature({
    geometry: new Point(point)
  })
  // 设置样式
  feature.setStyle(
    new Style({
      image: new Icon({
        src: iconSrc
      })
    })
  )
  // 添加到 layer
  vectorLayer.getSource().addFeature(feature)
}

/**
 * 创建几何图形 Layer 并添加至地图
 * @param {*} map 地图
 * @returns 几何图形 Layer
 */
function addVectorLayer(map) {
  if (map == null) {
    return
  }
  var vectorLayer = new VectorLayer({
    source: new Vector()
  })
  map.addLayer(vectorLayer)
  return vectorLayer
}

/**
 * 初始化几何图形 Layer 并添加至地图，若Layer已存在，清空图层并返回
 * @param {Map} map 地图
 * @param {String} id 唯一图层id
 * @returns {Object} 几何图形 Layer
 */
function initVectorLayer(map, id) {
  var vectorLayer
  if (map != null) {
    let layers = map.getAllLayers()
    let existLayer = layers.filter(layer => {
      return layer.get('id') === id
    })
    if (existLayer && existLayer.length > 0) {
      vectorLayer = existLayer[0]
      vectorLayer.getSource().clear()
    } else {
      vectorLayer = new VectorLayer({
        properties: {
          id
        },
        source: new Vector()
      })
      map.addLayer(vectorLayer)
    }
    return vectorLayer
  }
}

/**
 * 创建线段 并添加至 几何图形 Layer
 * @param {*} vectorLayer 几何图形 Layer
 */
function addLine(vectorLayer, points) {
  if (vectorLayer && points) {
    let lineFeature = new Feature({
      geometry: new LineString(points)
    })
    vectorLayer.getSource().addFeature(lineFeature)
  }
}

/**
 * 创建线段
 * @param {Object} vectorLayer 几何图形 Layer
 * @param {Array} points 点集合 [[lng, lat], [lng, lat]]
 * @param {String} color 轨迹颜色
 * @param {String} strokeStyle 为轨迹的样式 solid:实线，dashed:虚线
 * @param {Number} width 轨迹粗细
 */
export function addPolyline(vectorLayer, points, color, strokeStyle, width = 3) {
  if (!points || points.length === 0) {
    return
  }
  let lineFeature = new Feature({
    geometry: new LineString(points)
  })
  lineFeature.setStyle(
    new Style({
      stroke: new Stroke({
        width: width,
        color: color,
        lineDash: strokeStyle === 'dashed' ? [8, 7] : []
      })
    })
  )
  vectorLayer.getSource().addFeatures([lineFeature])
}

/**
 * 地图中心点定位，含动画效果
 * @param {Map} map 地图
 * @param {Object} point 中心点坐标 [lng, lat]
 */
function setMapCenter(map, point) {
  if (map == null || point == null) {
    return
  }
  map.getView().animate({
    center: point,
    duration: 300
  })
}

export {
  createWMSLayer,
  createWMTSLayer,
  createXYZLayer,
  ColorTranGray,
  ColorTranBlack,
  ColorTranBlue,
  ColorTranReversal,
  addVectorLayer,
  initVectorLayer,
  setMapCenter,
  addLine,
  addIcon
}
