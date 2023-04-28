<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import koala from '@/assets/koala.png'

const quality = ref()
const scaleImg = ref('')
const tip = ref('')
// 画布元素
const canvas = ref<HTMLCanvasElement>(null)

var ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  const img = new Image()
  img.src = koala
  img.onload = () => {
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx?.drawImage(img, 0, 0, img.width, img.height)
    quality.value = 1
    valueChange(quality.value)
  }
})

function valueChange(value: number) {
  console.log('watch', value)
  if (!canvas) return
  // base64计算文件大小
  let base64 = canvas.value.toDataURL('image/png', value)
  let size = base64.length - (base64.length / 8) * 2
  let kbSize = (size / 1024).toFixed(2)
  tip.value = `压缩精度:${value} 压缩后大小:${kbSize}kb`
  scaleImg.value = ''
  setTimeout(() => {
    scaleImg.value = base64
  }, 100)
}
</script>

<template>
  <div class="about">
    <canvas ref="canvas"></canvas>
    <div>
      <el-input-number v-model="quality" :min="0" :max="1" :step="0.1" @change="valueChange" />
    </div>
    <div>
      <el-text class="mx-1" type="primary">{{ tip }}</el-text>
    </div>
    <img :src="scaleImg" />
  </div>
</template>

<style>
canvas,
img {
  width: 200px;
  height: 200px;
}
</style>
