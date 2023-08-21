<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import utils from "../../utils/requestUtils";
import {ElMessage} from "element-plus";

let nowWeather = ref()
let props = defineProps(['code','locationName'])
const BASIC_PRESSURE = 1013

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
      return `rotate(${360 - (BASIC_PRESSURE - pressure) * 120 / 65}deg)`
    }
  }
}

watch(() => [props.code,props.locationName],() => {
  let now:any = localStorage.getItem('nowWeather')
  nowWeather.value = JSON.parse(now)
  calcAngle(nowWeather.value.pressure)
})

onMounted(() => {
  utils.judgeIfHasNowWeather().then(res => {
    nowWeather.value = res
  }).catch(() => {
    ElMessage({
      message:"获取数据失败",
      type:"warning"
    })
  })
})
</script>

<template>
  <div class="module-main" v-if="nowWeather">
    <div class="module-title">
      <img src="../../assets/icons/pressure.svg">&nbsp;气压
    </div>
    <div class="pressure-body-wrap">
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
  </div>
</template>

<style scoped>
.module-title{
  margin-top: 0;
}
.pressure-body-wrap{
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pressure-body{
  width: 70%;
  height: calc((100% + 30px)*0.7);
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
  top: calc(82% - 15px);
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