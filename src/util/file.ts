const fileToDataURL = (file: Blob): Promise<any> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (e) => resolve((e.target as FileReader).result)
    reader.readAsDataURL(file)
  })
}
const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataURL
  })
}
const canvastoFile = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> => {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
}
/**
 * 图片压缩方法
 * @param {Object}  file 图片文件
 * @param {String} type 想压缩成的文件类型
 * @param {Nubmber} quality 压缩质量参数，范围0-1，越高越清晰
 * @returns 压缩后的新图片
 */
export const compressionFile = async (img: HTMLImageElement, type = 'image/jpeg', quality = 1) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = img.width
  canvas.height = img.height
  context.clearRect(0, 0, img.width, img.height)
  context.drawImage(img, 0, 0, img.width, img.height)
  const base64 = canvas.toDataURL(type, quality)
  let size = base64.length - (base64.length / 8) * 2
  let kbSize = (size / 1024).toFixed(2)
  console.log(`函数压缩精度:${quality} 压缩后大小:${kbSize}kb`)
}
