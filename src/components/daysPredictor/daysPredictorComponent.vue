<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
import {useWeatherStore} from "../../store/weatherEditor.ts";
import commonUtils from "../../utils/commonUtils.ts";

let daysPredictor = ref<any>()                           //10天 天气预报
let area = ref<HTMLElement>()
const weatherStore = useWeatherStore()

//计算未来10天每日温差及温度范围在整体数据中的趋势
const calcTempTrend = async (val:{day:string,tempMin:number,tempMax:number,iconDay:string}[]) => {
  let maxTempRank = val.slice(0)      //最高温度排序
  let minTempRank = val.slice(0)      //最低温度排序
  let tempDiffRank = val.slice(0)     //温差排序
  let aveTempRank = val.slice(0)      //平均温度排序
  let conclusionRank:any[] = []       //结果

  //按最高温度标序号  高 -> 低
  for(let i = 0;i < maxTempRank.length - 1;i++){
    let mark = false
    for (let j = 0;j < maxTempRank.length - i - 1;j++){
      if(maxTempRank[j].tempMax < maxTempRank[j+1].tempMax){
        [maxTempRank[j],maxTempRank[j+1]] = [maxTempRank[j+1],maxTempRank[j]]
        mark = true
      }
    }
    if(!mark)
      break;
  }

  //按最低温度标序号  低 -> 高
  for(let i = 0;i < minTempRank.length - 1;i++){
    let mark = false
    for (let j = 0;j < minTempRank.length - i - 1;j++){
      if(minTempRank[j].tempMin > minTempRank[j+1].tempMin){
        [minTempRank[j],minTempRank[j+1]] = [minTempRank[j+1],minTempRank[j]]
        mark = true
      }
    }
    if(!mark)
      break;
  }

  //按温差标序号  高 -> 低
  for(let i = 0;i < tempDiffRank.length - 1;i++){
    let mark = false
    for (let j = 0;j < tempDiffRank.length - i - 1;j++){
      if(tempDiffRank[j].tempMax - tempDiffRank[j].tempMin < tempDiffRank[j+1].tempMax - tempDiffRank[j+1].tempMin){
        [tempDiffRank[j],tempDiffRank[j+1]] = [tempDiffRank[j+1],tempDiffRank[j]]
        mark = true
      }
    }
    if(!mark)
      break;
  }

  //按温差标序号  高 -> 低
  for(let i = 0;i < aveTempRank.length - 1;i++){
    let mark = false
    for (let j = 0;j < aveTempRank.length - i - 1;j++){
      if((aveTempRank[j].tempMax + aveTempRank[j].tempMin)/2 < (aveTempRank[j+1].tempMax + aveTempRank[j+1].tempMin)/2){
        [aveTempRank[j],aveTempRank[j+1]] = [aveTempRank[j+1],aveTempRank[j]]
        mark = true
      }
    }
    if(!mark)
      break;
  }

  //整理
  for(let i = 0;i < val.length;i++){
    conclusionRank.push({
      date:val[i].day,
      maxTemp:val[i].tempMax,
      minTemp:val[i].tempMin,
      maxTempRank:0,
      minTempRank:0,
      tempDiff:val[i].tempMax - val[i].tempMin,
      tempDiffRank:0,
      iconDay:val[i].iconDay,
      averageTemp:(val[i].tempMax - val[i].tempMin)/2,
      averageTempRank:0,
      barWidth:'',
      offset:''
    })
  }
  for (let i of conclusionRank){
    for (let [index,j] of maxTempRank.entries()){
      if (j.day == i.date){
        i.maxTempRank = ++index
      }
    }
    for (let [index,j] of minTempRank.entries()){
      if (j.day == i.date){
        i.minTempRank = ++index
      }
    }
    for (let [index,j] of tempDiffRank.entries()){
      if (j.day == i.date){
        i.tempDiffRank = ++index
      }
    }
    for (let [index,j] of aveTempRank.entries()){
      if (j.day == i.date){
        i.averageTempRank = ++index
      }
    }
  }

  //计算样式
  await nextTick(() => {
    for (let i of conclusionRank){
      i.barWidth = calcMargin(i.averageTempRank,i.tempDiffRank).width
      i.offset = calcMargin(i.averageTempRank,i.tempDiffRank).margin
    }
  })
  return(conclusionRank)
}

//根据平均温度排序计算宽度和边距
const calcMargin = (averageTempRank:number,tempDiffRank:number) => {
  let width:number = area.value?.clientWidth!/10*2.4           //指示条wrapper宽度
  let barWidth:number = (78-tempDiffRank*4)/100*width          //指示条宽度
  let pole:number = (width - barWidth) / 9                     //扣除安全边距后等分为9份  获得10根分界线
  return {
    width:barWidth+'px',
    margin:`0 0 0 ${pole*(10 - averageTempRank)}px`
  }
}

//处理数据
const processData = (data:any) => {
  let temp:any[] = []
  for(let i of data){
    temp.push({
      day:i.fxDate,
      tempMax:i.tempMax,
      tempMin:i.tempMin,
      iconDay:i.iconDay
    })
  }
  calcTempTrend(temp).then(res => {
    daysPredictor.value = res
  })
}

watch(() => weatherStore.daysWeather_10,() => {
  if(weatherStore.daysWeather_10?.length >= 9){
    processData(weatherStore.daysWeather_10)
  }
},{
  immediate:true,
  deep:true
})
</script>

<template>
  <div class="dpcMain"  style="text-align: left" ref="area" v-if="weatherStore.daysWeather_10?.length > 9">
    <span style="margin: 5px 0 0 15px;line-height: 36px;font-weight: bold">未来10日天气预报</span>
    <hr class="divider">
    <div v-for="(item,index) in daysPredictor" :key="index" v-if="daysPredictor">
      <div class="dpc-left">
        {{index==0?'今天':commonUtils.processWeek(item.date)}}
      </div>
      <div class="dpc-middle">
        <i :class="'qi-'+item.iconDay"/>
      </div>
      <div class="dpc-right">
        <div class="dpc-right-maxTemp">
          {{item.minTemp}}˚
        </div>
        <div class="dpc-right-trend">
          <div class="trendWrapper">
          <div class="trendBody" :style="{width:item.barWidth,margin:item.offset}"></div>
          </div>
        </div>
        <div class="dpc-right-minTemp">
          {{item.maxTemp}}˚
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
 ::-webkit-scrollbar{
   display: none;
 }
 .dpcMain{
   width: 100%;
   height: 100%;
   font-weight: bold;
   color: white;
   text-shadow: 1px 1px 30px rgba(0, 0, 0, 0.7);
 }
 .dpcMain > div{
   display: flex;
   flex-wrap: nowrap;
   height: 52px;
   transition: linear all 0.1s;
   border-radius: 5px;
   margin: 2px;
 }
 .dpcMain > div:active{
    background-color: rgba(255, 255, 255, 0.20);
 }
 .dpc-left,.dpc-middle,.dpc-right{
   display: flex;
   align-items: center;
   justify-content: center;
 }
 .dpc-left{
   flex: 1;
 }
 .dpc-middle{
   flex: 2;
 }
 .dpc-right{
   flex: 3;
   display: flex;
   flex-wrap: nowrap;
 }
 .dpc-right > div{
   display: flex;
   justify-content: center;
   align-items: center;
 }
 .dpc-right-maxTemp{
   flex: 1;
 }
 .dpc-right-trend{
   flex: 3;
 }
 .dpc-right-minTemp{
   flex: 1;
 }
 .divider{
   border-color: rgba(255,255,255,0.2);
   margin: 0;
 }
 .trendWrapper{
   width: 80%;
   height: 4px;
   border-radius: 2px;
   background-color: rgba(0,0,0,0.1);
 }
 .trendBody{
   height: 100%;
   border: none;
   background: rgba(255, 165, 0, 0.8);
   border-radius: 4px;
   transition: 0.1s linear;
 }
</style>