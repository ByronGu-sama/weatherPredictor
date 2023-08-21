<script setup lang="ts">
import hourlyWeatherPredictor from './hourlyPredictor/hourlyWeatherPredictorComponent.vue'
import daysWeatherPredictor from './daysPredictor/daysPredictorComponent.vue'
import uvi from './uvi/uvi.vue'
import windDirection from './windDirection/windDirection.vue'
import pressure from './pressure/pressure.vue'
import apparentTemp from './apparentTemp/apparentTemp.vue'
import humidity from './humidity/humidity.vue'
import visibility from './visibility/visibility.vue'

import {onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import request from "../request/Url.ts";
import axios from "axios";

interface ListItem {
  value: string
  label: string
}
let locationOptions = ref<ListItem[]>([])                                                     //模糊搜索返回的地址信息
let tempLocation = ref<{value:string,label:string}>({value:'',label:''})                      //临时地址代号
let locationVal = ref<{value:string,label:string}>({value:'',label:''})                       //用户选中的地址代号
let locationName = ref<string>('')                                                            //用户选中的地址名称
let loadingLocation = ref<boolean>(false)                                                     //是否正在获取地址模糊搜索信息
let nowWeather = ref<any>('')                                                                 //当前天气数据
let daysPredictor = ref<any>(null)                                                            //七天天气预报

//获取定位
const getLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
      },
      err => {
        ElMessage({
          message:err.code == 1?'无法获取定位权限，请手动选择城市':err.code == 2?'获取定位失败，请手动选择城市':'获取位置超时，请手动选择城市',
          type:'warning'
        });
      }
  )
}

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

//用户手动选择位置回调函数
const changeLocation = () => {
  getNowWeather(tempLocation.value)
  get7DaysWeatherPredictor(tempLocation.value)
}

//获取实时天气数据
const getNowWeather = (location:{value:string,label:string}) => {
  locationName.value = location.label
  axios.get(`${request.GET_NOW_WEATHER}location=${location.value}`).then(res => {
    if(res.data.code == 200){
      nowWeather.value = res.data.now
      localStorage.setItem('nowWeather',JSON.stringify(res.data.now))
      locationVal.value = tempLocation.value
    }
  })
}

//获取未来七天天气预报
const get7DaysWeatherPredictor = (location:{value:string,label:string}) => {
  axios.get(`${request.GET_WEATHER_PREDICTOR_7D}location=${location.value}`).then(res => {
    if(res.data.code == 200){
      daysPredictor.value = res.data.daily
    }
  })
}

watch(() => locationVal.value,(n) => {
  localStorage.setItem('qwLocation',JSON.stringify(n))
})

onMounted(() => {
  let location = localStorage.getItem('qwLocation')
  if(location){
    locationVal.value = JSON.parse(location)
    changeLocation()
  }
})
</script>

<template>
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

      </div>

    </div>
    <div class="scrollArea">
      <div class="home-middle">
        <p style="font-size: 30px;line-height: 25px;margin: 0">我的位置</p>
        <p style="font-size: 20px;line-height: 15px;margin: 15px">{{locationName||'请选择位置'}}</p>
        <p style="font-size: 31px;line-height: 20px;margin: 15px">{{nowWeather.temp}}°</p>
        <div class="tempWrapper">
          <span class="tempTitle">最高温度</span>
          <span class="tempBody" v-if="daysPredictor">{{daysPredictor[0].tempMax}}°</span>
          <span class="tempTitle">最低温度</span>
          <span class="tempBody" v-if="daysPredictor">{{daysPredictor[0].tempMin}}°</span>
        </div>
      </div>

      <div class="home-bottom">
<!--        未来24小时天气预报-->
        <div class="bottom-ct1">
          <hourlyWeatherPredictor :code="locationVal.value" :location-name="locationVal.label"></hourlyWeatherPredictor>
        </div>

        <div class="bottom-ct2">2</div>

<!--        未来7天天气预报-->
        <div class="bottom-ct3">
          <daysWeatherPredictor :code="locationVal.value" :location-name="locationVal.label"></daysWeatherPredictor>
        </div>

<!--        紫外线强度-->
        <div class="bottom-ct4">
          <uvi :code="locationVal.value" :location-name="locationVal.label"></uvi>
        </div>

        <div class="bottom-ct5">5</div>

<!--        风向/风力-->
        <div class="bottom-ct6">
          <windDirection :code="locationVal.value" :location-name="locationVal.label"></windDirection>
        </div>

        <div class="bottom-ct7">7</div>
        <div class="bottom-ct8">8</div>

<!--        体感温度-->
        <div class="bottom-ct9">
          <apparentTemp :code="locationVal.value" :location-name="locationVal.label"></apparentTemp>
        </div>

<!--        湿度/露点-->
        <div class="bottom-ct10">
          <humidity :code="locationVal.value" :location-name="locationVal.label"></humidity>
        </div>

<!--        可见度-->
        <div class="bottom-ct11">
          <visibility :code="locationVal.value" :location-name="locationVal.label"></visibility>
        </div>

<!--        大气压强-->
        <div class="bottom-ct12">
          <pressure :code="locationVal.value" :location-name="locationVal.label"></pressure>
        </div>

        <div class="bottom-ct13">13</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  ::-webkit-scrollbar{
    display: none;
  }
  body{
    margin: 0;
    padding: 0;
  }
  .el-select{
    margin-left: 10px;
    margin-top: 10px;
    background-color: rgba(255,255,255,0.3);
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
    grid-gap: 10px;
  }
  .home-bottom > div{
    border-radius: 8px;
    background-color: rgba(255,255,255,0.2);
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