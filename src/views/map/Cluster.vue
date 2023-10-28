<template>
  <div id="map">
    <map-switch @toggleMapType="toggleMapType" />
  </div>
</template>

<script>
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import { XYZ, TileWMS, WMTS, Vector, Raster, Cluster } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text } from 'ol/style'
import { Point, Polygon, Circle, LineString } from 'ol/geom'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get, fromLonLat } from 'ol/proj'
import { createEmpty, extend, getWidth, getHeight } from 'ol/extent'
import { createXYZLayer, addVectorLayer, initVectorLayer, addLine } from '@/util/map'
import MAPURL from '@/util/mapurl'
import { names, wgs84, wgs842, gcj02 } from '@/data/points'

// 地图对象
let map = null
// 聚合图层
let clusterLayer = null
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
      })
    })

    // 点击获取坐标
    map.on('click', function (e) {
      // 打印坐标
      console.log('[' + e.coordinate[0] + ', ' + e.coordinate[1] + ']')

      // 点击聚合点展开
      clusterLayer.getFeatures(e.pixel).then(features => {
        if (features.length > 0) {
          const clusterMembers = features[0].get('features')
          if (clusterMembers.length > 1) {
            // 计算集群内部的范围，以便将视图缩放到该范围。
            const extent = createEmpty()
            clusterMembers.forEach(feature => extend(extent, feature.getGeometry().getExtent()))
            const view = map.getView()
            const resolution = map.getView().getResolution()
            if (
              view.getZoom() !== view.getMaxZoom() &&
              getWidth(extent) > resolution &&
              getHeight(extent) > resolution
            ) {
              view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] })
            }
          }
        }
      })
    })

    let clusterSource = new Vector()
    // 绘点
    clusterSource.addFeature(
      new Feature({
        geometry: new Point(wgs84[0])
      })
    )
    clusterSource.addFeature(
      new Feature({
        geometry: new Point(wgs84[1])
      })
    )
    clusterSource.addFeature(
      new Feature({
        geometry: new Point(wgs84[2])
      })
    )

    // 创建图层
    clusterLayer = new VectorLayer({
      source: new Cluster({
        distance: 40,
        source: clusterSource
      }),
      style: function (feature, resolution) {
        var size = feature.get('features').length
        if (size == 1) {
          // 如果是聚合数为1也就是最底层的则是定位图标
          return new Style({
            image: new CircleStyle({
              radius: 5,
              stroke: new Stroke({
                color: 'white'
              }),
              fill: new Fill({
                color: 'red'
              })
            })
          })
        } else {
          // 这里设置聚合部分的样式
          return [
            new Style({
              image: new CircleStyle({
                radius: 20,
                fill: new Fill({
                  color: 'rgba(255, 153, 102, 0.3)'
                })
              })
            }),
            new Style({
              image: new CircleStyle({
                radius: 14,
                fill: new Fill({
                  color: 'rgba(255, 165, 0, 0.7)'
                })
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff'
                }),
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.6)',
                  width: 3
                })
              })
            })
          ]
        }
      }
    })

    map.getLayers().push(clusterLayer)
  }
}
</script>
