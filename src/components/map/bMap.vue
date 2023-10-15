<script setup lang="ts">
import mapStyle from '../../utils/custom_map_config.json'
</script>

<template>
  <baidu-map
      class="map-view"
      :center="{ lng: 116.404, lat: 39.915 }"
      :zoom="3"
      :mapStyle="{styleJson:mapStyle}"
      :scroll-wheel-zoom="true"
  ></baidu-map>
</template>

<style scoped>
  .map-view{
    width: 100%;
    height: 100%;
  }
</style>