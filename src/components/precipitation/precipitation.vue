<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import precipGraph from './precipGraph.vue'
import {ref, unref} from "vue";

const weatherStore = useWeatherStore()
const popoverRef = ref()
let bodyRef = ref()
let render = ref(false)

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

// 未来24小时平均降雨量
const calcFuturePrecipitation_24h = (data:any) => {
  let precipSum = 0
  for (let i of data){
    precipSum+=parseFloat(i.precip)
  }
  let precip = precipSum.toFixed(1)
  if(precip == '0.0'){
    return '0'
  }
  return precip
}

</script>

<template>
  <div class="module-main" v-if="weatherStore.hourlyWeather_24?.length>1 && weatherStore.weather?.precip">
    <div class="precip-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/precipitation.svg" style="width: 13px;height: 13px" alt="">&nbsp;降水
      </div>
      <div class="precip-content">
        <div class="precip-content-top">
          <span>{{weatherStore.weather.precip=='0.0'?0:weatherStore.weather.precip}}毫米</span>
          <br>
          <span>当前</span>
        </div>
        <div class="precip-content-bottom">
          <span>预计未来24小时</span>
          <span style="font-weight: bold">降水量{{calcFuturePrecipitation_24h(weatherStore.hourlyWeather_24)}}毫米</span>
        </div>
      </div>
    </div>

    <el-popover
        ref="popoverRef"
        :virtual-ref="bodyRef"
        trigger="click"
        placement="left"
        virtual-triggering
        width="350"
        transition="el-fade-in-linear"
        @after-enter="render = true"
        @after-leave="render = false"
    >
      <el-scrollbar :max-height="400">
        <div class="vis-popup">
          <div class="vis-popup-middle">
            <precipGraph width="320px" height="400px" :render="render"></precipGraph>
          </div>
          <div class="vis-popup-bottom">
            <span class="popup-tips">未来24小时降水总量预计为{{(parseFloat(calcFuturePrecipitation_24h(weatherStore.hourlyWeather_24))*24).toFixed(1)}}毫米</span>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<style scoped>
.precip-main{
  width: 100%;
  height: 100%;
}
.precip-content{
  width: 100%;
  height: calc(100% - 30px);
}
.precip-content-top{
  width: 100%;
  height: 110px;
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
  font-size: 13px;
  width: 100%;
  height: 40px;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.precip-content-bottom span{
  margin: 0 5px;
}
</style>