<template>
  <div id="map">
    <map-switch @toggleMapType="toggleMapType" />
  </div>
</template>

<script>
import { Map, View, Overlay, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import { XYZ, TileWMS, WMTS, Vector, Raster, Cluster } from 'ol/source'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text } from 'ol/style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get, fromLonLat } from 'ol/proj'
import { ScaleLine, defaults as defaultControls } from 'ol/control.js'
import { createEmpty, extend, getWidth, getHeight } from 'ol/extent'
import { createXYZLayer, addVectorLayer, initVectorLayer, addLine } from '@/util/map'
import MAPURL from '@/util/mapurl'
import { names, wgs84, wgs842, gcj02 } from '@/data/points'

// 地图对象
let map = null
// 切换图层列表
let layers = []

export default {
  data() {
    return {}
  },
  methods: {
    toggleMapType(index) {
      map.getLayers().setAt(0, layers[index])
    }
  },
  mounted() {
    layers.push(
      new TileLayer({
        source: new XYZ({
          url: MAPURL.Gaode.Street,
          crossOrigin: 'anonymous',
          projection: 'EPSG:3857'
        })
      })
    )
    layers.push(
      new TileLayer({
        source: new XYZ({
          url: MAPURL.Gaode.Satellite,
          crossOrigin: 'anonymous',
          projection: 'EPSG:3857'
        })
      })
    )

    map = new Map({
      target: 'map',
      layers: [layers[0]],
      view: new View({
        center: gcj02[1],
        zoom: 16,
        multiWorld: false,
        projection: 'EPSG:4326'
      }),
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric'
        })
      ])
    })

    // 点击获取坐标
    map.on('click', e => {
      console.log('event:click', '[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
    })

    // 监听图层缩放事件
    map.getView().on('change:resolution', e => {
      console.log('event:change:resolution', e.target.getZoom(), e.target.getResolution())
    })

    // 创建图层
    var vectorLayer = new VectorLayer({
      source: new Vector()
    })
    map.getLayers().push(vectorLayer)
    // 绘线
    vectorLayer.getSource().addFeature(
      new Feature({
        geometry: new LineString(wgs84)
      })
    )
    // 绘点
    vectorLayer.getSource().addFeature(
      new Feature({
        geometry: new Point(wgs84[0])
      })
    )
    vectorLayer.getSource().addFeature(
      new Feature({
        geometry: new Point(wgs84[1])
      })
    )
    vectorLayer.getSource().addFeature(
      new Feature({
        geometry: new Point(wgs84[2])
      })
    )
  }
}
</script>
