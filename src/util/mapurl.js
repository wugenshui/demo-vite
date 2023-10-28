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
}

export default MAPURL
