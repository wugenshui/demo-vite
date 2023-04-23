<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import logo from '@/assets/logo.svg'
const quality = ref(0.1)
const scaleImg = ref('')

var canvas: any = null
var ctx: any = null

onMounted(() => {
  canvas = document.querySelector('canvas')
  ctx = canvas?.getContext('2d')
  const img = new Image()
  img.src = logo
  img.width = 200
  img.height = 200
  img.onload = () => {
    ctx?.drawImage(img, 0, 0, 200, 200)
  }
})

watch(
  quality,
  (val) => {
    console.log('watch', val)
    if (!canvas) return
    let base64 = canvas.toDataURL('image/png', val)
    console.log('watch', base64)
    scaleImg.value = base64
  },
  { immediate: true }
)
</script>

<template>
  <div class="about">
    <canvas refs="canvas"></canvas>
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
