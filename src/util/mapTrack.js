import VectorLayer from 'ol/layer/Vector'
import Vector from 'ol/source/Vector'
import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import { Stroke, Style } from 'ol/style'

/**
 * 轨迹播放默认配置
 */
const defaultConfig = {
  // 是否展示完整的灰色轨迹
  showGrayTrack: true,
  // 是否在播放前将轨迹自动居中
  autoCenterBeforePlay: true
}

// 全部轨迹
var _points = []
// 播放轨迹索引，因为轨迹至少需要两个点，因此从1开始
var _index = 1
// 暂停标识
var _pauseSign = false
// 播放完成标识
var _finishSign = false
// 轨迹播放实际配置
var _config = defaultConfig
// 地图对象
var _map
// 灰色轨迹图层
var _grayFrature
// 当前绘制线段，用于绘制最新的一个点
var _lineString
// 轨迹图层数据源
var _source
// 定时器对象
let _interval = null

/**
 * 播放
 * @param {*} map 地图
 * @param {*} points 播放的轨迹
 * @param {*} config 自定义配置，参考轨迹播放默认配置，可不配置
 */
function play(map, points, config) {
  _map = map
  _points = points
  _config = Object.assign(defaultConfig, config)
  _playCommonHandle()
}

/**
 * 重新播放，执行该方法前确保执行过 play 方法进行了数据的初始化
 */
function replay() {
  _playCommonHandle()
}

/**
 * 暂停
 */
function pause() {
  _pauseSign = true
  return _pauseSign
}

/**
 * 暂停后恢复
 */
function resume() {
  _pauseSign = false
  return _pauseSign
}

/**
 * 播放/重新播放 通用处理
 */
function _playCommonHandle() {
  // 若存在定时器先清空
  if (_interval) {
    clearInterval(_interval)
  }
  // 启动定时器播放轨迹
  _interval = setInterval(() => {
    if (!_pauseSign && !_finishSign) {
      _drawNextPoint()
    }
  }, 10)
  _pauseSign = false
  _finishSign = false
  _index = 1
  // 移除旧的轨迹
  if (_source) {
    _source.clear()
  } else {
    // 轨迹绘制数据源，用于添加删除 Feature
    _source = new Vector({
      features: []
    })
    // 添加几何图层
    _map.addLayer(
      new VectorLayer({
        source: _source
      })
    )
  }

  _grayFrature = new Feature({
    geometry: new LineString(_points)
  })

  // 如果需要展示默认的灰色轨迹
  if (_config.showGrayTrack) {
    _grayFrature.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'gray',
          width: 3,
          lineDash: [8, 7]
        })
      })
    )
    _source.addFeature(_grayFrature)
  }

  checkAutoCenter()
  console.log(`track play，points length:${_points.length}`)
}

/**
 * 检查是否需要默认居中
 */
function checkAutoCenter() {
  if (_config.autoCenterBeforePlay && _grayFrature) {
    _map.getView().fit(_grayFrature.getGeometry(), {
      padding: [20, 20, 20, 20]
    })
  }
}

/**
 * 绘制下一个点
 */
function _drawNextPoint() {
  if (_index <= _points.length - 1) {
    _GetLineStyle(_points[_index - 1], _points[_index])
    // 参数格式：[113.123, 23.123]
    _lineString.appendCoordinate(_points[_index])
    _index++
  } else {
    _finishSign = true
    console.log('play finish')
  }
}

/**
 * 通过条件判断绘制线段的样式
 * @param {*} point1 上一个点
 * @param {*} point2 当前点
 */
function _GetLineStyle(point1, point2) {
  if (!_source) {
    return
  }
  if (_index === 1 || _index < _points.length / 8) {
    // 参数格式：[[113.123, 23.123]]
    _lineString = new LineString([point1])
    let currentFeayure = new Feature({
      geometry: _lineString
    })
    currentFeayure.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'red',
          width: 4
        })
      })
    )
    _source.addFeature(currentFeayure)
  } else if (_index < _points.length / 4) {
    _lineString = new LineString([point1])
    let currentFeayure = new Feature({
      geometry: _lineString
    })
    currentFeayure.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'green',
          width: 4
        })
      })
    )
    _source.addFeature(currentFeayure)
  } else if (_index < _points.length / 2) {
    _lineString = new LineString([point1])
    let currentFeayure = new Feature({
      geometry: _lineString
    })
    currentFeayure.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 4,
          lineDash: [8, 8]
        })
      })
    )
    _source.addFeature(currentFeayure)
  } else {
    _lineString = new LineString([point1])
    let currentFeayure = new Feature({
      geometry: _lineString
    })
    currentFeayure.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'purple',
          width: 5,
          lineDash: [12, 12]
        })
      })
    )
    _source.addFeature(currentFeayure)
  }
}

export { play, replay, pause, resume }
