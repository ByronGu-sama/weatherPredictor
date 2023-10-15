<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch,defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor.ts";
import commonUtils from "../../utils/commonUtils.ts";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let props = defineProps(['render'])
let hour = []
let temperature = []
let lineChart = null

let lineOption = ({
  title: {
    text: '天气状况'
  },
  xAxis: {
    name:'时间',
    data: hour,
    boundaryGap:false,
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    }
  },
  yAxis: {
    name:'温度'
  },
  series: [
    {
      type: 'line',
      data: temperature,
      smooth:true,
      symbol:'none',
      lineStyle:{
        width:'0'
      },
      areaStyle:{
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: 'rgb(142,255,250)'
          }, {
            offset: 1,
            color: 'rgb(255,200,166)'
          }
        ])
      }
    }
  ],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(32, 33, 36,.7)',
    borderColor: 'rgba(32, 33, 36,0.20)',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
      fontSize: '12'
    },
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    },
    valueFormatter:(val) => {
      return val + '˚C'
    }
  }
})

const handleTodayData = () => {
  const NUM = 24
  let todayHistoricalData = weatherStore.historicalWeather[0]?.weatherHourly
  let todayFutureData = weatherStore.hourlyWeather_24.slice(0,NUM - todayHistoricalData - 1)
  let temp = []
  for(let i of todayHistoricalData){
    temp.push(i)
  }
  for (let i of todayFutureData){
    temp.push(i)
  }
  console.log(temp)
  return temp
}

//处理天气数据
const handleData = () => {
  if(weatherStore.historicalWeather?.length > 5 && weatherStore.hourlyWeather_24?.length > 23){
    let t = handleTodayData()
    for(let i of t){
      console.log(i)
      let tempHour = new Date(i.time)
      hour.push(tempHour.getHours())
      temperature.push(i.temp || 20)
    }
  }
}

const createChart = () => {
  if(!lineChart){
    lineChart = echarts.init(echartsRef.value);
    lineChart.setOption(lineOption,true)
  }
}

watch(() => props.render,(n) => {
  if (n && weatherStore.daysWeather_10?.length > 6) {
    //已初始化过的图表通过重新设置数据触发更新
    if (lineChart) {
      hour.splice(0)
      temperature.splice(0)
      handleData()
      lineChart.setOption(lineOption, true)
    } else {
      handleData()
      createChart()
    }
  }
},{
  immediate:true
})

onUnmounted(() => {
  if (lineChart)
    lineChart.dispose()
})
</script>

<template>
  <div class="echarts-box">
    <div ref="echartsRef" style="width: 320px;height: 300px"></div>
    <span class="vis-tips">今日天气{{weatherStore.weather.text}},{{weatherStore.weather.windDir}}{{weatherStore.weather.windScale}}级。温度{{weatherStore.daysWeather_10[0].tempMin}}至{{weatherStore.daysWeather_10[0].tempMax}}度</span>
  </div>
</template>
<style>
.vis-tips{
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  margin-left: 5px;
}
</style>
