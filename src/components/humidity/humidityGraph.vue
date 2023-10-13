<script setup>
import * as echarts from "echarts";
import {onMounted, ref} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

let echartsRef = ref()
const weatherStore = useWeatherStore()
let week = []
let vis = []

//处理天气数据
const handleData = () => {
  let temp = weatherStore.hourlyWeather_24
  for(let i of temp){
    let tempHour = new Date(i.fxTime)
    week.push(tempHour.getHours())
    if(i.humidity){
      vis.push(i.humidity)
    }else{
      vis.push(60)
    }
  }
}

const createChart = () => {
  let lineChart = echarts.init(echartsRef.value);
  let lineOption = ({
    title: {
      text: '湿度'
    },
    xAxis: {
      type:'category',
      boundaryGap:false,
      data: week,
    },
    yAxis: {
      name:'%',
      min:0,
      max:100,
      interval:10,
    },
    series: [
      {
        type:'line',
        data: vis,
        smooth:true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 0.4,
              color: 'rgb(1, 191, 236)'
            },
            {
              offset: 0.8,
              color: 'rgb(62,106,217)'
            },
            {
              offset: 1,
              color: 'rgb(169,98,255)'
            }
          ])
        },
        symbol:'none'
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
    }

  })
  lineChart.setOption(lineOption)
}

onMounted(() => {
  handleData()
  createChart()
})
</script>

<template>
  <div class="echarts-box">
    <div ref="echartsRef" style="width: 320px;height: 300px"></div>
    <span class="humidity-tips">当前空气{{commonUtils.determineHumidity(weatherStore.hourlyWeather_24[0].humidity)}}</span>
  </div>
</template>
<style>
.humidity-tips{
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  margin-left: 5px;
}
</style>
