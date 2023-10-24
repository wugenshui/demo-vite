<template>
  <!-- 对接GeoServer发布的WMS图层 -->
  <div id="map">
    <map-switch @toggleMapType="toggleMapType" />
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import { createWMSLayer } from '@/util/map'
import { names, wgs84, gcj02 } from '@/data/points'

export default {
  name: 'GeoServer',
  data() {
    return {
      layers: null,
      mapLayers: []
    }
  },
  methods: {
    toggleMapType(index) {
      this.layers.setAt(0, this.mapLayers[index])
    }
  },
  mounted() {
    // 这里使用3857和4326都不影响图层的展示,API会自动转换需要取得的图层
    this.mapLayers.push(createWMSLayer('/wms', 'gaode', 'EPSG:4326'))
    this.mapLayers.push(createWMSLayer('/wms', 'gaode-street', 'EPSG:3857'))

    var map = new Map({
      target: 'map',
      layers: [this.mapLayers[0]],
      view: new View({
        center: fromLonLat(gcj02[0]),
        zoom: 12,
        projection: 'EPSG:3857',
        multiWorld: false
      })
    })
    this.layers = map.getLayers()
    
    // 点击获取坐标
    map.on('click', function (e) {
      console.log('[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
    })
  }
}
</script>
