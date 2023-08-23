<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useWeatherStore} from "../../store/weatherEditor.ts";

let hourPredictor = ref<any>('')                          //24小时天气预报
let hourlyPredictorTitle = ref<string>('')                  //24小时天气预报总结标题
const weatherStore = useWeatherStore()

//根据24小时天气预报总结未来大致天气情况
const summarize24HWeather = (data:any) => {
  let tempList = []
  for (let i of data){
    tempList.push({
      weather:i.text,
      time:i.fxTime
    })
  }

  let count = 0                          //相同天气连续出现次数
  let keyword = tempList[0].weather          //天气名称
  let temp = []                          //
  let timespan = [tempList[0].time,'']       //天气持续时间段
  tempList.push({weather:'aaa',time:'aaa'})  //占位数据，防止判断出错

  //整理数据
  for (let i of tempList){
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



onMounted(() => {
  let weather = weatherStore.hourlyWeather_24
  if(weather){
    hourPredictor.value = weather
    summarize24HWeather(weather)
  }
})
</script>

<template>
  <div>
    <div class="predictor24Wrapper-title">
      <span>{{ hourlyPredictorTitle }}</span>
    </div>
    <hr class="divider">
    <div class="predictor24Area">
      <div v-for="i in weatherStore.hourlyWeather_24" class="predictor24Wrapper">
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