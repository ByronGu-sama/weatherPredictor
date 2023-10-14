<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch, defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
let props = defineProps(['render'])
let echartsRef = ref()
let hour = []
let pressure = []
let lineChart = null

let lineOption = ({
  title: {
    text: '大气压强'
  },
  xAxis: {
    data: hour
  },
  yAxis: {
    name:'百帕',
    min:600
  },
  series: [
    {
      type: 'line',
      data: pressure,
      smooth:true,
      symbol:'none',
      areaStyle:{
        color:'rgba(245,232,253,0.76)',
      },
      lineStyle:{
        width:2,
        color:'#d997ff'
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
  }
})

//处理天气数据
const handleData = () => {
  let temp = weatherStore.hourlyWeather_24
  for(let i of temp){
    let tempHour = new Date(i.fxTime)
    hour.push(tempHour.getHours())
    if(i.pressure){
      pressure.push(i.pressure)
    }else{
      pressure.push(1015)
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
      hour.splice(0)
      pressure.splice(0)
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
  lineChart.dispose()
})
</script>

<template>
  <div class="echarts-box">
    <div ref="echartsRef" style="width: 320px;height: 300px"></div>
    <span class="vis-tips">今天{{commonUtils.determineVisibility(weatherStore.daysWeather_10[0].vis)}}</span>
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
