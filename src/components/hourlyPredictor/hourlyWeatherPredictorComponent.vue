<script setup lang="ts">
import {ref, watch} from "vue";
import axios from 'axios'
import request from "../../request/Url";

let hourPredictor = ref<any>('')                          //24小时天气预报
let hourlyPredictorTitle = ref<string>('')                  //24小时天气预报总结标题
let props = defineProps(['locationName','code'])

//获取未来24小时天气预报
const get24HaysWeatherPredictor = (value:string,label:string) => {
  axios.get(`${request.GET_WEATHER_PREDICTOR_24H}location=${value}`).then(res => {
    if(res.data.code == 200){
      hourPredictor.value = res.data.hourly
      let temp:weatherInfo[] = []
      for (let i of res.data.hourly){
        temp.push({
          weather:i.text,
          time:i.fxTime
        })
      }
      summarize24HWeather(temp)
    }
  })
}

//根据24小时天气预报总结未来大致天气情况
interface weatherInfo{
  weather:string,
  time:string
}

const summarize24HWeather = (data:weatherInfo[]) => {
  let count = 0                          //相同天气连续出现次数
  let keyword = data[0].weather          //天气名称
  let temp = []                          //
  let timespan = [data[0].time,'']       //天气持续时间段
  data.push({weather:'aaa',time:'aaa'})  //占位数据，防止判断出错

  //整理数据
  for (let i of data){
    if(keyword === i.weather){
      ++count
      timespan[1] = i.time
    }else{
      if(count === 1){
        timespan[1] = timespan[0]
      }
      temp.push({
        weather:keyword,
        span:timespan
      })
      keyword = i.weather
      timespan = [i.time,'']
      count = 1
    }
  }
  if(temp.length === 1)
    hourlyPredictorTitle.value = `${new Date(temp[0].span[0]).getHours()}点至${new Date(temp[0].span[1]).getHours()}点会${choiceVerbByWeather(temp[0].weather)}${temp[0].weather}`
  else
    hourlyPredictorTitle.value = `${new Date(temp[0].span[0]).getHours()}点至${new Date(temp[0].span[1]).getHours()}点会${choiceVerbByWeather(temp[0].weather)}${temp[0].weather},${new Date(temp[1].span[0]).getHours()}点至${new Date(temp[1].span[1]).getHours()}点可能转${temp[1].weather}`
}

//根据天气选择动词
const choiceVerbByWeather = (word:string) => {
  if(word.indexOf("雨") !== -1 || word.indexOf("雪") !== -1 || word.indexOf("冰雹") !== -1){
    return '下'
  }else{
    return '是'
  }
}

//监听props数据需要使用getter返回值形式才能触发
watch(() => [props.code,props.locationName],(n) => {
  get24HaysWeatherPredictor(n[0],n[1])
})

</script>

<template>
  <div>
    <div class="predictor24Wrapper-title">
      <span>{{ hourlyPredictorTitle }}</span>
    </div>
    <hr class="divider">
    <div class="predictor24Area">
      <div v-for="i in hourPredictor" class="predictor24Wrapper">
        <div class="predictor24Wrapper-m1">
          {{(new Date(i.fxTime).getHours())}}:00
        </div>
        <div class="predictor24Wrapper-m2">
          <i :class="'qi-'+i.icon"/>
        </div>
        <div class="predictor24Wrapper-m3">
          {{i.temp}}°
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar{
  display: none;
}
.predictor24Area{
  display: flex;
  overflow-x: auto;
  color: rgb(255,255,255);
  font-weight: bold;
}
.predictor24Wrapper{
  width: 60px;
  height: 100%;
  margin: 0 10px;
  text-align: center;
}
.predictor24Wrapper-title{
  width: 100%;
  height: 36px;
  text-align: left;
  color: rgb(255,255,255);
  font-weight: bold;
}
.predictor24Wrapper-m1{
  display: flex;
  width: 100%;
  height: 36px;
}
.predictor24Wrapper-m2{
  width: 100%;
  height: 72px;
}
.predictor24Wrapper-m3{
  width: 100%;
  height: 36px;
}
.predictor24Wrapper-title span{
  margin: 0 0 0 10px;
  line-height: 40px;
}
.predictor24Wrapper > div{
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider{
  border-color: rgba(255,255,255,0.2);
  margin: 0;
}
</style>