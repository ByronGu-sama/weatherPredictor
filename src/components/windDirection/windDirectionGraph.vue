<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch,defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let props = defineProps(['render'])
let hour = []
let maxWScale = []
let minWScale = []
let windDir = []
let windSpeed = []
let lineChart = null

let lineOption = ({
  title: {
    text:'风向'
  },
  xAxis: {
    name:'时间',
    data: hour,
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    }
  },
  yAxis: {
    name:'风速等级',
    min:0,
    max:17
  },
  series: [
    {
      name:'最高(级)',
      type: 'line',
      data: maxWScale,
      smooth:true,
      symbol:'none'
    }, {
      name:'最低(级)',
      type: 'line',
      data: minWScale,
      smooth:true,
      symbol:'none'
    }, {
      name:'风速(km/h)',
      type: 'line',
      data: windSpeed,
      symbol:'none',
      lineStyle:{
        width:'0'
      }
    }, {
      name:'风向',
      type: 'line',
      data: windDir,
      symbol:'none',
      lineStyle:{
        width:'0'
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
    }
  }
})

//处理天气数据
const handleData = () => {
  if(weatherStore.hourlyWeather_24?.length > 23){
    let temp = weatherStore.hourlyWeather_24
    for(let i of temp){
      let tempHour = new Date(i.fxTime)
      hour.push(tempHour.getHours())
      let windScale = i.windScale.split('-')
      maxWScale.push(windScale[1] || 3)
      minWScale.push(windScale[0] || 2)
      windDir.push(i.windDir || '')
      windSpeed.push(i.windSpeed || 15)
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
  if (n && weatherStore.hourlyWeather_24?.length > 23) {
    //已初始化过的图表通过重新设置数据触发更新
    if (lineChart) {
      hour.splice(0)
      maxWScale.splice(0)
      maxWScale.splice(0)
      windSpeed.splice(0)
      windDir.splice(0)
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
  if(lineChart)
    lineChart.dispose()
})
</script>

<template>
  <div class="echarts-box">
    <div ref="echartsRef" style="width: 320px;height: 300px;margin-right: 10px"></div>
    <span class="vis-tips">当前风力{{weatherStore.weather.windScale}}级，{{weatherStore.weather.windDir}}</span>
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
