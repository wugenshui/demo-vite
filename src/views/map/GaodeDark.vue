<template>
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
  name: 'GaodeDark',
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
      mapCurrentLayer.setAt(0, layers[index])
    }
  },
  mounted() {
    layers.push(ColorTranBlue(createXYZLayer(MAPURL.Gaode.Street, 'EPSG:3857')))
    layers.push(ColorTranGray(createXYZLayer(MAPURL.Gaode.Street, 'EPSG:3857')))
    layers.push(ColorTranBlack(createXYZLayer(MAPURL.Gaode.Street, 'EPSG:3857')))
    layers.push(ColorTranReversal(createXYZLayer(MAPURL.Gaode.Street, 'EPSG:3857')))
    layers.push(createXYZLayer(MAPURL.Gaode.Street, 'EPSG:3857'))
    layers.push(ColorTranBlue(createXYZLayer(MAPURL.Gaode.Satellite, 'EPSG:3857')))
    layers.push(ColorTranGray(createXYZLayer(MAPURL.Gaode.Satellite, 'EPSG:3857')))
    layers.push(ColorTranBlack(createXYZLayer(MAPURL.Gaode.Satellite, 'EPSG:3857')))
    layers.push(ColorTranReversal(createXYZLayer(MAPURL.Gaode.Satellite, 'EPSG:3857')))
    layers.push(createXYZLayer(MAPURL.Gaode.Satellite, 'EPSG:3857'))

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
  }
}
</script>
