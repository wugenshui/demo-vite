<template>
  <!-- 高德图层，可以作为基础模式研究其它功能 -->
  <div id="map">
    <map-switch @toggleMapType="toggleMapType" />
  </div>
</template>

<script>
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import { XYZ, TileWMS, WMTS, Vector, Raster } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get, fromLonLat } from 'ol/proj'
import { getWidth, getTopLeft } from 'ol/extent'
import { createXYZLayer, addVectorLayer, initVectorLayer, addLine } from '@/util/map'
import MAPURL from '@/util/mapurl'
import { names, wgs84, wgs842, gcj02 } from '@/data/points'

// 地图当前展示图层
let mapCurrentLayer = []
// 切换图层列表
let layers = []

export default {
  name: 'Gaode',
  data() {
    return {}
  },
  methods: {
    toggleMapType(index) {
      mapCurrentLayer.setAt(0, layers[index])
    }
  },
  mounted() {
    layers.push(createXYZLayer(MAPURL.GaodeStreet, 'EPSG:3857'))
    layers.push(createXYZLayer(MAPURL.GaodeSatellite, 'EPSG:3857'))

    var map = new Map({
      target: 'map',
      layers: [layers[0]],
      view: new View({
        center: gcj02[1],
        zoom: 16,
        multiWorld: false,
        projection: 'EPSG:4326'
      })
    })
    mapCurrentLayer = map.getLayers()

    // 点击获取坐标
    map.on('click', function (e) {
      console.log('[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
    })

    // 绘制线段
    var vectorLayer = initVectorLayer(map, 'testLayer')
    addLine(vectorLayer, wgs84)

    setTimeout(() => {
      // 测试重新获取图层并清空资源
      vectorLayer = initVectorLayer(map, 'testLayer')

      // 测试再次绘制资源
      setTimeout(() => {
        addLine(vectorLayer, wgs842)
      }, 1000)
    }, 1000)
  }
}
</script>
