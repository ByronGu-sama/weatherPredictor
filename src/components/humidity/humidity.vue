<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor.ts";
import humidityGraph from './humidityGraph.vue'
import {ref, unref} from "vue";
import { ClickOutside as vClickOutside } from 'element-plus'

let bodyRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
const weatherStore = useWeatherStore()
</script>

<template>
  <div class="module-main" v-if="weatherStore.hourlyWeather_24">
    <div class="humidity-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/humidity.svg" style="width: 13px;height: 13px" alt="">&nbsp;湿度
      </div>
      <div class="humidity-body" v-if="weatherStore.weather.humidity">
        {{weatherStore.weather.humidity}}%
      </div>
      <div class="bottom-tips" v-if="weatherStore.weather.dew">
        目前露点温度为{{weatherStore.weather.dew}}˚
      </div>
    </div>
    <el-popover
        ref="popoverRef"
        :virtual-ref="bodyRef"
        trigger="click"
        placement="left"
        virtual-triggering
        width="350"
        transition="el-fade-in-linear"
    >
      <el-scrollbar :max-height="260">
        <div class="humidity-popup">
          <div class="humidity-popup-top">

          </div>
          <div class="humidity-popup-middle">
            <humidityGraph width="350px" height="300px"></humidityGraph>
          </div>
          <el-divider />
          <div class="humidity-popup-bottom">
            <span class="popup-title">关于空气湿度</span>
            <br>
            <span class="popup-tips">大气湿度是指空气中的潮湿程度，它表示当时大气中水汽含量距离大气饱和的程度，一般用相对湿度百分比来表示大气湿度的程度。在一定气温下，大气中相对湿度越小，水汽蒸发也就越快；反之，大气中相对湿度越大，水汽蒸发也就越慢。</span>
            <hr>
            <span class="popup-title">露点</span>
            <br>
            <span class="popup-tips">露点受湿度影响，空气中的水分越多，露点就越高。当温度低于水的冰点时，露点称为霜点。</span>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<style scoped>
.humidity-main{
  width: 100%;
  height: 100%;
}
.humidity-body{
  width: 100%;
  height: calc(100% - 60px);
  font-size: 30px;
  color: white;
  margin-left: 5%;
  text-align: left;
  font-weight: bold;
}
</style>