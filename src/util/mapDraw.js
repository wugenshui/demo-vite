/**
 * 该工具类封装OpenLayers图形绘制与展示
 */
import VectorLayer from 'ol/layer/Vector'
import Vector from 'ol/source/Vector'
import { Feature } from 'ol'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style'
import { Draw, Modify } from 'ol/interaction'

// 缓存-绘图操作-用于清理动画
let draw
// 缓存-绘图更改-用于清理动画
let modify

/**
 * 增加绘图几何图形 Layer，可以在图层上绘制图形与展示图形
 * @param {Object} map 地图对象
 * @returns 返回几何图形 Layer
 */
function addDrawVectorLayer(map) {
  if (!map) {
    return
  }
  const vector = new VectorLayer({
    source: new Vector({
      features: []
    }),
    style: new Style({
      // 填充样式 Circle、Polygon
      fill: new Fill({
        color: 'rgba(255,0,64,0.1)'
      }),
      // 线条样式 LineString、Circle、Polygon
      stroke: new Stroke({
        color: 'rgba(255,0,0,0.5)',
        width: 2
      }),
      // 点样式 Point
      image: new CircleStyle({
        radius: 20,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  })
  // 添加图形图层
  map.addLayer(vector)
  return vector
}

/**
 * 进入绘图模式
 * @param {Object} map 地图对象，通过initMap获取
 * @param {Object} vectorLayer 矢量图层
 * @param {String} drawType 绘制类型：'Circle'、'LineString'、'Polygon'
 * @param {Function} drawendHandle 绘制完成回调事件
 * eg: function drawendHandle(geometry) {
 *      let type = geometry.getType()
 *      let coordinates = geometry.getCoordinates()
 *     }
 */
function enterDrawMode(map, vectorLayer, drawType, drawendHandle) {
  if (!map || !vectorLayer) {
    return
  }
  // 移除之前的绘制事件
  exitDrawMode(map)
  // 增加编辑模式
  modify = new Modify({ source: vectorLayer.getSource() })
  map.addInteraction(modify)
  draw = new Draw({
    source: vectorLayer.getSource(),
    type: drawType
  })
  map.addInteraction(draw)

  // 绘制完成事件
  draw.on('drawend', e => {
    // 绘制完成后先中止绘制事件
    exitDrawMode(map)
    // 处理自定义响应
    if (e.feature && e.feature.getGeometry()) {
      drawendHandle(e.feature.getGeometry())
    }
  })
}

/**
 * 退出绘图模式
 * @param {Object} map 地图对象
 */
function exitDrawMode(map) {
  if (draw) {
    map.removeInteraction(draw)
  }
  if (modify) {
    map.removeInteraction(modify)
  }
}

/**
 * 添加圆形
 * @param {Object} vectorLayer 矢量图层
 * @param {Object} id 图形id，后续可以通过id进行删除
 * @param {Array} center 圆心坐标 eg: [98.251978, 39.824951]
 * @param {Number} radius 半径 eg: 0.2
 * @param {Object} properties 附加属性，后续可以通过feature.get(key)获取属性值
 */
function addCircle(vectorLayer, id, center, radius, properties = null) {
  if (vectorLayer) {
    let feature = new Feature({
      geometry: new Circle(center, radius)
    })
    feature.setId(id)
    if (properties) {
      feature.setProperties(properties)
    }
    vectorLayer.getSource().addFeature(feature)
    return feature
  }
}

/**
 * 添加线段
 * @param {Object} vectorLayer 矢量图层
 * @param {Object} id 图形id，后续可以通过id进行删除
 * @param {Array} points 点集合,eg: points = [[98.252978, 39.827951], [98.272255, 39.830685]]
 * @param {Object} properties 附加属性，后续可以通过feature.get(key)获取属性值
 */
function addLineString(vectorLayer, id, points, properties = null) {
  if (vectorLayer) {
    let feature = new Feature({
      geometry: new LineString(points)
    })
    feature.setId(id)
    if (properties) {
      feature.setProperties(properties)
    }
    vectorLayer.getSource().addFeature(feature)
    return feature
  }
}

/**
 * 添加多边形
 * @param {Object} vectorLayer 矢量图层
 * @param {Object} id 图形id，后续可以通过id进行删除
 * @param {Array} points 点集合,eg: points = [[98.252978, 39.827951], [98.272255, 39.830685]]
 * @param {Object} properties 附加属性，后续可以通过feature.get(key)获取属性值
 */
function addPolygon(vectorLayer, id, points, properties = null) {
  if (vectorLayer) {
    let feature = new Feature({
      geometry: new Polygon(points)
    })
    feature.setId(id)
    if (properties) {
      feature.setProperties(properties)
    }
    vectorLayer.getSource().addFeature(feature)
    return feature
  }
}

/**
 * 添加多边形
 * @param {Object} vectorLayer 矢量图层
 * @param {Object} id 图形id，后续可以通过id进行删除
 * @param {Array} point 点集合,eg: [98.252978, 39.827951]
 * @param {Object} properties 附加属性，后续可以通过feature.get(key)获取属性值
 */
function addPoint(vectorLayer, id, point, properties = null) {
  if (vectorLayer) {
    let feature = new Feature({
      geometry: new Point(point)
    })
    feature.setId(id)
    if (properties) {
      feature.setProperties(properties)
    }
    vectorLayer.getSource().addFeature(feature)
    return feature
  }
}

/**
 * 移除矢量图层中绘制中的几何图形
 * @param {*} vectorLayer 矢量图层
 * @param {String} id 图形id
 */
function removeFeatureById(vectorLayer, id) {
  let features = vectorLayer.getSource().getFeatureById(id)
  vectorLayer.getSource().removeFeature(features)
}

/**
 * 修改矢量图层中绘制中的几何图形id
 * @param {*} vectorLayer 矢量图层
 * @param {String} oldId 老id
 * @param {String} newId 新id
 */
function resetFeatureId(vectorLayer, oldId, newId) {
  let features = vectorLayer.getSource().getFeatureById(oldId)
  features.setId(newId)
}

/**
 * 自适应单个绘制图形,并删除其余图形
 * @param {Object} map 地图对象，通过initMap获取
 * @param {Object} vectorLayer 矢量图层
 * @param {Number} id 图形id
 */
function fitFeature(map, vectorLayer, id) {
  if (!map || !vectorLayer) {
    return
  }
  let features = vectorLayer.getSource().getFeatures()
  features.forEach(feature => {
    if (feature.getId() === id) {
      // 聚焦指定围栏
      map.getView().fit(feature.getGeometry(), { padding: [50, 50, 50, 50] })
    } else {
      // 移除其它围栏
      vectorLayer.getSource().removeFeature(feature)
    }
  })
}

export {
  addDrawVectorLayer,
  enterDrawMode,
  exitDrawMode,
  addCircle,
  addLineString,
  addPolygon,
  addPoint,
  removeFeatureById,
  resetFeatureId,
  fitFeature
}
