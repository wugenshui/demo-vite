<script setup>
import { ref } from 'vue'
const clazz = ref([
  // margin
  'm-1px',
  'm-20px',
  'm-1',
  'm-4',
  // padding
  'p-1px',
  'p-20px',
  'p-1',
  'p-4',
  'w-12',
  'w-24',
  'h-6',
  'h-12',
  'text-center',
  'b-1 b-solid',
  'b-1 b-red b-t-solid',
  'c-red',
  'container',
  'of-auto',
  'of-auto text-nowrap w-12'
])
</script>

<template>
  <!-- 遍历 -->
  <span v-for="c in clazz" :key="c" :class="c">{{ c }}</span>
  <!-- 手写 -->
  <div class="flex">
    <div class="flex-1 b-1 b-red b-solid">flex1</div>
    <div class="flex-1 b-1 b-red b-solid">flex2</div>
    <div class="flex-1 b-1 b-red b-solid">flex3</div>
  </div>
  <!-- 自定义组合 -->
  <button type="button" class="h-btn">h-btn</button>
</template>

<style lang="scss">
span {
  display: inline-block;
  margin: 2px;
}
</style>
