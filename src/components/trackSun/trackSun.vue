<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";

const weatherStore = useWeatherStore()
let xAxis:any = ref('5px')
let yAxis:any = ref('35px')
let refreshTimer:any = null 
const INIT_X = 10    //x轴左右安全距离

// 计算太阳的x轴坐标
const calcXAxis = () => {
  let now = new Date()
  let today = weatherStore.daysWeather_10[0]
  let sunrise = today.sunrise.split(':')
  sunrise = [parseInt(sunrise[0]),parseInt(sunrise[1])]
  let sunset = today.sunset.split(':')
  sunset = [parseInt(sunset[0]),parseInt(sunset[1])]
  let minuteGap = sunset[1] - sunrise[1]
  let hourGap = sunset[0] - sunrise[0]
  let completeMinute = minuteGap<0?60+minuteGap:minuteGap
  let completeHour = minuteGap<0?hourGap-1:hourGap

  // 日出到日落时差（分钟）
  let toMinute = completeHour*60+completeMinute
  // 日出到现在的时差（分钟）
  let nowMinute = (now.getHours()-sunrise[0])*60+now.getMinutes()
  // 从日出开始过了多长时间（百分比）
  let percentage = parseFloat((nowMinute / toMinute).toFixed(4))
  //太阳在x轴上的位置  5:太阳半径
  let X_Axis_Coordinate = INIT_X+160*percentage-5
  xAxis.value = X_Axis_Coordinate+'px'
  calcYAxis(X_Axis_Coordinate)
}

// 计算太阳的y轴坐标
const calcYAxis = (x:number) =>{
  //x轴坐标百分比和PI的乘积
  let xPercentWithPI = (x-INIT_X+5)/160*Math.PI
  //y轴坐标百分比
  let yPercent = (3/5*Math.sin(xPercentWithPI))/1.5707
  //y轴坐标  40为y轴高度
  yAxis.value = 40*(1-yPercent)-5+'px'
}

watch(() => weatherStore.daysWeather_10,() => {
  if(weatherStore.daysWeather_10?.length>1){
    calcXAxis()
    refreshTimer = setInterval(() => {
      calcXAxis()
    },1000*60)
  }
},{
  immediate:true,
  deep:true
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>

<template>
  <div class="module-main" v-if="weatherStore.daysWeather_10">
    <div class="module-title">
      <img src="../../assets/icons/sunset.svg" alt="">&nbsp;日落
    </div>
    <div class="sunset-bottom">
      <div class="sunset-time">
        <span>{{weatherStore.daysWeather_10[0].sunset}}</span>
      </div>
      <div class="sunset-track">
        <div class="trackSun-sun" :style="{left:xAxis,top:yAxis}"></div>
        <div class="trackSun-horizon"></div>
      </div>
      <div class="bottom-tips">
        <span>日出:{{weatherStore.daysWeather_10[0].sunrise}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sunset-bottom{
  width: 100%;
  height: calc(100% - 30px);
}
.sunset-time{
  width: 100%;
  height: 50px;
  font-weight: bold;
  font-size: 25px;
  text-align: left;
  display: flex;
  align-items: center;
}
.sunset-time span{
  margin-left: 5px;
}
.sunset-track{
  width: 100%;
  height: 70px;
  overflow: hidden;
  position: relative;
}
.trackSun-horizon{
  width: 100%;
  height: 1px;
  border: none;
  background-color: #dcdbdb;
  margin-top: 40px;
}
.trackSun-sun{
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 0 8px white;
  transition: linear all 0.1s;
  position: absolute;
  top: 0;
  left: 0;
}
</style>