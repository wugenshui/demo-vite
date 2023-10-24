<script>
export default {
  name: 'MapSwitch',
  props: {
    types: {
      type: Array,
      default: ['地图', '卫星']
    },
    handleMapSwitch: {
      type: Function
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    toggleMapType(index) {
      this.currentIndex = index
      this.$emit('toggleMapType', index)
    }
  }
}
</script>

<template>
  <div class="map-switch">
    <div v-for="(t, i) in types" :class="{ active: currentIndex === i }" @click="toggleMapType(i)" :key="i">
      {{ t }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-switch {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  z-index: 1;
  cursor: pointer;
  border-radius: 2px;
  overflow: hidden;

  div {
    float: left;
    box-shadow: rgb(0 0 0 / 35%) 2px 2px 3px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(139, 164, 220);
    background: rgb(255, 255, 255);
    padding: 2px 6px;
    font-style: normal;
    font-variant: normal;
    font-stretch: normal;
    font-size: 12px;
    line-height: 1.3em;
    font-family: arial, sans-serif;
    text-align: center;
    white-space: nowrap;
    color: rgb(0, 0, 0);

    &.active {
      box-shadow: rgb(0 0 0 / 35%) 2px 2px 3px;
      border-left: 1px solid rgb(139, 164, 220);
      border-top: 1px solid rgb(139, 164, 220);
      border-bottom: 1px solid rgb(139, 164, 220);
      background: rgb(142, 168, 224);
      padding: 2px 6px;
      font: bold 12px / 1.3em arial, sans-serif;
      text-align: center;
      white-space: nowrap;
      color: rgb(255, 255, 255);
    }
  }
}
</style>
