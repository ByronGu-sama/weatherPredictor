<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor.ts";

const weatherStore = useWeatherStore()
</script>

<template>
  <div class="module-main" v-if="weatherStore.weather">
    <div class="module-title">
      <img src="../../assets/icons/humidity.svg" style="width: 13px;height: 13px">&nbsp;湿度
    </div>
    <div class="humidity-body" v-if="weatherStore.weather.humidity">
      {{weatherStore.weather.humidity}}%
    </div>
    <div class="bottom-tips" v-if="weatherStore.weather.dew">
      目前露点温度为{{weatherStore.weather.dew}}˚
    </div>
  </div>
</template>

<style scoped>
.humidity-body{
  width: 100%;
  height: calc(100% - 60px);
  font-size: 30px;
  color: white;
  margin-left: 5%;
  text-align: left;
  font-weight: bold;
}
</style>