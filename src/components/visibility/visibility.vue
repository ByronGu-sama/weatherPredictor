<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import visGraph from './visGraph.vue'
import {ref, unref} from "vue";
import commonUtils from "../../utils/commonUtils";

const weatherStore = useWeatherStore()
const popoverRef = ref()
let bodyRef = ref()
let render = ref(false)

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
//判断能见度
</script>

<template>
  <div class="module-main" v-if="weatherStore.weather?.vis">
    <div class="vis-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/visibility.svg" style="width: 13px;height: 13px">&nbsp;能见度
      </div>
      <div class="visibility-middle">
        {{weatherStore.weather.vis}}公里
      </div>
      <div class="visibility-bottom">
        {{commonUtils.determineVisibility(weatherStore.weather.vis)}}
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
            <visGraph width="320px" height="300px" :render="render"></visGraph>
          </div>
          <el-divider />
          <div class="vis-popup-bottom">
            <span class="popup-title">关于能见度</span>
            <br>
            <span class="popup-tips">能见度，是指人能将目标物从背景中识别出来的最大距离。不考虑光照强度或障碍物，能见度10公里以上为良好</span>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<style scoped>
.vis-main{
  width: 100%;
  height: 100%;
}
.visibility-middle{
  width: 100%;
  height: calc(100% - 60px);
  color: white;
  font-weight: bold;
  font-size: 30px;
  text-align: left;
  margin-left: 5%;
}
.visibility-bottom{
  width: 100%;
  height: 30px;
  font-size: 13px;
  color: white;
  text-align: left;
  margin-left: 5%;
}
.vis-popup{
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.vis-popup-bottom{
  width: 98%;
  height: 100px;
}
</style>