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
import {
  createWMSLayer,
  createWMTSLayer,
  createXYZLayer,
  addVectorLayer,
  addLine
} from '@/util/map'
import { names, wgs84, gcj02 } from '@/data/points'
import MAPURL from '@/util/mapurl'

// 地图当前展示图层
let map
// 图层列表
let layersGoups = []

export default {
  name: 'SwitchMap',
  data() {
    return {
      types: []
    }
  },
  methods: {
    // 切换图层
    toggleMapType(index) {
      map.setLayers(layersGoups[index])
    },
    // 创建图层组
    createLayerGroup(layerGroupName, layers) {
      this.types.push(layerGroupName)
      layersGoups.push(layers)
    }
  },
  mounted() {
    // 首个图层，默认加载
    // this.createLayerGroup('test', [
    //   createXYZLayer('http://wprd0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}')
    // ])
    this.createLayerGroup('天地图街道', [
      createXYZLayer(MAPURL.Tianditu.Street, 'EPSG:4326'),
      createXYZLayer(MAPURL.Tianditu.StreetFont, 'EPSG:4326')
    ])
    this.createLayerGroup('天地图卫星', [
      createXYZLayer(MAPURL.Tianditu.Satellite, 'EPSG:4326'),
      createXYZLayer(MAPURL.Tianditu.SatelliteFont, 'EPSG:4326')
    ])
    this.createLayerGroup('天地图街道WMTS', [
      createWMTSLayer(MAPURL.Tianditu.WMTSStreetFont, 'EPSG:4326'),
      createWMTSLayer(MAPURL.Tianditu.WMTSStreet, 'EPSG:4326')
    ])

    this.createLayerGroup('高德街道', [createXYZLayer(MAPURL.Gaode.Street, gcjProjection)])
    this.createLayerGroup('高德街道2', [createXYZLayer(MAPURL.Gaode.Street2, gcjProjection)])
    this.createLayerGroup('高德卫星', [createXYZLayer(MAPURL.Gaode.Satellite, gcjProjection)])

    this.createLayerGroup('谷歌街道', [createXYZLayer(MAPURL.Google.Street, gcjProjection)])
    this.createLayerGroup('谷歌卫星', [createXYZLayer(MAPURL.Google.Satellite, gcjProjection)])

    layersGoups.push(
      new TileLayer({
        source: new OSM()
      })
    )

    map = new Map({
      layers: [],
      target: 'map',
      view: new View({
        center: wgs84[1],
        projection: 'EPSG:4326',
        zoom: 16,
        maxZoom: 22,
        minZoom: 1,
        enableRotation: false
      })
    })
    this.toggleMapType(0)

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
