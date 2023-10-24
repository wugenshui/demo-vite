// 地标 转 国测 常量
var PI = 3.1415926535897932384626
// 卫星椭球坐标投影到平面地图坐标系的投影因子
var a = 6378245.0
// 椭球的偏心率
var ee = 0.00669342162296594323

/**
 * 计算2点距离
 * @param {Number} latitude1 点1 纬度
 * @param {Number} longitude1 点1 经度
 * @param {Number} latitude2 点2 纬度
 * @param {Number} longitude2 点2 经度
 * @returns {Number} 距离，单位：米
 */
export function getDistance(latitude1, longitude1, latitude2, longitude2) {
  var radLat1 = (latitude1 * Math.PI) / 180.0
  var radLat2 = (latitude2 * Math.PI) / 180.0
  var a = radLat1 - radLat2
  var b = (longitude1 * Math.PI) / 180.0 - (longitude2 * Math.PI) / 180.0
  var s =
    2 *
    Math.asin(
      Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))
    )
  // 6378.137=地球平均半径
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  return s * 1000
}

/**
 * wgs84 to gcj02   地球坐标系 转 火星坐标系
 * @param {*} lng 纬度
 * @param {*} lat 经度
 * @returns [lng, lat]
 */
export function WGS84ToGCJ02(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = (lat / 180.0) * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    var mglat = lat + dlat
    var mglng = lng + dlng

    return [mglng, mglat]
  }
}

// gcj02 to wgs84  火星坐标系 转 地球坐标系
export function GCJ02ToWGS84(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = (lat / 180.0) * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    let mglat = lat + dlat
    let mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}

// 判断是否在国内，在中国国内的经纬度才需要做偏移
function out_of_china(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
}

// 转化经度
function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0
  return ret
}

// 转化纬度
function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0
  return ret
}
