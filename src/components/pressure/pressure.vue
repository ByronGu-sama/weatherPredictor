<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor.ts";
import { ClickOutside as vClickOutside } from 'element-plus'
import pressureGraph from './pressureGraph.vue'
import {ref, unref} from "vue";

const BASIC_PRESSURE = 1013
const weatherStore = useWeatherStore()
const popoverRef = ref()
let bodyRef = ref()
let render = ref(false)

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
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
      return `rotate(${360 - (BASIC_PRESSURE - pressure) * 120 / 65}deg)`
    }
  }
}
</script>

<template>
  <div class="module-main" v-if="weatherStore.hourlyWeather_24?.length > 23">
    <div class="pressure-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/pressure.svg">&nbsp;气压
      </div>
      <div class="pressure-body-wrap">
        <div class="pressure-body">
          <div class="pressure-ring"></div>
          <div class="pressure-arrow" :style="{transform:calcAngle(weatherStore.weather.pressure)}">
            <div class="pressure-indicator"></div>
          </div>
          <div class="pressure-info">
            {{weatherStore.weather.pressure}}百帕
          </div>
          <div class="pressure-word">
            <span>低</span>&emsp;&emsp;&emsp;&emsp;&emsp;
            <span>高</span>
          </div>
        </div>
      </div>
    </div>

    <el-popover
        ref="popoverRef"
        :virtual-ref="bodyRef"
        trigger="click"
        placement="left"
        virtual-triggering
        width="400"
        transition="el-fade-in-linear"
        @after-enter="render = true"
        @after-leave="render = false"
    >
      <el-scrollbar :max-height="400">
        <div class="vis-popup">
          <div class="vis-popup-middle">
            <pressureGraph width="330px" height="400px" :render="render"></pressureGraph>
          </div>
          <el-divider />
          <div class="vis-popup-bottom">
            <span class="popup-title">关于大气压强</span>
            <br>
            <span class="popup-tips">气压和天气密切相关。一般来说，地面上高气压的地区往往是晴天，地面上低气压的地区往往是阴雨天。这里所说的高气压和低气压是相对的，不是指大气压的绝对值</span>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<style scoped>
.pressure-main{
  width: 100%;
  height: 100%;
}
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