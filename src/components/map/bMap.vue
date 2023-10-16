<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import mapStyle from '../../utils/custom_map_config.json'
import {useWeatherStore} from "../../store/weatherEditor";
import requestUtils from "../../utils/requestUtils";
import color from '../../utils/colorStore'
import typhoonIcon from '../../assets/pic/typhoon.png'

const weatherStore = useWeatherStore()
const center = ref({lng: 0, lat: 0});
const zoom = ref(3);
let hasTyphoon = ref(false)              //当前是否有活跃台风
let activeTyphoon = reactive<any>([])           //活跃台风列表
let track = reactive<any>([])             //台风轨迹

// 地图准备完成后的操作
const handler = () => {
  center.value.lng = 116.404;
  center.value.lat = 39.915;
  zoom.value = 3;
}

// 绘制24小时警戒线标识
const draw24 = ({el, BMap, map}:{el:any,BMap:any,map:any}) => {
  const pixel = map.pointToOverlayPixel(new BMap.Point(127, 22))
  el.style.left = pixel.x - 30 + 'px'
  el.style.top = pixel.y - 100 + 'px'
}

// 绘制48小时警戒线标识
const draw48 = ({el, BMap, map}:{el:any,BMap:any,map:any}) => {
  const pixel = map.pointToOverlayPixel(new BMap.Point(132, 22))
  el.style.left = pixel.x - 30 + 'px'
  el.style.top = pixel.y - 100 + 'px'
}

//  24小时警戒线
const polyline1 = ref({
  editing: false,
  paths: [[
    {lng:105,lat:0},
    {lng:113,lat:4.5},
    {lng:119,lat:11},
    {lng:119,lat:18},
    {lng:127,lat:22},
    {lng:127,lat:34},
  ]]
})

//  48小时警戒线
const polyline2 = ref({
  editing: false,
  paths: [[
    {lng:105,lat:0},
    {lng:120,lat:0},
    {lng:132,lat:15},
    {lng:132,lat:34}
  ]]
})

//处理活跃台风路径信息
const handleTyphoonList = () => {
  if(weatherStore.typhoonList?.length > 0){
    setTimeout(() => {
      let route = weatherStore.typhoonList

      for(let i of route){
        //测试
        if(i.id == 'NP_2314'){
          activeTyphoon.push(i)
          track.push({
            id:i.id,
            name:i.name,
            lastLocation:0,
            route:{
              editing: false,
              paths: [[]]
            }
          })
        }
      }

      for(let i = 0;i<track.length;i++){
        requestUtils.getTyphoonRoute(track[i].id).then((res:any) => {

          for(let j = 0;j<res.track.length;j++){
            track[i].route.paths[0].push({
              lng:res.track[j].lon,
              lat:res.track[j].lat
            })
            if(j == res.track.length - 1){
              track[i].lastLocation = {lng:res.track[j].lon,lat:res.track[j].lat}
            }
          }

        })
      }
      hasTyphoon.value = activeTyphoon.length != 0;
    },1000)
  }
}

onMounted(() => {
  setTimeout(() => {
    handleTyphoonList()
  },2000)
})
</script>

<template>
  <div class="map-main">
    <div class="map-top-tips" v-show="!hasTyphoon">
      <span>当前没有台风哦</span>
    </div>
    <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        class="bMap"
        :mapStyle="{styleJson:mapStyle}"
        :scroll-wheel-zoom="true"
    >

<!--      警戒线-->
      <bm-polyline :path="path" v-for="path of polyline1.paths" :key="path" stroke-color="#ff484c"></bm-polyline>
      <bm-polyline :path="path" v-for="path of polyline2.paths" :key="path" stroke-color="#00b7ff" stroke-style="dashed"></bm-polyline>

<!--      警戒线标识-->
      <bm-overlay pane="floatPane" :class="{guardLine24: true}" @draw="draw24">
        <div style="writing-mode: vertical-lr">24小时警戒线</div>
      </bm-overlay>
      <bm-overlay pane="floatPane" :class="{guardLine48: true}" @draw="draw48">
        <div style="writing-mode: vertical-lr">48小时警戒线</div>
      </bm-overlay>

      <div v-for="typhoon in track" class="track-wrap">
  <!--      台风轨迹-->
        <bm-polyline :path="route" v-for="route in typhoon.route.paths" :key="route" :stroke-color="color[Math.floor(Math.random()*18)]"></bm-polyline>

  <!--      台风循转图标-->
        <bm-marker
            :position="typhoon.lastLocation"
            :icon="{url: typhoonIcon, size: {width: 30, height: 30}}"
        ></bm-marker>

      </div>

    </baidu-map>

    <div class="map-controller">
      <img src="../../assets/icons/rain.svg" alt="" class="map-controller-icons">
      <img src="../../assets/icons/wind.svg" alt="" class="map-controller-icons">
      <img src="../../assets/icons/typhoon.svg" alt="" class="map-controller-icons">
    </div>
  </div>

</template>

<style>
  .bMap{
    width: 100%;
    height: 100%;
  }
  .BMap_cpyCtrl {
    display: none;
  }
  .anchorBL {
    display: none;
  }
  .map-main{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .map-top-tips{
    position: absolute;
    width: 100%;
    height: 24px;
    top: 0;
    left: 0;
    font-size: 14px;
    line-height: 24px;
    font-weight: bold;
    color: white;
    background-color: rgba(255, 255, 255, 0.15);
    z-index: 99;
  }
  .map-controller{
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 90px;
    border-radius: 15px;
    background-color: rgba(220, 219, 219, 0.3);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    transition: linear all 0.1s;
  }
  .map-controller-icons{
    width: 18px;
    height: 18px;
    border-radius: 9px;
    transition: linear all 0.1s;
  }
  .map-controller-icons:hover{
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
  .guardLine24 {
    position: absolute;
    width: 20px;
    height: 140px;
    line-height: 18px;
    font-size: 15px;
    overflow: hidden;
    color: #ff484c;
    text-align: center;
    padding: 10px;
  }
  .guardLine48 {
    position: absolute;
    width: 20px;
    height: 140px;
    line-height: 18px;
    font-size: 15px;
    overflow: hidden;
    color: #00b7ff;
    text-align: center;
    padding: 10px;
  }
</style>