<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor.ts";

const weatherStore = useWeatherStore()

//判断能见度
const determineVisibility = (vis:any) => {
  vis = parseInt(vis)
  switch (vis){
    case vis < 1:
      return '能见度几乎为零'
    case vis < 10:
      return '能见度差'
    case vis < 15:
      return '能见度较差'
    case vis < 20:
      return '能见度一般'
    case vis < 25:
      return '能见度好'
    default:
      return '能见度极好'
  }
}
</script>

<template>
  <div class="module-main" v-if="weatherStore.weather">
    <div class="module-title">
      <img src="../../assets/icons/visibility.svg" style="width: 13px;height: 13px">&nbsp;能见度
    </div>
    <div class="visibility-middle">
      {{weatherStore.weather.vis}}公里
    </div>
    <div class="visibility-bottom">
      {{determineVisibility(weatherStore.weather.vis)}}
    </div>
  </div>
</template>

<style scoped>
.visibility-middle{
  width: 100%;
  height: calc(100% - 60px);
  color: white;
  font-weight: bold;
  font-size: 30px;
  text-align: left;
  margin-left: 5%;
}
.visibility-bottom{
  width: 100%;
  height: 30px;
  font-size: 13px;
  color: white;
  text-align: left;
  margin-left: 5%;
}
</style>