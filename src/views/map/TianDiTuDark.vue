<template>
  <!-- 参考资料：https://blog.csdn.net/linzi19900517/article/details/120307650 -->
  <div id="map">
    <map-switch :types="types" @toggleMapType="toggleMapType" />
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { createXYZLayer, ColorTranBlue, ColorTranGray, ColorTranBlack, ColorTranReversal } from '@/util/map'
import { names, wgs84, gcj02 } from '@/data/points'
import MAPURL from '@/util/mapurl'

// 地图当前展示图层
let mapCurrentLayer = []
// 切换图层列表
let layers = []

export default {
  name: 'TianDiTuDark',
  data() {
    return {
      types: [
        '街道图蓝色',
        '街道图灰色',
        '街道图黑色',
        '街道图反转色',
        '街道图原图',
        '卫星图蓝色',
        '卫星图灰色',
        '卫星图黑色',
        '卫星图反转色',
        '卫星图原图'
      ]
    }
  },
  methods: {
    toggleMapType(index) {
      mapCurrentLayer.setAt(0, layers[index * 2])
      mapCurrentLayer.setAt(1, layers[index * 2 + 1])
    }
  },
  mounted() {
    layers.push(ColorTranBlue(createXYZLayer(MAPURL.TiandituStreet, 'EPSG:4326')))
    layers.push(ColorTranBlue(createXYZLayer(MAPURL.TiandituStreetFont, 'EPSG:4326')))
    layers.push(ColorTranGray(createXYZLayer(MAPURL.TiandituStreet, 'EPSG:4326')))
    layers.push(ColorTranGray(createXYZLayer(MAPURL.TiandituStreetFont, 'EPSG:4326')))
    layers.push(ColorTranBlack(createXYZLayer(MAPURL.TiandituStreet, 'EPSG:4326')))
    layers.push(ColorTranBlack(createXYZLayer(MAPURL.TiandituStreetFont, 'EPSG:4326')))
    layers.push(ColorTranReversal(createXYZLayer(MAPURL.TiandituStreet, 'EPSG:4326')))
    layers.push(ColorTranReversal(createXYZLayer(MAPURL.TiandituStreetFont, 'EPSG:4326')))
    layers.push(createXYZLayer(MAPURL.TiandituStreet, 'EPSG:4326'))
    layers.push(createXYZLayer(MAPURL.TiandituStreetFont, 'EPSG:4326'))
    layers.push(ColorTranBlue(createXYZLayer(MAPURL.TiandituSatellite, 'EPSG:4326')))
    layers.push(ColorTranBlue(createXYZLayer(MAPURL.TiandituSatelliteFont, 'EPSG:4326')))
    layers.push(ColorTranGray(createXYZLayer(MAPURL.TiandituSatellite, 'EPSG:4326')))
    layers.push(ColorTranGray(createXYZLayer(MAPURL.TiandituSatelliteFont, 'EPSG:4326')))
    layers.push(ColorTranBlack(createXYZLayer(MAPURL.TiandituSatellite, 'EPSG:4326')))
    layers.push(ColorTranBlack(createXYZLayer(MAPURL.TiandituSatelliteFont, 'EPSG:4326')))
    layers.push(ColorTranReversal(createXYZLayer(MAPURL.TiandituSatellite, 'EPSG:4326')))
    layers.push(ColorTranReversal(createXYZLayer(MAPURL.TiandituSatelliteFont, 'EPSG:4326')))
    layers.push(createXYZLayer(MAPURL.TiandituSatellite, 'EPSG:4326'))
    layers.push(createXYZLayer(MAPURL.TiandituSatelliteFont, 'EPSG:4326'))

    var map = new Map({
      target: 'map',
      layers: [layers[0], layers[1]],
      view: new View({
        projection: 'EPSG:4326',
        center: wgs84[1],
        zoom: 16,
        maxZoom: 18,
        minZoom: 1,
        multiWorld: false
      })
    })
    mapCurrentLayer = map.getLayers()
  }
}
</script>
