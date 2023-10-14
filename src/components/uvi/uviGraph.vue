<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch, defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let props = defineProps(['render'])
let week = []
let uvIndex = []
let lineChart = null

let lineOption = ({
  title: {
    text: '紫外线强度'
  },
  xAxis: {
    name:'时间',
    data: week,
    boundaryGap:false,
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    }
  },
  yAxis: {
    name:'UVI',
  },
  series: [
    {
      type: 'line',
      data: uvIndex,
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
      uvIndex.push(i.uvIndex)
    }else{
      uvIndex.push(20)
    }
  }
}

const createChart = () => {
  lineChart = echarts.init(echartsRef.value);
  lineChart.setOption(lineOption,true)
}

watch(() => props.render,(n) => {
  if (n && weatherStore.daysWeather_10?.length > 9) {
    //已初始化过的图表通过重新设置数据触发更新
    if (lineChart) {
      week.splice(0)
      uvIndex.splice(0)
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
  </div>
</template>