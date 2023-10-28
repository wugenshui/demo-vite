/**
 * 天地图鉴权key，有使用量限制，建议申请公司key用于生产环境
 */
const TiandituTk = 'df2e5ca32d07db0958046b5c250c0430'

/**
 * 地图服务地址
 */
const MAPURL = {
  /**
   * 天地图
   * http://lbs.tianditu.gov.cn/server/MapService.html
   * 
   */
  Tianditu: {
    // 街道图 T=vec_c
    Street: 'https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=' + TiandituTk,
    // 街道图文字 T=cva_c
    StreetFont: 'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=' + TiandituTk,
    // 卫星图 T=img_c
    Satellite: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=' + TiandituTk,
    // 卫星图文字 T=cia_c
    SatelliteFont: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=cia_c&x={x}&y={y}&l={z}&tk=' + TiandituTk,
    // WMTS街道图 /vec_c/
    WMTSStreet: 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=' + TiandituTk,
    // WMTS街道图文字 /cva_c/
    WMTSStreetFont: 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk=' + TiandituTk,
    // WMTS卫星图 /img_c/
    WMTSSatellite: 'https://t{0-7}.tianditu.gov.cn/img_c/wmts?tk=' + TiandituTk,
    // WMTS卫星图文字 /cia_c/
    WMTSSatelliteFont: 'https://t{0-7}.tianditu.gov.cn/cia_c/wmts?tk=' + TiandituTk,
  },
  /**
   * 高德地图
   */
  Gaode: {
    // 街道图 style=7
    Street: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
    // 街道图2 lang=zh_cn&style=7 
    Street2: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&style=7&size=2&x={x}&y={y}&z={z}',
    // 卫星图 style=6
    Satellite: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  },
  /**
   * 谷歌地图
   * lyrs地图类型：m=路线图，s=卫星图，y=带标签的卫星图，h=标签层(，t=地形图，p=带标签的地形图)
   * 除路线图外其它默认为wgs84坐标系，需增加gl=CN转化为gcj坐标系
   */
  Google: {
    // 街道图 gcj坐标系
    Street: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}',
    // 卫星图 gcj坐标系
    Satellite: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}',
  },
  Baidu: {
    // 街道图
    Street: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1',
    // 卫星图
    Satellite: 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20170310',
    // 卫星图文字
    SatelliteFont: 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020',
  },
  OSM: {
    // 街道图
    Street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // 卫星图
    Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  Mapbox: {
    // 街道图
    Street: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
    // 卫星图
    Satellite: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
  },
  MapboxChina: {
    // 街道图
    Street: 'https://api.mapbox.cn/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
    // 卫星图
    Satellite: 'https://api.mapbox.cn/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
  },
  MapboxChinaDark: {
    // 街道图
    Street: 'https://api.mapbox.cn/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
    // 卫星图
    Satellite: 'https://api.mapbox.cn/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
  },
  MapboxChinaLight: {
    // 街道图
    Street: 'https://api.mapbox.cn/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
    // 卫星图
    Satellite: 'https://api.mapbox.cn/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNrZmJ1Z2J1ZjA0b3YycW1yZzZ4cWZvZ3oifQ.8ZlYJ3Z7kMqVXfXwqQ6h2A',
  },
  // bing
  Bing: {
    // 街道图
    Street: 'https://dynamic.t0.tiles.ditu.live.com/comp/ch/{quadkey}?it=G,VE,BX,L,LA&mkt=zh-cn&og=111&cstl=w4c&ur=CN',
    // 卫星图
    Satellite: 'https://dynamic.t0.tiles.ditu.live.com/comp/ch/{quadkey}?it=G,VE,BX,L,LA&mkt=zh-cn&og=111&cstl=w4c&ur=CN',
  },
  // 高德
  Amap: {
    // 街道图
    Street: 'https://wprd01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
    // 卫星图
    Satellite: 'https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  },
  // 谷歌
  Google2: {
    // 街道图
    Street: 'https://mt{0-3}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
    // 卫星图
    Satellite: 'https://mt{0-3}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
  },
  // 腾讯
  Tencent: {
    // 街道图
    Street: 'https://rt{0-3}.map.gtimg.com/tile?z={z}&x={x}&y={y}&styleid=2&scene=0&version=224',
    // 卫星图
    Satellite: 'https://p{0-3}.map.gtimg.com/sateTiles/{z}/{qx}/{qy}/{x}_{y}.jpg',
  },
}

export default MAPURL
