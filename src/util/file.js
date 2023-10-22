/**
 * 图片压缩方法
 * @param {Object}  file 图片文件DOM对象
 * @param {String} type 想压缩成的文件类型
 * @param {Nubmber} quality 压缩质量参数，范围0-1，越高越清晰
 * @returns 压缩后的新图片
 */
export const compressionFile = async (img, type = 'image/jpeg', quality = 1) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  context.clearRect(0, 0, img.width, img.height)
  context.drawImage(img, 0, 0, img.width, img.height)
  const base64 = canvas.toDataURL(type, quality)
  let size = base64.length - (base64.length / 8) * 2
  let kbSize = (size / 1024).toFixed(2)
  console.log(`函数压缩精度:${quality} 压缩后大小:${kbSize}kb`)
}
