<script setup>
import * as echarts from "echarts";
import {onMounted, defineProps, ref} from "vue";
import {useWeatherStore} from "../../store/weatherEditor";

// let props = defineProps(["width", "height"])
let echartsRef = ref()

const createChart = () => {
  let lineChart = echarts.init(echartsRef.value);
  let lineOption = ({
    title: {
      text: '能见度'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        type: 'line',
        data: [5, 20, 36, 10, 10, 20],
        smooth:true,
        symbol:'none'
      }
    ]
  })
  lineChart.setOption(lineOption)
  lineChart.on('mousemove',(param) => {
    console.log(param)
  })
}

onMounted(() => {
  createChart()
})
</script>

<template>
  <div class="echarts-box">
<!--    <div ref="echartsRef" :style="{ width: props.width, height: props.height }"></div>-->
    <div ref="echartsRef" style="width: 200px;height: 200px"></div>

  </div>
</template>
