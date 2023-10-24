<template>
  <!-- 高德图层，可以作为基础模式研究其它功能 -->
  <div id="map">
    <map-switch @toggleMapType="toggleMapType" />
    <div id="popup" class="ol-popup">
      <a @click="closePopup" id="popup_closer" class="ol-popup-closer"></a>
      <div id="popup_content">{{ popupInfo }}</div>
    </div>
    <!-- 地图弹框 -->
    <div ref="popup" class="popup">
      <div class="popup-content">
        <div class="map-popup-title-big">{{ popupInfo }}</div>
        <div class="map-popup-title-little">处理量：</div>
        <div class="map-popup-section">
          <p>计划值：100t</p>
          <p>已完成：86t</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import KML from 'ol/format/KML'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import TileWMS from 'ol/source/TileWMS'
import WMTS from 'ol/source/WMTS'
import XYZ from 'ol/source/XYZ'
import Vector from 'ol/source/Vector'
import Raster from 'ol/source/Raster'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { Feature } from 'ol'
import { get, fromLonLat } from 'ol/proj'
import ImageLayer from 'ol/layer/Image'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style'
import { getWidth, getTopLeft } from 'ol/extent'
import View from 'ol/View'
import { createXYZLayer, addVectorLayer, initVectorLayer, addLine } from '@/util/map'
import { names, wgs84, wgs842, gcj02 } from '@/data/points'
import MAPURL from '@/util/mapurl'
import { gcjProjection } from '@/util/projectionGCJ'
import Overlay from 'ol/Overlay'

// 地图当前展示图层
let mapCurrentLayer = []
// 切换图层列表
let layers = []
// 弹出框对象
let popup
export default {
  name: 'KML',
  data() {
    return {
      popupInfo: ''
    }
  },
  methods: {
    toggleMapType(index) {
      mapCurrentLayer.setAt(0, layers[index])
    }
  },
  mounted() {
    layers.push(createXYZLayer(MAPURL.GoogleSatellite, gcjProjection))
    layers.push(createXYZLayer(MAPURL.GoogleStreet, gcjProjection))
    // 外圈 KML 样式
    const outerKmlStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(0,255,255, 1)',
        width: 2
      })
    })
    // 内圈 KML 样式
    const innerKmlStyle = new Style({
      fill: new Fill({
        color: 'rgba(00,144,255, 0.1)'
      }),
      stroke: new Stroke({
        color: 'rgba(0,255,255, 1)',
        width: 2
      })
    })
    var map = new Map({
      target: 'map',
      layers: [
        layers[0],
        new VectorLayer({
          source: new Vector({
            url: './all.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          style: outerKmlStyle
        }),
        new VectorLayer({
          source: new Vector({
            url: './1.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          style: innerKmlStyle
        }),
        new VectorLayer({
          source: new Vector({
            url: './2.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          style: innerKmlStyle
        }),
        new VectorLayer({
          source: new Vector({
            url: './3.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          style: innerKmlStyle
        }),
        new VectorLayer({
          source: new Vector({
            url: './4.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          style: innerKmlStyle
        }),
        new VectorLayer({
          source: new Vector({
            url: './5.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          style: innerKmlStyle
        })
      ],
      view: new View({
        center: [117.726678, 29.017839],
        zoom: 14,
        multiWorld: false,
        projection: 'EPSG:4326'
      })
    })
    mapCurrentLayer = map.getLayers()

    // 点击获取坐标
    map.on('click', e => {
      console.log('click', '[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
      let view = map.getView()
      view.setCenter(e.coordinate)
      view.setZoom(15)
    })

    map.on('pointermove', e => {
      let feature = map.forEachFeatureAtPixel(e.pixel, feature => feature)
      if (feature && feature.getProperties().name) {
        this.popupInfo = feature.getProperties().name
        popup.setPosition(e.coordinate)
        map.getViewport().style.cursor = 'pointer'
      } else {
        popup.setPosition(null)
        map.getViewport().style.cursor = 'inherit'
      }
    })

    // 初始化弹出框
    popup = new Overlay({
      element: this.$refs.popup,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })
    map.addOverlay(popup)

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

<style lang="scss" scoped>
.popup-content {
  text-align: left;
  min-width: 145px;
  min-height: 66px;
  box-sizing: border-box;
  padding: 10px 5px 1px;
  background: rgb(11, 22, 32);

  .map-popup-title-big {
    font-size: 16px;
    padding-left: 7px;
    margin-bottom: 8px;
    color: #6df3ea;
  }
  .map-popup-title-little {
    width: 100%;
    height: 20px;
    padding-left: 5px;
    font-size: 13px;
    line-height: 20px;
    color: #81feff;
    background: linear-gradient(90deg, rgba(9, 77, 146, 0.99) 1%, rgba(18, 29, 41, 0) 100%);
  }
  .map-popup-section {
    color: #fff;
    font-size: 14px;
    & > p {
      margin: 10px 0;
      padding-left: 7px;
    }
  }
}

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
