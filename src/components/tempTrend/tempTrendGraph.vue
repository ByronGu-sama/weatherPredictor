<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch,defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let props = defineProps(['render'])
let week = []
let tempMax = []
let tempMin = []
let lineChart = null

let lineOption = ({
  title: {
    text: '温度趋势'
  },
  xAxis: {
    name:'时间',
    data: week,
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    },
    boundaryGap:false
  },
  yAxis: {
    name:'温度'
  },
  series: [
    {
      name:'最高温',
      type: 'line',
      data: tempMax,
      smooth:true,
      symbol:'none',
      color:'blue',
      areaStyle:{
        color:'#3eede7',
        origin:'start',
        opacity:0.5
      }
    },{
      name:'最低温',
      type: 'line',
      data: tempMin,
      smooth:true,
      symbol:'none',
      color: 'yellow',
      areaStyle: {
        color: '#fff',
        origin: 'start',
        shadowColor: '#fff',
        shadowOffsetX: 1
      },
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

//处理天气数据
const handleData = () => {
  if(weatherStore.daysWeather_10?.length > 9){
    let temp = weatherStore.daysWeather_10
    let num = 0
    for(let i of temp){
      if(num === 0){
        week.push('今天')
      }else
        week.push(commonUtils.processWeek(i.fxDate))
      tempMax.push(i.tempMax || 20)
      tempMin.push(i.tempMin || 10)
      num++
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
  if (n && weatherStore.daysWeather_10?.length > 9) {
    //已初始化过的图表通过重新设置数据触发更新
    if (lineChart) {
      week.splice(0)
      tempMax.splice(0)
      tempMin.splice(0)
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
    <span class="vis-tips"></span>
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
