<script setup lang="ts">
import hourlyWeatherPredictor from './hourlyPredictor/hourlyWeatherPredictorComponent.vue'
import daysWeatherPredictor from './daysPredictor/daysPredictorComponent.vue'
import precipitation from './precipitation/precipitation.vue'
import windDirection from './windDirection/windDirection.vue'
import apparentTemp from './apparentTemp/apparentTemp.vue'
import visibility from './visibility/visibility.vue'
import tempTrend from './tempTrend/tempTrend.vue'
import moonPhase from './moonPhase/moonPhase.vue'
import pressure from './pressure/pressure.vue'
import humidity from './humidity/humidity.vue'
import trackSun from './trackSun/trackSun.vue'
import bMap from './map/bMap.vue'
import uvi from './uvi/uvi.vue'

import {useWeatherIndicesStore} from "../store/weatherIndicesEditor.ts";
import {useLocationStore} from "../store/locationEditor";
import {useWeatherStore} from "../store/weatherEditor";
import requestUtils from "../utils/requestUtils";
import commonUtils from "../utils/commonUtils";
import request from "../request/Url";
import axios from "axios";
import {ref} from "vue";
import router from "../router";

const weatherStore = useWeatherStore()
const locationStore = useLocationStore()
const weatherIndicesStore = useWeatherIndicesStore()

interface ListItem {
  value: string
  label: string
}
let locationOptions = ref<ListItem[]>([])                                                     //模糊搜索返回的地址信息
let tempLocation = ref<{value:string,label:string}>({value:'',label:''})                      //临时地址代号
let locationVal = ref<{value:string,label:string}>({value:'',label:''})                       //用户选中的地址代号
let locationName = ref<string>('')                                                            //用户选中的地址名称
let loadingLocation = ref<boolean>(false)                                                     //是否正在获取地址模糊搜索信息
let showChart = ref<boolean>(false)                                                           //显示风云图

//获取手动定位数据集
const getRemoteLocation = (val:string) => {
  if (!val)
    return
  axios.get(`${request.LOCATION_FUZZY_SEARCH}location=${val}&range=cn`).then((res) => {
    if(res.data.code == 200){
      loadingLocation.value = true
      let temp = []
      for(let i of res.data.location){
        temp.push({
          value:i.id,
          label:i.name
        })
      }
      locationOptions.value = temp
      loadingLocation.value = false
    }
  })
}

//用户手动选择位置回调函数 刷新所有天气数据
const changeLocation = () => {
  locationStore.updateLocation(tempLocation.value.value)
  weatherStore.updateNowWeather(tempLocation.value.value)
  weatherStore.update10DaysWeather(tempLocation.value.value)
  weatherStore.update24HoursWeather(tempLocation.value.value)
  weatherStore.updateHistoricalWeather(tempLocation.value.value,commonUtils.calcPreviousDays(7)!)
  weatherIndicesStore.updateUvi(tempLocation.value.value)
  locationName.value = tempLocation.value.label
  getWeatherWarning(tempLocation.value.value)
}

//获取灾害预警
const getWeatherWarning = (location:string) => {
  requestUtils.getWeatherWarning(location).then((res:any) => {
    if(res.length > 0){
      let temp = []
      for(let i of res){
        temp.push({
          title:i.title,
          content:i.text,
          type:'warning',
        })
      }
      commonUtils.pushNotification(temp,5000)
    }
  })
}

//切换显示效果
const shiftGraph = () => {
  router.push('/weatherChart')
}

const toTips = () => {
  router.push('/tips')
}
</script>

<template>
  <div class="home-wrap">
    <button @click="shiftGraph()" class="home-shift-button" style="z-index: 999">风云图</button>
    <div class="home-main" v-if="!showChart">
      <div class="home-top">
        <div class="home-top-left">
          <el-select
              v-model="tempLocation"
              filterable
              remote
              placeholder="选取所在地区"
              :remote-method="getRemoteLocation"
              :loading="loadingLocation"
              @change="changeLocation"
          >
            <el-option
                v-for="item in locationOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
            />
          </el-select>
        </div>
        <div class="home-top-middle">
        </div>
        <div class="home-top-right">
          <button @click="toTips">Tips</button>
        </div>
      </div>
      <div class="scrollArea">
        <div class="home-middle" v-if="weatherStore.weather">
          <p style="font-size: 30px;line-height: 30px;margin: 0">我的位置</p>
          <p style="font-size: 20px;line-height: 15px;margin: 15px">{{locationName||'北京'}}</p>
          <p style="font-size: 31px;line-height: 20px;margin: 15px">{{weatherStore.weather.temp}}°</p>
          <div class="tempWrapper" v-if="weatherStore.daysWeather_10">
            <span class="tempTitle">最高温度</span>
            <span class="tempBody">{{weatherStore.daysWeather_10[0].tempMax}}°</span>
            <span class="tempTitle">最低温度</span>
            <span class="tempBody">{{weatherStore.daysWeather_10[0].tempMin}}°</span>
          </div>
        </div>

        <div class="home-bottom">
  <!--        未来24小时天气预报-->
          <div class="bottom-ct1">
            <hourlyWeatherPredictor :code="locationVal.value" :location-name="locationVal.label"></hourlyWeatherPredictor>
          </div>

<!--          地图组件-->
          <div class="bottom-ct2">
            <bMap></bMap>
          </div>

  <!--        未来7天天气预报-->
          <div class="bottom-ct3">
            <daysWeatherPredictor></daysWeatherPredictor>
          </div>

  <!--        紫外线强度-->
          <div class="bottom-ct4">
            <uvi></uvi>
          </div>

  <!--        太阳轨迹-->
          <div class="bottom-ct5">
            <trackSun></trackSun>
          </div>

  <!--        风向/风力-->
          <div class="bottom-ct6">
            <windDirection></windDirection>
          </div>

  <!--        月相-->
          <div class="bottom-ct7">
            <moonPhase></moonPhase>
          </div>

  <!--        降水-->
          <div class="bottom-ct8">
            <precipitation></precipitation>
          </div>

  <!--        体感温度-->
          <div class="bottom-ct9">
            <apparentTemp></apparentTemp>
          </div>

  <!--        湿度/露点-->
          <div class="bottom-ct10">
            <humidity></humidity>
          </div>

  <!--        可见度-->
          <div class="bottom-ct11">
            <visibility></visibility>
          </div>

  <!--        大气压强-->
          <div class="bottom-ct12">
            <pressure></pressure>
          </div>

  <!--        温度趋势-->
          <div class="bottom-ct13">
            <tempTrend></tempTrend>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .m1-enter-from{
    left: -150%;
    top: -150%;
  }
  .m1-enter-active{
    animation: cloudMove1 1s;
  }
  .m1-enter-to{
    left: -20%;
    top: -40%;
  }
  .m1-leave-active{
    animation: cloudMove1 1s reverse;
  }
  .m2-enter-from{
    left: -150%;
    top: -150%;
  }
  .m2-enter-active{
    animation: cloudMove2 1s;
  }
  .m2-enter-to{
    left: -5%;
    top: -50%;
  }
  .m2-leave-active{
    animation: cloudMove2 1s reverse;
  }
  .m3-enter-from{
    left: -150%;
    top: -150%;
  }
  .m3-enter-active{
    animation: cloudMove3 1s;
  }
  .m3-enter-to{
    left: -10%;
    top: 5%;
    rotate: 10deg;
  }
  .m3-leave-active{
    animation: cloudMove3 1s reverse;
  }
  .m4-enter-from{
    right: -150%;
    top: -150%;
  }
  .m4-enter-active{
    animation: cloudMove4 1s;
  }
  .m4-enter-to{
    right: -40%;
    top: -15%;
    rotate: 10deg;
  }
  .m4-leave-active{
    animation: cloudMove4 1s reverse;
  }
  .m5-enter-from{
    right: -150%;
    top: -150%;
  }
  .m5-enter-active{
    animation: cloudMove5 1s;
  }
  .m5-enter-to{
    right: -80%;
    top: 5%;
  }
  .m5-leave-active{
    animation: cloudMove5 1s reverse;
  }
  .m6-enter-from{
    right: -150%;
    top: -150%;
  }
  .m6-enter-active{
    animation: cloudMove6 1s;
  }
  .m6-enter-to{
    right: 10%;
    top: 5%;
  }
  .m6-leave-active{
    animation: cloudMove6 1s reverse;
  }
  ::-webkit-scrollbar{
    display: none;
  }
  body{
    background:url("../assets/pic/bg.jpg") fixed no-repeat;
    background-size: cover;
    margin: 0;
    padding: 0;
  }
  .el-select{
    margin-left: 10px;
    margin-top: 10px;
    background-color: rgba(255,255,255,0.3);
  }
  .home-wrap{
    width: 100vw;
    height: 100vh;
    background:url("../assets/pic/bg.jpg") fixed no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .home-shift-button{
    width: 80px;
    height: 40px;
    position: absolute;
    right: 20px;
    top: 20px;
    background-color: transparent;
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    cursor: pointer;
    font-size: 15px;
    transition: linear 0.1s;
  }
  .home-shift-button:hover {
    color: #e3fafa;
  }
  .home-main{
    width: 80vw;
    height: 80vh;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.2);
    min-width: 80vw;
    padding-bottom: 10px;
  }
  .home-top{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 50px;
  }
  .home-top-left{
    flex: 2;
  }
  .home-top-middle{
    flex: 6;
  }
  .home-top-right{
    flex: 1;
  }
  .home-top-right button{
    height: 30px;
    border: none;
    cursor: pointer;
    background-color: transparent;
    color: rgba(255, 255, 255, 0.59);
    font-size: 16px;
    float: right;
  }
  .home-middle{
    width: 100%;
    height: 35%;
    overflow: hidden;
    color: white;
    font-weight: bold;
  }
  .tempWrapper{
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }
  .tempTitle{
    writing-mode: vertical-lr;
    letter-spacing: 2px;
    font-size: 1rem;
  }
  .tempBody{
    font-size: 28px;
    text-align: center;
    padding: 0 5px 0 5px;
  }
  .scrollArea{
    overflow-y: auto;
    height: calc(80vh - 50px);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .home-bottom {
    height: 300px;
    display: grid;
    grid-template-rows: repeat(4,180px);
    grid-template-columns: repeat(6,180px);
    grid-gap: 15px;
  }
  .home-bottom > div{
    border-radius: 8px;
    background-color: rgba(255,255,255,0.2);
    overflow: hidden;
  }
  .bottom-ct1{
    grid-column: 1/5;
    grid-row: 1/2;
  }
  .bottom-ct2{
    grid-column: 5/7;
    grid-row: 1/3;
  }
  .bottom-ct3{
    grid-column: 1/3;
    grid-row: 2/5;
  }
  .bottom-ct4{
    grid-column: 3/4;
    grid-row: 2/3;
  }
  .bottom-ct5{
    grid-column: 4/5;
    grid-row: 2/3;
  }
  .bottom-ct6{
    grid-column: 3/4;
    grid-row: 3/4;
  }
  .bottom-ct7{
    grid-column: 4/5;
    grid-row: 3/4;
  }
  .bottom-ct8{
    grid-column: 5/6;
    grid-row: 3/4;
  }
  .bottom-ct9{
    grid-column: 6/7;
    grid-row: 3/4;
  }
  .bottom-ct10{
    grid-column: 3/4;
    grid-row: 4/5;
  }
  .bottom-ct11{
    grid-column: 4/5;
    grid-row: 4/5;
  }
  .bottom-ct12{
    grid-column: 5/6;
    grid-row: 4/5;
  }
  .bottom-ct13{
    grid-column: 6/7;
    grid-row: 4/5;
  }
</style>