/**
 * 通用工具类
 */
import { ElMessage } from 'element-plus'

/**
 * 弹出普通消息
 * @param {String} msg 消息内容
 * @param {Number} duration 自动消失时间，单位ms，默认2000ms
 */
export function info(msg, duration = 2000) {
  ElMessage({
    type: 'info',
    message: msg,
    duration
  })
}
/**
 * 弹出警告消息
 * @param {String} msg 消息内容
 * @param {Number} duration 自动消失时间，单位ms，默认2000ms
 */
export function warning(msg, duration = 2000) {
  ElMessage({
    type: 'warning',
    message: msg,
    duration
  })
}

/**
 * 弹出成功消息
 * @param {String} msg 消息内容
 * @param {Number} duration 自动消失时间，单位ms，默认2000ms
 */
export function success(msg, duration = 2000) {
  ElMessage({
    type: 'success',
    message: msg,
    duration
  })
}
