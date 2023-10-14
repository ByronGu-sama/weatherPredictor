<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import apparentTempGraph from './apparentTempGraph.vue'
import {ref, unref} from "vue";

const popoverRef = ref()
const weatherStore = useWeatherStore()
let bodyRef = ref()
let render = ref(false)

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
</script>
<template>
  <div class="module-main" v-if="weatherStore.weather?.feelsLike">
    <div class="AT-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/thermometer.svg" style="width: 13px;height: 13px"/>&nbsp;体感温度
      </div>
      <div class="apparentTemp-body">
        {{weatherStore.weather.feelsLike}}˚
      </div>
      <div class="bottom-tips">
        潮湿使人感觉更热
      </div>
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
      @after-enter="render = true"
      @after-leave="render = false"
  >
    <el-scrollbar :max-height="260">
      <div class="vis-popup">
        <div class="vis-popup-middle">
          <apparentTempGraph width="320px" height="300px" :render="render"></apparentTempGraph>
        </div>
        <el-divider />
        <div class="vis-popup-bottom">
          <span class="popup-title">关于体表温度</span>
          <br>
          <span class="popup-tips">体感温度就是人体通过自己的感觉器官与外界环境接触时在身体或精神上所获得的一种感受, 它与实际温度不同, 在室外往往受空气温度、空气湿度等的影响。体感温度本质上就是在其他因素的共同作用下人体对温度感觉的修正。而空气湿度以及风速都会对体感温度产生较大的影响。</span>
        </div>
      </div>
    </el-scrollbar>
  </el-popover>
</template>

<style scoped>
.AT-main{
  width: 100%;
  height: 100%;
}
.apparentTemp-body{
  width: 100%;
  height: calc(100% - 60px);
  font-size: 30px;
  text-align: left;
  text-indent: 5%;
  font-weight: bold;
}
</style>