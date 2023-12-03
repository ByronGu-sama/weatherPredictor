<script setup lang="ts">
import {ref, unref} from "vue";
import {useWeatherIndicesStore} from "../../store/weatherIndicesEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import uviGraph from './uviGraph.vue'

let render = ref(false)
let barWrap = ref<HTMLElement>()
let bodyRef = ref()
const popoverRef = ref()
const weatherIndicesStore = useWeatherIndicesStore()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

//根据紫外线强度返回防护建议
const defenseTip = (level:string) => {
  switch (level){
    case '1':
    case '2':
      return '紫外线弱,做好一般防晒'
    case '3':
      return '紫外线强度中等,减少出门'
    case '4':
      return '紫外线较强,做好物理防晒'
    case '5':
      return '紫外线强,避免户外活动'
  }
}

//计算指示点左边距
const calcMargin = (level:string) => {
  let barWidth = barWrap.value?.clientWidth
  return 12.5*(parseInt(level)-1)/50*(barWidth!-6)+'px'
}
</script>

<template>
  <div class="module-main" v-if="weatherIndicesStore.uviIndex?.level">
    <div class="uvi-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <i class="qi-100"></i>&nbsp;紫外线指数
      </div>
      <div class="uviBody-middle">
        <div class="uviBody-middle-top">
          <span style="font-size: 20px;margin-left: 15px">{{weatherIndicesStore.uviIndex.level}}</span>
          <br>
          <span style="font-size: 25px;margin-left: 10px">{{weatherIndicesStore.uviIndex.category}}</span>
        </div>
        <div class="uviBody-middle-bottom">
          <div class="uviBody-middle-bar" ref="barWrap">
            <div class="uviIndicator" :style="{marginLeft:calcMargin(weatherIndicesStore.uviIndex.level)}"></div>
          </div>
        </div>
      </div>
      <div class="bottom-tips">
        <span>{{defenseTip(weatherIndicesStore.uviIndex.level)}}</span>
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
        <el-scrollbar :max-height="400">
          <div class="vis-popup">
            <div class="vis-popup-middle">
              <uviGraph width="320px" height="400px" :render="render"></uviGraph>
            </div>
            <el-divider />
            <div class="vis-popup-bottom">
              <span class="popup-title">关于紫外线强度</span>
              <br>
              <span class="popup-tips">通常规定，夜间紫外线指数为0，在热带或高原地区、晴天无云时紫外线最强。紫外线指数值越大，表示紫外线辐射对人体危害越大，也表示在较短时间内对皮肤的伤害愈强。</span>
            </div>
          </div>
        </el-scrollbar>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>
.uvi-main{
  width: 100%;
  height: 100%;
}
.uviBody-middle{
  width: 100%;
  height: calc(100% - 60px);
}
.uviBody-middle-top{
  width: 100%;
  height: 70%;
  text-align: left;
  font-weight: bold;
}
.uviBody-middle-bottom{
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.uviBody-middle-bar{
  width: 90%;
  height: 6px;
  border-radius: 3px;
  background: -webkit-linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  background: -moz-linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  background: -o-linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  background: linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  display: flex;
  align-items: center;
}
.uviIndicator{
  background-color: white;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  transition: 0.1s linear;
}
</style>