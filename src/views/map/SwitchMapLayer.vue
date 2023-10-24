<template>
  <div id="map">
    <map-switch :types="types" @toggleMapType="toggleMapType" />
  </div>
</template>

<script>
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import View from 'ol/View'
import { gcjProjection } from '@/util/projectionGCJ'
import { createWMSLayer, createWMTSLayer, createXYZLayer, addVectorLayer, addLine } from '@/util/map'
import { names, wgs84, gcj02 } from '@/data/points'
import MAPURL from '@/util/mapurl'

// 地图当前展示图层
let mapCurrentLayer = []
// 切换图层列表
let layers = []

export default {
  name: 'SwitchMap',
  data() {
    return {
      types: ['天地图街道 WMTS', '天地图街道 XYZ', '天地图卫星 XYZ', '高德街道 XYZ', '高德卫星 XYZ', 'OSM']
    }
  },
  methods: {
    toggleMapType(index) {
      mapCurrentLayer.setAt(0, layers[index])
    }
  },
  mounted() {
    layers.push(createWMTSLayer(MAPURL.WMTSTiandituStreet, 'EPSG:4326'))

    layers.push(createXYZLayer(MAPURL.TiandituStreet))
    layers.push(createXYZLayer(MAPURL.TiandituSatellite))

    layers.push(createXYZLayer(MAPURL.GaodeStreet, gcjProjection))
    layers.push(createXYZLayer(MAPURL.GaodeSatellite, gcjProjection))

    layers.push(
      new TileLayer({
        source: new OSM()
      })
    )
    // 文字图层
    let fontLayer = createXYZLayer(MAPURL.TiandituStreetFont)

    let map = new Map({
      layers: [layers[0], fontLayer],
      target: 'map',
      view: new View({
        center: wgs84[1],
        projection: 'EPSG:4326',
        zoom: 16,
        maxZoom: 18,
        minZoom: 1,
        enableRotation: false
      })
    })
    mapCurrentLayer = map.getLayers()

    // 点击获取坐标
    map.on('click', function (e) {
      console.log('[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
    })

    // 绘制线段
    let vectorLayer = addVectorLayer(map)
    addLine(vectorLayer, wgs84)
  }
}
</script>
