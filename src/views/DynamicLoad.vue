<script setup lang="ts">
import { ref } from 'vue'
const count = ref()
// 批量打包
const modules = import.meta.glob('./*.js')
// 动态加载
let type = 2
modules['./' + type + '.js']().then((mod: any) => {
  count.value = mod.default()
  console.log(mod)
})
</script>

<template>{{ count }}.js loaded</template>
