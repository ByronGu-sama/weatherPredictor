<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import tempTrendGraph from './tempTrendGraph.vue'
import {ref, unref, watch} from "vue";

const popoverRef = ref()
const weatherStore = useWeatherStore()
let bodyRef = ref()
let render = ref(false)
let mark = ref(false)

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
/*
* @Author:ByronGu
* @Date:2023/09/18
* @Description 计算过去七天平均最高温
*/
const calcGap = () => {
  let temp = 0
  for (let i = 0; i < weatherStore.historicalWeather.length; i++){
    temp += parseFloat(weatherStore.historicalWeather[i].weatherDaily.tempMax)
  }
  return temp / 7
}

/*
* @Author:ByronGu
* @Date:2023/09/18
* @Description 计算温差
*/
const handleTempDiff = () => {
  let tempDiff = Math.round(weatherStore.daysWeather_10[0].tempMax - calcGap()!)
  return tempDiff >= 0?'+'+tempDiff.toFixed(0):tempDiff.toFixed(0)
}

/*
* @Author:ByronGu
* @Date:2023/09/18
* @Description 根据温差返回特定语句
*/
const processTips = () => {
  let tempDiff = Math.round(weatherStore.daysWeather_10[0].tempMax - calcGap()!)
    if (tempDiff > 0){
      return '高于周均最高温'
    }else if(tempDiff < 0){
      return '低于周均最高温'
    }else{
      return '持平周均最高温'
    }
}

watch(()=>weatherStore.historicalWeather?.length>6,() => {
  calcGap()
},{
  immediate:true,
})
</script>

<template>
  <div class="module-main" v-if="weatherStore.daysWeather_10?.length > 9">
    <div class="temp-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/trend.svg">&emsp;平均
      </div>
      <div class="trend-middle">
        <div class="trend-average">
          <span>{{handleTempDiff()}}˚</span>
          <br>
          <span>{{processTips()}}</span>
        </div>
        <div class="trend-tips">
          <span>今天:{{weatherStore.daysWeather_10[0].tempMax}}˚</span>
          <br>
          <span>平均值:{{Math.round(calcGap())}}˚</span>
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
            <tempTrendGraph width="320px" height="400px" :render="render"></tempTrendGraph>
          </div>
          <el-divider />
          <div class="vis-popup-bottom">
            <span class="popup-title">关于温度趋势</span>
            <br>
            <span class="popup-tips">温度趋势展示了未来7天的气温大致变化，通常前三天的温度趋势能较为准确地反应现实世界的温度变化，之后的趋势仅作参考</span>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<style scoped>
.temp-main{
  width: 100%;
  height: 100%;
}
.trend-middle{
  width: 100%;
  height: calc(100% - 30px);
}
.trend-middle > div:nth-child(1){
  width: 100%;
  height: 70%;
}
.trend-middle > div:nth-child(2){
  width: 100%;
  height: 30%;
}
.trend-average{
  text-align: left;
  margin-left: 5px;
}
.trend-average > span:nth-child(1){
  font-size: 30px;
  font-weight: bold;
}
.trend-average > span:nth-child(3){
  font-size: 13px;
  font-weight: bold;
}
.trend-tips{
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  margin-left: 5px;
  color: white;
}
</style>