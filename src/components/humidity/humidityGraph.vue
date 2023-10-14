<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch, defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

let echartsRef = ref()
let props = defineProps(['render'])
const weatherStore = useWeatherStore()
let week = []
let humidity = []
let lineChart = null

let lineOption = ({
  title: {
    text: '湿度'
  },
  xAxis: {
    name:'时间',
    type:'category',
    boundaryGap:false,
    data: week,
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    }
  },
  yAxis: {
    name:'湿度',
    min:0,
    max:100,
    interval:10,
  },
  series: [
    {
      type:'line',
      data: humidity,
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
    valueFormatter:(val) => {
      return val + '%'
    }
  }
})

//处理天气数据
const handleData = () => {
  let temp = weatherStore.hourlyWeather_24
  for(let i of temp){
    let tempHour = new Date(i.fxTime)
    week.push(tempHour.getHours())
    if(i.humidity){
      humidity.push(i.humidity)
    }else{
      humidity.push(60)
    }
  }
}

const createChart = () => {
  lineChart = echarts.init(echartsRef.value);
  lineChart.setOption(lineOption,true)
}

watch(() => props.render,(n) => {
  if (n && weatherStore.hourlyWeather_24?.length > 23) {
    //已初始化过的图表通过重新设置数据触发更新
    if (lineChart) {
      week.splice(0)
      humidity.splice(0)
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
