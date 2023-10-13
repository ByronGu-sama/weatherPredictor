<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import visGraph from './visGraph.vue'
import {ref, unref} from "vue";

const weatherStore = useWeatherStore()
let bodyRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
//判断能见度
const determineVisibility = (vis:any) => {
  vis = parseInt(vis)
  switch (vis){
    case vis < 1:
      return '能见度几乎为零'
    case vis < 10:
      return '能见度差'
    case vis < 15:
      return '能见度较差'
    case vis < 20:
      return '能见度一般'
    case vis < 25:
      return '能见度好'
    default:
      return '能见度极好'
  }
}

</script>

<template>
  <div class="module-main" v-if="weatherStore.weather">
    <div class="test-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <img src="../../assets/icons/visibility.svg" style="width: 13px;height: 13px">&nbsp;能见度
      </div>
      <div class="visibility-middle">
        {{weatherStore.weather.vis}}公里
      </div>
      <div class="visibility-bottom">
        {{determineVisibility(weatherStore.weather.vis)}}
      </div>
    </div>

    <el-popover
        ref="popoverRef"
        :virtual-ref="bodyRef"
        trigger="click"
        placement="left"
        virtual-triggering
        width="260"
        transition="el-fade-in-linear"
    >
      <el-scrollbar :max-height="260">
        <div class="vis-popup">
          <div class="vis-popup-top">

          </div>
          <div class="vis-popup-middle">
            <visGraph width="230px" height="230px"></visGraph>
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
.test-main{
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