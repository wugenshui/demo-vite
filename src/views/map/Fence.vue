<template>
  <div id="map">
    <div class="map-switch">
      <div
        v-for="d in drawTypes"
        :class="{ active: drawType === d.type }"
        @click="toggleDrawType(d.type)"
        :key="d.type"
      >
        {{ d.name }}
      </div>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { info } from '@/util/common'
import { createXYZLayer } from '@/util/map'
import {
  addDrawVectorLayer,
  enterDrawMode,
  exitDrawMode,
  addCircle,
  addLineString,
  addPolygon,
  addPoint,
  removeFeatureById,
  resetFeatureId,
  fitFeature
} from '@/util/mapDraw'
import { names, wgs84, gcj02 } from '@/data/points'
import MAPURL from '@/util/mapurl'
// 地图对象缓存
var map = null
let vectorLayer = null
export default {
  name: 'Fence',
  data() {
    return {
      drawTypes: [
        {
          name: '圆',
          type: 'Circle'
        },
        {
          name: '线',
          type: 'LineString'
        },
        {
          name: '多边形',
          type: 'Polygon'
        }
      ],
      drawType: null,
      vectorLayer: null,
      count: 0
    }
  },
  methods: {
    toggleDrawType(type) {
      if (this.drawType == type) {
        // 重复点击 = 取消绘制模式
        this.drawType = null
        exitDrawMode(map)
      } else {
        // 进入/切换绘制模式
        this.drawType = type
        enterDrawMode(map, vectorLayer, type, this.drawendHandle)
      }
    },
    /**
     * 绘制完成处理
     */
    drawendHandle(geometry) {
      this.drawType = null
      // 通过绘制类型进行不同处理
      let type = geometry.getType()
      if (type === 'Circle') {
        let center = geometry.getCenter()
        let radius = geometry.getRadius()
        // console.log('geometry', type, center, radius)
        this.saveData({
          type,
          id: new Date().getTime(),
          center,
          radius
        })
      } else {
        let coordinates = geometry.getCoordinates()
        // console.log('geometry', type, coordinates)
        this.saveData({
          type,
          id: new Date().getTime(),
          coordinates
        })
      }
    },
    saveData(json) {
      let localFenceStr = sessionStorage.getItem('LOCAL_FENCE')
      let localFence = []
      if (localFenceStr) {
        localFence = JSON.parse(localFenceStr)
      }
      localFence.push(json)
      sessionStorage.setItem('LOCAL_FENCE', JSON.stringify(localFence))
    },
    loadData() {
      let localFenceStr = sessionStorage.getItem('LOCAL_FENCE')
      let localFence = JSON.parse(localFenceStr)
      if (localFence) {
        localFence.forEach(fence => {
          switch (fence.type) {
            case 'Circle':
              addCircle(vectorLayer, fence.id, fence.center, fence.radius, { id: ++this.count, type: 'Circle' })
              break
            case 'LineString':
              addLineString(vectorLayer, fence.id, fence.coordinates, { id: ++this.count, type: 'LineString' })
              break
            case 'Polygon':
              addPolygon(vectorLayer, fence.id, fence.coordinates, { id: ++this.count, type: 'Polygon' })
              break
            default:
              break
          }
        })
      }
    }
  },
  mounted() {
    let layer = createXYZLayer(MAPURL.GaodeStreet)

    map = new Map({
      target: 'map',
      layers: [layer],
      view: new View({
        projection: 'EPSG:4326',
        center: gcj02[1],
        zoom: 16,
        multiWorld: false
      })
    })

    vectorLayer = addDrawVectorLayer(map)
    window.vectorLayer = vectorLayer
    this.loadData()

    // 关键点绘制
    addPoint(vectorLayer, '1', gcj02[1])

    // 点击事件处理
    map.on('click', e => {
      // 在点击时获取像素区域
      var pixel = map.getEventPixel(e.originalEvent)
      // 点击事件顺序目前是乱序的，通过像素点进入layer、feature匹配
      map.forEachFeatureAtPixel(pixel, feature => {
        let id = feature.get('id')
        let type = feature.get('type')
        let msg = `${id} ${type}`
        // info(msg)
        // console.log(msg, feature)
      })

      // 仅返回最后创建图层的最新创建的feature
      let feature = map.forEachFeatureAtPixel(pixel, feature => {
        return feature
      })
      console.log('feature', feature)
      let id = feature.get('id')
      let type = feature.get('type')
      let msg = `${id} ${type}`
      info(msg)
      console.log(msg, feature)
    })
  }
}
</script>

<style lang="scss" scoped>
.map-switch {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  z-index: 1;
  cursor: pointer;
  border-radius: 2px;
  overflow: hidden;

  div {
    float: left;
    box-shadow: rgb(0 0 0 / 35%) 2px 2px 3px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(139, 164, 220);
    background: rgb(255, 255, 255);
    padding: 4px 8px;
    font-style: normal;
    font-variant: normal;
    font-stretch: normal;
    font-size: 18px;
    line-height: 1.3em;
    font-family: arial, sans-serif;
    text-align: center;
    white-space: nowrap;
    color: rgb(0, 0, 0);

    &.active {
      box-shadow: rgb(0 0 0 / 35%) 2px 2px 3px;
      border-left: 1px solid rgb(139, 164, 220);
      border-top: 1px solid rgb(139, 164, 220);
      border-bottom: 1px solid rgb(139, 164, 220);
      background: rgb(142, 168, 224);
      font: bold 18px / 1.3em arial, sans-serif;
      text-align: center;
      white-space: nowrap;
      color: rgb(255, 255, 255);
    }
  }
}
</style>
