<script setup></script>

<template>
  <!-- 导航菜单 -->
  <el-menu default-active="/" class="el-menu-demo" mode="horizontal" router>
    <el-sub-menu :index="route.name" v-for="route in $router.options.routes" :key="route.name">
      <template #title>{{ route.name }}</template>
      <el-menu-item :index="child.path" v-for="child in route.children" :key="child.name">{{
        child.name
      }}</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <!-- 路由视图 -->
  <div class="view">
    <RouterView />
  </div>
</template>

<style scoped>
.view {
  padding: 10px;
}
</style>
