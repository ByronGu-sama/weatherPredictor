<script setup lang="ts">
import {ref} from "vue";
import mapStyle from '../../utils/custom_map_config.json'

const center = ref({lng: 0, lat: 0});
const zoom = ref(3);
const handler = () => {
  center.value.lng = 116.404;
  center.value.lat = 39.915;
  zoom.value = 3;
}

const draw24 = ({ el, BMap, map }) => {
  const pixel = map.pointToOverlayPixel(new BMap.Point(127, 22))
  el.style.left = pixel.x - 30 + 'px'
  el.style.top = pixel.y - 100 + 'px'
};

const draw48 = ({ el, BMap, map }) => {
  const pixel = map.pointToOverlayPixel(new BMap.Point(132, 22))
  el.style.left = pixel.x - 30 + 'px'
  el.style.top = pixel.y - 100 + 'px'
};

//  24小时警戒线
const polyline1 = ref({
  editing: false,
  paths: [[
    {lng:105,lat:0},
    {lng:113,lat:4.5},
    {lng:119,lat:11},
    {lng:119,lat:18},
    {lng:127,lat:22},
    {lng:127,lat:34},
  ]]
});

//  48小时警戒线
const polyline2 = ref({
  editing: false,
  paths: [[
    {lng:105,lat:0},
    {lng:120,lat:0},
    {lng:132,lat:15},
    {lng:132,lat:34}
  ]]
});
</script>

<template>
  <div class="map-main">
    <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        class="bMap"
        :mapStyle="{styleJson:mapStyle}"
        :scroll-wheel-zoom="true"
    >
      <bm-polyline :path="path" v-for="path of polyline1.paths" :key="path" stroke-color="#ff484c"></bm-polyline>
      <bm-polyline :path="path" v-for="path of polyline2.paths" :key="path" stroke-color="#00b7ff" stroke-style="dashed"></bm-polyline>
      <bm-overlay pane="floatPane" :class="{guardLine24: true}" @draw="draw24">
        <div style="writing-mode: vertical-lr">24小时警戒线</div>
      </bm-overlay>
      <bm-overlay pane="floatPane" :class="{guardLine48: true}" @draw="draw48">
        <div style="writing-mode: vertical-lr">48小时警戒线</div>
      </bm-overlay>
    </baidu-map>
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
  .guardLine24 {
    position: absolute;
    width: 20px;
    height: 140px;
    line-height: 18px;
    font-size: 15px;
    overflow: hidden;
    color: #ff484c;
    text-align: center;
    padding: 10px;
  }
  .guardLine48 {
    position: absolute;
    width: 20px;
    height: 140px;
    line-height: 18px;
    font-size: 15px;
    overflow: hidden;
    color: #00b7ff;
    text-align: center;
    padding: 10px;
  }
</style>