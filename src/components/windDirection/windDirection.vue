<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";
import { ClickOutside as vClickOutside } from 'element-plus'
import windDirectionGraph from './windDirectionGraph.vue'
import windClassification from "../../utils/windClassification";
import {ref, unref} from "vue";

const weatherStore = useWeatherStore()
const popoverRef = ref()
let bodyRef = ref()
let render = ref(false)

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
</script>

<template>
  <div class="module-main" v-if="weatherStore.weather?.windScale">
    <div class="wind-main" v-click-outside="onClickOutside" ref="bodyRef">
      <div class="module-title">
        <i class="qi-2352"></i>&nbsp;风向
      </div>
      <div class="ring-body">
        <div class="ringWrap">
          <div class="wind-ring"></div>
          <div class="ring-mask">
            <span>东</span>
            <span>南</span>
            <span>西</span>
            <span>北</span>
          </div>
          <div class="arrow">
            <img src="../../assets/pic/arrow.webp" :style="{transform:`rotate(${weatherStore.weather?weatherStore.weather.wind360:'0'}deg)`}" alt="">
          </div>
          <div class="wind-dashboard" v-if="weatherStore.weather">
            {{weatherStore.weather.windScale}}级
          </div>
        </div>
      </div>
    </div>

    <el-popover
        ref="popoverRef"
        :virtual-ref="bodyRef"
        trigger="click"
        placement="left"
        virtual-triggering
        width="360"
        transition="el-fade-in-linear"
        @after-enter="render = true"
        @after-leave="render = false"
    >
      <el-scrollbar :max-height="400">
        <div class="vis-popup">
          <div class="vis-popup-middle">
            <windDirectionGraph width="330px" height="400px" :render="render"></windDirectionGraph>
          </div>
          <el-divider />
          <div class="vis-popup-bottom">
            <span class="popup-title">关于风速</span>
            <br>
            <span class="popup-tips">风速指的是单位时间内空气沿水平方向流动的距离。一般来讲，风速越大，风力等级越高，风的破坏性越大。</span>
            <el-divider />
            <span class="popup-title">蒲福风级</span>
            <br>
            <div class="windTypeWrap">

              <div class="windTypeBody">
                <div class="windTypeBody-left">级</div>
                <div class="windTypeBody-middle">描述</div>
                <div class="windTypeBody-right">公里/时</div>
              </div>

              <div class="windTypeBodyWrap" v-for="(i,index) in windClassification" :key="index">
                <div class="windTypeBody">
                  <div class="windTypeBody-left">
                    <div class="windClassificationCircle" :style="{backgroundColor:i.color}"></div>
                  </div>
                  <div class="windTypeBody-middle">
                    <span>{{i.desc}}</span>
                  </div>
                  <div class="windTypeBody-right">
                    <span>{{i.scope}}</span>
                  </div>
                </div>
                <el-divider v-show="index !== 12" />
              </div>

            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<style scoped>
.wind-main{
  width: 100%;
  height: 100%;
}
.ring-body{
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ringWrap{
  width: 70%;
  height: calc((100% + 30px)*0.7);
  position: relative;
}
.wind-ring{
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(from -.5deg, rgb(255, 255, 255) 0 1deg, transparent 0deg 90deg),
  repeating-conic-gradient(from -.5deg, rgba(255, 255, 255, 0.38) 0 1deg, transparent 0deg 2deg);
  border-radius: 50%;
  -webkit-mask-image: radial-gradient(transparent 65%, black 0);
  mask-image: radial-gradient(transparent 65%, black 0);
}
.ring-mask{
  width: 100%;
  height: 100%;
  -webkit-mask-image: none;
  mask-image: none;
}
.ring-mask span:nth-child(1){
  font-size: 12px;
  position: absolute;
  top: calc(50% - 8px);
  right: 8px;
}
.ring-mask span:nth-child(2){
  font-size: 12px;
  position: absolute;
  bottom: 6px;
  left: calc(50% - 6px);
}
.ring-mask span:nth-child(3){
  font-size: 12px;
  position: absolute;
  top: calc(50% - 8px);
  left: 8px;
}
.ring-mask span:nth-child(4){
  font-size: 12px;
  position: absolute;
  top: 6px;
  left: calc(50% - 6px);
}
.arrow{
  position: absolute;
  width: 2px;
  height: 90%;
  top: 5%;
  left: calc(50% - 8px);
}
.arrow img{
  width: 16px;
  height: 100%;
  transition: 0.1s linear;
}
.wind-dashboard{
  width: 35%;
  height: 35%;
  position: absolute;
  top: calc(32.5%);
  left: calc(32.5%);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}
.windTypeWrap{
  width: 100%;
  height: 100px;
}
.windTypeBodyWrap{
  width: 100%;
}
.windTypeBody{
  width: 100%;
  height: 30px;
  display: flex;
}
.windTypeBody > div{
  display: flex;
  align-items: center;
  justify-content: center;
}
.windTypeBody-left{
  flex: 1;
}
.windTypeBody-middle{
  flex: 3;
}
.windTypeBody-right{
  flex: 1;
}
.windClassificationCircle{
  width: 10px;
  height: 10px;
  border-radius: 5px;
  border: none;
}
.el-divider--horizontal{
  margin: 5px 0;
}
</style>