<template>
  <!-- 高德图层，可以作为基础模式研究其它功能 -->
  <div id="map">
    <map-switch @toggleMapType="toggleMapType" />
    <div id="popup" class="ol-popup">
      <a @click="closePopup" id="popup_closer" class="ol-popup-closer"></a>
      <div id="popup_content">{{ popupInfo }}</div>
    </div>
  </div>
</template>

<script>
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
import Overlay from 'ol/Overlay'
import { get, fromLonLat } from 'ol/proj'
import ImageLayer from 'ol/layer/Image'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text, Image } from 'ol/style'
import { getWidth, getTopLeft } from 'ol/extent'
import View from 'ol/View'
import { createXYZLayer, addVectorLayer, initVectorLayer, addIcon } from '@/util/map'
import { names, wgs84, wgs842, gcj02 } from '@/data/points'
import MAPURL from '@/util/mapurl'

// 地图当前展示图层
let mapCurrentLayer = []
// 切换图层列表
let layers = []
// 弹出框对象
let popup
export default {
  name: 'popup',
  data() {
    return {
      popupInfo: null
    }
  },
  methods: {
    toggleMapType(index) {
      mapCurrentLayer.setAt(0, layers[index])
    },
    showPopup(position) {
      popup.setPosition(position)
    },
    closePopup() {
      popup.setPosition(null)
    }
  },
  mounted() {
    layers.push(createXYZLayer(MAPURL.Gaode.Street, 'EPSG:3857'))
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

    // 绘制图标
    var vectorLayer = initVectorLayer(map, 'testLayer')

    let feature = new Feature({
      geometry: new Point(wgs84[0]),
      data: {
        name: '第一个点',
        index: 1
      }
    })
    feature.setStyle(
      new Style({
        text: new Text({
          text: '第一个点',
          fill: new Fill({
            color: 'red'
          })
        })
      })
    )
    vectorLayer.getSource().addFeature(feature)

    let feature2 = new Feature({
      geometry: new Point(wgs84[2]),
      data: {
        name: '第二个点',
        index: 2
      }
    })
    feature2.setStyle(
      new Style({
        text: new Text({
          text: '第二个点',
          fill: new Fill({
            color: 'red'
          })
        })
      })
    )
    vectorLayer.getSource().addFeature(feature2)

    // 鼠标移到图标上变成手势
    map.on('pointermove', e => {
      let pixel = map.getEventPixel(e.originalEvent)
      let hashasFeature = map.hasFeatureAtPixel(pixel)
      map.getTargetElement().style.cursor = hashasFeature ? 'pointer' : ''
    })

    // 点击图形元素事件
    map.on('click', e => {
      // console.log('[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
      var pixel = map.getEventPixel(e.originalEvent)
      // 第一种方式：遍历图形
      map.forEachFeatureAtPixel(pixel, feature => {
        this.popupInfo = feature.get('data')
        this.showPopup(e.coordinate)
      })
      // 第二种方式：批量获取所有的图形
      // var features = map.getFeaturesAtPixel(pixel)
    })

    // 初始化弹出框
    popup = new Overlay({
      element: document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })
    map.addOverlay(popup)
  }
}
</script>

<style>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: '✖';
}
</style>
