<script setup lang="ts">
import {onMounted,ref} from "vue";
import {ElMessage} from "element-plus";
import request from "../request/Url.ts";
import axios from "axios";

interface ListItem {
  value: string
  label: string
}
let locationOptions = ref<ListItem[]>([])                   //模糊搜索返回的地址信息
let locationVal = ref<{value:string,label:string}>(null)    //用户选中的地址代号
let locationName = ref<string>('')                          //用户选中的地址名称
let loadingLocation = ref<boolean>(false)                   //是否正在获取地址模糊搜索信息
let nowWeather = ref<any>('')                               //当前天气数据
let daysPredictor = ref<any>(null)                          //七天天气预报
let hourPredictor = ref<any>(null)                          //24小时天气预报

//获取定位
const getLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
      },
      err => {
        ElMessage({
          message:err.code == 1?'无法获取定位权限，请手动选择城市':err.code == 2?'获取定位失败，请手动选择城市':'获取位置超时，请手动选择城市',
          type:'warning'
        })
      }
  )
}

//获取模糊搜索定位
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
  getNowWeather(locationVal.value)
  get7DaysWeatherPredictor(locationVal.value)
  get24HaysWeatherPredictor(locationVal.value)
}

//获取实时天气数据
const getNowWeather = (location:{value:string,label:string}) => {
  locationName.value = location.label
  axios.get(`${request.GET_NOW_WEATHER}location=${location.value}`).then(res => {
    if(res.data.code == 200){
      nowWeather.value = res.data.now
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

//获取未来24小时天气预报
const get24HaysWeatherPredictor = (location:{value:string,label:string}) => {
  axios.get(`${request.GET_WEATHER_PREDICTOR_7D}location=${location.value}`).then(res => {
    if(res.data.code == 200){
      hourPredictor.value = res.data.daily
    }
  })
}

onMounted(() => {
  getLocation()
})
</script>

<template>
  <div class="home-main">
    <div class="home-top">
      <div class="home-top-left">
        <el-select
            v-model="locationVal"
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

    </div>
  </div>
</template>

<style scoped>
  body{
    margin: 0;
    padding: 0;
  }
  .el-select{
    margin-left: 10px;
    margin-top: 10px;
  }
  .home-main{
    width: 80vw;
    height: 80vh;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.2);
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
    height: 45%;
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
</style>