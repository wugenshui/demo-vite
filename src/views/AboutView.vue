<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import koala from '@/assets/koala.png'

const quality = ref()
const scaleImg = ref('')
// 画布元素
const canvas = ref(null)

var ctx: any = null

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  const img = new Image()
  img.src = koala
  // img.width = 200
  // img.height = 200
  img.onload = () => {
    ctx?.drawImage(img, 0, 0, 200, 200)
    quality.value = 1
  }
})

watch(quality, (val) => {
  console.log('watch', val)
  if (!canvas) return
  let base64 = canvas.value.toDataURL('image/png', val)
  console.log(`base64 size:${base64.length}`, base64)
  scaleImg.value = base64
})
</script>

<template>
  <div class="about">
    <canvas ref="canvas"></canvas>
    <input v-model="quality" />
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
