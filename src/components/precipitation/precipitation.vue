<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";

const weatherStore = useWeatherStore()

// 未来24小时平均降雨量
const calcFuturePrecipitation_24h = (data:any) => {
  let precipSum = 0
  for (let i of data){
    precipSum+=parseFloat(i.precip)
  }
  let precip = (precipSum/24).toFixed(1)
  if(precip == '0.0'){
    return 0
  }
  return precip
}

</script>

<template>
  <div class="module-main" v-if="weatherStore.hourlyWeather_24">
    <div class="module-title">
      <img src="../../assets/icons/precipitation.svg" style="width: 13px;height: 13px">&nbsp;降水
    </div>
    <div class="precip-content">
      <div class="precip-content-top">
        <span>{{weatherStore.weather.precip=='0.0'?0:weatherStore.weather.precip}}毫米</span>
        <br>
        <span>当前</span>
      </div>
      <div class="precip-content-bottom">
        <span>预计未来24小时内降水量为{{calcFuturePrecipitation_24h(weatherStore.hourlyWeather_24)}}毫米</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.precip-content{
  width: 100%;
  height: calc(100% - 30px);
}
.precip-content-top{
  width: 100%;
  height: 80px;
  text-align: left;
}
.precip-content-top span:nth-child(1){
  font-size: 30px;
  font-weight: bold;
  margin-left: 5px;
}
.precip-content-top span:nth-child(3){
  font-size: 15px;
  font-weight: bold;
  margin-left: 5px;
}
.precip-content-bottom{
  font-size: 12px;
  font-weight: bold;
  width: 100%;
  height: 70px;
  text-align: left;
  display: flex;
  align-items: center;
}
.precip-content-bottom span{
  margin: 0 5px;
}
</style>