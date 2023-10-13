<script setup lang="ts">
import {ref} from "vue";
import {useWeatherIndicesStore} from "../../store/weatherIndicesEditor.ts";

let barWrap = ref<HTMLElement>()
const weatherIndicesStore = useWeatherIndicesStore()

//根据紫外线强度返回防护建议
const defenseTip = (level:string) => {
  switch (level){
    case '1':
      return '紫外线较弱,做好基础防晒'
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
  return 25*(parseInt(level)-1)/100*(barWidth!-6)+'px'
}
</script>

<template>
  <div class="module-main" v-if="weatherIndicesStore.uviIndex">
    <div class="module-title">
      <i class="qi-100"></i>&nbsp;紫外线指数
    </div>
    <div class="uviBody-middle">
      <div class="uviBody-middle-top">
        <span style="font-size: 20px;margin-left: 15px">{{weatherIndicesStore.uviIndex.level*2}}</span>
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
  </div>
</template>

<style scoped>
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