<script setup>
import * as echarts from "echarts";
import {onMounted, ref, watch} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

let echartsRef = ref()
const weatherStore = useWeatherStore()
let week = []
let uviIndex = []
let lineChart = null
let lineOption = ({
  title: {
    text: '紫外线强度'
  },
  xAxis: {
    data: week,
    boundaryGap:false,
  },
  yAxis: {
    name:'UVI',
  },
  series: [
    {
      type: 'line',
      data: uviIndex,
      smooth:true,
      symbol:'none',
      areaStyle:{
        color:'#44ab49',
      },
      lineStyle:{
        width:0
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
  let temp = weatherStore.daysWeather_10
  for(let i of temp){
    week.push(commonUtils.processWeek(i.fxDate))
    if(i.uvIndex){
      uviIndex.push(i.uvIndex)
    }else{
      uviIndex.push(20)
    }
  }
}

const createChart = () => {
  lineChart = echarts.init(echartsRef.value);
  lineChart.setOption(lineOption,true)
}

// 获取新数据后需要通过改变原始数组触发echarts自动更新
watch(() => weatherStore.daysWeather_10,(n) => {
  if (lineChart){
    if (n.length >= 6){
      setTimeout(() => {
        week.splice(0)
        uvIndex.splice(0)
        handleData()
        lineOption.series.data = uvIndex
        lineChart.setOption(lineOption)
      },200)
    }
  }else{
    lineChart = echarts.init(echartsRef.value);
  }
},{
  deep:true
})
onMounted(() => {
  handleData()
  createChart()
})
</script>

<template>
  <div class="echarts-box">
    <div ref="echartsRef" style="width: 320px;height: 300px"></div>
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
