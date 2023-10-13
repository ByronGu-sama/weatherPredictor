<script setup>
import * as echarts from "echarts";
import {onMounted, ref, watch} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

let echartsRef = ref()
const weatherStore = useWeatherStore()
let hour = []
let precip = []
let lineChart = null
let lineOption = ({
  title: {
    text: '降水'
  },
  xAxis: {
    type:'category',
    data: hour,
  },
  yAxis: {
    name:'mm/h',
    min:0,
  },
  series: [
    {
      type:'bar',
      data: precip,
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

//处理天气数据
const handleData = () => {
  let temp = weatherStore.hourlyWeather_24
  for(let i of temp){
    let tempHour = new Date(i.fxTime)
    hour.push(tempHour.getHours())
    if(i.precip){
      precip.push(parseFloat(i.precip))
    }else{
      precip.push(0)
    }
  }
}

const createChart = () => {
  lineChart = echarts.init(echartsRef.value);
  lineChart.setOption(lineOption,true)
}
//获取新数据后需要通过改变原始数组触发echarts自动更新
watch(() => weatherStore.hourlyWeather_24,(n) => {
  if (lineChart){
    if (n){
      setTimeout(() => {
        hour.splice(0)
        precip.splice(0)
        handleData()
        lineOption.series.data = precip
        lineChart.setOption(lineOption)
      },800)
    }
  }else{
    lineChart = echarts.init(echartsRef.value);
  }
},{
  deep:true
})

onMounted(() => {
  setTimeout(() => {
    handleData()
    createChart()
  },2000)
})
</script>

<template>
  <div class="echarts-box">
    <div ref="echartsRef" style="width: 320px;height: 300px"></div>
    <span></span>
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
