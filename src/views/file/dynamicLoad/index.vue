<script setup lang="ts">
import { ref } from 'vue'
const count = ref()

// 批量打包
const modules = import.meta.glob('./*.js')

// 动态加载JS
const file = ref('./1.js')
function dynamicloadJs() {
  modules[file.value]().then((mod: any) => {
    count.value = mod.default()
    console.log(mod)
  })
}

</script>

<template>
  <el-select v-model="file" placeholder="请选择">
    <el-option value="./1.js">1</el-option>
    <el-option value="./2.js">2</el-option>
  </el-select>
  <el-button @click="dynamicloadJs">加载js</el-button>
  <div v-if="count">{{ count }}</div>
</template>
