<script setup lang="ts">
import request from '../../request/Url'
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus";

let nowWeather = ref()
let props = defineProps(['code','locationName'])
const BASIC_PRESSURE = 1013

//获取实时天气数据
const getNowWeather = (value:string) => {
  axios.get(`${request.GET_NOW_WEATHER}location=${value}`).then(res => {
    if(res.data.code == 200){
      nowWeather.value = res.data.now
      localStorage.setItem('nowWeather',JSON.stringify(res.data.now))
    }
  })
}

//计算指针角度
const calcAngle = (pressure:any) => {
  pressure = parseInt(pressure)
  if(pressure > 1076)
    return 'rotate(120deg)'
  else if (pressure < 950){
    return 'rotate(240deg)'
  }else{
    if(pressure >= 1015 ){
      return `rotate(${(pressure - BASIC_PRESSURE) * 120 / 65}deg)`
    }else{
      return `rotate(${240 + (BASIC_PRESSURE - pressure) * 120 / 65}deg)`
    }
  }
}

watch(() => [props.code,props.locationName],() => {
  let now:any = localStorage.getItem('nowWeather')
  nowWeather.value = JSON.parse(now)
  calcAngle(nowWeather.value.pressure)
})

onMounted(() => {
  let now = localStorage.getItem('nowWeather')
  if(!now){
    let location = localStorage.getItem('qwLocation')
    if(location){
      getNowWeather(JSON.parse(location).value)
    }else{
      ElMessage({
        message:'获取气压数据失败',
        type:'warning'
      })
    }
  }else{
    nowWeather.value = JSON.parse(now)
    calcAngle(nowWeather.value.pressure)
  }
})
</script>

<template>
  <div class="pressure-main" v-if="nowWeather">
    <div class="pressure-title">
      <img src="../../assets/icons/pressure.svg">&nbsp;气压
    </div>
    <div class="pressure-body">
      <div class="pressure-ring"></div>
      <div class="pressure-arrow" :style="{transform:calcAngle(nowWeather.pressure)}">
        <div class="pressure-indicator"></div>
      </div>
      <div class="pressure-info">
        {{nowWeather.pressure}}百帕
      </div>
      <div class="pressure-word">
        <span>低</span>&emsp;&emsp;&emsp;&emsp;&emsp;
        <span>高</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pressure-main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.pressure-title{
  text-align: left;
  margin-left: 5%;
  height: 30px;
  width: 100%;
  line-height: 30px;
  font-size: 13px;
  display: flex;
  align-items: center;
  color: white;
}
.pressure-title img{
  width: 13px;
  height: 13px;
}
.pressure-body{
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  position: relative;
}
.pressure-ring{
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(rgba(255, 255, 255, 0.4) 0 3deg, transparent 0deg 8deg);
  border-radius: 50%;
  -webkit-mask-image: radial-gradient(transparent 55%, black 0);
  mask-image: radial-gradient(transparent 55%, black 0);
  -webkit-clip-path:polygon(0 0%, 0% 83%, 50% 50%, 100% 83%,100% 0);
}
.pressure-arrow{
  width: 4px;
  height: 50%;
  position: absolute;
  top: 0;
  left: calc(50% - 2px);
  transition: 0.1s linear;
  transform-origin: bottom;
}
.pressure-indicator{
  width: 100%;
  height: 22%;
  background-color: white;
  border-radius: 2px;
}
.pressure-word{
  line-height: 30px;
  font-size: 13px;
  color: white;
  width: 100%;
  height: 30px;
  position: absolute;
  top: calc(80% - 15px);
  text-align: center;
}
.pressure-info{
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: white;
  font-size: 14px;
  position: absolute;
  top: calc(50% - 15px);

}
</style>