<script setup lang="ts">
import {ref} from "vue";
import mapStyle from '../../utils/custom_map_config.json'

const center = ref({lng: 0, lat: 0});
const zoom = ref(3);
const handler = () => {
  center.value.lng = 116.404;
  center.value.lat = 39.915;
  zoom.value = 15;
}
</script>

<template>
  <div class="map-main">
    <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        class="bMap"
        :mapStyle="{styleJson:mapStyle}"
    ></baidu-map>
    <div class="map-controller">
      <img src="../../assets/icons/rain.svg" alt="" class="map-controller-icons">
      <img src="../../assets/icons/wind.svg" alt="" class="map-controller-icons">
      <img src="../../assets/icons/typhoon.svg" alt="" class="map-controller-icons">
    </div>
  </div>

</template>

<style>
  .bMap{
    width: 100%;
    height: 100%;
  }
  .BMap_cpyCtrl {
    display: none;
  }
  .anchorBL {
    display: none;
  }
  .map-main{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .map-controller{
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 90px;
    border-radius: 15px;
    background-color: rgba(220, 219, 219, 0.3);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .map-controller-icons{
    width: 18px;
    height: 18px;
    border-radius: 9px;
    transition: linear all 0.1s;
  }
  .map-controller-icons:hover{
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
</style>