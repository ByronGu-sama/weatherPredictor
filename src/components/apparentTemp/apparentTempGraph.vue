<script setup>
import * as echarts from "echarts";
import {onUnmounted, ref, watch,defineProps} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
let echartsRef = ref()
let props = defineProps(['render'])
let hour = []
let AT = []
let temperature = []
let lineChart = null

let lineOption = ({
  title: {
    text: '体感温度'
  },
  xAxis: {
    data: hour,
    name:'时间',
    nameTextStyle:{
      padding:[0,0,0,-10],
      verticalAlign:'top'
    }
  },
  yAxis: {
    name:'温度',
  },
  series: [
    {
      name:'气温',
      type: 'line',
      data: temperature,
      smooth:true,
      symbol:'none',
      areaStyle:{
        color:'#c6fff6'
      },
      lineStyle:{
        color:'#97e5ff'
      }
    },{
      name:'体感温度',
      type: 'line',
      data: AT,
      smooth:true,
      symbol:'none',
      areaStyle:{
        color:'#d7ffc3'
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
    valueFormatter:(val) => {
      return val+'˚C'
    }
  }
})

//处理天气数据
const handleData = () => {
  if(weatherStore.hourlyWeather_24?.length > 23){
    let t = weatherStore.hourlyWeather_24
    for(let i of t){
      let tempHour = new Date(i.fxTime)
      hour.push(tempHour.getHours())
      if(i.temp && i.windSpeed && i.humidity){
        AT.push(getAT(i.temp,i.windSpeed,i.humidity).toFixed(1))
        temperature.push(i.temp)
      }else{
        AT.push(20)
        temperature.push(20)
      }
    }
  }
}

//获取体感温度
const getAT = (a,b,c) => {
  let t = parseInt(a)
  let v = parseInt(b)/60/60*1000
  let rh = parseInt(c)
  return commonUtils.calcApparentTemperature(t,v,rh)
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
      AT.splice(0)
      temperature.splice(0)
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
    <span class="vis-tips">{{commonUtils.handleTipsAboutT_and_H(weatherStore.weather.temp,weatherStore.weather.humidity)}}</span>
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
