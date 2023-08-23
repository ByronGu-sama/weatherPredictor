<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor.ts";

const weatherStore = useWeatherStore()
</script>

<template>
  <div class="module-main" v-if="weatherStore.weather">
    <div class="module-title">
      <img src="../../assets/icons/thermometer.svg" style="width: 13px;height: 13px"/>&nbsp;体感温度
    </div>
    <div class="apparentTemp-body">
      {{weatherStore.weather.feelsLike}}˚
    </div>
    <div class="bottom-tips">
      潮湿使人感觉更热
    </div>
  </div>
</template>

<style scoped>
.apparentTemp-body{
  width: 100%;
  height: calc(100% - 60px);
  font-size: 30px;
  text-align: left;
  text-indent: 5%;
  font-weight: bold;
}
</style>