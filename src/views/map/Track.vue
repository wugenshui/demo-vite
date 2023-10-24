<template>
  <!-- 高德图层，可以作为基础模式研究其它功能 -->
  <div id="map">
    <div class="map-switch">
      <div @click="play">播放</div>
      <div v-if="!isPause" @click="pause">暂停</div>
      <div v-else @click="resume">恢复</div>
      <div @click="replay">重播</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Map from 'ol/Map'
import View from 'ol/View'
import { createXYZLayer, addVectorLayer, addLine } from '@/util/map'
import { names, wgs84, gcj02 } from '@/data/points'
import trackdata from '@/data/trackdata'
import MAPURL from '@/util/mapurl'
import { play, replay, pause, resume } from '@/util/mapTrack'

// 地图当前展示图层
let mapCurrentLayer = []
// 切换图层列表
let layers = []
// 地图对象
let map
let count = 0
// 播放轨迹
let lines = []
export default {
  name: 'Track',
  data() {
    return {
      isPause: false
    }
  },
  methods: {
    toggleMapType(index) {
      mapCurrentLayer.setAt(0, layers[index])
    },
    initData() {
      lines = trackdata
      // 增加几倍数据
      // for (let index = 0; index < 4; index++) {
      //   lines.push(...lines)
      // }
      this.newTrackPlay(lines)
    },
    initOnlineData() {
      // 轨迹抓取
      // https://lbs.amap.com/tools/picker
      // 导航API
      // https://lbs.amap.com/api/webservice/guide/api/direction#driving
      /**
       * 轨迹 庆达广场 [113.41032,23.380023] -> 金山大厦 [113.346593, 23.143937] -> 庆达广场附近
       */
      let lbsurl =
        'http://restapi.amap.com/v3/direction/driving?key=bf3e3cbca72146664d19ca28c9f9c5b7&origin=113.41032,23.380023&destination=113.41032,23.380023&originid=&destinationid=&extensions=base&strategy=0&waypoints=113.346593,23.143937&avoidpolygons=&avoidroad='
      let lines = []
      axios.get(lbsurl).then(data => {
        let steps = data.data.route.paths[0].steps
        console.log(steps)
        steps.forEach(sTemp => {
          let ls = sTemp.polyline.split(';')
          ls.forEach(lTemp => {
            let l = lTemp.split(',')
            lines.push([l[0], l[1]])
          })
        })
        console.log(lines)
        this.newTrackPlay(lines)
      })
    },
    newTrackPlay(lines) {
      this.play()
    },
    play() {
      play(map, lines)
    },
    pause() {
      this.isPause = pause()
    },
    resume() {
      this.isPause = resume()
    },
    replay() {
      replay()
    }
  },
  mounted() {
    layers.push(createXYZLayer(MAPURL.GaodeStreet, 'EPSG:3857'))
    layers.push(createXYZLayer(MAPURL.GaodeSatellite, 'EPSG:3857'))

    map = new Map({
      target: 'map',
      layers: [layers[0]],
      view: new View({
        center: [113.41032, 23.380023],
        zoom: 16,
        multiWorld: false,
        projection: 'EPSG:4326'
      })
    })
    window.map = map
    mapCurrentLayer = map.getLayers()

    // 点击获取坐标
    map.on('click', function (e) {
      console.log('[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')
    })

    // 创建轨迹播放对象
    this.initData()
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
