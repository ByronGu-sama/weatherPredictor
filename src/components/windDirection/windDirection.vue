<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor.ts";

const weatherStore = useWeatherStore()
</script>

<template>
  <div class="module-main">
    <div class="module-title">
      <i class="qi-2352"></i>&nbsp;风向
    </div>
    <div class="ring-body">
      <div class="ringWrap">
        <div class="wind-ring"></div>
        <div class="ring-mask">
          <span>东</span>
          <span>南</span>
          <span>西</span>
          <span>北</span>
        </div>
        <div class="arrow">
          <img src="../../assets/pic/arrow.png" :style="{transform:`rotate(${weatherStore.weather?weatherStore.weather.wind360:'0'}deg)`}">
        </div>
        <div class="wind-dashboard" v-if="weatherStore.weather">
          {{weatherStore.weather.windScale}}级
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ring-body{
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ringWrap{
  width: 70%;
  height: calc((100% + 30px)*0.7);
  position: relative;
}
.wind-ring{
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(from -.5deg, rgb(255, 255, 255) 0 1deg, transparent 0deg 90deg),
  repeating-conic-gradient(from -.5deg, rgba(255, 255, 255, 0.38) 0 1deg, transparent 0deg 2deg);
  border-radius: 50%;
  -webkit-mask-image: radial-gradient(transparent 65%, black 0);
  mask-image: radial-gradient(transparent 65%, black 0);
}
.ring-mask{
  width: 100%;
  height: 100%;
  -webkit-mask-image: none;
  mask-image: none;
}
.ring-mask span:nth-child(1){
  font-size: 12px;
  position: absolute;
  top: calc(50% - 8px);
  right: 8px;
}
.ring-mask span:nth-child(2){
  font-size: 12px;
  position: absolute;
  bottom: 6px;
  left: calc(50% - 6px);
}
.ring-mask span:nth-child(3){
  font-size: 12px;
  position: absolute;
  top: calc(50% - 8px);
  left: 8px;
}
.ring-mask span:nth-child(4){
  font-size: 12px;
  position: absolute;
  top: 6px;
  left: calc(50% - 6px);
}
.arrow{
  position: absolute;
  width: 2px;
  height: 90%;
  top: 5%;
  left: calc(50% - 8px);
}
.arrow img{
  width: 16px;
  height: 100%;
  transition: 0.1s linear;
}
.wind-dashboard{
  width: 35%;
  height: 35%;
  position: absolute;
  top: calc(32.5%);
  left: calc(32.5%);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}
</style>