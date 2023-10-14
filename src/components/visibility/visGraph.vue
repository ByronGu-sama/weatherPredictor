<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch,defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let props = defineProps(['render'])
let week = []
let vis = []
let lineChart = null

let lineOption = ({
  title: {
    text: '能见度'
  },
  xAxis: {
    data: week
  },
  yAxis: {
    name:'km',
    min:0,
    max:45,
    interval:5,
  },
  series: [
    {
      type: 'line',
      data: vis,
      smooth:true,
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
      return val + 'km'
    }
  }
})

//处理天气数据
const handleData = () => {
  if(weatherStore.daysWeather_10?.length > 6){
    let temp = weatherStore.daysWeather_10.slice(0,6)
    for(let i of temp){
      week.push(commonUtils.processWeek(i.fxDate))
      if(i.vis){
        vis.push(i.vis)
      }else{
        vis.push(20)
      }
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
      week.splice(0)
      vis.splice(0)
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
    <span class="vis-tips">今天{{commonUtils.determineVisibility(weatherStore.daysWeather_10[0]?.vis)}}</span>
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
