/**
 * 天地图街道图，需要鉴权 T=vec_c（经纬度投影） vec_w（球面墨卡托投影）
 */
const TiandituStreet =
  'http://t{0-7}.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=df2e5ca32d07db0958046b5c250c0430'

/**
 * 天地图街道图文字，需要鉴权 T=cva_c（经纬度投影） cva_w（球面墨卡托投影）
 */
const TiandituStreetFont =
  'http://t{0-7}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=df2e5ca32d07db0958046b5c250c0430'

/**
 * 天地图卫星图，需要鉴权 T=img_c（经纬度投影） img_w（球面墨卡托投影）
 */
const TiandituSatellite =
  'http://t{0-7}.tianditu.com/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=df2e5ca32d07db0958046b5c250c0430'

/**
 * 天地图卫星图文字，需要鉴权 T=cia_c（经纬度投影） cia_w（球面墨卡托投影）
 */
const TiandituSatelliteFont =
  'http://t{0-7}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=df2e5ca32d07db0958046b5c250c0430'

/**
 * WMTS 天地图街道图，需要鉴权 vec_c
 */
const WMTSTiandituStreet = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=df2e5ca32d07db0958046b5c250c0430'

/**
 * 高德街道图 style=7
 */
const GaodeStreet = 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=2&style=7&x={x}&y={y}&z={z}'

/**
 * 高德卫星图 style=6
 */
const GaodeSatellite = 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=2&style=6&x={x}&y={y}&z={z}'

/**
 * 谷歌 街道图 gcj坐标系 lyrs地图类型：m=路线图，s=卫星图，y=带标签的卫星图，h=标签层(，t=地形图，p=带标签的地形图)
 * 除路线图外其它默认伟wgs84坐标系，需增加gl=CN转化为gcj坐标系
 */
const GoogleStreet = 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}'

/**
 * 谷歌 卫星图 gcj坐标系
 */
const GoogleSatellite = 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}'

const MAPURL = {
  TiandituStreet,
  TiandituStreetFont,
  TiandituSatellite,
  TiandituSatelliteFont,
  WMTSTiandituStreet,
  GaodeStreet,
  GaodeSatellite,
  GoogleStreet,
  GoogleSatellite
}

export default MAPURL
