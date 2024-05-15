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
import controller from './controller/controller.vue'

import {useWeatherIndicesStore} from "../store/weatherIndicesEditor";
import {useAstronomyStore} from "../store/astronomyEditor";
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
const astronomyStore = useAstronomyStore()

interface ListItem {
  value: string
  label: string
}
let locationOptions = ref<ListItem[]>([])                                                     //模糊搜索返回的地址信息
let tempLocation = ref<{value:string,label:string}>({value:'',label:''})                      //临时地址代号
let locationVal = ref<{value:string,label:string}>({value:'',label:''})                       //用户选中的地址代号
let locationName = ref<string>('')                                                            //用户选中的地址名称
let loadingLocation = ref<boolean>(false)                                                     //是否正在获取地址模糊搜索信息

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
  weatherIndicesStore.updateUvi(tempLocation.value.value)
  astronomyStore.updateMoonPhase(tempLocation.value.value)
  locationName.value = tempLocation.value.label
  getWeatherWarning(tempLocation.value.value)
}

//推送灾害预警
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
      commonUtils.pushNotification(temp,8000)
    }
  })
}

const toTips = () => {
  router.push('/tips')
}
</script>

<template>
  <div class="home-wrap">
    <div class="home-main">
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
              style="float:left; position: relative; left: 15px"
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
            <img src="/src/assets/pic/highest_temp.png" alt="" class="tempIcon">
            <span class="tempBody">{{weatherStore.daysWeather_10[0].tempMax}}°</span>
            <img src="/src/assets/pic/lowest_temp.png" alt="" class="tempIcon">
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
    <controller></controller>
  </div>
</template>

<style scoped>
  ::-webkit-scrollbar{
    display: none;
  }
  body {
    background-size: cover;
    margin: 0;
    padding: 0;
  }
  .tempIcon{
    width: 20px;
    height: 20px;
  }
  .el-select{
    margin-left: 10px;
    margin-top: 10px;
    background-color: rgba(255,255,255,0.3);
  }
  .home-wrap{
    width: 100vw;
    height: 100vh;
    background:url("../assets/pic/bg.png") top right no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .home-main{
    width: 80vw;
    height: 80vh;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.1);
    min-width: 80vw;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
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
    color: rgba(255, 255, 255, 0.5);
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
    display: grid;
    grid-template-rows: repeat(4,180px);
    grid-template-columns: repeat(6,180px);
    grid-gap: 15px;
    padding-bottom: 10px;
  }
  .home-bottom > div{
    border-radius: 8px;
    background-color: rgba(255,255,255,0.1);
    overflow: hidden;
  }
  .bottom-ct1{
    grid-column: 1/5;
    grid-row: 1/2;
    cursor: pointer;
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
    cursor: pointer;
  }
  .bottom-ct5{
    grid-column: 4/5;
    grid-row: 2/3;
  }
  .bottom-ct6{
    grid-column: 3/4;
    grid-row: 3/4;
    cursor: pointer;
  }
  .bottom-ct7{
    grid-column: 4/5;
    grid-row: 3/4;
  }
  .bottom-ct8{
    grid-column: 5/6;
    grid-row: 3/4;
    cursor: pointer;
  }
  .bottom-ct9{
    grid-column: 6/7;
    grid-row: 3/4;
    cursor: pointer;
  }
  .bottom-ct10{
    grid-column: 3/4;
    grid-row: 4/5;
    cursor: pointer;
  }
  .bottom-ct11{
    grid-column: 4/5;
    grid-row: 4/5;
    cursor: pointer;
  }
  .bottom-ct12{
    grid-column: 5/6;
    grid-row: 4/5;
    cursor: pointer;
  }
  .bottom-ct13{
    grid-column: 6/7;
    grid-row: 4/5;
    cursor: pointer;
  }
</style>