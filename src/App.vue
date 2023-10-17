<script setup lang="ts">
import {useLocationStore} from "./store/locationEditor";
import {useWeatherStore} from "./store/weatherEditor";
import {useWeatherIndicesStore} from "./store/weatherIndicesEditor.ts";
import {useAstronomyStore} from "./store/astronomyEditor.ts";
import {onMounted} from "vue";
import {ElMessage} from "element-plus";
import commonUtils from "./utils/commonUtils.ts";

const locationStore = useLocationStore()
const weatherStore = useWeatherStore()
const weatherIndicesStore = useWeatherIndicesStore()
const astronomyStore = useAstronomyStore()
let location = locationStore.getLocation

//获取定位
const getLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
      },
      err => {
        ElMessage({
          message:err.code == 1?'无法获取定位权限，请手动选择城市':err.code == 2?'获取定位失败，请手动选择城市':'获取位置超时，请手动选择城市',
          type:'warning'
        });
      }
  )
}

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
  })
  if(location){
    weatherStore.updateNowWeather(location)
    weatherStore.update10DaysWeather(location)
    weatherStore.update24HoursWeather(location)
    weatherStore.updateTyphoonList()
    weatherIndicesStore.updateUvi(location)
    astronomyStore.updateMoonPhase(location)
  }else{
    locationStore.updateLocation('101010100')
    weatherStore.updateNowWeather('101010100')
    weatherStore.update10DaysWeather('101010100')
    weatherStore.update24HoursWeather('101010100')
    weatherIndicesStore.updateUvi('101010100')
    weatherStore.updateTyphoonList()
    astronomyStore.updateMoonPhase('101010100')
  }
  getLocation()
})
</script>

<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<style scoped>
  body{
    margin: 0;
    padding: 0;
  }
  .main{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
