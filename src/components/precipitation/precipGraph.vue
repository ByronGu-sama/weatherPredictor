<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch, defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let hour = []
let precip = []
let lineChart = null
let props = defineProps(['render'])

let lineOption = ({
  title: {
    text: '降水'
  },
  xAxis: {
    name:'时间',
    type:'category',
    data: hour,
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    }
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
    valueFormatter:(val) => {
      return val + 'mm/h'
    }
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

watch(() => props.render,(n) => {
  if (n && weatherStore.hourlyWeather_24?.length > 23) {
    //已初始化过的图表通过重新设置数据触发更新
    if (lineChart) {
      hour.splice(0)
      precip.splice(0)
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
