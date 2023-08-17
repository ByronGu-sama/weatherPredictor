<script setup lang="ts">
import request from "../../request/Url";
import axios from "axios";
import {ref, watch} from "vue";

let daysPredictor = ref<any>(null)                          //10天 天气预报
let props = defineProps(['code','locationName'])

//获取未来十天 天气预报

const get10DaysWeatherPredictor = (value:string) => {
  axios.get(`${request.GET_WEATHER_PREDICTOR_15D}location=${value}`).then(res => {
    if(res.data.code == 200){
      daysPredictor.value = res.data.daily
      console.log(res.data)
    }
  })
}

//日期转换
const processWeek = (val:string) => {
  let week:number = new Date(val).getDay()
  switch (week){
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 0:
      return '周日'
  }
}

watch(() => [props.code,props.locationName],(n,o) => {
  get10DaysWeatherPredictor(n[0])
})
</script>

<template>
  <div class="dpcMain">
    <div v-for="(item,index) in daysPredictor" :key="index">
      <div class="dpc-left">
        {{index==0?'今天':processWeek(item.fxDate)}}
      </div>
      <div class="dpc-middle">
        <i :class="'qi-'+item.iconDay"/>
      </div>
      <div class="dpc-right">

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
   overflow-y: auto;
   font-weight: bold;
   color: white;
   text-shadow: 1px 1px 30px rgba(0, 0, 0, 0.7);
 }
 .dpcMain > div{
   display: flex;
   flex-wrap: nowrap;
   height: 46px;
   border-bottom: 1px solid white;
 }
 .dpcMain:last-child{
   border-bottom: none;
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
   background-color: aqua;
 }
</style>