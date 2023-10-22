<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import koala from '@/assets/koala.png'
import { compressionFile } from '@/util/file'

const quality = ref()
const scaleImg = ref('')
const tip = ref('')
// 画布元素
const canvas = ref<HTMLCanvasElement | null>(null)

var ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  ctx = canvas.value!.getContext('2d')
  const img = new Image()
  img.src = koala
  img.onload = () => {
    canvas.value!.width = img.width
    canvas.value!.height = img.height
    ctx?.drawImage(img, 0, 0, img.width, img.height)
    quality.value = 0.6
    valueChange(quality.value)
    compressionFile(img, 'image/jpeg', 0.2)
    compressionFile(img, 'image/jpeg', 0.4)
    compressionFile(img, 'image/jpeg', 0.6)
    compressionFile(img, 'image/jpeg', 0.8)
    compressionFile(img, 'image/jpeg', 1)
  }
})

function valueChange(value: number) {
  // base64计算文件大小
  let base64 = canvas.value!.toDataURL('image/jpeg', value)
  let size = base64.length - (base64.length / 8) * 2
  let kbSize = (size / 1024).toFixed(2)
  tip.value = `压缩精度:${value} 压缩后大小:${kbSize}kb`
  console.log(tip.value)
  scaleImg.value = ''
  setTimeout(() => {
    scaleImg.value = base64
  }, 100)
}
</script>

<template>
  <div>
    <el-input-number v-model="quality" :min="0" :max="1" :step="0.2" @change="valueChange" />
  </div>
  <div>
    <el-text class="mx-1" type="primary">{{ tip }}</el-text>
  </div>
  <!-- 小Tips:canvas css设置宽高无效，会导致绘制出现问题 -->
  <canvas ref="canvas"></canvas>
  <img :src="scaleImg" />
</template>
