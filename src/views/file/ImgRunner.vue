<script setup>
import { ref, onMounted } from 'vue'

// 图片容器
const imgBox = ref(null)
const left = ref(0)

const modules = import.meta.globEager('@/assets/file/runner/*.png')
console.log(modules)
onMounted(() => {
  let i = 0
  setInterval(() => {
    let tmpImg = modules[`/src/assets/file/runner/${++i % 9}.png`].default
    imgBox.value.src = tmpImg
    left.value = (left.value + 20) % window.innerWidth
    console.log(tmpImg)
  }, 200)
})
</script>

<template>
  <img ref="imgBox" src="@/assets/file/runner/0.png" :style="{ left: left + 'px' }" alt="runner" />
</template>

<style scoped>
img {
  position: absolute;
  left: 0;
}
</style>
