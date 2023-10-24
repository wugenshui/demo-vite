<script setup></script>

<template>
  <!-- 导航菜单 -->
  <el-menu default-active="/" class="el-menu-demo" mode="horizontal" router>
    <el-sub-menu v-show="route.name" :index="route.name" v-for="route in $router.options.routes" :key="route.name">
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
  position: relative;
  height: calc(100% - 80px);
}

#map {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
