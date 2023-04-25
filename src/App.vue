<script setup lang="ts">
</script>

<template>
  <!-- 导航菜单 -->
  <el-menu default-active="/" class="el-menu-demo" mode="horizontal" router>
    <el-sub-menu :index="route.name" v-for="route in $router.options.routes">
      <template #title>{{ route.name }}</template>
      <el-menu-item :index="child.path" v-for="child in route.children">{{
        child.name
      }}</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <!-- 路由视图 -->
  <RouterView class="view" />
</template>

<style scoped>
.view {
  padding: 10px;
}
</style>
